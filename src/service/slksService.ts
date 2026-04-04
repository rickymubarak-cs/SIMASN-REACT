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

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Slks/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/slks/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

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
    getAll: async (perangkatDaerah: string = ""): Promise<SlksData[]> => {
        try {
            const url = perangkatDaerah ? `api/slks/${perangkatDaerah}` : 'api/slks';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.slks) {
                const slksData = response.data.slks;
                if (Array.isArray(slksData)) {
                    return slksData.map((item: any) => {
                        const processedItem: any = { ...item };
                        slksFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching SLKS data:', error);
            throw error;
        }
    },

    updateStatus: async (id: string, status: string, keterangan?: string): Promise<any> => {
        try {
            let endpoint = '';
            let method: 'put' | 'post' = 'post';
            let data: any = null;

            switch (status) {
                case 'diterima':
                    endpoint = `api/slks/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/slks/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/slks/${id}/perbaikan`;
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
            console.error('Error updating SLKS status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('slks_id', id);
            const response = await API.post(`api/slks/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading SLKS file:', error);
            throw error;
        }
    },

    // src/service/slksService.ts

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            console.log('Edit berkas request:', { id, oldFile, newFileName: newFile.name });

            // Gunakan method POST dengan spoofing _method=PUT
            const response = await API.post(`api/slks/${id}/edit-berkas`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('Edit berkas response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error editing SLKS file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<SlksData | null> => {
        try {
            const response = await API.get(`api/slks/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.slks) {
                return response.data.slks;
            }
            return null;
        } catch (error) {
            console.error('Error fetching SLKS detail:', error);
            throw error;
        }
    }
};

export default slksService;