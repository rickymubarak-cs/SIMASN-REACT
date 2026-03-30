// src/hooks/useDiklatData.ts
import { useState, useEffect, useCallback } from 'react';
import { diklatService, DiklatData } from '../service/diklatService';

interface UseDiklatDataReturn {
    data: DiklatData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useDiklatData = (): UseDiklatDataReturn => {
    const [data, setData] = useState<DiklatData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await diklatService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useDiklatData - Error:', err);
            setError(err.message || "Gagal memuat data Diklat. Periksa koneksi VPN atau jaringan Anda.");
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

export default useDiklatData;