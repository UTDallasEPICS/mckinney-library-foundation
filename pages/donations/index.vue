<template>
<DonationBar
    :user="user"
    :donors="donorTableData"
    :donations="donationsData"
/>

<DonationTable
    :data="donationsData"
    :edit-function="prepDonationUpdate"
    :view-function="prepDonationView"
    :delete-function="removeDonation"
    :permission-level="user.permissionLevel"
/>

<div v-if="showUpdateDonation" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonationForm 
        :donors="donorTableData"
        :view-only="false"
        :submit-donation="updateDonation"
        :cancel-submisison="cancelUpdate"
        :data="donationData"
        :index="donationIndex"
        :events="eventNames"
        :event-date-lookup="eventDateLookup"
        :methods="donationMethods"
        @request-create-event="openEventFormFromDonation"
    />
</div>

<div v-if="showViewDonation" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonationForm 
        :donors="donorTableData"
        :view-only="true"
        :submit-donation="updateDonation"
        :cancel-submisison="cancelUpdate"
        :data="donationData"
        :events="eventNames"
        :event-date-lookup="eventDateLookup"
        :methods="donationMethods"
    />
</div>

<div v-if="showEventForm" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <EventForm :submit-event="createEvent" :cancel-submisison="cancelEvent" :view-only="false" />
</div>

</template>

<script setup lang ="ts">
import DonationBar from '~/components/Bars/DonationBar.vue';
import DonationTable from '~/components/Tables/DonationTable.vue';
import DonationForm from '~/components/Forms/DonationForm.vue';
import EventForm from '~/components/Forms/EventForm.vue';
import { useAuth } from '~/composables/useAuth';
import { useDonor } from '~/composables/useDonor';
import { useDonation } from '~/composables/useDonation';
import { useDonationDropDown } from '~/composables/useDonationDropDown';
import { useEvent } from '~/composables/useEvent';
import { useEventDropDown } from '~/composables/useEventDropDown';
import type { Donation, Donor } from '~~/server/utils/generated/prisma/browser';


const {session, getSession} = useAuth();
session.value = await getSession();

const user:Ref<{id:string, permissionLevel:number}> = ref({id:"",permissionLevel:0});

if(session.value?.user){
  user.value.permissionLevel = session.value.user.permission;
  user.value.id = session.value.user.id;
}
else{
  navigateTo("/");
}

const showUpdateDonation = ref(false);
const showViewDonation = ref(false);
const showEventForm = ref(false);


const { donors } = useDonor();

const { donationsData, putDonation, deleteDonation } = useDonation();

const { eventsData, postEvent } = useEvent();

const { eventNames } = useEventDropDown(eventsData);
const { donationMethods } = useDonationDropDown(donationsData.value);
const eventDateLookup = computed<Record<string, string>>(() => {
    const lookup: Record<string, string> = {}
    eventsData.value.forEach((row) => {
        if (row.event.eventName && row.event.eventDate) {
            lookup[row.event.eventName] = row.event.eventDate.toISOString().split('T')[0] ?? ''
        }
    })
    return lookup
})

const donationData:Ref<{ 
    donation:Donation,
    boardMember:{name:string}| null, 
    donor: {name: string } | null}> = ref({
        donation:{
            id:"",
            boardMemberId:"",
            donorId:"",
            method:"",
            event:null,
            monetaryAmount:"",
            nonMonetaryAmount:"",
            status:0,
            isAuthor: false,
            notes:"",
            reason:"",
            receivedDate:null,
            lastEditDate:null,
        },
        boardMember:null,
        donor:null
    });
const donationIndex = ref(0);


const donorTableData = computed(() =>
    donors.value.map((thisDonor: any) => ({
        donor: thisDonor,
        donations: thisDonor.donations,
        boardMember: thisDonor.boardMember
    }))
);

async function prepDonationUpdate(donationInfo:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number){
    donationData.value.donation = donationInfo.donation;
    donationData.value.boardMember = donationInfo.boardMember? donationInfo.boardMember : null
    donationData.value.donor =  donationInfo.donor? donationInfo.donor : null
    donationIndex.value = index
    showUpdateDonation.value = true;
}

async function prepDonationView(donationInfo:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number){
    donationData.value.donation = donationInfo.donation;
    donationData.value.boardMember = donationInfo.boardMember? donationInfo.boardMember : null
    donationData.value.donor =  donationInfo.donor? donationInfo.donor : null
    donationIndex.value = index
    showViewDonation.value = true;
}


async function updateDonation(values:Record<string, any>){
    await putDonation(values, user.value);
    showUpdateDonation.value = false;
}

function cancelUpdate(){

    showUpdateDonation.value = false;
    showViewDonation.value = false;
    donationData.value = {
        donation:{id:"",
        boardMemberId:"",
        donorId:"",
        method:"",
        event:null,
        monetaryAmount:"",
        nonMonetaryAmount:"",
        status:0,
        notes:"",
        isAuthor: false,
        reason:"",
        receivedDate:null,
        lastEditDate:null,
        },
        boardMember:null,
        donor:null
    }
}

async function createEvent(values:Record<string,any>) {
    const result = await postEvent(values, user.value);
    if (result.success) {
        showEventForm.value = false;
    } else if ((result as any).error?.code === 'EVENT_ALREADY_EXISTS' || (result as any).message === 'The event already exists') {
        alert('The event already exists');
    }
}

function openEventFormFromDonation(){
    showEventForm.value = true;
}

function cancelEvent(){
    showEventForm.value = false;
}

async function removeDonation(id:string, index:number){
    await deleteDonation(id, user.value.permissionLevel);
}



</script>