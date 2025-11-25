<template>
  <div class="container mx-auto px-6 py-12 max-w-full">
    <div class="mb-8">
      <h2 class="text-[#2d3e4d] mb-2">MPLF Donor Dashboard</h2>
      <p class="text-gray-600">Manage your donations, grants, and system settings</p>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        :img="DonationCardProps.img"
        :title="DonationCardProps.title"
        :description="DonationCardProps.description"
        :buttons="DonationCardProps.buttons"
        :permission-level="permission"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :img="GrantCardProps.img"
        :title="GrantCardProps.title"
        :description="GrantCardProps.description"
        :buttons="GrantCardProps.buttons"
        :permission-level="permission"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :img="SettingsCardProps.img"
        :title="SettingsCardProps.title"
        :description="SettingsCardProps.description"
        :buttons="SettingsCardProps.buttons"
        :permission-level="permission"
        @button-click="handleDashboardButtonClick"
      />
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardStat />
      <DashboardStat />
      <DashboardStat />
    </div>

    <DonationsForm v-if="showDonationForm" :permission-level="permission" @close="showDonationForm = false" />
    <GrantForm v-if="showGrantForm" @close="showGrantForm = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardCard from '~/components/Cards/DashboardCard/DashboardCard.vue'
import DashboardStat from '~/components/Banners/DashboardBanner.vue'
import DonationsForm from '~/components/Forms/DonationsForm.vue'
import GrantForm from '~/components/Forms/GrantForm.vue'
import { useAuth } from '~/composables/useAuth'
import { navigateTo } from '#app'

const { session, getSession } = useAuth()
session.value = await getSession()

const permission = ref(0);
if (session.value?.user) {
  permission.value = session.value.user.permission
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
</script>
