import { ARS_EXCHANGE_RATE } from '../data/seedData';
import {
  AuditMilestone,
  AuditStatus,
  BankAccount,
  CourseRecord,
  DonationRecord,
  DonorCategory,
  NavigationResolution,
  ScreenId,
  StudentCandidate,
  TransactionRecord,
  TransitionType,
  WithdrawalReceipt,
} from '../types/edutrust';

export type NavigationTrigger =
  // Ingreso de Estudiantes
  | 'btn-google-auth'
  | 'btn-apple-auth'
  | 'form-institutional-login'
  // Mi beca
  | 'btn-retirar'
  | 'btn-confirmar-retiro'
  | 'nav-perfil'
  | 'nav-ofertas'
  // Retirar a mi cuenta
  | 'header-back'
  | 'btn-confirmar'
  | 'modal-close'
  // Retiro completado
  | 'return-btn'
  // Perfil Profesional y Ofertas
  | 'nav-mi-beca'
  // Panel de Auditoría
  | 'nav-beneficiary-students'
  | 'aside-beneficiary-students'
  | 'aside-disbursements-vault'
  // Búsqueda de Talento - Portal Empresas
  | 'nav-suscripcion-y-plan'
  | 'header-buscar-talento'
  // Recepción y Donaciones - Entidad Receptora
  | 'nav-programas-y-becas'
  | 'aside-asignacion-a-programas';

/**
 * Pure navigation state machine matching the exact Prototype Navigation Spec.
 */
export function resolveNavigation(
  currentScreen: ScreenId,
  trigger: NavigationTrigger,
): NavigationResolution | null {
  switch (currentScreen) {
    case ScreenId.IngresoEstudiantes:
      if (
        trigger === 'btn-google-auth' ||
        trigger === 'btn-apple-auth' ||
        trigger === 'form-institutional-login'
      ) {
        return { nextScreen: ScreenId.MiBeca, transition: TransitionType.Push };
      }
      return null;

    case ScreenId.MiBeca:
      if (trigger === 'btn-retirar') {
        return { nextScreen: ScreenId.RetirarAMiCuenta, transition: TransitionType.Push };
      }
      if (trigger === 'btn-confirmar-retiro') {
        return { nextScreen: ScreenId.RetiroCompletado, transition: TransitionType.SlideUp };
      }
      if (trigger === 'nav-perfil') {
        return {
          nextScreen: ScreenId.PerfilProfesional,
          transition: TransitionType.None,
          profileInitialSection: 'perfil',
        };
      }
      if (trigger === 'nav-ofertas') {
        return {
          nextScreen: ScreenId.PerfilProfesional,
          transition: TransitionType.None,
          profileInitialSection: 'ofertas',
        };
      }
      return null;

    case ScreenId.RetirarAMiCuenta:
      if (trigger === 'header-back' || trigger === 'modal-close') {
        return { nextScreen: ScreenId.MiBeca, transition: TransitionType.PushBack };
      }
      if (trigger === 'btn-confirmar') {
        return { nextScreen: ScreenId.RetiroCompletado, transition: TransitionType.SlideUp };
      }
      return null;

    case ScreenId.RetiroCompletado:
      if (trigger === 'return-btn') {
        return { nextScreen: ScreenId.MiBeca, transition: TransitionType.PushBack };
      }
      return null;

    case ScreenId.PerfilProfesional:
      if (trigger === 'nav-mi-beca') {
        return { nextScreen: ScreenId.MiBeca, transition: TransitionType.None };
      }
      return null;

    case ScreenId.PanelAuditoria:
      if (trigger === 'nav-beneficiary-students' || trigger === 'aside-beneficiary-students') {
        return { nextScreen: ScreenId.BusquedaTalento, transition: TransitionType.Push };
      }
      if (trigger === 'aside-disbursements-vault') {
        return { nextScreen: ScreenId.RecepcionDonaciones, transition: TransitionType.Push };
      }
      return null;

    case ScreenId.BusquedaTalento:
      if (trigger === 'nav-suscripcion-y-plan') {
        return { nextScreen: ScreenId.RecepcionDonaciones, transition: TransitionType.Push };
      }
      if (trigger === 'header-buscar-talento') {
        return { nextScreen: ScreenId.PanelAuditoria, transition: TransitionType.PushBack };
      }
      return null;

    case ScreenId.RecepcionDonaciones:
      if (trigger === 'nav-programas-y-becas' || trigger === 'aside-asignacion-a-programas') {
        return { nextScreen: ScreenId.PanelAuditoria, transition: TransitionType.Push };
      }
      return null;

    default:
      return null;
  }
}

