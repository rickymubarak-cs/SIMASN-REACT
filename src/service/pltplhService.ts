// src/service/pltplhService.ts
import API from './api';

export interface PltplhData {
    layanan_pltplh_id: string;
    peg_id: string;
    peg_nama: string;
    peg_nip: string;
    peg_gelar_depan?: string;
    peg_gelar_belakang?: string;
    unit_org_induk_nm: string;
    layanan_pltplh_pengajuan: string;
    layanan_pltplh_status: string;
    timestamp: string;
    keterangan?: string;
    file_usulan?: string;
    file_sk_pltplh?: string;
    file_skpengganti?: string;
    file_pengantar?: string;
    file_status_pelayanan?: string;
    foto?: string;
    [key: string]: any;
}

// Base URL untuk file
const BASE_URL = "https://simasn.pontianak.go.id";
const BASE_URL_BERKAS = `${BASE_URL}/assets/berkas/Layanan/PltPlh/`;
const BASE_URL_BERKAS_ADMIN = `${BASE_URL}/assets/berkas/layanan_admin/pltplh/`;
const BASE_URL_FOTO = `${BASE_URL}/assets/berkas/profil/`;

export const pltplhService = {
    getAll: async (perangkatDaerah: string = ""): Promise<PltplhData[]> => {
        try {

            const url = perangkatDaerah
                ? `EndPointAPI/getpltplh/${perangkatDaerah}`
                : 'EndPointAPI/getpltplh';

            const response = await API.get(url);

            if (response.data?.status && response.data?.data) {
                const pltplhData = response.data.data.pltplh;

                if (Array.isArray(pltplhData)) {
                    // Proses data untuk menambahkan URL file yang benar
                    return pltplhData.map((item: any) => {
                        return {
                            ...item,
                            // URL untuk file-file
                            file_usulan_url: item.file_usulan ? `${BASE_URL_BERKAS}${item.file_usulan}` : null,
                            file_skpengganti_url: item.file_skpengganti ? `${BASE_URL_BERKAS}${item.file_skpengganti}` : null,
                            file_sk_pltplh_url: item.file_sk_pltplh ? `${BASE_URL_BERKAS}${item.file_sk_pltplh}` : null,
                            file_pengantar_url: item.file_pengantar ? `${BASE_URL_BERKAS}${item.file_pengantar}` : null,
                            file_status_pelayanan_url: item.file_status_pelayanan ? `${BASE_URL_BERKAS_ADMIN}${item.file_status_pelayanan}` : null,
                            foto_url: item.foto ? `${BASE_URL_FOTO}${item.foto}` : null,
                        };
                    });
                }
            }

            return [];
        } catch (error) {
            console.error('Error fetching PLT/PLH data:', error);
            throw error;
        }
    },

    // ... updateStatus, uploadBerkas, editBerkas, getById methods tetap sama
    updateStatus: async (id: string, status: string, keterangan?: string): Promise<any> => {
        try {
            let endpoint = '';
            let method: 'get' | 'post' = 'get';
            let data = null;

            if (status === 'diterima') {
                endpoint = `layanan_admin/pltplhStatus?terima=${id}`;
            } else if (status === 'selesai') {
                endpoint = `layanan_admin/pltplhStatus?terima_tembusan=${id}`;
            } else if (status === 'ditolak') {
                endpoint = `layanan_admin/pltplhStatus?tolak=${id}`;
            } else if (status === 'perbaikan') {
                endpoint = 'layanan_admin/statuspltplhPerbaiki';
                method = 'post';
                const formData = new URLSearchParams();
                formData.append('layanan_pltplh_id', id);
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
            console.error('Error updating PLT/PLH status:', error);
            throw error;
        }
    },

    uploadBerkas: async (id: string, file: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', file);
            formData.append('layanan_pltplh_id', id);

            const response = await API.post('layanan_admin/berkasLayananpltplh', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    },

    editBerkas: async (id: string, oldFile: string, newFile: File): Promise<any> => {
        try {
            const formData = new FormData();
            formData.append('file_status_pelayanan', newFile);
            formData.append('layanan_pltplh_id', id);
            formData.append('old_file_status_pelayanan', oldFile);

            const response = await API.post('layanan_admin/ubahberkasLayananPltplh', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data;
        } catch (error) {
            console.error('Error editing file:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<PltplhData | null> => {
        try {
            const response = await API.get(`EndPointAPI/getpltplhbyid/${id}`);
            if (response.data?.status && response.data?.data) {
                return response.data.data;
            }
            return null;
        } catch (error) {
            console.error('Error fetching detail:', error);
            throw error;
        }
    }
};

export default pltplhService;