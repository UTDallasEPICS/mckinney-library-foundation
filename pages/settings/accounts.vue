<template>
<h1 class="text-[36px] text-[#2c3e50] text-center py-5 mb-2"> Manage Accounts </h1>
 <AccountTable v-if="users && users.length > 0"
  key= "ExistingAccounts"
  :accounts="users"
  :edit-account="PrepEditAccount"
/>
<div v-if="showEdit" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
  <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
    <div class="w-[800px] max-h-[130vh] overflow-y-auto mx-4">
      <h1 class="form-title mt-4">Edit Account</h1>
      <AccReqForm
      :function="editAccount"
      button-text="Save"
      :type="false"
      :account="user"
      :cancel-funciton="cancelEdit"
    />
    </div>
  </div>
  

</div>


<h1 v-if="requests && requests.length > 0" class="text-[36px] text-[#2c3e50] text-center py-5 mb-2">Account Requests </h1>
<RequestTable v-if="requests && requests.length > 0"
  key= "RequestTable"
  :requests="requests"
/>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountTable from '~/components/Tables/AccountTable.vue';
import RequestTable from '~/components/Tables/RequestTable.vue';
import AccReqForm from '~/components/Forms/AccReqForm.vue';
const showEdit = ref(false);

const requestOBJ = await useFetch("/api/request");
const requests = requestOBJ.data.value?.data
const viewRequest = ref(false);
if(requests && requests.length > 0){
  viewRequest.value = true;
}

const usersOBJ = await useFetch("/api/user");
const users = usersOBJ.data.value?.data;

const user:Ref<{
    id: string;
    name: string;
    email: string;
    permission: number;}> = ref({id:"",name:"",email:"",permission:0});
const userIndex = ref(0);
async function PrepEditAccount(index:number){
  if(users){
    user.value = users[index];
  }
  showEdit.value=true
  userIndex.value=index;
  console.log(user.value)
}
async function editAccount(values: Record<string, any>){
  const {success} = await $fetch(`/api/user/${user.value.id}`,{
    method:"PATCH",
    body:{
      email:values.email,
      name:values.fName+ ' ' + values.lName,
      permission:values.permission
    }
  })
  if(success){
    if(users){
      users[userIndex.value].name = values.fName + ' ' + values.lName;
      users[userIndex.value].email = values.email;
      users[userIndex.value].permission = values.permision
    } 
  }
  cancelEdit();
}
function cancelEdit(){
  user.value={id:"",name:"",email:"",permission:0}
  showEdit.value=false
}
</script>