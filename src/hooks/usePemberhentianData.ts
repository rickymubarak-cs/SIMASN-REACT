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
            setError(err.message || "Gagal memuat data Pemberhentian ASN. Periksa koneksi VPN atau jaringan Anda.");
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