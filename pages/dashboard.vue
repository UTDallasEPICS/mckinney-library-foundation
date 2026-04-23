<template>
  <div class="container mx-auto px-6 py-12 max-w-full">
    <div class="mb-8 text-center w-full">
      <h1 class="text-[#2d3e4d] mb-2 text-xl">MPLF Donor Dashboard</h1>
      <p class="text-gray-600 text-lg">Manage your donations, grants, and system settings</p>
    </div>

    <!-- the actual cards on the dashboard -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <DashboardCard
        :icon="DonationCardProps.icon"
        :title="DonationCardProps.title"
        :description="DonationCardProps.description"
        :buttons="DonationCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :img="EventCardProps.img"
        :title="EventCardProps.title"
        :description="EventCardProps.description"
        :buttons="EventCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
      <DashboardCard
        :icon="GrantCardProps.icon"
        :title="GrantCardProps.title"
        :description="GrantCardProps.description"
        :buttons="GrantCardProps.buttons"
        :permission-level="user.permissionLevel"
        @button-click="handleDashboardButtonClick"
      />
      <div class="lg:col-start-2">
        <DashboardCard
          :icon="SettingsCardProps.icon"
          :title="SettingsCardProps.title"
          :description="SettingsCardProps.description"
          :buttons="SettingsCardProps.buttons"
          :permission-level="user.permissionLevel"
          @button-click="handleDashboardButtonClick"
        />
      </div>
    </div>

    <!-- the totals at the bottom -->
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

    <!-- overlay forms to add stuff -->
    <div v-if="showDonationForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
      <DonationForm
        :submit-donation="createDonation"
        :cancel-submisison="cancelDonation"
        :view-only="false"
        :donors="donorTableData"
        :events="eventNames"
        :event-date-lookup="eventDateLookup"
        :methods="donationMethods"
        @request-create-event="openEventFormFromDonation"
      />
    </div>

    <div v-if="showEventForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
      <EventForm 
        :submit-event="createEvent"  
        :cancel-submisison="cancelEvent"
        :view-only="false" 
      />
    </div>

    <div v-if="showGrantForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
      <GrantForm
            :submit-grant="createGrant"
            :cancel-submisison="cancelGrant"
            :view-only="false"
            :purposes="grantPurposes"
            :grantors="grantorTableData"
            :methods="grantMethods"
        />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardCard from '~/components/Cards/DashboardCard/DashboardCard.vue'
import DashboardStat from '~/components/Banners/DashboardBanner.vue'
import DonationForm from '~/components/Forms/DonationForm.vue'
import GrantForm from '~/components/Forms/GrantForm.vue'
import EventForm from '~/components/Forms/EventForm.vue'
import { useDonationDropDown } from '~/composables/useDonationDropDown'
import { useGrantsDropDown } from '~/composables/useGrantDropDowns'
import { useEventDropDown } from '~/composables/useEventDropDown'
import { useAuth } from '~/composables/useAuth'
import { useDonor } from '~/composables/useDonor'
import { useGrant } from '~/composables/useGrant'
import { useGrantor } from '~/composables/useGrantor'
import { navigateTo } from '#app'
import type { Donation, Donor, Grant, Grantor } from '~~/server/utils/generated/prisma/browser'
import { useDonation } from '~/composables/useDonation';
import { useEvent } from '~/composables/useEvent'

const { session, getSession } = useAuth()
session.value = await getSession()
if (!session.value?.user) {
  await navigateTo("/")
}

const {donationsData, getDonations, postDonation} = useDonation();
await getDonations();

const { eventsData, getEvents, postEvent } = useEvent();
await getEvents();

const {donors, getDonors} = useDonor();
await getDonors();

const {grantsData, getGrants, postGrant} = useGrant();
await getGrants();

const {grantors , getGrantors} = useGrantor();
await getGrantors();



const donorTableData:Ref<{donor:Donor, donations:Donation[]}[]> = ref([]);
donors.value.map((thisDonor:Donor,index:number) => {
  donorTableData.value.push({donor:thisDonor,donations:donors.value[index].donations})
})

const grantorTableData:Ref<{grantor:Grantor, grants:Grant[]}[]> = ref([]);
grantors.value.map((thisGrantor:Grantor,index:number) => {
  grantorTableData.value.push({grantor:thisGrantor,grants:grantors.value[index].grants})
})


const totalDonors = donors.value

