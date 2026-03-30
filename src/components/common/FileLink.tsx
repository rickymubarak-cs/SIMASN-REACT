import React, { useState, useMemo } from 'react';
import { FileText, ExternalLink, Eye, FileX, X, Download, Loader2 } from 'lucide-react';

interface FileLinkProps {
    label: string;
    href: string | null;
    showPreview?: boolean;
}

// Komponen Preview Modal
const PreviewModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
}> = ({ isOpen, onClose, fileUrl, fileName }) => {
    const [loadError, setLoadError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (!isOpen) return null;

    const fileExt = fileUrl.split('.').pop()?.toLowerCase() || '';
    const isPdf = fileExt === 'pdf';
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

    // Google Docs Viewer URL untuk PDF
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setLoadError(true);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setLoadError(true);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 flex justify-between items-center">
                    <h3 className="font-bold text-sm truncate flex-1">
                        <Eye size={14} className="inline mr-2" />
                        {fileName}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Body - Preview Area */}
                <div className="p-3 bg-slate-100 min-h-[400px] max-h-[calc(85vh-100px)] overflow-auto relative">
                    {/* Loading Spinner */}
                    {isLoading && !loadError && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
                            <Loader2 size={40} className="text-blue-500 animate-spin mb-3" />
                            <p className="text-slate-500 text-sm font-medium">Memuat dokumen...</p>
                            <p className="text-slate-400 text-xs mt-1">Mohon tunggu sebentar</p>
                        </div>
                    )}

                    {loadError ? (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <FileX size={48} className="text-slate-400 mb-3" />
                            <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                            <p className="text-slate-400 text-xs mb-4">
                                File tidak dapat ditampilkan.
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href={fileUrl}
                                    download
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1"
                                >
                                    <Download size={12} />
                                    Download File
                                </a>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                                >
                                    <ExternalLink size={12} />
                                    Buka di Tab Baru
                                </a>
                            </div>
                        </div>
                    ) : isImage ? (
                        <img
                            src={fileUrl}
                            alt={fileName}
                            className={`max-w-full max-h-[65vh] mx-auto rounded-lg shadow-md transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            style={{ opacity: isLoading ? 0 : 1 }}
                        />
                    ) : isPdf ? (
                        <iframe
                            src={googleViewerUrl}
                            className={`w-full h-[65vh] rounded-lg border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            title={fileName}
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                            referrerPolicy="no-referrer"
                            allow="fullscreen"
                            style={{ opacity: isLoading ? 0 : 1 }}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-center">
                            <FileX size={48} className="text-slate-400 mb-3" />
                            <p className="text-slate-600 mb-2">Preview tidak tersedia</p>
                            <p className="text-slate-400 text-xs mb-4">
                                Format file {fileExt.toUpperCase()} tidak dapat dipreview
                            </p>
                            <div className="flex gap-2">
                                <a
                                    href={fileUrl}
                                    download
                                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1"
                                >
                                    <Download size={12} />
                                    Download File
                                </a>
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1"
                                >
                                    <ExternalLink size={12} />
                                    Buka di Tab Baru
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 p-2.5 bg-slate-50 flex justify-end gap-2">
                    <a
                        href={fileUrl}
                        download
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-bold hover:bg-green-200 transition-colors flex items-center gap-1"
                    >
                        <Download size={10} />
                        Download
                    </a>
                    <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                        <ExternalLink size={10} />
                        Buka Tab Baru
                    </a>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export const FileLink: React.FC<FileLinkProps> = ({
    label,
    href,
    showPreview = true
}) => {
    const [previewOpen, setPreviewOpen] = useState(false);

    const hasFile = useMemo(() => {
        return href && !href.endsWith('undefined') && !href.endsWith('/') && !href.includes('null') && href !== "";
    }, [href]);

    const handlePreview = () => {
        if (href) {
            setPreviewOpen(true);
        }
    };

    if (!hasFile) {
        return (
            <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[10px] bg-slate-50 text-slate-400 border border-slate-100">
                <div className="flex items-center gap-2">
                    <FileX size={12} className="shrink-0 opacity-40" />
                    <span className="truncate">{label}</span>
                </div>
                <span className="text-[8px]">Tidak tersedia</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center gap-1">
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-[10px] font-bold bg-white text-slate-700 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:shadow-md transition-all group/link"
                >
                    <div className="flex items-center gap-2 truncate">
                        <FileText size={14} className="text-blue-500 shrink-0" />
                        <span className="truncate">{label}</span>
                    </div>
                    <ExternalLink size={12} className="text-slate-300 group-hover/link:text-blue-400" />
                </a>
                {showPreview && (
                    <button
                        onClick={handlePreview}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-all"
                        title="Preview"
                    >
                        <Eye size={14} />
                    </button>
                )}
            </div>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={previewOpen}
                onClose={() => setPreviewOpen(false)}
                fileUrl={href}
                fileName={label}
            />
        </>
    );
};