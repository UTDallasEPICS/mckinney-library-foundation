import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
//     const data = await prisma.user.update({
//         where: {
//             id: body.id,
//         },
//         data: {
//             permission: body.permission,
//         },
// })
    console.log("updating: " + body.name)
});