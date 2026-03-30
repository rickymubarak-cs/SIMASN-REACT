// src/service/bknApiService.ts
import API from './api';

const BKN_API_BASE = '/EndPointAPI';

export const bknApiService = {
    // Check token status - gunakan endpoint yang sudah ada
    checkTokenStatus: async () => {
        try {
            console.log('🔍 [checkTokenStatus] Fetching token status...');
            const response = await API.get(`${BKN_API_BASE}/check_status`);
            console.log('✅ [checkTokenStatus] Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ [checkTokenStatus] Error:', error);
            // Fallback jika endpoint error
            return {
                success: false,
                data: {
                    oauth: { active: false, expires: null },
                    sso: { active: false }
                },
                message: 'Gagal mengambil status token'
            };
        }
    },

    // Get data ASN by NIP
    getDataASN: async (nip: string) => {
        try {
            console.log('🔍 [getDataASN] Fetching from BKN API for NIP:', nip);

            if (!nip || nip.length !== 18) {
                console.error('❌ [getDataASN] Invalid NIP:', nip);
                return { success: false, message: 'NIP harus 18 digit' };
            }

            const response = await API.get(`${BKN_API_BASE}/get_data/asn/${nip}`);

            console.log('✅ [getDataASN] Response status:', response.status);
            console.log('✅ [getDataASN] Response data:', response.data);

            return response.data;
        } catch (error: any) {
            console.error('❌ [getDataASN] Error:', error.response?.data || error.message);
            return { success: false, message: 'Gagal mengambil data ASN' };
        }
    },

    // Search pegawai
    searchPegawai: async (keyword: string, page: number = 1, limit: number = 10) => {
        try {
            console.log('🔎 [searchPegawai] Searching for:', keyword);
            const response = await API.get(`${BKN_API_BASE}/search_pegawai`, {
                params: { q: keyword, page, limit }
            });

            console.log('📦 [searchPegawai] Raw response:', response.data);

            if (response.data?.success && Array.isArray(response.data.data)) {
                const formattedData = response.data.data.map((item: any) => {
                    // PERBAIKAN: Ambil nama dari field yang tersedia
                    // Data dari API memiliki field 'nama' bukan 'peg_nama'
                    const namaValue = item.nama || item.peg_nama || '';
                    let nip = item.nip || item.peg_nip || '';

                    nip = String(nip).trim();
                    console.log(`📝 Formatting pegawai: ${namaValue} -> NIP: ${nip} (${nip.length} digit)`);

                    return {
                        id: item.id || item.peg_id,
                        nip: nip,
                        nip_lama: item.nip_lama || item.peg_nip_lama,
                        nama: namaValue,
                        nama_lengkap: namaValue,
                        gelar_depan: item.gelar_depan || '',
                        gelar_belakang: item.gelar_belakang || ''
                    };
                });

                console.log('✅ [searchPegawai] Formatted data:', formattedData);

                return {
                    success: true,
                    data: formattedData,
                    pagination: response.data.pagination,
                    message: ''
                };
            }

            return {
                success: false,
                message: 'Data tidak ditemukan',
                data: [],
                pagination: { page, limit, total: 0, total_pages: 0 }
            };
        } catch (error) {
            console.error('❌ [searchPegawai] Error:', error);
            return {
                success: false,
                message: 'Gagal mencari pegawai',
                data: [],
                pagination: { page, limit, total: 0, total_pages: 0 }
            };
        }
    },

    // Get saved data from local database
    getSavedData: async (nip: string) => {
        try {
            const response = await API.get(`${BKN_API_BASE}/get_saved_data/${nip}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching saved data:', error);
            return { success: false, message: 'Gagal mengambil data tersimpan' };
        }
    },

    // Get dokumen list
    getDokumenList: async (nip: string) => {
        try {
            console.log('📄 [getDokumenList] Fetching dokumen for NIP:', nip);
            const response = await API.get(`${BKN_API_BASE}/get_dokumen_list/${nip}`);

            console.log('✅ [getDokumenList] Response:', response.data);

            return response.data;
        } catch (error) {
            console.error('❌ [getDokumenList] Error:', error);
            return { success: false, message: 'Gagal mengambil daftar dokumen', data: [] };
        }
    },

    // Preview dokumen - membuka di tab baru atau modal
    previewDokumen: (object: string) => {
        return `${BKN_API_BASE}/preview_dokumen/${encodeURIComponent(object)}`;
    },

    // Download dokumen
    downloadDokumen: (object: string, nama: string) => {
        return `${BKN_API_BASE}/download_dokumen/${encodeURIComponent(object)}?nama=${encodeURIComponent(nama)}`;
    },

    // Get riwayat jabatan
    getRiwayatJabatan: async (nip: string) => {
        try {
            const response = await API.get(`${BKN_API_BASE}/get_riwayat_jabatan/${nip}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching riwayat jabatan:', error);
            return { success: false, message: 'Gagal mengambil riwayat jabatan' };
        }
    },

    // Get riwayat golongan
    getRiwayatGolongan: async (nip: string) => {
        try {
            const response = await API.get(`${BKN_API_BASE}/get_riwayat_golongan/${nip}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching riwayat golongan:', error);
            return { success: false, message: 'Gagal mengambil riwayat golongan' };
        }
    },

    // Get riwayat KGB
    getRiwayatKGB: async (nip: string) => {
        try {
            const response = await API.get(`${BKN_API_BASE}/get_riwayat_kgb/${nip}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching KGB data:', error);
            return { success: false, message: 'Gagal mengambil data KGB' };
        }
    }
};