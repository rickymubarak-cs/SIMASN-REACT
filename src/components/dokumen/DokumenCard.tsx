// src/components/dokumen/DokumenCard.tsx
import React from 'react';
import { FileText, Eye, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { Dokumen } from '../../types';

interface DokumenCardProps {
    dokumen: Dokumen;
    isExpanded: boolean;
    isLoading: boolean;
    hasError: boolean;
    previewUrl?: string;
    onToggle: () => void;
    onDownload: () => void;
    onPreview: () => void;
}

export const DokumenCard: React.FC<DokumenCardProps> = ({
    dokumen,
    isExpanded,
    isLoading,
    hasError,
    previewUrl,
    onToggle,
    onDownload,
    onPreview
}) => {
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <FileText size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-slate-800">{dokumen.nama}</p>
                        <p className="text-xs text-slate-400 font-mono truncate max-w-md">
                            {dokumen.object?.split('/').pop()}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onDownload(); }}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Download"
                    >
                        <Download size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggle(); }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={isExpanded ? "Tutup" : "Preview"}
                    >
                        {isExpanded ? <ChevronUp size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* Preview Panel */}
            {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                    <DokumenPreview
                        dokumen={dokumen}
                        isLoading={isLoading}
                        hasError={hasError}
                        previewUrl={previewUrl}
                        onDownload={onDownload}
                        onPreview={onPreview}
                    />
                </div>
            )}
        </div>
    );
};