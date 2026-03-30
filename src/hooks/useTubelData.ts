// src/hooks/useTubelData.ts
import { useState, useEffect, useCallback } from 'react';
import { tubelService, TubelData } from '../service/tubelService';

interface UseTubelDataReturn {
    data: TubelData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useTubelData = (): UseTubelDataReturn => {
    const [data, setData] = useState<TubelData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await tubelService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useTubelData - Error:', err);
            setError(err.message || "Gagal memuat data Tugas Belajar. Periksa koneksi VPN atau jaringan Anda.");
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

export default useTubelData;