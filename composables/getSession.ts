  export const getSession = async () => {
      const result = await useFetch('/api/session');
        if (!result.success) {
            throw new Error(result.message || 'Failed to fetch session');
        } 

        console.log("result from getSession:", result); 

      return result
    };