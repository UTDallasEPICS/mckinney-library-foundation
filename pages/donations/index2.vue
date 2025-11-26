<template>
    <donationBar/>

    <input
        v-model="search"
        placeholder="Search donations..."
        class="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-sm"
    /> 
    
    <button @click="toggleAlphabetSort">
        Sort {{ alphabetSort || "none" }}
    </button>


    <DonationsTable2 :donation-info = "donations"/>
 
    <!--FilterBox/>
    <test/>
    <p>sup cruzz</p--> 

</template>

<script setup lang="ts">
import DonationsTable2 from '~/components/Tables/DonationsTable2.vue';
import { ref,onMounted } from 'vue';

function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
) {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

interface Donor {
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  address: string | null;
  lastDonationDate: Date | null;
  firstDonationDate: Date | null;
}

interface BoardMember {
  name: string;
}


interface Donation {
  id: string;
  boardMemberId: string | null;
  donorId: string | null;
  event: string | null;
  method: string | null;
  monetaryAmount: string | null;
  nonMonetaryAmount: string | null;
  status: number;
  notes: string | null;
  receivedDate: string | null;
  lastEditDate: string | null;

  boardMember: BoardMember | null;
  donor: Donor | null;
}

const alphabetSort = ref<"" | "a-z" | "z-a">("");
const search = ref("")
const donations = ref()

const getDonations = async () => {
    try { 
        const response = await $fetch('/api/donations',{
            method:"GET",
            query: { search: search.value }
        })

        donations.value = response

    console.log("response",response)
    }catch(err) { 
    console.log("error",err)
    }
}

const debouncedSearch = debounce(getDonations, 300);

watch(search, () => debouncedSearch());

onMounted(() => { 
    getDonations()
});

function toggleAlphabetSort() {
    if (alphabetSort.value === "") {
        alphabetSort.value = "a-z";
    } else if (alphabetSort.value === "a-z") {
        alphabetSort.value = "z-a";
    } else {
        alphabetSort.value = "";
    }

    console.log("line 1 reached");
    applyAlphabetSort();
}

function applyAlphabetSort() {
    console.log("line 2 reached");
    if (alphabetSort.value === "a-z") {
        donations.value.sort((a: Donation, b: Donation) =>
            (a.donor?.name ?? "").localeCompare(b.donor?.name ?? "")
        );
    }
    else if (alphabetSort.value === "z-a") {
        donations.value.sort((a: Donation, b: Donation) =>
            (b.donor?.name ?? "").localeCompare(a.donor?.name ?? "")
        );
    }
    else {
        // No sort — optional, depending on whether you want to re-fetch or leave as-is
        // You can also store and restore original order if needed
    }
}

</script>