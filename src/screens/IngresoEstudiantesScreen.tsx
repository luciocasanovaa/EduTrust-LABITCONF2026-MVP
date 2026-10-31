import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react';
import { UserRole } from '../types/edutrust';
import { NavigationTrigger } from '../utils/edutrustLogic';

interface IngresoEstudiantesScreenProps {
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onLoginAsRole: (role: UserRole) => void;
}

export function IngresoEstudiantesScreen({
  onNavigateTrigger,
  onLoginAsRole,
}: IngresoEstudiantesScreenProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('alumno');
  const [emailInput, setEmailInput] = useState('');
  const [credentialInput, setCredentialInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleRoleSwitch = (role: UserRole) => {
    setSelectedRole(role);
    setEmailInput('');
    setCredentialInput('');
    setFormError(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim();
    const trimmedCode = credentialInput.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setFormError('Ingresá un correo electrónico institucional o corporativo válido.');
      return;
    }
    if (trimmedCode.length < 4) {
      setFormError(
        selectedRole === 'alumno'
          ? 'Ingresá tu número de legajo universitario (mínimo 4 caracteres).'
          : selectedRole === 'donador'
            ? 'Ingresá tu código de entidad donante o CUIT.'
            : 'Ingresá tu clave de secretaría académica habilitada.',
      );
      return;
    }

    setFormError(null);
    if (selectedRole === 'alumno') {
      onNavigateTrigger('form-institutional-login');
    } else {
      onLoginAsRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Clean unauthenticated Top Bar with ZERO cross-portal leakage */}
      <header className="w-full border-b border-slate-200/80 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#inicio"
            onClick={(e) => e.preventDefault()}
            className="text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span>EduTrust Fintech</span>
          </a>

          <nav
            aria-label="Selección rápida de perfil"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475467]"
          >
            <button
              type="button"
              onClick={() => handleRoleSwitch('alumno')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedRole === 'alumno' ? 'text-[#2B59FF] font-semibold' : 'hover:text-[#0F172A]'
              }`}
            >
              Perfil Alumno
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('donador')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedRole === 'donador' ? 'text-[#2B59FF] font-semibold' : 'hover:text-[#0F172A]'
              }`}
            >
              Perfil Donador
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch('institucion')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedRole === 'institucion'
                  ? 'text-[#2B59FF] font-semibold'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Perfil Institución
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <span className="text-xs font-medium text-[#475467] whitespace-nowrap">
              Acceso por rol independiente
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center py-8 md:py-14 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Column: Clear Explanation of the 3 Isolated Profiles */}
          <section className="lg:col-span-7 flex flex-col justify-between py-2">
            <div>
              <p className="text-xs font-semibold text-[#2B59FF] tracking-wide mb-3">
                Programa Becas Ingeniería 2026 · Entornos Separados por Rol
              </p>
              <h1
                className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#0F172A] leading-[1.15] tracking-[-0.03em] mb-5 max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                Cada participante accede únicamente a su propio entorno operativo
              </h1>
              <p className="text-base text-[#475467] leading-relaxed max-w-xl mb-8">
                Elegí el perfil con el que querés operar. Los accesos están estrictamente separados entre estudiantes becarios, entidades donadoras y secretarías académicas universitarias.
              </p>

              {/* 3 Interactive Profile Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => handleRoleSwitch('alumno')}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedRole === 'alumno'
                      ? 'bg-white border-[#2B59FF] ring-2 ring-[#2B59FF]/15 shadow-sm'
                      : 'card-ambient hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#EFF4FF] text-[#2B59FF] flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">1. Alumno</div>
                  <p className="text-xs text-[#475467] mt-1 leading-relaxed">
                    Consulta su beca en USDT, retira dinero a su banco y postula a ofertas laborales.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('donador')}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedRole === 'donador'
                      ? 'bg-white border-[#2B59FF] ring-2 ring-[#2B59FF]/15 shadow-sm'
                      : 'card-ambient hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center mb-3">
                    <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">2. Donador</div>
                  <p className="text-xs text-[#475467] mt-1 leading-relaxed">
                    Aporta fondos a la bóveda, audita el destino del capital y conecta con talento becado.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSwitch('institucion')}
                  className={`text-left p-5 rounded-2xl border transition-all cursor-pointer ${
                    selectedRole === 'institucion'
                      ? 'bg-white border-[#2B59FF] ring-2 ring-[#2B59FF]/15 shadow-sm'
                      : 'card-ambient hover:border-slate-300'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FEF0C7] text-[#B54708] flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">3. Institución</div>
                  <p className="text-xs text-[#475467] mt-1 leading-relaxed">
                    Únicamente sube las notas oficiales de las materias para liberar el dinero al alumno.
                  </p>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#475467]">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#0F172A]">
                <ShieldCheck className="w-4 h-4 text-[#12B76A]" aria-hidden="true" />
                Permisos segregados por perfil
              </span>
              <span aria-hidden="true">·</span>
              <span>UTN · UBA FIUBA · UNC · UNLP · ITBA</span>
              <span aria-hidden="true">·</span>
              <span>Ciclo Lectivo 2026</span>
            </div>
          </section>

          {/* Right Column: Role-Specific Login Card */}
          <section className="lg:col-span-5 flex flex-col justify-center">
            <div className="card-ambient p-6 sm:p-8 w-full">
              {/* Role Segmented Tabs */}
              <div
                role="tablist"
                aria-label="Seleccionar perfil de acceso"
                className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-6"
              >
                {(
                  [
                    { id: 'alumno', label: 'Alumno' },
                    { id: 'donador', label: 'Donador' },
                    { id: 'institucion', label: 'Institución' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedRole === tab.id}
                    onClick={() => handleRoleSwitch(tab.id)}
                    className={`h-9 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      selectedRole === tab.id
                        ? 'bg-white text-[#0F172A] shadow-xs'
                        : 'text-[#475467] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {selectedRole === 'alumno' && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF4FF] text-[#2B59FF] flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
                        Ingreso de Estudiantes
                      </h2>
                      <p className="text-xs text-[#475467]">
                        Acceso exclusivo a tu billetera de beca y perfil laboral
                      </p>
                    </div>
                  </div>

                  {/* Exact Prototype Spec IDs preserved for Alumno */}
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
                </>
              )}

              {selectedRole === 'donador' && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
                        Ingreso de Donadores
                      </h2>
                      <p className="text-xs text-[#475467]">
                        Acceso exclusivo a aportes, auditoría de fondos y talento
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      id="btn-donor-auth"
                      type="button"
                      onClick={() => onLoginAsRole('donador')}
                      className="w-full h-12 px-4 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <span>Ingresar como Entidad Donadora</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}

              {selectedRole === 'institucion' && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#FEF0C7] text-[#B54708] flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-[#0F172A] tracking-tight">
                        Ingreso de Institución
                      </h2>
                      <p className="text-xs text-[#475467]">
                        Acceso exclusivo para carga oficial de notas académicas
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <button
                      id="btn-institution-auth"
                      type="button"
                      onClick={() => onLoginAsRole('institucion')}
                      className="w-full h-12 px-4 rounded-[10px] bg-[#12B76A] hover:bg-[#0E9F5A] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      <span>Ingresar a Carga de Notas (Secretaría)</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}

              <div className="relative flex items-center py-2 mb-5">
                <div className="grow border-t border-slate-200" />
                <span className="shrink-0 mx-3 text-xs text-[#64748B]">
                  o validá tus credenciales manuales
                </span>
                <div className="grow border-t border-slate-200" />
              </div>

              {/* Manual Credentials Form with Validation */}
              <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="role-email-input"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    {selectedRole === 'alumno'
                      ? 'Correo universitario (.edu.ar / institucional)'
                      : selectedRole === 'donador'
                        ? 'Correo corporativo de la entidad aportante'
                        : 'Correo oficial de Secretaría Académica'}
                  </label>
                  <input
                    id="role-email-input"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder={
                      selectedRole === 'alumno'
                        ? 'lfernandez@frba.utn.edu.ar'
                        : selectedRole === 'donador'
                          ? 'aportes@fundaciontechint.org'
                          : 'actas@frba.utn.edu.ar'
                    }
                    className="w-full h-12 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2B59FF] focus:ring-4 focus:ring-[#2B59FF]/15 transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role-credential-input"
                    className="block text-xs font-semibold text-[#0F172A] mb-1.5"
                  >
                    {selectedRole === 'alumno'
                      ? 'Número de Legajo SIU'
                      : selectedRole === 'donador'
                        ? 'Código de Donador / CUIT'
                        : 'Código de Universidad Habilitada'}
                  </label>
                  <input
                    id="role-credential-input"
                    type="text"
                    value={credentialInput}
                    onChange={(e) => {
                      setCredentialInput(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder={
                      selectedRole === 'alumno'
                        ? 'UTN-2023-18492'
                        : selectedRole === 'donador'
                          ? 'DON-ESG-2026'
                          : 'SIU-UTN-FRBA'
                    }
                    className="w-full h-12 px-3.5 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] placeholder:text-[#98A2B3] focus:outline-none focus:border-[#2B59FF] focus:ring-4 focus:ring-[#2B59FF]/15 transition-all tnum"
                  />
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/50 px-3 py-2 rounded-lg"
                  >
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full h-12 px-4 rounded-[10px] bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] border border-slate-200/90 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <span>Validar e ingresar al perfil</span>
                  <ArrowRight className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2.5 text-xs text-[#475467]">
                <CheckCircle2 className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  {selectedRole === 'alumno'
                    ? 'Solo verás tu billetera estudiantil, retiros bancarios y ofertas laborales.'
                    : selectedRole === 'donador'
                      ? 'Solo verás la bóveda de donaciones, trazabilidad del programa y talento becado.'
                      : 'Solo verás el módulo oficial para subir notas de materias y activar desembolsos.'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
