import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const query = await getQuery(event);
    const user = await prisma.user.findUnique({
        where:{
            email: query.email?.toString()
        }
    })
    if(user?.name){
        return user;
    }
    return {name:null};
    
});