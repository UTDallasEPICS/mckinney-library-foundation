import prisma from '~~/server/utils/prisma'
const {sendMail} = useNodeMailer();
const sendDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function saveStatus(logId: string | undefined, email: string, status: string, error?: string) {
    if (!logId) return;
    try {
        await prisma.emailRecipient.updateMany({
            where: { emailLogId: logId, email },
            data: { status, error }
        });
    } catch (e) {
        console.error("Failed to save email status: ", e);
    }
}

async function sendEmailsBackground(
    emails: string[],
    subject: string,
    text: string,
    logId?: string
) {
    for (const email of emails) {
        try {
            const info = await sendMail({
                subject,
                text,
                bcc: [email],
            });
            console.log("Sent to: ", email, info.messageId)
            await saveStatus(logId, email, "sent");
        } catch (error: any) {
            console.log("Failed: ", email, error?.message)
            await saveStatus(logId, email, "failed", error?.message);
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
            
        let logId: string | undefined;
        if (body.recipients) {
            try {
                const log = await prisma.emailLog.create({
                    data: {
                        senderId: body.senderId,
                        recipientType: body.recipientType,
                        subject: body.subject,
                        body: body.text,
                        recipients: {
                            create: body.recipients.map((r: { id: string, name: string, email: string }) => ({
                                donorId: body.recipientType === "donor" ? r.id : null,
                                grantorId: body.recipientType === "grantor" ? r.id : null,
                                name: r.name,
                                email: r.email,
                            }))
                        }
                    }
                });
                logId = log.id;
            } catch (error) {
                console.error("Failed to save email history: ", error);
            }
        }

        sendEmailsBackground(
            body.emails,
            body.subject,
            body.text,
            logId
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