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
            :purposes="grantPurposes"
            :grantors="grantors"
            :methods="grantMethods"
        />
    </div>
    <div  v-if = "addGrantor"> 
        <GrantorForm
            :submit-grantor="createGrantor"
            :cancel-submisison="cancelGrantor"
            :view-only="false"
            :organizations="grantorOrganizations"
        />
    </div>
  </div> 
  
</template>

<script setup lang="ts">
import type { Grant, Grantor } from '@prisma/client';
import GrantForm from '../Forms/GrantForm.vue';
import GrantorForm from '../Forms/GrantorForm.vue';
import {useGrant} from '~/composables/useGrant';
import { useGrantor } from '~/composables/useGrantor';
import { useGrantorDropDown,useGrantsDropDown } from '~/composables/useGrantDropDowns';

const {postGrant} = useGrant();
const {postGrantor} = useGrantor();



const addGrant = ref(false);
const addGrantor = ref(false);

const props = defineProps<{
    user:{id:string, permissionLevel:number}
    grantors:{grantor:Grantor, grants:Grant[],boardMember:{name:string}|null}[],
    grants:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null,}[]
}>();

const {grantMethods,grantPurposes} = useGrantsDropDown(props.grants)
const {grantorOrganizations} = useGrantorDropDown(props.grantors)

async function createGrantor(values:Record<string,any>){
    const result = await postGrantor(values, props.user)
    if(result.error.code === 'P2002'){
        alert('Grantor already exists');
    }
    else if(result.data){
        if(props.grantors){
            props.grantors.push({
                grantor:{...result.data},
                grants: [],
                boardMember: result.data.boardMember? result.data.boardMember : null
            })
                   
        }
    addGrantor.value=false;
    }
}
function cancelGrantor(){
    addGrantor.value = false;
}
async function createGrant(values:Record<string,any>){
    const result = await postGrant(values,props.user)
    if(result.data){
        props.grants?.push({
            ...result.data, 
            grant:{
                ...result.data,
                proposedDate: result.data.proposedDate ? new Date(result.data.proposedDate) : null,
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