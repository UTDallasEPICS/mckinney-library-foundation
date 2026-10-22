<template>
    <DataTable
        :data="data"
        :columns="columns"
        :get-row-id="(row) => row.event.id"
        :default-sorts="['eventDate']"
        :selectable="permissionLevel > 1"
        :can-select="(row) => row.event.donations.length > 0"
        empty="No events found"
    >
        <template #toolbar="{ selectedRows, getVisibleRows }">
            <button
                class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-slate-700 hover:bg-slate-800 text-white px-6"
                @click="exportCsv(getVisibleRows())"
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
            <button
                v-if="permissionLevel > 1"
                :disabled="selectedRows.length === 0"
                @click="handleEmailClick(selectedRows)"
                class="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
                Email Donors{{ selectedRows.length ? ` (${selectedRows.length} events)` : '' }}
            </button>
        </template>
        <template #actions="{ row }">
            <button
                v-if="permissionLevel > 0"
                class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
                @click="editFunction(row, props.data.indexOf(row))"
            >
                Edit
            </button>
            <button
                v-if="permissionLevel > 0"
                class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6"
                @click="deleteFunction(row.event.id, props.data.indexOf(row))"
            >
                Delete
            </button>
            <button
                class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6"
                @click="viewFunction(row, props.data.indexOf(row))"
            >
                View
            </button>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Event as PrismaEvent } from '~~/server/utils/generated/prisma/browser';
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';
import { useCsvExport } from '~/composables/useCsvExport';

type PrismaEventDonations = PrismaEvent & {
    donations: {
        donor: {
            email: string | null
        } | null
    }[]
}

type EventRow = { event: PrismaEventDonations, boardMember: { name: string } | null }

const props = defineProps<{
    data: EventRow[]
    addFunction: () => void
    emailFunction: (selected: Record<string, boolean>) => Promise<void>
    editFunction: (eventData: { event: PrismaEvent, boardMember: { name: string } | null }, index: number) => Promise<void>
    viewFunction: (eventData: { event: PrismaEvent, boardMember: { name: string } | null }, index: number) => Promise<void>
    deleteFunction: (id: string, index: number) => Promise<void>
    permissionLevel: number
}>();
const { downloadCsv } = useCsvExport()

function handleEmailClick(rows: EventRow[]) {
    props.emailFunction(Object.fromEntries(rows.map((row) => [row.event.id, true])))
}

const columns: DataTableColumn<EventRow>[] = [
    { id: 'eventName', header: 'Event Name', value: (row) => row.event.eventName },
    { id: 'eventDate', header: 'Event Date', type: 'date', value: (row) => row.event.eventDate, sortDesc: true },
    { id: 'boardName', header: 'Last Editor', value: (row) => row.boardMember?.name },
    { id: 'donorCount', header: 'Event Donor Count', type: 'number', value: (row) => row.event.donations?.length ?? 0, sortable: false, filterable: false, align: 'center' },
]

function formatDate(dateValue: Date | null) {
    return dateValue ? dateValue.toISOString().split('T')[0] ?? '' : '';
}

function exportCsv(rows: EventRow[]) {
    downloadCsv('events.csv', rows.map((row) => ({
        eventName: row.event.eventName ?? '',
        eventDate: formatDate(row.event.eventDate),
        description: row.event.description ?? '',
        lastEditor: row.boardMember?.name ?? '',
    })))
}

</script>
