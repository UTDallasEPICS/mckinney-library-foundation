import {PrismaClient} from '@prisma/client';
import {v4 as uuidv4} from 'uuid';


const prisma = new PrismaClient();
const {sendMail} = useNodeMailer();

export default defineEventHandler(async (event) =>{
    try{
        const body = await readBody(event);
        const request = await prisma.accountCreationRequest.create({
        data:{
             name: body.name, 
             email: body.email,
        }       
        })
        try{
            const info = await sendMail({
                subject: "MPLF Account Request",
                text: body.email + " sent an account request for " + body.name,
                to: body.email
            })
            console.log("Email Sent: ", info.messageId);  
            return{
                success: true,
                statusCode: 200,
                data: request, 
            }    
        }catch(error){
            console.error(error);
            return{
                success: false,
                statusCode: 500,
                message: "Failed to send email",
                error: error,
            }
        }
    }catch(error){
        console.log("error");
        return{
            success: false,
            statusCode: 500,
            message: "Failed to create request",
            error: error,
        }
    }finally{
        await prisma.$disconnect()
    }
})