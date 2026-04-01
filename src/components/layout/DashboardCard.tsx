// src/components/layout/DashboardCard.tsx
import React from 'react';
import { Database, MapPin, RefreshCcw, Clock, FileText, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface DashboardCardProps {
    label: string;
    value: string | number;
    icon: string;
    color: string;
}

const iconMap: Record<string, any> = {
    Database,
    MapPin,
    RefreshCcw,
    Clock,
    FileText,
    Users,
    CheckCircle,
    AlertCircle
};

const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    orange: 'bg-orange-50 text-orange-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    sky: 'bg-sky-50 text-sky-600',
    violet: 'bg-violet-50 text-violet-600'
};

export const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, icon, color }) => {
    const IconComponent = iconMap[icon] || Database;
    const colorClass = colorMap[color] || colorMap.blue;

    // Format value if it's a number and large
    const formattedValue = typeof value === 'number' && value > 999
        ? value.toLocaleString('id-ID')
        : value;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-lg transition-all hover:-translate-y-1">
            <div className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent size={24} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="text-2xl font-black text-slate-800 truncate" title={String(formattedValue)}>
                    {formattedValue}
                </p>
            </div>
        </div>
    );
};

export default DashboardCard;