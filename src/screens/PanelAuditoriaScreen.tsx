import { useState } from 'react';
import { Download, Search, ShieldCheck } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { AuditMilestone, AuditStatus, RoleNavItem } from '../types/edutrust';
import { filterAuditMilestones } from '../utils/edutrustLogic';

interface PanelAuditoriaScreenProps {
  milestones: AuditMilestone[];
  allocatedVaultUsdt: number;
  disbursedTotalUsdt: number;
  onSelectNav: (item: RoleNavItem) => void;
  onLogout: () => void;
}

export function PanelAuditoriaScreen({
  milestones,
  allocatedVaultUsdt,
  disbursedTotalUsdt,
  onSelectNav,
  onLogout,
}: PanelAuditoriaScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | AuditStatus>('Todos');

  const filtered = filterAuditMilestones(milestones, searchQuery, statusFilter);
  const approvedCount = milestones.filter((m) => m.status === 'Aprobada').length;
  const pendingCount = milestones.filter((m) => m.status !== 'Aprobada').length;
  const remainingVault = Math.max(0, allocatedVaultUsdt - disbursedTotalUsdt);

  const handleExportCsv = () => {
    const header = 'ID,Estudiante,Legajo,Universidad,Codigo,Materia,Nota,Monto_USDT,Acta_SIU,Estado\n';
    const rows = filtered
      .map(
        (m) =>
          `"${m.id}","${m.studentName}","${m.legajo}","${m.university}","${m.courseCode}","${m.courseName}",${m.grade},${m.amountUsdt},"${m.actaReference}","${m.status}"`,
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'auditoria-becas-ingenieria-2026.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <AppHeader
        role="patrocinador"
        activeNavId="auditoria"
        onSelectNav={onSelectNav}
        onLogout={onLogout}
      />

      {/* Workspace Body: context <aside> + <main> */}
      <div className="flex-1 max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Sidebar: context only. Navigation lives in the header. */}
        <aside
          aria-label="Programa activo"
          className="lg:col-span-3 card-ambient p-4 space-y-4"
        >
          <div className="px-2 pt-1">
            <p className="text-xs font-semibold text-[#2B59FF]">
              Programa Activo
            </p>
            <h2 className="text-sm font-bold text-[#0F172A] mt-0.5">
              Becas Ingeniería 2026
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
               Cohorte Nacional · 64 becarios
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 px-2 text-xs text-[#475467] space-y-1.5 tnum">
            <div className="flex items-center justify-between">
              <span>Ejecución presupuestaria</span>
              <strong className="text-[#0F172A]">
                {Math.min(100, Math.round((disbursedTotalUsdt / allocatedVaultUsdt) * 100))}%
              </strong>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#2B59FF] rounded-full"
                style={{
                  width: `${Math.min(100, Math.round((disbursedTotalUsdt / allocatedVaultUsdt) * 100))}%`,
                }}
              />
            </div>
            <p className="text-[11px] text-[#64748B] flex items-center gap-1 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A] shrink-0" aria-hidden="true" />
              Conciliación automática SIU-Guaraní
            </p>
          </div>
        </aside>

        {/* Main Audit Console */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-[#475467]">
                Transparencia para Patrocinadores · Liberación condicionada a notas institucionales
              </p>
              <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
                Panel de Auditoría — Programa Becas Ingeniería 2026
              </h1>
            </div>
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-lg bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* 4-Column KPI Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 tnum">
            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Fondo asignado al programa
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1">
                ${allocatedVaultUsdt.toLocaleString('es-AR')}
                <span className="text-xs font-semibold text-[#64748B] ml-1">USDT</span>
              </div>
            </div>
            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Total desembolsado a becarios
              </span>
              <div className="text-2xl font-bold text-[#12B76A] mt-1">
                ${disbursedTotalUsdt.toLocaleString('es-AR')}
                <span className="text-xs font-semibold text-[#12B76A] ml-1">USDT</span>
              </div>
            </div>
            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Reserva en bóveda operativa
              </span>
              <div className="text-2xl font-bold text-[#2B59FF] mt-1">
                ${remainingVault.toLocaleString('es-AR')}
                <span className="text-xs font-semibold text-[#2B59FF] ml-1">USDT</span>
              </div>
            </div>
            <div className="card-ambient p-5">
              <span className="text-xs font-medium text-[#475467]">
                Actas auditadas / pendientes
              </span>
              <div className="text-2xl font-bold text-[#0F172A] mt-1">
                {310 + approvedCount}{' '}
                <span className="text-xs font-medium text-[#B54708]">
                  ({pendingCount} por liberar)
                </span>
              </div>
            </div>
          </div>

          {/* Search & Status Filter Toolbar */}
          <section className="card-ambient overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por estudiante, legajo, materia o acta SIU..."
                  aria-label="Filtrar registros de auditoría"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D0D5DD] bg-white text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                />
              </div>

              <div
                role="group"
                aria-label="Estado de auditoría"
                className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
              >
                {(['Todos', 'Pendiente', 'En Revisión', 'Aprobada'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      statusFilter === st
                        ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                        : 'text-[#475467] hover:text-[#0F172A]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* High-Density Audit Data Table */}
            {filtered.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm font-semibold text-[#0F172A]">
                  Sin actas coincidentes con el criterio aplicado
                </p>
                <p className="text-xs text-[#475467] mt-1 mb-4">
                  Limpiá los filtros para visualizar la nómina completa de hitos académicos.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('Todos');
                  }}
                  className="px-4 py-2 rounded-lg bg-[#2B59FF] text-white text-xs font-semibold cursor-pointer"
                >
                  Mostrar todos los hitos
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 bg-[#F8FAFC] text-[11px] font-semibold text-[#475467]">
                      <th className="py-3 px-4">Estudiante / Legajo</th>
                      <th className="py-3 px-4">Materia verificada</th>
                      <th className="py-3 px-4">Acta SIU</th>
                      <th className="py-3 px-4 text-right">Calificación</th>
                      <th className="py-3 px-4 text-right">Incentivo</th>
                      <th className="py-3 px-4">Estado</th>
                      <th className="py-3 px-4 text-right">Trazabilidad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm tnum">
                    {filtered.map((item) => {
                      const badge =
                        item.status === 'Aprobada'
                          ? 'bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]'
                          : item.status === 'Pendiente'
                            ? 'bg-[#FEF0C7] border-[#FEDF89] text-[#B54708]'
                            : 'bg-[#EFF4FF] border-[#C7D7FE] text-[#2B59FF]';

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#0F172A]">
                              {item.studentName}
                            </div>
                            <div className="text-xs text-[#64748B] font-mono">
                              {item.legajo} · {item.university}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#0F172A]">
                              {item.courseName}
                            </div>
                            <div className="text-xs text-[#64748B] font-mono">
                              {item.courseCode} · {item.submittedAt}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-[#475467] whitespace-nowrap">
                            {item.actaReference}
                          </td>
                          <td className="py-3.5 px-4 text-right font-semibold text-[#0F172A] whitespace-nowrap">
                            {item.grade}/10
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-[#12B76A] whitespace-nowrap">
                            ${item.amountUsdt.toFixed(2)} USDT
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span
                              className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${badge}`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {item.status === 'Aprobada' ? (
                              <span className="text-xs font-medium text-[#027A48]">
                                Liberado por acta
                              </span>
                            ) : (
                              <span className="text-xs text-[#64748B]">
                                Espera carga institucional
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
