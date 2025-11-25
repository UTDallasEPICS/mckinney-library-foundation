<template> 
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">
    
    <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold text-slate-700">Donations</h2>
    <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
    </div>
    
    <div class="flex flex-col gap-4">
    
    <div>
    <label class="text-sm text-slate-600">donor (name)</label>
    <input disabled v-model = "donor" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">event</label>
    <input v-model = "event"  disabled class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>

    <div>
    <label class="text-sm text-slate-600">method</label>
    <input v-model = "method" disabled class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600">monetary amount</label>
    <input disabled v-model = "monetaryAmount"  type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600">non monetary amount</label>
    <input disabled v-model = "nonMonetaryAmount"  type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
      
    <div>
    <label class="text-sm text-slate-600">Notes</label>
    <textarea v-model = "notes" disabled class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></textarea>
    </div>

    <div class = "flex flex-col">
    <label class="text-sm text-slate-600">status</label>
    <select disabled v-model = "status"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
        <option value="pending">Pending</option>
        <option value="received">Received</option>
    </select>
    </div>
    
    <div>
    <label  class="text-sm text-slate-600">Start Date</label>
    <input disabled v-model = "startDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">End Date</label>
    <input disabled v-model = "endDate"  type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    </div>
    
  
    </div>
    </div>
    </template>
    
    <script setup> 
    import {ref,onMounted} from 'vue';  
    const emit = defineEmits(['close']);


    const donor = ref("")
    const event = ref("")
    const method = ref("")
    const monetaryAmount = ref(0)
    const nonMonetaryAmount = ref(0)
    const notes = ref("")
    const status = ref("pending")
    const startDate = ref("")
    const endDate = ref("")


    const props = defineProps({
        donationId: {
            type: String,
           default: ""
        }
    }); 
    // pass props from parent left to do and the delete button 


    onMounted(() => { 


        const getInfo = async () => { 


    try { 

        const response = await $fetch(`/api/donation/${props.donationId}`)  



        // donor.value = response.data.donor.name
        event.value = response.data?.event
        method.value = response.data?.method
        monetaryAmount.value = response.data?.monetaryAmount
        nonMonetaryAmount.value = response.data?.nonMonetaryAmount
        notes.value = response.data?.notes

        startDate.value = response.data.receivedDate.split("T")[0]
        endDate.value = response.data.lastEditDate.split("T")[0]

        if(response.data?.status == 1) { 
            status.value = "received"
        } else { 
            status.value = "pending"
        }



       

    }catch(err) { 
        console.log("error",err)
    }
        }

        getInfo()

    })


    
    </script>