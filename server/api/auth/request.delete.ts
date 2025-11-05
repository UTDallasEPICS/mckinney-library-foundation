import {PrismaClient} from '@prisma/client'
import { stringifyQuery } from 'ufo';
import { parseQuery } from 'vue-router';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) =>{
    const query = await getQuery(event);
    await prisma.request.delete({
        where:{
            id:query.id?.toString()
        }
    })
    console.log("request deleted");
});