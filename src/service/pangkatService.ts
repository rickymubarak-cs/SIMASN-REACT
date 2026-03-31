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
    layanan_tgl?: string;
    keterangan?: string;
    // File-file Pangkat
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
    lay_kp_jenis?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/KenaikanPangkat/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/pangkat/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Pangkat
export const pangkatFileConfig = [
    { key: 'file_pangkat', label: 'File Kenaikan Pangkat', icon: 'TrendingUp', color: 'purple' },
    { key: 'file_skp', label: 'File SKP', icon: 'FileCheck', color: 'blue' },
    { key: 'file_jabatan', label: 'File Jabatan', icon: 'Briefcase', color: 'indigo' },
    { key: 'file_layPangkat_pak', label: 'File PAK', icon: 'FileCheck', color: 'green' },
    { key: 'file_layPangkat_SkJF', label: 'SK JF', icon: 'FileText', color: 'orange' },
    { key: 'file_layPangkat_kPAK', label: 'kPAK', icon: 'FileText', color: 'amber' },
    { key: 'file_skpg', label: 'SKPG', icon: 'FileText', color: 'teal' },
    { key: 'file_layPangkat_ijazah', label: 'Ijazah', icon: 'Award', color: 'cyan' },
    { key: 'file_layPangkat_transkipnilai', label: 'Transkip Nilai', icon: 'FileText', color: 'sky' },
    { key: 'file_layPangkat_uraiantugas', label: 'Uraian Tugas', icon: 'FileText', color: 'slate' },
    { key: 'file_layPangkat_dikti', label: 'Forlap Dikti', icon: 'Image', color: 'pink' },
    { key: 'file_layPangkat_akreditasi', label: 'Akreditasi', icon: 'CheckCircle', color: 'emerald' },
    { key: 'file_layPangkat_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'gray' }
];

export const pangkatService = {
    // Get all Pangkat data
    getAll: async (perangkatDaerah: string = ""): Promise<PangkatData[]> => {
        try {
            const url = perangkatDaerah
                ? `api/EndPointAPI/getpangkat/${perangkatDaerah}`
                : 'api/EndPointAPI/getpangkat';

            const response = await API.get(url);

            if (response.data?.status && response.data?.data) {
                const pangkatData = response.data.data.pangkat;

                if (Array.isArray(pangkatData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return pangkatData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        pangkatFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Pangkat data:', error);
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
                endpoint = `layanan_admin/pangkatStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/pangkatStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/pangkatStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuspangkatPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_pangkat_id', id);
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
            console.error('Error updating Pangkat status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_pangkat_id', id);

            const response = await API.post('layanan_admin/berkasLayananPangkat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Pangkat file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_pangkat_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananPangkat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Pangkat file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<PangkatData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getpangkatbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Pangkat detail:', error);
            throw error;
        }
    }
};

export default pangkatService;