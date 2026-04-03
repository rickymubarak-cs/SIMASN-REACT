// src/hooks/useCutiData.ts
import { useState, useEffect, useCallback } from 'react';
import { cutiService, CutiData } from '../service/cutiService';

export const useCutiData = () => {
    const [data, setData] = useState<CutiData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [perangkatDaerah, setPerangkatDaerah] = useState("");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const result = await cutiService.getAll(perangkatDaerah);
            setData(result);
        } catch (err: any) {
            setError(err.message || "Gagal memuat data Cuti");
        } finally {
            setLoading(false);
        }
    }, [perangkatDaerah]);

    useEffect(() => { fetchData(); }, [fetchData]);

    return { data, loading, error, perangkatDaerah, setPerangkatDaerah, refreshData: fetchData };
};