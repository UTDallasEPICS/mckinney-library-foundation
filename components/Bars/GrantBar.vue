<template>
    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center ">
        <div class = "w-[90vw] flex justify-between">
            <button v-if="user.permissionLevel>0" @click="addGrant = true"
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                Add Grant
            </button>
            <NuxtLink to = '/grants/'default>
                <button 
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Grant
                </button>
            </NuxtLink>
            <NuxtLink to="/grants/grantors">
                <button class="px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Grantors
                </button>
            </NuxtLink>
            <button v-if="user.permissionLevel>0" @click="addGrantor = true"
                class="px-3 py-1 rounded hover:bg-slate-600 transition">
                Add Grantor
            </button>
        </div>
  </div>
  <div v-if="addGrant || addGrantor" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <div v-if = "addGrant">
        <GrantForm
            :submit-grant="createGrant"
            :cancel-submisison="cancelGrant"
            :view-only="false"
            :purposes="purposes"
            :grantors="grantors"
            :methods="methods"
        />
    </div>
    <div  v-if = "addGrantor"> 
        <GrantorForm
            :submit-grantor="createGrantor"
            :cancel-submisison="cancelGrantor"
            :view-only="false"
            :organizations="organizations"
        />
    </div>
  </div> 
  
</template>

<script setup lang="ts">
import type { Grant, Grantor } from '@prisma/client';
import GrantForm from '../Forms/GrantForm.vue';
import GrantorForm from '../Forms/GrantorForm.vue';

const addGrant = ref(false);
const addGrantor = ref(false);

const props = defineProps<{
    user:{id:string, permissionLevel:number}
    grantors:{grantor:Grantor, grants:Grant[],boardMember:{name:string}|null}[],
    grants?:{
        grant:Grant
        boardMember:{name:string}| null, 
        grantor: {name: string | null} | null,
    }[]
}>();

const purposes: ComputedRef<string[]> = computed(() => {
    if (props.grants) {
        const uniqueEvents = new Set(
            props.grants.map(grant => grant.grant.purpose).filter((purpose) => purpose != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})
const methods:ComputedRef<string[]> = computed(() => {
    if (props.grants) {
        const uniqueEvents = new Set(
            props.grants.map(grant => grant.grant.method).filter((method) => method != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})
const organizations:ComputedRef<string[]> = computed(() => {
    if (props.grants) {
        const uniqueEvents = new Set(
            props.grantors.map(grantor => grantor.grantor.organization).filter((organization) => organization != null)
        )
        return Array.from(uniqueEvents)
    }
    return []
})

async function createGrantor(values:Record<string,any>){
    const {data, error} = await $fetch('/api/grantor',{
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
        alert('Grantor already exists');
    }
    else if(data){
        if(props.grantors){
            props.grantors.push({
                grantor:{...data},
                grants: [],
                boardMember: data.boardMember? data.boardMember : null
            })
                   
        }
    addGrantor.value=false;
    }
}
function cancelGrantor(){
    addGrantor.value = false;
}
async function createGrant(values:Record<string,any>){
    const result = await $fetch('/api/grant',{
        method:"POST",
        body:{
            grantor: values.grantorName,
            boardMemberId: props.user.id,
            permissionLevel: props.user.permissionLevel,
            status: values.status,
            purpose: values.purpose,
            method:values.method,
            monetaryAmount: values.monetaryAmount,
            nonMonetaryAmount: values.nonMonetaryAmount,
            notes: values.notes,
            receivedDate: values.receivedDate,
        }
    })
    if(result.data){
        props.grants?.push({
            ...result.data, 
            grant:{
                ...result.data,
                proposedDate: result.data.proposedDate ? new Date() : null,
                receivedDate: result.data.receivedDate ? new Date(result.data.receivedDate) : null,
                lastEditDate: result.data.lastEditDate ? new Date(result.data.lastEditDate) : null,
            }        
        })
    }else{
        console.error(result.error);
    }
    addGrant.value = false;
}
function cancelGrant(){
    addGrant.value = false;
}


</script>