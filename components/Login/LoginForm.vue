<template>
    <div>
        <VeeForm :validation-schema="validation" @submit="submitAction">
            <label class="text-[13px] text-[#6b7785] mb-1.5 block" style="font-weight: 500;"> {{ message }}</label>
            <VeeErrorMessage class="text-red-500" :name= "fieldName"/>
            <VeeField v-slot="{field}" :name="fieldName" :placeholder="placeholderTxt" :type ="fieldType">
                <input v-bind="field" 
                class ="font-medium border-gray-200 w-full min-w-0 rounded-md bg-[#f5f6f8] border h-12 text-[15px] px-3 py-1 outline-none"
                :placeholder="placeholderTxt"></input>
            </VeeField>
            <button class ="font-medium outline-none px-4 py-2 w-full h-12 bg-gradient-to-r from-[#4a5f7a] to-[#3d4d5c] text-white mt-6 text-[15px] shadow-lg 
                    hover:shadow-xl transition-all rounded-xl"> Submit 
        </button>  
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
    import * as yup from "yup"

const props = defineProps<{
        message: string,
        placeholderTxt: string,
        fieldName: string,
        fieldType: string,
        validation:  yup.AnySchema,
        function: (values: Record<string, any>) => Promise<void>,
}>();

const submitAction = props.function;

</script>