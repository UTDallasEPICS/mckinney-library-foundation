<!--TODO:
    - make login a separate page
    - make index the default dashboard
-->

<!--Login Page -->
<template>
  <div class = "flex min-h-screen min-w-screen">
    <div class = "basis-1/2 bg-[#34495e]" id="site_info">
      <div class="w-3/4 mx-auto">
        <div class="mt-6 mb-6 flex flex-col items-center">
          <img src="/logo.jpg" alt="MPLF Logo" class="h-24 w-48">
        </div>
        <div class = "text-center text-white">
          <h1 class ="text-[42px] mb-4 leading-tight" style ="font-weight: 700; letter-spacing: -0.5px;" >McKinney Public Library Foundation</h1>
          <p class ="text-[20px] leading-relaxed opacity-90" style="font-weight: 400;">Empowering Communities Through Knowledge &amp; Strategic Philanthropy</p>
        </div>
        <div class = "text-white">
          <LoginInfoBanner class = "my-5"
            title="Track Donations &amp; Grants"
            description="Comprehensive financial management"
          />
          <LoginInfoBanner class = "my-5"
            title="Manage Donor Relationships"
            description="Build lasting community connections"
          />
          <LoginInfoBanner class = "my-5 w-full"
            title="Generate Insights &amp; Reports"
            description="Data-driven descision making"
          />  
        </div>  
      </div>
      
    </div>
    <div class = "flex items-center basis-1/2" id="login">
      <div class = "bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 w-4/5 mx-auto my">
        <img src="/logo.jpg" alt="MPLF Logo" class ="h-14 mx-auto" />
        <div class = "text-center">
          <h2 class = "text-[36px] text-[#2c3e50] mb-2" style="font-weight: 700;">WELCOME!</h2>
          <p class = "text-[15px] text-[#6b7785]">Sign in to access the Donor &amp; Grant Tracker</p>
        </div>
        <LoginForm 
          v-if="userEmail === ''" 
          key="loginForm1" 
          :message="emailFormProps.message"
          :field-name="emailFormProps.fieldname"  
          :placeholder-txt="emailFormProps.placeholderTxt"
          :validation="emailFormProps.validation"
          :field-type="emailFormProps.fieldType"
          :function="emailFormProps.onSubmit"
        />
        <LoginForm  
          key="loginForm2" 
          v-if="userEmail !== ''"
          :message="otpFormProps.message"
          :field-name="otpFormProps.fieldname"  
          :placeholder-txt="otpFormProps.placeholderTxt"
          :validation="otpFormProps.validation"
          :field-type="otpFormProps.fieldType"
          :function="otpFormProps.onSubmit"
        />
        <!-- need to add function to this button -->
        <span>Don't have an account? </span> <button style = "font-weight: 500;" class ="text-[14px] text-[#4a5f7a] transition-colors" type="button">Request an Invitation</button>
      </div>
    </div>
      
    
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import * as yup from 'yup';
import LoginForm from '~/components/Login/LoginForm.vue';
import { authClient } from '~/lib/authClient';

const session = await useFetch("/api/auth/session");

if(session.data.value?.user){
  navigateTo("/dashboard");
}

const emailEntered = ref(false);
const userEmail = ref("");

const emailSchema = yup.object({
  email: 
    yup.string()
    .required("Email is required")
    .email("Please enter a valid email address (example@domain.com)"),
});
const otpSchema = yup.object({
  otp_code: 
    yup.string()
    .required('Code is requried')
    .min(6,"Please enter a valid code")
    .max(6,"Please enter a valid code")
    .test('type', 'Please enter a valid code', code => {
    if(!code){
      return false;
    }
    return !isNaN(Number(code)) && code.trim() !== ''
  })
});

const emailFormProps ={
  fieldname: 'email',  
  placeholderTxt: 'Enter your email',  
  fieldType: 'email',  
  message: 'Email Address',  
  validation: emailSchema,  
  onSubmit: formSubmit
}

const otpFormProps ={
  fieldname: 'otp_code',  
  placeholderTxt: 'Code',  
  fieldType: 'otp',  
  message: 'Enter Code',  
  validation: otpSchema,    
  onSubmit: checkCode,
}



async function formSubmit(values:Record<string, any>){
  userEmail.value = values.email;
   const userExists = await checkEmailExists(values.email);
   if(userExists){
     const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: values.email, // required
        type: "sign-in", // required
      });
      if(error){
       console.log(error);
      }
     emailEntered.value=true;
     alert("otp sent to email");
    
   }
   else{
     alert("user not found");
     userEmail.value = '';
   }
}

async function checkEmailExists(email:string){
  const data = await $fetch("/api/auth/user",{
    query: {
      email: email
    }
  });
  if(data.name != null){
    return true;
  }
  else{
    return false;
  }
  
}

async function checkCode(values:Record<string, any>){
   if(values.otp_code){
     try{
       const { data, error } = await authClient.signIn.emailOtp({
         email: userEmail.value,
         otp: values.otp_code.trim(), 
       });
       navigateTo("/dashboard");
       if(error){
         console.error(error)
       }
     }
     catch(error){
     console.error(error)
     }
   }
}





</script>