// src/utils/formatters.ts

/**
 * Format tanggal ke format Indonesia dengan hari dan jam
 * Contoh: Senin, 15 Januari 2024 14:30 WIB
 */
export const formatDateTimeId = (datetime: string): string => {
    if (!datetime) return "-";
    const date = new Date(datetime);
    if (isNaN(date.getTime())) return datetime;

    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} WIB`;
};

/**
 * Format tanggal ke format Indonesia (tanpa hari dan jam)
 * Contoh: 15 Januari 2024
 */
export const formatDate = (dateStr: string): string => {
    if (!dateStr) return '-';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

/**
 * Format tanggal ke format YYYY-MM-DD untuk input date
 */
export const formatDateToYMD = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toISOString().split('T')[0];
    } catch {
        return dateStr;
    }
};

/**
 * Format gender dari kode ke teks Indonesia
 */
export const formatGender = (gender: string): string => {
    if (!gender) return '-';
    const g = gender.toUpperCase();
    if (g === 'L' || g === 'LAKI-LAKI' || g === 'M') return 'Laki-laki';
    if (g === 'P' || g === 'PEREMPUAN' || g === 'F') return 'Perempuan';
    return gender;
};

/**
 * Dapatkan inisial dari nama
 * Contoh: "Imam Harris Pratama" -> "IP"
 */
export const getInitials = (nama: string): string => {
    if (!nama) return "?";
    const parts = nama.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Format nama lengkap dengan gelar
 * Contoh: { gelarDepan: "Drs.", nama: "Imam Harris", gelarBelakang: "M.A." } -> "Drs. Imam Harris, M.A."
 */
export const formatNamaLengkap = (data: {
    gelarDepan?: string;
    nama?: string;
    gelarBelakang?: string;
}): string => {
    let result = '';
    if (data.gelarDepan) result += data.gelarDepan + ' ';
    result += data.nama || '';
    if (data.gelarBelakang) result += ', ' + data.gelarBelakang;
    return result.trim();
};

/**
 * Format nama simple tanpa gelar
 */
export const formatNamaSimple = (nama: string): string => {
    return nama || '-';
};

/**
 * Dapatkan kelas CSS untuk badge status
 */
export const getStatusBadgeClass = (status: string): string => {
    switch (status) {
        case 'Aktif':
        case 'selesai':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'Cuti':
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'Pensiun':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Meninggal':
            return 'bg-gray-100 text-gray-700 border-gray-200';
        case 'pengajuan':
            return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'diterima':
            return 'bg-green-100 text-green-700 border-green-200';
        case 'perbaikan':
            return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'ditolak':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-slate-100 text-slate-600';
    }
};

/**
 * Format status ke teks Indonesia
 */
export const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'pengajuan': 'Pengajuan',
        'diterima': 'Diterima',
        'perbaikan': 'Perbaikan',
        'ditolak': 'Ditolak',
        'selesai': 'Selesai',
        'Aktif': 'Aktif',
        'Cuti': 'Cuti',
        'Pensiun': 'Pensiun',
        'Meninggal': 'Meninggal'
    };
    return statusMap[status] || status;
};

/**
 * Format jenis cuti ke teks Indonesia
 */
export const formatJenisCuti = (jenis: string): string => {
    const jenisMap: Record<string, string> = {
        'TAHUNAN': 'Cuti Tahunan',
        'SAKIT': 'Cuti Sakit',
        'ALASAN PENTING': 'Cuti Alasan Penting',
        'BESAR': 'Cuti Besar',
        'MELAHIRKAN': 'Cuti Melahirkan',
        'CLTN AWAL': 'Cuti di Luar Tanggungan Negara (Awal)',
        'CLTN PERPANJANGAN': 'Cuti di Luar Tanggungan Negara (Perpanjangan)',
        'CLTN PENGAKTIFAN': 'Cuti di Luar Tanggungan Negara (Pengaktifan)'
    };
    return jenisMap[jenis] || jenis;
};

/**
 * Format angka ke format rupiah
 */
export const formatRupiah = (angka: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);
};

/**
 * Truncate text dengan panjang maksimal
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};