<template>
	<div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
		<VeeForm v-slot="{ submitCount }" :initial-values="initValues" :validation-schema="schema" class="w-[800px] max-h-[130vh] overflow-y-auto mx-4" @submit="submitEvent">
			<div class="flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
				<h1 class="form-title">Event Information</h1>
			</div>

			<VeeField hidden name="id"></VeeField>
			<VeeField hidden name="index"></VeeField>

			<div class="grid grid-cols-2 gap-4 mb-5">
				<h2 class="form-field-label">Event Name <span class="text-red-500">*</span></h2>
				<h2 class="form-field-label">Event Date <span class="text-red-500">*</span></h2>

				<VeeField autocomplete="off" v-slot="{ field }" :disabled="viewOnly" name="eventName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
					<input
						:disabled="viewOnly"
						autocomplete="off"
						v-bind="field"
						placeholder="Enter event name"
						class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-text"
					/>
				</VeeField>

				<VeeField autocomplete="off" v-slot="{ field }" :disabled="viewOnly" name="eventDate" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
					<input
						:disabled="viewOnly"
						autocomplete="off"
						v-bind="field"
						type="date"
						class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer"
					/>
				</VeeField>

				<div>
					<VeeErrorMessage v-if="submitCount > 0" class="text-red-500" name="eventName" />
				</div>
				<div>
					<VeeErrorMessage v-if="submitCount > 0" class="text-red-500" name="eventDate" />
				</div>
			</div>

			<h2 class="form-field-label mb-2">Description</h2>
			<VeeField autocomplete="off" :disabled="viewOnly" v-slot="{ field }" name="description">
				<textarea
					v-bind="field"
					:disabled="viewOnly"
					rows="5"
					placeholder="Add a description for this event"
					class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
				></textarea>
			</VeeField>

			<div class="flex justify-center gap-4 my-3">
				<button type="button" class="form-button bg-gray-600 hover:bg-gray-700" @click="cancelSubmisison?.()">Cancel</button>
				<button v-if="!viewOnly" class="form-button bg-blue-600 hover:bg-blue-700">Submit</button>
			</div>
		</VeeForm>
	</div>
</template>

<script setup lang="ts">
import * as yup from 'yup';

const props = defineProps<{
	cancelSubmisison?: () => void,
	submitEvent?: (values: Record<string, any>) => Promise<void>,
	viewOnly?: boolean,
	index?: number,
	data?: {
		event: {
			id: string,
			eventName: string,
			eventDate: Date | null,
			description: string | null,
		},
		boardMember?: { name: string } | null,
	},
}>();

const submitEvent = props.submitEvent ?? (async () => undefined);
const viewOnly = props.viewOnly ?? false;

const initValues: Record<string, any> | undefined = props.data ? {
	index: props.index,
	id: props.data.event.id,
	eventName: props.data.event.eventName,
	eventDate: props.data.event.eventDate ? new Date(props.data.event.eventDate).toISOString().split('T')[0] : '',
	description: props.data.event.description,
} : undefined;

const schema = yup.object({
	eventName: yup.string().required('Event name is required'),
	eventDate: yup.date().required('Event date is required'),
	description: yup.string().nullable(),
});
</script>
