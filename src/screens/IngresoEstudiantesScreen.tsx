import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, GraduationCap, ShieldCheck } from 'lucide-react';
import { ScreenId } from '../types/edutrust';
import { NavigationTrigger } from '../utils/edutrustLogic';

interface IngresoEstudiantesScreenProps {
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onDirectScreenSelect: (screen: ScreenId) => void;
}

export function IngresoEstudiantesScreen({
  onNavigateTrigger,
  onDirectScreenSelect,
}: IngresoEstudiantesScreenProps) {
  const [institutionalEmail, setInstitutionalEmail] = useState('');
  const [legajo, setLegajo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleInstitutionalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = institutionalEmail.trim();
    const trimmedLegajo = legajo.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setFormError('Ingresá tu correo institucional válido (ej. nombre@frba.utn.edu.ar).');
      return;
    }
    if (trimmedLegajo.length < 4) {
      setFormError('Ingresá tu número de legajo universitario para validar tu identidad.');
      return;
    }

    setFormError(null);
    onNavigateTrigger('form-institutional-login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Clean 3-zone top bar */}
      <header className="w-full border-b border-slate-200/80 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#ingreso"
            onClick={(e) => e.preventDefault()}
            className="text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span>EduTrust Fintech</span>
          </a>

          <nav
            aria-label="Portales de la plataforma"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475467]"
          >
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.PanelAuditoria)}
              className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Panel de Auditoría
            </button>
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.BusquedaTalento)}
              className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Portal Empresas
            </button>
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.RecepcionDonaciones)}
              className="hover:text-[#0F172A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Entidad Receptora
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.PanelAuditoria)}
              className="px-3.5 py-2 text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Acceso Institucional
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center py-8 md:py-14 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Value Proposition & Verified Metrics */}
          <section className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-[#2B59FF] tracking-wide mb-3">
                Convocatoria Ingeniería 2026 · Acreditación Automática
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] leading-[1.14] tracking-[-0.03em] mb-5 max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                Tu mérito académico acreditado en dólares digitales al instante
              </h1>
              <p className="text-base text-[#475467] leading-relaxed max-w-xl mb-8">
                Sincronizamos tus actas universitarias aprobadas para liberar estipendios y premios por materia directamente en tu billetera estudiantil, sin demoras administrativas ni comisiones bancarias.
              </p>

              {/* Key Proof Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="card-ambient p-5">
                  <div className="text-2xl font-bold text-[#0F172A] tnum tracking-tight">
                    $0.00
                  </div>
                  <div className="text-xs text-[#475467] mt-1">
                    Costo de mantenimiento y retiro bancario inmediato
                  </div>
                </div>
                <div className="card-ambient p-5">
                  <div className="text-2xl font-bold text-[#12B76A] tnum tracking-tight">
                    &lt; 2 min
                  </div>
                  <div className="text-xs text-[#475467] mt-1">
                    Liquidación directa de USDT a CBU o CVU local
                  </div>
                </div>
                <div className="card-ambient p-5">
                  <div className="text-2xl font-bold text-[#2B59FF] tnum tracking-tight">
                    18 Univ.
                  </div>
                  <div className="text-xs text-[#475467] mt-1">
                    Conectadas al validador académico SIU-Guaraní
                  </div>
                </div>
              </div>
            </div>

            {/* Institutional Trust Footer inside Hero */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#475467]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#0F172A]">
                <ShieldCheck className="w-4 h-4 text-[#12B76A]" aria-hidden="true" />
                Fondos auditados en bóveda fiduciaria
              </span>
              <span aria-hidden="true">·</span>
              <span>UTN · UBA FIUBA · UNC · UNLP · ITBA</span>
              <span aria-hidden="true">·</span>
              <span>Ciclo Lectivo 2026</span>
            </div>
          </section>

          {/* Right Column: Student Authentication Card */}
          <section className="lg:col-span-5 flex flex-col justify-center">
            <div className="card-ambient p-6 sm:p-8 w-full">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#2B59FF] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
                    Ingreso de Estudiantes
                  </h2>
                  <p className="text-xs text-[#475467]">
                    Accedé con tu cuenta institucional verificada
                  </p>
                </div>
              </div>

              {/* Primary SSO Buttons matching exact XPath IDs */}
              <div className="space-y-3 mb-6">
                <button
                  id="btn-google-auth"
                  type="button"
                  onClick={() => onNavigateTrigger('btn-google-auth')}
                  className="w-full h-12 px-4 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  <span>Continuar con Google Institucional</span>
                </button>

                <button
                  id="btn-apple-auth"
                  type="button"
                  onClick={() => onNavigateTrigger('btn-apple-auth')}
                  className="w-full h-12 px-4 rounded-[10px] bg-[#0F172A] hover:bg-[#1E293B] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer whitespace-nowrap"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                  <span>Continuar con Apple ID</span>
                </button>
              </div>

              <div className="relative flex items-center py-2 mb-5">
                <div className="grow border-t border-slate-200" />
                <span className="shrink-0 mx-3 text-xs text-[#64748B]">
                  o ingresá con tu legajo académico
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Validated Institutional Login Form */}
              <form onSubmit={handleInstitutionalSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="student-email"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Correo universitario (.edu.ar / institucional)
                  </label>
                  <input
                    id="student-email"
                    type="email"
                    value={institutionalEmail}
                    onChange={(e) => {
                      setInstitutionalEmail(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="lfernandez@frba.utn.edu.ar"
                    className="w-full h-12 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2B59FF] focus:ring-4 focus:ring-[#2B59FF]/15 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="student-legajo"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    Número de Legajo SIU
                  </label>
                  <input
                    id="student-legajo"
                    type="text"
                    value={legajo}
                    onChange={(e) => {
                      setLegajo(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="UTN-2023-18492"
                    className="w-full h-12 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2B59FF] focus:ring-4 focus:ring-[#2B59FF]/15 transition-all tnum"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/50 px-3 py-2 rounded-lg">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full h-12 px-4 rounded-[10px] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-slate-200/90 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Validar legajo e ingresar</span>
                  <ArrowRight className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-[#475467]">
                <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Tus credenciales se validan directamente con el padrón oficial del Programa Becas Ingeniería 2026.
                </span>
              </div>

              {/* Mobile quick access to institutional screens */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex md:hidden flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#64748B]">Portales institucionales:</span>
                <div className="flex items-center gap-3 font-semibold text-[#2B59FF]">
                  <button
                    type="button"
                    onClick={() => onDirectScreenSelect(ScreenId.PanelAuditoria)}
                    className="underline-offset-2 hover:underline cursor-pointer"
                  >
                    Auditoría
                  </button>
                  <button
                    type="button"
                    onClick={() => onDirectScreenSelect(ScreenId.BusquedaTalento)}
                    className="underline-offset-2 hover:underline cursor-pointer"
                  >
                    Empresas
                  </button>
                  <button
                    type="button"
                    onClick={() => onDirectScreenSelect(ScreenId.RecepcionDonaciones)}
                    className="underline-offset-2 hover:underline cursor-pointer"
                  >
                    Donaciones
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
