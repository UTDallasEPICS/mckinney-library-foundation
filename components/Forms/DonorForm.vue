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
    <input v-model = "name" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">address</label>
    <input v-model = "address"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">phone</label>
    <input v-model = "phone" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">email</label>
    <input v-model = "email"   class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></input>
    </div>
    
   
    <div>
        <label class="text-sm text-slate-600">preferred communication</label>
    <select v-model="preferredCommunication"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
    <option value = 'email'>email</option>
    <option value = 'phone'>phone</option>
    <option value = 'mail'>mail</option>
    </select>
    </div>

    <div>
    <label class="text-sm text-slate-600">notes</label>
    <textarea v-model = "notes"  type = 'number' class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></textarea>
    </div>
    
    

   
    <div>
    <label class="text-sm text-slate-600">organization</label>
    <input v-model="organization" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>

 
    <div>
    <label class="text-sm text-slate-600">Date</label>
    <input v-model = "lastDonationDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    </div>
    
    <div class="flex justify-end gap-3 mt-6">
    <button @click = "reset()"class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Cancel</button>
    <button @click = "submit()" class="px-4 py-2 bg-slate-700 text-white rounded-lg">Submit</button>
    </div>
    
    </div>
    </div>
    </template>
    
    <script setup> 
    import { ref } from 'vue';
    const emit = defineEmits(['close']);
    
    const name = ref('')
    const address = ref("")
    const phone = ref("")
    const email = ref("")
    const preferredCommunication = ref("email")
    const notes =   ref("")
    const organization = ref("")
    const lastDonationDate = ref("")



    const submit = async () => {
        try { 


    const response = await $fetch('/api/donor/123',{ 
        method: 'POST',
        body: { 
            name: name.value,
            address: address.value,
            phone: phone.value,
            email: email.value,
            preferredCommunication: preferredCommunication.value,
            notes: notes.value,
            organization: organization.value,
            lastDonationDate: lastDonationDate.value,
        }
    })

    emit('close')



        }catch(err) { 
            console.log("error",err)
        }
         }

    
  const reset = () => { 
    name.value = ''
    address.value = ""
    phone.value = ""
    email.value = ""
    preferredCommunication.value = "email"
    notes.value =   ""
    organization.value = ""
    lastDonationDate.value = ""
  }
    
    
    
 
    
    
    </script>
        