// src/components/pegawai/PegawaiInfo.tsx
import React, { useState } from 'react';
import { User, FileText, FileCheck, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { DataASN } from '../../types';
import { formatDate, formatGender } from '../../utils/formatters';

interface PegawaiInfoProps {
    data: DataASN;
}

export const PegawaiInfo: React.FC<PegawaiInfoProps> = ({ data }) => {
    const [expandedSections, setExpandedSections] = useState({
        profile: true,
        dokumen: false,
        sk: false,
        instansi: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const SectionCard: React.FC<{
        title: string;
        icon: React.ReactNode;
        isExpanded: boolean;
        onToggle: () => void;
        children: React.ReactNode;
    }> = ({ title, icon, isExpanded, onToggle, children }) => (
        <div className="border rounded-xl overflow-hidden">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <span className="font-semibold text-slate-700 flex items-center gap-2">
                    {icon}
                    {title}
                </span>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {isExpanded && <div className="p-4">{children}</div>}
        </div>
    );

    const InfoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
        <div>
            <label className="text-xs text-slate-400">{label}</label>
            <p className="font-medium text-slate-700">{value || '-'}</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {/* Identitas Pribadi */}
            <SectionCard
                title="Identitas Pribadi"
                icon={<User size={18} className="text-indigo-600" />}
                isExpanded={expandedSections.profile}
                onToggle={() => toggleSection('profile')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="NIP Baru" value={data.nipBaru || data.nip} />
                    <InfoField label="Nama Lengkap" value={data.nama} />
                    <InfoField label="Gelar Belakang" value={data.gelarBelakang} />
                    <InfoField label="Tempat, Tanggal Lahir" value={`${data.tempatLahir || '-'}, ${formatDate(data.tglLahir)}`} />
                    <InfoField label="Jenis Kelamin" value={formatGender(data.jenisKelamin)} />
                    <InfoField label="Agama" value={data.agama} />
                    <InfoField label="Email" value={data.email} />
                    <InfoField label="Email Pemerintah" value={data.emailGov} />
                    <InfoField label="No. HP" value={data.noHp} />
                    <InfoField label="Alamat" value={data.alamat} />
                </div>
            </SectionCard>

            {/* Dokumen Kepegawaian */}
            <SectionCard
                title="Dokumen Kepegawaian"
                icon={<FileText size={18} className="text-indigo-600" />}
                isExpanded={expandedSections.dokumen}
                onToggle={() => toggleSection('dokumen')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Nomor Karpeg" value={data.noSeriKarpeg} />
                    <InfoField label="Nomor Taspen" value={data.noTaspen} />
                    <InfoField label="NPWP" value={data.noNpwp} />
                    <InfoField label="BPJS" value={data.bpjs} />
                    <InfoField label="Kartu ASN" value={data.kartuAsn} />
                </div>
            </SectionCard>

            {/* SK CPNS & PNS */}
            <SectionCard
                title="SK CPNS & PNS"
                icon={<FileCheck size={18} className="text-indigo-600" />}
                isExpanded={expandedSections.sk}
                onToggle={() => toggleSection('sk')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="No. SK CPNS" value={data.nomorSkCpns} />
                    <InfoField label="Tgl SK CPNS" value={formatDate(data.tglSkCpns)} />
                    <InfoField label="TMT CPNS" value={formatDate(data.tmtCpns)} />
                    <InfoField label="No. SK PNS" value={data.nomorSkPns} />
                </div>
            </SectionCard>

            {/* Instansi & Jabatan */}
            <SectionCard
                title="Instansi & Jabatan"
                icon={<Building size={18} className="text-indigo-600" />}
                isExpanded={expandedSections.instansi}
                onToggle={() => toggleSection('instansi')}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <InfoField label="Instansi Kerja" value={data.instansiKerjaNama} />
                    <InfoField label="Satuan Kerja" value={data.satuanKerjaKerjaNama} />
                    <InfoField label="Unit Organisasi" value={data.unorNama} />
                    <InfoField label="Jabatan" value={data.jabatanNama} />
                    <InfoField label="Golongan / Pangkat" value={`${data.golRuangAkhir || '-'} - ${data.pangkatAkhir || '-'}`} />
                    <InfoField label="Eselon" value={data.eselon} />
                    <InfoField label="TMT Jabatan" value={formatDate(data.tmtJabatan)} />
                    <InfoField label="TMT Golongan" value={formatDate(data.tmtGolAkhir)} />
                </div>
            </SectionCard>
        </div>
    );
};