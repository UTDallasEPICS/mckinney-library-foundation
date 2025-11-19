export const useDonor = () => {
    const donors = ref();

    const getDonors = async () =>{
        const result = await useFetch("/api/donor");
        donors.value = result.data.value?.data;
    } 
    return {
        getDonors,
        donors
    }
}