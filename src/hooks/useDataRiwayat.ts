// src/hooks/useDataRiwayat.ts
import { useState, useEffect, useCallback } from 'react';
import { dataService, DataRiwayat } from '../service/dataService';

interface UseDataRiwayatReturn {
    data: DataRiwayat[];
    loading: boolean;
    error: string | null;
    perangkatDaerah: string;
    setPerangkatDaerah: (value: string) => void;
    refreshData: () => Promise<void>;
}

export const useDataRiwayat = (): UseDataRiwayatReturn => {
    const [data, setData] = useState<DataRiwayat[]>([]);
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
            console.error('useDataRiwayat - Error:', err);
            setError(err.message || "Gagal memuat data Riwayat Data. Periksa koneksi VPN atau jaringan Anda.");
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

export default useDataRiwayat;