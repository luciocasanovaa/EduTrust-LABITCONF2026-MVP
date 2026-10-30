import { useEffect, useState } from 'react';
import {
  DEFAULT_WITHDRAWAL_RECEIPT,
  INITIAL_AUDIT_MILESTONES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CANDIDATES,
  INITIAL_COURSES,
  INITIAL_DONATIONS,
  INITIAL_JOB_OFFERS,
  INITIAL_STUDENT_PROFILE,
  INITIAL_TRANSACTIONS,
} from './data/seedData';
import { BusquedaTalentoScreen } from './screens/BusquedaTalentoScreen';
import { IngresoEstudiantesScreen } from './screens/IngresoEstudiantesScreen';
import { MiBecaScreen } from './screens/MiBecaScreen';
import { PanelAuditoriaScreen } from './screens/PanelAuditoriaScreen';
import { PerfilOfertasScreen } from './screens/PerfilOfertasScreen';
import { RecepcionDonacionesScreen } from './screens/RecepcionDonacionesScreen';
import { RetirarCuentaScreen } from './screens/RetirarCuentaScreen';
import { RetiroCompletadoScreen } from './screens/RetiroCompletadoScreen';
import {
  BankAccount,
  DonationRecord,
  ScreenId,
  TransitionType,
  WithdrawalReceipt,
} from './types/edutrust';
import {
  approveMilestoneDisbursement,
  executeWithdrawal,
  NavigationTrigger,
  resolveInitialScreenFromSearch,
  resolveNavigation,
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
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() =>
    resolveInitialScreenFromSearch(window.location.search),
  );
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

  // Institutional, Corporate & Treasury State
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [auditMilestones, setAuditMilestones] = useState(INITIAL_AUDIT_MILESTONES);
  const [disbursedTotalUsdt, setDisbursedTotalUsdt] = useState<number>(84350);
  const [allocatedEngineeringUsdt, setAllocatedEngineeringUsdt] = useState<number>(125000);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATIONS);

  useEffect(() => {
    document.body.dataset.screen = currentScreen;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [currentScreen]);

  const handleNavigateTrigger = (trigger: NavigationTrigger) => {
    const resolution = resolveNavigation(currentScreen, trigger);
    if (!resolution) return;
    if (resolution.profileInitialSection) {
      setProfileSection(resolution.profileInitialSection);
    }
    setTransitionType(resolution.transition);
    setCurrentScreen(resolution.nextScreen);
  };

  const handleDirectScreenSelect = (nextScreen: ScreenId) => {
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

  // Synchronize a pending academic course in Mi beca
  const handleSyncPendingCourse = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!target || target.status === 'Aprobada') return;

    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, status: 'Aprobada', verifiedDate: '30 Oct 2026' }
          : c,
      ),
    );
    setWallet((prev) => ({
      ...prev,
      availableUsdt: Number((prev.availableUsdt + target.rewardUsdt).toFixed(2)),
      transactions: [
        {
          id: `tx-sync-${Date.now()}`,
          title: `Hito aprobado · ${target.code} ${target.name}`,
          subtitle: `Nota final: ${target.grade ?? 9}/10 · Acta verificada SIU-Guaraní`,
          date: '30 Oct 2026 · Ahora',
          amountUsdt: target.rewardUsdt,
          direction: 'credit',
          referenceCode: `EDT-SIU-${100 + prev.transactions.length}`,
          status: 'Completado',
        },
        ...prev.transactions,
      ],
    }));

    // Keep audit milestone in sync if matching courseCode
    setAuditMilestones((prev) =>
      prev.map((m) =>
        m.courseCode === target.code ? { ...m, status: 'Aprobada' } : m,
      ),
    );
  };

  // Approve milestone from Panel de Auditoría
  const handleApproveAuditMilestone = (milestoneId: string) => {
    const target = auditMilestones.find((m) => m.id === milestoneId);
    const result = approveMilestoneDisbursement(
      auditMilestones,
      disbursedTotalUsdt,
      milestoneId,
    );
    setAuditMilestones(result.milestones);
    setDisbursedTotalUsdt(result.disbursedTotalUsdt);

    // If the milestone belongs to our active student (Lucía), credit her course & wallet too
    if (target && target.legajo === studentProfile.legajo && result.releasedAmount > 0) {
      const matchingCourse = courses.find(
        (c) => c.code === target.courseCode && c.status !== 'Aprobada',
      );
      if (matchingCourse) {
        setCourses((prev) =>
          prev.map((c) =>
            c.id === matchingCourse.id
              ? { ...c, status: 'Aprobada', verifiedDate: '30 Oct 2026' }
              : c,
          ),
        );
        setWallet((prev) => ({
          ...prev,
          availableUsdt: Number((prev.availableUsdt + result.releasedAmount).toFixed(2)),
          transactions: [
            {
              id: `tx-aud-${Date.now()}`,
              title: `Desembolso liberado · ${target.courseCode} ${target.courseName}`,
              subtitle: `Auditoría Ingeniería 2026 · Acta ${target.actaReference}`,
              date: '30 Oct 2026 · Ahora',
              amountUsdt: result.releasedAmount,
              direction: 'credit',
              referenceCode: target.actaReference,
              status: 'Completado',
            },
            ...prev.transactions,
          ],
        }));
      }
    }
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
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}

          {currentScreen === ScreenId.MiBeca && (
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
              onSyncPendingCourse={handleSyncPendingCourse}
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}

          {currentScreen === ScreenId.RetirarAMiCuenta && (
            <RetirarCuentaScreen
              availableUsdt={wallet.availableUsdt}
              accounts={bankAccounts}
              onAddAccount={(acc) => setBankAccounts((prev) => [...prev, acc])}
              onConfirmWithdrawal={handleFullWithdrawConfirm}
              onNavigateTrigger={handleNavigateTrigger}
            />
          )}

          {currentScreen === ScreenId.RetiroCompletado && (
            <RetiroCompletadoScreen
              receipt={latestReceipt}
              remainingBalanceUsdt={wallet.availableUsdt}
              onNavigateTrigger={handleNavigateTrigger}
            />
          )}

          {currentScreen === ScreenId.PerfilProfesional && (
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
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}

          {currentScreen === ScreenId.PanelAuditoria && (
            <PanelAuditoriaScreen
              milestones={auditMilestones}
              allocatedVaultUsdt={allocatedEngineeringUsdt}
              disbursedTotalUsdt={disbursedTotalUsdt}
              onApproveMilestone={handleApproveAuditMilestone}
              onNavigateTrigger={handleNavigateTrigger}
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}

          {currentScreen === ScreenId.BusquedaTalento && (
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
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}

          {currentScreen === ScreenId.RecepcionDonaciones && (
            <RecepcionDonacionesScreen
              donations={donations}
              allocatedEngineeringUsdt={allocatedEngineeringUsdt}
              onRegisterDonation={handleRegisterDonation}
              onNavigateTrigger={handleNavigateTrigger}
              onDirectScreenSelect={handleDirectScreenSelect}
            />
          )}
      </div>
    </div>
  );
}
