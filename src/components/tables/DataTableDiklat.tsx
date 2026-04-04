// src/components/tables/DataTableDiklat.tsx

import React, { useState } from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, ChevronUp, ChevronDown, Loader, FileCheck, BookOpen } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';

interface DataTableDiklatProps {
    data: any[];
    startIndex: number;
    onDetail: (item: any) => void;
    onPerbaiki: (item: any) => void;
    onTolak: (item: any) => void;
    onTerima: (id: string, isTembusan: boolean) => void;
    onUpload: (item: any) => void;
}

type SortField = 'nama' | 'nip' | 'unit' | 'tanggal' | 'status' | 'diklat';
type SortOrder = 'asc' | 'desc';

export const DataTableDiklat: React.FC<DataTableDiklatProps> = ({
    data,
    startIndex,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload
}) => {
    const [sortField, setSortField] = useState<SortField>('tanggal');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
    const [actionLoading, setActionLoading] = useState<{ type: string; id: string } | null>(null);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ChevronUp size={14} className="opacity-30" />;
        return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    const handleAction = async (type: string, id: string, action: () => void | Promise<void>) => {
        setActionLoading({ type, id });
        try {
            await action();
        } finally {
            setActionLoading(null);
        }
    };

    const filteredAndSortedData = React.useMemo(() => {
        let filtered = [...data];

        Object.entries(columnFilters).forEach(([field, value]) => {
            if (value) {
                filtered = filtered.filter(item => {
                    const itemValue = String(item[field] || '').toLowerCase();
                    return itemValue.includes(value.toLowerCase());
                });
            }
        });

        filtered.sort((a, b) => {
            let aVal: any, bVal: any;
            switch (sortField) {
                case 'nama':
                    aVal = `${a.peg_gelar_depan || ''} ${a.peg_nama || ''} ${a.peg_gelar_belakang || ''}`.trim();
                    bVal = `${b.peg_gelar_depan || ''} ${b.peg_nama || ''} ${b.peg_gelar_belakang || ''}`.trim();
                    break;
                case 'nip':
                    aVal = a.peg_nip || '';
                    bVal = b.peg_nip || '';
                    break;
                case 'unit':
                    aVal = a.unit_org_induk_nm || '';
                    bVal = b.unit_org_induk_nm || '';
                    break;
                case 'tanggal':
                    aVal = a.timestamp || '';
                    bVal = b.timestamp || '';
                    break;
                case 'status':
                    aVal = a.layanan_diklat_status || '';
                    bVal = b.layanan_diklat_status || '';
                    break;
                case 'diklat':
                    aVal = a.nama_usulan_diklat || '';
                    bVal = b.nama_usulan_diklat || '';
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [data, sortField, sortOrder, columnFilters]);

    const getNamaLengkap = (item: any) => {
        return `${item.peg_gelar_depan || ""} ${item.peg_nama || ""} ${item.peg_gelar_belakang || ""}`.trim();
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nama')} className="flex items-center gap-1 hover:text-sky-600">
                                    Nama Pegawai {getSortIcon('nama')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nip')} className="flex items-center gap-1 hover:text-sky-600">
                                    NIP {getSortIcon('nip')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('unit')} className="flex items-center gap-1 hover:text-sky-600">
                                    Unit Kerja {getSortIcon('unit')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('diklat')} className="flex items-center gap-1 hover:text-sky-600">
                                    Nama Diklat {getSortIcon('diklat')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('tanggal')} className="flex items-center gap-1 hover:text-sky-600">
                                    Tanggal {getSortIcon('tanggal')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Berkas
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedData.map((item, idx) => {
                            const status = item.layanan_diklat_status || "pengajuan";
                            const namaLengkap = getNamaLengkap(item);
                            const isLoading = actionLoading?.id === item.layanan_diklat_id;

                            return (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-slate-500">{startIndex + idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-800 text-sm">{namaLengkap || "-"}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="font-mono text-xs text-slate-500">{item.peg_nip || "-"}</span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {item.unit_org_induk_nm || "-"}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-600 max-w-xs truncate" title={item.nama_usulan_diklat}>
                                            {item.nama_usulan_diklat || "-"}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {formatDateTimeId(item.timestamp)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={status} size="sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        {item.file_status_pelayanan ? (
                                            <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                                                <FileCheck size={10} />
                                                <span className="truncate max-w-[100px]">{item.file_status_pelayanan}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 justify-center">
                                            <button
                                                onClick={() => handleAction('detail', item.layanan_diklat_id, () => onDetail(item))}
                                                disabled={isLoading}
                                                className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-sky-100 hover:text-sky-600 transition-all disabled:opacity-50"
                                                title="Detail"
                                            >
                                                <Eye size={14} />
                                            </button>

                                            {status === "pengajuan" && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction('perbaiki', item.layanan_diklat_id, () => onPerbaiki(item))}
                                                        disabled={isLoading}
                                                        className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50"
                                                        title="Perbaiki"
                                                    >
                                                        {actionLoading?.type === 'perbaiki' && isLoading ? <Loader size={14} className="animate-spin" /> : <Edit size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('tolak', item.layanan_diklat_id, () => onTolak(item))}
                                                        disabled={isLoading}
                                                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                                        title="Tolak"
                                                    >
                                                        {actionLoading?.type === 'tolak' && isLoading ? <Loader size={14} className="animate-spin" /> : <Ban size={14} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('terima', item.layanan_diklat_id, () => onTerima(item.layanan_diklat_id, false))}
                                                        disabled={isLoading}
                                                        className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all disabled:opacity-50"
                                                        title="Terima"
                                                    >
                                                        {actionLoading?.type === 'terima' && isLoading ? <Loader size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                    </button>
                                                </>
                                            )}

                                            {(status === "diterima" || status === "selesai") && (
                                                <button
                                                    onClick={() => handleAction('upload', item.layanan_diklat_id, () => onUpload(item))}
                                                    disabled={isLoading}
                                                    className={`p-1.5 rounded-lg transition-all disabled:opacity-50 ${status === "selesai"
                                                            ? 'bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white'
                                                            : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                                                        }`}
                                                    title={status === "selesai" ? "Ganti Berkas" : "Upload Berkas"}
                                                >
                                                    {actionLoading?.type === 'upload' && isLoading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredAndSortedData.length === 0 && (
                <div className="text-center py-12">
                    <BookOpen size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">Tidak ada data Diklat yang ditemukan</p>
                </div>
            )}
        </div>
    );
};