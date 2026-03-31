// src/service/diklatService.ts
import API from './api';

export interface DiklatData {
    layanan_diklat_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_diklat_status?: string;
    nama_usulan_diklat?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file Diklat
    file_lampiranbiaya?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Diklat/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/diklat/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Diklat
export const diklatFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'green' },
    { key: 'file_lampiranbiaya', label: 'Lampiran Biaya', icon: 'FileText', color: 'blue' }
];

export const diklatService = {
    // Get all Diklat data
    getAll: async (perangkatDaerah: string = ""): Promise<DiklatData[]> => {
        try {
            const url = perangkatDaerah
                ? `/api/EndPointAPI/getdiklat/${perangkatDaerah}`
                : '/api/EndPointAPI/getdiklat';

            const response = await API.get(url);
            console.log('Diklat API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const diklatData = response.data.data.diklat;

                if (Array.isArray(diklatData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return diklatData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        diklatFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Diklat data:', error);
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
                endpoint = `layanan_admin/diklatStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/diklatStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/diklatStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statusdiklatPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_diklat_id', id);
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
            console.error('Error updating Diklat status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_diklat_id', id);

            const response = await API.post('layanan_admin/berkasLayananDiklat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Diklat file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_diklat_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananDiklat', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Diklat file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<DiklatData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getdiklatbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Diklat detail:', error);
            throw error;
        }
    }
};

export default diklatService;