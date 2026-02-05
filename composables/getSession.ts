  export const getSession = async () => {
      const result = await useFetch('/api/session');
        if (!result.data.value?.success) {
            throw new Error('Failed to fetch session');
        } 

        console.log("result from getSession:", result); 

      return result
    };