export function resolveInitialScreenFromSearch(search: string): ScreenId {
  const params = new URLSearchParams(search);
  const explicitScreen = params.get('screen');
  if (explicitScreen && Object.values(ScreenId).includes(explicitScreen as ScreenId)) {
    return explicitScreen as ScreenId;
  }
  if (params.get('autostart') === '1') {
    return ScreenId.MiBeca;
  }
  return ScreenId.IngresoEstudiantes;
}

export interface WithdrawalValidationResult {
  valid: boolean;
  error?: string;
  parsedAmount: number;
  convertedArs: number;
  remainingBalance: number;
}

export function validateWithdrawal(
  amountRaw: string,
  availableUsdt: number,
  selectedAccount: BankAccount | undefined,
  exchangeRateArs = ARS_EXCHANGE_RATE,
): WithdrawalValidationResult {
  const cleaned = amountRaw.trim().replace(',', '.');
  if (!cleaned) {
    return {
      valid: false,
      error: 'Ingresá un monto en USDT para retirar.',
      parsedAmount: 0,
      convertedArs: 0,
      remainingBalance: availableUsdt,
    };
  }

  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return {
      valid: false,
      error: 'El monto debe ser un número válido mayor a $0.00 USDT.',
      parsedAmount: 0,
      convertedArs: 0,
      remainingBalance: availableUsdt,
    };
  }

  if (parsed < 10) {
    return {
      valid: false,
      error: 'El monto mínimo de retiro es $10.00 USDT.',
      parsedAmount: parsed,
      convertedArs: Math.round(parsed * exchangeRateArs),
      remainingBalance: availableUsdt - parsed,
    };
  }

  if (parsed > availableUsdt) {
    return {
      valid: false,
      error: `Saldo insuficiente. Disponible actual: $${availableUsdt.toFixed(2)} USDT.`,
      parsedAmount: parsed,
      convertedArs: Math.round(parsed * exchangeRateArs),
      remainingBalance: availableUsdt - parsed,
    };
  }

  if (!selectedAccount) {
    return {
      valid: false,
      error: 'Seleccioná una cuenta bancaria o billetera verificada de destino.',
      parsedAmount: parsed,
      convertedArs: Math.round(parsed * exchangeRateArs),
      remainingBalance: availableUsdt - parsed,
    };
  }

  return {
    valid: true,
    parsedAmount: Number(parsed.toFixed(2)),
    convertedArs: Math.round(parsed * exchangeRateArs),
    remainingBalance: Number((availableUsdt - parsed).toFixed(2)),
  };
}

export interface WalletState {
  availableUsdt: number;
  totalWithdrawnUsdt: number;
  transactions: TransactionRecord[];
}

export function executeWithdrawal(
  wallet: WalletState,
  amountUsdt: number,
  account: BankAccount,
  timestampLabel = '30 Oct 2026 · Ahora',
  exchangeRateArs = ARS_EXCHANGE_RATE,
): { nextWallet: WalletState; receipt: WithdrawalReceipt } {
  const normalized = Number(amountUsdt.toFixed(2));
  const convertedArs = Math.round(normalized * exchangeRateArs);
  const suffix = String(1000 + wallet.transactions.length * 37);
  const referenceHash = `EDT-LIQ-2026-${suffix}`;

  const receipt: WithdrawalReceipt = {
    id: `rcpt-${suffix}`,
    amountUsdt: normalized,
    exchangeRateArs,
    convertedArs,
    destinationBank: account.bankName,
    destinationAlias: account.alias,
    destinationMasked: account.maskedIdentifier,
    currency: account.currency,
    timestamp: timestampLabel,
    referenceHash,
  };

  const newTx: TransactionRecord = {
    id: `tx-ret-${suffix}`,
    title: `Retiro a ${account.bankName} (${account.maskedIdentifier})`,
    subtitle:
      account.currency === 'ARS'
        ? `Liquidación inmediata · $${convertedArs.toLocaleString('es-AR')} ARS`
        : `Transferencia directa · $${normalized.toFixed(2)} USD`,
    date: timestampLabel,
    amountUsdt: normalized,
    direction: 'debit',
    referenceCode: referenceHash,
    status: 'Completado',
  };

  return {
    nextWallet: {
      availableUsdt: Number(Math.max(0, wallet.availableUsdt - normalized).toFixed(2)),
      totalWithdrawnUsdt: Number((wallet.totalWithdrawnUsdt + normalized).toFixed(2)),
      transactions: [newTx, ...wallet.transactions],
    },
    receipt,
  };
}

