import React from 'react';
import { User, MapPin, Clock, FileText, Eye, Edit, Ban, CheckCircle, Upload } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId, getInitials } from '../../utils/formatters';

interface DataCardProps {
    data: any;
    index: number;
    activeTab: string;
    onDetail: () => void;
    onPerbaiki?: () => void;
    onTolak?: () => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: () => void;
}

export const DataCard: React.FC<DataCardProps> = ({
    data,
    index,
    activeTab,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const isPltplh = activeTab === "pltplh";
    const isTembusan = data.layanan_pltplh_pengajuan === "Tembusan";
    const status = data.layanan_pltplh_status || data.status || "pengajuan";
    const namaLengkap = `${data.peg_gelar_depan || ""} ${data.peg_nama || data.nama || ""} ${data.peg_gelar_belakang || ""}`.trim();

    return (
        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col overflow-hidden relative">
            <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-lg shadow-blue-200">
                        {activeTab === 'rekap_cuti' ? <MapPin size={20} /> : <User size={20} />}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase">
                            #{index}
                        </span>
                        <StatusBadge status={status} />
                    </div>
                </div>

                <h3 className="font-black text-slate-800 text-sm leading-tight mb-1 line-clamp-2 uppercase group-hover:text-blue-600 transition-colors">
                    {activeTab === 'rekap_cuti' ? (data.nama_pd || data.unit_org_induk_nm) : (namaLengkap || "Tanpa Nama")}
                </h3>

                {activeTab !== 'rekap_cuti' && (
                    <p className="text-[9px] font-bold text-slate-400 font-mono mb-3">NIP. {data.peg_nip || data.nip || "-"}</p>
                )}

                {isPltplh && (
                    <div className="mb-3">
                        <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full inline-flex items-center gap-1">
                            <FileText size={10} />
                            {data.layanan_pltplh_pengajuan || "PLT/PLH"}
                            {isTembusan && (
                                <span className="bg-orange-100 text-orange-600 ml-1 px-1.5 py-0.5 rounded-full text-[8px]">
                                    Tembusan
                                </span>
                            )}
                        </span>
                    </div>
                )}

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
                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                    >
                        <Eye size={12} /> Detail
                    </button>

                    {isPltplh && (
                        <>
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
                                        onClick={() => onTerima?.(data.layanan_pltplh_id, isTembusan)}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-green-200 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                    >
                                        <CheckCircle size={12} /> Terima
                                    </button>
                                </>
                            )}

                            {status === "diterima" && !isTembusan && (
                                <button
                                    onClick={onUpload}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-[9px] font-bold bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    <Upload size={12} /> Upload
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};