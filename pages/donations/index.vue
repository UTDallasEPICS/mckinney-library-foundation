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
    :delete-function="deleteDonation"
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
    />
</div>

<div v-if="showViewDonation" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <DonationForm 
        :donors="donorTableData"
        :view-only="true"
        :submit-donation="updateDonation"
        :cancel-submisison="cancelUpdate"
        :data="donationData"
    />
</div>

</template>

<script setup lang = ts>
import DonationBar from '~/components/Bars/DonationBar.vue';
import DonationTable from '~/components/Tables/DonationTable.vue';
import DonationForm from '~/components/Forms/DonationForm.vue';
import { useAuth } from '~/composables/useAuth';
import { useDonor } from '~/composables/useDonor';
import type { Donation, Donor } from '@prisma/client';


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


const {donors, getDonors} = useDonor();
await getDonors();

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
        notes:"",
        receivedDate:null,
        lastEditDate:null,
        },
        boardMember:null,
        donor:null
    });
const donationIndex = ref(0);


const donorTableData:Ref<{donor:Donor, donations:Donation[]}[]> = ref([]);
donors.value.map((thisDonor:Donor,index:number) => {
  donorTableData.value.push({donor:thisDonor,donations:donors.value[index].donations })
})

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
    const result = await $fetch(`/api/donation/${values.id}`,{
        method:"PUT",
        body:{
            donor: values.donorName,
            boardMemberId: user.value.id,
            permissionLevel: user.value.permissionLevel,
            status: values.status,
            event: values.event,
            method:values.method,
            monetaryAmount: values.monetaryAmount,
            nonMonetaryAmount: values.nonMonetaryAmount,
            notes: values.notes,
            receivedDate: values.receivedDate,
        }
    })
    if(result.data){
        donationsData.value[values.index].donation ={
            ...result.data, 
            receivedDate: result.data.receivedDate ? new Date(result.data.receivedDate) : null,
            lastEditDate: result.data.lastEditDate ? new Date(result.data.lastEditDate) : null,
        }
    }
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
        receivedDate:null,
        lastEditDate:null,
        },
        boardMember:null,
        donor:null
    }
}

async function deleteDonation(id:string,index:number){
    const result = await $fetch(`/api/donation/${id}`,{
        method:"DELETE",
        body:{
            permissionLevel: user.value.permissionLevel
        }
    })
    if(result.success){
        donationsData.value.splice(index,1)
    }
}



</script>