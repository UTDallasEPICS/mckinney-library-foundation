export const useEmailHistory = (type: 'donor' | 'grantor') => {

    const { data: rawData, refresh } = useFetch('/api/email', { query: { type } });

    const emailHistory = useState<any[]>(`email-history-${type}`, () => []);

    if (rawData.value?.data) {
        emailHistory.value = rawData.value.data;
    }

    watch(rawData, (newData) => {
        if (newData?.data) {
            emailHistory.value = newData.data;
        }
    });

    return { emailHistory, refresh };
}