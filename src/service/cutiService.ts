// src/service/cutiService.ts
import API from './api';

export interface CutiData {
    layanan_cuti_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_cuti_status?: string;
    jenis_cuti?: string;
    cTahunan_dalamLuar?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file Cuti
    file_pengantar?: string;
    file_a?: string;
    file_b?: string;
    file_c?: string;
    file_d?: string;
    file_e?: string;
    file_f?: string;
    file_g?: string;
    file_h?: string;
    file_i?: string;
    file_j?: string;
    file_k?: string;
    file_l?: string;
    file_m?: string;
    file_n?: string;
    file_o?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Cuti/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/cuti/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Cuti
export const cutiFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'gray' },
    { key: 'file_a', label: 'Berkas A', icon: 'FileText', color: 'blue' },
    { key: 'file_b', label: 'Berkas B', icon: 'FileText', color: 'green' },
    { key: 'file_c', label: 'Berkas C', icon: 'FileText', color: 'purple' },
    { key: 'file_d', label: 'Berkas D', icon: 'FileText', color: 'orange' },
    { key: 'file_e', label: 'Berkas E', icon: 'FileText', color: 'pink' },
    { key: 'file_f', label: 'Berkas F', icon: 'FileText', color: 'indigo' },
    { key: 'file_g', label: 'Berkas G', icon: 'FileText', color: 'teal' },
    { key: 'file_h', label: 'Berkas H', icon: 'FileText', color: 'cyan' },
    { key: 'file_i', label: 'Berkas I', icon: 'FileText', color: 'amber' },
    { key: 'file_j', label: 'Berkas J', icon: 'FileText', color: 'lime' },
    { key: 'file_k', label: 'Berkas K', icon: 'FileText', color: 'rose' },
    { key: 'file_l', label: 'Berkas L', icon: 'FileText', color: 'emerald' },
    { key: 'file_m', label: 'Berkas M', icon: 'FileText', color: 'sky' },
    { key: 'file_n', label: 'Berkas N', icon: 'FileText', color: 'violet' },
    { key: 'file_o', label: 'Berkas O', icon: 'FileText', color: 'fuchsia' }
];

export const cutiService = {
    // Get all Cuti data
    getAll: async (perangkatDaerah: string = ""): Promise<CutiData[]> => {
        try {
            const url = perangkatDaerah
                ? `EndPointAPI/getcuti/${perangkatDaerah}`
                : 'EndPointAPI/getcuti';

            const response = await API.get(url);

            if (response.data?.status && response.data?.data) {
                const cutiData = response.data.data.cuti;

                if (Array.isArray(cutiData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return cutiData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        cutiFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Cuti data:', error);
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
                endpoint = `layanan_admin/cutiStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/cutiStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/cutiStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuscutiPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_cuti_id', id);
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
            console.error('Error updating Cuti status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_cuti_id', id);

            const response = await API.post('layanan_admin/berkasLayananCuti', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Cuti file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_cuti_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananCuti', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Cuti file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<CutiData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getcutibyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Cuti detail:', error);
            throw error;
        }
    }
};

export default cutiService;