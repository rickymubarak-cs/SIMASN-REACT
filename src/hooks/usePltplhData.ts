// src/hooks/usePltplhData.ts
import { useState, useEffect, useCallback } from 'react';
import { pltplhService, PltplhData } from '../service/pltplhService';

interface UsePltplhDataReturn {
    data: PltplhData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const usePltplhData = (): UsePltplhDataReturn => {
    const [data, setData] = useState<PltplhData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await pltplhService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            setError(err.message || "Gagal memuat data. Periksa koneksi VPN atau jaringan Anda.");
            console.error('Fetch error:', err);
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

export default usePltplhData;