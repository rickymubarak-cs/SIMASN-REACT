// src/service/jfService.ts
import API from './api';

export interface JfData {
    layanan_jf_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    jenis_jf?: string;
    layanan_jf_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_a?: string; file_b?: string; file_c?: string; file_d?: string;
    file_e?: string; file_f?: string; file_g?: string; file_h?: string;
    file_i?: string; file_j?: string; file_k?: string; file_l?: string;
    file_m?: string; file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/JF/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/jf/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const jfFileConfig = [
    { key: 'file_a', label: 'SK Jabatan Terakhir', icon: 'Briefcase', color: 'indigo' },
    { key: 'file_b', label: 'SKP 2 Tahun Terakhir', icon: 'FileCheck', color: 'blue' },
    { key: 'file_c', label: 'PAK', icon: 'FileText', color: 'green' },
    { key: 'file_d', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'purple' },
    { key: 'file_e', label: 'Ijazah', icon: 'GraduationCap', color: 'amber' },
    { key: 'file_g', label: 'Rekomendasi Kepala PD', icon: 'Mail', color: 'orange' },
    { key: 'file_j', label: 'Usulan ke Walikota', icon: 'FileSignature', color: 'rose' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'emerald' },
];

export const jfService = {
    getAll: async (perangkatDaerah: string = "") => {
        const url = perangkatDaerah ? `api/jf/${perangkatDaerah}` : 'api/jf';
        const response = await API.get(url);
        if (response.data?.status === 'success' && response.data?.jf) {
            return response.data.jf.map((item: any) => {
                const processed = { ...item };
                jfFileConfig.forEach(cfg => {
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
            case 'diterima': endpoint = `api/jf/${id}/terima`; method = 'put'; break;
            case 'ditolak': endpoint = `api/jf/${id}/tolak`; method = 'put'; data = { keterangan }; break;
            case 'perbaikan': endpoint = `api/jf/${id}/perbaikan`; method = 'post'; data = { keterangan }; break;
            default: throw new Error(`Status tidak dikenal: ${status}`);
        }
        return method === 'post' ? await API.post(endpoint, data) : await API.put(endpoint, data);
    },
    uploadBerkas: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file_status_pelayanan', file);
        formData.append('jf_id', id);
        return await API.post(`api/jf/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
};

export default jfService;