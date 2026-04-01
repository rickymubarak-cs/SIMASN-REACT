// src/components/common/StatusBadge.tsx
import React from 'react';
import {
    Send, CheckCircle, RotateCcw, Ban, FileCheck,
    Shield, ShieldCheck, ShieldAlert, Clock, AlertTriangle,
    Wifi, WifiOff, RefreshCcw, XCircle, Circle,
    Database, Server, Cloud, Link, Link2, Unlink
} from 'lucide-react';

// ============================================
// KONFIGURASI STATUS UNTUK LAYANAN PELAYANAN
// ============================================
const layananStatusConfig: Record<string, { icon: any; label: string; color: string }> = {
    pengajuan: { icon: Send, label: 'Pengajuan', color: 'blue' },
    diterima: { icon: CheckCircle, label: 'Diterima', color: 'green' },
    perbaikan: { icon: RotateCcw, label: 'Perbaikan', color: 'orange' },
    ditolak: { icon: Ban, label: 'Ditolak', color: 'red' },
    selesai: { icon: FileCheck, label: 'Selesai', color: 'emerald' },
    proses: { icon: RefreshCcw, label: 'Proses', color: 'blue' }
};

// ============================================
// KONFIGURASI STATUS UNTUK API BKN (TOKEN, INTEGRASI, ETC)
// ============================================
const bknStatusConfig: Record<string, { icon: any; label: string; color: string }> = {
    // Status Token
    token_active: { icon: ShieldCheck, label: 'Token Aktif', color: 'green' },
    token_expired: { icon: ShieldAlert, label: 'Token Expired', color: 'red' },
    token_none: { icon: Shield, label: 'Token Tidak Ada', color: 'gray' },

    // Status Koneksi
    connected: { icon: Wifi, label: 'Terhubung', color: 'green' },
    partially_connected: { icon: Link, label: 'Sebagian Terhubung', color: 'orange' },
    disconnected: { icon: WifiOff, label: 'Tidak Terhubung', color: 'red' },

    // Status Integrasi
    synced: { icon: RefreshCcw, label: 'Tersinkron', color: 'green' },
    syncing: { icon: RefreshCcw, label: 'Menyinkronkan...', color: 'blue' },
    sync_failed: { icon: XCircle, label: 'Sinkron Gagal', color: 'red' },

    // Status Data
    data_available: { icon: Database, label: 'Data Tersedia', color: 'green' },
    data_loading: { icon: Server, label: 'Memuat Data...', color: 'blue' },
    data_empty: { icon: Database, label: 'Data Kosong', color: 'gray' },

    // Status API
    api_online: { icon: Cloud, label: 'API Online', color: 'green' },
    api_offline: { icon: Cloud, label: 'API Offline', color: 'red' },
    api_error: { icon: AlertTriangle, label: 'API Error', color: 'red' }
};

// ============================================
// KONFIGURASI WARNA
// ============================================
const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    gray: 'bg-gray-50 text-gray-600 border-gray-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200'
};

interface StatusBadgeProps {
    status: string;
    type?: 'layanan' | 'bkn' | 'token' | 'integration';
    size?: 'sm' | 'md' | 'lg';
    showIcon?: boolean;
}

const sizeClasses = {
    sm: 'px-2 py-0.5 text-[8px] gap-1',
    md: 'px-2.5 py-1 text-[10px] gap-1.5',
    lg: 'px-3 py-1.5 text-xs gap-2'
};

const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    type = 'layanan',
    size = 'md',
    showIcon = true
}) => {
    // Pilih konfigurasi berdasarkan type
    let config;

    if (type === 'layanan') {
        config = layananStatusConfig[status] || layananStatusConfig.pengajuan;
    } else {
        // Untuk type 'bkn', 'token', 'integration', gunakan bknStatusConfig
        config = bknStatusConfig[status] || bknStatusConfig.disconnected;
    }

    const IconComponent = config.icon;
    const colorClass = colorClasses[config.color as keyof typeof colorClasses] || colorClasses.gray;
    const sizeClass = sizeClasses[size];
    const iconSize = iconSizes[size];

    return (
        <span className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider border ${colorClass} ${sizeClass}`}>
            {showIcon && <IconComponent size={iconSize} />}
            <span>{config.label}</span>
        </span>
    );
};

// ============================================
// KOMPONEN KHUSUS UNTUK STATUS INTEGRASI
// ============================================
interface IntegrationStatusProps {
    oauthActive: boolean;
    ssoActive: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const IntegrationStatus: React.FC<IntegrationStatusProps> = ({
    oauthActive,
    ssoActive,
    size = 'md'
}) => {
    if (oauthActive && ssoActive) {
        return <StatusBadge status="connected" type="bkn" size={size} />;
    } else if (oauthActive || ssoActive) {
        return <StatusBadge status="partially_connected" type="bkn" size={size} />;
    }
    return <StatusBadge status="disconnected" type="bkn" size={size} />;
};

// ============================================
// KOMPONEN KHUSUS UNTUK STATUS TOKEN
// ============================================
interface TokenStatusProps {
    isActive: boolean;
    expiresAt?: string | null;
    size?: 'sm' | 'md' | 'lg';
}

export const TokenStatus: React.FC<TokenStatusProps> = ({
    isActive,
    expiresAt,
    size = 'md'
}) => {
    if (isActive) {
        return (
            <div className="flex items-center gap-2">
                <StatusBadge status="token_active" type="bkn" size={size} />
                {expiresAt && (
                    <span className="text-xs text-slate-400 font-mono">
                        Exp: {new Date(expiresAt).toLocaleDateString()}
                    </span>
                )}
            </div>
        );
    }
    return <StatusBadge status="token_expired" type="bkn" size={size} />;
};

// ============================================
// KOMPONEN KHUSUS UNTUK STATUS API
// ============================================
interface ApiStatusProps {
    isOnline: boolean;
    lastCheck?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ApiStatus: React.FC<ApiStatusProps> = ({
    isOnline,
    lastCheck,
    size = 'md'
}) => {
    return (
        <div className="flex items-center gap-2">
            <StatusBadge
                status={isOnline ? 'api_online' : 'api_offline'}
                type="bkn"
                size={size}
            />
            {lastCheck && (
                <span className="text-xs text-slate-400">
                    Last check: {new Date(lastCheck).toLocaleTimeString()}
                </span>
            )}
        </div>
    );
};

export default StatusBadge;