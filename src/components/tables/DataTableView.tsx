// src/components/tables/DataTableView.tsx
import React, { useState, useMemo, memo } from 'react';
import { Eye, Edit, Ban, CheckCircle, Upload, ChevronUp, ChevronDown, Search, ArrowUpDown } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTimeId } from '../../utils/formatters';

interface DataTableViewProps {
    data: any[];
    onDetail: (item: any) => void;
    onPerbaiki?: (id: string) => void;
    onTolak?: (id: string) => void;
    onTerima?: (id: string, isTembusan: boolean) => void;
    onUpload?: (id: string) => void;
    isLoading?: boolean;
}

type SortField = 'nama' | 'nip' | 'tanggal' | 'status';
type SortOrder = 'asc' | 'desc';

export const DataTableView: React.FC<DataTableViewProps> = memo(({
    data,
    onDetail,
    onPerbaiki,
    onTolak,
    onTerima,
    onUpload,
    isLoading = false
}) => {
    const [sortField, setSortField] = useState<SortField>('tanggal');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedData = useMemo(() => {
        let filtered = [...data];

        // Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item => {
                const namaLengkap = `${item.peg_gelar_depan || ""} ${item.peg_nama || ""} ${item.peg_gelar_belakang || ""}`.toLowerCase();
                return namaLengkap.includes(term) || (item.peg_nip || "").includes(term);
            });
        }

        // Sort
        filtered.sort((a, b) => {
            let aVal: any, bVal: any;

            switch (sortField) {
                case 'nama':
                    aVal = `${a.peg_gelar_depan || ""} ${a.peg_nama || ""} ${a.peg_gelar_belakang || ""}`.toLowerCase();
                    bVal = `${b.peg_gelar_depan || ""} ${b.peg_nama || ""} ${b.peg_gelar_belakang || ""}`.toLowerCase();
                    break;
                case 'nip':
                    aVal = a.peg_nip || "";
                    bVal = b.peg_nip || "";
                    break;
                case 'tanggal':
                    aVal = new Date(a.timestamp || a.tgl_usul || 0).getTime();
                    bVal = new Date(b.timestamp || b.tgl_usul || 0).getTime();
                    break;
                case 'status':
                    aVal = a.layanan_pemberhentian_status || "";
                    bVal = b.layanan_pemberhentian_status || "";
                    break;
                default:
                    return 0;
            }

            if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [data, searchTerm, sortField, sortOrder]);

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return <ArrowUpDown size={12} className="opacity-50" />;
        return sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-rose-500 border-t-transparent"></div>
                    <p className="mt-2 text-sm text-slate-500">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
                <div className="relative max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari nama atau NIP..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nama')} className="flex items-center gap-1 hover:text-rose-600">
                                    Nama Pegawai <SortIcon field="nama" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('nip')} className="flex items-center gap-1 hover:text-rose-600">
                                    NIP <SortIcon field="nip" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider hidden md:table-cell">
                                Unit Kerja
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('tanggal')} className="flex items-center gap-1 hover:text-rose-600">
                                    Tanggal <SortIcon field="tanggal" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                <button onClick={() => handleSort('status')} className="flex items-center gap-1 hover:text-rose-600">
                                    Status <SortIcon field="status" />
                                </button>
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredAndSortedData.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                    Tidak ada data ditemukan
                                </td>
                            </tr>
                        ) : (
                            filteredAndSortedData.map((item, idx) => {
                                const status = item.layanan_pemberhentian_status || "pengajuan";
                                const namaLengkap = `${item.peg_gelar_depan || ""} ${item.peg_nama || ""} ${item.peg_gelar_belakang || ""}`.trim();

                                return (
                                    <tr key={item.layanan_pemberhentian_id || idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-800">{namaLengkap || "Tanpa Nama"}</div>
                                            <div className="text-[10px] text-slate-400 md:hidden">{item.peg_nip || "-"}</div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-600 hidden md:table-cell">
                                            {item.peg_nip || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600 hidden md:table-cell truncate max-w-[200px]">
                                            {item.unit_org_induk_nm || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-600">
                                            {formatDateTimeId(item.timestamp || item.tgl_usul)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusBadge status={status} size="sm" />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => onDetail(item)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Detail"
                                                >
                                                    <Eye size={14} />
                                                </button>
                                                {status === "pengajuan" && (
                                                    <>
                                                        <button
                                                            onClick={() => onPerbaiki?.(item.layanan_pemberhentian_id)}
                                                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Perbaiki"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => onTolak?.(item.layanan_pemberhentian_id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Tolak"
                                                        >
                                                            <Ban size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => onTerima?.(item.layanan_pemberhentian_id, false)}
                                                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Terima"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                {status === "diterima" && (
                                                    <button
                                                        onClick={() => onUpload?.(item.layanan_pemberhentian_id)}
                                                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                        title="Upload SK"
                                                    >
                                                        <Upload size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Info Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500">
                Menampilkan {filteredAndSortedData.length} dari {data.length} data
            </div>
        </div>
    );
});

DataTableView.displayName = 'DataTableView';