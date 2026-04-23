<template>
    <div class="w-full bg-slate-500 text-white px-6 py-3 flex justify-center">
        <div class="w-[90vw] grid grid-cols-2 gap-4">
            <NuxtLink to="/events" class="w-full">
                <button class="w-full px-3 py-1 rounded hover:bg-slate-600 transition">
                    View Events
                </button>
            </NuxtLink>

            <button
                v-if="user.permissionLevel > 0"
                @click="addEvent = true"
                class="w-full px-3 py-1 rounded hover:bg-slate-600 transition"
            >
                Add Event
            </button>
        </div>
    </div>

    <div v-if="addEvent" class="fixed top-0 left-0 w-full h-full flex justify-center items-center z-20 bg-black/50">
        <EventForm
            :submit-event="createEvent"
            :cancel-submisison="cancelEvent"
            :view-only="false"
        />
    </div>
</template>

<script setup lang="ts">
import EventForm from '~/components/Forms/EventForm.vue';
import { useEvent } from '~/composables/useEvent';

const props = defineProps<{
    user: { id: string, permissionLevel: number }
}>();

const { postEvent, getEvents } = useEvent();
await getEvents();

const addEvent = ref(false);

async function createEvent(values: Record<string, any>) {
    const result = await postEvent(values, props.user);
    if (result.success) {
        await getEvents();
        addEvent.value = false;
    } else if ((result as any).error?.code === 'EVENT_ALREADY_EXISTS' || (result as any).message === 'The event already exists') {
        alert('The event already exists');
    }
}

function cancelEvent() {
    addEvent.value = false;
}
</script>