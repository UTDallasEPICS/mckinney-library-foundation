import type { Donor } from "~~/server/utils/generated/prisma/browser";

export const useDonor = () => {

    const { data: rawData } = useFetch('/api/donor');

    const donors = useState<any[]>('donors-data', () => []);

    if (rawData.value?.data) {
        donors.value = rawData.value.data;
    }

    watch(rawData, (newData) => {
        if (newData?.data) {
            donors.value = newData.data;
        }
    });

    const postDonor = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch('/api/donor',{
            method:"POST",
            body:{
                name:values.donorName,
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
        });
        if (result.data) {
            donors.value.push(result.data);
        }
        return result;
    };

    const putDonor = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/donor/${values.id}`,{
            method:'PUT',
            body:{
            name:values.donorName,
            boardMemberId: user.id,
            email: values.email? values.email.trim() : "",
            phone: values.phone? values.phone.trim(): "",
            address: values.address? values.address.trim(): "",
            preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
            notes: values.notes,
            webLink: values.webLink? values.webLink.trim() : "",
            organization: values.organization? values.organization.trim() : "",
            permissonLevel: user.permissionLevel,
            isAuthor: values.isAuthor? true : false
            }
        })
        if (result.data) {
            const idx = donors.value.findIndex(d => d.id === values.id);
            if (idx !== -1) donors.value[idx] = result.data;
        }
        return result;
    }
    const deleteDonor = async (donor:Donor, permissionLevel:number) =>{
        const result = await $fetch(`/api/donor/${donor.id}`,{
            method:"DELETE",
            body:{
            permissionLevel: permissionLevel
            }
        })
        if (result.success) {
            const idx = donors.value.findIndex(d => d.id === donor.id);
            if (idx !== -1) donors.value.splice(idx, 1);
        }
        return result;
    }
    return {
        donors,
        putDonor,
        postDonor,
        deleteDonor,
    };
};