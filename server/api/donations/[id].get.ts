import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {

console.log("donation get router reached")
try {
    const id = getRouterParam(event, 'id');

    // console.log("id found:", id);   
    const donation = await prisma.donation.findUnique({
        where: { id },
        include: {
            donor: true,
        },
    });
    console.log("donation found:", donation);      
    return {
        success: true,
        statusCode: 200,
        data: donation, 
    }
} catch (error) {
    console.error(error);
    return { 
        success: false,
        statusCode: 500,
        message: "Failed to fetch donation",
        error: error, 
    }
} finally {
    await prisma.$disconnect()
}   

 })