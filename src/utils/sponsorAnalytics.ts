import {
  AuditMilestone,
  AuditStatus,
  DonationRecord,
  DonorCategory,
  StudentCandidate,
} from '../types/edutrust';

/** Funds already in custody before the first registered donation of the cycle. */
export const VAULT_OPENING_BALANCE_USDT = 87000;

export function calculateCustodyUsdt(donations: DonationRecord[]): number {
  return donations.reduce((acc, d) => acc + d.amountUsdt, VAULT_OPENING_BALANCE_USDT);
}

export interface VaultSummary {
  custodyUsdt: number;
  allocatedUsdt: number;
  disbursedUsdt: number;
  reserveUsdt: number;
  /** Disbursed share of the allocated fund, 0-100. */
  executionPct: number;
  /** Allocated share of the custody, 0-100. */
  allocationPct: number;
}

export function calculateVaultSummary(
  donations: DonationRecord[],
  allocatedUsdt: number,
  disbursedUsdt: number,
): VaultSummary {
  const custodyUsdt = calculateCustodyUsdt(donations);
  return {
    custodyUsdt,
    allocatedUsdt,
    disbursedUsdt,
    reserveUsdt: Math.max(0, custodyUsdt - allocatedUsdt),
    executionPct: allocatedUsdt > 0 ? Math.min(100, Math.round((disbursedUsdt / allocatedUsdt) * 100)) : 0,
    allocationPct: custodyUsdt > 0 ? Math.min(100, Math.round((allocatedUsdt / custodyUsdt) * 100)) : 0,
  };
}

export type FundUsageId = 'desembolsado' | 'comprometido' | 'reserva';

export interface FundUsageSegment {
  id: FundUsageId;
  label: string;
  amountUsdt: number;
  /** Share of the three segments together, 0-100. */
  sharePct: number;
}

/**
 * Splits the custody into the three states a dollar can be in. The segments
 * always add up to the custody (when the program is not over-allocated).
 */
export function buildFundUsage(summary: VaultSummary): FundUsageSegment[] {
  const disbursed = Math.min(summary.disbursedUsdt, summary.allocatedUsdt);
  const committed = Math.max(0, summary.allocatedUsdt - disbursed);
  const raw: Array<Omit<FundUsageSegment, 'sharePct'>> = [
    { id: 'desembolsado', label: 'Desembolsado a becarios', amountUsdt: disbursed },
    { id: 'comprometido', label: 'Asignado, por desembolsar', amountUsdt: committed },
    { id: 'reserva', label: 'Reserva libre', amountUsdt: summary.reserveUsdt },
  ];
  const total = raw.reduce((acc, s) => acc + s.amountUsdt, 0);
  return raw.map((s) => ({
    ...s,
    sharePct: total > 0 ? (s.amountUsdt / total) * 100 : 0,
  }));
}

export interface DonorBar {
  donorName: string;
  category: DonorCategory;
  amountUsdt: number;
}

/** Total contributed by each entity, largest first. Same entity + category is merged. */
export function donationsByDonor(donations: DonationRecord[]): DonorBar[] {
  const byKey = new Map<string, DonorBar>();
  for (const d of donations) {
    const key = `${d.donorName}::${d.category}`;
    const current = byKey.get(key);
    if (current) {
      current.amountUsdt += d.amountUsdt;
    } else {
      byKey.set(key, { donorName: d.donorName, category: d.category, amountUsdt: d.amountUsdt });
    }
  }
  return [...byKey.values()].sort((a, b) => b.amountUsdt - a.amountUsdt);
}

const SPANISH_MONTHS: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  set: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

/** "15 Oct 2026" -> UTC timestamp, or null when the label is not in that format. */
export function parseDonationDate(label: string): number | null {
  const match = label.trim().match(/^(\d{1,2})\s+([A-Za-zÁÉÍÓÚáéíóú]{3})\.?\s+(\d{4})$/);
  if (!match) return null;
  const month = SPANISH_MONTHS[match[2].toLowerCase()];
  if (month === undefined) return null;
  const day = Number(match[1]);
  if (day < 1 || day > 31) return null;
  return Date.UTC(Number(match[3]), month, day);
}

export interface CumulativeDonationPoint {
  timestamp: number;
  /** "15 Oct 2026", as shown in the donations ledger. */
  dateLabel: string;
  /** Contributed on that day. */
  dayAmountUsdt: number;
  /** Contributed up to and including that day (opening balance not included). */
  cumulativeUsdt: number;
  donors: string[];
}

/** Running total of contributions by day. Same-day donations share one point. */
export function cumulativeDonations(donations: DonationRecord[]): CumulativeDonationPoint[] {
  const byDay = new Map<number, { dateLabel: string; amount: number; donors: string[] }>();
  for (const d of donations) {
    const timestamp = parseDonationDate(d.date);
    if (timestamp === null) continue;
    const day = byDay.get(timestamp);
    if (day) {
      day.amount += d.amountUsdt;
      day.donors.push(d.donorName);
    } else {
      byDay.set(timestamp, { dateLabel: d.date, amount: d.amountUsdt, donors: [d.donorName] });
    }
  }

  let running = 0;
  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, day]) => {
      running += day.amount;
      return {
        timestamp,
        dateLabel: day.dateLabel,
        dayAmountUsdt: day.amount,
        cumulativeUsdt: running,
        donors: day.donors,
      };
    });
}

export interface TalentStage {
  id: 'verificados' | 'preseleccionados' | 'contactados';
  label: string;
  count: number;
  /** Share of the verified candidates, 0-100. */
  pctOfVerified: number;
}

export function buildTalentActivity(candidates: StudentCandidate[]): TalentStage[] {
  const total = candidates.length;
  const stage = (
    id: TalentStage['id'],
    label: string,
    count: number,
  ): TalentStage => ({
    id,
    label,
    count,
    pctOfVerified: total > 0 ? Math.round((count / total) * 100) : 0,
  });
  return [
    stage('verificados', 'Candidatos verificados', total),
    stage('preseleccionados', 'Preseleccionados', candidates.filter((c) => c.shortlisted).length),
    stage('contactados', 'Contactados', candidates.filter((c) => c.contacted).length),
  ];
}

export interface MilestoneStatusCount {
  status: AuditStatus;
  count: number;
  amountUsdt: number;
}

const MILESTONE_STATUS_ORDER: readonly AuditStatus[] = ['Aprobada', 'Pendiente', 'En Revisión'];

export function countMilestonesByStatus(milestones: AuditMilestone[]): MilestoneStatusCount[] {
  return MILESTONE_STATUS_ORDER.map((status) => {
    const matching = milestones.filter((m) => m.status === status);
    return {
      status,
      count: matching.length,
      amountUsdt: matching.reduce((acc, m) => acc + m.amountUsdt, 0),
    };
  });
}

export function formatUsdt(value: number): string {
  return `$${value.toLocaleString('es-AR')}`;
}

/** Axis-friendly: 0, 500, 1,5 mil, 50 mil. */
export function formatCompactAxis(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toLocaleString('es-AR', { maximumFractionDigits: 1 })} mil`;
  }
  return value.toLocaleString('es-AR');
}

/** Round axis ticks from 0 up to a "nice" maximum that contains `maxValue`. */
export function niceTicks(maxValue: number, targetCount = 4): { max: number; ticks: number[] } {
  if (!(maxValue > 0)) return { max: 1, ticks: [0, 1] };
  const rawStep = maxValue / targetCount;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const residual = rawStep / magnitude;
  const factor = residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  const step = factor * magnitude;
  const max = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= max + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { max, ticks };
}
