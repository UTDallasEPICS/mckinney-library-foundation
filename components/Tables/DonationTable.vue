<template>
    <DataTable
        :data="fiscalYearRows"
        :columns="columns"
        :get-row-id="(row) => row.donation.id"
        :default-sorts="['receivedDate']"
        empty="No donations found"
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
            <button v-if="permissionLevel > 0" class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-red-600 hover:bg-red-700 text-white px-6" @click="deleteFunction(row.donation.id, props.data.indexOf(row))">Delete</button>
            <button class="rounded-md text-sm font-medium outline-none h-9 py-2 bg-green-600 hover:bg-green-700 text-white px-6" @click="viewFunction(row, props.data.indexOf(row))">View</button>
        </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Donation } from '~~/server/utils/generated/prisma/browser';
import DataTable from '~/components/Tables/DataTable.vue';
import type { DataTableColumn } from '~/types/dataTable';
import { useCsvExport } from '~/composables/useCsvExport';

type DonationRow = {donation: Donation & {isAuthor: boolean}, boardMember:{name:string} | null, donor: {name: string} | null}

const props = defineProps<{
    data: DonationRow[],
    editFunction: (donationData:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number) => Promise<void>,
    viewFunction: (donationData:{donation:Donation,boardMember:{name:string}| null, donor: {name: string} | null},index:number) => Promise<void>,
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
    [...new Set(props.data.map((row) => fiscalYearOf(row.donation.receivedDate)).filter((fy): fy is number => fy !== null && fy < currentFiscalYear))].sort((a, b) => b - a)
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
const fiscalYearRows = computed(() => props.data.filter((row) => matchesFiscalYear(row.donation.receivedDate)))

function eventName(row: DonationRow) {
    const event = row.donation.event as unknown as { eventName?: string } | string | null
    return (typeof event === 'object' ? event?.eventName : event) ?? ''
}

const columns: DataTableColumn<DonationRow>[] = [
    { id: 'donorName', header: 'Donor', value: (row) => row.donor?.name },
    { id: 'author', header: 'Author', value: (row) => row.donation.isAuthor ? 'true' : 'false', sortDesc: true },
    { id: 'event', header: 'Event', value: eventName },
    { id: 'monetaryAmount', header: 'Monetary Amount', type: 'number', value: (row) => row.donation.monetaryAmount },
    { id: 'nonMonetaryAmount', header: 'Non-Monetary Amount', value: (row) => row.donation.nonMonetaryAmount },
    { id: 'method', header: 'Payment Method', value: (row) => row.donation.method },
    { id: 'status', header: 'Status', type: 'select', value: (row) => row.donation.status, options: [{ label: 'Pending', value: '0' }, { label: 'Recieved', value: '1' }], display: (row) => row.donation.status == 0 ? 'pending' : 'recieved', sortDesc: true },
    { id: 'receivedDate', header: 'Recieved Date', type: 'date', value: (row) => row.donation.receivedDate, sortDesc: true },
    { id: 'boardName', header: 'Last Editor', value: (row) => row.boardMember?.name },
]

function exportCsv(rows: DonationRow[]) {
    downloadCsv('donations.csv', rows.map((row) => ({
        donor: row.donor?.name ?? '',
        author: row.donation.isAuthor ? 'true' : 'false',
        event: eventName(row),
        monetaryAmount: row.donation.monetaryAmount ?? '',
        nonMonetaryAmount: row.donation.nonMonetaryAmount ?? '',
        paymentMethod: row.donation.method ?? '',
        status: row.donation.status === 0 ? 'pending' : 'received',
        receivedDate: row.donation.receivedDate ? row.donation.receivedDate.toISOString().split('T')[0] : '',
        lastEditor: row.boardMember?.name ?? '',
    })))
}

</script>
