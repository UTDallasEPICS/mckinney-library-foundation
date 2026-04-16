import prisma from '~~/server/utils/prisma'
import { auth } from '~~/server/utils/auth'

export default defineEventHandler (async (event)=>{
    try{

        const session = await auth.api.getSession({ headers: event.headers });
        if (!session?.user) {
            return {
                success: false,
                statusCode: 401,
                message: 'Unauthorized',
                error: { code: 'UNAUTHORIZED' },
            };
        }

        const currentUser = session.user as { permission?: number };
        const permissionLevel = Number(currentUser.permission ?? 0);
        const id = await getRouterParam(event, 'id');
        if(permissionLevel < 1){
            return {
                success: false,
                statusCode: 403,
                message: 'User does not have permission to delete donations',
                error: { code: 'FORBIDDEN' },
            };
        }
        if(!id){
            throw createError({
                statusCode: 400,
                statusMessage: "A donationId is required to delete an ID"
            });
        }
        const deleted = await prisma.donation.delete({
            where: {id: id}
        });
        return{
            success: true,
            deleted 
        };
    }
    catch(error){
        console.log("error",error)
        return{
            success: false,
            statusCode: 500,
            message: "Failed to delete donation",
            error: error
        }
    }
})