<template> 
<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
<div class="bg-slate-100 w-[30vw] h-[75vh] overflow-y-auto  rounded-xl shadow-xl p-8 relative">

<div class="flex items-center justify-between mb-6">
  <h2 class="text-2xl font-semibold text-slate-700">Donor Info</h2>
  <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
</div>

<div class="flex flex-col gap-4">

  <div>
    <label class="text-sm text-slate-600">First Name</label>
    <input v-model="name" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Last Name</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Phone Number</label>
    <input v-model="phone" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Email</label>
    <input v-model="email" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Address</label>
    <input v-model="address" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Type</label>
    <select class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
      <option>Select</option>
    </select>
  </div>

  <div>
    <label class="text-sm text-slate-600">Communication Preference</label>
    <select v-model="preferredCommunication" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
      <option value="">Select</option>
      <option value="email">email</option>
      <option value="phone">phone</option>
      <option value="mail">mail</option>
    </select>
  </div>

</div>

<div class="flex justify-end gap-3 mt-6">
  <button class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Cancel</button>
  <button class="px-4 py-2 bg-slate-700 text-white rounded-lg" @click="submit">Submit</button>
</div>

</div>
</div>
</template>

    
<script setup>


const emit = defineEmits(['close']);


const name = ref("")
const email = ref("")
const phone = ref("")
const address = ref("")
const preferredCommunication = ref("email")
const notes = ref("")


const submit = async () => { 


try {
  
  const response = await $fetch("/api/donors/donors", { 
    method: "POST",
    body: { 
      name: name.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      preferredCommunication: preferredCommunication.value,
      notes: notes.value
    }
  })



}catch(err) { 

  console.log("error",err)
}
}
    
    </script>