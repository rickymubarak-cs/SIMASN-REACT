import axios from 'axios';

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// ============ TYPES ============
export interface PegawaiData {
    peg_id: number;
    peg_nip: string;
    peg_nip_lama: string;
    peg_nama: string;
    peg_gelar_depan: string;
    peg_gelar_belakang: string;
    peg_tmpt_lahir: string;
    peg_lahir_tanggal: string;
    peg_jenis_kelamin: string;
    agama_id: number;
    agama_nama?: string;
    status_id: number;
    peg_tmt: string;
    peg_pns_tmt: string;
    peg_email: string;
    peg_telp: string;
    peg_rumah_alamat: string;
    gol_id: number;
    golongan_id?: number;
    gol_kd?: string;
    gol_nm?: string;
    golongan_pangkat?: string;
    golongan_status?: number;
    golongan_text?: string;
    status_info?: {
        text: string;
        color: string;
        bgColor: string;
        borderColor: string;
    };
    foto?: string;
    skpd_nama?: string;
    unit_org_induk_id?: number;
    [key: string]: any;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    total?: number;
    current_page?: number;
    last_page?: number;
    per_page?: number;
}

export interface SummaryData {
    total_pegawai: number;
    laki_laki: number;
    perempuan: number;
    statistik_status?: Array<{
        status_id: number;
        nama: string;
        total: number;
    }>;
}

export interface SKPDData {
    unit_org_induk_id: number;
    unit_org_induk_kd: string;
    unit_org_induk_nm: string;
}

export interface SKPDSummary {
    skpd_nama: string;
    total_pegawai: number;
    laki_laki: number;
    perempuan: number;
    cpns: number;
    pns: number;
    pppk: number;
}

// ============ CONSTANTS ============
export const STATUS_MAPPING: Record<number, { text: string; color: string; bgColor: string; borderColor: string; kategori: string }> = {
    1: { text: 'CPNS', color: 'text-blue-700', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', kategori: 'AKTIF' },
    2: { text: 'PNS', color: 'text-green-700', bgColor: 'bg-green-100', borderColor: 'border-green-200', kategori: 'AKTIF' },
    3: { text: 'PENSIUN', color: 'text-gray-700', bgColor: 'bg-gray-100', borderColor: 'border-gray-200', kategori: 'TIDAK AKTIF' },
    4: { text: 'MENINGGAL', color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-200', kategori: 'TIDAK AKTIF' },
    5: { text: 'BERHENTI', color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-200', kategori: 'TIDAK AKTIF' },
    6: { text: 'PINDAH', color: 'text-purple-700', bgColor: 'bg-purple-100', borderColor: 'border-purple-200', kategori: 'TIDAK AKTIF' },
    7: { text: 'PPPK', color: 'text-teal-700', bgColor: 'bg-teal-100', borderColor: 'border-teal-200', kategori: 'AKTIF' },
    8: { text: 'PPPK PARUH WAKTU', color: 'text-cyan-700', bgColor: 'bg-cyan-100', borderColor: 'border-cyan-200', kategori: 'AKTIF' },
    20: { text: 'KONTRAK APBD', color: 'text-pink-700', bgColor: 'bg-pink-100', borderColor: 'border-pink-200', kategori: 'KONTRAK' },
};

// ============ HELPER FUNCTIONS ============
export const getStatusInfo = (statusId: number) => {
    return STATUS_MAPPING[statusId] || {
        text: 'TIDAK DIKETAHUI',
        color: 'text-slate-700',
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-200',
        kategori: 'UNKNOWN'
    };
};

export const getStatusOptionsGrouped = () => {
    return {
        AKTIF: [
            { id: 1, nama: 'CPNS' },
            { id: 2, nama: 'PNS' },
            { id: 7, nama: 'PPPK' },
            { id: 8, nama: 'PPPK PARUH WAKTU' },
        ],
        TIDAK_AKTIF: [
            { id: 3, nama: 'PENSIUN' },
            { id: 4, nama: 'MENINGGAL' },
            { id: 5, nama: 'BERHENTI' },
            { id: 6, nama: 'PINDAH' },
        ],
        KONTRAK: [
            { id: 20, nama: 'KONTRAK APBD' },
        ],
    };
};

// ============ API SERVICE ============
export const apiService = {
    async getPegawaiWithRelations(params: {
        page?: number;
        per_page?: number;
        nama?: string;
        nip?: string;
        jenis_kelamin?: string;
        status_id?: number;
    } = {}): Promise<ApiResponse<PegawaiData[]>> {
        const response = await API.get('/api/v1/pegawai-with-relations', { params });
        return response.data;
    },

    async getSummary(): Promise<ApiResponse<SummaryData>> {
        const response = await API.get('/api/v1/pegawai/summary');
        return response.data;
    },

    async getPegawaiById(id: number): Promise<ApiResponse<PegawaiData>> {
        const response = await API.get(`/api/v1/pegawai/${id}`);
        return response.data;
    },

    async getPegawaiWithSKPD(params: {
        page?: number;
        per_page?: number;
        nama?: string;
        skpd_id?: number;
        status_id?: number;
        jenis_kelamin?: string;
    } = {}): Promise<ApiResponse<PegawaiData[]>> {
        const response = await API.get('/api/v1/pegawai-with-skpd', { params });
        return response.data;
    },

    async getSKPDList(search?: string): Promise<ApiResponse<SKPDData[]>> {
        const params = search ? { search } : {};
        const response = await API.get('/api/v1/skpd/list', { params });
        return response.data;
    },

    async getPegawaiBySKPD(skpdId: number, params: {
        page?: number;
        per_page?: number;
        nama?: string;
    } = {}): Promise<ApiResponse<PegawaiData[]>> {
        const response = await API.get(`/api/v1/pegawai/by-skpd/${skpdId}`, { params });
        return response.data;
    },

    async getSKPDSummary(skpdId: number): Promise<ApiResponse<SKPDSummary>> {
        const response = await API.get(`/api/v1/skpd/${skpdId}/summary`);
        return response.data;
    },
};

export default API;