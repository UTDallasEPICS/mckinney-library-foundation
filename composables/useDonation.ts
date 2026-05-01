export const useDonation = () => {
    const { data: rawData } = useFetch('/api/donation');

    type DonationRow = {
        donation: Record<string, any>;
        donor: any;
        boardMember: any;
    };

    const donationsData = useState<DonationRow[]>('donations-data', () => []);

    function transformDonation(donation: any): DonationRow {
        return {
            donation: {
                ...donation,
                receivedDate: donation.receivedDate ? new Date(donation.receivedDate) : null,
                lastEditDate: donation.lastEditDate ? new Date(donation.lastEditDate) : null,
            },
            donor: donation.donor,
            boardMember: donation.boardMember,
        };
    }

    if (rawData.value?.success && rawData.value?.data) {
        donationsData.value = rawData.value.data.map(transformDonation);
    }

    watch(rawData, (newData) => {
        if (newData?.success && newData?.data) {
            donationsData.value = newData.data.map(transformDonation);
        }
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
        if (result.data) {
            donationsData.value.push(transformDonation(result.data));
        }
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
        if (result.data) {
            const idx = donationsData.value.findIndex(d => d.donation.id === values.id);
            if (idx !== -1) {
                donationsData.value[idx] = transformDonation(result.data);
            }
        }
        return result;
    }
    const deleteDonation = async (id:string,permissionLevel:number) =>{
        const result = await $fetch(`/api/donation/${id}`,{
            method:"DELETE",
            body:{
                permissionLevel: permissionLevel
            }
        })
        if (result.success) {
            const idx = donationsData.value.findIndex(d => d.donation.id === id);
            if (idx !== -1) {
                donationsData.value.splice(idx, 1);
            }
        }
        return result;
    }
    return {
        donationsData,
        postDonation,
        putDonation,
        deleteDonation,
    };
};

 

    
