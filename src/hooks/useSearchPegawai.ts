// src/hooks/useSearchPegawai.ts
import { useState, useCallback } from 'react';
import { bknApiService } from '../service/bknApiService';
import { SearchResult } from '../types';

export const useSearchPegawai = () => {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const search = useCallback(async (keyword: string, page: number = 1, limit: number = 10) => {
        if (!keyword || keyword.length < 2) {
            alert('Masukkan minimal 2 karakter untuk pencarian');
            return;
        }

        setLoading(true);
        try {
            const result = await bknApiService.searchPegawai(keyword, page, limit);

            if (result.success && result.data) {
                setResults(result.data);
                setTotal(result.pagination?.total || result.data.length);
                setShowResults(true);
            } else {
                setResults([]);
                setTotal(0);
                setShowResults(true);
            }
        } catch (error) {
            console.error('Error searching pegawai:', error);
            setResults([]);
            alert('Gagal mencari pegawai');
        } finally {
            setLoading(false);
        }
    }, []);

    const clear = useCallback(() => {
        setResults([]);
        setShowResults(false);
        setTotal(0);
    }, []);

    return {
        results,
        loading,
        total,
        showResults,
        search,
        clear
    };
};