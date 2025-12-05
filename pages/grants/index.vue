<template>
<GrantBar
    :user="user"
    :grantors="grantorTableData"
    :grants="grantsData"
/>

<GrantTable
    :data="grantsData"
    :edit-function="prepGrantUpdate"
    :view-function="prepGrantView"
    :delete-function="removeGrant"
    :permission-level="user.permissionLevel"
/>

<div v-if="showUpdateGrant" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <GrantForm 
        :grantors="grantorTableData"
        :view-only="false"
        :submit-grant="updateGrant"
        :cancel-submisison="cancelUpdate"
        :data="grantData"
        :index="grantIndex"
        :methods="grantMethods"
        :purposes="grantPurposes"
    />
</div>

<div v-if="showViewGrant" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
    <GrantForm 
        :grantors="grantorTableData"
        :view-only="true"
        :submit-grant="updateGrant"
        :cancel-submisison="cancelUpdate"
        :data="grantData"
        :methods="grantMethods"
        :purposes="grantPurposes"
    />
</div>

</template>

<script setup lang = ts>
import GrantBar from '~/components/Bars/GrantBar.vue';
import GrantTable from '~/components/Tables/GrantTable.vue';
import GrantForm from '~/components/Forms/GrantForm.vue';
import { useAuth } from '~/composables/useAuth';
import { useGrantor } from '~/composables/useGrantor';
import { useGrant } from '~/composables/useGrant';
import type { Grant, Grantor } from '@prisma/client';
import { useGrantsDropDown } from '~/composables/useGrantDropDowns';


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

const showUpdateGrant = ref(false);
const showViewGrant = ref(false);


const {grantors, getGrantors} = useGrantor();
await getGrantors();

const {grantsData, getGrants, putGrant, deleteGrant} = useGrant();
await getGrants();

const {grantPurposes,grantMethods} = useGrantsDropDown(grantsData.value)



const grantData:Ref<{ 
    grant:Grant,
    boardMember:{name:string}| null, 
    grantor: {name: string } | null}> = ref({
        grant:{
        id:"",
        boardMemberId:"",
        grantorId:"",
        method:"",
        purpose:"",
        monetaryAmount:"",
        nonMonetaryAmount:"",
        status:0,
        notes:"",
        proposedDate:null,
        receivedDate:null,
        lastEditDate:null,
        },
        boardMember:null,
        grantor:null
    });
const grantIndex = ref(0);


const grantorTableData:Ref<{grantor:Grantor, grants:Grant[],boardMember:{name:string} }[]> = ref([]);
 grantors.value.map((thisGrantor:Grantor,index:number) => {
   grantorTableData.value.push({grantor:thisGrantor,grants:grantors.value[index].grants, boardMember:{name:grantors.value[index].boardMember.name} })
 })

async function prepGrantUpdate(grantInfo:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number){
    grantData.value.grant = grantInfo.grant;
    grantData.value.boardMember = grantInfo.boardMember? grantInfo.boardMember : null
    grantData.value.grantor =  grantInfo.grantor? grantInfo.grantor : null
    grantIndex.value = index
    showUpdateGrant.value = true;
}

async function prepGrantView(grantInfo:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number){
    grantData.value.grant = grantInfo.grant;
    grantData.value.boardMember = grantInfo.boardMember? grantInfo.boardMember : null
    grantData.value.grantor =  grantInfo.grantor? grantInfo.grantor : null
    grantIndex.value = index
    showViewGrant.value = true;
}


async function updateGrant(values:Record<string, any>){
    const result = await putGrant(values,user.value)
    if(result.data){
        grantsData.value[values.index].grant ={
            ...result.data, 
            proposedDate: result.data.proposedDate ? new Date(result.data.proposedDate) : null,
            receivedDate: result.data.receivedDate ? new Date(result.data.receivedDate) : null,
            lastEditDate: result.data.lastEditDate ? new Date(result.data.lastEditDate) : null,
        }
        grantsData.value[values.index].boardMember = result.data.boardMember
        grantsData.value[values.index].grantor = result.data.grantor
    }
    showUpdateGrant.value = false;
}

function cancelUpdate(){

    showUpdateGrant.value = false;
    showViewGrant.value = false;
    grantData.value = {
        grant:{id:"",
        boardMemberId:"",
        grantorId:"",
        method:"",
        purpose:"",
        monetaryAmount:"",
        nonMonetaryAmount:"",
        status:0,
        notes:"",
        proposedDate:null,
        receivedDate:null,
        lastEditDate:null,
        },
        boardMember:null,
        grantor:null
    }
}

async function removeGrant(id:string,index:number){
    const result = await deleteGrant(id, user.value.permissionLevel)
    if(result.success){
        grantsData.value.splice(index,1)
    }
}



</script>