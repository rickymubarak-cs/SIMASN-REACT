// src/hooks/usePangkatData.ts
import { useState, useEffect, useCallback } from 'react';
import { pangkatService, PangkatData } from '../service/pangkatService';

interface UsePangkatDataReturn {
    data: PangkatData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const usePangkatData = (): UsePangkatDataReturn => {
    const [data, setData] = useState<PangkatData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('usePangkatData - Fetching with perangkatDaerah:', perangkatDaerah);
            const result = await pangkatService.getAll(perangkatDaerah);
            console.log('usePangkatData - Result:', result);
            setData(result);
        } catch (err: any) {
            console.error('usePangkatData - Error:', err);
            setError(err.message || "Gagal memuat data Kenaikan Pangkat. Periksa koneksi VPN atau jaringan Anda.");
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

export default usePangkatData;