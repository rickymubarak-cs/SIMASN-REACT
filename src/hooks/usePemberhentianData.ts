// src/hooks/usePemberhentianData.ts
import { useState, useEffect, useCallback } from 'react';
import { pemberhentianService, PemberhentianData } from '../service/pemberhentianService';

interface UsePemberhentianDataReturn {
    data: PemberhentianData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const usePemberhentianData = (): UsePemberhentianDataReturn => {
    const [data, setData] = useState<PemberhentianData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await pemberhentianService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('usePemberhentianData - Error:', err);

            // Enhanced error handling
            let errorMessage = "Gagal memuat data Pemberhentian ASN. ";

            if (err.response) {
                // Server responded with error status
                switch (err.response.status) {
                    case 400:
                        errorMessage += "Request tidak valid.";
                        break;
                    case 401:
                        errorMessage += "Sesi login telah berakhir. Silakan login kembali.";
                        break;
                    case 403:
                        errorMessage += "Anda tidak memiliki akses ke data ini.";
                        break;
                    case 404:
                        errorMessage += "Data tidak ditemukan.";
                        break;
                    case 500:
                        errorMessage += "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
                        break;
                    default:
                        errorMessage += err.response.data?.message || "Periksa koneksi VPN atau jaringan Anda.";
                }
            } else if (err.request) {
                // Request made but no response
                errorMessage += "Tidak ada respons dari server. Periksa koneksi internet Anda.";
            } else if (err.code === 'ECONNABORTED') {
                errorMessage += "Timeout koneksi. Periksa jaringan Anda.";
            } else {
                errorMessage += err.message || "Terjadi kesalahan yang tidak diketahui.";
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [perangkatDaerah]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        error,
        perangkatDaerah,
        setPerangkatDaerah,
        refreshData: fetchData
    };
};

export default usePemberhentianData;