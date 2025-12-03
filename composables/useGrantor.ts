export const useGrantor = () => {
    const grantors = ref();

    const getGrantors = async () =>{
        const result = await useFetch("/api/grantor");
        grantors.value = result.data.value?.data;
    } 
    return {
        getGrantors,
        grantors
    }
}