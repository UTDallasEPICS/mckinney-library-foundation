import { ref } from 'vue';
import type { Grant } from "~~/server/utils/generated/prisma/browser"

export function useGrant() {
    const grantsData:Ref<{grant: Grant, grantor: {name: string} | null, boardMember: {name:string} | null}[]> = ref([]);
    const selectedGrant = ref(null);

    const getGrants = async () =>{
            const grants = await $fetch('/api/grant');
            if(grants.success && grants.data){
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

    

    const putGrant = async (values:Record<string, any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/grant/${values.id}`,{
            method:"PUT",
            body:{
                grantor: values.grantorName,
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                status: parseInt(values.status),
                purpose: values.purpose,
                method:values.method,
                monetaryAmount: values.monetaryAmount,
                nonMonetaryAmount: values.nonMonetaryAmount,
                notes: values.notes,
                proposedDate: values.proposedDate,
                receivedDate: values.receivedDate,
            }
        })
        return result
    }

    const postGrant = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) => {
        const result = await $fetch('/api/grant',{
            method:"POST",
            body:{
                grantor: values.grantorName,
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                status: values.status,
                purpose: values.purpose,
                method:values.method,
                monetaryAmount: values.monetaryAmount,
                nonMonetaryAmount: values.nonMonetaryAmount,
                notes: values.notes,
                receivedDate: values.receivedDate,
                proposedDate: values.proposedDate
            }
        })
        return result
    }

    const deleteGrant = async (id:string,permissionLevel:number)=>{
        const result = await $fetch(`/api/grant/${id}`,{
            method:"DELETE",
            body:{
                permissionLevel: permissionLevel
            }
        })
        return result
    }



    async function getGrant(selectedGrant: Grant) {
        try {
            const route: string = `/api/grants/${selectedGrant.id}`;
            selectedGrant = await $fetch<Grant>(route);
        } catch (error) {
            console.error('getGrant Error:', error);
        }
    }

    return {
        grantsData,
        selectedGrant,
        getGrants,
        getGrant,
        putGrant,
        postGrant,
        deleteGrant
    }
}