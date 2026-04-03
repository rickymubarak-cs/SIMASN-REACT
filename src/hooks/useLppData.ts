// src/hooks/useLppData.ts
import { useState, useEffect, useCallback } from 'react';
import { lppService, LppData } from '../service/lppService';

interface UseLppDataReturn {
    data: LppData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useLppData = (): UseLppDataReturn => {
    const [data, setData] = useState<LppData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await lppService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useLppData - Error:', err);
            setError(err.message || "Gagal memuat data Laporan Peningkatan Pendidikan (LPP). Periksa koneksi VPN atau jaringan Anda.");
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

export default useLppData;