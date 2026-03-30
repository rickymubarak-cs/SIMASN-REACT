import React from 'react';
import { User, Clock, Eye, Edit, Ban, CheckCircle, Upload, Briefcase, FileCheck } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';
import { jfFileConfig } from '../../service/jfService';

interface DataCardJFProps {
    data: any;
    index: number;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCardJF: React.FC<DataCardJFProps> = ({
    data,
    index,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const status = data.layanan_jf_status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || ""} ${data.peg_gelar_belakang || ""}`.trim();
    const jenisJF = data.jenis_jf || "Jabatan Fungsional";

    // Hitung jumlah file yang tersedia
    const availableFiles = jfFileConfig.filter(
        fileConfig => data[fileConfig.key] && data[fileConfig.key].trim() !== ""
    ).length;

    return (
        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col overflow-hidden relative">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg shadow-indigo-200">
                        <Briefcase size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full uppercase">
                            #{index}
                        </span>
                        <StatusBadge status={status} />
                    </div>
                </div>

                <h3 className="font-black text-slate-800 text-sm leading-tight mb-1 line-clamp-2 uppercase group-hover:text-indigo-600 transition-colors">
                    {namaLengkap || "Tanpa Nama"}
                </h3>

                <p className="text-[9px] font-bold text-slate-400 font-mono mb-2">
                    NIP. {data.peg_nip || "-"}
                </p>

                <p className="text-[9px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mb-3">
                    <Briefcase size={10} />
                    {jenisJF}
                </p>

                <p className="text-[9px] text-slate-500 bg-slate-50 px-2 py-1 rounded-full inline-flex items-center gap-1 mb-3">
                    <FileCheck size={10} />
                    {availableFiles} dari {jfFileConfig.length} Berkas tersedia
                </p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-[9px] font-black text-slate-400 uppercase">
                    <Clock size={10} />
                    <span>{formatDateTimeId(data.timestamp || data.tgl_usul)}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-slate-50/50 p-4 space-y-2 border-t border-slate-100">
                <div className="flex gap-1.5 flex-wrap">
                    <button
                        onClick={onDetail}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                    >
                        <Eye size={12} /> Detail
                    </button>

                    <button
                        onClick={onPerbaiki}
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white transition-all"
                    >
                        <Edit size={12} /> Perbaiki
                    </button>

                    {status === "pengajuan" && (
                        <>
                            <button
                                onClick={onTolak}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all"
                            >
                                <Ban size={12} /> Tolak
                            </button>

                            <button
                                onClick={() => onTerima?.(data.layanan_jf_id, false)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                            >
                                <CheckCircle size={12} /> Terima
                            </button>
                        </>
                    )}

                    {status === "diterima" && (
                        <button
                            onClick={onUpload}
                            className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                        >
                            <Upload size={12} /> Upload
                        </button>
                    )}
                </div>

                {/* File indicators - tampilkan file yang tersedia */}
                <div className="flex gap-1 pt-1 flex-wrap">
                    {jfFileConfig.slice(0, 4).map(fileConfig => (
                        data[fileConfig.key] && data[fileConfig.key].trim() !== "" && (
                            <span key={fileConfig.key} className="text-[8px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                                ✓ {fileConfig.label.slice(0, 12)}
                            </span>
                        )
                    ))}
                    {availableFiles > 4 && (
                        <span className="text-[8px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            +{availableFiles - 4} lainnya
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};