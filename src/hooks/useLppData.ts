// src/hooks/useLppData.ts
import { useState, useEffect, useCallback } from 'react';
import { lppService, LppData } from '../service/lppService';

export const useLppData = () => {
    const [data, setData] = useState<LppData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await lppService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            console.error('useLppData - Error:', err);
            setError(err.message || "Gagal memuat data LPP");
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

export default useLppData;