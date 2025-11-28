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
          <InfoBanner class = "my-5"
            image="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"
            title="Track Donations &amp; Grants"
            description="Comprehensive financial management"
          />
          <InfoBanner class = "my-5"
           image="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"
            title="Manage Donor Relationships"
            description="Build lasting community connections"
          />
          <InfoBanner class = "my-5 w-full"
            image="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z",
            title="Generate Insights &amp; Reports"
            description="Data-driven descision making"
          />  
        </div>  
      </div>    
    </div>
    <div class = "flex items-center basis-1/2" id="login">
      <div class = "bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 w-4/5 mx-auto my">
        <img src="/logo.jpg" alt="MPLF Logo" class ="h-14 mx-auto" />
        <div v-if="!reqAccount || userEmail" class = "text-center">
          <h2 class = "text-[36px] text-[#2c3e50] mb-2" style="font-weight: 700;">WELCOME!</h2>
          <p class = "text-[15px] text-[#6b7785]">Sign in to access the Donor &amp; Grant Tracker</p>
        </div>
        <div v-if="reqAccount && !userEmail">
          <h2 class = "text-[36px] text-[#2c3e50] mb-2 text-center" style="font-weight: 700;">SIGN UP!</h2>
          <p class = "text-[15px] text-[#6b7785] text-center">Fill out the form to request an account.</p>
        </div>
        <LoginForm 
          v-if="userEmail === '' && !reqAccount" 
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
        <AccReqForm
          key="loginAccReq"
          v-if="reqAccount && !userEmail"
          :function="AccReqFormProps.function"
          :type="AccReqFormProps.type"
          button-text="Request Account"

        />
        <div v-if="!userEmail">
          <span>Don't have an account? </span> 
          <button v-if="!reqAccount" @click="ShowAccountRequest" style = "font-weight: 500;" class ="hover:underline text-[14px] text-[#4a5f7a] transition-colors" type="button">Request an Invitation</button>
          <button v-if="reqAccount" @click="ShowAccountRequest" style = "font-weight: 500;" class ="hover:underline text-[14px] text-[#4a5f7a] transition-colors" type="button">Cancel Request</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from '#app';
import * as yup from 'yup';
import AccReqForm from '~/components/Forms/AccReqForm.vue';
import LoginForm from '~/components/Forms/LoginForm.vue';
import { useAuth } from '~/composables/useAuth';
import { authClient } from '~/lib/authClient';
import InfoBanner from '~/components/Banners/InfoBanner.vue';


const route = useRoute();
route.params.id

const {session, getSession} = useAuth();
await getSession();
if(session.value?.user){
    navigateTo("/dashboard");
}
const userEmail = ref("");
const reqAccount = ref(false);

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

const AccReqFormProps ={
  function: requestAccount,
  type: false,
}

async function formSubmit(values:Record<string, any>){
  userEmail.value = values.email;
   const userExists = await checkEmailExists(values.email);
    if(userExists){
      alert("otp sent to email");
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: values.email,
        type: "sign-in",
      });
      if(error){
       console.log(error);
      }
    
   }
   else{
     alert("user not found");
     userEmail.value = '';
   }
}

async function checkEmailExists(email:string){
  const id = email;
  const user = await $fetch(`/api/user/${id}`);
  if(user.data){
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
       if(error){
         console.error(error)
       }
       else{
        navigateTo("/dashboard");
       }
     }
     catch(error){
     console.error(error)
     }
   }
}

async function requestAccount(values:Record<string,any>){
    alert("account requested");
    const info = await $fetch("/api/request",{
        method: "POST",
        body:{
            name: values.fName + " " + values.lName,
            email: values.email
        }
    });
    reloadNuxtApp();
}

async function ShowAccountRequest(){
  reqAccount.value = !reqAccount.value;
}

</script>