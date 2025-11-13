import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const email = getRouterParam(event, 'id');
    const user = await prisma.user.findUnique({
        where:{
            email: email
        }
     })
     if(user?.name){
         return user;
     }
     return {name:null};
    
});

