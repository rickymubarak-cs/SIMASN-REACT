// src/service/pangkatService.ts
import API from './api';

export interface PangkatData {
    layanan_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_status?: string;
    lay_kp_jenis?: string;
    layanan_tgl?: string;
    timestamp?: string;
    keterangan?: string;
    file_layPangkat_pak?: string;
    file_layPangkat_SkJF?: string;
    file_layPangkat_kPAK?: string;
    file_skpg?: string;
    file_layPangkat_ijazah?: string;
    file_layPangkat_transkipnilai?: string;
    file_layPangkat_uraiantugas?: string;
    file_layPangkat_dikti?: string;
    file_layPangkat_akreditasi?: string;
    file_layPangkat_pengantar?: string;
    file_pangkat?: string;
    file_skp?: string;
    file_jabatan?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/KenaikanPangkat/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/pangkat/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const pangkatFileConfig = [
    { key: 'file_layPangkat_pak', label: 'PAK (Penilaian Angka Kredit)', icon: 'FileCheck', color: 'blue' },
    { key: 'file_layPangkat_SkJF', label: 'SK Jabatan Fungsional', icon: 'Briefcase', color: 'cyan' },
    { key: 'file_layPangkat_kPAK', label: 'KPAK', icon: 'FileText', color: 'indigo' },
    { key: 'file_skpg', label: 'SKPG', icon: 'FileCheck', color: 'green' },
    { key: 'file_layPangkat_ijazah', label: 'Ijazah Terakhir', icon: 'GraduationCap', color: 'purple' },
    { key: 'file_layPangkat_transkipnilai', label: 'Transkrip Nilai', icon: 'FileText', color: 'amber' },
    { key: 'file_layPangkat_uraiantugas', label: 'Uraian Tugas', icon: 'FileText', color: 'orange' },
    { key: 'file_layPangkat_dikti', label: 'Forlap Dikti', icon: 'Database', color: 'teal' },
    { key: 'file_layPangkat_akreditasi', label: 'Akreditasi Prodi', icon: 'Award', color: 'rose' },
    { key: 'file_layPangkat_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'emerald' },
    { key: 'file_pangkat', label: 'SK Pangkat', icon: 'Award', color: 'purple' },
    { key: 'file_skp', label: 'SKP 2 Tahun Terakhir', icon: 'FileCheck', color: 'indigo' },
    { key: 'file_jabatan', label: 'SK Jabatan', icon: 'Briefcase', color: 'cyan' },
];

export const pangkatService = {
    getAll: async (perangkatDaerah: string = ""): Promise<PangkatData[]> => {
        try {
            const url = perangkatDaerah ? `api/pangkat/${perangkatDaerah}` : 'api/pangkat';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.pangkat) {
                const pangkatData = response.data.pangkat;
                if (Array.isArray(pangkatData)) {
                    return pangkatData.map((item: any) => {
                        const processedItem: any = { ...item };
                        pangkatFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Pangkat data:', error);
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
                    endpoint = `api/pangkat/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/pangkat/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/pangkat/${id}/perbaikan`;
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
            console.error('Error updating Pangkat status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_id', id);
            const response = await API.post(`api/pangkat/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading Pangkat file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post(`api/pangkat/${id}/edit-berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Pangkat file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<PangkatData | null> => {
        try {
            const response = await API.get(`api/pangkat/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.pangkat) {
                return response.data.pangkat;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Pangkat detail:', error);
            throw error;
        }
    }
};

export default pangkatService;