<template>
<GrantBar 
  :user="user"
  :grantors="grantorTableData"
  :grants="grantsData"
/>
  <GrantorTable 
    key="GrantorTable"
    :data="GrantorTableProps.grantorTableData" 
    :email-function="GrantorTableProps.emailFunction"
    :edit-function="GrantorTableProps.editFunction"
    :delete-function="GrantorTableProps.deleteFunciton"
    :view-function="GrantorTableProps.viewFunction"
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
  <div v-if="updateGrantor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <GrantorForm
      :grantor="grantorFormData.grantor"
      :submit-grantor="editGrantor"
      :cancel-submisison="cancelUpdate"
      :view-only="false" 
      :organizations="grantorOrganizations"  
    />
  </div>
  <div v-if="viewGrantor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <GrantorForm
      :grantor="grantorFormData.grantor"
      :submit-grantor="editGrantor"
      :cancel-submisison="cancelUpdate"
      :view-only="true" 
      :organizations="grantorOrganizations"
    />
  </div> 
</template>

<script setup lang="ts">
import GrantorTable from '~/components/Tables/GrantorTable.vue';
import EmailForm from '~/components/Forms/EmailForm.vue';
import GrantorForm from '~/components/Forms/GrantorForm.vue';
import GrantBar from '~/components/Bars/GrantBar.vue'
import { useAuth } from '~/composables/useAuth';
import { useGrant } from '~/composables/useGrant';
import { useGrantorDropDown } from '~/composables/useGrantDropDowns';
import type { Grant, Grantor } from '@prisma/client';


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
const updateGrantor = ref(false);
const viewGrantor = ref(false);
const {grantors, getGrantors, putGrantor, deleteGrantor} = useGrantor();
const emailList: Ref<string[]> = ref([])
const nameList = ref("")
const grantorIndex = ref(0);

await getGrantors();

const grantorTableData:Ref<{grantor:Grantor, grants:Grant[], boardMember:{name:string} | null}[]> = ref([]);

const grantorFormData:Ref<{grantor:Grantor}> = ref({
  grantor:{
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

grantors.value.map((thisGrantor:Grantor,index:number) => {
  grantorTableData.value.push({grantor:thisGrantor,grants:grantors.value[index].grants,boardMember:grantors.value[index].boardMember})
})

const {grantorOrganizations} = useGrantorDropDown(grantorTableData.value)

const {grantsData, getGrants} = useGrant();
await getGrants();

const GrantorTableProps ={
  grantorTableData:grantorTableData.value,
  emailFunction: prepEmail,
  editFunction:prepGrantorUpdate,
  deleteFunciton:removeGrantor,
  viewFunction:prepGrantorView
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
  grantorFormData.value = {grantor:
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
  updateGrantor.value= false;
  viewGrantor.value=false;
}


async function prepEmail(selected:boolean[]) {
  grantors.value.forEach((item: { email: string; name: string; },index: number) =>{
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

async function prepGrantorUpdate(grantor:Grantor,index:number){
  grantorFormData.value.grantor = grantor;
  updateGrantor.value = true;
  grantorIndex.value = index;
}

async function prepGrantorView(grantor:Grantor){
  grantorFormData.value.grantor = grantor;
  viewGrantor.value = true;
}

async function editGrantor(values:Record<string,any>) {
  const result = await putGrantor(values,user.value)
  if(result.success && result.data){
    grantorTableData.value[grantorIndex.value].grantor={
      ...result.data,
    }
    grantorTableData.value[grantorIndex.value].boardMember = result.data.boardMember? result.data.boardMember : null
  }
  updateGrantor.value = false;
}

async function removeGrantor(grantor:Grantor,index:number) {
  const result = await deleteGrantor(grantor,user.value.permissionLevel)
  if(result.success){
    grantorTableData.value.splice(index,1);
  }else if(result.error.code == 'P2003'){
    alert("Cannot delete grantor with grants"); 
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