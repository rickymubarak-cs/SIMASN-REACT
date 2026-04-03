// src/service/diklatService.ts
import API from './api';

export interface DiklatData {
    layanan_diklat_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    nama_usulan_diklat?: string;
    layanan_diklat_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_lampiranbiaya?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Diklat/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/diklat/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const diklatFileConfig = [
    { key: 'file_lampiranbiaya', label: 'Lampiran Biaya', icon: 'FileText', color: 'sky' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'blue' },
];

export const diklatService = {
    getAll: async (perangkatDaerah: string = "") => {
        const url = perangkatDaerah ? `api/diklat/${perangkatDaerah}` : 'api/diklat';
        const response = await API.get(url);
        if (response.data?.status === 'success' && response.data?.diklat) {
            return response.data.diklat.map((item: any) => {
                const processed = { ...item };
                diklatFileConfig.forEach(cfg => {
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
            case 'diterima': endpoint = `api/diklat/${id}/terima`; method = 'put'; break;
            case 'ditolak': endpoint = `api/diklat/${id}/tolak`; method = 'put'; data = { keterangan }; break;
            case 'perbaikan': endpoint = `api/diklat/${id}/perbaikan`; method = 'post'; data = { keterangan }; break;
            default: throw new Error(`Status tidak dikenal: ${status}`);
        }
        return method === 'post' ? await API.post(endpoint, data) : await API.put(endpoint, data);
    },
    uploadBerkas: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file_status_pelayanan', file);
        formData.append('diklat_id', id);
        return await API.post(`api/diklat/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

export default diklatService;