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
    layanan_tubel_usia?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file Tugas Belajar
    file_skp1?: string;           // SKP Tahunan 2025
    file_skp2?: string;           // SKP Tahunan 2024-2025
    file_hukdis?: string;         // Pernyataan Tidak Pernah Dijatuhi Hukuman Disiplin
    file_ctln?: string;           // Pernyataan Tidak Cuti Diluar Tanggungan Negara
    file_pendidikan?: string;     // Pernyataan Kesediaan Menanggung Biaya Pendidikan
    file_atasan?: string;         // Surat Keterangan Persetujuan Melanjutkan Pendidikan
    file_rekompendidikan?: string; // Surat Rekomendasi Melanjutkan Pendidikan
    file_penyesuaianijazah?: string; // Surat Pernyataan Penyesuaian Ijazah
    file_permohonan?: string;     // Surat Permohonan Izin Belajar
    file_anjab?: string;          // ANJAB dan ABK
    file_pernyataan?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Tubel/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/tubel/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

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

export const tubelService = {
    // Get all Tugas Belajar data
    getAll: async (perangkatDaerah: string = ""): Promise<TubelData[]> => {
        try {
            const url = perangkatDaerah
                ? `api/EndPointAPI/gettubel/${perangkatDaerah}`
                : 'api/EndPointAPI/gettubel';

            const response = await API.get(url);
            console.log('Tubel API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const tubelData = response.data.data.tubel;

                if (Array.isArray(tubelData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return tubelData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        tubelFileConfig.forEach(fileConfig => {
                            const fileValue = item[fileConfig.key];
                            if (fileValue && fileValue.trim() !== '') {
                                processedItem[`${fileConfig.key}_url`] = `${BASE_URL_BERKAS}${fileValue}`;
                            } else {
                                processedItem[`${fileConfig.key}_url`] = null;
                            }
                        });

                        // URL untuk berkas hasil
                        processedItem.file_status_pelayanan_url = item.file_status_pelayanan
                            ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}`
                            : null;

                        // URL untuk foto
                        processedItem.foto_url = item.foto
                            ? `${BASE_URL_FOTO}${item.foto}`
                            : null;

                        return processedItem;
                    });
                }
            }

            return [];
        } catch (error) {
            console.error('Error fetching Tubel data:', error);
            throw error;
        }
    },

    // Update status (terima, tolak, perbaiki)
    updateStatus: async (id: string, status: string, keterangan?: string): Promise<any> => {
        try {
            let endpoint = '';
            let method: 'get' | 'post' = 'get';
            let data = null;

            if (status === 'diterima') {
                endpoint = `layanan_admin/tubelStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/tubelStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/tubelStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statustubelPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_tubel_id', id);
                if (keterangan) {
                    formData.append('keterangan', keterangan);
                }
                data = formData;
            }

            let response;
            if (method === 'post') {
                response = await API.post(endpoint, data, {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
            } else {
                response = await API.get(endpoint);
            }

            return response.data;
        } catch (error) {
            console.error('Error updating Tubel status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_tubel_id', id);

            const response = await API.post('layanan_admin/berkasLayananTubel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Tubel file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_tubel_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananTubel', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Tubel file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<TubelData | null> => {
        try {
            const response = await API.get(`EndPointAPI/gettubelbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Tubel detail:', error);
            throw error;
        }
    }
};

export default tubelService;