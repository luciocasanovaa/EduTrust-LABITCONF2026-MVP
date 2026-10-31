import { LogOut } from 'lucide-react';
import { RoleNavItem, UserRole } from '../types/edutrust';
import { ROLE_NAV_ITEMS } from '../utils/edutrustLogic';

const ROLE_STYLE: Record<
  UserRole,
  { label: string; chip: string; dot: string; maxWidth: string }
> = {
  alumno: {
    label: 'Alumno',
    chip: 'bg-[#EFF4FF] text-[#2B59FF]',
    dot: 'bg-[#2B59FF]',
    maxWidth: 'max-w-[1200px]',
  },
  patrocinador: {
    label: 'Patrocinador',
    chip: 'bg-[#ECFDF3] text-[#027A48]',
    dot: 'bg-[#12B76A]',
    maxWidth: 'max-w-[1360px]',
  },
  institucion: {
    label: 'Institución',
    chip: 'bg-[#FEF0C7] text-[#B54708]',
    dot: 'bg-[#B54708]',
    maxWidth: 'max-w-[1200px]',
  },
};

interface AppHeaderProps {
  role: UserRole;
  /** `id` of the ROLE_NAV_ITEMS tab that matches the current page. */
  activeNavId: string;
  /** Not needed for roles with a single page (their only tab is always active). */
  onSelectNav?: (item: RoleNavItem) => void;
  onLogout: () => void;
}

/**
 * The one header used by every logged-in page. Tabs come from ROLE_NAV_ITEMS so
 * they are identical (label, order, position) wherever the user is.
 */
export function AppHeader({
  role,
  activeNavId,
  onSelectNav,
  onLogout,
}: AppHeaderProps) {
  const style = ROLE_STYLE[role];
  const items = ROLE_NAV_ITEMS[role];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div
        className={`${style.maxWidth} mx-auto px-4 md:px-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-x-4 md:gap-x-8`}
      >
        {/* Brand + who you are */}
        <div className="order-1 h-14 md:h-16 flex items-center gap-2.5 shrink-0">
          <span className="w-7 h-7 rounded-lg bg-[#2B59FF] text-white flex items-center justify-center text-xs font-bold">
            ET
          </span>
          <span className="hidden sm:inline text-lg font-bold tracking-tight text-[#0F172A]">
            EduTrust
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style.chip}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
            {style.label}
          </span>
        </div>

        {/* Tabs: always visible, always the same. Full-width second row on mobile. */}
        <nav
          aria-label={`Navegación de ${style.label}`}
          className="order-3 md:order-2 w-[calc(100%+2rem)] md:w-auto md:flex-1 md:justify-start flex items-stretch md:gap-1 border-t border-slate-100 md:border-t-0 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto"
        >
          {items.map((item) => {
            const isActive = item.id === activeNavId;
            return (
              <button
                key={item.id}
                type="button"
                data-nav-id={item.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => {
                  if (!isActive) onSelectNav?.(item);
                }}
                className={`relative flex-1 md:flex-none h-12 md:h-16 px-3 md:px-4 inline-flex items-center justify-center gap-1.5 text-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer after:absolute after:inset-x-3 md:after:inset-x-4 after:bottom-0 after:h-0.5 after:rounded-full ${
                  isActive
                    ? 'text-[#2B59FF] font-semibold after:bg-[#2B59FF]'
                    : 'text-[#475467] font-medium hover:text-[#0F172A] after:bg-transparent hover:after:bg-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Session */}
        <div className="order-2 md:order-3 h-14 md:h-16 flex items-center shrink-0">
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-[#0F172A] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#475467]" aria-hidden="true" />
            <span>Cambiar perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
}
