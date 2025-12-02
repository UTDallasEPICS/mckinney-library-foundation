<template>
  <div class="flex-1 p-8 ">
    <div class= "bg-white rounded-lg shadow-lg overflow-hidden max-w-7xl mx-auto">
      <table class="w-full">
        <thead class="bg-[#5a6a77] text-white">
          <tr>
            <th class="px-6 py-4 text-center text-sm cursor-pointer">
              <div class= "w-full">
                <span @click="toggleSearch('name')" v-if="activeSearch !== 'name'">Name ↑↓</span>
                <div  v-else>
                    <input autocomplete="off" v-model="searchInputs.name" @click.stop class="mt-2 text-black px-2 py-1 border rounded"placeholder="Search Accounts"/>
                    <button class="text-lg" @click="toggleSearch('name')">&#x24E7;</button>
                </div>
              </div>
            </th>
            <th class="px-6 py-4 text-center text-sm cursor-pointer">
              <div class = w-full>
                <span @click="toggleSearch('email')" v-if="activeSearch !== 'email'">Email ↑↓</span>
                <div  v-else>
                    <input autocomplete="off" v-model="searchInputs.email" @click.stop class="mt-2 text-black px-2 py-1 border rounded"placeholder="Search Accounts"/>
                    <button class="text-lg" @click="toggleSearch('email')">&#x24E7;</button>
                </div>
              </div>
            </th>
            <th class="px-6 py-4 text-center text-sm">Role</th>
            <th class="px-6 py-4 text-center text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(account,index) in visibleIndices" :key="index" class="bg-[#e5e9ec]">
            <td class="px-6 py-4 text-[#2d3e4d] text-center"> {{ account.name }}</td>
            <td class="px-6 py-4 text-[#2d3e4d] text-center">{{ account.email }} </td> 
            <td class="px-6 py-4">
                <select :disabled="(parseInt(permissions[index]) >= permissionLevel) && permissionLevel < 3" v-model="permissions[index]" @change="updatePermission(account.id,permissions[index],account.status)" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] cursor-pointer">
                    <option value="0">Viewer</option>
                    <option value="1">Editor</option>
                    <option :disabled="permissionLevel < 3" value="2">Admin</option>
                    <option :disabled="permissionLevel < 3" value="3">Main Admin</option>
                </select>
            </td>
            <td  class="px-6 py-4">
              <div v-if="parseInt(permissions[index]) < permissionLevel" class="flex justify-evenly">
                <button v-if="!account.status" class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="freezeAccount(account)"> Freeze</button>
                <button v-else class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6" @click="freezeAccount(account)"> Unfreeze </button>
                <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="deleteAccount(account.id,index)"> Delete  </button>
                <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="editAccount(index)"> Edit </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  accounts: {id:string, name:string, email:string, permission:number, status:boolean}[]
  editAccount:(index:number) => void
  permissionLevel:number
}>();

const permissions = ref(["1"]);
if(props.accounts){
    for(let i = 0; i < props.accounts.length; i++){
        permissions.value[i] = props.accounts[i].permission.toString();
    }
}

async function updatePermission(id:string,permission:string, status:boolean){
    await $fetch(`/api/user/${id}`,{
        method:"PATCH",
        body:{
            permission:Number(permission),
            status:status,
            permissionLevel:props.permissionLevel
        }
    }
    )
}

async function freezeAccount(account: {id: string, name: string, email: string, permission: number, status: boolean}){
  const id = account.id;
  const {success} = await $fetch(`/api/user/${id}`,{
      method: "PATCH",
      body:{
        status: !account.status,
        permission:account.permission,
        permissionLevel:props.permissionLevel
      }
    });
    if(success){
      account.status = !account.status;
    }
}

async function deleteAccount(id:string, index:number){
  const {success} = await $fetch(`/api/user/${id}`,{
    method:"DELETE",
    body:{
      permissionLevel:props.permissionLevel
    }
  })
  if(success){
    props.accounts.splice(index,1);
  }
  
}

const activeSearch = ref<'name' | 'email' | null>(null)
const searchInputs = ref({ name:'', email:''})
const searchFields = ['name', 'email'] as const


  const toggleSearch = (field: 'name' | 'email') => {
    activeSearch.value = activeSearch.value === field ? null : field
    searchInputs.value[field] = '';
  }

const visibleIndices = computed(() => {
  return props.accounts.filter((row) =>
    searchFields.every((field) => {
      const search = searchInputs.value[field].toLowerCase().trim() 
      if (!search){
          return true
      } 
      const value = ref('');
      
      value.value = (row[field] || '').toString().toLowerCase()   
      return value.value.includes(search) 
    })
  )
})
</script>