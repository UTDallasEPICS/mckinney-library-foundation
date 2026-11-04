<template>
    <DataTable
        :data="fiscalYearRows"
        :columns="columns"
        :get-row-id="(row) => row.grant.id"
        :default-sorts="['receivedDate']"
        empty="No grants found"
    >
        <template #toolbar="{ getVisibleRows }">
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-slate-700 hover:bg-slate-800 text-white px-6" @click="exportCsv(getVisibleRows())">Export CSV</button>
            <select v-model="fiscalYearFilter" class="h-9 px-3 border border-gray-300 rounded-md bg-white text-sm text-[#2d3e4d]">
                <option value="all">All fiscal years</option>
                <option value="current">Current fiscal year (FY{{ currentFiscalYear }})</option>
                <option value="past">Past fiscal years</option>
                <option v-for="fy in pastFiscalYears" :key="fy" :value="String(fy)">FY{{ fy }}</option>
            </select>
        </template>
        <template #actions="{ row }">
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-blue-600 hover:bg-blue-700 text-white px-6" @click="editFunction(row, props.data.indexOf(row))">Edit</button>
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="deleteFunction(row.grant.id, props.data.indexOf(row))">Delete</button>
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row, props.data.indexOf(row))">View</button>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Grant } from '~~/server/utils/generated/prisma/browser';
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';
import { useCsvExport } from '~/composables/useCsvExport';

type GrantRow = {grant:Grant,boardMember:{name:string} | null, grantor: {name: string} | null}

const props = defineProps<{
    data: GrantRow[],
    editFunction: (grantData:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number) => Promise<void>,
    viewFunction: (grantData:{grant:Grant,boardMember:{name:string}| null, grantor: {name: string} | null},index:number) => Promise<void>,
    deleteFunction: (id:string,index:number) => Promise<void>,
    permissionLevel:number
}>();

const { downloadCsv } = useCsvExport()

// Fiscal years run Oct 1 - Sep 30 and are named by the year they end in (Oct 2025 - Sep 2026 = FY2026).
const FISCAL_YEAR_START_MONTH = 10
function fiscalYearOf(date: Date | null) {
    if (!date) return null
    return FISCAL_YEAR_START_MONTH > 1 && date.getUTCMonth() + 1 >= FISCAL_YEAR_START_MONTH ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
}
const currentFiscalYear = fiscalYearOf(new Date())!
const fiscalYearFilter = ref('all')
const pastFiscalYears = computed(() =>
    [...new Set(props.data.map((row) => fiscalYearOf(row.grant.receivedDate)).filter((fy): fy is number => fy !== null && fy < currentFiscalYear))].sort((a, b) => b - a)
)
function matchesFiscalYear(date: Date | null) {
    const fy = fiscalYearOf(date)
    switch (fiscalYearFilter.value) {
        case 'all': return true
        case 'current': return fy === currentFiscalYear
        case 'past': return fy !== null && fy < currentFiscalYear
        default: return fy === Number(fiscalYearFilter.value)
    }
}
const fiscalYearRows = computed(() => props.data.filter((row) => matchesFiscalYear(row.grant.receivedDate)))

const columns: DataTableColumn<GrantRow>[] = [
    { id: 'grantorName', header: 'Grantor', value: (row) => row.grantor?.name },
    { id: 'purpose', header: 'Purpose', value: (row) => row.grant.purpose },
    { id: 'monetaryAmount', header: 'Monetary Amount', type: 'number', value: (row) => row.grant.monetaryAmount },
    { id: 'nonMonetaryAmount', header: 'Non-Monetary Amount', value: (row) => row.grant.nonMonetaryAmount },
    { id: 'method', header: 'Payment Method', value: (row) => row.grant.method },
    { id: 'status', header: 'Status', type: 'select', value: (row) => row.grant.status, options: [{ label: 'Pending', value: '0' }, { label: 'Recieved', value: '1' }], display: (row) => row.grant.status == 0 ? 'pending' : 'recieved', sortDesc: true },
    { id: 'receivedDate', header: 'Recieved Date', type: 'date', value: (row) => row.grant.receivedDate, sortDesc: true },
    { id: 'boardName', header: 'Last Editor', value: (row) => row.boardMember?.name },
]

function exportCsv(rows: GrantRow[]) {
    downloadCsv('grants.csv', rows.map((row) => ({
        grantor: row.grantor?.name ?? '',
        purpose: row.grant.purpose ?? '',
        monetaryAmount: row.grant.monetaryAmount ?? '',
        nonMonetaryAmount: row.grant.nonMonetaryAmount ?? '',
        paymentMethod: row.grant.method ?? '',
        status: row.grant.status === 0 ? 'pending' : 'received',
        receivedDate: row.grant.receivedDate ? row.grant.receivedDate.toISOString().split('T')[0] : '',
        lastEditor: row.boardMember?.name ?? '',
    })))
}

</script>
