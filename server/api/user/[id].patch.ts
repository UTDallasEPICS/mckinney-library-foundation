import prisma from '~~/server/utils/prisma'
import { writeAuditLog } from "~~/server/utils/auditLog";
import { requireSession } from "~~/server/utils/requireSession";

export default defineEventHandler(async (event) =>{
    try{
        const session = await requireSession(event, 2);
        const id = getRouterParam(event, 'id');
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "User id is required"
            });
        }

        const body = await readBody(event);
        const bodyKeys = Object.keys(body ?? {});
        const hasUnsupportedField = bodyKeys.some(
            (key) => key !== "permission" && key !== "status"
        );

        if (hasUnsupportedField) {
            throw createError({
                statusCode: 400,
                statusMessage: "Only permission and status can be updated"
            });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                permission: true,
                status: true,
            }
        });

        if(!targetUser){
            throw createError({
                statusCode: 404,
                statusMessage: "User not found"
            });
        }

        const nextPermission =
            body.permission !== undefined ? Number(body.permission) : undefined;
        const nextStatus = body.status;

        if(nextPermission === undefined && nextStatus === undefined){
            throw createError({
                statusCode: 400,
                statusMessage: "Permission or status is required"
            });
        }

        if (
            nextPermission !== undefined &&
            (!Number.isInteger(nextPermission) || nextPermission < 0 || nextPermission > 3)
        ) {
            throw createError({
                statusCode: 400,
                statusMessage: "Permission level is invalid"
            });
        }

        if (session.user.permission === 2) {
            if (targetUser.permission > 1) {
                throw createError({
                    statusCode: 403,
                    statusMessage: "Admins can only modify viewer/editor accounts"
                });
            }

            if (nextPermission !== undefined && nextPermission > 1) {
                throw createError({
                    statusCode: 403,
                    statusMessage: "Admins can only set viewer/editor roles"
                });
            }
        }

        const updateData: Record<string, unknown> = {};
        if (nextPermission !== undefined) {
            updateData.permission = nextPermission;
        }
        if (nextStatus !== undefined) {
            updateData.status = nextStatus;
        }

        const data = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id },
                data: updateData,
            });

            if (
                targetUser.permission !== updatedUser.permission ||
                targetUser.status !== updatedUser.status
            ) {
                await writeAuditLog(
                    tx,
                    session.user.id,
                    "UPDATE",
                    "ACCOUNT",
                    updatedUser.id,
                    {
                        name: targetUser.name,
                        email: targetUser.email,
                        permission: targetUser.permission,
                        status: targetUser.status,
                    },
                    {
                        name: updatedUser.name,
                        email: updatedUser.email,
                        permission: updatedUser.permission,
                        status: updatedUser.status,
                    },
                );
            }

            return updatedUser;
        });
        return{
            success: true,
            statusCode: 200,
            data: data
        }
    }catch(error){
        if (error && typeof error === "object" && "statusCode" in error) {
            throw error;
        }
        const statusCode =
            typeof error === "object" && error && "statusCode" in error
                ? Number((error as { statusCode?: number }).statusCode) || 500
                : 500;
        const statusMessage =
            typeof error === "object" && error && "statusMessage" in error
                ? String((error as { statusMessage?: string }).statusMessage || "Failed to update user")
                : "Failed to update user";

        setResponseStatus(event, statusCode, statusMessage);
        console.error(error);
        return { 
            success: false,
            statusCode,
            message: statusMessage,
            error: error, 
        }
    }
});
