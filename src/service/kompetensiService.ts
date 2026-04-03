// src/service/kompetensiService.ts
import API from './api';

export interface KompetensiData {
    komp_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    riw_kom_jenis?: string;
    riw_kom_nama?: string;
    riw_kom_penyelenggara?: string;
    riw_kom_tahun?: string;
    riw_kom_jp?: number;
    layanan_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_sertifikat?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Kompetensi/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/kompetensi/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const kompetensiFileConfig = [
    { key: 'file_sertifikat', label: 'Sertifikat Kompetensi', icon: 'Award', color: 'orange' },
];

export const kompetensiService = {
    getAll: async (perangkatDaerah: string = "") => {
        const url = perangkatDaerah ? `api/kompetensi/${perangkatDaerah}` : 'api/kompetensi';
        const response = await API.get(url);
        if (response.data?.status === 'success' && response.data?.kompetensi) {
            return response.data.kompetensi.map((item: any) => {
                const processed = { ...item };
                kompetensiFileConfig.forEach(cfg => {
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
            case 'diterima': endpoint = `api/kompetensi/${id}/terima`; method = 'put'; break;
            case 'ditolak': endpoint = `api/kompetensi/${id}/tolak`; method = 'put'; data = { keterangan }; break;
            case 'perbaikan': endpoint = `api/kompetensi/${id}/perbaikan`; method = 'post'; data = { keterangan }; break;
            default: throw new Error(`Status tidak dikenal: ${status}`);
        }
        return method === 'post' ? await API.post(endpoint, data) : await API.put(endpoint, data);
    },
    uploadBerkas: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file_status_pelayanan', file);
        formData.append('kompetensi_id', id);
        return await API.post(`api/kompetensi/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

export default kompetensiService;