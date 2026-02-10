import prisma from '~~/server/utils/prisma'

export default defineEventHandler(async () =>{
    try{
        const data = await prisma.grantor.findMany({
            include:{
                grants:{
                    orderBy:{
                        receivedDate: 'asc'
                    }
                },
                boardMember: true,
            }
        });
        return{
            success: true,
            statusCode: 200,
            data: data,
            error:{code: ""}
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to get grantors",
            error: error, 
            data: null
        }
    }finally{
        await prisma.$disconnect();
    }
});

