import { ref } from 'vue';
import type { Grant } from "@prisma/client"

export function useGrant() {
    //const grants = ref<Grant[]>([]);
    const grantsData:Ref<{grant: Grant, grantor: {name: string} | null, boardMember: {name:string} | null}[]> = ref([]);
    const selectedGrant = ref(null);

    const getGrants = async () =>{
            const grants = await $fetch('/api/grant');
            if(grants.success && grants.data){
                console.log(grants.data)
                const tempGrants:Ref<Grant[]> = ref([])
                grants.data.map((grant) =>{
                    tempGrants.value.push({
                            ...grant,
                            proposedDate: grant.proposedDate? new Date() : null,
                            receivedDate: grant.receivedDate? new Date(grant.receivedDate) : null,
                            lastEditDate: grant.lastEditDate? new Date(grant.lastEditDate) : null,
                        }
                    )
    
                })
                tempGrants.value.map((thisGrant:Grant, index:number) => {  
                    grantsData.value.push({
                        grant:{
                            ...thisGrant,
                            proposedDate: thisGrant.proposedDate? new Date() : null,
                            receivedDate: thisGrant.receivedDate? new Date(thisGrant.receivedDate) : null,
                            lastEditDate: thisGrant.lastEditDate? new Date(thisGrant.lastEditDate) : null,
                        },
                        grantor: grants.data[index].grantor,
                        boardMember:grants.data[index].boardMember            
                    })
                });
            }
        } 

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
            await $fetch(`/api/grants/${selectedGrant.id}`, {
                method: "PUT",
                body: selectedGrant
            });

        } catch (error) {
            console.error('updateGrant Error:', error);
        }
    }

    async function createGrant(selectedGrant: Grant) {
        try {
            const route: string = `/api/grants`;
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
        grantsData,
        selectedGrant,
        getGrants,
        getGrant,
        updateGrant,
        createGrant,
        deleteGrant
    }
}