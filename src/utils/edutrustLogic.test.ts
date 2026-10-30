import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_AUDIT_MILESTONES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CANDIDATES,
  INITIAL_COURSES,
  INITIAL_TRANSACTIONS,
} from '../data/seedData';
import { ScreenId, TransitionType } from '../types/edutrust';
import {
  approveMilestoneDisbursement,
  calculateAcademicSummary,
  executeWithdrawal,
  filterAuditMilestones,
  filterCandidates,
  resolveInitialScreenFromSearch,
  resolveNavigation,
  validateAndCreateDonation,
  validateWithdrawal,
} from './edutrustLogic';

test('prototype navigation spec covers all 18 required edges and transitions', () => {
  // Ingreso de Estudiantes -> Mi beca
  assert.deepEqual(resolveNavigation(ScreenId.IngresoEstudiantes, 'btn-google-auth'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.IngresoEstudiantes, 'btn-apple-auth'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.Push,
  });

  // Mi beca -> Retirar a mi cuenta, Retiro completado, Perfil Profesional y Ofertas
  assert.deepEqual(resolveNavigation(ScreenId.MiBeca, 'btn-retirar'), {
    nextScreen: ScreenId.RetirarAMiCuenta,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.MiBeca, 'btn-confirmar-retiro'), {
    nextScreen: ScreenId.RetiroCompletado,
    transition: TransitionType.SlideUp,
  });
  assert.deepEqual(resolveNavigation(ScreenId.MiBeca, 'nav-perfil'), {
    nextScreen: ScreenId.PerfilProfesional,
    transition: TransitionType.None,
    profileInitialSection: 'perfil',
  });
  assert.deepEqual(resolveNavigation(ScreenId.MiBeca, 'nav-ofertas'), {
    nextScreen: ScreenId.PerfilProfesional,
    transition: TransitionType.None,
    profileInitialSection: 'ofertas',
  });

  // Retirar a mi cuenta -> Mi beca, Retiro completado
  assert.deepEqual(resolveNavigation(ScreenId.RetirarAMiCuenta, 'header-back'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.PushBack,
  });
  assert.deepEqual(resolveNavigation(ScreenId.RetirarAMiCuenta, 'modal-close'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.PushBack,
  });
  assert.deepEqual(resolveNavigation(ScreenId.RetirarAMiCuenta, 'btn-confirmar'), {
    nextScreen: ScreenId.RetiroCompletado,
    transition: TransitionType.SlideUp,
  });

  // Retiro completado -> Mi beca
  assert.deepEqual(resolveNavigation(ScreenId.RetiroCompletado, 'return-btn'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.PushBack,
  });

  // Perfil Profesional y Ofertas -> Mi beca
  assert.deepEqual(resolveNavigation(ScreenId.PerfilProfesional, 'nav-mi-beca'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.None,
  });

  // Panel de Auditoría -> Búsqueda de Talento & Recepción y Donaciones
  assert.deepEqual(resolveNavigation(ScreenId.PanelAuditoria, 'nav-beneficiary-students'), {
    nextScreen: ScreenId.BusquedaTalento,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.PanelAuditoria, 'aside-beneficiary-students'), {
    nextScreen: ScreenId.BusquedaTalento,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.PanelAuditoria, 'aside-disbursements-vault'), {
    nextScreen: ScreenId.RecepcionDonaciones,
    transition: TransitionType.Push,
  });

  // Búsqueda de Talento -> Recepción y Donaciones & Panel de Auditoría
  assert.deepEqual(resolveNavigation(ScreenId.BusquedaTalento, 'nav-suscripcion-y-plan'), {
    nextScreen: ScreenId.RecepcionDonaciones,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.BusquedaTalento, 'header-buscar-talento'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.PushBack,
  });

  // Recepción y Donaciones -> Panel de Auditoría
  assert.deepEqual(resolveNavigation(ScreenId.RecepcionDonaciones, 'nav-programas-y-becas'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.RecepcionDonaciones, 'aside-asignacion-a-programas'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.Push,
  });
});

