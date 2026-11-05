<template>
  <DataTable
    :data="requests ?? []"
    :columns="columns"
    :get-row-id="(request) => request.id"
    empty="No pending requests"
    container-class="max-w-7xl mx-auto"
    :ui="{ thead: 'bg-[#5a6a77]', tbody: 'bg-[#e5e9ec] [&>tr:hover]:bg-[#e5e9ec]', th: 'bg-[#5a6a77] text-white px-6 py-4 border-b-0', td: 'bg-[#e5e9ec] group-hover:bg-[#e5e9ec] border-b-0' }"
  >
    <template v-if="permissionLevel > 2" #actions="{ row: request }">
      <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="createAccount(request)">Accept</button>
      <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="removeRequest(request.id)">Deny</button>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';

type AccountRequest = {id: string;name: string;email: string;}

const toasts = useToast();
const props = defineProps<{
  requests: AccountRequest[] | null
  permissionLevel:number,
  accounts: {id:string, name:string, email:string, permission:number, status:boolean}[]
}>();

const columns: DataTableColumn<AccountRequest>[] = [
  { id: 'name', header: 'Name', value: (request) => request.name, sortable: false, filterable: false, align: 'center' },
  { id: 'email', header: 'Email', value: (request) => request.email, sortable: false, filterable: false, align: 'center' },
]

async function createAccount(account: AccountRequest){
  toasts.add({
    title: "Created an account for : " + account.email
  });
  const result = await $fetch("/api/user",{
    method: "POST",
    body:{
      name:account.name,
      email:account.email,
      permision: 0,
      permissionLevel:props.permissionLevel
    }
  });
  if(result.data){
    await removeRequest(account.id);
    props.accounts.push(result.data)
  }

}

async function removeRequest(id:string){
  const {success} = await $fetch(`/api/request/${id}`, {
    method: 'DELETE',
    body:{
      permissonLevel:props.permissionLevel
    }
  });
  if(success){
    const index = props.requests?.findIndex((request) => request.id === id) ?? -1;
    if(index !== -1){
      props.requests?.splice(index,1);
    }
  }

}

</script>
