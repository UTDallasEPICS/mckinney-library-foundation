<template> 

<donationBar/>
  <DonorTable 
    key="DonoTable"
    :data="DonorTableProps.donors" 
    :email-function="DonorTableProps.emailFunction"
    :edit-function="DonorTableProps.editFunction"
    :delete-function="DonorTableProps.deleteFunciton"
    :view-function="DonorTableProps.viewFunction"
  />
  <div  v-if="sendEmail" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EmailForm
      :name-list="emailFormProps.names"
      :email-list="emailFormProps.emails"
      :group-email="emailFormProps.groupEmail"
      :cancel-email="emailFormProps.cancelEmail"
    />
  </div>
  <div v-if="updateDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonorForm :donor-id = "donorId"  apiMethod = 'PATCH' @close = "updateDonor = false" />

  </div>
  <div v-if="viewDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
   <viewDonorForm :donor-id = "donorId" @close = "viewDonor = false"/>
   </div>
</template>

<script setup lang="ts">
import DonorTable from '~/components/Tables/DonorTable.vue';
import EmailForm from '~/components/Forms/EmailForm.vue';
import DonorForm from '~/components/Forms/DonorForm.vue';
import donationBar from '~/components/donationBar.vue';
import viewDonorForm from '~/components/Forms/viewDonorForm.vue';
import { ref } from 'vue';
const sendEmail = ref(false);
const updateDonor = ref(false);
const viewDonor = ref(false);
const {donors, getDonors} = useDonor();
const emailList: Ref<string[]> = ref([])
const nameList = ref("")

const donorId = ref("")

await getDonors();

const DonorTableProps ={
  donors:donors.value,
  emailFunction: prepEmail,
  editFunction:prepDonorUpdate,
  deleteFunciton:deleteDonor,
  viewFunction:prepDonorView
}

const emailFormProps ={
  names:nameList.value,
  emails:emailList.value,
  groupEmail:groupEmail,
  cancelEmail:cancelEmail,

}
const donorData:Ref<{id:string, name:string, organization:string, email:string, phone:string,address:string, notes:string, webLink:string, preferredCommunication:string}> = ref({
  id:"",
  name:"",
  organization:"",
  email:"",
  phone:"",
  address:"",
  notes:"",
  webLink:"",
  preferredCommunication:""
});


function cancelEmail(){
  sendEmail.value=false;
  emailList.value = [];
  nameList.value = "";
}
function cancelUpdate(){
  donorData.value = {id:"",name:"",organization:"",email:"",phone:"",address:"", notes:"",webLink:"",preferredCommunication:"",};
  updateDonor.value= false;
  viewDonor.value=false;
}


async function prepEmail(selected:boolean[]) {
  donors.value.forEach((item: { email: string; name: string; },index: number) =>{
    if(selected[index] && item.email !== ""){
      emailList.value.push(item.email);
      if(nameList.value != ""){
        nameList.value += ", " + item.name 
      }
      else{
        nameList.value += item.name
      }
        
    }
    sendEmail.value = true;
  });
}

async function prepDonorUpdate(donor:{id:string, name:string, organization:string, email:string, phone:string, address:string,webLink:string, notes:string, preferredCommunication:string}){
  donorData.value = donor;
  updateDonor.value = true;
  console.log("please show up here",donor.id)
   donorId.value = donor.id;

  console.log("donorId",donorId.value)
}

async function prepDonorView(donor:{id:string, name:string, organization:string, email:string, phone:string, address:string,webLink:string, notes:string, preferredCommunication:string}){
  donorData.value = donor;
  viewDonor.value = true;
  console.log("please show up hee",donor.id,"hi")

 donorId.value = donor.id;

  console.log("donorId",donorId.value)
}

async function editDonor(values:Record<string,any>) {
  await $fetch(`/api/donor/${values.id}`,{
    method:"PATCH",
    body:{
      name:values.fName + " " + values.lName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      preferredCommunication: values.preferredCommunication,
      notes: values.notes,
      webLink: values.webLink,
      organization: values.organization,

    }
  })
  await getDonors();
  cancelUpdate();
  reloadNuxtApp();
}

async function deleteDonor(donor:{id:string, name:string, organization:string, email:string, phone:string,address:string, firstDonationDate:Date, lastDonationDate:Date}) {
  await $fetch(`/api/donor/${donor.id}`,{
    method:"DELETE",
  })
  await getDonors();
  reloadNuxtApp();
}



async function groupEmail(values:Record<string, any>){
  await $fetch("/api/email",{
    method:"POST",
    body:{
      subject:values.Subject,
      text:values.Message,
      emails:emailList.value,
    }
  })

  sendEmail.value=false;
  emailList.value = [];
  nameList.value = "";
}
</script>