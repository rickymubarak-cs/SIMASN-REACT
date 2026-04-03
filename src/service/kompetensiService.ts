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
    riw_kom_no?: string;
    riw_kom_tmtm?: string;
    riw_kom_tmts?: string;
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

// ==============================================
// BASE URL UNTUK BERKAS - TETAP PAKAI SERVER LAMA
// ==============================================

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Kompetensi/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/kompetensi/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

// Konfigurasi file untuk Kompetensi
export const kompetensiFileConfig = [
    { key: 'file_sertifikat', label: 'Sertifikat Kompetensi', icon: 'Award', color: 'orange' },
];

// ==============================================
// KOMPETENSI SERVICE - DISESUAIKAN DENGAN API LARAVEL
// ==============================================

export const kompetensiService = {
    // Get all Kompetensi data
    getAll: async (perangkatDaerah: string = ""): Promise<KompetensiData[]> => {
        try {
            const url = perangkatDaerah ? `api/kompetensi/${perangkatDaerah}` : 'api/kompetensi';
            const response = await API.get(url);
            console.log('Kompetensi API Response:', response.data);

            if (response.data?.status === 'success' && response.data?.kompetensi) {
                const kompetensiData = response.data.kompetensi;

                if (Array.isArray(kompetensiData)) {
                    return kompetensiData.map((item: any) => {
                        const processedItem: any = { ...item };

                        kompetensiFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Kompetensi data:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<KompetensiData | null> => {
        try {
            const response = await API.get(`api/kompetensi/detail/${id}`);

            if (response.data?.status === 'success' && response.data?.kompetensi) {
                const item = response.data.kompetensi;

                const processedItem: any = { ...item };
                kompetensiFileConfig.forEach(fileConfig => {
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
            }
            return null;
        } catch (error) {
            console.error('Error fetching Kompetensi detail:', error);
            throw error;
        }
    },

    // Update status (terima, tolak, perbaiki)
    updateStatus: async (id: string, status: string, keterangan?: string): Promise<any> => {
        try {
            let endpoint = '';
            let method: 'put' | 'post' = 'post';
            let data: any = null;

            switch (status) {
                case 'diterima':
                    endpoint = `api/kompetensi/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/kompetensi/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/kompetensi/${id}/perbaikan`;
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
            console.error('Error updating Kompetensi status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('kompetensi_id', id);

            const response = await API.post(`api/kompetensi/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Kompetensi file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('kompetensi_id', id);
            formData.append('old_file_status_pelayanan', oldFile);
            formData.append('_method', 'PUT');

            const response = await API.post(`api/kompetensi/${id}/berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Kompetensi file:', error);
            throw error;
        }
    }
};

export default kompetensiService;