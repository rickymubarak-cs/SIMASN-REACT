// src/service/dataService.ts
import API from './api';

export interface DataPerubahanData {
    layanan_data_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    jenis_layanan_data?: string;
    layanan_data_status?: string;
    ket_perbaikan?: string;
    timestamp?: string;
    keterangan?: string;
    file_pengantar?: string;
    file_lampirandukung?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Data/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/data/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const dataFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'gray' },
    { key: 'file_lampirandukung', label: 'Lampiran Pendukung', icon: 'Paperclip', color: 'blue' },
];

export const dataService = {
    getAll: async (perangkatDaerah: string = "") => {
        const url = perangkatDaerah ? `api/data/${perangkatDaerah}` : 'api/data';
        const response = await API.get(url);
        if (response.data?.status === 'success' && response.data?.data_perubahan) {
            return response.data.data_perubahan.map((item: any) => {
                const processed = { ...item };
                dataFileConfig.forEach(cfg => {
                    const val = item[cfg.key];
                    processed[`${cfg.key}_url`] = val?.trim() ? `${BASE_URL_BERKAS}${val}` : null;
                });
                processed.file_status_pelayanan_url = item.file_status_pelayanan ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}` : null;
                processed.foto_url = item.foto ? `${BASE_URL_FOTO}${item.foto}` : null;
                return processed;
            });
        }
        return [];
    },
    updateStatus: async (id: string, status: string, keterangan?: string) => {
        let endpoint = '', method: 'put' | 'post' = 'post', data = null;
        switch (status) {
            case 'diterima': endpoint = `api/data/${id}/terima`; method = 'put'; break;
            case 'ditolak': endpoint = `api/data/${id}/tolak`; method = 'put'; data = { keterangan }; break;
            case 'perbaikan': endpoint = `api/data/${id}/perbaikan`; method = 'post'; data = { keterangan }; break;
            default: throw new Error(`Status tidak dikenal: ${status}`);
        }
        return method === 'post' ? await API.post(endpoint, data) : await API.put(endpoint, data);
    },
    uploadBerkas: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file_status_pelayanan', file);
        formData.append('data_id', id);
        return await API.post(`api/data/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

export default dataService;