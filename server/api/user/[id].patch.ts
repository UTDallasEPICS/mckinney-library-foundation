import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const data = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            permission: body.permission,
            status: body.status,
        },
})
});