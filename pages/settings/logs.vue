<template>
  <div class="pt-6 pb-2 px-8">
    <div class="flex items-center gap-3 max-w-7xl mx-auto">
      <button
        @click="navigateTo('/settings/accounts')"
        class="bg-white border border-gray-300 text-[#2c3e50] px-4 py-2 rounded-md font-medium hover:bg-gray-50 transition shadow-sm"
      >
        Manage Accounts
      </button>

      <button
        class="bg-[#2c3e50] text-white px-4 py-2 rounded-md font-medium shadow-sm cursor-default"
        disabled
      >
        View Audit Log
      </button>
    </div>
  </div>

  <div class="max-w-7xl mx-auto px-8 py-4">
    <div v-if="logs && logs.length > 0">
      <table class="w-full border-collapse border border-gray-300 bg-white">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="border border-gray-300 p-3">Time</th>
            <th class="border border-gray-300 p-3">User ID</th>
            <th class="border border-gray-300 p-3">Action</th>
            <th class="border border-gray-300 p-3">Record Type</th>
            <th class="border border-gray-300 p-3">Record ID</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id">
            <td class="border border-gray-300 p-3 text-sm">{{ new Date(log.createdAt).toLocaleString() }}</td>
            <td class="border border-gray-300 p-3 text-sm">{{ log.userId }}</td>
            <td class="border border-gray-300 p-3 text-sm font-bold">{{ log.action }}</td>
            <td class="border border-gray-300 p-3 text-sm">{{ log.recordType }}</td>
            <td class="border border-gray-300 p-3 text-sm">{{ log.recordId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="text-gray-500">
      No audit logs found.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { session, getSession } = useAuth();
session.value = await getSession();

if (!session.value?.user) {
  navigateTo("/");
}

const auditObj = await useFetch("/api/audit-logs");
const logs = auditObj.data.value?.data;
</script>