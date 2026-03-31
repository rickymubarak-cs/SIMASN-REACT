// src/service/kompetensiService.ts
import API from './api';

export interface KompetensiData {
    komp_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_status?: string;
    riw_kom_jenis?: string;
    riw_kom_nama?: string;
    riw_kom_penyelenggara?: string;
    riw_kom_no?: string;
    riw_kom_tmtm?: string;
    riw_kom_tmts?: string;
    riw_kom_tahun?: string;
    riw_kom_jp?: string;
    timestamp?: string;
    keterangan?: string;
    file_sertifikat?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Kompetensi/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/kompetensi/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Pengembangan Kompetensi
export const kompetensiFileConfig = [
    { key: 'file_sertifikat', label: 'Sertifikat / Surat Tanda Tamat', icon: 'Award', color: 'blue' }
];

export const kompetensiService = {
    // Get all Kompetensi data
    getAll: async (perangkatDaerah: string = ""): Promise<KompetensiData[]> => {
        try {
            const url = perangkatDaerah
                ? `/api/EndPointAPI/getkompetensi/${perangkatDaerah}`
                : '/api/EndPointAPI/getkompetensi';

            const response = await API.get(url);
            console.log('Kompetensi API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const kompetensiData = response.data.data.kompetensi;

                if (Array.isArray(kompetensiData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return kompetensiData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk file sertifikat
                        if (item.file_sertifikat && item.file_sertifikat.trim() !== '') {
                            processedItem.file_sertifikat_url = `${BASE_URL_BERKAS}${item.file_sertifikat}`;
                        } else {
                            processedItem.file_sertifikat_url = null;
                        }

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
            console.error('Error fetching Kompetensi data:', error);
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
                endpoint = `layanan_admin/kompetensiStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/kompetensiStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/kompetensiStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuskompetensiPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('komp_id', id);
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
            console.error('Error updating Kompetensi status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('komp_id', id);

            const response = await API.post('layanan_admin/berkasLayananKompetensi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Kompetensi file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('komp_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananKompetensi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Kompetensi file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<KompetensiData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getkompetensibyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Kompetensi detail:', error);
            throw error;
        }
    }
};

export default kompetensiService;