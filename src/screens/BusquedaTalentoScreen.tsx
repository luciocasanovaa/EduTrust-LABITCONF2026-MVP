import { useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  GraduationCap,
  LogOut,
  Mail,
  Search,
} from 'lucide-react';
import { StudentCandidate } from '../types/edutrust';
import { filterCandidates, NavigationTrigger } from '../utils/edutrustLogic';

interface BusquedaTalentoScreenProps {
  candidates: StudentCandidate[];
  onToggleShortlist: (candidateId: string) => void;
  onContactCandidate: (candidateId: string) => void;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onLogout: () => void;
}

export function BusquedaTalentoScreen({
  candidates,
  onToggleShortlist,
  onContactCandidate,
  onNavigateTrigger,
  onLogout,
}: BusquedaTalentoScreenProps) {
  const [query, setQuery] = useState('');
  const [major, setMajor] = useState('Todas');
  const [minGpa, setMinGpa] = useState<number>(8.5);
  const [onlyShortlisted, setOnlyShortlisted] = useState(false);
  const [contactNotice, setContactNotice] = useState<string | null>(null);

  const filtered = filterCandidates(candidates, {
    query,
    major,
    minGpa,
    onlyShortlisted,
  });

  const shortlistedCount = candidates.filter((c) => c.shortlisted).length;
  const contactedCount = candidates.filter((c) => c.contacted).length;

  const handleContact = (candidate: StudentCandidate) => {
    onContactCandidate(candidate.id);
    setContactNotice(
      `Invitación a entrevista técnica enviada a ${candidate.fullName} (${candidate.university}).`,
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract with exact:
          - //header//a[@data-path='buscar-talento'] -> Panel de Auditoría (push_back)
          - //nav//a[@data-path='suscripcion-y-plan'] -> Recepción y Donaciones (push) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <a
            href="#panel-auditoria"
            data-path="buscar-talento"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTrigger('header-buscar-talento');
            }}
            className="text-sm md:text-base font-bold tracking-tight text-[#0F172A] hover:text-[#2B59FF] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
            <span>Panel Ingeniería 2026</span>
          </a>

          <nav
            aria-label="Navegación Portal Empresas"
            className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#475467] overflow-x-auto"
          >
            <a
              href="#directorio-talento"
              onClick={(e) => e.preventDefault()}
              aria-current="page"
              className="text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF] py-5 whitespace-nowrap shrink-0"
            >
              Búsqueda de Talento
            </a>
            <a
              href="#suscripcion-y-plan"
              data-path="suscripcion-y-plan"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTrigger('nav-suscripcion-y-plan');
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Suscripción y Plan ESG
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

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        {/* Title & Recruiter Summary */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#2B59FF]">
              Portal Empresas Patrocinadoras · Perfiles Académicos Auditados
            </p>
            <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
              Búsqueda de Talento — Ingeniería 2026
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#475467] tnum">
            <span>
              Candidatos verificados: <strong className="text-[#0F172A]">{candidates.length}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              En preselección: <strong className="text-[#2B59FF]">{shortlistedCount}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Contactados: <strong className="text-[#12B76A]">{contactedCount}</strong>
            </span>
          </div>
        </div>

        {contactNotice && (
          <div
            role="status"
            className="px-4 py-3 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-sm font-medium flex items-center justify-between gap-4"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
              {contactNotice}
            </span>
            <button
              type="button"
              onClick={() => setContactNotice(null)}
              className="text-xs font-semibold underline cursor-pointer shrink-0"
            >
              Ocultar
            </button>
          </div>
        )}

        {/* Search & Multi-Facet Filter Bar */}
        <section className="card-ambient p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5">
            <label htmlFor="talent-search" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Competencia, nombre o universidad
            </label>
            <div className="relative">
              <Search
                className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="talent-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ej. TypeScript, Sistemas Embebidos, UTN..."
                className="w-full h-11 pl-9 pr-3 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="major-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Especialidad de ingeniería
            </label>
            <select
              id="major-select"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
            >
              <option value="Todas">Todas las especialidades</option>
              <option value="Ingeniería en Sistemas">Ingeniería en Sistemas</option>
              <option value="Ingeniería Electrónica">Ingeniería Electrónica</option>
              <option value="Ciencia de Datos">Ciencia de Datos</option>
              <option value="Ingeniería Industrial">Ingeniería Industrial</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="gpa-select" className="block text-xs font-semibold text-[#0F172A] mb-1.5">
              Promedio mínimo
            </label>
            <select
              id="gpa-select"
              value={String(minGpa)}
              onChange={(e) => setMinGpa(Number(e.target.value))}
              className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] bg-white text-sm text-[#0F172A] tnum focus:outline-none focus:border-[#2B59FF]"
            >
              <option value="8">8.00 o superior</option>
              <option value="8.5">8.50 o superior</option>
              <option value="9">9.00 o superior</option>
              <option value="9.3">9.30 o superior</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setOnlyShortlisted((v) => !v)}
              aria-pressed={onlyShortlisted}
              className={`w-full h-11 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                onlyShortlisted
                  ? 'bg-[#EFF4FF] border-[#2B59FF] text-[#2B59FF]'
                  : 'bg-[#F8FAFC] border-slate-200 text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Preselección ({shortlistedCount})</span>
            </button>
          </div>
        </section>

        {/* Candidate Directory Grid */}
        {filtered.length === 0 ? (
          <div className="card-ambient p-10 text-center">
            <p className="text-base font-semibold text-[#0F172A]">
              No hay perfiles que coincidan con los filtros seleccionados
            </p>
            <p className="text-xs text-[#475467] mt-1 mb-4">
              Reducí el promedio mínimo o ampliá la especialidad para ver más becarios verificados.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setMajor('Todas');
                setMinGpa(8.0);
                setOnlyShortlisted(false);
              }}
              className="px-4 py-2 rounded-lg bg-[#2B59FF] text-white text-xs font-semibold cursor-pointer"
            >
              Limpiar criterios de búsqueda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((cand) => (
              <article
                key={cand.id}
                className="card-ambient card-ambient-hover p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#EFF4FF] text-[#2B59FF] font-bold text-sm flex items-center justify-center shrink-0">
                        {cand.initials}
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-[#0F172A]">
                          {cand.fullName}
                        </h2>
                        <p className="text-xs text-[#475467] flex items-center gap-1.5 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2B59FF]" aria-hidden="true" />
                          <span>
                            {cand.major} · {cand.university} ({cand.yearLevel})
                          </span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onToggleShortlist(cand.id)}
                      aria-label={
                        cand.shortlisted
                          ? `Quitar a ${cand.fullName} de preselección`
                          : `Guardar a ${cand.fullName} en preselección`
                      }
                      className={`min-h-[40px] min-w-[40px] rounded-lg border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                        cand.shortlisted
                          ? 'bg-[#EFF4FF] border-[#2B59FF] text-[#2B59FF]'
                          : 'bg-white border-slate-200 text-[#64748B] hover:text-[#0F172A]'
                      }`}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={cand.shortlisted ? 'currentColor' : 'none'}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Verified Metrics Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#475467] py-3 border-y border-slate-100 mb-3.5 tnum">
                    <span>
                      Promedio SIU: <strong className="text-[#0F172A]">{cand.gpa.toFixed(2)}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Materias verificadas: <strong className="text-[#12B76A]">{cand.verifiedCourses}</strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Disponibilidad: {cand.availability}</span>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium text-[#0F172A] bg-[#F1F5F9] px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs text-[#64748B]">
                    Analítico auditado por EduTrust
                  </span>

                  {cand.contacted ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-xs font-semibold whitespace-nowrap">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      Entrevista solicitada
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleContact(cand)}
                      className="h-10 px-4 rounded-lg bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Solicitar entrevista</span>
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
