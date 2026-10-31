import React, { useState } from 'react';
import {
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Info,
  LogOut,
  Search,
  Upload,
} from 'lucide-react';
import { InstitutionEnrollment } from '../types/edutrust';
import { PASSING_GRADE } from '../utils/edutrustLogic';

interface PortalInstitucionScreenProps {
  enrollments: InstitutionEnrollment[];
  onSubmitGrade: (
    enrollmentId: string,
    gradeRaw: string,
    actaReferenceRaw: string,
  ) => { valid: boolean; error?: string; passed?: boolean; releasedUsdt?: number; studentName?: string; courseCode?: string };
  onLogout: () => void;
}

export function PortalInstitucionScreen({
  enrollments,
  onSubmitGrade,
  onLogout,
}: PortalInstitucionScreenProps) {
  const [filterTab, setFilterTab] = useState<'pendientes' | 'cargadas' | 'todas'>('pendientes');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftGrades, setDraftGrades] = useState<Record<string, string>>({});
  const [draftActas, setDraftActas] = useState<Record<string, string>>({
    'enr-1': 'SIU-ACTA-90510',
    'enr-2': 'SIU-ACTA-90511',
    'enr-3': 'SIU-ACTA-90512',
    'enr-4': 'SIU-ACTA-90513',
  });
  const [rowErrors, setRowErrors] = useState<Record<string, string>>({});
  const [feedbackBanner, setFeedbackBanner] = useState<{
    tone: 'success' | 'neutral';
    message: string;
  } | null>(null);

  const pendingItems = enrollments.filter((e) => e.status === 'Pendiente de Nota');
  const gradedItems = enrollments.filter((e) => e.status !== 'Pendiente de Nota');
  const releasedByGradesTotal = enrollments
    .filter((e) => e.status === 'Aprobada · Liberado')
    .reduce((sum, e) => sum + e.rewardUsdt, 0);

  const visibleEnrollments = enrollments.filter((item) => {
    if (filterTab === 'pendientes' && item.status !== 'Pendiente de Nota') return false;
    if (filterTab === 'cargadas' && item.status === 'Pendiente de Nota') return false;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return `${item.studentName} ${item.legajo} ${item.courseCode} ${item.courseName} ${item.university}`
      .toLowerCase()
      .includes(q);
  });

  const handleRowSubmit = (e: React.FormEvent, item: InstitutionEnrollment) => {
    e.preventDefault();
    const gradeRaw = draftGrades[item.id] ?? '';
    const actaRaw = draftActas[item.id] ?? '';

    const result = onSubmitGrade(item.id, gradeRaw, actaRaw);
    if (!result.valid) {
      setRowErrors((prev) => ({
        ...prev,
        [item.id]: result.error ?? 'Revisá la nota y el número de acta.',
      }));
      return;
    }

    setRowErrors((prev) => {
      const copy = { ...prev };
      delete copy[item.id];
      return copy;
    });

    if (result.passed) {
      setFeedbackBanner({
        tone: 'success',
        message: `Nota aprobada registrada para ${item.studentName} (${item.courseCode}). Se liberaron automáticamente $${(result.releasedUsdt ?? item.rewardUsdt).toFixed(2)} USDT a su billetera estudiantil.`,
      });
    } else {
      setFeedbackBanner({
        tone: 'neutral',
        message: `Acta registrada para ${item.studentName} (${item.courseCode}) con nota menor a ${PASSING_GRADE}. No se liberaron fondos de la beca ($0.00 USDT).`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Strictly isolated Top Bar for Institución Educativa */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <a
            href="#institucion"
            onClick={(e) => e.preventDefault()}
            className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span>Portal Institución Educativa</span>
          </a>

          <nav
            aria-label="Vistas de carga académica"
            className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-[#475467]"
          >
            <a
              href="#pendientes"
              onClick={(e) => {
                e.preventDefault();
                setFilterTab('pendientes');
              }}
              aria-current={filterTab === 'pendientes' ? 'page' : undefined}
              className={`py-5 whitespace-nowrap shrink-0 transition-colors ${
                filterTab === 'pendientes'
                  ? 'text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Notas por subir ({pendingItems.length})
            </a>
            <a
              href="#cargadas"
              onClick={(e) => {
                e.preventDefault();
                setFilterTab('cargadas');
              }}
              aria-current={filterTab === 'cargadas' ? 'page' : undefined}
              className={`py-5 whitespace-nowrap shrink-0 transition-colors ${
                filterTab === 'cargadas'
                  ? 'text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Actas cargadas ({gradedItems.length})
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

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        {/* Focused Single-Purpose Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#2B59FF]">
              Secretaría Académica · Validación Oficial de Actas
            </p>
            <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
              Carga de notas para liberación de becas
            </h1>
            <p className="text-sm text-[#475467] mt-1 max-w-2xl">
              Subí la calificación definitiva de cada materia cursada. Si la nota es aprobatoria ({PASSING_GRADE} o superior), el sistema libera automáticamente el dinero correspondiente al alumno.
            </p>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedbackBanner && (
          <div
            role="status"
            className={`px-4 py-3.5 rounded-xl border text-sm font-medium flex items-center justify-between gap-4 ${
              feedbackBanner.tone === 'success'
                ? 'bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]'
                : 'bg-[#FEF0C7] border-[#FEDF89] text-[#B54708]'
            }`}
          >
            <span className="flex items-center gap-2">
              {feedbackBanner.tone === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              ) : (
                <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              {feedbackBanner.message}
            </span>
            <button
              type="button"
              onClick={() => setFeedbackBanner(null)}
              className="text-xs font-semibold underline cursor-pointer shrink-0"
            >
              Ocultar
            </button>
          </div>
        )}

        {/* 3 Compact Operational Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tnum">
          <div className="card-ambient p-5">
            <span className="text-xs font-medium text-[#475467]">
              Materias pendientes de nota
            </span>
            <div className="text-2xl font-bold text-[#0F172A] mt-1">
              {pendingItems.length} <span className="text-xs font-normal text-[#64748B]">cursadas</span>
            </div>
          </div>

          <div className="card-ambient p-5">
            <span className="text-xs font-medium text-[#475467]">
              Actas oficiales registradas
            </span>
            <div className="text-2xl font-bold text-[#2B59FF] mt-1">
              {gradedItems.length} <span className="text-xs font-normal text-[#64748B]">actas</span>
            </div>
          </div>

          <div className="card-ambient p-5">
            <span className="text-xs font-medium text-[#475467]">
              Dinero liberado por notas subidas
            </span>
            <div className="text-2xl font-bold text-[#12B76A] mt-1">
              ${releasedByGradesTotal.toFixed(2)} <span className="text-xs font-semibold">USDT</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <section className="card-ambient p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alumno, legajo o código de materia..."
              aria-label="Buscar materia o estudiante"
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
            />
          </div>

          <div
            role="group"
            aria-label="Filtrar nómina de materias"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
          >
            {(
              [
                { id: 'pendientes', label: `Por subir (${pendingItems.length})` },
                { id: 'cargadas', label: `Cargadas (${gradedItems.length})` },
                { id: 'todas', label: 'Todas' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  filterTab === tab.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475467] hover:text-[#0F172A]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grade Upload List */}
        {visibleEnrollments.length === 0 ? (
          <div className="card-ambient p-10 text-center">
            <ClipboardCheck className="w-8 h-8 text-[#12B76A] mx-auto mb-2" aria-hidden="true" />
            <p className="text-base font-semibold text-[#0F172A]">
              No hay materias pendientes con este filtro
            </p>
            <p className="text-xs text-[#475467] mt-1 mb-4">
              Podés consultar el historial de actas cargadas o limpiar la búsqueda.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterTab('todas');
              }}
              className="px-4 py-2 rounded-lg bg-[#2B59FF] text-white text-xs font-semibold cursor-pointer"
            >
              Ver todas las materias
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {visibleEnrollments.map((item) => {
              const isPending = item.status === 'Pendiente de Nota';
              const errorMsg = rowErrors[item.id];

              return (
                <article
                  key={item.id}
                  className="card-ambient p-5 flex flex-col gap-4"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Student & Subject Info */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isPending
                            ? 'bg-[#EFF4FF] text-[#2B59FF]'
                            : item.status === 'Aprobada · Liberado'
                              ? 'bg-[#ECFDF3] text-[#12B76A]'
                              : 'bg-[#FEF0C7] text-[#B54708]'
                        }`}
                      >
                        <BookOpenCheck className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#475467] mb-0.5">
                          <span className="font-semibold text-[#0F172A]">
                            {item.studentName}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tnum">{item.legajo}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.university}</span>
                        </div>
                        <h2 className="text-base font-semibold text-[#0F172A]">
                          <span className="font-mono text-sm text-[#2B59FF] mr-2">
                            {item.courseCode}
                          </span>
                          {item.courseName}
                        </h2>
                        <p className="text-xs text-[#64748B] mt-0.5 tnum">
                          {item.semester} · Monto condicionado a aprobación:{' '}
                          <strong className="text-[#12B76A]">
                            ${item.rewardUsdt.toFixed(2)} USDT
                          </strong>
                        </p>
                      </div>
                    </div>

                    {/* Grade Input Form (if Pending) OR Recorded Status */}
                    {isPending ? (
                      <form
                        onSubmit={(e) => handleRowSubmit(e, item)}
                        className="flex flex-col sm:flex-row sm:items-end gap-3 shrink-0"
                        noValidate
                      >
                        <div className="w-full sm:w-28">
                          <label
                            htmlFor={`grade-${item.id}`}
                            className="block text-[11px] font-semibold text-[#475467] mb-1"
                          >
                            Nota (1 a 10)
                          </label>
                          <input
                            id={`grade-${item.id}`}
                            type="number"
                            min="1"
                            max="10"
                            step="0.5"
                            placeholder="Ej. 9"
                            value={draftGrades[item.id] ?? ''}
                            onChange={(e) => {
                              setDraftGrades((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }));
                              if (rowErrors[item.id]) {
                                setRowErrors((prev) => {
                                  const next = { ...prev };
                                  delete next[item.id];
                                  return next;
                                });
                              }
                            }}
                            className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-sm font-semibold text-[#0F172A] tnum focus:outline-none focus:border-[#2B59FF]"
                          />
                        </div>

                        <div className="w-full sm:w-44">
                          <label
                            htmlFor={`acta-${item.id}`}
                            className="block text-[11px] font-semibold text-[#475467] mb-1"
                          >
                            N.° de Acta Oficial
                          </label>
                          <input
                            id={`acta-${item.id}`}
                            type="text"
                            placeholder="SIU-ACTA-90510"
                            value={draftActas[item.id] ?? ''}
                            onChange={(e) =>
                              setDraftActas((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="h-11 px-4 rounded-[10px] bg-[#12B76A] hover:bg-[#0E9F5A] active:scale-[0.98] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Upload className="w-4 h-4" aria-hidden="true" />
                          <span>Subir nota y liberar</span>
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-4 shrink-0 tnum">
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#0F172A]">
                            Calificación: {item.grade}/10
                          </div>
                          <div className="text-xs font-mono text-[#64748B]">
                            {item.actaReference} · {item.updatedAt}
                          </div>
                        </div>
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border whitespace-nowrap ${
                            item.status === 'Aprobada · Liberado'
                              ? 'bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]'
                              : 'bg-[#FEF0C7] border-[#FEDF89] text-[#B54708]'
                          }`}
                        >
                          {item.status === 'Aprobada · Liberado'
                            ? `Liberado +$${item.rewardUsdt.toFixed(0)} USDT`
                            : 'Sin desembolso'}
                        </span>
                      </div>
                    )}
                  </div>

                  {errorMsg && (
                    <p
                      role="alert"
                      className="text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/60 px-3 py-2 rounded-lg"
                    >
                      {errorMsg}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
