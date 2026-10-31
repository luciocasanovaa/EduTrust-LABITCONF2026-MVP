import { useEffect, useState } from 'react';
import {
  DEFAULT_WITHDRAWAL_RECEIPT,
  INITIAL_AUDIT_MILESTONES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CANDIDATES,
  INITIAL_COURSES,
  INITIAL_DONATIONS,
  INITIAL_INSTITUTION_ENROLLMENTS,
  INITIAL_JOB_OFFERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_TRANSACTIONS,
} from './data/seedData';
import { BusquedaTalentoScreen } from './screens/BusquedaTalentoScreen';
import { IngresoEstudiantesScreen } from './screens/IngresoEstudiantesScreen';
import { MiBecaScreen } from './screens/MiBecaScreen';
import { PanelAuditoriaScreen } from './screens/PanelAuditoriaScreen';
import { PerfilOfertasScreen } from './screens/PerfilOfertasScreen';
import { PortalInstitucionScreen } from './screens/PortalInstitucionScreen';
import { RecepcionDonacionesScreen } from './screens/RecepcionDonacionesScreen';
import { RetirarCuentaScreen } from './screens/RetirarCuentaScreen';
import { RetiroCompletadoScreen } from './screens/RetiroCompletadoScreen';
import {
  BankAccount,
  DonationRecord,
  InstitutionEnrollment,
  ScreenId,
  TransitionType,
  UserRole,
  WithdrawalReceipt,
} from './types/edutrust';
import {
  canRoleAccessScreen,
  executeWithdrawal,
  NavigationTrigger,
  resolveInitialSessionFromSearch,
  resolveNavigation,
  ROLE_HOME_SCREEN,
  validateAndSubmitCourseGrade,
} from './utils/edutrustLogic';

function getTransitionClass(transition: TransitionType): string {
  switch (transition) {
    case TransitionType.Push:
      return 'transition-push';
    case TransitionType.PushBack:
      return 'transition-push_back';
    case TransitionType.SlideUp:
      return 'transition-slide_up';
    case TransitionType.None:
    default:
      return 'transition-none';
  }
}

