import type { Event } from '~~/server/utils/generated/prisma/browser';

export const useEvent = () => {
    const eventsData: Ref<{ event: Event, boardMember: { name: string } | null }[]> = ref([]);

    const getEvents = async () => {
        const events = await $fetch('/api/event');
        if (events.success && events.data) {
            eventsData.value = events.data.map((event: any) => ({
                event: {
                    ...event,
                    eventDate: event.eventDate ? new Date(event.eventDate) : null,
                },
                boardMember: event.boardMember,
            }));
        }
    };

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
        return result;
    };

    const deleteEvent = async (id: string, permissionLevel: number) => {
        const result = await $fetch(`/api/event/${id}`, {
            method: 'DELETE',
            body: {
                permissionLevel,
            }
        });
        return result;
    };

    return {
        eventsData,
        getEvents,
        postEvent,
        putEvent,
        deleteEvent,
    };
};
