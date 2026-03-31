// src/hooks/useBknData.ts
import { useState, useCallback } from 'react';
import { bknApiService } from '../service/bknApiService';
import { DataASN, TokenStatus } from '../types';

export const useBknData = () => {
    const [data, setData] = useState<DataASN | null>(null);
    const [loading, setLoading] = useState(false);
    const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null);
    const [syncing, setSyncing] = useState(false);

    const fetchTokenStatus = useCallback(async () => {
        try {
            const result = await bknApiService.checkTokenStatus();
            if (result.success && result.data) {
                setTokenStatus(result.data);
            }
        } catch (error) {
            console.error('Error fetching token status:', error);
        }
    }, []);

    const fetchData = useCallback(async (nip: string) => {
        if (!nip || nip.length !== 18) {
            alert('NIP harus 18 digit');
            return;
        }

        setLoading(true);
        try {
            const result = await bknApiService.getDataASN(nip);
            if (result.success && result.data) {
                setData(result.data);
                return result.data;
            } else {
                alert(result.message || 'Data tidak ditemukan');
                setData(null);
                return null;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Gagal mengambil data dari BKN');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const syncToLocal = useCallback(async (nip: string) => {
        if (!data) {
            alert('Tidak ada data untuk disinkronkan');
            return;
        }

        setSyncing(true);
        try {
            const result = await bknApiService.getSavedData(nip);
            if (result.success) {
                alert('Sinkronisasi berhasil! Data telah disimpan ke database lokal.');
            } else {
                alert('Gagal menyimpan data: ' + result.message);
            }
        } catch (error) {
            console.error('Error syncing data:', error);
            alert('Gagal sinkronisasi data');
        } finally {
            setSyncing(false);
        }
    }, [data]);

    return {
        data,
        loading,
        tokenStatus,
        syncing,
        fetchTokenStatus,
        fetchData,
        syncToLocal
    };
};