export const useDonation = () => {
    const { data: rawData } = useFetch('/api/donation');

    const donationsData = computed ( () => {
        if(!rawData.value?.success || !rawData.value?.data) return [];
        return rawData.value.data.map((donation) => ({
            donation: {
                ...donation,
                receivedDate: donation.receivedDate ? new Date(donation.receivedDate) : null,
                lastEditDate: donation.lastEditDate ? new Date(donation.lastEditDate) : null,
            },
            donor: donation.donor,
            boardMember: donation.boardMember

        }));
    });

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
        donationsData,
        postDonation,
        putDonation,
        deleteDonation,
    };
};

 

    