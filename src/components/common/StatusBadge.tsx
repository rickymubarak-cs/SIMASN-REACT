import React from 'react';
import { Send, CheckCircle, RotateCcw, Ban, FileCheck } from 'lucide-react';

interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<string, { icon: any; label: string; color: string }> = {
    pengajuan: { icon: Send, label: 'Pengajuan', color: 'blue' },
    diterima: { icon: CheckCircle, label: 'Diterima', color: 'green' },
    perbaikan: { icon: RotateCcw, label: 'Perbaikan', color: 'orange' },
    ditolak: { icon: Ban, label: 'Ditolak', color: 'red' },
    selesai: { icon: FileCheck, label: 'Selesai', color: 'emerald' }
};

const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200'
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pengajuan;
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClasses[config.color as keyof typeof colorClasses]}`}>
            <IconComponent size={12} />
            {config.label}
        </span>
    );
};