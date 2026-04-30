import type { Grant } from "~~/server/utils/generated/prisma/browser"

export function useGrant() {

    const {data: rawData } = useFetch('/api/grant');

    const grantsData = computed(() => {
        if (!rawData.value?.success || !rawData.value?.data) return [];
        return rawData.value.data.map((grant) => ({
            grant: {
                ...grant,
                proposedDate: grant.proposedDate ? new Date(grant.proposedDate) : null,
                receivedDate: grant.receivedDate ? new Date(grant.receivedDate) : null,
                lastEditDate: grant.lastEditDate ? new Date(grant.lastEditDate) : null,
            },
            grantor: grant.grantor,
            boardMember: grant.boardMember
         }));
    });

    const selectedGrant = ref(null);
    

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
                reimburse: values.reimburse? true : false
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
                proposedDate: values.proposedDate,
                reimburse: values.reimburse? true : false
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
        getGrant,
        putGrant,
        postGrant,
        deleteGrant,
    };
}
