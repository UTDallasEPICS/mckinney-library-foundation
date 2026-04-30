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

        if(nextPermission === undefined && nextStatus === undefined){
            throw createError({
                statusCode: 400,
                statusMessage: "Permission or status is required"
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
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to update user",
            error: error, 
        }
    }
});
