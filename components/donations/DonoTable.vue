<template>
    <div class="flex-1 p-8 ">
        <div class = "bg-white rounded-lg shadow-lg overflow-hidden mx-auto">
            <button :disabled="!isEnabled" v-if="multiSelectFunction" @click="multiSelectFunction(isChecked)" class ="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6 my-3 ">{{ multiSelectName }}</button>
            <table class="w-full">
                <thead  class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th v-for="column in columns" :key="String(column.key)" class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">{{ column.label }}</th>
                        <th class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">Actions</th>
                        <th class="px-4 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            Select
                            <!-- <input type="checkbox"></input> -->
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row,idx) in data" :key="idx" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200 cursor-pointer">
                        <td v-for="column in columns" :key="String(column.key)" class="px-6 py-4 text-[#2d3e4d] text-left">{{ row[column.key]}}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="acceptFunction(row)"> {{ props.acceptName }} </button>
                                <button class ="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click ="deleteFunction(row)"> {{ props.denyName }}  </button>
                            </div>
                        </td>
                        <td>
                             <input class= "" v-if="canMultiSelect" v-model="isChecked[idx]" type="checkbox"></input>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts" generic="T">
type Column<T> ={
    key: keyof T,
    label: string
};
type Props<T> = {
    data: T[],
    columns: Column<T>[],
    canMultiSelect: boolean
    acceptName: string,
    denyName: string,
    multiSelectName?: string,
    acceptFunction: (value:T) => Promise<void>
    deleteFunction: (value:T) => Promise<void>  
    multiSelectFunction?: (selected:boolean[]) => Promise<void>
};
const props = defineProps<Props<T>>();

const isChecked: Ref<boolean[]> = ref([])

props.data.forEach( (item,index) =>{
    isChecked.value[index] = false;
})

const selectedCount = computed(() => 
  isChecked.value.filter(Boolean).length
);
const isEnabled  = computed(() => selectedCount.value > 0);


//if we want to transition column headers on hover hover:bg-[#b5c5d3]
</script>