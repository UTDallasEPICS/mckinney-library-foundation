import prisma from '~~/server/utils/prisma'
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
            (key) => !["permission", "status", "name", "email"].includes(key)
        );

        if (hasUnsupportedField) {
            throw createError({
                statusCode: 400,
                statusMessage: "Only permission, status, name, and email can be updated"
            });
        }

        const targetUser = await prisma.user.findUnique({
            where: { id },
            select: { id: true, permission: true }
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
        const nextName =
            body.name !== undefined ? String(body.name).trim() : undefined;
        const nextEmail =
            body.email !== undefined ? String(body.email).trim().toLowerCase() : undefined;

        if(
            nextPermission === undefined &&
            nextStatus === undefined &&
            nextName === undefined &&
            nextEmail === undefined
        ){
            throw createError({
                statusCode: 400,
                statusMessage: "Permission, status, name, or email is required"
            });
        }

        if ((nextName !== undefined || nextEmail !== undefined) && session.user.permission !== 3) {
            throw createError({
                statusCode: 403,
                statusMessage: "Only main admins can edit names and emails"
            });
        }

        if (nextName !== undefined && !nextName) {
            throw createError({
                statusCode: 400,
                statusMessage: "Name is required"
            });
        }

        if (nextEmail !== undefined) {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextEmail)) {
                throw createError({
                    statusCode: 400,
                    statusMessage: "A valid email is required"
                });
            }

            const emailOwner = await prisma.user.findUnique({
                where: { email: nextEmail },
                select: { id: true }
            });

            if (emailOwner && emailOwner.id !== id) {
                throw createError({
                    statusCode: 409,
                    statusMessage: "Another account already uses this email"
                });
            }
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
        if (nextName !== undefined) {
            updateData.name = nextName;
        }
        if (nextEmail !== undefined) {
            updateData.email = nextEmail;
        }

        const data = await prisma.user.update({
            where: {
                id: id,
            },
            data: updateData,
        });
        return{
            success: true,
            statusCode: 200,
            data: data
        }
    }catch(error){
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
