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
            :events="donationEvents"
            :donors="donors"
            :methods="donationMethods"
        />
    </div>
    <div  v-if = "addDonor"> 
        <DonorForm
            :submit-donor="createDonor"
            :cancel-submisison="cancelDonor"
            :view-only="false"
            :organizations="donorOrganizations"
        />
    </div>
  </div> 
  
</template>

<script setup lang="ts">
import type { Donation, Donor } from '~~/server/utils/generated/prisma/browser';
import DonationForm from '../Forms/DonationForm.vue';
import DonorForm from '../Forms/DonorForm.vue';
import { useDonationDropDown, useDonorDropDown } from '~/composables/useDonationDropDown';
import { useDonation } from '~/composables/useDonation';
import { useDonor } from '~/composables/useDonor'

const {postDonation} = useDonation()
const {postDonor} = useDonor();

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

const {donationEvents,donationMethods} = useDonationDropDown(props.donations)
const {donorOrganizations} = useDonorDropDown(props.donors)

async function createDonor(values:Record<string,any>){
    const result = await postDonor(values,props.user);
    if(result.error.code === 'P2002'){
        alert('Donor already exists');
    }
    else if(result.data){
        if(props.donors){
            props.donors.push({
                donor:{...result.data},
                donations: [],
                boardMember: result.data.boardMember? result.data.boardMember : null
            })
                   
        }
    addDonor.value=false;
    }
}
function cancelDonor(){
    addDonor.value = false;
}
async function createDonation(values:Record<string,any>){
    const result = await postDonation(values,props.user)
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