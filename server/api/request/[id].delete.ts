import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const id = getRouterParam(event, 'id');
    console.log(id)
    await prisma.request.delete({
        where:{
            id: id
        }
    })
    console.log("request deleted");
});