const {sendMail} = useNodeMailer();

export default eventHandler(async (event)=>{
    const body = await readBody(event);
    if(body.permissionLevel < 2){
        throw createError({
            statusCode:401,
            statusMessage:"User does not have permission to send group emails"
        })
    }
    console.log(body);

    // try{         commented out to prevent attempts to send emails to addresses that dont exist/we don't have access to
        // if(body.permissionLevel < 2){
        //     throw createError({
        //         statusCode:401,
        //         statusMessage:"User does not have permission to send group emails"
        //     })
        // }
    //     const info = await sendMail({
    //         subject: body.subject,
    //         text: body.text,
    //         bcc: body.emails,
    //     });
    //     console.log("Email Sent: ", info.messageId);   
    //     return{
    //         success: true,
    //         statusCode: 200,
    //         data: info,
    //     }   
    // }catch(error){
    //      console.error(error);
    //     return { 
    //         success: false,
    //         statusCode: 500,
    //         message: "Failed to send email",
    //         error: error, 
    //     }
    // }
})