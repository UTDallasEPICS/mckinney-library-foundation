<script setup>
import { ref, watch, computed } from "vue";

const donations = ref([]);
const search = ref("");
const sortField = ref("name");       // default sorting
const sortDir = ref("asc");          // "asc" or "desc"
const loading = ref(false);

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// 🔹 1. Fetch from backend on search
const fetchDonations = async () => {
  loading.value = true;

  const res = await $fetch("/api/donations", {
    query: { search: search.value }
  });

  donations.value = res?.data ?? [];
  loading.value = false;
};

// 🔹 Debounce so it only fires after 300ms of no typing
const debouncedSearch = debounce(fetchDonations, 300);

watch(search, () => debouncedSearch());

// First load
fetchDonations();

// 🔹 2. Computed sorted donations
const sortedDonations = computed(() => {
  let arr = [...donations.value];

  if (sortField.value === "name") {
    arr.sort((a, b) =>
      a.donor.name.localeCompare(b.donor.name)
    );
  }

  if (sortField.value === "amount") {
    arr.sort((a, b) =>
      Number(a.monetaryAmount) - Number(b.monetaryAmount)
    );
  }

  if (sortField.value === "date") {
    arr.sort((a, b) =>
      new Date(a.receivedDate) - new Date(b.receivedDate)
    );
  }

  // Reverse for descending
  if (sortDir.value === "desc") arr.reverse();

  return arr;
});
</script>

<template>
  <div class="space-y-4">

    <!-- SORT CONTROLS -->
    <div class="flex items-center gap-4">
      <select v-model="sortField" class="border rounded px-2 py-1">
        <option value="name">Donor Name</option>
        <option value="amount">Amount</option>
        <option value="date">Date</option>
      </select>

      <button
        @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
        class="border rounded px-3 py-1"
      >
        {{ sortDir === "asc" ? "⬆️ Asc" : "⬇️ Desc" }}
      </button>
    </div>

    <!-- SEARCH INPUT -->
    <input
      v-model="search"
      placeholder="Search donations..."
      class="border rounded px-3 py-2 w-full"
    />

    <!-- TABLE -->
    <table class="w-full border mt-4">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2 border">Donor</th>
          <th class="p-2 border">Amount</th>
          <th class="p-2 border">Payment Method</th>
          <th class="p-2 border">Date</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="donation in sortedDonations"
        >
          <td class="p-2 border">{{ donation.donor.name }}</td>
          <td class="p-2 border">${{ donation.monetaryAmount }}</td>
          <td class="p-2 border">{{ donation.method }}</td>
          <td class="p-2 border">
            {{ donation.event}}
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center mt-2">
      Loading…
    </div>

  </div>
</template>
