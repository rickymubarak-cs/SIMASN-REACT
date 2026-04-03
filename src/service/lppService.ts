// src/service/lppService.ts
import API from './api';

export interface LppData {
    layanan_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_lpp_status?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file LPP
    file_layLpp_pak?: string;
    file_layLpp_cpns?: string;
    file_layLpp_pns?: string;
    file_layLpp_pangkat?: string;
    file_layLpp_jabatan?: string;
    file_layLpp_tubel?: string;
    file_layLpp_ijazah?: string;
    file_layLpp_nilai?: string;
    file_layLpp_forlapDikti?: string;
    file_layLpp_akreditasi?: string;
    file_layLpp_skp?: string;
    file_layLpp_pernyataan?: string;
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
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/KarisKarsu/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/kariskarsu/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

// Konfigurasi file untuk LPP
export const lppFileConfig = [
    { key: 'file_layLpp_pak', label: 'PAK (Penilaian Angka Kredit)', icon: 'FileCheck', color: 'blue' },
    { key: 'file_layLpp_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_layLpp_pns', label: 'SK PNS', icon: 'FileCertificate', color: 'purple' },
    { key: 'file_layLpp_pangkat', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'amber' },
    { key: 'file_layLpp_jabatan', label: 'SK Jabatan Terakhir', icon: 'Briefcase', color: 'cyan' },
    { key: 'file_layLpp_tubel', label: 'SK Tugas Belajar', icon: 'GraduationCap', color: 'teal' },
    { key: 'file_layLpp_ijazah', label: 'Ijazah Terakhir', icon: 'FileText', color: 'green' },
    { key: 'file_layLpp_nilai', label: 'Transkrip Nilai', icon: 'FileText', color: 'rose' },
    { key: 'file_layLpp_forlapDikti', label: 'Forlap Dikti', icon: 'Database', color: 'orange' },
    { key: 'file_layLpp_akreditasi', label: 'Akreditasi Prodi', icon: 'Award', color: 'purple' },
    { key: 'file_layLpp_skp', label: 'SKP 2 Tahun Terakhir', icon: 'FileCheck', color: 'indigo' },
    { key: 'file_layLpp_pernyataan', label: 'Surat Pernyataan', icon: 'FileSignature', color: 'pink' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'emerald' },
];

// ==============================================
// LPP SERVICE - DISESUAIKAN DENGAN API LARAVEL
// ==============================================

export const lppService = {
    // Get all LPP data
    getAll: async (perangkatDaerah: string = ""): Promise<LppData[]> => {
        try {
            const url = perangkatDaerah
                ? `api/lpp/${perangkatDaerah}`
                : 'api/lpp';

            const response = await API.get(url);
            console.log('LPP API Response:', response.data);

            if (response.data?.status === 'success' && response.data?.lpp) {
                const lppData = response.data.lpp;

                if (Array.isArray(lppData)) {
                    return lppData.map((item: any) => {
                        const processedItem: any = { ...item };

                        lppFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching LPP data:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<LppData | null> => {
        try {
            const response = await API.get(`api/lpp/detail/${id}`);

            if (response.data?.status === 'success' && response.data?.lpp) {
                const item = response.data.lpp;

                const processedItem: any = { ...item };
                lppFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching LPP detail:', error);
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
                    endpoint = `api/lpp/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/lpp/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/lpp/${id}/perbaikan`;
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
            console.error('Error updating LPP status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('lpp_id', id);

            const response = await API.post(`api/lpp/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading LPP file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('lpp_id', id);
            formData.append('old_file_status_pelayanan', oldFile);
            formData.append('_method', 'PUT');

            const response = await API.post(`api/lpp/${id}/berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing LPP file:', error);
            throw error;
        }
    }
};

export default lppService;