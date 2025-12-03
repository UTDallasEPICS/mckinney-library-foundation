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
            :events="events"
            :donors="donors"
            :methods="methods"
        />
    </div>
    <div  v-if = "addDonor"> 
        <DonorForm
            :submit-donor="createDonor"
            :cancel-submisison="cancelDonor"
            :view-only="false"
            :organizations="organizations"
        />
    </div>
  </div> 
  
</template>

<script setup lang="ts">
import type { Donation, Donor } from '@prisma/client';
import DonationForm from '../Forms/DonationForm.vue';
import DonorForm from '../Forms/DonorForm.vue';
import { useDonationDropDown, useDonorDropDown } from '~/composables/useDropDown';

const addDonation = ref(false);
const addDonor = ref(false);

const props = defineProps<{
    user:{id:string, permissionLevel:number}
    donors:{donor:Donor, donations:Donation[],boardMember:{name:string}|null}[],
    donations:{
        donation:Donation
        boardMember:{name:string}| null, 
        donor: {name: string | null} | null,
    }[]
}>();

const {events,methods} = useDonationDropDown(props.donations)
const {organizations} = useDonorDropDown(props.donors)

async function createDonor(values:Record<string,any>){
    const {data, error} = await $fetch('/api/donor',{
        method:"POST",
        body:{
            name:values.fName.trim() + " " + values.lName.trim(),
            email: values.email? values.email.trim(): "",
            phone: values.phone? values.phone.trim(): "",
            address: values.address? values.address.trim(): "",
            preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
            notes: values.notes,
            webLink: values.webLink? values.webLink.trim() : "",
            organization: values.organization? values.organization.trim() : "",
            permissionLevel:props.user.permissionLevel,
            boardMemberId:props.user.id
        }
    })
    if(error.code === 'P2002'){
        alert('Donor already exists');
    }
    else if(data){
        if(props.donors){
            props.donors.push({
                donor:{...data},
                donations: [],
                boardMember: data.boardMember? data.boardMember : null
            })
                   
        }
    addDonor.value=false;
    }
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
            donation:{
                ...result.data,
                receivedDate: result.data.receivedDate ? new Date(result.data.receivedDate) : null,
                lastEditDate: result.data.lastEditDate ? new Date(result.data.lastEditDate) : null,
            }        
        })
    }else{
        console.error(result.error);
    }
    addDonation.value = false;
}
function cancelDonation(){
    addDonation.value = false;
}


</script>