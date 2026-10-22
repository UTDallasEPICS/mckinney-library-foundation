<template>
    <DataTable
        :data="data"
        :columns="columns"
        :get-row-id="(row) => row.donor.id"
        :selectable="permissionLevel > 1"
        :can-select="(row) => !!row.donor.email"
        empty="No donors found"
    >
        <template #toolbar="{ selectedRows, getVisibleRows }">
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-slate-700 hover:bg-slate-800 text-white px-6" @click="exportCsv(getVisibleRows())">Export CSV</button>
            <button v-if="permissionLevel > 1" :disabled="selectedRows.length === 0" @click="handleEmailClick(selectedRows)" class="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6">
                Email Donors{{ selectedRows.length ? ` (${selectedRows.length})` : '' }}
            </button>
        </template>
        <template #actions="{ row }">
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row.donor, props.data.indexOf(row))">Edit</button>
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="deleteFunction(row.donor, props.data.indexOf(row))">Delete</button>
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row.donor, props.data.indexOf(row))">View</button>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Donation, Donor } from '~~/server/utils/generated/prisma/browser';
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';
import { useCsvExport } from '~/composables/useCsvExport';

type DonorRow = {donor:Donor, donations:Donation[], boardMember:{name:string} | null}

const props = defineProps<{
    data: DonorRow[]
    emailFunction: (selected:Record<string, boolean>) => Promise<void>
    editFunction: (donor:Donor,idx:number) => Promise<void>
    deleteFunction: (donor:Donor,idx:number) => Promise<void>
    viewFunction: (donor:Donor,idx:number) => Promise<void>
    permissionLevel:number
    }>();
const { downloadCsv } = useCsvExport()

function handleEmailClick(rows: DonorRow[]) {
    props.emailFunction(Object.fromEntries(rows.map((row) => [row.donor.id, true])))
}

const firstDonation = (row: DonorRow) => row.donations?.[0]?.receivedDate
const lastDonation = (row: DonorRow) => row.donations?.[row.donations.length - 1]?.receivedDate

const columns: DataTableColumn<DonorRow>[] = [
    { id: 'name', header: 'Name', value: (row) => row.donor.name },
    { id: 'author', header: 'Author', value: (row) => row.donor.isAuthor ? 'true' : 'false', sortDesc: true },
    { id: 'organization', header: 'Organization', value: (row) => row.donor.organization },
    { id: 'email', header: 'Email', value: (row) => row.donor.email },
    { id: 'phone', header: 'Phone', value: (row) => row.donor.phone },
    { id: 'firstDonoDate', header: 'First Donation', type: 'date', value: firstDonation },
    { id: 'lastDonoDate', header: 'Last Donation', type: 'date', value: lastDonation },
    { id: 'boardMember', header: 'Last Editor', value: (row) => row.boardMember?.name },
]

function formatDate(value: Date | string | null | undefined) {
    if (!value) {
        return ''
    }

    if (value instanceof Date) {
        return value.toISOString().split('T')[0]
    }

    return value.toString().split('T')[0]
}

function exportCsv(rows: DonorRow[]) {
    downloadCsv('donors.csv', rows.map((row) => ({
        name: row.donor.name ?? '',
        author: row.donor.isAuthor ? 'true' : 'false',
        organization: row.donor.organization ?? '',
        email: row.donor.email ?? '',
        phone: row.donor.phone ?? '',
        firstDonation: formatDate(firstDonation(row)),
        lastDonation: formatDate(lastDonation(row)),
        lastEditor: row.boardMember?.name ?? '',
    })));
}
</script>
