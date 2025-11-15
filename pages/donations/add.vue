<template> 
<div

class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
>
<div class="bg-slate-100 w-[700px] rounded-xl shadow-xl p-8 relative">


<div class="flex items-center justify-between mb-6">
  <h2 class="text-2xl font-semibold text-slate-700">Donor Info</h2>

  <button @click = "emit('close')"  class="text-slate-500 hover:text-slate-700">
    ✕
  </button>
</div>


<div class="grid grid-cols-2 gap-4">
  <div>
    <label class="text-sm text-slate-600">First Name</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Last Name</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Phone Number</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Email</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div class="col-span-2">
    <label class="text-sm text-slate-600">Address</label>
    <input class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
  </div>

  <div>
    <label class="text-sm text-slate-600">Type</label>
    <select class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
      <option>Select</option>
    </select>
  </div>

  <div>
    <label class="text-sm text-slate-600">Communication Preference</label>
    <select class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300">
      <option>Select</option>
    </select>
  </div>
</div>


<div class="flex justify-end gap-3 mt-6">
  <button 
    
    class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg"
  >
    Cancel
  </button>

  <button 
    class="px-4 py-2 bg-slate-700 text-white rounded-lg"
  >
    Submit
  </button>
</div>

</div>
</div>



</template>

<script setup> 

const emit = defineEmits(['close']);
</script>
