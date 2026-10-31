import React, { useState } from 'react';
import { ArrowLeft, Building2, Check, Plus, ShieldCheck, X } from 'lucide-react';
import { ARS_EXCHANGE_RATE } from '../data/seedData';
import { AppHeader } from '../components/AppHeader';
import { BankAccount, RoleNavItem } from '../types/edutrust';
import { NavigationTrigger, validateWithdrawal } from '../utils/edutrustLogic';

interface RetirarCuentaScreenProps {
  availableUsdt: number;
  accounts: BankAccount[];
  onAddAccount: (account: BankAccount) => void;
  onConfirmWithdrawal: (amountUsdt: number, account: BankAccount) => void;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onSelectNav: (item: RoleNavItem) => void;
  onLogout: () => void;
}

export function RetirarCuentaScreen({
  availableUsdt,
  accounts,
  onAddAccount,
  onConfirmWithdrawal,
  onNavigateTrigger,
  onSelectNav,
  onLogout,
}: RetirarCuentaScreenProps) {
  const defaultWithdraw =
    availableUsdt >= 150
      ? '150.00'
      : availableUsdt >= 10
        ? availableUsdt.toFixed(2)
        : '10.00';

  const [amountInput, setAmountInput] = useState<string>(defaultWithdraw);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id ?? '',
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const [showNewAccountForm, setShowNewAccountForm] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newAlias, setNewAlias] = useState('');
  const [newCbu, setNewCbu] = useState('');
  const [newAccountError, setNewAccountError] = useState<string | null>(null);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) ?? accounts[0];
  const liveCheck = validateWithdrawal(amountInput, availableUsdt, selectedAccount);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateWithdrawal(amountInput, availableUsdt, selectedAccount);
    if (!check.valid || !selectedAccount) {
      setValidationError(check.error ?? 'Revisá los datos del retiro.');
      return;
    }
    setValidationError(null);
    onConfirmWithdrawal(check.parsedAmount, selectedAccount);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBankName.trim().length < 2 || newAlias.trim().length < 4 || newCbu.trim().length < 6) {
      setNewAccountError('Completá entidad bancaria, alias y últimos dígitos de CBU/CVU.');
      return;
    }
    const last4 = newCbu.trim().slice(-4);
    const created: BankAccount = {
      id: `acc-custom-${Date.now()}`,
      bankName: newBankName.trim(),
      accountType: 'Cuenta Bancaria Verificada',
      alias: newAlias.trim().toLowerCase(),
      maskedIdentifier: `CBU ****${last4}`,
      currency: 'ARS',
    };
    onAddAccount(created);
    setSelectedAccountId(created.id);
    setShowNewAccountForm(false);
    setNewBankName('');
    setNewAlias('');
    setNewCbu('');
    setNewAccountError(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <AppHeader
        role="alumno"
        activeNavId="mi-beca"
        onSelectNav={onSelectNav}
        onLogout={onLogout}
      />

      <main className="flex-1 max-w-[960px] w-full mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Where am I / how do I leave this step */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <button
            type="button"
            aria-label="Back"
            onClick={() => onNavigateTrigger('header-back')}
            className="min-h-[44px] -ml-3 px-3 rounded-lg hover:bg-slate-100 text-[#0F172A] flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Volver a Mi beca</span>
          </button>

          <button
            id="modal-close"
            type="button"
            aria-label="Cerrar ventana de retiro"
            onClick={() => onNavigateTrigger('modal-close')}
            className="min-h-[44px] min-w-[44px] -mr-3 rounded-lg hover:bg-slate-100 text-[#475467] hover:text-[#0F172A] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <h1 className="text-2xl md:text-[28px] font-semibold text-[#0F172A] tracking-tight mb-6">
          Retirar a mi cuenta
        </h1>

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" noValidate>
          {/* Left Column: Amount & Destination Account */}
          <div className="lg:col-span-7 space-y-6">
            {/* Amount Card */}
            <section className="card-ambient p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <label htmlFor="withdraw-amount-input" className="text-sm font-semibold text-[#0F172A]">
                  Monto a retirar (USDT)
                </label>
                <span className="text-xs text-[#475467] tnum">
                  Disponible: <strong className="text-[#2B59FF]">${availableUsdt.toFixed(2)} USDT</strong>
                </span>
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[#475467]">
                  $
                </span>
                <input
                  id="withdraw-amount-input"
                  type="number"
                  step="0.01"
                  min="10"
                  max={availableUsdt}
                  value={amountInput}
                  onChange={(e) => {
                    setAmountInput(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full h-16 pl-10 pr-20 rounded-xl border border-[#D0D5DD] bg-white text-3xl font-bold text-[#0F172A] tnum focus:outline-none focus:border-[#2B59FF] focus:ring-4 focus:ring-[#2B59FF]/15 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#475467]">
                  USDT
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {[50, 100, 250].map((val) => (
                  <button
                    key={val}
                    type="button"
                    disabled={availableUsdt < val}
                    onClick={() => {
                      setAmountInput(val.toFixed(2));
                      setValidationError(null);
                    }}
                    className="h-9 px-3.5 rounded-lg text-xs font-semibold border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 disabled:opacity-40 text-[#0F172A] tnum transition-colors cursor-pointer"
                  >
                    ${val} USDT
                  </button>
                ))}
                <button
                  type="button"
                  disabled={availableUsdt < 10}
                  onClick={() => {
                    setAmountInput(availableUsdt.toFixed(2));
                    setValidationError(null);
                  }}
                  className="h-9 px-3.5 rounded-lg text-xs font-semibold border border-[#C7D7FE] bg-[#EFF4FF] hover:bg-[#DDE8FF] disabled:opacity-40 text-[#2B59FF] transition-colors cursor-pointer"
                >
                  Usar máximo (${availableUsdt.toFixed(2)})
                </button>
              </div>

              {validationError && (
                <p role="alert" className="mt-4 text-xs font-medium text-[#BA1A1A] bg-[#FFDAD6]/60 px-3.5 py-2.5 rounded-lg">
                  {validationError}
                </p>
              )}
            </section>

            {/* Destination Bank Selector */}
            <section className="card-ambient p-6">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-[#0F172A]">
                    Cuenta de destino titular
                  </h2>
                  <p className="text-xs text-[#475467]">
                    Seleccioná CBU, CVU o caja de ahorro en dólares a tu nombre
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewAccountForm((v) => !v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2B59FF] bg-[#EFF4FF] hover:bg-[#DDE8FF] flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Vincular cuenta</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isSelected = acc.id === selectedAccount?.id;
                  return (
                    <label
                      key={acc.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2B59FF] bg-[#EFF4FF]/50 ring-2 ring-[#2B59FF]/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <input
                          type="radio"
                          name="destination-account"
                          checked={isSelected}
                          onChange={() => setSelectedAccountId(acc.id)}
                          className="sr-only"
                        />
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#2B59FF] text-white' : 'bg-[#F1F5F9] text-[#475467]'
                          }`}
                        >
                          <Building2 className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#0F172A] truncate">
                            {acc.bankName} · <span className="font-normal text-[#475467]">{acc.accountType}</span>
                          </div>
                          <div className="text-xs text-[#475467] font-mono tnum">
                            Alias: {acc.alias} · {acc.maskedIdentifier}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-mono font-semibold text-[#475467]">
                          {acc.currency}
                        </span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#2B59FF] text-white flex items-center justify-center">
                            <Check className="w-3 h-3" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {showNewAccountForm && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Nueva cuenta bancaria o billetera virtual
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newBankName}
                      onChange={(e) => setNewBankName(e.target.value)}
                      placeholder="Entidad (ej. Banco Nación)"
                      aria-label="Nombre de entidad bancaria"
                      className="h-11 px-3 rounded-lg border border-[#D0D5DD] text-xs text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                    />
                    <input
                      type="text"
                      value={newAlias}
                      onChange={(e) => setNewAlias(e.target.value)}
                      placeholder="Alias (ej. lucia.bna.beca)"
                      aria-label="Alias bancario"
                      className="h-11 px-3 rounded-lg border border-[#D0D5DD] text-xs text-[#0F172A] focus:outline-none focus:border-[#2B59FF]"
                    />
                  </div>
                  <input
                    type="text"
                    value={newCbu}
                    onChange={(e) => setNewCbu(e.target.value)}
                    placeholder="CBU / CVU de 22 dígitos"
                    aria-label="Número de CBU o CVU"
                    className="w-full h-11 px-3 rounded-lg border border-[#D0D5DD] text-xs text-[#0F172A] font-mono focus:outline-none focus:border-[#2B59FF]"
                  />
                  {newAccountError && (
                    <p className="text-xs text-[#BA1A1A]">{newAccountError}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowNewAccountForm(false)}
                      className="px-3 py-2 text-xs font-medium text-[#475467] hover:text-[#0F172A] cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateAccount}
                      className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-semibold cursor-pointer"
                    >
                      Guardar cuenta
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Settlement Breakdown & #btn-confirmar */}
          <aside className="lg:col-span-5 card-ambient p-6 space-y-5">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Resumen de liquidación
              </h2>
              <p className="text-xs text-[#475467]">
                Cotización preferencial garantizada para becarios EduTrust
              </p>
            </div>

            <div className="space-y-3 py-4 border-y border-slate-100 text-sm tnum">
              <div className="flex items-center justify-between">
                <span className="text-[#475467]">Monto debitado</span>
                <span className="font-semibold text-[#0F172A]">
                  ${(liveCheck.parsedAmount || 0).toFixed(2)} USDT
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#475467]">Tipo de cambio aplicado</span>
                <span className="font-mono text-xs text-[#0F172A]">
                  {selectedAccount?.currency === 'USD'
                    ? '1 USDT = 1.00 USD'
                    : `1 USDT = $${ARS_EXCHANGE_RATE.toLocaleString('es-AR')} ARS`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#475467]">Costo operativo y red</span>
                <span className="font-semibold text-[#12B76A]">Bonificado ($0.00)</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-[#0F172A]">Total a recibir hoy</span>
                <span className="text-lg font-bold text-[#12B76A]">
                  {selectedAccount?.currency === 'USD'
                    ? `$${(liveCheck.parsedAmount || 0).toFixed(2)} USD`
                    : `$${(liveCheck.convertedArs || 0).toLocaleString('es-AR')} ARS`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span>Saldo restante en beca</span>
                <span>${Math.max(0, liveCheck.remainingBalance).toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              id="btn-confirmar"
              type="submit"
              className="w-full h-12 px-5 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              <span>Confirmar retiro ahora</span>
            </button>

            <div className="flex items-start gap-2.5 text-xs text-[#475467]">
              <ShieldCheck className="w-4 h-4 text-[#12B76A] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Transferencia inmediata vía cámara compensadora COELSA con comprobante auditable.
              </span>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
