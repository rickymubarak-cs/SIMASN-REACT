// src/components/cards/DataCardKompetensiDetailed.tsx
import React from 'react';
import { Award, Clock, Eye, Edit, Ban, CheckCircle, Upload, Calendar, Building, FileText } from 'lucide-react';
import { StatusBadge } from '../../../../common/StatusBadge';
import { formatDateTimeId } from '../../../../../utils/formatters';

interface DataCardKompetensiDetailedProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardKompetensiDetailed: React.FC<DataCardKompetensiDetailedProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisKompetensi = data.riw_kom_jenis || "-";
    const namaKompetensi = data.riw_kom_nama || "-";
    const penyelenggara = data.riw_kom_penyelenggara || "-";
    const nomorSertifikat = data.riw_kom_no || "-";
    const tanggalMulai = data.riw_kom_tmtm || "-";
    const tanggalSelesai = data.riw_kom_tmts || "-";
    const tahun = data.riw_kom_tahun || "-";
    const jamPelajaran = data.riw_kom_jp || 0;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 hover:shadow-xl hover:border-orange-200 transition-all group">
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
                            <Award size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-base uppercase group-hover:text-orange-600 transition-colors">
                                {namaLengkap || "Tanpa Nama"}
                            </h3>
                            <p className="text-xs text-slate-500 font-mono">NIP. {data.peg_nip || "-"}</p>
                        </div>
                    </div>
                    <StatusBadge status={status} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Building size={14} className="text-slate-400" />
                        <span className="truncate">{data.unit_org_induk_nm || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Award size={14} className="text-orange-500" />
                        <span>Jenis: {jenisKompetensi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        <span>Tahun: {tahun}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <FileText size={14} className="text-slate-400" />
                        <span>JP: {jamPelajaran}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Nama Kompetensi</p>
                    <p className="text-xs text-slate-600">{namaKompetensi}</p>
                </div>

                <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Penyelenggara</p>
                    <p className="text-xs text-slate-600">{penyelenggara}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <p className="text-[10px] text-slate-400">Tanggal Mulai</p>
                        <p className="text-xs text-slate-600">{formatDateTimeId(tanggalMulai)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400">Tanggal Selesai</p>
                        <p className="text-xs text-slate-600">{formatDateTimeId(tanggalSelesai)}</p>
                    </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <button
                        onClick={onDetail}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-orange-100 hover:text-orange-700 transition-all flex items-center justify-center gap-2"
                    >
                        <Eye size={14} /> Detail Lengkap
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={onPerbaiki}
                                className="py-2 px-4 rounded-xl text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white transition-all"
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                onClick={onTolak}
                                className="py-2 px-4 rounded-xl text-xs font-bold bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Ban size={14} />
                            </button>
                            <button
                                onClick={() => onTerima?.(data.komp_id, false)}
                                className="flex-1 py-2 rounded-xl text-xs font-bold bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={14} /> Terima
                            </button>
                        </>
                    )}

                    {status === "diterima" && (
                        <button
                            onClick={onUpload}
                            className="flex-1 py-2 rounded-xl text-xs font-bold bg-orange-100 text-orange-700 hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Upload size={14} /> Upload Berkas
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};