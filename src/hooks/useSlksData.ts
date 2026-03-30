// src/hooks/useSlksData.ts
import { useState, useEffect, useCallback } from 'react';
import { slksService, SlksData } from '../service/slksService';

interface UseSlksDataReturn {
    data: SlksData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useSlksData = (): UseSlksDataReturn => {
    const [data, setData] = useState<SlksData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await slksService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useSlksData - Error:', err);
            setError(err.message || "Gagal memuat data Satya Lencana Karya Satya. Periksa koneksi VPN atau jaringan Anda.");
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

export default useSlksData;