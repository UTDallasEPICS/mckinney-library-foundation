<template>
  <div class="container mx-auto px-6 py-0 max-w-full">
    <!-- dashboard's sidebar -->
    <div class="sidebar px-0 padding-5px">
      <CardButton
          v-for="button in sidebarButtons"
          :name="button.name"
          :link="button.link"
          :icon="button.icon"
          @click="navigateTo(button.link)"
        />
    </div>

    <!-- date range filters for the overviews -->
    <div class="filters grid md:grid-cols-2 gap-4 mb-4">
      <DateRangeFilter v-model="donationDateRange" label="Donations date range" placeholder="All time" />
      <DateRangeFilter v-model="grantDateRange" label="Grants date range" placeholder="All time" />
    </div>

    <!-- the overview widgets -->
    <div class="widgets grid md:grid-cols-1 gap-6 mb-8">
      <DashboardStat
        title="Total Donations"
        :value="totalDonations"
        :description="donationsDescription"
      />
      <DashboardStat
        title="Total Grants"
        :value="totalGrants"
        :description="grantsDescription"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Ref } from 'vue'
import CardButton from '~/components/Cards/DashboardCard/CardButton.vue'
import DashboardStat from '~/components/Banners/DashboardBanner.vue'
import DateRangeFilter, { type DateRangeValue } from '~/components/Forms/DateRangeFilter.vue'
import { useDonationDropDown, useDonorDropDown } from '~/composables/useDonationDropDown'
import { useGrantsDropDown, useGrantorDropDown } from '~/composables/useGrantDropDowns'
import { useEventDropDown } from '~/composables/useEventDropDown'
import { useAuth } from '~/composables/useAuth'
import { useDonation } from '~/composables/useDonation'
import { useEvent } from '~/composables/useEvent'
import { useDonor } from '~/composables/useDonor'
import { useGrant } from '~/composables/useGrant'
import { useGrantor } from '~/composables/useGrantor'
import { navigateTo } from '#app'
import type { Donation, Donor, Grant, Grantor } from '~~/server/utils/generated/prisma/browser'

const { data: session } = await useAuth();
if (!session.value?.user) {
  await navigateTo("/")
}

const { donationsData, postDonation } = useDonation();
const { donors, putDonor } = useDonor();
const { grantsData, postGrant } = useGrant();
const { grantors, postGrantor } = useGrantor();
const { eventsData, postEvent } = useEvent();
const toasts = useToast();

const donorTableData = computed(() =>
    donors.value.map((thisDonor: any) => ({
        donor: thisDonor,
        donations: thisDonor.donations,
    }))
);

const grantorTableData = computed(() =>
    grantors.value.map((thisGrantor: any) => ({
        grantor: thisGrantor,
        grants: thisGrantor.grants,
    }))
);

const { eventNames } = useEventDropDown(eventsData)
const { donationMethods } = useDonationDropDown(donationsData.value)
const { donorOrganizations } = useDonorDropDown(() => donors.value)
const { grantPurposes, grantMethods } = useGrantsDropDown(grantsData.value)
const { grantorOrganizations } = useGrantorDropDown(() => grantors.value);
const eventDateLookup = computed<Record<string, string>>(() => {
  const lookup: Record<string, string> = {}
  eventsData.value.forEach((row) => {
    if (row.event.eventName && row.event.eventDate) {
      lookup[row.event.eventName] = row.event.eventDate.toISOString().split('T')[0] ?? ''
    }
  })
  return lookup
})

const user:Ref<{id:string, permissionLevel:number}> = ref({id:"",permissionLevel:0});
if (session.value?.user) {
  user.value.id = session.value.user.id
  user.value.permissionLevel = session.value.user.permission
}

const sidebarButtons = [
    { name:"Donations", link:"/donations", icon: "/icons/dollar-sign.svg", accessLevel:0 },
    { name:"Donors", link:"/donations/donors", icon: "/icons/people.svg", accessLevel:0 },
    { name:"Grants", link:"/grants", icon: "/icons/eye.svg", accessLevel:0 },
    { name:"Grantors", link:"/grants/grantors", icon: "/icons/people.svg", accessLevel:0 },
    { name:"Events", link:"/events", icon: "/icons/eye.svg", accessLevel:1 },
    { name:"Accounts", link:"/settings/accounts", icon: "/icons/people.svg", accessLevel:2 }
]

// date range filters for the totals below
const donationDateRange = ref<DateRangeValue>(null)
const grantDateRange = ref<DateRangeValue>(null)

function isWithinRange(date: Date | null | undefined, range: DateRangeValue): boolean {
  if (!range?.start || !range?.end) return true
  if (!date) return false
  // received dates are stored as UTC midnight, so compare calendar days rather than local timestamps
  const day = date.toISOString().slice(0, 10)
  return day >= range.start.toString() && day <= range.end.toString()
}

const filteredDonations = computed(() =>
  donationsData.value.filter((row) => isWithinRange(row.donation.receivedDate, donationDateRange.value))
)

const filteredGrants = computed(() =>
  grantsData.value.filter((row) => isWithinRange(row.grant.receivedDate, grantDateRange.value))
)

function filteredDonors() {
  const filtered: Donor[] = [];
  filteredDonations.value.filter((donation) => { if (!filtered.includes(donation.donor) || true) filtered.push(donation.donor) })
  return filtered;
}

function filteredGrantors() {
  const filtered: Grantor[] = [];
  filteredGrants.value.filter((grant) => { if (!filtered.includes(grant.grantor)) filtered.push(grant.grantor) })
  return filtered;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const totalDonations = computed(() => currencyFormatter.format(
  filteredDonations.value.reduce((sum, row) => {
    const amount = parseFloat(row.donation.monetaryAmount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0)
));

const totalGrants = computed(() => currencyFormatter.format(
  filteredGrants.value.reduce((sum, row) => {
    const amount = parseFloat(row.grant.monetaryAmount || "0");
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0)
));

function countDescription(itemCount: number, sourceCount: number, item: string, source: string, range: DateRangeValue) {
  const scope = range?.start && range?.end ? 'in selected range' : 'all time'
  return `${itemCount.toLocaleString()} ${itemCount === 1 ? item : item + 's'}, ${sourceCount.toLocaleString()} ${sourceCount === 1 ? source : source + 's'};  ${scope}`
}

const donationsDescription = computed(() =>
  countDescription(filteredDonations.value.length, filteredDonors.length, 'donation', 'donor', donationDateRange.value)
)

const grantsDescription = computed(() =>
  countDescription(filteredGrants.value.length, filteredGrantors.length, 'grant', 'grantor', grantDateRange.value)
)


</script>