<template>
    <DataTable
        :data="data"
        :columns="columns"
        :get-row-id="(row) => row.grantor.id"
        :selectable="permissionLevel > 1"
        :can-select="(row) => !!row.grantor.email"
        empty="No grantors found"
    >
        <template #toolbar="{ selectedRows, getVisibleRows }">
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-slate-700 hover:bg-slate-800 text-white px-6" @click="exportCsv(getVisibleRows())">Export CSV</button>
            <button v-if="permissionLevel > 1" :disabled="selectedRows.length === 0" @click="handleEmailClick(selectedRows)" class="disabled:bg-slate-300 rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6">
                Email Grantors{{ selectedRows.length ? ` (${selectedRows.length})` : '' }}
            </button>
        </template>
        <template #actions="{ row }">
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row.grantor, props.data.indexOf(row))">Edit</button>
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="deleteFunction(row.grantor, props.data.indexOf(row))">Delete</button>
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row.grantor, props.data.indexOf(row))">View</button>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Grant, Grantor } from '~~/server/utils/generated/prisma/browser';
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';
import { useCsvExport } from '~/composables/useCsvExport';

type GrantorRow = {grantor:Grantor, grants:Grant[], boardMember:{name:string} | null}

const props = defineProps<{
    data: GrantorRow[]
    emailFunction: (selected: Record<string, boolean>) => Promise<void>
    editFunction: (grantor:Grantor,idx:number) => Promise<void>
    deleteFunction: (grantor:Grantor,idx:number) => Promise<void>
    viewFunction: (grantor:Grantor,idx:number) => Promise<void>
    permissionLevel:number
}>();
const { downloadCsv } = useCsvExport()

function handleEmailClick(rows: GrantorRow[]) {
    props.emailFunction(Object.fromEntries(rows.map((row) => [row.grantor.id, true])))
}

const firstGrant = (row: GrantorRow) => row.grants?.[0]?.receivedDate
const lastGrant = (row: GrantorRow) => row.grants?.[row.grants.length - 1]?.receivedDate

const columns: DataTableColumn<GrantorRow>[] = [
    { id: 'name', header: 'Name', value: (row) => row.grantor.name },
    { id: 'organization', header: 'Organization', value: (row) => row.grantor.organization },
    { id: 'email', header: 'Email', value: (row) => row.grantor.email },
    { id: 'phone', header: 'Phone', value: (row) => row.grantor.phone },
    { id: 'firstDonoDate', header: 'First Grant', type: 'date', value: firstGrant },
    { id: 'lastDonoDate', header: 'Last Grant', type: 'date', value: lastGrant },
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

function exportCsv(rows: GrantorRow[]) {
    downloadCsv('grantors.csv', rows.map((row) => ({
        name: row.grantor.name ?? '',
        organization: row.grantor.organization ?? '',
        email: row.grantor.email ?? '',
        phone: row.grantor.phone ?? '',
        firstGrant: formatDate(firstGrant(row)),
        lastGrant: formatDate(lastGrant(row)),
        lastEditor: row.boardMember?.name ?? '',
    })));
}
</script>
