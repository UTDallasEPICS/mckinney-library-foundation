import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler (async (event)=>{
    try{
        const q = getQuery(event);
        const search = q.search?.toString() || "";
        const donations = await prisma.donation.findMany({
            where: search
                ? { 
                    OR: [
                        {
                            donor: {
                                name: {
                                    contains: search
                                }
                            }
                        },{
                            donor: {
                                phone: {
                                    contains: search
                                }
                            }
                        },{
                            donor: {
                                email: {
                                    contains: search
                                }
                            }
                        },{
                            donor: {
                                organization: {
                                    contains: search
                                }
                            }
                        },{
                            boardMember: {
                                name: {
                                    contains: search
                                }
                            }
                        }
                    ]
                }
                : {},
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
            statusCode: 200,
            data: donations,
        }
    }
    catch(error){
        return{
            success: false,
            statusCode: 500,
            message: "Failed to fetch donations",
            error: error
        }
    }finally{
        await prisma.$disconnect();
    }
})