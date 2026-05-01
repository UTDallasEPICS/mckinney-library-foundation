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
        :events="donationEvents"
        :methods="donationMethods"
    />
</div>

<div v-if="showViewDonation" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonationForm 
        :donors="donorTableData"
        :view-only="true"
        :submit-donation="updateDonation"
        :cancel-submisison="cancelUpdate"
        :data="donationData"
        :events="donationEvents"
        :methods="donationMethods"
    />
</div>

</template>

<script setup lang ="ts">
import DonationBar from '~/components/Bars/DonationBar.vue';
import DonationTable from '~/components/Tables/DonationTable.vue';
import DonationForm from '~/components/Forms/DonationForm.vue';
import { useAuth } from '~/composables/useAuth';
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


const { donors } = useDonor();

const { donationsData, putDonation, deleteDonation } = useDonation();

const {donationEvents, donationMethods} = useDonationDropDown(donationsData.value);

const donationData:Ref<{ 
    donation:Donation,
    boardMember:{name:string}| null, 
    donor: {name: string } | null}> = ref({
        donation:{
            id:"",
            boardMemberId:"",
            donorId:"",
            method:"",
            event:"",
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
        event:"",
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

async function removeDonation(id:string, index:number){
    await deleteDonation(id, user.value.permissionLevel);
}



</script>