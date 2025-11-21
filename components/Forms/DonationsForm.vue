<template> 
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">
    
    <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold text-slate-700">Donations</h2>
    <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
    </div>
    
    <div class="flex flex-col gap-4">
    
    <div>
    <label class="text-sm text-slate-600">donor (name)</label>
    <input v-model="donor" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">event</label>
    <input v-model="event" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>

    <div>
    <label class="text-sm text-slate-600">method</label>
    <input v-model="method" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600">monetary amount</label>
    <input v-model="monetaryAmount" type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>


    <div>
    <label class="text-sm text-slate-600">non monetary amount</label>
    <input v-model="nonMonetaryAmount" type="number" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">amount requested</label>
    <input v-model="amountRequested" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
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
    <label class="text-sm text-slate-600">Proposed Date</label>
    <input v-model="proposedDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
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
    <button @click = 'resetForm()' class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Cancel</button>
    <button @click = "submit()" class="px-4 py-2 bg-slate-700 text-white rounded-lg">Submit</button>
    </div>
    
    </div>
    </div>
    </template>
    
    <script setup> 
    import { ref } from 'vue';

    const emit = defineEmits(['close']);
    
    const donor = ref("")
    const event =   ref("")
    const method = ref("")
    const monetaryAmount = ref("")
    const nonMonetaryAmount = ref("")
    const amountRequested = ref("")
    const notes = ref("")
    const proposedDate = ref("")
    const startDate = ref("")
    const endDate = ref("")
    const status = ref("pending")


    const resetForm = () => {
        donor.value = ""
        event.value = ""
        method.value = ""
        monetaryAmount.value = ""
        nonMonetaryAmount.value = ""
        amountRequested.value = ""
        notes.value = ""
        proposedDate.value = ""
        startDate.value = ""
        endDate.value = ""
        status.value = "pending"
    }

    const submit = async () => { 

    if (!donor.value || !event.value || !method.value || !monetaryAmount.value || !nonMonetaryAmount.value || !amountRequested.value || !proposedDate.value || !startDate.value || !endDate.value || !status.value) {
        alert("Please fill in all required fields.")
        return
    }

    try { 

        const response = await $fetch('/api/donations/123', {
            method: 'POST',
            body: {
                donor: donor.value,
                event: event.value,
                method: method.value,
                monetaryAmount: String(monetaryAmount.value),
                nonMonetaryAmount: String(nonMonetaryAmount.value),
                amountRequested: amountRequested.value,
                notes: notes.value,
                proposedDate: proposedDate.value,
                startDate: startDate.value,
                endDate: endDate.value,
                status: status.value
            }
        })

        emit('close')

        }catch(err) { 

            console.log("error",err)
        }


    }
    
 

    
    </script>
