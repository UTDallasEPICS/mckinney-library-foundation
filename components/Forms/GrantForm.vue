<template>
    <div class="bg-[#e5e9ec] rounded-md p-6 flex justify-center items-start">
        <VeeForm :initial-values="initValues" :validation-schema="schema" class= "w-full sm:w-[700px] max-h-[80vh] overflow-y-auto" @submit="submitGrant">
            <div class = "px-6 pt-6 pb-5">
              <h1 class = "form-title"> Grant Information</h1>
            </div>
            <VeeField hidden name="id"></VeeField>
            <VeeField  hidden name="index"></VeeField> 
            <div class="grid grid-cols-2 gap-6 px-6 mb-4">
                <div>
                    <h2 class="form-field-label mb-2">Grantor <span class = "text-red-500">*</span></h2>
                    <VeeField autocomplete="off" v-slot="{field}" :disabled="viewOnly" name="grantorName" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <div class="relative">
                        <input
                            ref="grantorInputEl"
                            :disabled="viewOnly"
                            autocomplete="off"
                            v-bind="field"
                            placeholder="Type a grantor's name"
                            class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77]"
                            @input="handleGrantorInput(($event.target as HTMLInputElement).value)"
                            @focus="isGrantorDropdownOpen = true"
                            @blur="closeGrantorDropdown()"
                        >
                        </input>
                        <div
                            v-if="showGrantorDropdown"
                            class="absolute left-0 right-0 mt-1 z-10 bg-white border border-gray-300 rounded shadow-sm max-h-40 overflow-y-auto"
                        >
                            <button
                                v-for="grantor in filteredGrantorOptions"
                                :key="grantor.grantor.name"
                                type="button"
                                class="block w-full text-left px-3 py-2 text-[#2d3e4d] hover:bg-gray-100"
                                @mousedown.prevent="selectExistingGrantor(grantor.grantor.name)"
                            >
                                {{ grantor.grantor.name }}
                            </button>

                            <button
                                v-if="showCreateGrantorOption"
                                type="button"
                                class="block w-full text-left px-3 py-2 text-[#2d3e4d] hover:bg-gray-100 border-t border-gray-200"
                                @mousedown.prevent="requestCreateGrantor()"
                            >
                                Create Grantor
                            </button>
                        </div>
                    </div>
                    </VeeField>  
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm" name="grantorName" />
                </div>

                <div>
                    <h2 class="form-field-label mb-2">Purpose <span class = "text-red-500">*</span></h2>                     
                    <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="purpose" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="purpose-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                            <datalist id="purpose-list">
                                <option></option>
                                    <option v-if="purposes.length > 0" v-for="purpose in purposes" :value="purpose"></option>
                            </datalist> 
                        </input>
                    </VeeField>  
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm"  name="purpose" />
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-6 px-6 mb-4">
                <div>
                    <h2 class="form-field-label mb-2">Monetary Amount</h2>
                    <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="monetaryAmount"/>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm"  name="monetaryAmount" />
                </div>

                <div>
                    <h2 class="form-field-label mb-2">Non-Monetary Amount</h2>
                    <VeeField autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="nonMonetaryAmount"/>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm"  name="nonMonetaryAmount" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 px-6 mb-4">
                <div>
                    <h2 class="form-field-label mb-2">Method <span class = "text-red-500">*</span></h2>
                    <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly"name="method" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <input :disabled="viewOnly" autocomplete="off" v-bind="field" list="method-list" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                            <datalist id="method-list">
                                <option></option>
                                <option v-if="methods.length > 0" v-for="method in methods" :value="method"></option>
                            </datalist>
                        </input>
                    </VeeField>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm"  name="method" />
                </div>

                <div>
                    <h2 class="form-field-label mb-2">Status<span class = "text-red-500">*</span></h2>           
                    <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="status">
                        <select :disabled="viewOnly" v-bind="field" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer">
                            <option :disabled="viewOnly" value = 0> Pending </option>
                            <option :disabled="viewOnly" value = 1> Received </option>
                        </select>
                    </VeeField>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm"  name="status" />
                </div>
            </div>

            <div class="grid grid-cols-2 gap-6 px-6 mb-4">
                <div>
                    <h2 class="form-field-label mb-2">Proposed Date</h2>
                    <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="proposedDate">
                        <input id="propDate"  autocomplete="off" :disabled="viewOnly" v-model="proposedDateRef" v-bind="field" type="date" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer"></input>
                    </VeeField>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm" name="proposedDate" />
                </div>

                <div>
                    <h2 class="form-field-label mb-2">Received Date<span class = "text-red-500">*</span></h2>
                    <VeeField v-slot="{field}" autocomplete="off" :disabled="viewOnly" class="form-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" name="receivedDate">
                        <input id="reqDate"  autocomplete="off" :disabled="viewOnly" v-model="recievedDateRef" v-bind="field" type="date" class="w-full px-3 py-2 bg-white border border-gray-300 rounded text-[#2d3e4d] focus:outline-none focus:ring-2 focus:ring-[#5a6a77] cursor-pointer"></input>
                    </VeeField>
                    <VeeErrorMessage class="min-h-[20px] text-red-500 text-sm" name="recievedDate" />
                </div>
            </div>
            
            <div class = "gap-4 px-6 mb-5">
                <VeeField v-slot="{field}" name="reimburse" type="checkbox" :value="true" :unchecked-value="false">
                        <div class="flex items-center gap-2">
                            <input
                                v-bind="field"
                                type="checkbox"
                                id="reimburse"
                                :disabled="viewOnly"
                                class="accent-[#64748b] w-4 h-4 mt-[10px]"
                            />
                            <label for="reimburse" class="form-field-label">Will this grant reimburse MPLF?</label>
                        </div>
                </VeeField>
            </div>

            <div class="px-6 mb-6">
                <h2 class="form-field-label mb-2">Notes</h2>
                <VeeField autocomplete="off" :disabled="viewOnly" v-slot="{field}" name="notes">
                    <textarea v-bind="field" class="form-field focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"></textarea>
                </VeeField>
            </div>

            <div class="flex justify-center gap-4 pb-6">
                <button class="form-button bg-gray-600 hover:bg-gray-700" @click="cancelSubmisison">Cancel</button>
                <button v-if="!viewOnly" class ="form-button bg-blue-600 hover:bg-blue-700">Submit </button>
            </div>           
        </VeeForm>
    </div>
