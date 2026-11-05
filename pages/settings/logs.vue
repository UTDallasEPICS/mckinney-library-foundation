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

  <div class="flex-1 px-8 pt-4 pb-8">
    <div v-if="error" class="max-w-7xl mx-auto text-[#2d3e4d]">
      Failed to load audit logs.
    </div>

    <div
      v-else-if="logs.length > 0"
      class="bg-white rounded-lg overflow-hidden max-w-7xl mx-auto"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#5a6a77] text-white">
            <tr>
              <th class="px-6 py-4 text-center text-sm">Time</th>
              <th class="px-6 py-4 text-center text-sm">User</th>
              <th class="px-6 py-4 text-center text-sm">Action</th>
              <th class="px-6 py-4 text-center text-sm">Record Type</th>
              <th class="px-6 py-4 text-center text-sm">Details</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="log in logs" :key="log.id" class="bg-[#e5e9ec]">
              <td
                class="px-6 py-4 text-[#2d3e4d] text-center whitespace-nowrap"
              >
                {{ new Date(log.createdAt).toLocaleString() }}
              </td>
              <td class="px-6 py-4 text-[#2d3e4d] text-center">
                {{ getActorName(log) }}
              </td>
              <td class="px-6 py-4 text-[#2d3e4d] text-center">
                {{ log.action }}
              </td>
              <td class="px-6 py-4 text-[#2d3e4d] text-center">
                {{ log.recordType }}
              </td>
              <td class="px-6 py-4 text-[#2d3e4d] text-left">
                <div v-if="log.snapshot">
                  <div v-if="log.action === 'DELETE'">
                    <span class="font-medium">Deleted:</span>
                    {{ getDeletedName(log.snapshot) }}
                  </div>
                  <div v-else-if="log.action === 'CREATE'">
                    <span class="font-medium">Created:</span>
                    {{ getCreatedName(log.snapshot) }}
                  </div>
                  <div
                    v-else
                    v-for="change in getSnapshotChanges(log.snapshot)"
                    :key="change.field"
                  >
                    <span class="font-medium">{{ change.field }}:</span>
                    {{ change.before }} → {{ change.after }}
                  </div>
                </div>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto text-center text-[#2d3e4d] py-4">
      No audit logs found.
    </div>

    <div
      v-if="!error && logs.length > 0"
      class="max-w-7xl mx-auto flex items-center justify-between mt-4"
    >
      <button
        @click="currentPage--"
        :disabled="currentPage <= 1"
        class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-[#2c3e50] hover:bg-[#1e2b36] text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      <span class="text-sm text-[#2d3e4d]">
        Page {{ pagination?.page ?? currentPage }} of
        {{ pagination?.totalPages ?? 0 }}
      </span>

      <button
        @click="currentPage++"
        :disabled="currentPage >= (pagination?.totalPages ?? 0)"
        class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-[#2c3e50] hover:bg-[#1e2b36] text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const { data: session } = await useAuth();

if (!session.value?.user) {
  await navigateTo("/");
}

const currentPage = ref(1);

const { data, error } = await useFetch("/api/logs", {
  query: {
    page: currentPage,
  },
  watch: [currentPage],
});

const logs = computed(() => data.value?.data ?? []);
const pagination = computed(() => data.value?.pagination);

function getSnapshotChanges(snapshot: any) {
  const before = snapshot.before || {};
  const after = snapshot.after || {};
  const fields = [...new Set([...Object.keys(before), ...Object.keys(after)])];

  return fields
    .filter((field) => before[field] !== after[field])
    .map((field) => ({
      field: formatFieldName(field),
      before: formatSnapshotValue(before[field], "Not set"),
      after: formatSnapshotValue(after[field], "Removed"),
    }));
}

function formatFieldName(field: string) {
  return field
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatSnapshotValue(value: unknown, emptyLabel = "Not set") {
  if (value == null || value === "") return emptyLabel;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function getDeletedName(snapshot: any) {
  return snapshot?.before?.name || "";
}

function getCreatedName(snapshot: any) {
  return snapshot?.after?.name || "";
}

function getActorName(log: any) {
  const name = log.user?.name?.trim();
  if (name) return name;

  const email = log.user?.email?.trim();
  if (email) return email;

  return log.userId ? "Unknown User" : "System";
}
</script>
