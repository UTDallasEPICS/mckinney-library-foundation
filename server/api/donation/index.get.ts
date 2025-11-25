import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async ()=>{
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
                    email: true,
                    phone: true,
                    organization: true,
                    address: true,
                    lastDonationDate: true,
                    firstDonationDate: true
                }
            }
        },
    })
    return{
        success: true, 
        donations
    }
    }catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to fetch donations",
            error: error
        }
    }
})