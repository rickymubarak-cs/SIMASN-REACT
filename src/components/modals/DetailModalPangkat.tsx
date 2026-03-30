import React, { useState } from 'react';
import {
    X, User, Building, Paperclip, FileCheck, Clock, Info, TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { FileLink } from '../common/FileLink';
import { formatDateTimeId, getInitials } from '../../utils/formatters';
import { pangkatFileConfig } from '../../service/pangkatService';

interface DetailModalPangkatProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
}

const BASE_URL_FOTO = "https://simasn.pontianak.go.id/assets/berkas/profil/";

export const DetailModalPangkat: React.FC<DetailModalPangkatProps> = ({
    isOpen,
    onClose,
    data
}) => {
    const [showAllFiles, setShowAllFiles] = useState(false);

    if (!isOpen || !data) return null;

    const fotoUrl = data.foto_url || (data.foto ? `${BASE_URL_FOTO}${data.foto}` : null);
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const initials = getInitials(namaLengkap);
    const status = data.layanan_status || "pengajuan";
    const jenisKenaikan = data.lay_kp_jenis || "Kenaikan Pangkat";

    // Filter file yang tersedia
    const availableFiles = pangkatFileConfig.filter(
        fileConfig => data[fileConfig.key] && data[fileConfig.key].trim() !== ""
    );

    // Tampilkan 6 file pertama, sisanya di toggle
    const visibleFiles = showAllFiles ? availableFiles : availableFiles.slice(0, 6);
    const hasMoreFiles = availableFiles.length > 6;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-3xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <TrendingUp size={24} />
                                Detail Kenaikan Pangkat
                            </h2>
                            <p className="text-purple-100 text-xs mt-1">
                                Informasi lengkap pengajuan kenaikan pangkat
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Sidebar Info */}
                        <div className="md:col-span-1 space-y-4">
                            {/* Foto Profile */}
                            <div className="text-center">
                                {fotoUrl ? (
                                    <img
                                        src={fotoUrl}
                                        alt={namaLengkap}
                                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-purple-200 shadow-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.className = "w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-purple-200 shadow-lg";
                                                fallback.textContent = initials;
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-purple-200 shadow-lg">
                                        {initials}
                                    </div>
                                )}
                                <h3 className="font-black text-slate-800 mt-3">{namaLengkap || "Tanpa Nama"}</h3>
                                <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || "-"}</p>
                            </div>

                            {/* Info Pegawai */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <User size={14} /> Informasi Pegawai
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400">Unit Kerja</p>
                                        <p className="font-medium text-slate-700 text-sm">
                                            {data.unit_org_induk_nm || data.unit_kerja || "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400">Jenis Kenaikan</p>
                                        <p className="font-medium text-slate-700 text-sm">
                                            {jenisKenaikan}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400">Tanggal Pengajuan</p>
                                        <p className="font-medium text-slate-700 text-sm">
                                            {formatDateTimeId(data.layanan_tgl || data.timestamp || data.tgl_usul)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Info size={14} /> Status Pengajuan
                                </h4>
                                <StatusBadge status={status} />
                                {data.keterangan && (
                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                        <p className="text-[10px] text-slate-400">Keterangan</p>
                                        <p className="text-xs text-slate-600 mt-1">{data.keterangan}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dokumen Section */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <Paperclip size={16} /> Dokumen Persyaratan
                                </h4>
                                <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold">
                                    {availableFiles.length} berkas
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {visibleFiles.map((fileConfig) => (
                                    <div key={fileConfig.key} className="bg-slate-50 rounded-xl p-3">
                                        <FileLink
                                            label={fileConfig.label}
                                            href={data[`${fileConfig.key}_url`] || null}
                                            showPreview={true}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Toggle button untuk file lainnya */}
                            {hasMoreFiles && (
                                <button
                                    onClick={() => setShowAllFiles(!showAllFiles)}
                                    className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                                >
                                    {showAllFiles ? (
                                        <>
                                            <ChevronUp size={14} />
                                            Sembunyikan Berkas
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown size={14} />
                                            Tampilkan {availableFiles.length - 6} Berkas Lainnya
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Berkas Hasil */}
                            {data.file_status_pelayanan && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                                        <FileCheck size={16} className="text-purple-600" /> Berkas Hasil
                                    </h4>
                                    <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                                        <FileLink
                                            label="SK Kenaikan Pangkat"
                                            href={data.file_status_pelayanan_url || null}
                                            showPreview={true}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-slate-100 p-4 bg-slate-50 rounded-b-3xl flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModalPangkat;