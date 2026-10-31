import { AppHeader } from '../components/AppHeader';
import { AreaChart } from '../components/charts/AreaChart';
import { ChartCard } from '../components/charts/ChartCard';
import { HBarChart } from '../components/charts/HBarChart';
import { StackedBar } from '../components/charts/StackedBar';
import {
  AuditMilestone,
  DonationRecord,
  DonorCategory,
  RoleNavItem,
  StudentCandidate,
} from '../types/edutrust';
import {
  buildFundUsage,
  buildTalentActivity,
  calculateVaultSummary,
  countMilestonesByStatus,
  cumulativeDonations,
  donationsByDonor,
  formatUsdt,
  FundUsageId,
  VAULT_OPENING_BALANCE_USDT,
} from '../utils/sponsorAnalytics';

interface GraficosPatrocinadorScreenProps {
  donations: DonationRecord[];
  allocatedUsdt: number;
  disbursedUsdt: number;
  milestones: AuditMilestone[];
  candidates: StudentCandidate[];
  onSelectNav: (item: RoleNavItem) => void;
  onLogout: () => void;
}

// Color follows the entity: a category / state keeps its hue wherever it appears.
const CATEGORY_COLOR: Record<DonorCategory, string> = {
  'Aporte Corporativo ESG': 'var(--viz-series-1)',
  'Donación Filantrópica': 'var(--viz-series-2)',
  'Suscripción Portal Talento': 'var(--viz-series-3)',
};

const FUND_USAGE_COLOR: Record<FundUsageId, string> = {
  desembolsado: 'var(--viz-series-1)',
  comprometido: 'var(--viz-series-2)',
  reserva: 'var(--viz-series-3)',
};

const TALENT_STAGE_COLOR = ['var(--viz-ordinal-1)', 'var(--viz-ordinal-2)', 'var(--viz-ordinal-3)'];

function StatTile({
  label,
  value,
  note,
  meterPct,
}: {
  label: string;
  value: string;
  note: string;
  /** Optional progress meter: fill in the series hue over a lighter track of the same ramp. */
  meterPct?: number;
}) {
  return (
    <div className="viz-root card-ambient p-5">
      <span className="text-xs font-medium text-[var(--viz-ink-2)]">{label}</span>
      <div className="mt-1 text-2xl font-bold tracking-tight text-[var(--viz-ink)] tnum">
        {value}
        <span className="ml-1 text-xs font-semibold text-[var(--viz-ink-3)]">USDT</span>
      </div>
      {meterPct !== undefined && (
        <div
          role="meter"
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={meterPct}
          className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#CDE2FB]"
        >
          <div
            className="h-full rounded-full bg-[var(--viz-series-1)]"
            style={{ width: `${meterPct}%` }}
          />
        </div>
      )}
      <p className="mt-2 text-xs text-[var(--viz-ink-3)]">{note}</p>
    </div>
  );
}

