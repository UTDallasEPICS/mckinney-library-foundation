import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();
const {sendMail} = useNodeMailer();

export default defineEventHandler(async (event) =>{
    const body = await readBody(event);
    
    await prisma.request.create({
        data:{
             name: body.name, 
             email: body.email,
             id: uuidv4(),
         }       
     });

});