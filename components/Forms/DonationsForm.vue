<template> 
    <div class="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
    <div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">
    
    <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold text-slate-700">Donations</h2>
    <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
    </div>
    
    <div class="flex flex-col gap-4">
    
    <div>
    <label class="text-sm text-slate-600">donor (name) <span class = "text-red-500">*</span></label>
    <input v-model="donor" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">event <span class = "text-red-500">*</span></label>
    <input v-model="event" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>

    <div>
    <label class="text-sm text-slate-600">method <span class = "text-red-500">*</span></label>
    <input v-model="method" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600" >monetary amount</label>
    <input v-model="monetaryAmount" min = "0" onkeydown="return event.key !== '-'" type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600">non monetary amount</label>
    <input v-model="nonMonetaryAmount" min = "0" onkeydown="return event.key !== '-'" type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
      
    <div>
    <label class="text-sm text-slate-600">Notes</label>
    <textarea v-model="notes" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></textarea>
    </div>

    <div class = "flex flex-col">
    <label class="text-sm text-slate-600">status</label>
    <select v-model="status" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
        <option value="pending">Pending</option>
        <option value="received">Received</option>
    </select>
    </div>
    
    <div>
    <label class="text-sm text-slate-600">Start Date</label>
    <input v-model="startDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">End Date</label>
    <input v-model="endDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    </div>
    
    <div class="flex justify-end gap-3 mt-6">
    <button @click = 'resetForm()' class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Clear</button>
    <button @click = "submit()" class="px-4 py-2 bg-slate-700 text-white rounded-lg">Submit</button>
    </div>
    
    </div>
    </div>
    </template>
    
    <script setup lang="ts"> 
    import { ref,onMounted } from 'vue';
    const emit = defineEmits(['close','update-donation','add-donation']);

    
    const donor = ref("")
    const event =   ref("")
    const method = ref("")
    const monetaryAmount = ref("")
    const nonMonetaryAmount = ref("")

    const notes = ref("")

    const startDate = ref("")
    const endDate = ref("")
    const status = ref("pending")
    const boardMemberId = ref("")
    const boardMember = ref("")

   const props = defineProps({
    method: {
        type: String,
        default: 'POST'
    },
    donationId: {
        type: String,
        default: ""
    },
    permissionLevel:{
        default:0
    }
   })
   console.log("prop permission level:" +props.permissionLevel)
    onMounted(() => { 
       const getSession = async () => { 
         const response = await $fetch('/api/session')
         console.log("response",response.data.user)
         boardMemberId.value = response.data.user.id
         boardMember.value = response.data.user.name
 
        
       }

        getSession()


 if(props.method === 'PUT' && props.donationId) { 
    const getInfo = async() => {
        try {
            const response = await $fetch(`/api/donation/${props.donationId}`)
            donor.value = response.data.donor
            event.value = response.data.event
            method.value = response.data.method
            monetaryAmount.value = response.data.monetaryAmount
            nonMonetaryAmount.value = response.data.nonMonetaryAmount
            notes.value = response.data.notes
            startDate.value = response.data.lastEditDate.slice(0,10)
            endDate.value = response.data.receivedDate.slice(0,10)
            if(response.data.status == 1) {
                status.value = "received"
            } else {
                status.value = "pending"
            }
        } catch(err) { 
            console.log('error',err)
        }
    }
    getInfo()
}


 
     })


    const resetForm = () => {
        donor.value = ""
        event.value = ""
        method.value = ""
        monetaryAmount.value = ""
        nonMonetaryAmount.value = ""
       
        notes.value = ""
        proposedDate.value = ""
        startDate.value = ""
        endDate.value = ""
        status.value = "pending"
    }

    const submit = async () => { 

    if (!donor.value || !event.value || !method.value  || !status.value) {
        alert("Please fill in all required fields.")
        return
    }

    try { 
        const url = ref('/api/donation');
        if(props.method == 'PUT'){
            url.value += `/${props.donationId}`
        }
        else{
            console.log(props.method);
        }
        const response = await $fetch(url.value, {
            method: props.method,
            body: {
                ...(props.donationId ? { donationId: props.donationId } : null),  
                donor: donor.value,
                event: event.value,
                method: method.value,
                monetaryAmount: String(monetaryAmount.value),
                nonMonetaryAmount: String(nonMonetaryAmount.value),
                permissionLevel:props.permissionLevel,
                notes: notes.value,
           
                startDate: startDate.value,
                endDate: endDate.value,
                status: status.value,
                boardMemberId: boardMemberId.value,
                boardMember: boardMember.value,
            }
        })


        console.log("api method show up",props.method)

        console.log('id to send to backend ',props.donationId)

        console.log("response after submit",response.data)

        emit('update-donation', response.data)

        console.log("submit",response.data)
       
        
        emit('add-donation', response.data) 

        emit('close')

       

        }catch(err) { 

            console.log("error",err)
        }


    }

 

  

    </script>
