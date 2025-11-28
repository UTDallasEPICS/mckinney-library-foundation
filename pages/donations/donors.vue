<template>
<DonationBar 
  :user="user"
  :donors="donors"
/>
  <DonorTable 
    key="DonoTable"
    :data="DonorTableProps.donors" 
    :email-function="DonorTableProps.emailFunction"
    :edit-function="DonorTableProps.editFunction"
    :delete-function="DonorTableProps.deleteFunciton"
    :view-function="DonorTableProps.viewFunction"
    :permission-level="user.permissionLevel"
  />
  <div  v-if="sendEmail" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EmailForm
      :name-list="nameList"
      :email-list="emailFormProps.emails"
      :group-email="emailFormProps.groupEmail"
      :cancel-email="emailFormProps.cancelEmail"
    />
  </div>
  <div v-if="updateDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonorForm
      :donor="donorData"
      :submit-donor="editDonor"
      :cancel-submisison="cancelUpdate"
      :view-only="false" />
  </div>
  <div v-if="viewDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonorForm
      :donor="donorData"
      :submit-donor="editDonor"
      :cancel-submisison="cancelUpdate"
      :view-only="true" />
  </div> 
</template>

<script setup lang="ts">
import DonorTable from '~/components/Tables/DonorTable.vue';
import EmailForm from '~/components/Forms/EmailForm.vue';
import DonorForm from '~/components/Forms/DonorForm.vue';
import DonationBar from '~/components/Bars/DonationBar.vue'
import { useAuth } from '~/composables/useAuth';

const {session, getSession} = useAuth();
session.value = await getSession();

const user:Ref<{id:string,permissionLevel:number}> = ref({id:"",permissionLevel:0});
if(session.value?.user){
  user.value.permissionLevel = session.value.user.permission;
  user.value.id = session.value.user.id;
}
else{
  navigateTo("/");
}

const sendEmail = ref(false);
const updateDonor = ref(false);
const viewDonor = ref(false);
const {donors, getDonors} = useDonor();
const emailList: Ref<string[]> = ref([])
const nameList = ref("")
const donorIndex = ref(0);

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

async function prepDonorUpdate(donor:{id:string, name:string, organization:string, email:string, phone:string, address:string,webLink:string, notes:string, preferredCommunication:string},index:number){
  donorData.value = donor;
  updateDonor.value = true;
  donorIndex.value = index;
}

async function prepDonorView(donor:{id:string, name:string, organization:string, email:string, phone:string, address:string,webLink:string, notes:string, preferredCommunication:string}){
  donorData.value = donor;
  viewDonor.value = true;
}

async function editDonor(values:Record<string,any>) {
  const result = await $fetch(`/api/donor/${values.id}`,{
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
      permissonLevel: user.value.permissionLevel
    }
  })
  if(result.success){
    donors.value[donorIndex.value]=result.data
  }
  updateDonor.value = false;
}

async function deleteDonor(donor:{id:string, name:string, organization:string, email:string, phone:string,address:string, firstDonationDate:Date, lastDonationDate:Date},index:number) {
  const result = await $fetch(`/api/donor/${donor.id}`,{
    method:"DELETE",
    body:{
      permissionLevel:user.value.permissionLevel
    }
  })
  if(result.success){
    donors.value.splice(index,1);
  }else if(result.error.code == 'P2003'){
    alert("Cannot delete donor with donations"); 
  }
}



async function groupEmail(values:Record<string, any>){
  await $fetch("/api/email",{
    method:"POST",
    body:{
      permissionLevel:user.value.permissionLevel,
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