import { PrismaClient } from "@prisma/client"


const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {    

const users = await prisma.user.findMany()

console.log("users",users)

await prisma.user.update({ 
    where: { id: "123" }, //this is hardcoded for now but in the future 0 will be dynamic
    
    
    data: {permission: 0} //same thing this is hardcoded for now but in the future 0 will be dynamic
})


return {'users':users}


})