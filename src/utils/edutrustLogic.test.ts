import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_AUDIT_MILESTONES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CANDIDATES,
  INITIAL_COURSES,
  INITIAL_INSTITUTION_ENROLLMENTS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_TRANSACTIONS,
} from '../data/seedData';
import { ScreenId, TransitionType } from '../types/edutrust';
import {
  approveMilestoneDisbursement,
  calculateAcademicSummary,
  canRoleAccessScreen,
  executeWithdrawal,
  filterAuditMilestones,
  filterCandidates,
  resolveInitialScreenFromSearch,
  resolveInitialSessionFromSearch,
  resolveNavigation,
  validateAndCreateDonation,
  validateAndSubmitCourseGrade,
  validateWithdrawal,
} from './edutrustLogic';

test('prototype navigation spec covers all 18 required edges and transitions', () => {
  assert.deepEqual(resolveNavigation(ScreenId.IngresoEstudiantes, 'btn-google-auth'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.IngresoEstudiantes, 'btn-apple-auth'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.Push,
  });

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

  assert.deepEqual(resolveNavigation(ScreenId.RetiroCompletado, 'return-btn'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.PushBack,
  });

  assert.deepEqual(resolveNavigation(ScreenId.PerfilProfesional, 'nav-mi-beca'), {
    nextScreen: ScreenId.MiBeca,
    transition: TransitionType.None,
  });

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

  assert.deepEqual(resolveNavigation(ScreenId.BusquedaTalento, 'nav-suscripcion-y-plan'), {
    nextScreen: ScreenId.RecepcionDonaciones,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.BusquedaTalento, 'header-buscar-talento'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.PushBack,
  });

  assert.deepEqual(resolveNavigation(ScreenId.RecepcionDonaciones, 'nav-programas-y-becas'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.Push,
  });
  assert.deepEqual(resolveNavigation(ScreenId.RecepcionDonaciones, 'aside-asignacion-a-programas'), {
    nextScreen: ScreenId.PanelAuditoria,
    transition: TransitionType.Push,
  });
});

test('strict role isolation restricts each profile to its own screens only', () => {
  // Unauthenticated only accesses IngresoEstudiantes
  assert.equal(canRoleAccessScreen(null, ScreenId.IngresoEstudiantes), true);
  assert.equal(canRoleAccessScreen(null, ScreenId.MiBeca), false);

  // Alumno only accesses student screens
  assert.equal(canRoleAccessScreen('alumno', ScreenId.MiBeca), true);
  assert.equal(canRoleAccessScreen('alumno', ScreenId.RetirarAMiCuenta), true);
  assert.equal(canRoleAccessScreen('alumno', ScreenId.PerfilProfesional), true);
  assert.equal(canRoleAccessScreen('alumno', ScreenId.RecepcionDonaciones), false);
  assert.equal(canRoleAccessScreen('alumno', ScreenId.PortalInstitucion), false);

  // Donador only accesses donor/sponsor screens
  assert.equal(canRoleAccessScreen('donador', ScreenId.RecepcionDonaciones), true);
  assert.equal(canRoleAccessScreen('donador', ScreenId.PanelAuditoria), true);
  assert.equal(canRoleAccessScreen('donador', ScreenId.BusquedaTalento), true);
  assert.equal(canRoleAccessScreen('donador', ScreenId.MiBeca), false);
  assert.equal(canRoleAccessScreen('donador', ScreenId.PortalInstitucion), false);

  // Institucion ONLY accesses PortalInstitucion
  assert.equal(canRoleAccessScreen('institucion', ScreenId.PortalInstitucion), true);
  assert.equal(canRoleAccessScreen('institucion', ScreenId.MiBeca), false);
  assert.equal(canRoleAccessScreen('institucion', ScreenId.RecepcionDonaciones), false);
  assert.equal(canRoleAccessScreen('institucion', ScreenId.PanelAuditoria), false);
});

test('URL search query resolves initial screen, role, and autostart cleanly', () => {
  assert.equal(resolveInitialScreenFromSearch(''), ScreenId.IngresoEstudiantes);
  assert.deepEqual(resolveInitialSessionFromSearch('?autostart=1'), {
    role: 'alumno',
    screen: ScreenId.MiBeca,
  });
  assert.deepEqual(resolveInitialSessionFromSearch('?role=institucion'), {
    role: 'institucion',
    screen: ScreenId.PortalInstitucion,
  });
  assert.deepEqual(resolveInitialSessionFromSearch('?screen=panel-auditoria'), {
    role: 'donador',
    screen: ScreenId.PanelAuditoria,
  });
});

