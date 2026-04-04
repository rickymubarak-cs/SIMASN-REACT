// src/service/pemberhentianService.ts
import API from './api';

export interface PemberhentianData {
    layanan_pemberhentian_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    jenis_pemberhentian?: string;
    layanan_pemberhentian_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_form_permintaan?: string;
    file_karpeg?: string;
    file_sk_cpns?: string;
    file_sk_pns?: string;
    file_sk_pangkat_terakhir?: string;
    file_gaji_berkala_terakhir?: string;
    file_skp_tahun_terakhir?: string;
    file_sk_jabatan?: string;
    file_sk_pemberhentian_jabatan?: string;
    file_penyesuaian_masa_kerja?: string;
    file_surat_pencantuman_gelar?: string;
    file_pernyataan_hukdis?: string;
    file_pernyataan_pidana?: string;
    file_pasphoto?: string;
    file_akta_anak?: string;
    file_nip_baru?: string;
    file_surat_keterangan_kuliah?: string;
    file_susunan_keluarga?: string;
    file_sk_terakhir_pasangan?: string;
    file_ijazah_transkrip?: string;
    file_ktp_npwp_rek?: string;
    file_akta_kematian?: string;
    file_keterangan_kematian?: string;
    file_surat_nikah?: string;
    file_kedudukan?: string;
    file_pendukung?: string;
    file_waris?: string;
    file_suratnikah?: string;
    file_persetujuan_kepala?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Pemberhentian/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/pemberhentian/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const pemberhentianFileConfig = [
    { key: 'file_form_permintaan', label: 'Form Permintaan', icon: 'FileText', color: 'rose' },
    { key: 'file_karpeg', label: 'KARPEG', icon: 'IdCard', color: 'blue' },
    { key: 'file_sk_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_sk_pns', label: 'SK PNS', icon: 'FileCertificate', color: 'purple' },
    { key: 'file_sk_pangkat_terakhir', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'amber' },
    { key: 'file_gaji_berkala_terakhir', label: 'SK Gaji Berkala Terakhir', icon: 'DollarSign', color: 'teal' },
    { key: 'file_skp_tahun_terakhir', label: 'SKP Tahun Terakhir', icon: 'FileCheck', color: 'green' },
    { key: 'file_sk_jabatan', label: 'SK Jabatan', icon: 'Briefcase', color: 'cyan' },
    { key: 'file_pernyataan_hukdis', label: 'Pernyataan Hukdis', icon: 'FileSignature', color: 'orange' },
    { key: 'file_pernyataan_pidana', label: 'Pernyataan Pidana', icon: 'FileSignature', color: 'red' },
    { key: 'file_pasphoto', label: 'Pas Photo', icon: 'Camera', color: 'gray' },
    { key: 'file_akta_anak', label: 'Akta Anak', icon: 'FileText', color: 'pink' },
    { key: 'file_susunan_keluarga', label: 'Susunan Keluarga', icon: 'Users', color: 'indigo' },
    { key: 'file_ijazah_transkrip', label: 'Ijazah & Transkrip', icon: 'GraduationCap', color: 'purple' },
    { key: 'file_ktp_npwp_rek', label: 'KTP/NPWP/Rekening', icon: 'IdCard', color: 'blue' },
    { key: 'file_akta_kematian', label: 'Akta Kematian', icon: 'FileText', color: 'gray' },
    { key: 'file_surat_nikah', label: 'Surat Nikah', icon: 'Heart', color: 'pink' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'emerald' },
];

export const pemberhentianService = {
    getAll: async (perangkatDaerah: string = ""): Promise<PemberhentianData[]> => {
        try {
            const url = perangkatDaerah ? `api/pemberhentian/${perangkatDaerah}` : 'api/pemberhentian';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.pemberhentian) {
                const pemberhentianData = response.data.pemberhentian;
                if (Array.isArray(pemberhentianData)) {
                    return pemberhentianData.map((item: any) => {
                        const processedItem: any = { ...item };
                        pemberhentianFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Pemberhentian data:', error);
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
                    endpoint = `api/pemberhentian/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/pemberhentian/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/pemberhentian/${id}/perbaikan`;
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
            console.error('Error updating Pemberhentian status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_pemberhentian_id', id);
            const response = await API.post(`api/pemberhentian/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading Pemberhentian file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post(`api/pemberhentian/${id}/edit-berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Pemberhentian file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<PemberhentianData | null> => {
        try {
            const response = await API.get(`api/pemberhentian/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.pemberhentian) {
                return response.data.pemberhentian;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Pemberhentian detail:', error);
            throw error;
        }
    }
};

export default pemberhentianService;