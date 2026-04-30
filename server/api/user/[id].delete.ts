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

        if (session.user.permission === 2 && targetUser.permission > 1) {
            throw createError({
                statusCode: 403,
                statusMessage: "Admins can only delete viewer/editor accounts"
            });
        }

        const user = await prisma.user.delete({
            where:{
                id:id
            }
        })
        return{
            success: true,
            statusCode: 200,
            data: user
        }
    }catch(error){
        console.log(error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete user",
            error: error, 
        }
    }
});
