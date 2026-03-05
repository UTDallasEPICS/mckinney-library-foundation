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
                },
                boardMember:{
                    select: {
                        name:true
                    }
                },

                _count: {
                    select: {
                        donations: {
                            where: {
                                status: 1,
                                donorId: {not: null}
                            }
                        }
                    }
                }
                
            }
        });

        const flattenedData = data.map((donor) => {
            const { _count, ...donorWithoutCount } = donor;
            return {
                ...donorWithoutCount, 
                donationCount: _count.donations
            }
        });


        return{
            success: true,
            statusCode: 200,
            data: flattenedData,
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

