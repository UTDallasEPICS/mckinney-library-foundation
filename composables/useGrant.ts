import type { Grant } from "~~/server/utils/generated/prisma/browser"

export function useGrant() {

    const { data: rawData } = useFetch('/api/grant');

    type GrantRow = {
        grant: Grant & { proposedDate: Date|null; receivedDate: Date|null; lastEditDate: Date|null };
        grantor: any;
        boardMember: any;
    };

    const grantsData = useState<GrantRow[]>('grants-data', () => []);

    function transformGrant(grant: any): GrantRow {
        return {
            grant: {
                ...grant,
                proposedDate: grant.proposedDate ? new Date(grant.proposedDate) : null,
                receivedDate: grant.receivedDate ? new Date(grant.receivedDate) : null,
                lastEditDate: grant.lastEditDate ? new Date(grant.lastEditDate) : null,
            },
            grantor: grant.grantor,
            boardMember: grant.boardMember,
        };
    }

    if (rawData.value?.success && rawData.value?.data) {
        grantsData.value = rawData.value.data.map(transformGrant);
    }

    watch(rawData, (newData) => {
        if (newData?.success && newData?.data) {
            grantsData.value = newData.data.map(transformGrant);
        }
    });

    const selectedGrant = ref<Grant | null>(null);
    

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
        if (result.data) {
            grantsData.value.push(transformGrant(result.data));
        }
        return result;
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
                reimburse: values.reimburse? true : false
            }
        })
        if (result.data) {
            const idx = grantsData.value.findIndex(g => g.grant.id === values.id);
            if (idx !== -1) {
                grantsData.value[idx] = transformGrant(result.data);
            }
        }
        return result;
    }

    const deleteGrant = async (id:string,permissionLevel:number)=>{
        const result = await $fetch(`/api/grant/${id}`,{
            method:"DELETE",
            body:{
                permissionLevel: permissionLevel
            }
        })
        if (result.success) {
            const idx = grantsData.value.findIndex(g => g.grant.id === id);
            if (idx !== -1) {
                grantsData.value.splice(idx, 1);
            }
        }
        return result;
    }

    async function getGrant(selectedGrantItem: Grant) {
        try {
            const route: string = `/api/grants/${selectedGrantItem.id}`;
            selectedGrant.value = await $fetch<Grant>(route);
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