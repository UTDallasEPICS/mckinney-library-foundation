import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async (event) =>{
    try{
        const email = getRouterParam(event, 'id');
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        return {
            success: true,
            statusCode: 200,
            data: user, 
        };
    }catch(error){
        console.log(error);
        return{
            success: false,
            statusCode: 500,
            message: "Failed to get user",
            error: error, 
            data:null
        }
    }finally{
        await prisma.$disconnect();
    }   
});

