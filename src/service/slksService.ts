// src/service/slksService.ts
import API from './api';

export interface SlksData {
    slks_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_status?: string;
    lay_slks_mk?: string;
    layanan_tgl?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file SLKS
    file_laySlks_pengantar?: string;
    file_laySlks_pertanggungjawaban?: string;
    file_laySlks_drh?: string;
    file_laySlks_cpns?: string;
    file_laySlks_mutasi?: string;
    file_laySlks_pangkat?: string;
    file_laySlks_jabatan?: string;
    file_laySlks_piagam?: string;
    file_laySlks_konversinip?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/SLKS/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/slks/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk SLKS
export const slksFileConfig = [
    { key: 'file_laySlks_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'green' },
    { key: 'file_laySlks_pertanggungjawaban', label: 'Surat Pertanggungjawaban', icon: 'FileSignature', color: 'blue' },
    { key: 'file_laySlks_drh', label: 'Daftar Riwayat Hidup (DRH)', icon: 'FileText', color: 'purple' },
    { key: 'file_laySlks_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_laySlks_mutasi', label: 'SK Mutasi', icon: 'FileCheck', color: 'orange' },
    { key: 'file_laySlks_pangkat', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'amber' },
    { key: 'file_laySlks_jabatan', label: 'SK Jabatan Terakhir', icon: 'Briefcase', color: 'cyan' },
    { key: 'file_laySlks_piagam', label: 'Piagam SLKS Sebelumnya', icon: 'Award', color: 'teal' },
    { key: 'file_laySlks_konversinip', label: 'SK Konversi NIP', icon: 'IdCard', color: 'rose' }
];

export const slksService = {
    // Get all SLKS data
    getAll: async (perangkatDaerah: string = ""): Promise<SlksData[]> => {
        try {
            const url = perangkatDaerah
                ? `EndPointAPI/getslks/${perangkatDaerah}`
                : 'EndPointAPI/getslks';

            const response = await API.get(url);
            console.log('SLKS API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const slksData = response.data.data.slks;

                if (Array.isArray(slksData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return slksData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        slksFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching SLKS data:', error);
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
                endpoint = `layanan_admin/slksStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/slksStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/slksStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statusslksPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('slks_id', id);
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
            console.error('Error updating SLKS status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('slks_id', id);

            const response = await API.post('layanan_admin/berkasLayananSlks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading SLKS file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('slks_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananSlks', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing SLKS file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<SlksData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getslksbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching SLKS detail:', error);
            throw error;
        }
    }
};

export default slksService;