</template>

<script setup lang="ts">
import type { Grant, Grantor } from '~~/server/utils/generated/prisma/browser';
import * as yup from 'yup';

const props = defineProps<{
    cancelSubmisison:() => void,
    submitGrant: (values: Record<string,any>) => Promise<void>         
    viewOnly: boolean
    index?:number,
    purposes: string[],
    methods: string[],
    grantors:{grantor:Grantor, grants:Grant[]}[]
    data?:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string | null} | null},
}>();

const recievedDateRef = ref(new Date().toISOString());
const proposedDateRef = ref('');
const grantorInputEl = ref<HTMLInputElement | null>(null);
const currentGrantorInput = ref('');
const isGrantorDropdownOpen = ref(false);
const initValues = props.data?{
    index:props.index, 
    id: props.data.grant.id,
    grantorName: props.data.grantor? props.data.grantor.name : null,
    purpose: props.data.grant.purpose,
    monetaryAmount: props.data.grant.monetaryAmount,
    nonMonetaryAmount:props.data.grant.nonMonetaryAmount,
    method:props.data.grant.method,
    status:props.data.grant.status,
    notes:props.data.grant.notes,
    reimburse: Boolean(props.data?.grant.reimburse),
    //props.data?.grant.reimburse ?? false,
    // Boolean(props.data?.grant.reimburse),
    receivedDate: props.data.grant.receivedDate? props.data.grant.receivedDate.toISOString().split('T')[0] : '',
    proposedDate: props.data.grant.proposedDate? props.data.grant.proposedDate.toISOString().split('T')[0] : '',
}: undefined

// donor dropdown
const filteredGrantorOptions = computed(() => {
    const normalized = currentGrantorInput.value.trim().toLowerCase();
    if (!normalized) {
        return props.grantors;
    }
    return props.grantors.filter((grantor) => grantor.grantor.name.toLowerCase().includes(normalized));
});

const showCreateGrantorOption = computed(() => {
    const normalized = currentGrantorInput.value.trim().toLowerCase();
    if (props.viewOnly || normalized.length === 0) {
        return false;
    }
    const grantorExists = props.grantors.some((grantor) => grantor.grantor.name.trim().toLowerCase() === normalized);
    return !grantorExists;
});

const showGrantorDropdown = computed(() => {
    return !props.viewOnly && isGrantorDropdownOpen.value && currentGrantorInput.value.trim().length > 0;
});

function handleGrantorInput(value: string) {
    currentGrantorInput.value = value;
    isGrantorDropdownOpen.value = true;
}

function requestCreateGrantor() {
    if (grantorInputEl.value) {
        grantorInputEl.value.value = '';
        grantorInputEl.value.dispatchEvent(new Event('input', { bubbles: true }));
        grantorInputEl.value.dispatchEvent(new Event('change', { bubbles: true }));
    }
    currentGrantorInput.value = '';
    isGrantorDropdownOpen.value = false;
    //emit('request-create-grantor');
}

function selectExistingGrantor(donorName: string) {
    if (!grantorInputEl.value) {
        return;
    }
    grantorInputEl.value.value = donorName;
    currentGrantorInput.value = donorName;
    grantorInputEl.value.dispatchEvent(new Event('input', { bubbles: true }));
    grantorInputEl.value.dispatchEvent(new Event('change', { bubbles: true }));
    isGrantorDropdownOpen.value = false;
}

function getMatchingGrantorName(value: string) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
        return undefined;
    }
    return props.grantors.find((grantor) => grantor.grantor.name.trim().toLowerCase() === normalized);
}

function closeGrantorDropdown() {
    setTimeout(() => {
        isGrantorDropdownOpen.value = false;
    }, 100);
}

if(initValues && initValues.receivedDate != ''){
    recievedDateRef.value = initValues.receivedDate;
}

const schema = yup.object({
    grantorName: yup.string().required('Enter anonymous if grantor unknown'),
    purpose: yup.string().required('Enter "none" if not associated with a purpose'),
    reimburse: yup.boolean(),
    monetaryAmount: yup.number().nullable().min(0.01,"minimum is at least 0.01").typeError('must be a number'),
    nonMonetaryAmount: yup.string().nullable().test(
    'amount-not-empty',
    'Grant must include either monetary or non-monetary amount',
    function (value) {
        const {monetaryAmount} = this.parent
        return (value != null && value !== '') || (monetaryAmount != null && monetaryAmount !== '')
    }),
    method: yup.string().required('Must enter payment method'),
    status: yup.string().required('Must enter status'),
    recievedDate: yup.string().test('date-not-empty', 'Received Date must be entered', ()=>{
        return recievedDateRef.value !== ''
    }),
    proposedDate: yup.string().nullable(),
})

</script>