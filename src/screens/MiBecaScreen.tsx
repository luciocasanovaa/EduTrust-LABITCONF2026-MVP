import React, { useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpRight,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import { ARS_EXCHANGE_RATE } from '../data/seedData';
import {
  BankAccount,
  CourseRecord,
  CourseStatus,
  ScreenId,
  TransactionRecord,
} from '../types/edutrust';
import {
  calculateAcademicSummary,
  NavigationTrigger,
} from '../utils/edutrustLogic';

interface MiBecaScreenProps {
  studentName: string;
  cohort: string;
  availableUsdt: number;
  totalWithdrawnUsdt: number;
  courses: CourseRecord[];
  transactions: TransactionRecord[];
  primaryAccount: BankAccount;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onQuickWithdrawConfirm: (amountUsdt: number) => void;
  onSyncPendingCourse: (courseId: string) => void;
  onDirectScreenSelect: (screen: ScreenId) => void;
}

export function MiBecaScreen({
  studentName,
  cohort,
  availableUsdt,
  totalWithdrawnUsdt,
  courses,
  transactions,
  primaryAccount,
  onNavigateTrigger,
  onQuickWithdrawConfirm,
  onSyncPendingCourse,
  onDirectScreenSelect,
}: MiBecaScreenProps) {
  const [courseFilter, setCourseFilter] = useState<'Todas' | CourseStatus>('Todas');
  const [quickAmount, setQuickAmount] = useState<number>(100);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const summary = calculateAcademicSummary(courses);
  const localArsEquivalent = Math.round(availableUsdt * ARS_EXCHANGE_RATE);

  const effectiveQuickAmount =
    availableUsdt >= quickAmount
      ? quickAmount
      : availableUsdt >= 10
        ? Number(availableUsdt.toFixed(2))
        : 0;

  const filteredCourses =
    courseFilter === 'Todas'
      ? courses
      : courses.filter((c) => c.status === courseFilter);

  const handleSyncClick = (course: CourseRecord) => {
    onSyncPendingCourse(course.id);
    setSyncFeedback(
      `Acta verificada: ${course.code} (${course.name}) acreditó +$${course.rewardUsdt.toFixed(2)} USDT en tu billetera.`,
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract: Single unified visible <nav> across mobile & desktop */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <a
            href="#mi-beca"
            onClick={(e) => e.preventDefault()}
            className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span className="hidden sm:inline">EduTrust</span>
          </a>

          <nav
            aria-label="Navegación principal del becario"
            className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#475467]"
          >
            <a
              href="#mi-beca"
              data-path="mi-beca"
              onClick={(e) => e.preventDefault()}
              aria-current="page"
              className="text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF] py-5 whitespace-nowrap shrink-0"
            >
              Mi beca
            </a>
            <a
              href="#perfil"
              data-path="perfil"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTrigger('nav-perfil');
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Perfil
            </a>
            <a
              href="#ofertas"
              data-path="ofertas"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTrigger('nav-ofertas');
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Ofertas
            </a>
            <a
              href="#panel-auditoria"
              onClick={(e) => {
                e.preventDefault();
                onDirectScreenSelect(ScreenId.PanelAuditoria);
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0 text-[#64748B]"
            >
              Auditoría
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.IngresoEstudiantes)}
              className="px-3 py-1.5 text-xs font-semibold text-[#475467] hover:text-[#0F172A] bg-[#F8FAFC] border border-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <p className="text-xs font-medium text-[#475467]">
              {cohort} · Beneficiaria activa
            </p>
            <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
              Hola, {studentName.split(' ')[0]}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#475467] tnum">
            <span>Promedio verificado: <strong className="text-[#0F172A]">{summary.averageGrade.toFixed(2)}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Materias aprobadas: <strong className="text-[#12B76A]">{summary.approvedCount}/{courses.length}</strong></span>
          </div>
        </div>

        {syncFeedback && (
          <div
            role="status"
            className="mb-6 px-4 py-3 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-sm font-medium flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {syncFeedback}
            </span>
            <button
              type="button"
              onClick={() => setSyncFeedback(null)}
              className="text-xs font-semibold underline cursor-pointer shrink-0"
            >
              Ocultar
            </button>
          </div>
        )}

        {/* Top 2-Column Fintech Balance + Quick Express Withdrawal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-stretch">
          {/* Primary Wallet Balance Card */}
          <section className="lg:col-span-7 wallet-gradient rounded-2xl p-6 md:p-7 text-white shadow-lg shadow-[#2B59FF]/15 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-semibold tracking-wide text-blue-100 flex items-center gap-2">
                  <Wallet className="w-4 h-4" aria-hidden="true" />
                  Saldo disponible en Billetera Beca
                </span>
                <span className="text-xs font-mono text-blue-100 tnum">
                  1 USDT = ${ARS_EXCHANGE_RATE.toLocaleString('es-AR')} ARS
                </span>
              </div>

              <div className="text-4xl md:text-[44px] font-bold tracking-[-0.03em] leading-none tnum mb-2">
                ${availableUsdt.toFixed(2)} <span className="text-lg font-semibold text-blue-100">USDT</span>
              </div>
              <p className="text-sm text-blue-100 tnum">
                Equivalente hoy: <strong>${localArsEquivalent.toLocaleString('es-AR')} ARS</strong> · Liquidación inmediata 24/7
              </p>
            </div>

            <div className="mt-7 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-xs text-blue-100 tnum">
                <div>
                  <span className="block text-blue-200">Ganado este ciclo</span>
                  <strong className="text-sm text-white font-semibold">+${summary.earnedUsdt.toFixed(2)} USDT</strong>
                </div>
                <div>
                  <span className="block text-blue-200">En verificación</span>
                  <strong className="text-sm text-white font-semibold">${summary.pendingUsdt.toFixed(2)} USDT</strong>
                </div>
                <div>
                  <span className="block text-blue-200">Ya retirado</span>
                  <strong className="text-sm text-white font-semibold">${totalWithdrawnUsdt.toFixed(2)} USDT</strong>
                </div>
              </div>

              <button
                id="btn-retirar"
                type="button"
                onClick={() => onNavigateTrigger('btn-retirar')}
                className="h-12 px-5 rounded-[10px] bg-[#12B76A] hover:bg-[#0E9F5A] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Retirar a mi cuenta</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </section>

          {/* Express 1-Click Withdrawal Module (exposes #btn-confirmar-retiro directly) */}
          <section className="lg:col-span-5 card-ambient p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Retiro rápido a cuenta principal
                </h2>
                <span className="text-xs font-medium text-[#12B76A] tnum whitespace-nowrap shrink-0">
                  Comisión $0
                </span>
              </div>
              <p className="text-xs text-[#475467] mb-4">
                Transferí en un toque hacia tu cuenta bancaria verificada sin completar formularios adicionales.
              </p>

              {/* Destination Account Summary */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#2B59FF] shrink-0">
                    <Building2 className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0F172A] truncate">
                      {primaryAccount.bankName} · {primaryAccount.alias}
                    </div>
                    <div className="text-[11px] text-[#475467] font-mono tnum">
                      {primaryAccount.maskedIdentifier}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#027A48] bg-[#ECFDF3] border border-[#A6F4C5] px-2.5 py-0.5 rounded-full shrink-0">
                  Verificada
                </span>
              </div>

              {/* Amount Presets */}
              <div className="mb-4">
                <span className="block text-xs font-medium text-[#475467] mb-2">
                  Monto rápido a acreditar
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 200].map((preset) => {
                    const disabled = availableUsdt < preset;
                    const active = quickAmount === preset;
                    return (
                      <button
                        key={preset}
                        type="button"
                        disabled={disabled}
                        onClick={() => setQuickAmount(preset)}
                        className={`h-10 rounded-lg text-xs font-semibold tnum transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#EFF4FF] border border-[#2B59FF] text-[#2B59FF]'
                            : disabled
                              ? 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'
                              : 'bg-white border border-slate-200 text-[#0F172A] hover:bg-slate-50'
                        }`}
                      >
                        ${preset} USDT
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-[#475467] mb-3 tnum">
                <span>Recibís al instante:</span>
                <strong className="text-[#0F172A] font-semibold">
                  ${Math.round(effectiveQuickAmount * ARS_EXCHANGE_RATE).toLocaleString('es-AR')} ARS
                </strong>
              </div>
              <button
                id="btn-confirmar-retiro"
                type="button"
                disabled={effectiveQuickAmount < 10}
                onClick={() => onQuickWithdrawConfirm(effectiveQuickAmount)}
                className="w-full h-11 px-4 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] disabled:bg-slate-300 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <span>
                  {effectiveQuickAmount >= 10
                    ? `Confirmar retiro de $${effectiveQuickAmount.toFixed(0)} USDT`
                    : 'Saldo insuficiente para retiro rápido'}
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Bottom 2-Column Layout: Academic Course Verification + Wallet Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Academic Courses & Verification */}
          <section className="lg:col-span-7">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">
                  Materias e hitos verificados
                </h2>
                <p className="text-xs text-[#475467]">
                  Cada materia aprobada en SIU-Guaraní libera tu incentivo académico en USDT
                </p>
              </div>

              {/* Interactive Segmented Filter */}
              <div
                role="group"
                aria-label="Filtrar materias por estado"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
              >
                {(['Todas', 'Aprobada', 'Pendiente', 'En Curso'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setCourseFilter(tab)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      courseFilter === tab
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#475467] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredCourses.map((course) => {
                const badgeStyle =
                  course.status === 'Aprobada'
                    ? 'bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]'
                    : course.status === 'Pendiente'
                      ? 'bg-[#FEF0C7] border-[#FEDF89] text-[#B54708]'
                      : 'bg-[#EFF4FF] border-[#C7D7FE] text-[#2B59FF]';

                return (
                  <article
                    key={course.id}
                    className="card-ambient card-ambient-hover p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] text-[#0F172A] flex items-center justify-center shrink-0 mt-0.5">
                        {course.status === 'Aprobada' ? (
                          <BookOpenCheck className="w-5 h-5 text-[#12B76A]" aria-hidden="true" />
                        ) : (
                          <Clock className="w-5 h-5 text-[#475467]" aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-semibold text-[#475467] tnum">
                            {course.code}
                          </span>
                          <span
                            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
                          >
                            {course.status}
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#0F172A]">
                          {course.name}
                        </h3>
                        <p className="text-xs text-[#475467] mt-0.5 tnum">
                          {course.semester} · {course.credits} créditos
                          {course.grade !== null ? ` · Calificación: ${course.grade}/10` : ' · Cursada activa'}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right tnum">
                        <span
                          className={`text-base font-bold ${
                            course.status === 'Aprobada' ? 'text-[#12B76A]' : 'text-[#0F172A]'
                          }`}
                        >
                          +${course.rewardUsdt.toFixed(2)} USDT
                        </span>
                        <span className="block text-[11px] text-[#64748B]">
                          {course.verifiedDate ? `Acreditado ${course.verifiedDate}` : 'Incentivo por aprobación'}
                        </span>
                      </div>

                      {course.status === 'Pendiente' && (
                        <button
                          type="button"
                          onClick={() => handleSyncClick(course)}
                          className="px-3 py-1.5 rounded-lg bg-[#EFF4FF] hover:bg-[#DDE8FF] text-[#2B59FF] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Sincronizar acta SIU</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Recent Transactions List */}
          <section className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#0F172A] tracking-tight">
                  Movimientos recientes
                </h2>
                <p className="text-xs text-[#475467]">
                  Historial auditado de desembolsos y retiros
                </p>
              </div>
              <span className="text-xs font-mono text-[#64748B] tnum">
                {transactions.length} registros
              </span>
            </div>

            <div className="card-ambient divide-y divide-slate-100 overflow-hidden">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        tx.direction === 'credit'
                          ? 'bg-[#ECFDF3] text-[#12B76A]'
                          : 'bg-[#F1F5F9] text-[#0F172A]'
                      }`}
                    >
                      {tx.direction === 'credit' ? (
                        <ArrowDownLeft className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-[#0F172A] truncate">
                        {tx.title}
                      </p>
                      <p className="text-xs text-[#475467] truncate">
                        {tx.subtitle}
                      </p>
                      <p className="text-[11px] text-[#64748B] mt-0.5 tnum">
                        {tx.date} · Ref {tx.referenceCode}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 tnum">
                    <span
                      className={`text-sm font-bold ${
                        tx.direction === 'credit' ? 'text-[#12B76A]' : 'text-[#0F172A]'
                      }`}
                    >
                      {tx.direction === 'credit' ? '+' : '-'}${tx.amountUsdt.toFixed(2)} USDT
                    </span>
                    <span className="block text-[11px] text-[#64748B]">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
