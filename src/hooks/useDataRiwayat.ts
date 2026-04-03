// src/hooks/useDataPerubahanData.ts
import { useState, useEffect, useCallback } from 'react';
import { dataService, DataPerubahanData } from '../service/dataService';

interface UseDataPerubahanDataReturn {
    data: DataPerubahanData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useDataPerubahanData = (): UseDataPerubahanDataReturn => {
    const [data, setData] = useState<DataPerubahanData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await dataService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useDataPerubahanData - Error:', err);
            setError(err.message || "Gagal memuat data Perubahan Data. Periksa koneksi VPN atau jaringan Anda.");
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

export default useDataPerubahanData;