test('institution grade upload validates inputs, releases USDT on pass, and withholds on fail', () => {
  const baseSnapshot = {
    enrollments: INITIAL_INSTITUTION_ENROLLMENTS,
    courses: INITIAL_COURSES,
    wallet: {
      availableUsdt: 420,
      totalWithdrawnUsdt: 100,
      transactions: INITIAL_TRANSACTIONS,
    },
    milestones: INITIAL_AUDIT_MILESTONES,
    disbursedTotalUsdt: 84350,
    activeStudentLegajo: INITIAL_STUDENT_PROFILE.legajo,
    timestampLabel: '30 Oct 2026',
  };

  // Invalid grade rejected
  const invalidGrade = validateAndSubmitCourseGrade(
    { enrollmentId: 'enr-1', gradeRaw: '12', actaReferenceRaw: 'SIU-ACTA-90501' },
    baseSnapshot,
  );
  assert.equal(invalidGrade.valid, false);

  // Missing acta rejected
  const missingActa = validateAndSubmitCourseGrade(
    { enrollmentId: 'enr-1', gradeRaw: '9', actaReferenceRaw: '' },
    baseSnapshot,
  );
  assert.equal(missingActa.valid, false);

  // Passing grade (>= 6) automatically releases $160 USDT to Lucía's wallet
  const passResult = validateAndSubmitCourseGrade(
    { enrollmentId: 'enr-1', gradeRaw: '9', actaReferenceRaw: 'SIU-ACTA-90501' },
    baseSnapshot,
  );
  assert.equal(passResult.valid, true);
  if (passResult.valid) {
    assert.equal(passResult.passed, true);
    assert.equal(passResult.releasedUsdt, 160);
    assert.equal(passResult.nextWallet.availableUsdt, 580);
    assert.equal(passResult.nextDisbursedTotalUsdt, 84510);
    assert.equal(
      passResult.nextCourses.find((c) => c.code === 'ISI-409')?.status,
      'Aprobada',
    );
  }

  // Failing grade (< 6) records grade without releasing scholarship money
  const failResult = validateAndSubmitCourseGrade(
    { enrollmentId: 'enr-2', gradeRaw: '4', actaReferenceRaw: 'SIU-ACTA-90502' },
    baseSnapshot,
  );
  assert.equal(failResult.valid, true);
  if (failResult.valid) {
    assert.equal(failResult.passed, false);
    assert.equal(failResult.releasedUsdt, 0);
    assert.equal(failResult.nextWallet.availableUsdt, 420);
    assert.equal(failResult.nextDisbursedTotalUsdt, 84350);
    assert.equal(
      failResult.nextCourses.find((c) => c.code === 'ISI-412')?.status,
      'Desaprobada',
    );
  }
});

test('withdrawal validation and execution update wallet state cleanly', () => {
  const primaryAccount = INITIAL_BANK_ACCOUNTS[0];
  assert.equal(validateWithdrawal('', 420, primaryAccount).valid, false);
  assert.equal(validateWithdrawal('5', 420, primaryAccount).valid, false);
  assert.equal(validateWithdrawal('500', 420, primaryAccount).valid, false);

  const valid = validateWithdrawal('150', 420, primaryAccount, 1185);
  assert.equal(valid.valid, true);
  assert.equal(valid.parsedAmount, 150);

  const { nextWallet } = executeWithdrawal(
    { availableUsdt: 420, totalWithdrawnUsdt: 100, transactions: INITIAL_TRANSACTIONS },
    120,
    primaryAccount,
    '30 Oct 2026 · 14:15',
  );
  assert.equal(nextWallet.availableUsdt, 300);
});

test('academic summary, candidate filtering, and donations work accurately', () => {
  const summary = calculateAcademicSummary(INITIAL_COURSES);
  assert.equal(summary.approvedCount, 3);
  assert.equal(summary.earnedUsdt, 420);

  const systemsHighGpa = filterCandidates(INITIAL_CANDIDATES, {
    query: 'TypeScript',
    major: 'Ingeniería en Sistemas',
    minGpa: 9.0,
  });
  assert.equal(systemsHighGpa.length, 1);

  const pendingMilestones = filterAuditMilestones(INITIAL_AUDIT_MILESTONES, '', 'Pendiente');
  assert.equal(pendingMilestones.length, 2);

  const approval = approveMilestoneDisbursement(INITIAL_AUDIT_MILESTONES, 84350, 'aud-1');
  assert.equal(approval.disbursedTotalUsdt, 84510);

  const validDon = validateAndCreateDonation(
    {
      donorName: 'Globant STEM Fund',
      category: 'Aporte Corporativo ESG',
      programTarget: 'Programa Becas Ingeniería 2026',
      amountRaw: '25000',
    },
    4,
  );
  assert.equal(validDon.valid, true);
});