test('URL search query resolves initial screen and autostart cleanly', () => {
  assert.equal(resolveInitialScreenFromSearch(''), ScreenId.IngresoEstudiantes);
  assert.equal(resolveInitialScreenFromSearch('?autostart=1'), ScreenId.MiBeca);
  assert.equal(
    resolveInitialScreenFromSearch('?screen=panel-auditoria'),
    ScreenId.PanelAuditoria,
  );
});

test('withdrawal validation enforces minimum, balance cap, and valid input', () => {
  const primaryAccount = INITIAL_BANK_ACCOUNTS[0];

  const emptyCheck = validateWithdrawal('', 420, primaryAccount);
  assert.equal(emptyCheck.valid, false);

  const belowMin = validateWithdrawal('5', 420, primaryAccount);
  assert.equal(belowMin.valid, false);

  const overBalance = validateWithdrawal('500', 420, primaryAccount);
  assert.equal(overBalance.valid, false);

  const valid = validateWithdrawal('150', 420, primaryAccount, 1185);
  assert.equal(valid.valid, true);
  assert.equal(valid.parsedAmount, 150);
  assert.equal(valid.convertedArs, 177750);
  assert.equal(valid.remainingBalance, 270);
});

test('executeWithdrawal updates available balance and prepends debit transaction', () => {
  const wallet = {
    availableUsdt: 420,
    totalWithdrawnUsdt: 100,
    transactions: INITIAL_TRANSACTIONS,
  };
  const { nextWallet, receipt } = executeWithdrawal(
    wallet,
    120,
    INITIAL_BANK_ACCOUNTS[0],
    '30 Oct 2026 · 14:15',
  );

  assert.equal(nextWallet.availableUsdt, 300);
  assert.equal(nextWallet.totalWithdrawnUsdt, 220);
  assert.equal(nextWallet.transactions.length, INITIAL_TRANSACTIONS.length + 1);
  assert.equal(nextWallet.transactions[0].direction, 'debit');
  assert.equal(receipt.amountUsdt, 120);
  assert.equal(receipt.destinationBank, 'Banco Galicia');
});

test('academic summary calculates earned USDT and average grade accurately', () => {
  const summary = calculateAcademicSummary(INITIAL_COURSES);
  assert.equal(summary.approvedCount, 3);
  assert.equal(summary.pendingCount, 1);
  assert.equal(summary.inProgressCount, 1);
  assert.equal(summary.earnedUsdt, 420);
  assert.equal(summary.pendingUsdt, 280);
  assert.equal(summary.averageGrade, 9.25);
});

test('candidate filtering and audit milestone approval work end-to-end', () => {
  const systemsHighGpa = filterCandidates(INITIAL_CANDIDATES, {
    query: 'TypeScript',
    major: 'Ingeniería en Sistemas',
    minGpa: 9.0,
  });
  assert.equal(systemsHighGpa.length, 1);
  assert.equal(systemsHighGpa[0].fullName, 'Lucía Valentina Fernández');

  const pendingMilestones = filterAuditMilestones(INITIAL_AUDIT_MILESTONES, '', 'Pendiente');
  assert.equal(pendingMilestones.length, 2);

  const approval = approveMilestoneDisbursement(INITIAL_AUDIT_MILESTONES, 84350, 'aud-1');
  assert.equal(approval.releasedAmount, 160);
  assert.equal(approval.disbursedTotalUsdt, 84510);
  assert.equal(
    approval.milestones.find((m) => m.id === 'aud-1')?.status,
    'Aprobada',
  );
});

test('donation validator rejects invalid inputs and creates assigned vault record', () => {
  const invalid = validateAndCreateDonation(
    {
      donorName: '',
      category: 'Aporte Corporativo ESG',
      programTarget: 'Programa Becas Ingeniería 2026',
      amountRaw: '5000',
    },
    4,
  );
  assert.equal(invalid.valid, false);

  const valid = validateAndCreateDonation(
    {
      donorName: 'Globant STEM Fund',
      category: 'Aporte Corporativo ESG',
      programTarget: 'Programa Becas Ingeniería 2026',
      amountRaw: '25000',
    },
    4,
  );
  assert.equal(valid.valid, true);
  if (valid.valid) {
    assert.equal(valid.record.amountUsdt, 25000);
    assert.equal(valid.record.status, 'Asignado a Bóveda');
  }
});
