import {PrismaClient} from '@prisma/client'


const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const id = getRouterParam(event, 'id');
    await prisma.user.delete({
        where:{
            id:id
        }
    })
    console.log("Account deleted");
});