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

// ==============================================
// BASE URL UNTUK BERKAS - TETAP PAKAI SERVER LAMA
// ==============================================

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Data/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/data/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

// Konfigurasi file untuk Perubahan Data
export const dataFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'slate' },
    { key: 'file_lampirandukung', label: 'Lampiran Pendukung', icon: 'Paperclip', color: 'blue' },
];

// ==============================================
// DATA SERVICE - DISESUAIKAN DENGAN API LARAVEL
// ==============================================

export const dataService = {
    // Get all Data Perubahan data
    getAll: async (perangkatDaerah: string = ""): Promise<DataPerubahanData[]> => {
        try {
            const url = perangkatDaerah ? `api/data/${perangkatDaerah}` : 'api/data';
            const response = await API.get(url);
            console.log('Data API Response:', response.data);

            if (response.data?.status === 'success' && response.data?.data_perubahan) {
                const dataPerubahan = response.data.data_perubahan;

                if (Array.isArray(dataPerubahan)) {
                    return dataPerubahan.map((item: any) => {
                        const processedItem: any = { ...item };

                        dataFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Data Perubahan data:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<DataPerubahanData | null> => {
        try {
            const response = await API.get(`api/data/detail/${id}`);

            if (response.data?.status === 'success' && response.data?.data_perubahan) {
                const item = response.data.data_perubahan;

                const processedItem: any = { ...item };
                dataFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Data Perubahan detail:', error);
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
                    endpoint = `api/data/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/data/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/data/${id}/perbaikan`;
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
            console.error('Error updating Data Perubahan status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('data_id', id);

            const response = await API.post(`api/data/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Data Perubahan file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('data_id', id);
            formData.append('old_file_status_pelayanan', oldFile);
            formData.append('_method', 'PUT');

            const response = await API.post(`api/data/${id}/berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Data Perubahan file:', error);
            throw error;
        }
    }
};

export default dataService;