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
    file_a?: string;
    file_b?: string;
    file_c?: string;
    file_d?: string;
    file_e?: string;
    file_f?: string;
    file_g?: string;
    file_h?: string;
    file_i?: string;
    file_j?: string;
    file_k?: string;
    file_l?: string;
    file_m?: string;
    file_pengantar?: string;
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
    { key: 'file_c', label: 'PAK (Penilaian Angka Kredit)', icon: 'FileText', color: 'green' },
    { key: 'file_d', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'purple' },
    { key: 'file_e', label: 'Ijazah Terakhir', icon: 'GraduationCap', color: 'amber' },
    { key: 'file_f', label: 'Transkrip Nilai', icon: 'ScrollText', color: 'orange' },
    { key: 'file_g', label: 'Rekomendasi Kepala PD', icon: 'Mail', color: 'cyan' },
    { key: 'file_h', label: 'Surat Pernyataan', icon: 'FileSignature', color: 'pink' },
    { key: 'file_i', label: 'Dokumen Pendukung', icon: 'Paperclip', color: 'teal' },
    { key: 'file_j', label: 'Usulan ke Walikota', icon: 'FileSignature', color: 'rose' },
    { key: 'file_k', label: 'Berita Acara', icon: 'FileText', color: 'indigo' },
    { key: 'file_l', label: 'Surat Tugas', icon: 'Mail', color: 'blue' },
    { key: 'file_m', label: 'Sertifikat Kompetensi', icon: 'Award', color: 'emerald' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'gray' },
];

export const jfService = {
    getAll: async (perangkatDaerah: string = ""): Promise<JfData[]> => {
        try {
            const url = perangkatDaerah ? `api/jf/${perangkatDaerah}` : 'api/jf';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.jf) {
                const jfData = response.data.jf;
                if (Array.isArray(jfData)) {
                    return jfData.map((item: any) => {
                        const processedItem: any = { ...item };
                        jfFileConfig.forEach(fileConfig => {
                            const fileValue = item[fileConfig.key];
                            if (fileValue && fileValue.trim() !== '') {
                                processedItem[`${fileConfig.key}_url`] = `${BASE_URL_BERKAS}${fileValue}`;
                            } else {
                                processedItem[`${fileConfig.key}_url`] = null;
                            }
                        });
                        processedItem.file_status_pelayanan_url = item.file_status_pelayanan
                            ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}`
                            : null;
                        processedItem.foto_url = item.foto
                            ? `${BASE_URL_FOTO}${item.foto}`
                            : null;
                        return processedItem;
                    });
                }
            }
            return [];
        } catch (error) {
            console.error('Error fetching JF data:', error);
            throw error;
        }
    },

    updateStatus: async (id: string, status: string, keterangan?: string): Promise<any> => {
        try {
            let endpoint = '';
            let method: 'put' | 'post' = 'post';
            let data: any = null;

            switch (status) {
                case 'diterima':
                    endpoint = `api/jf/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/jf/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/jf/${id}/perbaikan`;
                    method = 'post';
                    data = { keterangan };
                    break;
                default:
                    throw new Error(`Status tidak dikenal: ${status}`);
            }

            let response;
            if (method === 'post') {
                response = await API.post(endpoint, data);
            } else {
                response = await API.put(endpoint, data);
            }
            return response.data;
        } catch (error) {
            console.error('Error updating JF status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_jf_id', id);
            const response = await API.post(`api/jf/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading JF file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post(`api/jf/${id}/edit-berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing JF file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<JfData | null> => {
        try {
            const response = await API.get(`api/jf/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.jf) {
                return response.data.jf;
            }
            return null;
        } catch (error) {
            console.error('Error fetching JF detail:', error);
            throw error;
        }
    }
};

export default jfService;