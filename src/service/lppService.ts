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
    tgl_usul?: string;
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

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/KarisKarsu/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/lpp/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk LPP
export const lppFileConfig = [
    { key: 'file_layLpp_pak', label: 'File PAK', icon: 'FileCheck', color: 'blue' },
    { key: 'file_layLpp_cpns', label: 'File CPNS', icon: 'FileText', color: 'green' },
    { key: 'file_layLpp_pns', label: 'File PNS', icon: 'FileText', color: 'purple' },
    { key: 'file_layLpp_pangkat', label: 'File Pangkat', icon: 'TrendingUp', color: 'orange' },
    { key: 'file_layLpp_jabatan', label: 'File Jabatan', icon: 'Briefcase', color: 'indigo' },
    { key: 'file_layLpp_tubel', label: 'File Tugas Belajar', icon: 'GraduationCap', color: 'amber' },
    { key: 'file_layLpp_ijazah', label: 'File Ijazah', icon: 'Award', color: 'teal' },
    { key: 'file_layLpp_nilai', label: 'File Nilai/Transkip', icon: 'FileText', color: 'cyan' },
    { key: 'file_layLpp_forlapDikti', label: 'File Forlap Dikti', icon: 'Image', color: 'pink' },
    { key: 'file_layLpp_akreditasi', label: 'File Akreditasi', icon: 'CheckCircle', color: 'emerald' },
    { key: 'file_layLpp_skp', label: 'File SKP', icon: 'FileCheck', color: 'rose' },
    { key: 'file_layLpp_pernyataan', label: 'File Pernyataan', icon: 'FileText', color: 'slate' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'gray' }
];

export const lppService = {
    // Get all LPP data
    getAll: async (perangkatDaerah: string = ""): Promise<LppData[]> => {
        try {

            const url = perangkatDaerah
                ? `EndPointAPI/getlpp/${perangkatDaerah}`
                : 'EndPointAPI/getlpp';

            const response = await API.get(url);

            if (response.data?.status && response.data?.data) {
                const lppData = response.data.data.lpp;

                if (Array.isArray(lppData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return lppData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        lppFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching LPP data:', error);
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
                endpoint = `layanan_admin/lppStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/lppStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/lppStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuslppPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_lpp_id', id);
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
            console.error('Error updating LPP status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_lpp_id', id);

            const response = await API.post('layanan_admin/berkasLayananLpp', formData, {
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
            formData.append('layanan_lpp_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananLpp', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing LPP file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<LppData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getlppbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching LPP detail:', error);
            throw error;
        }
    }
};

export default lppService;