<template>
    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
        <div class = "w-[90vw] flex justify-between">
            <button v-if="user.permissionLevel>0" @click="addDonation = true"
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                Add Donation
            </button>
            <NuxtLink to = '/donations/'default>
                <button 
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Donation
                </button>
            </NuxtLink>
            <NuxtLink to="/donations/donors">
                <button class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Donors
                </button>
            </NuxtLink>
            <button v-if="user.permissionLevel>0" @click="addDonor = true"
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                Add Donor
            </button>
        </div>
  </div>
  <div v-if="addDonation || addDonor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <div v-if = "addDonation">
        <DonationForm
            :submit-donation="createDonation"
            :cancel-submisison="cancelDonation"
            :view-only="false"
            :donors="donors"
        />
    </div>
    <div  v-if = "addDonor"> 
        <DonorForm
            :submit-donor="createDonor"
            :cancel-submisison="cancelDonor"
            :view-only="false"
        />
    </div>
  </div> 
  
</template>

<script setup lang="ts">
import type { Donor } from '@prisma/client';
import DonationForm from '../Forms/DonationForm.vue';
import DonorForm from '../Forms/DonorForm.vue';

const addDonation = ref(false);
const addDonor = ref(false);

const props = defineProps<{
    user:{id:string, permissionLevel:number}
   
    donors:{id:string , name:string, organization:string|null, email:string|null, phone:string|null,address:string|null, preferredCommunication:string|null, notes:string|null,webLink:string|null}[]
    donations?:{
        id: string,
        boardMemberId: string | null, 
        donorId: string | null,event: string | null, 
        method: string | null, 
        monetaryAmount: string | null, 
        nonMonetaryAmount: string | null, 
        status: number, notes: string | null, 
        receivedDate: Date | null,
        lastEditDate: Date | null
        boardMember:{name:string}| null, 
        donor: {name: string | null} | null,
    }[]
}>();

async function createDonor(values:Record<string,any>){
    const result = await useFetch('/api/donor',{
        method:"POST",
        body:{
            name:values.fName + " " + values.lName,
            email: values.email,
            phone: values.phone,
            address: values.address,
            preferredCommunication: values.preferredCommunication,
            notes: values.notes,
            webLink: values.webLink,
            organization: values.organization,
        }
    })
    if(result.data.value?.data){
        if(props.donors){
            props.donors.push(result.data.value.data)
        }
    }
    addDonor.value=false;
}
function cancelDonor(){
    addDonor.value = false;
}
async function createDonation(values:Record<string,any>){
    const result = await $fetch('/api/donation',{
        method:"POST",
        body:{
            donor: values.donorName,
            boardMemberId: props.user.id,
            permissionLevel: props.user.permissionLevel,
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
        props.donations?.push({
            ...result.data, 
            receivedDate: result.data.receivedDate ? new Date(result.data.receivedDate) : null,
            lastEditDate: result.data.lastEditDate ? new Date(result.data.lastEditDate) : null,
        })
    }
    addDonation.value = false;
}
function cancelDonation(){
    addDonation.value = false;
}


</script>