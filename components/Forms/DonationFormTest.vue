<script setup lang="ts">
import { object, string } from 'yup'
import { reactive, useTemplateRef } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
    email: string().email('Invalid email').required('Required'),
})

type Schema = z.input<typeof schema>
const value = ref('')
const state = reactive({
    donor: '',
    monetaryAmount: '',
    nonMonetaryAmount: '',
    status: '',
    method: '',
    textarea: '',
    notes: '',
    reason: '',
})

const items = [
    { label: 'Pending', value: 'pending'},
    { label: 'Received', value: 'receiving'},
]

</script>

<template>
    <UForm>
        <UFormField label="Donor" required>
            <UInput v-model="value" />
        </UFormField>
        <UFormField label="Method">
            <UInput v-model="value" />
        </UFormField>
        <UInputNumber :default-value="0" />
        <UFormField label="Status">
            <USelect v-model="state.status" :items="items" class="w-full" />
        </UFormField>
        <UFormField label="Notes">
            <UTextarea v-model="state.notes" class="w-full" :rows="2"/>
        </UFormField>
        <UFormField label="Reason">
            <UTextarea v-model="state.reason" class="w-full" :rows="2"/>
        </UFormField>
    </UForm>
</template>