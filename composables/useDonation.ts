import type { Donation } from "~~/server/utils/generated/prisma/browser";

type DonationEvent = { eventName: string; eventDate: Date | string | null } | null;

export const useDonation = () => {
    const donationsData:Ref<{donation: Donation & { event?: DonationEvent }, donor: {name: string} | null, boardMember: {name:string} | null}[]> = ref([]);
    const getDonations = async () =>{
        const result = await useFetch('/api/donation');
        const donations = result.data.value;
        if(donations?.success && donations.data){
            const tempDonations:Ref<Donation[]> = ref([])
            donations.data.map((donation) =>{
                tempDonations.value.push({
                        ...donation,
                        receivedDate: donation.receivedDate? new Date(donation.receivedDate) : null,
                        lastEditDate: donation.lastEditDate? new Date(donation.lastEditDate) : null,
                    }
                )

            })
            tempDonations.value.map((thisDonation:Donation, index:number) => {  
                donationsData.value.push({
                    donation:{
                        ...thisDonation,
                        receivedDate: thisDonation.receivedDate? new Date(thisDonation.receivedDate) : null,
                        lastEditDate: thisDonation.lastEditDate? new Date(thisDonation.lastEditDate) : null,
                        event: thisDonation.event ? {
                            ...thisDonation.event,
                            eventDate: thisDonation.event.eventDate ? new Date(thisDonation.event.eventDate) : null,
                        } : null,
                    },
                    donor: donations.data[index].donor,
                    boardMember:donations.data[index].boardMember            
                })
            });
        }
    } 
    const postDonation = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch('/api/donation',{
            method:"POST",
            body:{
                donor: values.donorName,
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                status: values.status,
                event: values.event,
                method:values.method,
                monetaryAmount: values.monetaryAmount,
                nonMonetaryAmount: values.nonMonetaryAmount,
                notes: values.notes,
                reason: values.reason,
                receivedDate: values.receivedDate,
            }
        })
        return result;
    }
    const putDonation = async (values:Record<string,any>,user:{id:string, permissionLevel:number}) =>{
        const result = await $fetch(`/api/donation/${values.id}`,{
            method:"PUT",
            body:{
                donor: values.donorName,
                boardMemberId: user.id,
                permissionLevel: user.permissionLevel,
                status: parseInt(values.status),
                event: values.event,
                method:values.method,
                monetaryAmount: values.monetaryAmount,
                nonMonetaryAmount: values.nonMonetaryAmount,
                notes: values.notes,
                reason: values.reason,
                receivedDate: values.receivedDate,
            }
        })
        return result;
    }
    const deleteDonation = async (id:string,permissionLevel:number) =>{
        const result = await $fetch(`/api/donation/${id}`,{
            method:"DELETE",
            body:{
                permissionLevel: permissionLevel
            }
        })
        return result;
    }
return {
        getDonations,
        postDonation,
        putDonation,
        deleteDonation,
        donationsData
    }
}

 

    
