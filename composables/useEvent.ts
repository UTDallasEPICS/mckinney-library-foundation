import type { Event } from '~~/server/utils/generated/prisma/browser';

export const useEvent = () => {
    const { data: rawData } = useFetch('/api/event');

    type EventRow = { event: Event & { eventDate: Date | null }; boardMember: { name: string } | null };

    const eventsData = useState<EventRow[]>('events-data', () => []);

    function transformEvent(event: any): EventRow {
        return {
            event: {
                ...event,
                eventDate: event.eventDate ? new Date(event.eventDate) : null,
            },
            boardMember: event.boardMember,
        };
    }

    if (rawData.value?.success && rawData.value?.data) {
        eventsData.value = rawData.value.data.map(transformEvent);
    }

    watch(rawData, (newData) => {
        if (newData?.success && newData?.data) {
            eventsData.value = newData.data.map(transformEvent);
        }
    });

    const postEvent = async (values: Record<string, any>, user: { id: string, permissionLevel: number }) => {
        const result = await $fetch('/api/event', {
            method: 'POST',
            body: {
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                eventName: values.eventName,
                eventDate: values.eventDate,
                description: values.description,
            }
        });
        if (result.data) {
            eventsData.value.push(transformEvent(result.data));
        }
        return result;
    };

    const putEvent = async (values: Record<string, any>, user: { id: string, permissionLevel: number }) => {
        const result = await $fetch(`/api/event/${values.id}`, {
            method: 'PUT',
            body: {
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                eventName: values.eventName,
                eventDate: values.eventDate,
                description: values.description,
            }
        });
        if (result.data) {
            const idx = eventsData.value.findIndex(e => e.event.id === values.id);
            if (idx !== -1) {
                eventsData.value[idx] = transformEvent(result.data);
            }
        }
        return result;
    };

    const deleteEvent = async (id: string, permissionLevel: number) => {
        const result = await $fetch(`/api/event/${id}`, {
            method: 'DELETE',
            body: {
                permissionLevel,
            }
        });
        if (result.success) {
            const idx = eventsData.value.findIndex(e => e.event.id === id);
            if (idx !== -1) {
                eventsData.value.splice(idx, 1);
            }
        }
        return result;
    };

    return {
        eventsData,
        postEvent,
        putEvent,
        deleteEvent,
    };
};
