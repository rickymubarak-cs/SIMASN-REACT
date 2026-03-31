// src/types/index.ts
export interface DataASN {
    id?: string;
    nip: string;
    nipBaru?: string;
    nipLama: string;
    nama: string;
    gelarDepan: string;
    gelarBelakang: string;
    tempatLahir: string;
    tglLahir: string;
    jenisKelamin: string;
    agama: string;
    statusPerkawinan: string;
    email: string;
    emailGov?: string;
    alamat: string;
    statusPegawai: string;
    jenisPegawai: string;
    golRuangAkhir: string;
    pangkatAkhir: string;
    eselon: string;
    tmtJabatan: string;
    tmtGolAkhir: string;
    noSeriKarpeg?: string;
    noTaspen?: string;
    noNpwp?: string;
    bpjs?: string;
    nomorSkCpns?: string;
    tglSkCpns?: string;
    tmtCpns?: string;
    nomorSkPns?: string;
    tglSkPns?: string;
    tmtPns?: string;
    instansiKerjaNama?: string;
    satuanKerjaKerjaNama?: string;
    jabatanNama?: string;
    unorNama?: string;
    kartuAsn?: string;
    noHp?: string;
    [key: string]: any;
}

export interface Dokumen {
    id: string;
    nama: string;
    object: string;
    dok_uri?: string;
    slug?: string;
    type?: string;
}

export interface TokenStatus {
    oauth: { active: boolean; expires: string | null };
    sso: { active: boolean };
}

export interface SearchResult {
    id: string;
    nip: string;
    nip_lama: string;
    nama: string;
    nama_lengkap: string;
    gelar_depan: string;
    gelar_belakang: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    code?: number;
    count?: number;
    http_code?: number;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}