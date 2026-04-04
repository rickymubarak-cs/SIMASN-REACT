// src/service/gajiService.ts
import API from './api';

export interface GajiData {
    layanan_gaji_id?: string;
    peg_id?: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm?: string;
    layanan_berkala_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_pengantar?: string;
    file_skp?: string;
    file_hukdis?: string;
    file_sk_cpns?: string;
    file_sk_pns?: string;
    file_sk_pangkat?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Berkala/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/berkala/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const gajiFileConfig = [
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'teal' },
    { key: 'file_skp', label: 'SKP 2 Tahun Terakhir', icon: 'FileCheck', color: 'blue' },
    { key: 'file_hukdis', label: 'Surat Keterangan Hukdis', icon: 'FileText', color: 'red' },
    { key: 'file_sk_cpns', label: 'SK CPNS', icon: 'FileCertificate', color: 'purple' },
    { key: 'file_sk_pns', label: 'SK PNS', icon: 'FileCertificate', color: 'indigo' },
    { key: 'file_sk_pangkat', label: 'SK Pangkat Terakhir', icon: 'Award', color: 'amber' },
];

export const gajiService = {
    getAll: async (perangkatDaerah: string = ""): Promise<GajiData[]> => {
        try {
            const url = perangkatDaerah ? `api/gaji/${perangkatDaerah}` : 'api/gaji';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.gaji) {
                const gajiData = response.data.gaji;
                if (Array.isArray(gajiData)) {
                    return gajiData.map((item: any) => {
                        const processedItem: any = { ...item };
                        gajiFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Gaji data:', error);
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
                    endpoint = `api/gaji/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/gaji/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/gaji/${id}/perbaikan`;
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
            console.error('Error updating Gaji status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_gaji_id', id);
            const response = await API.post(`api/gaji/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading Gaji file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post(`api/gaji/${id}/edit-berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Gaji file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<GajiData | null> => {
        try {
            const response = await API.get(`api/gaji/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.gaji) {
                return response.data.gaji;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Gaji detail:', error);
            throw error;
        }
    }
};

export default gajiService;