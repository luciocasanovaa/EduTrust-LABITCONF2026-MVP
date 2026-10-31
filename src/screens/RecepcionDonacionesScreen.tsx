import React, { useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  FileSpreadsheet,
  Landmark,
  LogOut,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { DonationRecord, DonorCategory, ScreenId } from '../types/edutrust';
import { NavigationTrigger, validateAndCreateDonation } from '../utils/edutrustLogic';

interface RecepcionDonacionesScreenProps {
  donations: DonationRecord[];
  allocatedEngineeringUsdt: number;
  onRegisterDonation: (record: DonationRecord) => void;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onDonorScreenSelect: (screen: ScreenId) => void;
  onLogout: () => void;
}

export function RecepcionDonacionesScreen({
  donations,
  allocatedEngineeringUsdt,
  onRegisterDonation,
  onNavigateTrigger,
  onDonorScreenSelect,
  onLogout,
}: RecepcionDonacionesScreenProps) {
  const [donorName, setDonorName] = useState('');
  const [category, setCategory] = useState<DonorCategory>('Aporte Corporativo ESG');
  const [programTarget, setProgramTarget] = useState('Programa Becas Ingeniería 2026');
  const [amountRaw, setAmountRaw] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'Todas' | DonorCategory>('Todas');

  const totalVaultCustody = donations.reduce((acc, d) => acc + d.amountUsdt, 87000);
  const unallocatedReserve = Math.max(0, totalVaultCustody - allocatedEngineeringUsdt);

  const visibleDonations =
    categoryFilter === 'Todas'
      ? donations
      : donations.filter((d) => d.category === categoryFilter);

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateAndCreateDonation(
      { donorName, category, programTarget, amountRaw },
      donations.length,
    );
    if (!res.valid) {
      setFormError(res.error);
      return;
    }

    onRegisterDonation(res.record);
    setDonorName('');
    setAmountRaw('');
    setFormError(null);
    setSuccessBanner(
      `Aporte certificado (${res.record.certificateId}): +$${res.record.amountUsdt.toLocaleString('es-AR')} USDT acreditados por ${res.record.donorName}.`,
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract with exact //nav//a[@data-path='programas-y-becas'] */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1360px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <a
            href="#recepcion-donaciones"
            onClick={(e) => e.preventDefault()}
            className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span>EduTrust Patrocinadores</span>
          </a>

          <nav
            aria-label="Navegación Entidad Receptora"
            className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#475467]"
          >
            <a
              href="#recepcion"
              onClick={(e) => e.preventDefault()}
              aria-current="page"
              className="text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF] py-5 whitespace-nowrap shrink-0"
            >
              Recepción y Donaciones
            </a>
            <a
              href="#programas-y-becas"
              data-path="programas-y-becas"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTrigger('nav-programas-y-becas');
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Programas y Becas
            </a>
            <a
              href="#portal-empresas"
              onClick={(e) => {
                e.preventDefault();
                onDonorScreenSelect(ScreenId.BusquedaTalento);
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Talento Becado
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-[#475467]" aria-hidden="true" />
              <span>Cambiar perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Body: Visible <aside> + <main> */}
      <div className="flex-1 max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Sidebar (<aside> with exact //aside//a[@data-path='asignacion-a-programas']) */}
        <aside
          aria-label="Menú de tesorería y bóveda"
          className="lg:col-span-3 card-ambient p-4 space-y-4"
        >
          <div className="px-2 pt-1">
            <p className="text-xs font-semibold text-[#12B76A]">
              Entidad Fiduciaria
            </p>
            <h2 className="text-sm font-bold text-[#0F172A] mt-0.5">
              Fundación EduTrust STEM
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Custodia institucional auditada 1:1
            </p>
          </div>

          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="#boveda-recepcion"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#EFF4FF] text-[#2B59FF] font-semibold"
              >
                <Landmark className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Recepción y Donaciones</span>
              </a>
            </li>
            <li>
              <a
                href="#asignacion-a-programas"
                data-path="asignacion-a-programas"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateTrigger('aside-asignacion-a-programas');
                }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[#475467] hover:bg-slate-50 hover:text-[#0F172A] font-medium transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Asignación a Programas</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto text-[#64748B]" aria-hidden="true" />
              </a>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-100 px-2 text-xs text-[#475467] space-y-1.5">
            <p className="flex items-center gap-1.5 font-medium text-[#0F172A]">
              <ShieldCheck className="w-4 h-4 text-[#12B76A] shrink-0" aria-hidden="true" />
              Certificados fiscales Art. 81 inc. c
            </p>
            <p className="text-[11px] text-[#64748B]">
              Emisión automática al acreditarse la transferencia corporativa o stablecoin.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-6">
          <div>
            <p className="text-xs font-medium text-[#475467]">
              Tesorería Institucional y Suscripciones Corporativas
            </p>
            <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
              Recepción y Donaciones — Entidad Receptora
            </h1>
          </div>

          {successBanner && (
            <div
              role="status"
              className="px-4 py-3 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-sm font-medium flex items-center justify-between gap-4"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                {successBanner}
              </span>
              <button
                type="button"
                onClick={() => setSuccessBanner(null)}
                className="text-xs font-semibold underline cursor-pointer shrink-0"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* Vault Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tnum">
            <div className="wallet-gradient rounded-2xl p-5 text-white">
              <span className="text-xs font-medium text-blue-100">
                Custodia total en bóveda
              </span>
              <div className="text-2xl sm:text-3xl font-bold mt-1">
                ${totalVaultCustody.toLocaleString('es-AR')} <span className="text-sm font-semibold">USDT</span>
              </div>
              <span className="block text-[11px] text-blue-100 mt-1">
                Respaldo líquido 100% verificado
              </span>
            </div>

            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Asignado a Ingeniería 2026
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#12B76A] mt-1">
                ${allocatedEngineeringUsdt.toLocaleString('es-AR')} <span className="text-sm font-semibold">USDT</span>
              </div>
              <span className="block text-[11px] text-[#64748B] mt-1">
                64 becas activas financiadas
              </span>
            </div>

            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Reserva libre por asignar
              </span>
              <div className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">
                ${unallocatedReserve.toLocaleString('es-AR')} <span className="text-sm font-semibold text-[#64748B]">USDT</span>
              </div>
              <span className="block text-[11px] text-[#64748B] mt-1">
                {donations.length} aportes institucionales registrados
              </span>
            </div>
          </div>

          {/* Register New Donation / Corporate Contribution Form */}
          <section className="card-ambient p-6">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
                Registrar nuevo aporte o suscripción corporativa
              </h2>
              <p className="text-xs text-[#475467]">
                Acreditá fondos donados o planes anuales del Portal Empresas y asignalos directamente a un programa de becas.
              </p>
            </div>

            <form onSubmit={handleDonationSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end" noValidate>
              <div className="md:col-span-4">
                <label htmlFor="donor-entity-input" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Entidad aportante / Empresa
                </label>
                <input
                  id="donor-entity-input"
                  type="text"
                  value={donorName}
                  onChange={(e) => {
                    setDonorName(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Ej. Fundación YPF / Globant"
                  className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                />
              </div>

              <div className="md:col-span-3">
                <label htmlFor="donor-category-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Modalidad de ingreso
                </label>
                <select
                  id="donor-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DonorCategory)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                >
                  <option value="Aporte Corporativo ESG">Aporte Corporativo ESG</option>
                  <option value="Suscripción Portal Talento">Suscripción Portal Talento</option>
                  <option value="Donación Filantrópica">Donación Filantrópica</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label htmlFor="donor-program-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Destino de asignación
                </label>
                <select
                  id="donor-program-select"
                  value={programTarget}
                  onChange={(e) => setProgramTarget(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                >
                  <option value="Programa Becas Ingeniería 2026">Programa Becas Ingeniería 2026</option>
                  <option value="Reserva General STEM 2026">Reserva General STEM 2026</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="donor-amount-input" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
                  Monto (USDT)
                </label>
                <input
                  id="donor-amount-input"
                  type="number"
                  min="100"
                  step="100"
                  value={amountRaw}
                  onChange={(e) => {
                    setAmountRaw(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="15000"
                  className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] tnum focus:outline-none focus:border-[#2B59FF]"
                />
              </div>

              {formError && (
                <div className="md:col-span-12">
                  <p role="alert" className="text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/60 px-3.5 py-2 rounded-lg">
                    {formError}
                  </p>
                </div>
              )}

              <div className="md:col-span-12 flex justify-end">
                <button
                  type="submit"
                  className="h-11 px-5 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap"
                >
                  Certificar y acreditar en bóveda
                </button>
              </div>
            </form>
          </section>

          {/* Certified Donations Ledger */}
          <section className="card-ambient overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Libro mayor de aportes recibidos
                </h2>
                <p className="text-xs text-[#475467]">
                  Trazabilidad completa desde el aportante hasta la billetera del estudiante
                </p>
              </div>

              <div
                role="group"
                aria-label="Filtrar aportes por modalidad"
                className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
              >
                {(
                  [
                    'Todas',
                    'Aporte Corporativo ESG',
                    'Suscripción Portal Talento',
                    'Donación Filantrópica',
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#475467] hover:text-[#0F172A]'
                    }`}
                  >
                    {cat === 'Todas' ? 'Todos' : cat.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-[#F8FAFC] text-[11px] font-semibold text-[#475467]">
                    <th className="py-3 px-4">Entidad aportante</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Programa destino</th>
                    <th className="py-3 px-4">Certificado</th>
                    <th className="py-3 px-4 text-right">Monto acreditado</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm tnum">
                  {visibleDonations.map((don) => (
                    <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                        {don.donorName}
                        <span className="block text-xs font-normal text-[#64748B]">
                          {don.date}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#475467]">{don.category}</td>
                      <td className="py-3.5 px-4 text-[#0F172A]">{don.programTarget}</td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#475467] whitespace-nowrap">
                        {don.certificateId}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#12B76A] whitespace-nowrap">
                        +${don.amountUsdt.toLocaleString('es-AR')} USDT
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] whitespace-nowrap">
                          {don.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
