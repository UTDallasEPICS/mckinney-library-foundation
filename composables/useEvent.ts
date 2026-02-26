import type { Event } from "@prisma/client";

export const useEvent = () => {
    const eventsData: Ref<Event[]> = ref([]);
    
    const getEvents = async () => {
        const events = await $fetch('/api/event');
        if (events.success && events.data) {
            eventsData.value = events.data.map((event: any) => ({
                ...event,
                eventDate: event.eventDate ? new Date(event.eventDate) : null,
            }));
        }
    };

    const postEvent = async (values: Record<string, any>, user: { id: string, permissionLevel: number }) => {
        const result = await $fetch('/api/event', {
            method: "POST",
            body: {
                eventName: values.eventName,
                eventDate: values.eventDate,
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel
            }
        });
        return result;
    };

    return {
        getEvents,
        postEvent,
        eventsData
    };
};
