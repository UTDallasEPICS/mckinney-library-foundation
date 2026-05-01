import type { Event } from '~~/server/utils/generated/prisma/browser';

export const useEventDropDown = (events: Ref<{ event: Event, boardMember: { name: string } | null }[]>) => {
    const eventNames: ComputedRef<string[]> = computed(() => {
        if (events.value) {
            const uniqueEventNames = new Set(
                events.value.map((row) => row.event.eventName).filter((eventName) => eventName != null)
            );
            return Array.from(uniqueEventNames);
        }
        return [];
    });

    return {
        eventNames,
    };
};
