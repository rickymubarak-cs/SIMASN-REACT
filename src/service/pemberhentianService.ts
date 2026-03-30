// src/service/pemberhentianService.ts
import API from './api';

export interface PemberhentianData {
    layanan_pemberhentian_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_pemberhentian_status?: string;
    jenis_pemberhentian?: string;
    timestamp?: string;
    keterangan?: string;
    // File-file Pemberhentian
    file_form_permintaan?: string;
    file_karpeg?: string;
    file_sk_cpns?: string;
    file_sk_pns?: string;
    file_sk_pangkat_terakhir?: string;
    file_gaji_berkala_terakhir?: string;
    file_skp_tahun_terakhir?: string;
    file_sk_jabatan?: string;
    file_sk_pemberhentian_jabatan?: string;
    file_penyesuaian_masa_kerja?: string;
    file_surat_pencantuman_gelar?: string;
    file_pernyataan_hukdis?: string;
    file_pernyataan_pidana?: string;
    file_pasphoto?: string;
    file_akta_anak?: string;
    file_nip_baru?: string;
    file_surat_keterangan_kuliah?: string;
    file_susunan_keluarga?: string;
    file_sk_terakhir_pasangan?: string;
    file_ijazah_transkrip?: string;
    file_ktp_npwp_rek?: string;
    file_akta_kematian?: string;
    file_keterangan_kematian?: string;
    file_surat_nikah?: string;
    file_kedudukan?: string;
    file_pendukung?: string;
    file_waris?: string;
    file_persetujuan_kepala?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/Pemberhentian/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/pemberhentian/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

// Konfigurasi file untuk Pemberhentian ASN
export const pemberhentianFileConfig = [
    { key: 'file_form_permintaan', label: 'Form Permintaan Pemberhentian', icon: 'FileSignature', color: 'blue' },
    { key: 'file_karpeg', label: 'Kartu Pegawai (Karpeg)', icon: 'IdCard', color: 'purple' },
    { key: 'file_sk_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_sk_pns', label: 'SK PNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_sk_pangkat_terakhir', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'orange' },
    { key: 'file_gaji_berkala_terakhir', label: 'Gaji Berkala Terakhir', icon: 'Wallet', color: 'green' },
    { key: 'file_skp_tahun_terakhir', label: 'SKP Tahun Terakhir', icon: 'FileCheck', color: 'teal' },
    { key: 'file_sk_jabatan', label: 'SK Jabatan', icon: 'Briefcase', color: 'cyan' },
    { key: 'file_sk_pemberhentian_jabatan', label: 'SK Pemberhentian Jabatan', icon: 'UserMinus', color: 'red' },
    { key: 'file_penyesuaian_masa_kerja', label: 'Penyesuaian Masa Kerja', icon: 'Calendar', color: 'amber' },
    { key: 'file_surat_pencantuman_gelar', label: 'Surat Pencantuman Gelar', icon: 'Award', color: 'pink' },
    { key: 'file_pernyataan_hukdis', label: 'Pernyataan Hukuman Disiplin', icon: 'Gavel', color: 'rose' },
    { key: 'file_pernyataan_pidana', label: 'Pernyataan Pidana', icon: 'Scale', color: 'red' },
    { key: 'file_pasphoto', label: 'Pas Photo', icon: 'Camera', color: 'gray' },
    { key: 'file_akta_anak', label: 'Akta Anak', icon: 'Baby', color: 'pink' },
    { key: 'file_nip_baru', label: 'NIP Baru', icon: 'IdCard', color: 'blue' },
    { key: 'file_surat_keterangan_kuliah', label: 'Surat Keterangan Kuliah', icon: 'GraduationCap', color: 'purple' },
    { key: 'file_susunan_keluarga', label: 'Susunan Keluarga', icon: 'Users', color: 'green' },
    { key: 'file_sk_terakhir_pasangan', label: 'SK Terakhir Pasangan', icon: 'Heart', color: 'pink' },
    { key: 'file_ijazah_transkrip', label: 'Ijazah / Transkrip', icon: 'GraduationCap', color: 'indigo' },
    { key: 'file_ktp_npwp_rek', label: 'KTP / NPWP / Rekening', icon: 'CreditCard', color: 'gray' },
    { key: 'file_akta_kematian', label: 'Akta Kematian', icon: 'Cross', color: 'gray' },
    { key: 'file_keterangan_kematian', label: 'Keterangan Kematian', icon: 'FileText', color: 'gray' },
    { key: 'file_surat_nikah', label: 'Surat Nikah', icon: 'Heart', color: 'pink' },
    { key: 'file_kedudukan', label: 'Kedudukan', icon: 'MapPin', color: 'gray' },
    { key: 'file_pendukung', label: 'Dokumen Pendukung', icon: 'File', color: 'gray' },
    { key: 'file_waris', label: 'Dokumen Waris', icon: 'FileText', color: 'gray' },
    { key: 'file_persetujuan_kepala', label: 'Persetujuan Kepala', icon: 'CheckCircle', color: 'green' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'green' }
];

export const pemberhentianService = {
    // Get all Pemberhentian ASN data
    getAll: async (perangkatDaerah: string = ""): Promise<PemberhentianData[]> => {
        try {
            const url = perangkatDaerah
                ? `EndPointAPI/getpemberhentian/${perangkatDaerah}`
                : 'EndPointAPI/getpemberhentian';

            const response = await API.get(url);
            console.log('Pemberhentian API Response:', response.data);

            if (response.data?.status && response.data?.data) {
                const pemberhentianData = response.data.data.pemberhentian;

                if (Array.isArray(pemberhentianData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return pemberhentianData.map((item: any) => {
                        const processedItem: any = { ...item };

                        // Tambahkan URL untuk setiap file yang ada
                        pemberhentianFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Pemberhentian data:', error);
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
                endpoint = `layanan_admin/pemberhentianStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/pemberhentianStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/pemberhentianStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuspemberhentianPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_pemberhentian_id', id);
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
            console.error('Error updating Pemberhentian status:', error);
            throw error;
        }
    },

    // Upload berkas hasil
    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_pemberhentian_id', id);

            const response = await API.post('layanan_admin/berkasLayananPemberhentian', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading Pemberhentian file:', error);
            throw error;
        }
    },

    // Edit berkas hasil
    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_pemberhentian_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananPemberhentian', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Pemberhentian file:', error);
            throw error;
        }
    },

    // Get detail by ID
    getById: async (id: string): Promise<PemberhentianData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getpemberhentianbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Pemberhentian detail:', error);
            throw error;
        }
    }
};

export default pemberhentianService;