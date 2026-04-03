// src/service/cutiService.ts
import API from './api';

export interface CutiData {
    layanan_cuti_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    jenis_cuti?: string;
    layanan_cuti_status?: string;
    cTahunan_dalamLuar?: string;
    timestamp?: string;
    keterangan?: string;
    file_a?: string; file_b?: string; file_c?: string; file_d?: string;
    file_e?: string; file_f?: string; file_g?: string; file_h?: string;
    file_i?: string; file_j?: string; file_k?: string; file_l?: string;
    file_m?: string; file_n?: string; file_o?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Cuti/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/cuti/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const cutiFileConfig = [
    { key: 'file_a', label: 'Surat Pengajuan Cuti', icon: 'Mail', color: 'blue' },
    { key: 'file_b', label: 'Surat Keterangan Atasan', icon: 'FileSignature', color: 'green' },
    { key: 'file_c', label: 'Surat Keterangan Dokter', icon: 'FileText', color: 'purple' },
    { key: 'file_d', label: 'Surat Pernyataan', icon: 'FileCheck', color: 'orange' },
    { key: 'file_e', label: 'Dokumen Pendukung', icon: 'Paperclip', color: 'indigo' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'emerald' },
];

export const cutiService = {
    getAll: async (perangkatDaerah: string = ""): Promise<CutiData[]> => {
        try {
            const url = perangkatDaerah ? `api/cuti/${perangkatDaerah}` : 'api/cuti';
            const response = await API.get(url);
            if (response.data?.status === 'success' && response.data?.cuti) {
                return response.data.cuti.map((item: any) => {
                    const processed = { ...item };
                    cutiFileConfig.forEach(cfg => {
                        const val = item[cfg.key];
                        processed[`${cfg.key}_url`] = val?.trim() ? `${BASE_URL_BERKAS}${val}` : null;
                    });
                    processed.file_status_pelayanan_url = item.file_status_pelayanan ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}` : null;
                    processed.foto_url = item.foto ? `${BASE_URL_FOTO}${item.foto}` : null;
                    return processed;
                });
            }
            return [];
        } catch (error) { console.error(error); throw error; }
    },
    updateStatus: async (id: string, status: string, keterangan?: string) => {
        let endpoint = '', method: 'put' | 'post' = 'post', data = null;
        switch (status) {
            case 'diterima': endpoint = `api/cuti/${id}/terima`; method = 'put'; break;
            case 'ditolak': endpoint = `api/cuti/${id}/tolak`; method = 'put'; data = { keterangan }; break;
            case 'perbaikan': endpoint = `api/cuti/${id}/perbaikan`; method = 'post'; data = { keterangan }; break;
            default: throw new Error(`Status tidak dikenal: ${status}`);
        }
        return method === 'post' ? await API.post(endpoint, data) : await API.put(endpoint, data);
    },
    uploadBerkas: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file_status_pelayanan', file);
        formData.append('cuti_id', id);
        return await API.post(`api/cuti/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

export default cutiService;