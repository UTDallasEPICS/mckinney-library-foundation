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

          <tbody class="divide-y divide-[#c5cdd3]">
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
                    {{ getDeletedSummary(log) }}
                    <div
                      v-for="detail in getDeletedDetails(log)"
                      :key="detail.field"
                      class="ml-12"
                    >
                      <span class="font-medium">{{ detail.field }}:</span>
                      {{ detail.value }}
                    </div>
                  </div>
                  <div v-else-if="log.action === 'CREATE'">
                    <span class="font-medium">Created:</span>
                    {{ getCreatedDetails(log) }}
                  </div>
                  <div v-else-if="log.action === 'UPDATE'">
                    <div>
                      <span class="font-medium">Updated:</span>
                      {{ getUpdatedSummary(log) }}
                    </div>
                    <div
                      v-for="change in getSnapshotChanges(log.snapshot, log.recordType)"
                      :key="change.field"
                      class="ml-12"
                    >
                      <span class="font-medium">{{ change.field }}:</span>
                      {{ change.before }} → {{ change.after }}
                    </div>
                  </div>
                  <div
                    v-else
                    v-for="change in getSnapshotChanges(log.snapshot, log.recordType)"
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
} else if (session.value.user.permission < 2) {
  await navigateTo("/dashboard");
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

function getSnapshotChanges(snapshot: any, recordType?: string) {
  const before = snapshot.before || {};
  const after = snapshot.after || {};
  const fields = [...new Set([...Object.keys(before), ...Object.keys(after)])];

  return fields
    .filter(
      (field) =>
        normalizeSnapshotValue(before[field]) !==
        normalizeSnapshotValue(after[field]),
    )
    .map((field) => ({
      field: formatFieldName(field),
      before: formatSnapshotValue(before[field], "Not set", field, recordType),
      after: formatSnapshotValue(after[field], "Removed", field, recordType),
    }));
}

function normalizeSnapshotValue(value: unknown) {
  if (value == null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  return value;
}

function formatFieldName(field: string) {
  const normalizedField = String(field ?? "").trim();
  if (!normalizedField) return "Field";

  const fieldName = normalizedField.toLowerCase();
  if (fieldName === "permission" || fieldName === "role") return "Role";
  if (fieldName === "status") return "Status";

  return normalizedField
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function formatAuditDateValue(value: string | Date | null | undefined) {
  if (!value) return "Unknown time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatSnapshotValue(value: unknown, emptyLabel = "Not set", field?: string, recordType?: string) {
  if (value == null || value === "") return emptyLabel;

  const normalizedField = typeof field === "string" ? field.toLowerCase() : "";

  if (recordType === "ACCOUNT" && (normalizedField === "permission" || normalizedField === "role")) {
    const permission = Number(value);
    if (permission === 0) return "Viewer";
    if (permission === 1) return "Editor";
    if (permission === 2) return "Admin";
    if (permission === 3) return "Main Admin";
  }

  if (recordType === "ACCOUNT" && normalizedField === "status") {
    if (value === true || value === "true" || value === 1) return "Frozen";
    if (value === false || value === "false" || value === 0) return "Unfrozen";
  }

  if (normalizedField === "preferredcommunication") {
    const communicationPreference = Number(value);
    if (communicationPreference === 0) return "Phone";
    if (communicationPreference === 1) return "Email";
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return emptyLabel;

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime()) && /\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      return formatAuditDateValue(trimmed);
    }

    return trimmed;
  }

  return String(value);
}

function getDeletedSummary(log: any) {
  const before = log.snapshot?.before || {};

  if (log.recordType === "DONATION") {
    return `donation from ${before.donor || before.name || "Unknown donor"}`;
  }

  if (log.recordType === "GRANT") {
    return `grant from ${before.grantor || before.name || "Unknown grantor"}`;
  }

  if (log.recordType === "EVENT") {
    return before.eventName || "Unknown event";
  }

  return before.name || "";
}

function getDeletedDetails(log: any) {
  const before = log.snapshot?.before || {};

  return Object.entries(before)
    .filter(
      ([field, value]) =>
        !["name", "donor", "grantor", "eventName"].includes(field) &&
        value != null &&
        (typeof value !== "string" || value.trim() !== ""),
    )
    .map(([field, value]) => ({
      field: formatFieldName(field),
      value:
        field === "status" && value === 1 && log.recordType === "DONATION"
          ? "Received"
          : field === "status" && value === 0 && log.recordType === "DONATION"
            ? "Pending"
            : field === "status" && value === 1 && log.recordType === "GRANT"
              ? "Completed"
              : field === "status" && value === 0 && log.recordType === "GRANT"
                ? "Requested"
                : formatSnapshotValue(value, "Not set", field, log.recordType),
    }));
}

function getCreatedDetails(log: any) {
  const after = log.snapshot?.after || {};

  if (log.recordType === "DONATION" && after.donor) {
    const monetaryAmount = after.monetaryAmount != null && String(after.monetaryAmount).trim() !== ""
      ? String(after.monetaryAmount).trim()
      : null;
    const amounts = [
      monetaryAmount
        ? monetaryAmount.startsWith("$")
          ? monetaryAmount
          : `$${monetaryAmount}`
        : null,
      after.nonMonetaryAmount,
    ]
      .filter((amount) => amount != null && String(amount).trim() !== "")
      .join(", ");

    return amounts
      ? `donation from ${after.donor} (amount: ${amounts})`
      : `donation from ${after.donor}`;
  }

  if (log.recordType === "GRANT" && (after.grantor || after.purpose)) {
    const grantor = after.grantor || "Anonymous";
    const purpose = typeof after.purpose === "string" ? after.purpose.trim() : "";

    return purpose
      ? `grant from ${grantor} (purpose: ${purpose})`
      : `grant from ${grantor}`;
  }

  if (log.recordType === "EVENT") {
    return after.eventName || "Unknown event";
  }

  return after.name || "";
}

function getUpdatedSummary(log: any) {
  const before = log.snapshot?.before || {};
  const after = log.snapshot?.after || {};

  if (log.recordType === "DONATION") {
    return `donation from ${after.donor || before.donor || "Unknown donor"}`;
  }

  if (log.recordType === "GRANT") {
    return `grant from ${after.grantor || before.grantor || "Unknown grantor"}`;
  }

  if (log.recordType === "DONOR") {
    return after.name || before.name || "Unknown donor";
  }

  if (log.recordType === "GRANTOR") {
    return after.name || before.name || "Unknown grantor";
  }

  if (log.recordType === "EVENT") {
    return after.eventName || before.eventName || "Unknown event";
  }

  if (log.recordType === "ACCOUNT") {
    return after.name || before.name || "Unknown account";
  }

  return `${String(log.recordType || "record").toLowerCase()}${log.recordId ? ` #${log.recordId}` : ""}`;
}

function getActorName(log: any) {
  const savedActorName = log.snapshot?.actorName?.trim();
  if (savedActorName) return savedActorName;

  const name = log.user?.name?.trim();
  if (name) return name;

  const email = log.user?.email?.trim();
  if (email) return email;

  return log.userId ? "Unknown User" : "System";
}
</script>
