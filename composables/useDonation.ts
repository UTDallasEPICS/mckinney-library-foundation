import type { Donation } from "@prisma/client";

export const useDonation = () => {
    const donationsData:Ref<{donation: Donation, donor: {name: string} | null, boardMember: {name:string} | null}[]> = ref([]);
    const getDonations = async () =>{
        const donations = await $fetch('/api/donation');
        if(donations.success && donations.data){
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
                    },
                    donor: donations.data[index].donor,
                    boardMember:donations.data[index].boardMember            
                })
            });
        }
    } 
    return {
        getDonations,
        donationsData
    }
}