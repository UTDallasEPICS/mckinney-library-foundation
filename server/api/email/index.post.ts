const {sendMail} = useNodeMailer();
const sendDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function sendEmailsBackground(
    emails: string[],
    subject: string,
    text: string
) {
    for (const email of emails) {
        try {
            const info = await sendMail({
                subject,
                text,
                bcc: [email],
            });
            console.log("Sent to: ", email, info.messageId)
        } catch (error: any) {
            console.log("Failed: ", email, error?.message)
        }
        await sendDelay(300);
    }
    console.log("Finished sending emails")
}

export default eventHandler(async (event)=>{
    const body = await readBody(event);
    if(body.permissionLevel < 2){
        throw createError({
            statusCode:401,
            statusMessage:"User does not have permission to send group emails"
        })
    }
    console.log(body);

    try{
        sendEmailsBackground(
            body.emails,
            body.subject,
            body.text
        );
        return {
            success: true,
            statusCode: 200,
            message: "Emails are being sent in the background"
        };
        // const info = await sendMail({
        //     subject: body.subject,
        //     text: body.text,
        //     bcc: body.emails,
        // });
        // console.log("Email Sent: ", info.messageId);   
        // return{
        //     success: true,
        //     statusCode: 200,
        //     data: info,
        // }   
    }catch(error){
         console.error(error);
        return { 
            success: false,
            statusCode: 500,
            message: "Failed to send email",
            error: error, 
        }
    }
})