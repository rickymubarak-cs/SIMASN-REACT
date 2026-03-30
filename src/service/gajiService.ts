// src/service/gajiService.ts
import API from './api';

export interface GajiData {
    layanan_gaji_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_berkala_status?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file Gaji Berkala
    file_pengantar?: string;
    file_skp?: string;
    file_hukdis?: string;
    file_sk_cpns?: string;
    file_sk_pns?: string;
    file_sk_pangkat?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Berkala/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/gaji/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Gaji Berkala
export const gajiFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'green' },
    { key: 'file_skp', label: 'File SKP', icon: 'FileCheck', color: 'blue' },
    { key: 'file_hukdis', label: 'File Kenaikan Gaji Berkala Terakhir', icon: 'TrendingUp', color: 'orange' },
    { key: 'file_sk_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'purple' },
    { key: 'file_sk_pns', label: 'SK PNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_sk_pangkat', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'orange' }
];

export const gajiService = {
    // Get all Gaji Berkala data
    getAll: async (perangkatDaerah: string = ""): Promise<GajiData[]> => {
        try {
            const url = perangkatDaerah
                ? `EndPointAPI/getgaji/${perangkatDaerah}`
                : 'EndPointAPI/getgaji';

            const response = await API.get(url);
            console.log('Gaji API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const gajiData = response.data.data.gaji;

                if (Array.isArray(gajiData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return gajiData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        gajiFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Gaji data:', error);
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
                endpoint = `layanan_admin/gajiStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/gajiStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/gajiStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statusgajiPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_gaji_id', id);
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
            console.error('Error updating Gaji status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_gaji_id', id);

            const response = await API.post('layanan_admin/berkasLayananGaji', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Gaji file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_gaji_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananGaji', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Gaji file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<GajiData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getgajibyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Gaji detail:', error);
            throw error;
        }
    }
};

export default gajiService;