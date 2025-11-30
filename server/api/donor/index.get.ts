import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async () =>{
    try{
        const data = await prisma.donor.findMany({
            include:{
                donations:{
                    orderBy:{
                        receivedDate: 'asc'
                    }
                }
            }
        });
        return{
            success: true,
            statusCode: 200,
            data: data,
        }
    }catch(error){
        console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to get donors",
            error: error, 
            data:null
        }
    }finally{
        await prisma.$disconnect();
    }
});

