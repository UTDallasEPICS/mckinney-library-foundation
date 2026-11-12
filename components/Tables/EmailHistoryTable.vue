<template>
    <div class="bg-[#e5e9ec] rounded-md p-6 w-[900px] max-w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
            <h1 class="form-title">Email History</h1>
            <button class="form-button bg-red-600 hover:bg-red-700" @click="props.close">Close</button>
        </div>

        <div v-if="!selected" class="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table class="w-full">
                <thead class="bg-[#c5d0d8] sticky top-0 z-10">
                    <tr>
                        <th v-for="h in ['Date', 'Subject', 'Sent By', 'Recipients', 'Status']" :key="h"
                            class="px-8 py-3 text-left text-sm text-[#2d3e4d] border-b-2 border-[#a8b5bf]">{{ h }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="props.data.length === 0">
                        <td colspan="5" class="px-8 py-4 text-sm text-center text-gray-500">No emails sent yet</td>
                    </tr>
                    <tr v-for="log in props.data" :key="log.id" @click="selected = log"
                        class="border-b border-gray-200 hover:bg-gray-50 cursor-pointer text-sm">
                        <td class="px-8 py-3">{{ new Date(log.sentAt).toLocaleString() }}</td>
                        <td class="px-8 py-3">{{ log.subject }}</td>
                        <td class="px-8 py-3">{{ log.sender?.name ?? 'Unknown' }}</td>
                        <td class="px-8 py-3">{{ log.recipients.length }}</td>
                        <td class="px-8 py-3">{{ statusSummary(log) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-else class="space-y-4">
            <button class="text-sm text-blue-600 hover:underline" @click="selected = null">&larr; Back to history</button>
            <div class="p-2.5 rounded-md bg-[#f5f5f5] text-sm">
                <p><b>Subject:</b> {{ selected.subject }}</p>
                <p><b>Sent:</b> {{ new Date(selected.sentAt).toLocaleString() }} by {{ selected.sender?.name ?? 'Unknown' }}</p>
            </div>
            <div class="p-2.5 rounded-md bg-white text-sm whitespace-pre-wrap">{{ selected.body }}</div>
            <table class="w-full bg-white rounded-lg text-sm">
                <tr v-for="r in selected.recipients" :key="r.id" class="border-b border-gray-200">
                    <td class="px-4 py-2">{{ r.name }}</td>
                    <td class="px-4 py-2">{{ r.email }}</td>
                    <td class="px-4 py-2" :class="r.status === 'failed' ? 'text-red-600' : 'text-green-700'">
                        {{ r.status }}<span v-if="r.error"> ({{ r.error }})</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    data: any[],
    close: () => void
}>();

const selected = ref<any | null>(null);

function statusSummary(log: any) {
    const sent = log.recipients.filter((r: any) => r.status === 'sent').length
    const failed = log.recipients.filter((r: any) => r.status === 'failed').length
    return failed ? `${sent} sent, ${failed} failed` : `${sent} sent`
}
</script>