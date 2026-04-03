// src/components/tables/DataTablePemberhentian.tsx
import React, { useState } from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, ChevronUp, ChevronDown, UserX } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';

interface DataTablePemberhentianProps {
    data: any[];
    startIndex: number;
    onDetail: (item: any) => void;
    onPerbaiki: (item: any) => void;
    onTolak: (item: any) => void;
    onTerima: (id: string, isTembusan: boolean) => void;
    onUpload: (item: any) => void;
}

type SortField = 'nama' | 'nip' | 'unit' | 'tanggal' | 'status' | 'jenis';
type SortOrder = 'asc' | 'desc';

export const DataTablePemberhentian: React.FC<DataTablePemberhentianProps> = ({
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
                    aVal = a.layanan_pemberhentian_status || '';
                    bVal = b.layanan_pemberhentian_status || '';
                    break;
                case 'jenis':
                    aVal = a.jenis_pemberhentian || '';
                    bVal = b.jenis_pemberhentian || '';
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

    const getJenisPemberhentianBadge = (jenis: string) => {
        if (jenis === "BATAS USIA PENSIUN") {
            return <span className="text-[10px] text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Pensiun (BUP)</span>;
        } else if (jenis === "MENINGGAL DUNIA") {
            return <span className="text-[10px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded-full">Meninggal</span>;
        }
        return <span className="text-[10px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">{jenis.length > 15 ? jenis.slice(0, 15) + '...' : jenis}</span>;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider w-12">#</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nama')} className="flex items-center gap-1 hover:text-rose-600">
                                    Nama Pegawai {getSortIcon('nama')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nip')} className="flex items-center gap-1 hover:text-rose-600">
                                    NIP {getSortIcon('nip')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('unit')} className="flex items-center gap-1 hover:text-rose-600">
                                    Unit Kerja {getSortIcon('unit')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('jenis')} className="flex items-center gap-1 hover:text-rose-600">
                                    Jenis Pemberhentian {getSortIcon('jenis')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('tanggal')} className="flex items-center gap-1 hover:text-rose-600">
                                    Tanggal {getSortIcon('tanggal')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-rose-600">
                                    Status {getSortIcon('status')}
                                </button>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-slate-600 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedData.map((item, idx) => {
                            const status = item.layanan_pemberhentian_status || "pengajuan";
                            const namaLengkap = getNamaLengkap(item);

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
                                        {getJenisPemberhentianBadge(item.jenis_pemberhentian)}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {formatDateTimeId(item.timestamp)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={status} size="sm" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 justify-center">
                                            <button onClick={() => onDetail(item)} className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 transition-all" title="Detail">
                                                <Eye size={14} />
                                            </button>
                                            {status === "pengajuan" && (
                                                <>
                                                    <button onClick={() => onPerbaiki(item)} className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white transition-all" title="Perbaiki">
                                                        <Edit size={14} />
                                                    </button>
                                                    <button onClick={() => onTolak(item)} className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all" title="Tolak">
                                                        <Ban size={14} />
                                                    </button>
                                                    <button onClick={() => onTerima(item.layanan_pemberhentian_id, false)} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all" title="Terima">
                                                        <CheckCircle size={14} />
                                                    </button>
                                                </>
                                            )}
                                            {status === "diterima" && (
                                                <button onClick={() => onUpload(item)} className="p-1.5 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-all" title="Upload Berkas">
                                                    <Upload size={14} />
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
                    <UserX size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500">Tidak ada data Pemberhentian ASN yang ditemukan</p>
                </div>
            )}
        </div>
    );
};