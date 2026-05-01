import type { Grantor } from "~~/server/utils/generated/prisma/browser";

export const useGrantor = () => {

    const { data: rawData } = useFetch('/api/grantor');

    const grantors = useState<any[]>('grantors-data', () => []);

    if (rawData.value?.data) {
        grantors.value = rawData.value.data;
    }

    watch(rawData, (newData) => {
        if (newData?.data) {
            grantors.value = newData.data;
        }
    });


    async function postGrantor(values:Record<string,any>,user:{id:string, permissionLevel:number}) {
       const result = await $fetch('/api/grantor',{
            method:"POST",
            body:{
                name:values.grantorName,
                email: values.email? values.email.trim(): "",
                phone: values.phone? values.phone.trim(): "",
                address: values.address? values.address.trim(): "",
                preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
                notes: values.notes,
                webLink: values.webLink? values.webLink.trim() : "",
                organization: values.organization? values.organization.trim() : "",
                permissionLevel:user.permissionLevel,
                boardMemberId:user.id
            }
        })
        if (result.data) {
            grantors.value.push(result.data);
        }
        return result;
    }

    const putGrantor = async (values:Record<string, any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/grantor/${values.id}`,{
            method:"PUT",
            body:{
            name:values.grantorName,
            boardMemberId: user.id,
            email: values.email? values.email.trim() : "",
            phone: values.phone? values.phone.trim(): "",
            address: values.address? values.address.trim(): "",
            preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
            notes: values.notes,
            webLink: values.webLink? values.webLink.trim() : "",
            organization: values.organization? values.organization.trim() : "",
            permissonLevel: user.permissionLevel
            }
        })
        if (result.data) {
            const idx = grantors.value.findIndex(g => g.id === values.id);
            if (idx !== -1) grantors.value[idx] = result.data;
        }
        return result;
    }
    const deleteGrantor = async (grantor:Grantor,permissionLevel:number) =>{
        const result = await $fetch(`/api/grantor/${grantor.id}`,{
            method:"DELETE",
            body:{
            permissionLevel:permissionLevel
            }
        })
        if (result.success) {
            const idx = grantors.value.findIndex(g => g.id === grantor.id);
            if (idx !== -1) grantors.value.splice(idx, 1);
        }
        return result;
    }
    return {
        grantors,
        postGrantor,
        putGrantor,
        deleteGrantor,
    };
};