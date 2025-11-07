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
     try{
        const info = await sendMail({
            subject: "MPLF Account Request",
            text: body.email + " sent an account request for " + body.name,
            to: process.env.NUXT_NODEMAILER_EMAIL
        });
        console.log("Email Sent: ", info.messageId);      
    }catch(error){
        console.error("Error Sending Email: ", error);
    }
});