export interface AcademicSummary {
  approvedCount: number;
  pendingCount: number;
  inProgressCount: number;
  earnedUsdt: number;
  pendingUsdt: number;
  averageGrade: number;
}

export function calculateAcademicSummary(courses: CourseRecord[]): AcademicSummary {
  let approvedCount = 0;
  let pendingCount = 0;
  let inProgressCount = 0;
  let earnedUsdt = 0;
  let pendingUsdt = 0;
  let gradeSum = 0;
  let gradedCount = 0;

  for (const c of courses) {
    if (c.status === 'Aprobada') {
      approvedCount += 1;
      earnedUsdt += c.rewardUsdt;
    } else if (c.status === 'Pendiente') {
      pendingCount += 1;
      pendingUsdt += c.rewardUsdt;
    } else {
      inProgressCount += 1;
      pendingUsdt += c.rewardUsdt;
    }
    if (typeof c.grade === 'number') {
      gradeSum += c.grade;
      gradedCount += 1;
    }
  }

  return {
    approvedCount,
    pendingCount,
    inProgressCount,
    earnedUsdt,
    pendingUsdt,
    averageGrade: gradedCount > 0 ? Number((gradeSum / gradedCount).toFixed(2)) : 0,
  };
}

export interface CandidateFilterCriteria {
  query: string;
  major: string;
  minGpa: number;
  onlyShortlisted?: boolean;
}

export function filterCandidates(
  candidates: StudentCandidate[],
  criteria: CandidateFilterCriteria,
): StudentCandidate[] {
  const q = criteria.query.trim().toLowerCase();
  return candidates.filter((c) => {
    if (criteria.major !== 'Todas' && c.major !== criteria.major) {
      return false;
    }
    if (c.gpa < criteria.minGpa) {
      return false;
    }
    if (criteria.onlyShortlisted && !c.shortlisted) {
      return false;
    }
    if (!q) {
      return true;
    }
    const haystack = [c.fullName, c.university, c.major, ...c.skills].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function filterAuditMilestones(
  milestones: AuditMilestone[],
  query: string,
  statusFilter: 'Todos' | AuditStatus,
): AuditMilestone[] {
  const q = query.trim().toLowerCase();
  return milestones.filter((m) => {
    if (statusFilter !== 'Todos' && m.status !== statusFilter) {
      return false;
    }
    if (!q) {
      return true;
    }
    const haystack = `${m.studentName} ${m.legajo} ${m.courseCode} ${m.courseName} ${m.actaReference}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function approveMilestoneDisbursement(
  milestones: AuditMilestone[],
  disbursedTotalUsdt: number,
  milestoneId: string,
): { milestones: AuditMilestone[]; disbursedTotalUsdt: number; releasedAmount: number } {
  const target = milestones.find((m) => m.id === milestoneId);
  if (!target || target.status === 'Aprobada') {
    return { milestones, disbursedTotalUsdt, releasedAmount: 0 };
  }

  const nextMilestones = milestones.map((m) =>
    m.id === milestoneId ? { ...m, status: 'Aprobada' as const } : m,
  );

  return {
    milestones: nextMilestones,
    disbursedTotalUsdt: Number((disbursedTotalUsdt + target.amountUsdt).toFixed(2)),
    releasedAmount: target.amountUsdt,
  };
}

export interface DonationFormInput {
  donorName: string;
  category: DonorCategory;
  programTarget: string;
  amountRaw: string;
}

export function validateAndCreateDonation(
  input: DonationFormInput,
  existingCount: number,
): { valid: true; record: DonationRecord } | { valid: false; error: string } {
  const name = input.donorName.trim();
  if (name.length < 3) {
    return { valid: false, error: 'Ingresá la razón social o nombre de la entidad aportante.' };
  }

  const amount = Number(input.amountRaw.trim().replace(',', '.'));
  if (!Number.isFinite(amount) || amount < 100) {
    return {
      valid: false,
      error: 'El aporte institucional mínimo para registrar en bóveda es de $100.00 USDT.',
    };
  }

  const seq = String(existingCount + 42).padStart(3, '0');
  const record: DonationRecord = {
    id: `don-new-${seq}`,
    donorName: name,
    category: input.category,
    programTarget: input.programTarget,
    amountUsdt: Number(amount.toFixed(2)),
    date: '30 Oct 2026',
    certificateId: `CERT-2026-${seq}`,
    status:
      input.programTarget === 'Programa Becas Ingeniería 2026'
        ? 'Asignado a Bóveda'
        : 'Acreditado',
  };

  return { valid: true, record };
}
