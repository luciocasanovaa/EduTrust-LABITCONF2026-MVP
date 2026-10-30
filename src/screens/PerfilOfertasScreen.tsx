import React, { useEffect, useState } from 'react';
import {
  Award,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Send,
} from 'lucide-react';
import { CourseRecord, JobOffer, ScreenId } from '../types/edutrust';
import { calculateAcademicSummary, NavigationTrigger } from '../utils/edutrustLogic';

interface StudentProfileData {
  fullName: string;
  initials: string;
  email: string;
  legajo: string;
  university: string;
  major: string;
  cohort: string;
  semesterProgress: string;
  recruiterVisible: boolean;
  portfolioUrl: string;
  bio: string;
  skills: string[];
}

interface PerfilOfertasScreenProps {
  profile: StudentProfileData;
  courses: CourseRecord[];
  offers: JobOffer[];
  initialSection: 'perfil' | 'ofertas';
  onToggleRecruiterVisible: () => void;
  onAddSkill: (skill: string) => void;
  onApplyOffer: (offerId: string) => void;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onDirectScreenSelect: (screen: ScreenId) => void;
}

export function PerfilOfertasScreen({
  profile,
  courses,
  offers,
  initialSection,
  onToggleRecruiterVisible,
  onAddSkill,
  onApplyOffer,
  onNavigateTrigger,
  onDirectScreenSelect,
}: PerfilOfertasScreenProps) {
  const [activeTab, setActiveTab] = useState<'todo' | 'perfil' | 'ofertas'>(
    initialSection === 'ofertas' ? 'ofertas' : 'todo',
  );
  const [modalityFilter, setModalityFilter] = useState<'Todas' | 'Remoto' | 'Híbrido'>('Todas');
  const [offerQuery, setOfferQuery] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [skillError, setSkillError] = useState<string | null>(null);

  useEffect(() => {
    setActiveTab(initialSection === 'ofertas' ? 'ofertas' : 'todo');
  }, [initialSection]);

  const summary = calculateAcademicSummary(courses);

  const filteredOffers = offers.filter((offer) => {
    if (modalityFilter !== 'Todas' && offer.modality !== modalityFilter) {
      return false;
    }
    const q = offerQuery.trim().toLowerCase();
    if (!q) return true;
    return `${offer.company} ${offer.role} ${offer.location}`
      .toLowerCase()
      .includes(q);
  });

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newSkill.trim();
    if (cleaned.length < 2) {
      setSkillError('Escribí una competencia técnica válida (ej. Docker).');
      return;
    }
    if (profile.skills.some((s) => s.toLowerCase() === cleaned.toLowerCase())) {
      setSkillError('Esta competencia ya figura en tu perfil verificado.');
      return;
    }
    onAddSkill(cleaned);
    setNewSkill('');
    setSkillError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Bar Contract with exact //nav//a[@data-path='mi-beca'] */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4 md:gap-8">
          <a
            href="#mi-beca"
            onClick={(e) => {
              e.preventDefault();
              onNavigateTrigger('nav-mi-beca');
            }}
            className="text-base md:text-lg font-bold tracking-tight text-[#0F172A] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
              ET
            </span>
            <span className="hidden sm:inline">EduTrust</span>
          </a>

          <nav
            aria-label="Navegación de perfil y oportunidades"
            className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#475467] overflow-x-auto"
          >
            <a
              href="#mi-beca"
              data-path="mi-beca"
              onClick={(e) => {
                e.preventDefault();
                onNavigateTrigger('nav-mi-beca');
              }}
              className="hover:text-[#0F172A] transition-colors py-5 whitespace-nowrap shrink-0"
            >
              Mi beca
            </a>
            <a
              href="#perfil-profesional"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('todo');
              }}
              aria-current={activeTab !== 'ofertas' ? 'page' : undefined}
              className={`py-5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab !== 'ofertas'
                  ? 'text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Perfil Profesional
            </a>
            <a
              href="#ofertas-laborales"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('ofertas');
              }}
              aria-current={activeTab === 'ofertas' ? 'page' : undefined}
              className={`py-5 whitespace-nowrap shrink-0 transition-colors ${
                activeTab === 'ofertas'
                  ? 'text-[#2B59FF] font-semibold border-b-2 border-[#2B59FF]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              Ofertas ({offers.length})
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onDirectScreenSelect(ScreenId.BusquedaTalento)}
              className="px-3 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Vista Empresas
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Page Header + Segmented View Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-medium text-[#475467]">
              Credencial Académica Verificada · Red de Empleabilidad STEM
            </p>
            <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
              Perfil Profesional y Ofertas
            </h1>
          </div>

          <div
            role="group"
            aria-label="Cambiar vista de perfil y ofertas"
            className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
          >
            {(
              [
                { id: 'todo', label: 'Vista completa' },
                { id: 'perfil', label: 'CV Académico' },
                { id: 'ofertas', label: 'Ofertas laborales' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                    : 'text-[#475467] hover:text-[#0F172A]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Verified Academic Profile */}
          {activeTab !== 'ofertas' && (
            <section
              className={
                activeTab === 'perfil' ? 'lg:col-span-12 space-y-6' : 'lg:col-span-5 space-y-6'
              }
            >
              <div className="card-ambient p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-[#2B59FF] text-white font-bold text-lg flex items-center justify-center shrink-0">
                      {profile.initials}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-[#0F172A]">
                        {profile.fullName}
                      </h2>
                      <p className="text-xs text-[#475467]">
                        {profile.major}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {profile.university} · {profile.semesterProgress}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#475467] leading-relaxed mb-5">
                  {profile.bio}
                </p>

                {/* Verified Academic Metrics */}
                <div className="grid grid-cols-3 gap-3 py-4 border-y border-slate-100 mb-5 tnum">
                  <div>
                    <span className="block text-xs text-[#64748B]">Promedio SIU</span>
                    <strong className="text-lg font-bold text-[#0F172A]">
                      {summary.averageGrade.toFixed(2)}
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#64748B]">Hitos auditados</span>
                    <strong className="text-lg font-bold text-[#12B76A]">
                      {summary.approvedCount} actas
                    </strong>
                  </div>
                  <div>
                    <span className="block text-xs text-[#64748B]">Postulaciones</span>
                    <strong className="text-lg font-bold text-[#2B59FF]">
                      {offers.filter((o) => o.applied).length} activas
                    </strong>
                  </div>
                </div>

                {/* Recruiter Visibility Toggle */}
                <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 mb-5">
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Visible en Portal Empresas Patrocinadoras
                    </div>
                    <div className="text-[11px] text-[#475467]">
                      Permite recibir invitaciones directas a entrevistas técnicas
                    </div>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={profile.recruiterVisible}
                    aria-label="Activar visibilidad para empresas patrocinadoras"
                    onClick={onToggleRecruiterVisible}
                    className={`w-11 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                      profile.recruiterVisible ? 'bg-[#12B76A]' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        profile.recruiterVisible ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Technical Skills & Add Skill Form */}
                <div>
                  <h3 className="text-xs font-semibold text-[#0F172A] mb-2.5 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
                    Competencias validadas y stack técnico
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-medium text-[#0F172A] bg-[#F1F5F9] px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleAddSkillSubmit} className="flex gap-2" noValidate>
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => {
                        setNewSkill(e.target.value);
                        if (skillError) setSkillError(null);
                      }}
                      placeholder="Agregar competencia (ej. Docker, Rust)"
                      aria-label="Nueva competencia técnica"
                      className="flex-1 h-10 px-3 rounded-lg border border-[#D0D5DD] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                    />
                    <button
                      type="submit"
                      className="h-10 px-3.5 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Sumar</span>
                    </button>
                  </form>
                  {skillError && (
                    <p role="alert" className="text-xs text-[#BA1A1A] mt-1.5">
                      {skillError}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#475467]">
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-[#2B59FF]" aria-hidden="true" />
                    Legajo {profile.legajo}
                  </span>
                  <span className="font-mono text-[#2B59FF] flex items-center gap-1">
                    {profile.portfolioUrl}
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Right Column: Partner Job & Internship Offers */}
          {activeTab !== 'perfil' && (
            <section
              className={
                activeTab === 'ofertas' ? 'lg:col-span-12 space-y-4' : 'lg:col-span-7 space-y-4'
              }
            >
              <div className="card-ambient p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={offerQuery}
                    onChange={(e) => setOfferQuery(e.target.value)}
                    placeholder="Buscar por empresa, rol o ubicación..."
                    aria-label="Buscar ofertas laborales"
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                  />
                </div>

                <div
                  role="group"
                  aria-label="Filtrar ofertas por modalidad"
                  className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
                >
                  {(['Todas', 'Remoto', 'Híbrido'] as const).map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => setModalityFilter(mod)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        modalityFilter === mod
                          ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                          : 'text-[#475467] hover:text-[#0F172A]'
                      }`}
                    >
                      {mod}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOffers.length === 0 ? (
                <div className="card-ambient p-8 text-center">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    No encontramos ofertas con ese filtro
                  </p>
                  <p className="text-xs text-[#475467] mt-1 mb-4">
                    Probá limpiar la búsqueda o ver todas las modalidades disponibles.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setOfferQuery('');
                      setModalityFilter('Todas');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#2B59FF] text-white text-xs font-semibold cursor-pointer"
                  >
                    Restablecer filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {filteredOffers.map((offer) => (
                    <article
                      key={offer.id}
                      className="card-ambient card-ambient-hover p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#475467] mb-1">
                            <span className="font-semibold text-[#2B59FF]">
                              {offer.company}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{offer.type}</span>
                            <span aria-hidden="true">·</span>
                            <span>{offer.postedAgo}</span>
                          </div>
                          <h3 className="text-base font-semibold text-[#0F172A]">
                            {offer.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#475467] mt-1.5">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                              {offer.location} ({offer.modality})
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-[#64748B]" aria-hidden="true" />
                              Materias correlativas: {offer.requiredCourses.join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="sm:text-right shrink-0 tnum">
                          <div className="text-lg font-bold text-[#0F172A]">
                            ${offer.monthlyStipendUsd.toLocaleString('es-AR')} USD
                            <span className="text-xs font-normal text-[#64748B]">/mes</span>
                          </div>
                          <span className="text-xs font-semibold text-[#027A48]">
                            Afinidad académica {offer.matchScore}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                        <span className="text-xs text-[#64748B]">
                          Adjunta certificado analítico verificado automáticamente
                        </span>

                        {offer.applied ? (
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] text-xs font-semibold whitespace-nowrap shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            Postulación enviada
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onApplyOffer(offer.id)}
                            className="h-10 px-4 rounded-lg bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Postular con CV verificado</span>
                          </button>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
