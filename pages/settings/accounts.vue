<template>
<h1 class="text-[36px] text-[#2c3e50] text-center py-5 mb-2"> Manage Accounts </h1>
 <AccountTable v-if="users && users.length > 0"
  key= "ExistingAccounts"
  :accounts="users"
  :edit-account="PrepEditAccount"
  :permission-level="permissionLevel"
/>
<div v-if="showEdit" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
  <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
    <div class="w-[800px] max-h-[130vh] overflow-y-auto mx-4">
      <h1 class="form-title mt-4">Edit Account</h1>
      <AccReqForm
      :function="editAccount"
      button-text="Save"
      :type="true"
      :account="user"
      :cancel-funciton="cancelEdit"
    />
    </div>
  </div>
</div>


<h1 v-if="requests && requests.length > 0 && permissionLevel > 1" class="text-[36px] text-[#2c3e50] text-center py-5 mb-2">Account Requests </h1>
<RequestTable v-if="requests && requests.length > 0 && permissionLevel > 1 && users && users.length > 0"
  key= "RequestTable"
  :requests="requests"
  :permission-level="permissionLevel"
  :accounts="users"
/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountTable from '~/components/Tables/AccountTable.vue';
import RequestTable from '~/components/Tables/RequestTable.vue';
import AccReqForm from '~/components/Forms/AccReqForm.vue';
import { useAuth } from '~/composables/useAuth';

const { data: session } = await useAuth();
const toasts = useToast();

const permissionLevel = ref(0);

if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
}
else{
  navigateTo("/");
}

const showEdit = ref(false);

const requestOBJ = await useFetch("/api/request");
const requests = requestOBJ.data.value?.data
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
}

const usersOBJ = await useFetch("/api/user");
const users = ref(usersOBJ.data.value?.data ?? []);

const user:Ref<{
    id: string;
    name: string;
    email: string;
    permission: number;}> = ref({id:"",name:"",email:"",permission:0});
const userIndex = ref(0);
async function PrepEditAccount(index:number){
  if(users){
    user.value = users.value[index];
  }
  showEdit.value=true
  userIndex.value=index;
}
async function editAccount(values: Record<string, any>){
  const name = values.fName.trim() + ' ' + values.lName.trim();
  const email = values.email.trim().toLowerCase();
  const permission = Number(values.permission);
  try{
    await $fetch(`/api/user/${user.value.id}`,{
      method:"PATCH",
      body:{
        email:email,
        name:name,
        permission:permission
      }
    })
    const account = users.value[userIndex.value];
    account.name = name;
    account.email = email;
    account.permission = permission;
    cancelEdit();
  }catch(error:any){
    toasts.add({
      title: error?.data?.message ?? "Failed to update account",
      color: "error"
    });
  }
}
function cancelEdit(){
  user.value={id:"",name:"",email:"",permission:0}
  showEdit.value=false
}
</script>