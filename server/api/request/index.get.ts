import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () =>{
    try{
        const data = await prisma.accountCreationRequest.findMany();
        return{
            data: data,
            sucess: true,
            statusCode:200
        }
    }catch(error){
        console.log(error);
        return{
            success: false,
            statusCode: 500,
            message: "Failed to get requests",
            error: error,
            data:null
        }
    }finally{
        await prisma.$disconnect();
    }
})