import type { Donor } from "@prisma/client";

export const useDonor = () => {
    const donors = ref();

    const getDonors = async () =>{
        const result = await useFetch("/api/donor");
        donors.value = result.data.value?.data;
    } 

    const postDonor = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch('/api/donor',{
            method:"POST",
            body:{
                name:values.fName.trim() + " " + values.lName.trim(),
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
        return result
    }
    const putDonor = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/donor/${values.id}`,{
            method:"PATCH",
            body:{
            name:values.fName.trim() + " " + values.lName.trim(),
            boardMemberId: user.id,
            email: values.email? values.email.trim() : "",
            phone: values.phone? values.phone.trim(): "",
            address: values.address? values.address.trim(): "",
            preferredCommunication: values.preferredCommunication? values.preferredCommunication.trim(): "",
            notes: values.notes,
            webLink: values.webLink? values.webLink.trim(): "",
            organization: values.organization? values.organization.trim() : "",
            permissonLevel: user.permissionLevel
            }
        })
        return result
    }
    const deleteDonor = async (donor:Donor, permissionLevel:number) =>{
        const result = $fetch(`/api/donor/${donor.id}`,{
            method:"DELETE",
            body:{
            permissionLevel: permissionLevel
            }
        })
        return result
    }
    return {
        getDonors,
        putDonor,
        postDonor,
        deleteDonor,
        donors
    }
}