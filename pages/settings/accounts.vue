<template>
<div class="pt-6 pb-2 px-8">
  <div class="flex items-center gap-3 max-w-7xl mx-auto">
  <button
    class="bg-[#2c3e50] text-white px-4 py-2 rounded-md font-medium shadow-sm cursor-default form-button"
    disabled
  >
    Manage Accounts
  </button>
  <button
    class="disabled:bg-slate-330 disabled:cursor-default bg-white border border-gray-300 text-[#2c3e50] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition shadow-sm form-button"
    :disabled="permissionLevel < 1"
    @click="navigateTo('/settings/roles')"
  >
    View Roles
  </button>
  <button
    :disabled="permissionLevel < 2"
    @click="navigateTo('/settings/logs')"
    class="disabled:bg-slate-330 disabled:cursor-default bg-white border border-gray-300 text-[#2c3e50] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition shadow-sm form-button"
  >
    View Audit Log
  </button>
  </div>
</div>

 <AccountTable v-if="users && users.length > 0"
  key= "ExistingAccounts"
  :accounts="users"
  :add-account="addAccount"
  :edit-account="PrepEditAccount"
  :user-email="userEmail"
  :permission-level="permissionLevel"
/>
<div v-if="showAdd" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
  <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
    <div class="w-[800px] max-h-[130vh] overflow-y-auto mx-4">
      <h1 class="form-title mt-4">Add Account</h1>
      <AccountForm
      :function="createAccount"
      button-text="Create Account"
      :type="false"
      :account="user"
      :cancel-function="cancelFunction"
    />
    </div>
  </div>
</div>
<div v-if="showEdit" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
  <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
    <div class="w-[800px] max-h-[130vh] overflow-y-auto mx-4">
      <h1 class="form-title mt-4">Edit Account</h1>
      <AccountForm
      :function="editAccount"
      button-text="Save"
      :type="true"
      :account="user"
      :cancel-function="cancelFunction"
    />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AccountTable from '~/components/Tables/AccountTable.vue';
import AccountForm from '~/components/Forms/AccountForm.vue';
import { useAuth } from '~/composables/useAuth';

const { data: session } = await useAuth();
const toasts = useToast();

const permissionLevel = ref(0);
const userEmail = ref("");

if(session.value?.user){
  permissionLevel.value = session.value.user.permission;
  userEmail.value = session.value.user.email;
}
else{
  await navigateTo("/");
}

const showAdd = ref(false);
const showEdit = ref(false);

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
async function addAccount(){
  showAdd.value = true;
}
async function createAccount(values:Record<string,any>){
    toasts.add({
      title: "Account created!"
    });
    const info = await $fetch("/api/user",{
        method: "POST",
        body:{
            name: values.fName + " " + values.lName,
            email: values.email.toLowerCase(),
            permission: parseInt(values.permission),
            permissionLevel:permissionLevel.value
        }
    });
    cancelFunction();
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
    cancelFunction();
  }catch(error:any){
    toasts.add({
      title: error?.data?.message ?? "Failed to update account",
      color: "error"
    });
  }
}
function cancelFunction(){
  user.value={id:"",name:"",email:"",permission:0}
  showAdd.value=false
  showEdit.value=false
}
</script>