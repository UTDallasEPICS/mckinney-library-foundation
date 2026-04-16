<template>
    <div class="bg-[#e5e9ec] p-0 gap-0 border-0 rounded-md">
        <VeeForm :initial-values="initValues" :validation-schema="schema" class= "w-[800px] max-h-[130vh] overflow-y-auto mx-4" @submit="submitDonationForm">
            <div class = "flex flex-col gap-2 sm:text-left px-6 pt-6 pb-4 space-y-0">
              <h1 class = "form-title"> Donation Information</h1>
            </div>
            <VeeField hidden name="id"></VeeField>
            <VeeField  hidden name="index"></VeeField> 
            <div  class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">Donor (Full Name) <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">Event Name</h2>          
                <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="donorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="donor-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="donor-list">
                            <option></option>
                            <option v-if="donors.length > 0" v-for="donor in donors" :value="donor.donor.name"></option>
                        </datalist>
                    </input>
                </VeeField>  
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="event" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <div class="relative">
                        <input
                            ref="eventInputEl"
                            :disabled="viewOnly"
                            autocomplete="off"
                            v-bind="field"
                            placeholder="Type an event name"
                            class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer"
                            @input="handleEventInput(($event.target as HTMLInputElement).value)"
                            @focus="isEventDropdownOpen = true"
                            @blur="closeEventDropdown()"
                        >
                        </input>

                        <div
                            v-if="showEventDropdown"
                            class="absolute left-0 right-0 mt-1 z-10 bg-white border border-gray-300 rounded shadow-sm max-h-40 overflow-y-auto"
                        >
                            <button
                                v-for="eventName in filteredEventOptions"
                                :key="eventName"
                                type="button"
                                class="block w-full text-left px-3 py-2 text-[#2d3e4d] hover:bg-gray-100"
                                @mousedown.prevent="selectExistingEvent(eventName)"
                            >
                                {{ eventName }}
                            </button>

                            <button
                                v-if="showCreateEventOption"
                                type="button"
                                class="block w-full text-left px-3 py-2 text-[#2d3e4d] hover:bg-gray-100 border-t border-gray-200"
                                @mousedown.prevent="requestCreateEvent()"
                            >
                                Create Event
                            </button>
                        </div>
                    </div>
                </VeeField>  
                <div>
                    <VeeErrorMessage class="text-red-500"  name="donorName" />
                </div>
                <div></div>                       
            </div>
            <div class="grid grid-cols-2 gap-4 mb-5">
                <h2 class="form-field-label">Monetary amount</h2>
                <h2 class="form-field-label">Non-Monetary Amount</h2>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="monetaryAmount"/>
                <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="nonMonetaryAmount"/>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="monetaryAmount" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="nonMonetaryAmount" />
                </div>
            </div>
            <div class="grid grid-cols-3 gap-4 mb-5">
                <h2 class="form-field-label">Method <span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">Status<span class = "text-red-500">*</span></h2>
                <h2 class="form-field-label">Received Date<span class = "text-red-500">*</span></h2>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly"name="method" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                    <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="method-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <datalist id="method-list">
                            <option></option>
                            <option v-if="methods.length > 0" v-for="method in methods" :value="method"></option>
                        </datalist>
                    </input>
                </VeeField>
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="status">
                    <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                        <option :disabled="viewOnly" value = 0> Pending </option>
                        <option :disabled="viewOnly" value = 1> Recieved </option>
                    </select>
                </VeeField>
                <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="receivedDate">
                    <input ref="receivedDateInputEl" id="reqDate"  autocomplete="off" :disabled="viewOnly" v-bind="field" type="date"></input>
                </VeeField>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="method" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500"  name="status" />
                </div>
                <div>
                    <VeeErrorMessage class="text-red-500" name="receivedDate" />
                </div>
            </div>
            <h2 class="form-field-label mb-3">Notes</h2>
            <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="notes">
                <textarea v-bind="field" :disabled="viewOnly" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
            </VeeField>
            <h2 class="form-field-label mb-2">Reason</h2>
            <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="reason">
                <textarea v-bind="field" :disabled="viewOnly" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
            </VeeField>
            <div class="flex justify-center gap-4 my-3">
                <button class="form-button bg-gray-600 hover:bg-gray-700" @click="cancelSubmisison">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit </button>
            </div>           
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
import type { Donation, Donor } from '~~/server/utils/generated/prisma/browser';
import * as yup from 'yup';

const props = defineProps<{
    cancelSubmisison:() => void,
    submitDonation: (values: Record<string,any>) => Promise<void>         
    viewOnly: boolean
    index?:number,
    events: string[],
    eventDateLookup?: Record<string, string>,
    methods: string[],
    donors:{donor:Donor, donations:Donation[]}[]
    data?:{donation:Donation,boardMember:{name:string}| null, donor: {name: string | null} | null}
}>();

