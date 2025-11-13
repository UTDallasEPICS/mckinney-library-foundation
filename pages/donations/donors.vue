<template>

  <DonoTable 
    :data="DonoTableProps.donors" 
    :columns="DonoTableProps.columns"
    :accept-name="DonoTableProps.acceptName"
    :accept-function="DonoTableProps.acceptFunction"
    :deny-name="DonoTableProps.deleteName"
    :delete-function="DonoTableProps.deleteFunction"
    :can-multi-select="DonoTableProps.multiSelect"
    :multi-select-name="DonoTableProps.multiSelectName"
    :multi-select-function="DonoTableProps.multiSelectFunction"/>

    



    <div  v-if="sendEmail" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
      <div class="bg-[#e5e9ec] p-0 gap-0 border-0">
        <VeeForm :validation-schema="groupEmailSchema" class= "w-[800px] max-h-[130vh] overflow-y-auto" @submit="groupEmail">
            <div class = "flex flex-col gap-2 text-center sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "text-lg leading-none font-semibold text-[#5a6a77]"> Send Email to {{ emailList.length }} Donors</h1>
            </div>         
            <div class = "px-6 pb-6 space-y-4">
              <div class="p-2.5 rounded-md mb-4 bg-[#f5f5f5]">
                <p>Recipients: {{ nameList }}</p>
              </div>
              <div>
                <h2 class = "flex items-center gap-2 text-sm leading-none font-medium select-none text-[#5a6a77] my-1">Subject</h2>
                <VeeErrorMessage name="Subject"/>
                <VeeField v-slot="{field}" name="Subject">
                  <input v-bind="field" class="w-full flex min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none  md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-white border-gray-300 h-11"></input>
                </VeeField>
              </div>
              <div>
                <h2>Message</h2>
                <VeeErrorMessage name="Message"/>
                <VeeField v-slot="{field}" name="Message">
                  <textarea v-bind="field" class="min-h-44 resize-y w-full flex min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none  md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] bg-white border-gray-300 h-11"></textarea>
                </VeeField>
              </div>            
              <div class="flex justify-evenly">
                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6">Send Email</button>
                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="cancelEmail">Cancel</button>
              </div>
            </div>       
        </VeeForm>
      </div>
      
    </div>
     
   
</template>

<script setup lang="ts">
import DonoTable from '~/components/donations/DonoTable.vue';
import * as yup from "yup";
import { useDonors } from '~/composables/useDonors';
import { useEmails } from '~/composables/useEmails';

const sendEmail = ref(false);

const Tdonors = [
  {name: "Jason", email:"myfirst@email.com", donorID:"1234"},
  {name: "nosaj", email:"mysecond@email.com", donorID:"1234"},
  {name: "asdflk", email:"mythird@email.com", donorID:"1234"},
  {name: "zcvasdfasdf", email:"myfourth@email.com", donorID:"1234"}
]
const Tcolumns = [
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
  { key: 'donorID' as const, label: 'Donor ID' }

]

const DonoTableProps ={
  donors:Tdonors,
  columns:Tcolumns,
  acceptName:"Edit",
  deleteName:"Delete",
  acceptFunction:editDonor,
  deleteFunction:deleteDonor,
  multiSelect:true,
  multiSelectName: "Email Donors",
  multiSelectFunction: prepEmail
}

async function editDonor(donor:{name:string,email:string,donorID:string}) {
  await $fetch("/api/donors/donors",{
    method:"PATCH",
    body:{
      name:donor.name,
    }
  })
}

async function deleteDonor(donor:{name:string,email:string,donorID:string}) {
  await $fetch("/api/donors/donors",{
    method:"delete",
    body:{
      name:donor.name,
    }
  })
}
function cancelEmail(){
  sendEmail.value=false;
  emailList.value = [];
  nameList.value = "";
}
const emailList: Ref<string[]> = ref([])
const nameList = ref("")

async function prepEmail(selected:boolean[]) {
Tdonors.forEach((item,index) =>{
  if(selected[index] && item.email !== ""){
    emailList.value.push(item.email);
    if(nameList.value != ""){
      nameList.value += ", " + item.name 
    }
    else{
      nameList.value += item.name
    }
      
  }
  sendEmail.value = true;
});
}

const groupEmailSchema = yup.object({
  Subject: yup.string().required(),
  Message: yup.string().required(),
});


async function groupEmail(values:Record<string, any>){
  await $fetch("/api/email",{
    method:"POST",
    body:{
      subject:values.Subject,
      text:values.Message,
      emails:emailList.value,
    }
  })

  sendEmail.value=false;
  emailList.value = [];
  nameList.value = "";
}
</script>

