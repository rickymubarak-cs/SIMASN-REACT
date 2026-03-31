// src/components/dokumen/DokumenList.tsx
import React, { useState, useCallback } from 'react';
import { RefreshCcw, FileText } from 'lucide-react';
import { Dokumen } from '../../types';
import { DokumenCard } from './DokumenCard';
import { EmptyState } from '../common/EmptyState';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { bknApiService } from '../../service/bknApiService';

interface DokumenListProps {
    nip: string;
}

export const DokumenList: React.FC<DokumenListProps> = ({ nip }) => {
    const [dokumenList, setDokumenList] = useState<Dokumen[]>([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
    const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>({});
    const [previewError, setPreviewError] = useState<Record<string, boolean>>({});

    const loadDokumen = useCallback(async () => {
        if (!nip) return;
        setLoading(true);
        try {
            const result = await bknApiService.getDokumenList(nip);
            if (result.success && result.data) {
                setDokumenList(result.data);
            }
        } catch (error) {
            console.error('Error loading dokumen:', error);
        } finally {
            setLoading(false);
        }
    }, [nip]);

    const togglePreview = useCallback(async (doc: Dokumen) => {
        const docId = doc.id || doc.object;

        if (expandedId === docId) {
            setExpandedId(null);
        } else {
            setExpandedId(docId);

            if (!previewUrls[docId]) {
                setPreviewLoading(prev => ({ ...prev, [docId]: true }));
                setPreviewError(prev => ({ ...prev, [docId]: false }));

                try {
                    const url = bknApiService.previewDokumen(doc.object);
                    setPreviewUrls(prev => ({ ...prev, [docId]: url }));

                    const response = await fetch(url, { method: 'HEAD' });
                    if (!response.ok) {
                        setPreviewError(prev => ({ ...prev, [docId]: true }));
                    }
                } catch (error) {
                    setPreviewError(prev => ({ ...prev, [docId]: true }));
                } finally {
                    setPreviewLoading(prev => ({ ...prev, [docId]: false }));
                }
            }
        }
    }, [expandedId, previewUrls]);

    React.useEffect(() => {
        if (nip) {
            loadDokumen();
        }
    }, [nip, loadDokumen]);

    if (loading) {
        return <LoadingSpinner text="Memuat dokumen..." />;
    }

    if (dokumenList.length === 0) {
        return (
            <EmptyState
                icon={FileText}
                title="Tidak Ada Dokumen"
                description="Tidak ada dokumen tersedia untuk pegawai ini"
                action={{ label: "Muat Ulang", onClick: loadDokumen }}
            />
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <FileText size={20} className="text-indigo-600" />
                    Dokumen Digital
                </h3>
                <button
                    onClick={loadDokumen}
                    disabled={loading}
                    className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 disabled:opacity-50 flex items-center gap-2"
                >
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Memuat...' : 'Muat Dokumen'}
                </button>
            </div>

            <div className="space-y-3">
                {dokumenList.map((doc) => {
                    const docId = doc.id || doc.object;
                    return (
                        <DokumenCard
                            key={docId}
                            dokumen={doc}
                            isExpanded={expandedId === docId}
                            isLoading={previewLoading[docId] || false}
                            hasError={previewError[docId] || false}
                            previewUrl={previewUrls[docId]}
                            onToggle={() => togglePreview(doc)}
                            onDownload={() => window.open(bknApiService.downloadDokumen(doc.object, doc.nama), '_blank')}
                            onPreview={() => window.open(bknApiService.previewDokumen(doc.object), '_blank')}
                        />
                    );
                })}
            </div>
        </div>
    );
};