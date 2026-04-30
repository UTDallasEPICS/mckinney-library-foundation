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
                statusMessage: "Only permission or status can be updated"
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

        const data = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                ...(nextPermission !== undefined ? { permission: nextPermission } : {}),
                ...(nextStatus !== undefined ? { status: nextStatus } : {}),
            },
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