export default function App() {
  const initialSession = resolveInitialSessionFromSearch(window.location.search);

  const [activeRole, setActiveRole] = useState<UserRole | null>(initialSession.role);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(initialSession.screen);
  const [transitionType, setTransitionType] = useState<TransitionType>(TransitionType.None);
  const [profileSection, setProfileSection] = useState<'perfil' | 'ofertas'>('perfil');

  // Student Wallet & Academic State
  const [studentProfile, setStudentProfile] = useState(INITIAL_STUDENT_PROFILE);
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [wallet, setWallet] = useState({
    availableUsdt: 420,
    totalWithdrawnUsdt: 100,
    transactions: INITIAL_TRANSACTIONS,
  });
  const [latestReceipt, setLatestReceipt] = useState<WithdrawalReceipt>(
    DEFAULT_WITHDRAWAL_RECEIPT,
  );
  const [jobOffers, setJobOffers] = useState(INITIAL_JOB_OFFERS);

  // Donor & University Institution State
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditMilestones, setAuditMilestones] = useState(INITIAL_AUDIT_MILESTONES);
  const [disbursedTotalUsdt, setDisbursedTotalUsdt] = useState<number>(84350);
  const [allocatedEngineeringUsdt, setAllocatedEngineeringUsdt] = useState<number>(125000);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);
  const [enrollments, setEnrollments] = useState<InstitutionEnrollment[]>(
    INITIAL_INSTITUTION_ENROLLMENTS,
  );

  useEffect(() => {
    document.body.dataset.screen = currentScreen;
    document.body.dataset.role = activeRole ?? 'none';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentScreen, activeRole]);

  const handleLoginAsRole = (role: UserRole) => {
    setActiveRole(role);
    setTransitionType(TransitionType.Push);
    setCurrentScreen(ROLE_HOME_SCREEN[role]);
  };

  const handleLogout = () => {
    setActiveRole(null);
    setTransitionType(TransitionType.PushBack);
    setCurrentScreen(ScreenId.IngresoEstudiantes);
  };

  const handleNavigateTrigger = (trigger: NavigationTrigger) => {
    const resolution = resolveNavigation(currentScreen, trigger);
    if (!resolution) return;

    // Login triggers from IngresoEstudiantes authenticate strictly as 'alumno'
    const nextRole =
      currentScreen === ScreenId.IngresoEstudiantes ? 'alumno' : activeRole;

    if (!canRoleAccessScreen(nextRole, resolution.nextScreen)) {
      return;
    }

    if (currentScreen === ScreenId.IngresoEstudiantes) {
      setActiveRole('alumno');
    }

    if (resolution.profileInitialSection) {
      setProfileSection(resolution.profileInitialSection);
    }
    setTransitionType(resolution.transition);
    setCurrentScreen(resolution.nextScreen);
  };

  const handleRoleGuardedScreenSelect = (nextScreen: ScreenId) => {
    if (!canRoleAccessScreen(activeRole, nextScreen)) return;
    setTransitionType(TransitionType.Push);
    setCurrentScreen(nextScreen);
  };

  // Student Quick Withdraw on Mi beca (#btn-confirmar-retiro)
  const handleQuickWithdrawConfirm = (amountUsdt: number) => {
    const primaryAccount = bankAccounts[0];
    if (primaryAccount && amountUsdt > 0) {
      const { nextWallet, receipt } = executeWithdrawal(wallet, amountUsdt, primaryAccount);
      setWallet(nextWallet);
      setLatestReceipt(receipt);
    }
    handleNavigateTrigger('btn-confirmar-retiro');
  };

  // Full Withdrawal Confirmation on Retirar a mi cuenta (#btn-confirmar)
  const handleFullWithdrawConfirm = (amountUsdt: number, account: BankAccount) => {
    const { nextWallet, receipt } = executeWithdrawal(wallet, amountUsdt, account);
    setWallet(nextWallet);
    setLatestReceipt(receipt);
    handleNavigateTrigger('btn-confirmar');
  };

  // University Institution uploads official course grade -> automatically releases USDT on pass
  const handleInstitutionSubmitGrade = (
    enrollmentId: string,
    gradeRaw: string,
    actaReferenceRaw: string,
  ) => {
    const res = validateAndSubmitCourseGrade(
      { enrollmentId, gradeRaw, actaReferenceRaw },
      {
        enrollments,
        courses,
        wallet,
        milestones: auditMilestones,
        disbursedTotalUsdt,
        activeStudentLegajo: studentProfile.legajo,
      },
    );

    if (!res.valid) {
      return { valid: false, error: res.error };
    }

    setEnrollments(res.nextEnrollments);
    setCourses(res.nextCourses);
    setWallet(res.nextWallet);
    setAuditMilestones(res.nextMilestones);
    setDisbursedTotalUsdt(res.nextDisbursedTotalUsdt);

    return {
      valid: true,
      passed: res.passed,
      releasedUsdt: res.releasedUsdt,
      studentName: res.enrollment.studentName,
      courseCode: res.enrollment.courseCode,
    };
  };

  // Register new donation in Recepción y Donaciones
  const handleRegisterDonation = (record: DonationRecord) => {
    setDonations((prev) => [record, ...prev]);
    if (record.programTarget === 'Programa Becas Ingeniería 2026') {
      setAllocatedEngineeringUsdt((prev) => prev + record.amountUsdt);
    }
  };

  const transitionClass = getTransitionClass(transitionType);

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      <div key={currentScreen} className={transitionClass}>
        {currentScreen === ScreenId.IngresoEstudiantes && (
          <IngresoEstudiantesScreen
            onNavigateTrigger={handleNavigateTrigger}
            onLoginAsRole={handleLoginAsRole}
          />
        )}

        {activeRole === 'alumno' && currentScreen === ScreenId.MiBeca && (
          <MiBecaScreen
            studentName={studentProfile.fullName}
            cohort={studentProfile.cohort}
            availableUsdt={wallet.availableUsdt}
            totalWithdrawnUsdt={wallet.totalWithdrawnUsdt}
            courses={courses}
            transactions={wallet.transactions}
            primaryAccount={bankAccounts[0]}
            onNavigateTrigger={handleNavigateTrigger}
            onQuickWithdrawConfirm={handleQuickWithdrawConfirm}
            onLogout={handleLogout}
          />
        )}

        {activeRole === 'alumno' && currentScreen === ScreenId.RetirarAMiCuenta && (
          <RetirarCuentaScreen
            availableUsdt={wallet.availableUsdt}
            accounts={bankAccounts}
            onAddAccount={(acc) => setBankAccounts((prev) => [...prev, acc])}
            onConfirmWithdrawal={handleFullWithdrawConfirm}
            onNavigateTrigger={handleNavigateTrigger}
          />
        )}

        {activeRole === 'alumno' && currentScreen === ScreenId.RetiroCompletado && (
          <RetiroCompletadoScreen
            receipt={latestReceipt}
            remainingBalanceUsdt={wallet.availableUsdt}
            onNavigateTrigger={handleNavigateTrigger}
          />
        )}

        {activeRole === 'alumno' && currentScreen === ScreenId.PerfilProfesional && (
          <PerfilOfertasScreen
            profile={studentProfile}
            courses={courses}
            offers={jobOffers}
            initialSection={profileSection}
            onToggleRecruiterVisible={() =>
              setStudentProfile((prev) => ({
                ...prev,
                recruiterVisible: !prev.recruiterVisible,
              }))
            }
            onAddSkill={(skill) =>
              setStudentProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, skill],
              }))
            }
            onApplyOffer={(offerId) =>
              setJobOffers((prev) =>
                prev.map((o) => (o.id === offerId ? { ...o, applied: true } : o)),
              )
            }
            onNavigateTrigger={handleNavigateTrigger}
            onLogout={handleLogout}
          />
        )}

        {activeRole === 'donador' && currentScreen === ScreenId.PanelAuditoria && (
          <PanelAuditoriaScreen
            milestones={auditMilestones}
            allocatedVaultUsdt={allocatedEngineeringUsdt}
            disbursedTotalUsdt={disbursedTotalUsdt}
            onNavigateTrigger={handleNavigateTrigger}
            onLogout={handleLogout}
          />
        )}

        {activeRole === 'donador' && currentScreen === ScreenId.BusquedaTalento && (
          <BusquedaTalentoScreen
            candidates={candidates}
            onToggleShortlist={(id) =>
              setCandidates((prev) =>
                prev.map((c) => (c.id === id ? { ...c, shortlisted: !c.shortlisted } : c)),
              )
            }
            onContactCandidate={(id) =>
              setCandidates((prev) =>
                prev.map((c) => (c.id === id ? { ...c, contacted: true } : c)),
              )
            }
            onNavigateTrigger={handleNavigateTrigger}
            onLogout={handleLogout}
          />
        )}

        {activeRole === 'donador' && currentScreen === ScreenId.RecepcionDonaciones && (
          <RecepcionDonacionesScreen
            donations={donations}
            allocatedEngineeringUsdt={allocatedEngineeringUsdt}
            onRegisterDonation={handleRegisterDonation}
            onNavigateTrigger={handleNavigateTrigger}
            onDonorScreenSelect={handleRoleGuardedScreenSelect}
            onLogout={handleLogout}
          />
        )}

        {activeRole === 'institucion' && currentScreen === ScreenId.PortalInstitucion && (
          <PortalInstitucionScreen
            enrollments={enrollments}
            onSubmitGrade={handleInstitutionSubmitGrade}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
