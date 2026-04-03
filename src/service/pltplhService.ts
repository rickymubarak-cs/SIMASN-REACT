// src/service/pltplhService.ts
import API from './api';

export interface PltplhData {
    layanan_pltplh_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_pltplh_pengajuan?: string;
    layanan_pltplh_status?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file PLTPLP
    file_usulan?: string;
    file_skpengganti?: string;
    file_sk_pltplh?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// ==============================================
// BASE URL UNTUK BERKAS - TETAP PAKAI SERVER LAMA
// ==============================================

// SERVER LAMA untuk file/foto (CI3)
const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/PltPlh/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/pltplh/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

// Konfigurasi file untuk PLTPLP
export const pltplhFileConfig = [
    { key: 'file_usulan', label: 'Surat Usulan', icon: 'Mail', color: 'blue' },
    { key: 'file_skpengganti', label: 'SK Pengganti', icon: 'FileSignature', color: 'green' },
    { key: 'file_sk_pltplh', label: 'SK PLT/PLH', icon: 'FileCheck', color: 'purple' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'FileText', color: 'orange' },
];

// ==============================================
// PLTPLP SERVICE - DISESUAIKAN DENGAN API LARAVEL
// ==============================================

export const pltplhService = {
    // Get all PLTPLP data
    getAll: async (perangkatDaerah: string = ""): Promise<PltplhData[]> => {
        try {
            // API dari Laravel
            const url = perangkatDaerah
                ? `api/pltplh/${perangkatDaerah}`  // GET /api/pltplh/{perangkat_daerah}
                : 'api/pltplh';                    // GET /api/pltplh

            const response = await API.get(url);
            console.log('PLTPLP API Response:', response.data);

            // Response dari Laravel: { status: "success", message: "...", pltplh: [...] }
            if (response.data?.status === 'success' && response.data?.pltplh) {
                const pltplhData = response.data.pltplh;

                if (Array.isArray(pltplhData)) {
                    // Proses data untuk menambahkan URL file yang benar (tetap dari server lama)
                    return pltplhData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada - PAKAI SERVER LAMA
                        pltplhFileConfig.forEach(fileConfig => {
                            const fileValue = item[fileConfig.key];
                            if (fileValue && fileValue.trim() !== '') {
                                processedItem[`${fileConfig.key}_url`] = `${BASE_URL_BERKAS}${fileValue}`;
                            } else {
                                processedItem[`${fileConfig.key}_url`] = null;
                            }
                        });

                        // URL untuk berkas hasil - PAKAI SERVER LAMA
                        processedItem.file_status_pelayanan_url = item.file_status_pelayanan
                            ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}`
                            : null;

                        // URL untuk foto - PAKAI SERVER LAMA
                        processedItem.foto_url = item.foto
                            ? `${BASE_URL_FOTO}${item.foto}`
                            : null;

                        return processedItem;
                    });
                }
            }

            return [];
        } catch (error) {
            console.error('Error fetching PLTPLP data:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<PltplhData | null> => {
        try {
            const response = await API.get(`api/pltplh/detail/${id}`);

            if (response.data?.status === 'success' && response.data?.pltplh) {
                const item = response.data.pltplh;

                // Proses URL file seperti di getAll
                const processedItem: any = { ...item };
                pltplhFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching PLTPLP detail:', error);
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
                    endpoint = `api/pltplh/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/pltplh/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/pltplh/${id}/perbaikan`;
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
            console.error('Error updating PLTPLP status:', error);
            throw error;
        }
    },

    // Upload berkas hasil - upload ke Laravel
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('pltplh_id', id);

            const response = await API.post(`api/pltplh/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading PLTPLP file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('pltplh_id', id);
            formData.append('old_file_status_pelayanan', oldFile);
            formData.append('_method', 'PUT');

            const response = await API.post(`api/pltplh/${id}/berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing PLTPLP file:', error);
            throw error;
        }
    }
};

export default pltplhService;