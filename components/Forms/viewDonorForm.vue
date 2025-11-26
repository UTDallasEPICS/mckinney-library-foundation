<template> 
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">
    
    <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold text-slate-700">Donor Info</h2>
    <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
    </div>
    
    <div class="flex flex-col gap-4">
    
    <div>
    <label class="text-sm text-slate-600">name</label>
    <input v-model = "name" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" disabled />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">address</label>
    <input v-model = "address"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" disabled/>
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">phone</label>
    <input v-model = "phone" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" disabled />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">email</label>
    <input v-model ="email"   class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" disabled></input>
    </div>
    
   
    <div>
        <label class="text-sm text-slate-600">preferred communication</label>
    <select v-model="preferredCommunication" disabled  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
    <option value = 'email'>email</option>
    <option value = 'phone'>phone</option>
    <option value = 'mail'>mail</option>
    </select>
    </div>

    <div>
    <label class="text-sm text-slate-600">notes</label>
    <textarea v-model = "notes"  type = 'number' class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" disabled></textarea>
    </div>
    
    

   
    <div>
    <label class="text-sm text-slate-600">organization</label>
    <input disabled  v-model="organization" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    <div>
    
        <label class="text-sm text-slate-600">webLink</label>
    <input disabled  v-model="webLink" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>

 
    <div>
    <label class="text-sm text-slate-600">Date</label>
    <input disabled v-model = "lastDonationDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    </div>
    
    
    </div>
    </div>
    </template>
    
    <script setup> 
    import { ref,onMounted } from 'vue';
    
    const emit = defineEmits(['close']);

    const info = ref()
    const name = ref('')
    const address = ref("")
    const phone = ref("")
    const email = ref("")
    const preferredCommunication = ref("")
    const notes = ref("")
    const organization = ref("")
    const webLink = ref("")
    const lastDonationDate = ref("")

    


    const props = defineProps({
        donorId: {
            type: String,
            default: ""
        }
    })
    
    onMounted(() => { 
    const getInfo = async () => { 


try {

    // const response = await $fetch('/api/donor/123')  
    const response = await $fetch(`/api/donor/${props.donorId}`)  

    console.log("response",response)


    info.value = response.data


}catch(err) { 

    console.log("error",err)
}
}
    getInfo()
})

watch(() => info.value, (newVal) => {   
    if (newVal) {
        name.value = newVal.name
        address.value = newVal.address
        phone.value = newVal.phone
        email.value = newVal.email
        preferredCommunication.value = newVal.preferredCommunication
        notes.value = newVal.notes
        organization.value = newVal.organization
        webLink.value = newVal.webLink
        lastDonationDate.value = newVal.lastDonationDate.slice(0,10)
  }
})
   
    </script>