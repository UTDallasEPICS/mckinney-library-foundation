import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client"
import { emailOTP } from "better-auth/plugins"

const {sendMail} = useNodeMailer();

const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", 
    }),
    session:{
        expiresIn: 60*60*2, //sessions expire after 2 hours
        updateAge: 60,
        cookieCache:{
            enabled: true,
            maxAge: 5 * 60
        },
    },
    user:{
        additionalFields:{
            permission:{
                type: "number",
                required: true,
                defaultValue: 0
            }
        }
    },
    plugins: [
        emailOTP({ 
            otpLength:6,
            disableSignUp: true,
            async sendVerificationOTP({ email, otp, type }) { 
                if (type === "sign-in") { 
                      try{
                          const info = await sendMail({
                              subject: "MPLF OTP",
                           text: "your one-time passcode: " + otp,
                            to: email
                         });
                         console.log("Email Sent: ", info.messageId);
                       
                      }catch(error){
                          console.error("Error Sending Email: ", error);
                     }
                } else if (type === "email-verification") { 
                   console.log("varify");
                } else { 
                    console.log("password reset");
                } 
            }, 
        }) 
    ]
});