export function GraficosPatrocinadorScreen({
  donations,
  allocatedUsdt,
  disbursedUsdt,
  milestones,
  candidates,
  onSelectNav,
  onLogout,
}: GraficosPatrocinadorScreenProps) {
  const vault = calculateVaultSummary(donations, allocatedUsdt, disbursedUsdt);
  const fundUsage = buildFundUsage(vault);
  const donorBars = donationsByDonor(donations);
  const donationSeries = cumulativeDonations(donations);
  const talent = buildTalentActivity(candidates);
  const milestoneCounts = countMilestonesByStatus(milestones);
  const categoriesInUse = (Object.keys(CATEGORY_COLOR) as DonorCategory[]).filter((category) =>
    donations.some((d) => d.category === category),
  );
  const totalDonated = donations.reduce((acc, d) => acc + d.amountUsdt, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <AppHeader
        role="patrocinador"
        activeNavId="graficos"
        onSelectNav={onSelectNav}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 md:px-8 py-6 md:py-8 space-y-6">
        <div>
          <p className="text-xs font-medium text-[#475467]">
            Transparencia para Patrocinadores · Programa Becas Ingeniería 2026
          </p>
          <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mt-0.5">
            Gráficos de impacto
          </h1>
          <p className="text-sm text-[#475467] mt-1 max-w-2xl">
            Cómo se usa el dinero de los patrocinadores, de punta a punta. Los gráficos se
            actualizan con cada aporte, desembolso y acción de la plataforma.
          </p>
        </div>

        {/* Headline numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatTile
            label="Custodia total en bóveda"
            value={formatUsdt(vault.custodyUsdt)}
            note={`${donations.length} aportes registrados + saldo inicial`}
          />
          <StatTile
            label="Asignado a becas"
            value={formatUsdt(vault.allocatedUsdt)}
            meterPct={vault.allocationPct}
            note={`${vault.allocationPct}% de la custodia`}
          />
          <StatTile
            label="Desembolsado a becarios"
            value={formatUsdt(vault.disbursedUsdt)}
            meterPct={vault.executionPct}
            note={`${vault.executionPct}% del fondo asignado`}
          />
          <StatTile
            label="Reserva libre"
            value={formatUsdt(vault.reserveUsdt)}
            note="Disponible para nuevas becas"
          />
        </div>

        <ChartCard
          title="Uso del fondo"
          subtitle="Dónde está hoy cada dólar en custodia"
          table={{
            columns: [
              { label: 'Estado' },
              { label: 'Monto (USDT)', numeric: true },
              { label: '% de la custodia', numeric: true },
            ],
            rows: fundUsage.map((s) => [
              s.label,
              formatUsdt(s.amountUsdt),
              `${Math.round(s.sharePct)}%`,
            ]),
          }}
        >
          <StackedBar
            ariaLabel="Uso del fondo en custodia"
            segments={fundUsage.map((s) => ({
              id: s.id,
              label: s.label,
              value: s.amountUsdt,
              color: FUND_USAGE_COLOR[s.id],
              valueLabel: formatUsdt(s.amountUsdt),
              sharePct: s.sharePct,
              tooltip: {
                title: s.label,
                rows: [
                  { value: formatUsdt(s.amountUsdt), label: 'USDT', color: FUND_USAGE_COLOR[s.id] },
                  { value: `${Math.round(s.sharePct)}%`, label: 'de la custodia' },
                ],
              },
            }))}
          />
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChartCard
            className="lg:col-span-7"
            title="Aportes acumulados"
            subtitle={`Suma de aportes por fecha, sin contar el saldo inicial de ${formatUsdt(VAULT_OPENING_BALANCE_USDT)}`}
            table={{
              columns: [
                { label: 'Fecha' },
                { label: 'Aportado ese día (USDT)', numeric: true },
                { label: 'Acumulado (USDT)', numeric: true },
              ],
              rows: donationSeries.map((p) => [
                p.dateLabel,
                formatUsdt(p.dayAmountUsdt),
                formatUsdt(p.cumulativeUsdt),
              ]),
            }}
          >
            <AreaChart
              ariaLabel={`Aportes acumulados: ${formatUsdt(totalDonated)} USDT en ${donationSeries.length} fechas`}
              endLabel={formatUsdt(donationSeries[donationSeries.length - 1]?.cumulativeUsdt ?? 0)}
              points={donationSeries.map((p) => ({
                id: String(p.timestamp),
                x: p.timestamp,
                xLabel: p.dateLabel.replace(/\s\d{4}$/, ''),
                y: p.cumulativeUsdt,
                tooltip: {
                  title: p.dateLabel,
                  rows: [
                    {
                      value: formatUsdt(p.cumulativeUsdt),
                      label: 'acumulado',
                      color: 'var(--viz-series-1)',
                    },
                    { value: `+${formatUsdt(p.dayAmountUsdt)}`, label: 'ese día' },
                  ],
                },
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-5"
            title="Aportes por entidad"
            subtitle="Quién financia el programa, según tipo de aporte"
            table={{
              columns: [
                { label: 'Entidad' },
                { label: 'Tipo de aporte' },
                { label: 'Monto (USDT)', numeric: true },
              ],
              rows: donorBars.map((d) => [d.donorName, d.category, formatUsdt(d.amountUsdt)]),
            }}
          >
            <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Tipos de aporte">
              {categoriesInUse.map((category) => (
                <li key={category} className="flex items-center gap-1.5 text-xs text-[var(--viz-ink-2)]">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-[3px]"
                    style={{ backgroundColor: CATEGORY_COLOR[category] }}
                  />
                  {category}
                </li>
              ))}
            </ul>
            <HBarChart
              ariaLabel="Aportes por entidad, en USDT"
              valueGutterPx={84}
              items={donorBars.map((d) => ({
                id: `${d.donorName}::${d.category}`,
                label: d.donorName,
                value: d.amountUsdt,
                valueLabel: formatUsdt(d.amountUsdt),
                color: CATEGORY_COLOR[d.category],
                tooltip: {
                  title: `${d.donorName} · ${d.category}`,
                  rows: [
                    { value: formatUsdt(d.amountUsdt), label: 'USDT', color: CATEGORY_COLOR[d.category] },
                  ],
                },
              }))}
            />
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ChartCard
            className="lg:col-span-5"
            title="Actividad con talento becado"
            subtitle="Candidatos verificados, preseleccionados y contactados"
            table={{
              columns: [
                { label: 'Etapa' },
                { label: 'Candidatos', numeric: true },
                { label: '% de verificados', numeric: true },
              ],
              rows: talent.map((s) => [s.label, String(s.count), `${s.pctOfVerified}%`]),
            }}
          >
            <HBarChart
              ariaLabel="Actividad con talento becado"
              valueGutterPx={84}
              items={talent.map((s, i) => ({
                id: s.id,
                label: s.label,
                value: s.count,
                valueLabel: i === 0 ? String(s.count) : `${s.count} · ${s.pctOfVerified}%`,
                color: TALENT_STAGE_COLOR[i],
                tooltip: {
                  title: s.label,
                  rows: [
                    { value: String(s.count), label: 'candidatos', color: TALENT_STAGE_COLOR[i] },
                    { value: `${s.pctOfVerified}%`, label: 'de los verificados' },
                  ],
                },
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-7"
            title="Hitos de auditoría por estado"
            subtitle="Cada hito es una materia aprobada que libera su recompensa al becario"
            table={{
              columns: [
                { label: 'Estado' },
                { label: 'Hitos', numeric: true },
                { label: 'Monto (USDT)', numeric: true },
              ],
              rows: milestoneCounts.map((m) => [m.status, String(m.count), formatUsdt(m.amountUsdt)]),
            }}
          >
            <HBarChart
              ariaLabel="Hitos de auditoría por estado"
              valueGutterPx={150}
              items={milestoneCounts.map((m) => ({
                id: m.status,
                label: m.status,
                value: m.count,
                valueLabel: `${m.count} · ${formatUsdt(m.amountUsdt)} USDT`,
                color: 'var(--viz-series-1)',
                tooltip: {
                  title: `Hitos · ${m.status}`,
                  rows: [
                    { value: String(m.count), label: 'hitos', color: 'var(--viz-series-1)' },
                    { value: formatUsdt(m.amountUsdt), label: 'USDT' },
                  ],
                },
              }))}
            />
          </ChartCard>
        </div>
      </main>
    </div>
  );
}
