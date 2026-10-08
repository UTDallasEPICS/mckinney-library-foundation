<template>
    <div class="flex-1 p-8">
        <div class="my-3 flex flex-wrap justify-start gap-3">
            <button
                class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-slate-700 hover:bg-slate-800 text-white px-6"
                @click="exportCsv"
            >
                Export CSV
            </button>
            <button
                v-if="permissionLevel > 0"
                @click="addFunction()"
                class="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
                Add Event
            </button>
            <button v-if="permissionLevel>1" :disabled="!isEnabled" @click="handleEmailClick" class ="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6">Email Donors</button>
        </div>
        <div class="bg-white rounded-lg shadow-lg overflow-x-auto mx-auto">
            <table class="w-full">
                <thead class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[0]?.active">Event Name</span>
                                <button @click="toggleSearch(0)" v-if="!activeSearch[0]?.active"><FunnelIcon class="w-4 h-4"/></button>
                                <div v-else>
                                    <input autocomplete="off" v-model="searchInputs.eventName" @click.stop class="mt-2 px-2 py-1 border rounded" placeholder="Search Events"/>
                                    <button class="text-lg" @click="toggleSearch(0)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[0]?.active" @click="toggleSort(0)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(0)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[1]?.active">Event Date</span>
                                <button @click="toggleSearch(1)" v-if="!activeSearch[1]?.active"><FunnelIcon class="w-4 h-4"/></button>
                                <div v-else>
                                    <p>start date</p>
                                    <input autocomplete="off" v-model="earliestEventDate" type="date" @click.stop class="mt-2 px-2 py-1 border rounded" placeholder="minimum"/>
                                    <p>end date</p>
                                    <input autocomplete="off" v-model="latestEventDate" type="date" @click.stop class="mt-2 px-2 py-1 border rounded" placeholder="maximum"/>
                                    <button class="text-lg" @click="toggleSearch(1)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[1]?.active" @click="toggleSort(1)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(1)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-4 py-3 text-left text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="w-full flex gap-2">
                                <span v-if="!activeSearch[2]?.active">Last Editor</span>
                                <button @click="toggleSearch(2)" v-if="!activeSearch[2]?.active"><FunnelIcon class="w-4 h-4"/></button>
                                <div v-else>
                                    <input autocomplete="off" v-model="searchInputs.boardName" @click.stop class="mt-2 px-2 py-1 border rounded" placeholder="Search Board Members"/>
                                    <button class="text-lg" @click="toggleSearch(2)">&#x24E7;</button>
                                </div>
                                <button v-if="activeSorts[2]?.active" @click="toggleSort(2)" class="bg-[#c8c9c9] outline-double outline-black"><NumberedListIcon class="w-4 h-4"/></button>
                                <button v-else @click="toggleSort(2)"><NumberedListIcon class="w-4 h-4"/></button>
                            </div>
                        </th>
                        <th class="px-6 py-3 text-center text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Event Donor Count</th>
                        <th class="px-6 py-3 text-center text-xs text-[#2d3e4d] border-b-2 border-[#a8b5bf]">Actions</th>
                        <th v-if="permissionLevel>1" class="px-4 py-3 text-center text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf] cursor-pointer transition-colors">
                            <div class="flex justify-center gap-2">
                                <span>Select</span>
                                <input autocomplete="off" @click="selectAll" type="checkbox" :checked="allSelected"></input>
                            </div> 
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in sortedIndices" :key="row.event.id" class="hover:bg-[#e8f0f7] transition-colors border-b border-gray-200">
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.event.eventName }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ formatDate(row.event.eventDate) }}</td>
                        <td class="px-6 py-4 text-[#2d3e4d] text-left text-sm">{{ row.boardMember?.name }}</td>
                        <td class="px-6 py-4 text-center text-[#2d3e4d]">{{ row.event.donations?.length ?? 0 }}</td>
                        <td class="px-6 py-4">
                            <div class="flex justify-evenly">
                                <button
                                    v-if="permissionLevel > 0"
                                    class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
                                    @click="editFunction(row, index)"
                                >
                                    Edit
                                </button>
                                <button
                                    v-if="permissionLevel > 0"
                                    class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"
                                    @click="deleteFunction(row.event.id, index)"
                                >
                                    Delete
                                </button>
                                <button
                                    class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6"
                                    @click="viewFunction(row, index)"
                                >
                                    View
                                </button>
                            </div>
                        </td>
                        <td v-if="permissionLevel>1" class="px-4 py-3 text-center"> <input v-if="row.event.donations.length > 0" type="checkbox" v-model="selectedEvents[row.event.id]"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Event as PrismaEvent } from '~~/server/utils/generated/prisma/browser';
import { FunnelIcon } from '@heroicons/vue/24/solid';
import { NumberedListIcon } from '@heroicons/vue/24/outline';
import { useCsvExport } from '~/composables/useCsvExport';

type PrismaEventDonations = PrismaEvent & {
    donations: {
        donor: {
            email: string | null
        } | null
    }[]
}

