// src/components/layout/StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: 'blue' | 'green' | 'purple' | 'amber';
}

const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600'
};

export const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, label, value, color }) => {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                </div>
            </div>
        </div>
    );
};