const {eventNames} = useEventDropDown(eventsData)
const {donationMethods} = useDonationDropDown(donationsData.value)
const eventDateLookup = computed<Record<string, string>>(() => {
  const lookup: Record<string, string> = {}
  eventsData.value.forEach((row) => {
    if (row.event.eventName && row.event.eventDate) {
      lookup[row.event.eventName] = row.event.eventDate.toISOString().split('T')[0] ?? ''
    }
  })
  return lookup
})

const {grantPurposes, grantMethods} = useGrantsDropDown(grantsData.value)

const user:Ref<{id:string, permissionLevel:number}> = ref({id:"",permissionLevel:0});
if (session.value?.user) {
  user.value.id = session.value.user.id
  user.value.permissionLevel = session.value.user.permission
}

// default: no forms shown
const showDonationForm = ref(false)
const showGrantForm = ref(false)
const showEventForm = ref(false)

// handling clicks
const handleDashboardButtonClick = (button: any) => {
  if (button.name === 'Add Donations') {
    showDonationForm.value = true
    return
  }
  if (button.name === 'Add Grants') {
    showGrantForm.value = true
    return
  }
  if (button.name === 'Add Events') {
    showEventForm.value = true
    return
  }
  if (button.link) {
    navigateTo(button.link)
  }
}

const DonationCardProps = {
  icon: "/icons/dollar-sign.svg",
  title: "Donations",
  description: "Manage donation records, track contributions, and view donor information.",
  buttons: [
    { name:"View Donations", link:"/donations", icon: "/icons/eye.svg", accessLevel:0 },
    { name:"Add Donations", icon:"/icons/plus.svg", accessLevel:1 },
    { name:"View Donors", link:"/donations/donors", icon: "/icons/people.svg", accessLevel:0 }
  ]
}

const GrantCardProps = {
  icon:"/icons/file-text.svg",
  title:"Grants",
  description:"Track grant applications, manage awards, and monitor grant progress.",
  buttons: [
    { name:"View Grants", link:"/grants", icon: "/icons/eye.svg", accessLevel:0 },
    { name:"Add Grants", icon: "/icons/plus.svg", accessLevel:1 },
    { name:"View Grantors", link:"/grants/grantors", icon: "/icons/people.svg", accessLevel:0 }
  ]
}

const EventCardProps = {
    img:{ paths:["M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z","M14 2v4a2 2 0 0 0 2 2h4", "M10 9H8","M16 13H8","M16 17H8"] },
    title:"Events",
    description:"Manage hosted events and group donors per attendees.",
    buttons: [
    { name:"Add Events", paths:['M5 12h14','M12 5v14'], accessLevel:1 },
    { name:"View Events", link:"/events", paths:['M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0'], circles:[['12','12','3']], accessLevel:1 },
  ]
}

const SettingsCardProps = {
  icon:"/icons/settings.svg",
  title:"Settings",
  description:"Configure system settings, Manage user accounts, and control access.",
  buttons: [
    { name:"Add Accounts", link:"/settings", icon:"/icons/plus.svg", accessLevel:3 },
    { name:"View Roles", link:"/settings/roles", icon:"/icons/eye.svg", accessLevel: 1},
    { name:"View Accounts", link:"/settings/accounts", icon: "/icons/people.svg", accessLevel:2 }
  ]
}

// handling hitting submit on the forms
async function createDonation(values:Record<string,any>){
    const result = await postDonation(values,user.value)
    if(result.success){
      alert("donation created");
    }
    showDonationForm.value = false;
}

async function createGrant(values:Record<string,any>){
    const result = await postGrant(values,user.value)
    if(result.success){
      alert("grant created")
    }
    showGrantForm.value = false;
}

async function createEvent(values:Record<string,any>){
    const result = await postEvent(values, user.value)
    if(result.success){
      alert("event created")
      await getEvents()
      showEventForm.value = false;
    } else if ((result as any).error?.code === 'EVENT_ALREADY_EXISTS' || (result as any).message === 'The event already exists') {
      alert('The event already exists')
    }
}

// when clicking "create event" from donation form, opens event form
function openEventFormFromDonation(){
    showEventForm.value = true;
}

// handling clicking cancel on forms to close them 
function cancelDonation(){
    showDonationForm.value = false;
}

function cancelEvent(){
  showEventForm.value = false;
}

function cancelGrant(){
  showGrantForm.value = false;
}

const donationsArray = donationsData?.value || [];

const totalDonations = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
}).format(
  donationsArray.reduce((sum, row) => {
    const amount = parseFloat(row.donation.monetaryAmount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0)
);

const totalGrants = grantsData.value.length.toLocaleString();



</script>