const emit = defineEmits<{
    (e: 'request-create-event'): void
}>();

const eventInputEl = ref<HTMLInputElement | null>(null);
const receivedDateInputEl = ref<HTMLInputElement | null>(null);
const currentEventInput = ref('');
const isEventDropdownOpen = ref(false);

const filteredEventOptions = computed(() => {
    const normalized = currentEventInput.value.trim().toLowerCase();
    if (!normalized) {
        return props.events;
    }
    return props.events.filter((event) => event.toLowerCase().includes(normalized));
});

const showCreateEventOption = computed(() => {
    const normalized = currentEventInput.value.trim().toLowerCase();
    if (props.viewOnly || normalized.length === 0) {
        return false;
    }
    const eventExists = props.events.some((event) => event.trim().toLowerCase() === normalized);
    return !eventExists;
});

const showEventDropdown = computed(() => {
    return !props.viewOnly && isEventDropdownOpen.value && currentEventInput.value.trim().length > 0;
});

function handleEventInput(value: string) {
    currentEventInput.value = value;
    isEventDropdownOpen.value = true;

    const matchedEventName = getMatchingEventName(value);
    if (matchedEventName) {
        setReceivedDateFromEvent(matchedEventName);
    }
}

function requestCreateEvent() {
    if (eventInputEl.value) {
        eventInputEl.value.value = '';
        eventInputEl.value.dispatchEvent(new Event('input', { bubbles: true }));
        eventInputEl.value.dispatchEvent(new Event('change', { bubbles: true }));
    }
    currentEventInput.value = '';
    isEventDropdownOpen.value = false;
    emit('request-create-event');
}

function selectExistingEvent(eventName: string) {
    if (!eventInputEl.value) {
        return;
    }
    eventInputEl.value.value = eventName;
    currentEventInput.value = eventName;
    eventInputEl.value.dispatchEvent(new Event('input', { bubbles: true }));
    eventInputEl.value.dispatchEvent(new Event('change', { bubbles: true }));
    setReceivedDateFromEvent(eventName);
    isEventDropdownOpen.value = false;
}

function getMatchingEventName(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        return undefined;
    }
    return props.events.find((event) => event.trim().toLowerCase() === normalized);
}

function setReceivedDateFromEvent(eventName: string) {
    if (!receivedDateInputEl.value) {
        return;
    }

    const lookup = props.eventDateLookup ?? {};
    const lookupKey = Object.keys(lookup).find((name) => name.trim().toLowerCase() === eventName.trim().toLowerCase());
    const eventDate = lookupKey ? lookup[lookupKey] : undefined;
    if (!eventDate) {
        return;
    }

    receivedDateInputEl.value.value = eventDate;
    receivedDateInputEl.value.dispatchEvent(new Event('input', { bubbles: true }));
    receivedDateInputEl.value.dispatchEvent(new Event('change', { bubbles: true }));
}

function closeEventDropdown() {
    setTimeout(() => {
        isEventDropdownOpen.value = false;
    }, 100);
}

async function submitDonationForm(values: Record<string, any>) {
    const eventValue = (values.event ?? '').toString().trim();
    if (eventValue.length > 0) {
        const matchedEventName = getMatchingEventName(eventValue);
        if (!matchedEventName) {
            alert('Invalid Event');
            return;
        }
        // Only autofill on submit when date is empty so manual user edits are preserved.
        if (!values.receivedDate) {
            setReceivedDateFromEvent(matchedEventName);
        }
    }
    await props.submitDonation(values);
}

const initValues: Record<string, any> | undefined = props.data ? {
    index:props.index, 
    id: props.data.donation.id,
    donorName: props.data.donor? props.data.donor.name : null,
    event: props.data.donation.event?.eventName ?? '',
    monetaryAmount: props.data.donation.monetaryAmount,
    nonMonetaryAmount:props.data.donation.nonMonetaryAmount,
    method:props.data.donation.method,
    status:props.data.donation.status,
    notes:props.data.donation.notes,
    reason:props.data.donation.reason,
    receivedDate: props.data.donation.receivedDate ? new Date(props.data.donation.receivedDate).toISOString().split('T')[0] : '',
} : undefined

const schema = yup.object({
    donorName: yup.string().required('Enter anonymous if donor unknown'),
    event: yup.string().nullable(),
    monetaryAmount: yup.number().positive().nullable().min(0.01,"minimum is at least 0.01").typeError('must be a number'),
    nonMonetaryAmount: yup.string().nullable().test(
    'amount-not-empty',
    'donation must include either monetary or non-monetary amount',
    function (value) {
        const {monetaryAmount} = this.parent
        return (value != null && value !== '') || (monetaryAmount != null && monetaryAmount !== '')
    }),
    method: yup.string().required('Must enter payment method'),
    status: yup.string().required('Must enter status'),
    receivedDate: yup.date().required("Must be a valid date")
})

</script>