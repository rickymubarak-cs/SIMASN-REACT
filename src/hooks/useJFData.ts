// src/hooks/useJfData.ts
import { useState, useEffect, useCallback } from 'react';
import { jfService, JfData } from '../service/jfService';

interface UseJfDataReturn {
    data: JfData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useJfData = (): UseJfDataReturn => {
    const [data, setData] = useState<JfData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await jfService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useJfData - Error:', err);
            setError(err.message || "Gagal memuat data Jabatan Fungsional. Periksa koneksi VPN atau jaringan Anda.");
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

export default useJfData;