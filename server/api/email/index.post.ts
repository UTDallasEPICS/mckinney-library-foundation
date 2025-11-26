const {sendMail} = useNodeMailer();

export default eventHandler(async (event)=>{
    const body = await readBody(event);

    console.log(body);

    // try{
    //      if(body.permissionLevel < 2){
    //         throw createError({
    //             statusCode: 401,
    //             statusMessage:"User not authorized to send group emails"
    //         })
    //     }
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