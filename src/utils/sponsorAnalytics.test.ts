import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_AUDIT_MILESTONES,
  INITIAL_CANDIDATES,
  INITIAL_DONATIONS,
} from '../data/seedData';
import { DonationRecord } from '../types/edutrust';
import {
  buildFundUsage,
  buildTalentActivity,
  calculateCustodyUsdt,
  calculateVaultSummary,
  countMilestonesByStatus,
  cumulativeDonations,
  donationsByDonor,
  formatCompactAxis,
  niceTicks,
  parseDonationDate,
} from './sponsorAnalytics';

const donation = (over: Partial<DonationRecord>): DonationRecord => ({
  id: 'don-x',
  donorName: 'Entidad X',
  category: 'Donación Filantrópica',
  programTarget: 'Programa Becas Ingeniería 2026',
  amountUsdt: 1000,
  date: '30 Oct 2026',
  certificateId: 'CERT-X',
  status: 'Acreditado',
  ...over,
});

test('vault summary matches the figures shown in Recepción y Donaciones', () => {
  assert.equal(calculateCustodyUsdt(INITIAL_DONATIONS), 240500);

  const vault = calculateVaultSummary(INITIAL_DONATIONS, 125000, 84350);
  assert.equal(vault.custodyUsdt, 240500);
  assert.equal(vault.reserveUsdt, 115500);
  assert.equal(vault.executionPct, 67);
  assert.equal(vault.allocationPct, 52);
});

test('fund usage splits the custody into disbursed, committed and free reserve', () => {
  const usage = buildFundUsage(calculateVaultSummary(INITIAL_DONATIONS, 125000, 84350));
  assert.deepEqual(
    usage.map((s) => [s.id, s.amountUsdt]),
    [
      ['desembolsado', 84350],
      ['comprometido', 40650],
      ['reserva', 115500],
    ],
  );
  assert.equal(usage.reduce((acc, s) => acc + s.amountUsdt, 0), 240500);
  assert.ok(Math.abs(usage.reduce((acc, s) => acc + s.sharePct, 0) - 100) < 1e-9);

  // Never shows more disbursed than allocated, and never a negative segment.
  const over = buildFundUsage(calculateVaultSummary(INITIAL_DONATIONS, 1000, 5000));
  assert.deepEqual(
    over.map((s) => s.amountUsdt),
    [1000, 0, 239500],
  );
});

test('donations by donor are sorted by amount and merge repeated entities', () => {
  const bars = donationsByDonor([
    ...INITIAL_DONATIONS,
    donation({ donorName: 'Pomelo Fintech S.A.', category: 'Suscripción Portal Talento', amountUsdt: 5000 }),
  ]);
  assert.deepEqual(
    bars.map((b) => [b.donorName, b.amountUsdt]),
    [
      ['Fundación Techint — Fondo Ingeniería', 65000],
      ['Mercado Libre — Semillero STEM', 45000],
      ['Consejo de Graduados UTN / UBA', 28500],
      ['Pomelo Fintech S.A.', 20000],
    ],
  );
});

test('donation dates parse from the ledger format and reject anything else', () => {
  assert.equal(parseDonationDate('15 Oct 2026'), Date.UTC(2026, 9, 15));
  assert.equal(parseDonationDate('22 Sep 2026'), Date.UTC(2026, 8, 22));
  assert.equal(parseDonationDate('04 Ene 2027'), Date.UTC(2027, 0, 4));
  assert.equal(parseDonationDate('1 Set 2026'), Date.UTC(2026, 8, 1));
  assert.equal(parseDonationDate('2026-10-15'), null);
  assert.equal(parseDonationDate('15 Xyz 2026'), null);
  assert.equal(parseDonationDate(''), null);
});

test('cumulative donations are chronological and merge donations of the same day', () => {
  const series = cumulativeDonations(INITIAL_DONATIONS);
  assert.deepEqual(
    series.map((p) => [p.dateLabel, p.cumulativeUsdt]),
    [
      ['22 Sep 2026', 28500],
      ['01 Oct 2026', 43500],
      ['04 Oct 2026', 88500],
      ['15 Oct 2026', 153500],
    ],
  );

  const merged = cumulativeDonations([
    ...INITIAL_DONATIONS,
    donation({ date: '15 Oct 2026', amountUsdt: 2000 }),
    donation({ date: 'sin fecha', amountUsdt: 999 }),
  ]);
  assert.equal(merged.length, 4, 'same-day merge, unparseable date skipped');
  assert.equal(merged[3].dayAmountUsdt, 67000);
  assert.equal(merged[3].cumulativeUsdt, 155500);
  assert.equal(merged[3].donors.length, 2);
});

test('talent activity and audit milestone counters reflect the platform state', () => {
  assert.deepEqual(
    buildTalentActivity(INITIAL_CANDIDATES).map((s) => [s.id, s.count, s.pctOfVerified]),
    [
      ['verificados', 5, 100],
      ['preseleccionados', 2, 40],
      ['contactados', 1, 20],
    ],
  );
  assert.deepEqual(
    buildTalentActivity([]).map((s) => s.count),
    [0, 0, 0],
  );

  assert.deepEqual(
    countMilestonesByStatus(INITIAL_AUDIT_MILESTONES).map((m) => [m.status, m.count, m.amountUsdt]),
    [
      ['Aprobada', 2, 320],
      ['Pendiente', 2, 340],
      ['En Revisión', 1, 140],
    ],
  );
});

test('axis helpers round to clean ticks and compact labels', () => {
  assert.deepEqual(niceTicks(153500), {
    max: 200000,
    ticks: [0, 50000, 100000, 150000, 200000],
  });
  assert.deepEqual(niceTicks(7), { max: 8, ticks: [0, 2, 4, 6, 8] });
  assert.deepEqual(niceTicks(0), { max: 1, ticks: [0, 1] });
  assert.equal(formatCompactAxis(0), '0');
  assert.equal(formatCompactAxis(500), '500');
  assert.equal(formatCompactAxis(50000), '50 mil');
  assert.equal(formatCompactAxis(1500), '1,5 mil');
});
