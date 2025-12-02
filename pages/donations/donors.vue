<template>
<DonationBar 
  :user="user"
  :donors="donorTableData"
  :donations="donationsData"
/>
  <DonorTable 
    key="DonoTable"
    :data="DonorTableProps.donorTableData" 
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
      :donor="donorFormData.donor"
      :submit-donor="editDonor"
      :cancel-submisison="cancelUpdate"
      :view-only="false" 
      :organizations="organizations"  
    />
  </div>
  <div v-if="viewDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonorForm
      :donor="donorFormData.donor"
      :submit-donor="editDonor"
      :cancel-submisison="cancelUpdate"
      :view-only="true" 
      :organizations="organizations"
    />
  </div> 
</template>

<script setup lang="ts">
import DonorTable from '~/components/Tables/DonorTable.vue';
import EmailForm from '~/components/Forms/EmailForm.vue';
import DonorForm from '~/components/Forms/DonorForm.vue';
import DonationBar from '~/components/Bars/DonationBar.vue'
import { useAuth } from '~/composables/useAuth';
import { useDonation } from '~/composables/useDonation';
import type { Donation, Donor } from '@prisma/client';


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

const donorTableData:Ref<{donor:Donor, donations:Donation[], boardMember:{name:string} | null}[]> = ref([]);

const donorFormData:Ref<{donor:Donor}> = ref({
  donor:{
  id:"",
  boardMemberId:"",
  name:"",
  organization:"",
  email:"",
  phone:"",
  address:"",
  notes:"",
  webLink:"",
  preferredCommunication:""}
});

donors.value.map((thisDonor:Donor,index:number) => {
  donorTableData.value.push({donor:thisDonor,donations:donors.value[index].donations,boardMember:donors.value[index].boardMember})
})

const organizations: ComputedRef<string[]> = computed(() => {
    if (donorTableData) {
        const uniqueEvents = new Set(
            donorTableData.value.map(donor => donor.donor.organization).filter((organization) => organization != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})

const {donationsData, getDonations} = useDonation();
await getDonations();

const DonorTableProps ={
  donorTableData:donorTableData.value,
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

function cancelEmail(){
  sendEmail.value=false;
  emailList.value = [];
  nameList.value = "";
}
function cancelUpdate(){
  donorFormData.value = {donor:
    {id:"",
    boardMemberId:"",
    name:"",
    organization:"",
    email:"",
    phone:"",
    address:"",
    notes:"",
    webLink:"",
    preferredCommunication:"",

  }};
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

async function prepDonorUpdate(donor:Donor,index:number){
  donorFormData.value.donor = donor;
  updateDonor.value = true;
  donorIndex.value = index;
}

async function prepDonorView(donor:Donor){
  donorFormData.value.donor = donor;
  viewDonor.value = true;
}

async function editDonor(values:Record<string,any>) {
  const result = await $fetch(`/api/donor/${values.id}`,{
    method:"PATCH",
    body:{
      name:values.fName.trim() + " " + values.lName.trim(),
      boardMemberId: user.value.id,
      email: values.email? values.email.trim() : "",
      phone: values.phone? values.phone.trim(): "",
      address: values.address? values.address.trim(): "",
      preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
      notes: values.notes,
      webLink: values.webLink? values.webLink.trim(): "",
      organization: values.organization? values.organization.trim() : "",
      permissonLevel: user.value.permissionLevel
    }
  })
  if(result.success && result.data){
    donorTableData.value[donorIndex.value].donor={
      ...result.data,
    }
    donorTableData.value[donorIndex.value].boardMember = result.data.boardMember? result.data.boardMember : null
  }
  updateDonor.value = false;
}

async function deleteDonor(donor:Donor,index:number) {
  const result = await $fetch(`/api/donor/${donor.id}`,{
    method:"DELETE",
    body:{
      permissionLevel:user.value.permissionLevel
    }
  })
  if(result.success){
    donorTableData.value.splice(index,1);
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