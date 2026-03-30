// src/service/jfService.ts
import API from './api';

export interface JFData {
    layanan_jf_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_jf_status?: string;
    jenis_jf?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file JF
    file_a?: string;        // SK Jabatan Terakhir
    file_b?: string;        // SKP 2 Tahun Terakhir
    file_c?: string;        // PAK
    file_d?: string;        // SK Pangkat Terakhir
    file_e?: string;        // Ijazah
    file_f?: string;        // (kosong di data)
    file_g?: string;        // Surat Rekomendasi Kepala PD
    file_h?: string;        // (kosong di data)
    file_i?: string;        // (kosong di data)
    file_j?: string;        // Surat Usulan Instansi ke Walikota
    file_k?: string;        // (kosong di data)
    file_l?: string;        // (kosong di data)
    file_m?: string;        // (kosong di data)
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/JF/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/jf/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk JF
export const jfFileConfig = [
    { key: 'file_a', label: 'SK Jabatan Terakhir', icon: 'FileCertificate', color: 'blue' },
    { key: 'file_b', label: 'SKP 2 Tahun Terakhir', icon: 'FileCheck', color: 'green' },
    { key: 'file_c', label: 'PAK (Penilaian Angka Kredit)', icon: 'FileText', color: 'orange' },
    { key: 'file_d', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'purple' },
    { key: 'file_e', label: 'Ijazah', icon: 'GraduationCap', color: 'indigo' },
    { key: 'file_f', label: 'Berkas F', icon: 'File', color: 'gray' },
    { key: 'file_g', label: 'Surat Rekomendasi Kepala PD', icon: 'Mail', color: 'red' },
    { key: 'file_h', label: 'Berkas H', icon: 'File', color: 'gray' },
    { key: 'file_i', label: 'Berkas I', icon: 'File', color: 'gray' },
    { key: 'file_j', label: 'Surat Usulan Instansi ke Walikota', icon: 'FileSignature', color: 'pink' },
    { key: 'file_k', label: 'Berkas K', icon: 'File', color: 'gray' },
    { key: 'file_l', label: 'Berkas L', icon: 'File', color: 'gray' },
    { key: 'file_m', label: 'Berkas M', icon: 'File', color: 'gray' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'green' }
];

export const jfService = {
    // Get all JF data
    getAll: async (perangkatDaerah: string = ""): Promise<JFData[]> => {
        try {
            const url = perangkatDaerah
                ? `EndPointAPI/getjf/${perangkatDaerah}`
                : 'EndPointAPI/getjf';

            const response = await API.get(url);
            console.log('JF API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const jfData = response.data.data.jf;

                if (Array.isArray(jfData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return jfData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        jfFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching JF data:', error);
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
                endpoint = `layanan_admin/jfStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/jfStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/jfStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statusjfPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_jf_id', id);
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
            console.error('Error updating JF status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_jf_id', id);

            const response = await API.post('layanan_admin/berkasLayananJf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading JF file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_jf_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananJf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing JF file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<JFData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getjfbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching JF detail:', error);
            throw error;
        }
    }
};

export default jfService;