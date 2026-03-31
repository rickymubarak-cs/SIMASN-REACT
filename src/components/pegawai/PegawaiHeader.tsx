// src/components/pegawai/PegawaiHeader.tsx
import React from 'react';
import { GitMerge, RefreshCcw } from 'lucide-react';
import { DataASN } from '../../types';
import { getStatusBadgeClass } from '../../utils/formatters';

interface PegawaiHeaderProps {
    data: DataASN;
    onSync: () => void;
    syncing: boolean;
}

export const PegawaiHeader: React.FC<PegawaiHeaderProps> = ({ data, onSync, syncing }) => {
    const statusClass = getStatusBadgeClass(data.statusPegawai);

    return (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        {data.gelarDepan ? data.gelarDepan + ' ' : ''}
                        {data.nama}
                        {data.gelarBelakang ? ', ' + data.gelarBelakang : ''}
                    </h2>
                    <p className="text-sm text-slate-500 font-mono mt-1">
                        NIP. {data.nip} {data.nipLama && `(NIP Lama: ${data.nipLama})`}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                            {data.golRuangAkhir || '-'} - {data.pangkatAkhir || '-'}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {data.jenisPegawai || '-'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                            {data.statusPegawai || '-'}
                        </span>
                    </div>
                </div>
                <button
                    onClick={onSync}
                    disabled={syncing}
                    className="px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {syncing ? <RefreshCcw size={16} className="animate-spin" /> : <GitMerge size={16} />}
                    Sinkronisasi SIASN
                </button>
            </div>
        </div>
    );
};