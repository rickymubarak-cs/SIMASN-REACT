// src/service/tubelService.ts
import API from './api';

export interface TubelData {
    layanan_tubel_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_tubel_status?: string;
    layanan_tubel_status_pns?: string;
    layanan_tubel_usia?: number;
    keterangan?: string;
    // File-file Tugas Belajar
    file_skp1?: string;
    file_skp2?: string;
    file_hukdis?: string;
    file_ctln?: string;
    file_pendidikan?: string;
    file_atasan?: string;
    file_rekompendidikan?: string;
    file_penyesuaianijazah?: string;
    file_permohonan?: string;
    file_anjab?: string;
    file_pernyataan?: string;
    file_status_pelayanan?: string;
    status_kuisioner?: string;
    foto?: string;
    [key: string]: any;
}

// ==============================================
// BASE URL UNTUK BERKAS - TETAP PAKAI SERVER LAMA
// ==============================================

// SERVER LAMA untuk file/foto (CI3)
const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Tubel/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/tubel/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

// Konfigurasi file untuk Tugas Belajar
export const tubelFileConfig = [
    { key: 'file_skp1', label: 'SKP Tahunan 2025', icon: 'FileCheck', color: 'blue' },
    { key: 'file_skp2', label: 'SKP Tahunan 2024-2025', icon: 'FileCheck', color: 'cyan' },
    { key: 'file_hukdis', label: 'Pernyataan Tidak Pernah Dijatuhi Hukuman Disiplin', icon: 'Gavel', color: 'orange' },
    { key: 'file_ctln', label: 'Pernyataan Tidak Cuti Diluar Tanggungan Negara', icon: 'FileText', color: 'purple' },
    { key: 'file_pendidikan', label: 'Pernyataan Kesediaan Menanggung Biaya Pendidikan', icon: 'Wallet', color: 'green' },
    { key: 'file_atasan', label: 'Surat Keterangan Persetujuan Melanjutkan Pendidikan', icon: 'FileSignature', color: 'indigo' },
    { key: 'file_rekompendidikan', label: 'Surat Rekomendasi Melanjutkan Pendidikan', icon: 'Mail', color: 'pink' },
    { key: 'file_penyesuaianijazah', label: 'Surat Pernyataan Penyesuaian Ijazah', icon: 'FileText', color: 'amber' },
    { key: 'file_permohonan', label: 'Surat Permohonan Izin Belajar', icon: 'FileSignature', color: 'red' },
    { key: 'file_anjab', label: 'ANJAB dan ABK', icon: 'FileText', color: 'teal' },
    { key: 'file_pernyataan', label: 'Surat Pernyataan', icon: 'FileText', color: 'gray' }
];

// ==============================================
// TUBEL SERVICE - DISESUAIKAN DENGAN API LARAVEL
// ==============================================

export const tubelService = {
    // Get all TUBEL data
    getAll: async (perangkatDaerah: string = ""): Promise<TubelData[]> => {
        try {
            // API dari Laravel
            const url = perangkatDaerah
                ? `api/tubel/${perangkatDaerah}`   // GET /api/tubel/{perangkat_daerah}
                : 'api/tubel';                     // GET /api/tubel

            const response = await API.get(url);
            console.log('TUBEL API Response:', response.data);

            // Response dari Laravel: { status: "success", message: "...", tubel: [...] }
            if (response.data?.status === 'success' && response.data?.tubel) {
                const tubelData = response.data.tubel;

                if (Array.isArray(tubelData)) {
                    // Proses data untuk menambahkan URL file yang benar (tetap dari server lama)
                    return tubelData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada - PAKAI SERVER LAMA
                        tubelFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching TUBEL data:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<TubelData | null> => {
        try {
            const response = await API.get(`api/tubel/detail/${id}`);

            if (response.data?.status === 'success' && response.data?.tubel) {
                const item = response.data.tubel;

                // Proses URL file seperti di getAll
                const processedItem: any = { ...item };
                tubelFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching TUBEL detail:', error);
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
                    endpoint = `api/tubel/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/tubel/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/tubel/${id}/perbaikan`;
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
            console.error('Error updating TUBEL status:', error);
            throw error;
        }
    },

    // Upload berkas hasil - upload ke Laravel
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('tubel_id', id);

            const response = await API.post(`api/tubel/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading TUBEL file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('tubel_id', id);
            formData.append('old_file_status_pelayanan', oldFile);
            formData.append('_method', 'PUT');

            const response = await API.post(`api/tubel/${id}/berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing TUBEL file:', error);
            throw error;
        }
    }
};

export default tubelService;