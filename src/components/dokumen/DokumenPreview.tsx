// src/components/dokumen/DokumenPreview.tsx
import React from 'react';
import { Loader2, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { Dokumen } from '../../types';

interface DokumenPreviewProps {
    dokumen: Dokumen;
    isLoading: boolean;
    hasError: boolean;
    previewUrl?: string;
    onDownload: () => void;
    onPreview: () => void;
}

export const DokumenPreview: React.FC<DokumenPreviewProps> = ({
    dokumen,
    isLoading,
    hasError,
    previewUrl,
    onDownload,
    onPreview
}) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-indigo-500 mb-2" />
                <p className="text-sm text-slate-500">Memuat preview...</p>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle size={48} className="text-red-500 mb-3" />
                <p className="text-slate-600 mb-4">Gagal memuat preview dokumen</p>
                <div className="flex gap-3">
                    <button
                        onClick={onDownload}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                    >
                        <Download size={14} className="inline mr-1" />
                        Download
                    </button>
                    <button
                        onClick={onPreview}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                        <ExternalLink size={14} className="inline mr-1" />
                        Buka Tab Baru
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <iframe
                src={previewUrl}
                className="w-full h-[400px] rounded-lg border-0 bg-white shadow-sm"
                title={dokumen.nama}
            />
            <div className="mt-3 flex justify-end gap-2">
                <button
                    onClick={onDownload}
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200"
                >
                    <Download size={12} className="inline mr-1" />
                    Download
                </button>
                <button
                    onClick={onPreview}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-50"
                >
                    <ExternalLink size={12} className="inline mr-1" />
                    Buka Tab Baru
                </button>
            </div>
        </div>
    );
};