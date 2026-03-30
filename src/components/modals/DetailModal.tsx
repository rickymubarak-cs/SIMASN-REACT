import React from 'react';
import {
    X, User, Building, Calendar, FileText, Paperclip,
    FileCheck, Eye, ExternalLink, Clock, Info, Users
} from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { FileLink } from '../common/FileLink';
import { formatDateTimeId, getInitials } from '../../utils/formatters';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: any;
    activeTab: string;
}

const BASE_URL_BERKAS = "https://simasn.pontianak.go.id/assets/berkas/Layanan/";
const BASE_URL_BERKAS_ADMIN = "https://simasn.pontianak.go.id/assets/berkas/layanan_admin/";
const BASE_URL_FOTO = "https://simasn.pontianak.go.id/assets/berkas/profil/";

const configMap: Record<string, any> = {
    pltplh: {
        filePath: "PltPlh/",
        files: ["file_usulan", "file_sk_pltplh", "file_skpengganti", "file_pengantar"],
        fileLabels: {
            file_usulan: { label: "Surat Usulan", color: "blue" },
            file_sk_pltplh: { label: "SK PLT/PLH", color: "green" },
            file_skpengganti: { label: "SK Jabatan Pengganti", color: "orange" },
            file_pengantar: { label: "Surat Pengantar", color: "purple" }
        }
    },
    // Tambahkan konfigurasi untuk layanan lain jika diperlukan
};

export const DetailModal: React.FC<DetailModalProps> = ({
    isOpen,
    onClose,
    data,
    activeTab
}) => {
    if (!isOpen || !data) return null;

    const isPltplh = activeTab === "pltplh";
    const isTembusan = data.layanan_pltplh_pengajuan === "Tembusan";
    const fotoUrl = data.foto ? `${BASE_URL_FOTO}${data.foto}` : null;
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || data.nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const initials = getInitials(namaLengkap);
    const fileLabels = configMap[activeTab]?.fileLabels || {};
    const filePath = configMap[activeTab]?.filePath || "";

    // const handlePreview = (url: string, title: string) => {
    //     window.open(url, "_blank");
    // };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-3xl">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-black flex items-center gap-2">
                                <FileCheck size={24} />
                                Detail Layanan {activeTab.toUpperCase()}
                            </h2>
                            <p className="text-blue-100 text-xs mt-1">Informasi lengkap pengajuan layanan</p>
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
                                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-blue-200 shadow-lg"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                            const parent = e.currentTarget.parentElement;
                                            if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.className = "w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-blue-200 shadow-lg";
                                                fallback.textContent = initials;
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-5xl font-black mx-auto border-4 border-blue-200 shadow-lg">
                                        {initials}
                                    </div>
                                )}
                                <h3 className="font-black text-slate-800 mt-3">{namaLengkap || "Tanpa Nama"}</h3>
                                <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || data.nip || "-"}</p>
                            </div>

                            {/* Info Pegawai */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <User size={14} /> Informasi Pegawai
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] text-slate-400">Unit Kerja</p>
                                        <p className="font-medium text-slate-700 text-sm">{data.unit_org_induk_nm || data.unit_kerja || "-"}</p>
                                    </div>
                                    {isPltplh && (
                                        <>
                                            <div>
                                                <p className="text-[10px] text-slate-400">Jenis Pengajuan</p>
                                                <p className="font-medium text-slate-700 flex items-center gap-1">
                                                    {data.layanan_pltplh_pengajuan || "-"}
                                                    {isTembusan && (
                                                        <span className="bg-orange-100 text-orange-700 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                                            <Users size={10} /> Tembusan
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400">Tanggal Pengajuan</p>
                                                <p className="font-medium text-slate-700 text-sm">{formatDateTimeId(data.timestamp)}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Status Card */}
                            <div className="bg-slate-50 rounded-2xl p-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Info size={14} /> Status Pengajuan
                                </h4>
                                <StatusBadge status={data.layanan_pltplh_status || data.status || "pengajuan"} />
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
                                    {configMap[activeTab]?.files.filter((f: string) => data[f]).length || 0} berkas
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {configMap[activeTab]?.files.map((fileKey: string) => {
                                    const fileValue = data[fileKey];
                                    const fileLabel = fileLabels[fileKey]?.label || fileKey.replace(/file_/g, '').replace(/_/g, ' ').toUpperCase();
                                    const fileUrl = fileValue ? `${BASE_URL_BERKAS}${filePath}${fileValue}` : null;

                                    return (
                                        <div key={fileKey} className="bg-slate-50 rounded-xl p-3">
                                            <FileLink
                                                label={fileLabel}
                                                href={fileUrl}
                                                onPreview={null}  // Tidak perlu karena FileLink sudah punya preview sendiri
                                                showPreview={true}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Berkas Hasil (khusus PLT/PLH) */}
                            {isPltplh && data.file_status_pelayanan && (
                                <div className="mt-6">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-3">
                                        <FileCheck size={16} className="text-green-600" /> Berkas Hasil
                                    </h4>
                                    <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                                        <FileLink
                                            label="SK / Surat Keputusan"
                                            href={`${BASE_URL_BERKAS_ADMIN}pltplh/${data.file_status_pelayanan}`}
                                            onPreview={handlePreview}
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

export default DetailModal;