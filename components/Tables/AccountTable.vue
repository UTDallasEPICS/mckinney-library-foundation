<template>
  <DataTable
    :data="accounts"
    :columns="columns"
    :get-row-id="(account) => account.id"
    empty="No accounts found"
    container-class="max-w-7xl mx-auto"
    :ui="{ thead: 'bg-[#5a6a77]', tbody: 'bg-[#e5e9ec] [&>tr:hover]:bg-[#e5e9ec]', th: 'bg-[#5a6a77] text-white px-6 py-4 border-b-0', td: 'bg-[#e5e9ec] group-hover:bg-[#e5e9ec] border-b-0' }"
  >
    <template #permission-cell="{ row: account }">
      <select
        :disabled="account.permission >= permissionLevel && permissionLevel < 3"
        @change="updatePermission(account, Number(($event.target as HTMLSelectElement).value), $event.target as HTMLSelectElement)"
        class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-100"
      >
        <option
          v-for="role in roleOptions"
          :key="role.value"
          :value="role.value"
          :selected="String(account.permission) === role.value"
          :disabled="Number(role.value) > 1 && permissionLevel < 3"
        >
          {{ role.label }}
        </option>
      </select>
    </template>
    <template #actions="{ row: account }">
      <template v-if="account.permission < permissionLevel">
        <button
          v-if="!account.status"
          class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
          @click="freezeAccount(account)"
        >
          Freeze
        </button>
        <button
          v-else
          class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6"
          @click="freezeAccount(account)"
        >
          Unfreeze
        </button>
        <button
          class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"
          @click="deleteAccount(account.id)"
        >
          Delete
        </button>
        <button
          class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6"
          @click="editAccount(accounts.indexOf(account))"
        >
          Edit
        </button>
      </template>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import DataTable from "~/components/Tables/DataTable.vue";
import type { DataTableColumn } from "~/types/dataTable";

type Account = {
  id: string;
  name: string;
  email: string;
  permission: number;
  status: boolean;
};

const props = defineProps<{
  accounts: Account[];
  editAccount: (index: number) => void;
  permissionLevel: number;
}>();

const roleOptions = [
  { label: "Viewer", value: "0" },
  { label: "Editor", value: "1" },
  { label: "Admin", value: "2" },
  { label: "Main Admin", value: "3" },
];

const columns: DataTableColumn<Account>[] = [
  { id: "name", header: "Name", value: (account) => account.name, sortable: false, align: "center" },
  { id: "email", header: "Email", value: (account) => account.email, sortable: false, align: "center" },
  { id: "permission", header: "Role", value: (account) => account.permission, sortable: false, filterable: false, align: "center" },
];

async function updatePermission(account: Account, nextPermission: number, select: HTMLSelectElement) {
  try {
    await $fetch(`/api/user/${account.id}`, {
      method: "PATCH",
      body: {
        permission: nextPermission,
        status: account.status,
      },
    });
    account.permission = nextPermission;
  } catch (error) {
    select.value = String(account.permission);
    console.error(error);
  }
}

async function freezeAccount(account: Account) {
  const id = account.id;
  const { success } = await $fetch(`/api/user/${id}`, {
    method: "PATCH",
    body: {
      status: !account.status,
      permission: account.permission,
    },
  });
  if (success) {
    account.status = !account.status;
  }
}

async function deleteAccount(id: string) {
  const { success } = await $fetch(`/api/user/${id}`, {
    method: "DELETE",
  });
  if (success) {
    const index = props.accounts.findIndex((account) => account.id === id);

    if (index !== -1) {
      props.accounts.splice(index, 1);
    }
  }
}
</script>
