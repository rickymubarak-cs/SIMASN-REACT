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
    nama_usulan_diklat?: string;
    layanan_diklat_status?: string;
    timestamp?: string;
    keterangan?: string;
    file_lampiranbiaya?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

const BASE_URL_OLD = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL_OLD}/assets/berkas/Layanan/Diklat/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL_OLD}/assets/berkas/layanan_admin/diklat/`;
const BASE_URL_FOTO = `${BASE_URL_OLD}/assets/berkas/profil/`;

export const diklatFileConfig = [
    { key: 'file_lampiranbiaya', label: 'Lampiran Biaya', icon: 'FileText', color: 'sky' },
    { key: 'file_pengantar', label: 'Surat Pengantar', icon: 'Mail', color: 'blue' },
];

export const diklatService = {
    getAll: async (perangkatDaerah: string = ""): Promise<DiklatData[]> => {
        try {
            const url = perangkatDaerah ? `api/diklat/${perangkatDaerah}` : 'api/diklat';
            const response = await API.get(url);

            if (response.data?.status === 'success' && response.data?.diklat) {
                const diklatData = response.data.diklat;
                if (Array.isArray(diklatData)) {
                    return diklatData.map((item: any) => {
                        const processedItem: any = { ...item };
                        diklatFileConfig.forEach(fileConfig => {
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
            console.error('Error fetching Diklat data:', error);
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
                    endpoint = `api/diklat/${id}/terima`;
                    method = 'put';
                    break;
                case 'ditolak':
                    endpoint = `api/diklat/${id}/tolak`;
                    method = 'put';
                    data = { keterangan };
                    break;
                case 'perbaikan':
                    endpoint = `api/diklat/${id}/perbaikan`;
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
            console.error('Error updating Diklat status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_diklat_id', id);
            const response = await API.post(`api/diklat/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading Diklat file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post(`api/diklat/${id}/edit-berkas`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing Diklat file:', error);
            throw error;
        }
    },

    getDetail: async (id: string): Promise<DiklatData | null> => {
        try {
            const response = await API.get(`api/diklat/detail/${id}`);
            if (response.data?.status === 'success' && response.data?.diklat) {
                return response.data.diklat;
            }
            return null;
        } catch (error) {
            console.error('Error fetching Diklat detail:', error);
            throw error;
        }
    }
};

export default diklatService;