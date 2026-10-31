export type UserRole = 'alumno' | 'patrocinador' | 'institucion';

export enum ScreenId {
  IngresoEstudiantes = 'ingreso-estudiantes',
  MiBeca = 'mi-beca',
  RetiroCompletado = 'retiro-completado',
  RetirarAMiCuenta = 'retirar-a-mi-cuenta',
  PanelAuditoria = 'panel-auditoria',
  PerfilProfesional = 'perfil-profesional',
  BusquedaTalento = 'busqueda-talento',
  RecepcionDonaciones = 'recepcion-donaciones',
  PortalInstitucion = 'portal-institucion',
  GraficosPatrocinador = 'graficos-patrocinador',
}

export enum TransitionType {
  Push = 'push',
  PushBack = 'push_back',
  SlideUp = 'slide_up',
  None = 'none',
}

export type CourseStatus = 'Aprobada' | 'Pendiente' | 'En Curso' | 'Desaprobada';

export interface InstitutionEnrollment {
  id: string;
  studentName: string;
  legajo: string;
  university: string;
  courseId?: string;
  courseCode: string;
  courseName: string;
  semester: string;
  rewardUsdt: number;
  grade: number | null;
  actaReference: string | null;
  status: 'Pendiente de Nota' | 'Aprobada · Liberado' | 'Desaprobada · Sin Desembolso';
  updatedAt: string;
}

export interface CourseRecord {
  id: string;
  code: string;
  name: string;
  semester: string;
  credits: number;
  grade: number | null;
  status: CourseStatus;
  rewardUsdt: number;
  verifiedDate?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  alias: string;
  maskedIdentifier: string;
  currency: 'ARS' | 'USD';
  isPrimary?: boolean;
}

export interface TransactionRecord {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  amountUsdt: number;
  direction: 'credit' | 'debit';
  referenceCode: string;
  status: 'Completado' | 'En proceso';
}

export interface WithdrawalReceipt {
  id: string;
  amountUsdt: number;
  exchangeRateArs: number;
  convertedArs: number;
  destinationBank: string;
  destinationAlias: string;
  destinationMasked: string;
  currency: 'ARS' | 'USD';
  timestamp: string;
  referenceHash: string;
}

export interface JobOffer {
  id: string;
  company: string;
  role: string;
  modality: 'Remoto' | 'Híbrido' | 'Presencial';
  location: string;
  monthlyStipendUsd: number;
  requiredCourses: string[];
  matchScore: number;
  type: 'Pasantía Rentada' | 'Junior Full-Time';
  postedAgo: string;
  applied: boolean;
}

export interface StudentCandidate {
  id: string;
  fullName: string;
  initials: string;
  university: string;
  major: 'Ingeniería en Sistemas' | 'Ingeniería Industrial' | 'Ingeniería Electrónica' | 'Ciencia de Datos';
  yearLevel: string;
  gpa: number;
  verifiedCourses: number;
  skills: string[];
  availability: 'Inmediata' | 'Pasantía 20h' | 'Graduación Dic 2026';
  shortlisted: boolean;
  contacted: boolean;
}

export type AuditStatus = 'Aprobada' | 'Pendiente' | 'En Revisión';

export interface AuditMilestone {
  id: string;
  studentName: string;
  legajo: string;
  university: string;
  courseCode: string;
  courseName: string;
  grade: number;
  amountUsdt: number;
  actaReference: string;
  submittedAt: string;
  status: AuditStatus;
}

export type DonorCategory = 'Aporte Corporativo ESG' | 'Donación Filantrópica' | 'Suscripción Portal Talento';

export interface DonationRecord {
  id: string;
  donorName: string;
  category: DonorCategory;
  programTarget: string;
  amountUsdt: number;
  date: string;
  certificateId: string;
  status: 'Acreditado' | 'Asignado a Bóveda';
}

export type ProfileSection = 'perfil' | 'ofertas';

export interface NavigationResolution {
  nextScreen: ScreenId;
  transition: TransitionType;
  profileInitialSection?: ProfileSection;
}

/** One tab of the single, always-visible header navigation of a role. */
export interface RoleNavItem {
  id: string;
  label: string;
  screen: ScreenId;
  profileSection?: ProfileSection;
}
