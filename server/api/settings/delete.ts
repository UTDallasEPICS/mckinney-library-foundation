import { PrismaClient} from "@prisma/client";


export default defineEventHandler(async (event) => { 


    try{


const prisma = new PrismaClient();

const userCount = await prisma.user.count();

console.log("userCount before delete",userCount)

const removeUser = await prisma.user.delete({
where: {id: "123"}
})

return {userCount: await prisma.user.count() }

    }
    
    
catch(err) { 

        return {error: err} 
    }


})