<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :validation-schema="groupEmailSchema" class= "w-[800px] max-h-[130vh] overflow-y-auto" @submit="groupEmail">
            <div class = "flex flex-col gap-2 text-center sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Send Email to {{ emailList.length }} Donors</h1>
            </div>         
            <div class = "px-6 pb-6 space-y-4">
              <div class="p-2.5 rounded-md mb-4 bg-[#f5f5f5]">
                <p>Recipients: {{ props.nameList }}</p>
              </div>
              <div>
                <h2 class = "form-field-label">Subject</h2>
                <VeeErrorMessage name="Subject"/>
                <VeeField autocomplete="off" v-slot="{field}" name="Subject">
                  <input autocomplete="off" v-bind="field" class="form-input"></input>
                </VeeField>
              </div>
              <div>
                <h2>Message</h2>
                <VeeErrorMessage name="Message"/>
                <VeeField autocomplete="off" v-slot="{field}" name="Message">
                  <textarea v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
                </VeeField>
              </div>            
              <div class="flex justify-center gap-4">   
                <button class ="form-button bg-red-600 hover:bg-red-700" @click="cancelEmail">Cancel</button>
                <button class ="form-button bg-blue-600 hover:bg-blue-700">Send Email</button>
              </div>
            </div>       
        </VeeForm>
      </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
    const props = defineProps<{
        nameList:string,
        emailList:string[],
        groupEmail: (values: Record<string, any>) => Promise<void>,
        cancelEmail: () => void
    }>();
const groupEmailSchema = yup.object({
  Subject: yup.string().required(),
  Message: yup.string().required(),
});

</script>