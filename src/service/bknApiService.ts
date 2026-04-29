const BACKEND_URL = 'http://127.0.0.1:8000/api/bkn'; // ← Point ke Laravel

export const bknApiService = {
    checkTokenStatus: async () => {
        const response = await API.get(`${BACKEND_URL}/token/status`);
        return response.data;
    },

    getDataASN: async (nip: string) => {
        const response = await API.get(`${BACKEND_URL}/asn/${nip}`);
        return response.data;
    },

    searchPegawai: async (keyword: string, page: number = 1, limit: number = 10) => {
        const response = await API.get(`${BACKEND_URL}/search`, {
            params: { q: keyword, page, limit }
        });
        return response.data;
    },

    getDokumenList: async (nip: string) => {
        const response = await API.get(`${BACKEND_URL}/dokumen/list/${nip}`);
        return response.data;
    },

    previewDokumen: (object: string) => {
        return `${BACKEND_URL}/dokumen/preview/${encodeURIComponent(object)}`;
    },

    downloadDokumen: (object: string, nama: string) => {
        return `${BACKEND_URL}/dokumen/download/${encodeURIComponent(object)}?nama=${encodeURIComponent(nama)}`;
    },

    syncToLocal: async (nip: string) => {
        const response = await API.post(`${BACKEND_URL}/sync/${nip}`);
        return response.data;
    },

    getSavedData: async (nip: string) => {
        const response = await API.get(`${BACKEND_URL}/saved/${nip}`);
        return response.data;
    }
};