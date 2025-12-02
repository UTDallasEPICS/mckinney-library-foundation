<template>
  <div class="container mx-auto px-6 py-12 max-w-full">
    <div class="mb-8 text-center w-full">
      <h1 class="text-[#2d3e4d] mb-2 text-xl">MPLF Donor Dashboard</h1>
      <p class="text-gray-600 text-lg">Manage your donations, grants, and system settings</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        :img="DonationCardProps.img"
        :title="DonationCardProps.title"
        :description="DonationCardProps.description"
        :buttons="DonationCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :img="GrantCardProps.img"
        :title="GrantCardProps.title"
        :description="GrantCardProps.description"
        :buttons="GrantCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :img="SettingsCardProps.img"
        :title="SettingsCardProps.title"
        :description="SettingsCardProps.description"
        :buttons="SettingsCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardStat
        title="Total Donations"
        :value="totalDonations"
        description="All time total ammount"
      />
      <DashboardStat
        title="Total Grants"
        :value="totalGrants"
        description="All grants added"
      />
      <DashboardStat
        title="Total Donors"
        :value="totalDonors.length.toLocaleString()"
        description="Unique donors count"
      />
    </div>

    <div v-if="showDonationForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
      <DonationForm
        :submit-donation="createDonation"
        :cancel-submisison="cancelDonation"
        :view-only="false"
        :donors="donorTableData"
        :events="events"
        :methods="methods"
      />
    </div>

    <div v-if="showGrantForm">
      <GrantsForm />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardCard from '~/components/Cards/DashboardCard/DashboardCard.vue'
import DashboardStat from '~/components/Banners/DashboardBanner.vue'
import DonationForm from '~/components/Forms/DonationForm.vue'
import GrantsForm from '~/components/Forms/GrantsForm.vue'
import { useAuth } from '~/composables/useAuth'
import { useDonor } from '#imports'
import { navigateTo } from '#app'
import type { Donation, Donor } from '@prisma/client'

const { session, getSession } = useAuth()
session.value = await getSession()

const {donors, getDonors} = useDonor();
await getDonors();

const donorTableData:Ref<{donor:Donor, donations:Donation[]}[]> = ref([]);
donors.value.map((thisDonor:Donor,index:number) => {
  donorTableData.value.push({donor:thisDonor,donations:donors.value[index].donations})
})
const totalDonors = donors.value

const donationsData:Ref<{donation: Donation, donor: {name: string} | null, boardMember: {name:string} | null}[]> = ref([])
const donations = await $fetch('/api/donation');

if(donations.success && donations.data){
    const tempDonations:Ref<Donation[]> = ref([])
    donations.data.map((donation) =>{
        tempDonations.value.push({
                ...donation,
                 receivedDate: donation.receivedDate? new Date(donation.receivedDate) : null,
                lastEditDate: donation.lastEditDate? new Date(donation.lastEditDate) : null,
            }
        )

    })
    tempDonations.value.map((thisDonation:Donation, index:number) => {  
        donationsData.value.push({
            donation:{
                ...thisDonation,
                receivedDate: thisDonation.receivedDate? new Date(thisDonation.receivedDate) : null,
                lastEditDate: thisDonation.lastEditDate? new Date(thisDonation.lastEditDate) : null,
            },
            donor: donations.data[index].donor,
            boardMember:donations.data[index].boardMember            
        })
    });
}
const events: ComputedRef<string[]> = computed(() => {
    if (donationsData) {
        const uniqueEvents = new Set(
            donationsData.value.map(donation => donation.donation.event).filter((event) => event != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})
const methods: ComputedRef<string[]> = computed(() => {
    if (donationsData) {
        const uniqueEvents = new Set(
            donationsData.value.map(donation => donation.donation.method).filter((method) => method != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})



const user:Ref<{id:string, permissionLevel:number}> = ref({id:"",permissionLevel:0});
if (session.value?.user) {
  user.value.id = session.value.user.id
  user.value.permissionLevel = session.value.user.permission
}
else{
  navigateTo("/");
}

const showDonationForm = ref(false)
const showGrantForm = ref(false)

const handleDashboardButtonClick = (button: any) => {
  if (button.name === 'Add Donations') {
    showDonationForm.value = true
    return
  }
  if (button.name === 'Add Grants') {
    showGrantForm.value = true
    return
  }
  if (button.link) {
    navigateTo(button.link)
  }
}

const DonationCardProps = {
  img: { paths:["M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"], lines:[["12","12","2","22"]] },
  title: "Donations",
  description: "Manage donation records, track contributions, and view donor information.",
  buttons: [
    { name:"View Donations", link:"/donations", paths:['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'], circles:[['12','12', '3']], accessLevel:0 },
    { name:"Add Donations", paths:['M5 12h14','M12 5v14'], accessLevel:1 },
    { name:"View Donors", link:"/donations/donors", paths:['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M16 3.128a4 4 0 0 1 0 7.744', 'M22 21v-2a4 4 0 0 0-3-3.87'], circles:[['9','7','4']], accessLevel:0 }
  ]
}

const GrantCardProps = {
  img:{ paths:["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z","M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8","M16 13H8","M16 17H8"] },
  title:"Grants",
  description:"Track grant applications, manage awards, and monitor grant progress.",
  buttons: [
    { name:"View Grants", link:"/grants", paths:['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'], circles:[['12','12','3']], accessLevel:0 },
    { name:"Add Grants", paths:['M5 12h14','M12 5v14'], accessLevel:1 }
  ]
}

const SettingsCardProps = {
  img:{ paths:["M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"], circles:[["12","12","3"]] },
  title:"Settings",
  description:"Configure system settings, Manage user accounts, and control access.",
  buttons: [
    { name:"Create Accounts", link:"/settings", paths:['M5 12h14','M12 5v14'], accessLevel:3 },
    { name:"View Roles", link:"/settings/roles", paths:['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'], circles:[['12','12','3']], accessLevel:1 },
    { name:"View Accounts", link:"/settings/accounts", paths:['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M16 3.128a4 4 0 0 1 0 7.744', 'M22 21v-2a4 4 0 0 0-3-3.87'], circles:[['9','7','4']], accessLevel:2 }
  ]
}

async function createDonation(values:Record<string,any>){
    const result = await $fetch('/api/donation',{
        method:"POST",
        body:{
            donor: values.donorName,
            boardMemberId: user.value.id,
            permissionLevel:user.value.permissionLevel,
            status: values.status,
            event: values.event,
            method:values.method,
            monetaryAmount: values.monetaryAmount,
            nonMonetaryAmount: values.nonMonetaryAmount,
            notes: values.notes,
            receivedDate: values.receivedDate,
        }
    })
    if(result.success){
      alert("donation created");
    }
    showDonationForm.value = false;
}
function cancelDonation(){
    showDonationForm.value = false;
}

const donationsRes = await $fetch("/api/donation");
const donationsArray = donationsRes?.data || [];

const totalDonations = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(
  donationsArray.reduce((sum, d) => {
    const amount = parseFloat(d.monetaryAmount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0)
);

const grantsRes = await $fetch("/api/grant");
const grantsArray = grantsRes?.data || [];

const totalGrants = grantsArray.length.toLocaleString();

</script>
