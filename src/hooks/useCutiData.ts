// src/hooks/useCutiData.ts
import { useState, useEffect, useCallback } from 'react';
import { cutiService, CutiData } from '../service/cutiService';

interface UseCutiDataReturn {
    data: CutiData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useCutiData = (): UseCutiDataReturn => {
    const [data, setData] = useState<CutiData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await cutiService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useCutiData - Error:', err);
            setError(err.message || "Gagal memuat data Cuti Pegawai. Periksa koneksi VPN atau jaringan Anda.");
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

export default useCutiData;