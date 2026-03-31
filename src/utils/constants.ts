// src/utils/constants.ts
export const TAB_ITEMS = [
    { id: 'profile', label: 'Data Pribadi', icon: 'User' },
    { id: 'dokumen', label: 'Dokumen Digital', icon: 'FileText' },
    { id: 'jabatan', label: 'Riwayat Jabatan', icon: 'Briefcase' },
    { id: 'golongan', label: 'Riwayat Golongan', icon: 'TrendingUp' },
    { id: 'kgb', label: 'Gaji Berkala', icon: 'Wallet' }
];

export const EXPANDED_SECTIONS = {
    profile: true,
    dokumen: false,
    sk: false,
    instansi: false
};

export const ITEMS_PER_PAGE = {
    dokumen: 4,
    search: 10
};