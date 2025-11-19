<template>
    <div>
        <VeeForm :validation-schema="validation" @submit="submitAction">
            <label class="form-field-label" style="font-weight: 500;"> {{ message }}</label>
            <VeeErrorMessage class="text-red-500" :name= "fieldName"/>
            <VeeField v-slot="{field}" :name="fieldName" :placeholder="placeholderTxt" :type ="fieldType">
                <input v-bind="field" 
                class ="form-input bg-[#f5f6f8]"
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