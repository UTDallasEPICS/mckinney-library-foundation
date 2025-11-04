<template>
    <VeeForm :validation-schema="validation" @submit="submit">
        <h3>First Name</h3>
        <VeeField name="fName" placeholder="First" 
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Last Name</h3>
        <VeeField name="lName" placeholder="Last"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <h3>Email</h3>
        <VeeErrorMessage class="text-red-500" name= "email"/>
        <VeeField name="email" placeholder="Email"
        class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"/>
        <button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl"> Send Request 
        </button> 
    </VeeForm>
</template>

<script setup lang="ts">
    import * as yup from "yup";

    const props = defineProps<{
        validation:  yup.AnySchema,
    }>();
    const submit = requestAccount

    async function requestAccount(values:Record<string,any>){
        alert("account requested");
        console.log(values);
        //1. send email with confirmation link to admin -> 2. link brings up confirmation page -> 3. creates accounts 
            //1. use nodemailer, generate security token 
            //2. very simple, account info + button to accept or deny
            //3. API for account creation works so long as id can be generated
        // (account modifications should be handled in settings by admin/main admin)
    }

/*ALT OPTION
    make a page that shows account requests
    just send admin an email that there was a request made by [info], still have to log on to approve?
    think this is easier and more secure but we'll see

    required files for both: APIs for request creation and retrival, API to create a user, page for showing request(s) restricted to op2? main admin access : token
                             way to store outstanding requests in database
*/
    const {sendMail} = useNodeMailer();

    try{
        const info = sendMail({
        subject: "test",
        text: "a link eventually", // {siteURL}/page_for_confirmations?some_security_token_probably
        to: "admin@email.com" // should be the same as sender for now
        })
        console.log("Email Sent: ", info);
    }catch(error){
        console.error("Error Sending Email: ", error);
    }


    

</script>