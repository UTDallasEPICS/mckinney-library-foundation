import type { Grantor } from "@prisma/client";

export const useGrantor = () => {
    const grantors = ref();

    const getGrantors = async () =>{
        const result = await useFetch("/api/grantor");
        grantors.value = result.data.value?.data;
    } 
    async function postGrantor(values:Record<string,any>,user:{id:string, permissionLevel:number}) {
       const result = await $fetch('/api/grantor',{
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

    const putGrantor = async (values:Record<string, any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/grantor/${values.id}`,{
            method:"PUT",
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
    const deleteGrantor = async (grantor:Grantor,permissionLevel:number) =>{
        const result = await $fetch(`/api/grantor/${grantor.id}`,{
            method:"DELETE",
            body:{
            permissionLevel:permissionLevel
            }
        })
        return result
    }
    return {
        getGrantors,
        postGrantor,
        putGrantor,
        deleteGrantor,
        grantors
    }
}