import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    try{
        const donations = await prisma.donation.findMany({
            include: {
                boardMember: {
                    select: {
                        name: true,
                    }
                },
                donor: {
                    select: {
                        name: true,
                    }
                }
            },
        })
        return{
            success: true,
            statusCode: 200,
            data: donations,
        }
    }
    }catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to fetch donations",
            error: error,
            data:null
        }
    }
})