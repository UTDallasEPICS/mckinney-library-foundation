export const useAuth = () => {
    const session = ref();

    const getSession = async () =>{
        const result = await useFetch("/api/session");
        session.value = result.data.value;
    } 
    return {
        getSession,
        session
    }
}