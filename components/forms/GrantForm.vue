<template> 
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">

<div class="flex items-center justify-between mb-6">
<h2 class="text-2xl font-semibold text-slate-700">Grant Info</h2>
<button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
</div>

<div class="flex flex-col gap-4">

<div>
<label class="text-sm text-slate-600">granter</label>
<input v-model="granter" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
</div>

<div>
<label class="text-sm text-slate-600">purpose</label>
<input v-model="purpose" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
</div>


<div>
<label class="text-sm text-slate-600">method</label>
<input v-model="amountRequested" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
</div>


<div>
<label class="text-sm text-slate-600">nonmonetary amount</label>
<input v-model="nonMonetaryAmount" type = 'number' class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></input>
</div>

<div>
<label class="text-sm text-slate-600">monetary amount</label>
<input v-model="monetaryAmount" type ='number' class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
</div>

<div>
    <label class="text-sm text-slate-600">Notes</label>
<select v-model = "status"class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
<option value = 'pending'>pending</option>
<option value = 'approved'>approved</option>
</select>
</div>

<div>
<label class="text-sm text-slate-600">proposed date</label>
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
<button class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Cancel</button>
<button @click = "submit()" class="px-4 py-2 bg-slate-700 text-white rounded-lg">Submit</button>
</div>

</div>
</div>
</template>

<script setup> 
import { ref } from 'vue';
const emit = defineEmits(['close']);

const granter = ref("")
const purpose = ref("")
const method = ref("")
const monetaryAmount = ref("")
const nonMonetaryAmount = ref("")
const status = ref("pending")
const notes = ref("")
const proposedDate = ref("")
const startDate = ref("")
const endDate = ref("")





const submit = async () => { 

try { 

const response = await $fetch("/api/grants/123", { 
    method: "POST",
    body: {
        grantor: granter.value,
        purpose: purpose.value,
        method: method.value,
        monetaryAmount: String(monetaryAmount.value),
        nonMonetaryAmount: String(nonMonetaryAmount.value),
        status: status.value,
        notes: notes.value,
        proposedDate: proposedDate.value,
        startDate: startDate.value,
        endDate: endDate.value 
       
    }
})

emit('close')



}catch(Err) {

    console.log("error",err)
}
}


</script>
    
  