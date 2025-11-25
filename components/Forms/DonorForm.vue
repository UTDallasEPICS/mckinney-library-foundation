<template> 
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-slate-100  w-[30vw] h-[75vh] overflow-y-auto rounded-xl shadow-xl p-8 relative">
    
    <div class="flex items-center justify-between mb-6">
    <h2 class="text-2xl font-semibold text-slate-700">Donor Info</h2>
    <button @click="emit('close')" class="text-slate-500 hover:text-slate-700">✕</button>
    </div>
    
    <div class="flex flex-col gap-4">
    
    <div>
    <label class="text-sm text-slate-600">name<span class = "text-red-500">*</span></label>
    <input v-model = "name" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    <div>
    <label class="text-sm text-slate-600">address<span class = "text-red-500">*</span></label>
    <input v-model = "address"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600">phone</label>
    <input v-model = "phone" type="number" pattern="[\d\s\-\(\)]{7,15}"  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    
    <div>
    <label class="text-sm text-slate-600" >email<span class = "text-red-500">*</span></label>
    <input v-model = "email" type = 'email'  class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300"></input>
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
    <label class="text-sm text-slate-600">weblink</label>
    <input v-model="webLink" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
 
    <div>
    <label class="text-sm text-slate-600">Date<span class = "text-red-500">*</span></label>
    <input v-model = "lastDonationDate" type="date" class="w-full mt-1 px-3 py-2 rounded-md border border-slate-300" />
    </div>
    
    </div>
    
    <div class="flex justify-end gap-3 mt-6">
    <button @click = "reset()"class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg">Clear</button>
    <button @click = "submit()" class="px-4 py-2 bg-slate-700 text-white rounded-lg">Submit</button>
    </div>
    
    </div>
    </div>
</template>
    
<script setup> 
    import { ref,onMounted } from 'vue';
    
    const emit = defineEmits(['close','update-donors','add-donor']);
    
    const name = ref('')
    const address = ref("")
    const phone = ref("")
    const email = ref("")
    const preferredCommunication = ref("email")
    const notes =   ref("")
    const organization = ref("")
    const lastDonationDate = ref("")
    const webLink = ref("")

    const props = defineProps({
        apiMethod: {
            type: String,
            default: 'POST'
        },
        donorId: {
            type: String,
            default: ""
        },
        permissionLevel:{
            default:0
        }
    })
    console.log("props permission level" + props.permissionLevel)
    onMounted(() => { 
        if(props.apiMethod === 'PATCH' && props.donorId) {
            const getInfo = async () => { 
                try { 
                    const response = await $fetch(`/api/donor/${props.donorId}`)
                    name.value = response.data.name
                    address.value = response.data.address
                    phone.value = response.data.phone
                    email.value = response.data.email
                    preferredCommunication.value = response.data.preferredCommunication
                    notes.value = response.data.notes
                    organization.value = response.data.organization
                    lastDonationDate.value = response.data.lastDonationDate?.slice(0,10)
                    webLink.value = response.data.webLink
                }catch(err) { 
                    console.log("error",err)
                }
            }       
            getInfo()
      
        }
    })
    const submit = async () => {
        try { 
            if(!name.value || !address.value || !email.value || !lastDonationDate.value) { 
                alert("Please fill in all required fields")
                return
            }
            const url = ref("/api/donor/");
            if(props.apiMethod == 'PATCH'){
                url.value += `${props.donorId}`
            }
            const response = await $fetch(url.value,{ 
                method: props.apiMethod,
                body: {
                    permissionLevel:props.permissionLevel,
                    name: name.value,
                    address: address.value,
                    phone: `${phone.value}`,
                    email: email.value,
                    preferredCommunication: preferredCommunication.value,
                    notes: notes.value,
                    organization: organization.value,
                    lastDonationDate: lastDonationDate.value,
                    webLink: webLink.value
                }
    })


    emit('update-donors', response.data)

    console.log("api method",props.apiMethod) 
    
    console.log('id',props.donorId)

    emit('add-donor', response.data)

    // console.log("response",response.data)

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


        