const props = defineProps<{
    data: { event: PrismaEventDonations, boardMember: { name: string } | null }[]
    addFunction: () => void
    emailFunction: (selected: Record<string, boolean>) => Promise<void>
    editFunction: (eventData: { event: PrismaEvent, boardMember: { name: string } | null }, index: number) => Promise<void>
    viewFunction: (eventData: { event: PrismaEvent, boardMember: { name: string } | null }, index: number) => Promise<void>
    deleteFunction: (id: string, index: number) => Promise<void>
    permissionLevel: number
}>();
const { downloadCsv } = useCsvExport()
const selectedEvents = ref<Record<string, boolean>>({})

const selectedCount = computed(() => Object.values(selectedEvents.value).filter(Boolean).length)

function selectAll() {
    const checkAll =!allSelected.value

    props.data.forEach((row) => {
        const hasEmail = row.event.donations?.some(
            donation => donation.donor?.email
        )

        if (hasEmail) {
            selectedEvents.value[row.event.id] = checkAll
        }
    })
}

function handleEmailClick() {
    props.emailFunction(selectedEvents.value)
}

const isEnabled = computed(() => selectedCount.value > 0)
const allSelected = computed(() => 
    selectedCount.value === props.data.filter((row) => 
        row.event.donations?.some(
            donation => donation.donor?.email
        )
    ).length
) 


const activeSearch: Ref<{ name: 'eventName' | 'eventDate' | 'boardName', active: boolean }[]> = ref([
    { name: 'eventName', active: false },
    { name: 'eventDate', active: false },
    { name: 'boardName', active: false },
])

const activeSorts: Ref<{ name: 'eventName' | 'eventDate' | 'boardName', active: boolean }[]> = ref([
    { name: 'eventName', active: false },
    { name: 'eventDate', active: true },
    { name: 'boardName', active: false },
])

const searchInputs = ref({
    eventName: '',
    boardName: '',
})

const earliestEventDate = ref('')
const latestEventDate = ref('')

const toggleSearch = (index: number) => {
    const searchField = activeSearch.value[index]
    if (!searchField) {
        return
    }
    searchField.active = !searchField.active

    if (searchField.name === 'eventName') {
        searchInputs.value.eventName = ''
    }
    if (searchField.name === 'boardName') {
        searchInputs.value.boardName = ''
    }
    if (searchField.name === 'eventDate') {
        earliestEventDate.value = ''
        latestEventDate.value = ''
    }
}

const toggleSort = (index: number) => {
    const sortField = activeSorts.value[index]
    if (!sortField) {
        return
    }
    sortField.active = !sortField.active
}

const visibleIndices = computed(() => {
    return props.data.filter((row) => {
        const eventNameSearch = searchInputs.value.eventName.toLowerCase().trim()
        const boardNameSearch = searchInputs.value.boardName.toLowerCase().trim()

        const eventNameValue = row.event.eventName?.toString().toLowerCase() ?? ''
        const boardNameValue = row.boardMember?.name?.toString().toLowerCase() ?? ''

        if (eventNameSearch && !eventNameValue.includes(eventNameSearch)) {
            return false
        }
        if (boardNameSearch && !boardNameValue.includes(boardNameSearch)) {
            return false
        }

        if (earliestEventDate.value && latestEventDate.value && earliestEventDate.value <= latestEventDate.value) {
            const eventDate = row.event.eventDate ? row.event.eventDate.toISOString().split('T')[0] ?? '' : ''
            if (!(earliestEventDate.value <= eventDate && eventDate <= latestEventDate.value)) {
                return false
            }
        }

        return true
    })
})

const sortedIndices = computed(() => {
    const activeFields = activeSorts.value.filter((field) => field.active)
    if (!activeFields.length) {
        return visibleIndices.value
    }

    return visibleIndices.value.toSorted((a, b) => {
        for (const field of activeFields) {
            let comparison = 0
            switch (field.name) {
                case 'eventName':
                    comparison = (a.event.eventName || '').localeCompare(b.event.eventName || '')
                    break
                case 'eventDate': {
                    const aDate = a.event.eventDate?.toISOString().split('T')[0] || ''
                    const bDate = b.event.eventDate?.toISOString().split('T')[0] || ''
                    comparison = bDate.localeCompare(aDate)
                    break
                }
                case 'boardName':
                    comparison = (a.boardMember?.name || '').localeCompare(b.boardMember?.name || '')
                    break
            }
            if (comparison !== 0) {
                return comparison
            }
        }
        return 0
    })
})

function formatDate(dateValue: Date | null) {
    return dateValue ? dateValue.toISOString().split('T')[0] ?? '' : '';
}

function exportCsv() {
    downloadCsv('events.csv', sortedIndices.value.map((row) => ({
        eventName: row.event.eventName ?? '',
        eventDate: formatDate(row.event.eventDate),
        description: row.event.description ?? '',
        lastEditor: row.boardMember?.name ?? '',
    })))
}

</script>
