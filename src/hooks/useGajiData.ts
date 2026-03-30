// src/hooks/useGajiData.ts
import { useState, useEffect, useCallback } from 'react';
import { gajiService, GajiData } from '../service/gajiService';

interface UseGajiDataReturn {
    data: GajiData[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useGajiData = (): UseGajiDataReturn => {
    const [data, setData] = useState<GajiData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState<string>("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gajiService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useGajiData - Error:', err);
            setError(err.message || "Gagal memuat data Kenaikan Gaji Berkala. Periksa koneksi VPN atau jaringan Anda.");
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

export default useGajiData;