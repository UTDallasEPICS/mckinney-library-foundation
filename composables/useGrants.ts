import { ref } from 'vue';
import type { Grant } from '~/interfaces/grant'

export function useGrants() {
    const grants = ref<Grant[]>([]);
    const selectedGrant = ref(null);

    async function getGrants(){
        try {
            const route: string = `/api/grants`;
            grants.value = await $fetch<Grant[]>(route);
    
        } catch (error) {
            console.error('getGrants Error:', error);
        }
    };

    async function getGrant(selectedGrant: Grant) {
        try {
            const route: string = `/api/grants/${selectedGrant.id}`;
            selectedGrant = await $fetch<Grant>(route);
        } catch (error) {
            console.error('getGrant Error:', error);
        }
    }

    async function updateGrant(selectedGrant: Grant) {
        try {
            await $fetch('/api/grants/${id}', {
                method: "PUT",
                body: selectedGrant
            });

        } catch (error) {
            console.error('updateGrant Error:', error);
        }
    }

    async function createGrant(selectedGrant: Grant) {
        try {
            const route: string = `/api/grants/${selectedGrant.id}`;
            await $fetch(route, {
                method: "POST",
                body: selectedGrant
            });

        } catch (error) {
            console.error('createGrant Error:', error);
        }
    }

    async function deleteGrant(selectedGrant: Grant) {
        try {
            const route: string = `/api/grants/${selectedGrant.id}`;
            await $fetch(route, {
                method: "DELETE",
            });

        } catch (error) {
            console.error('deleteGrant Error:', error);
        }
    }

    return {
        grants,
        selectedGrant,
        getGrants,
        getGrant,
        updateGrant,
        createGrant,
        deleteGrant
    }
}