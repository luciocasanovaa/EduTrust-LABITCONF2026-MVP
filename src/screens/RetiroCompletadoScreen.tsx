import React, { useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, Copy } from 'lucide-react';
import { AppHeader } from '../components/AppHeader';
import { RoleNavItem, WithdrawalReceipt } from '../types/edutrust';
import { NavigationTrigger } from '../utils/edutrustLogic';

interface RetiroCompletadoScreenProps {
  receipt: WithdrawalReceipt;
  remainingBalanceUsdt: number;
  onNavigateTrigger: (trigger: NavigationTrigger) => void;
  onSelectNav: (item: RoleNavItem) => void;
  onLogout: () => void;
}

export function RetiroCompletadoScreen({
  receipt,
  remainingBalanceUsdt,
  onNavigateTrigger,
  onSelectNav,
  onLogout,
}: RetiroCompletadoScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(receipt.referenceHash).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      <AppHeader
        role="alumno"
        activeNavId="mi-beca"
        onSelectNav={onSelectNav}
        onLogout={onLogout}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="max-w-[540px] w-full card-ambient p-6 sm:p-8">
          {/* Celebratory Emerald Emblem */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#12B76A] flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
              Retiro completado con éxito
            </h1>
            <p className="text-sm text-[#475467] mt-1">
              Los fondos de tu beca ya fueron enviados a tu cuenta bancaria titular.
            </p>
          </div>

          {/* Primary Credited Metric */}
          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 text-center mb-6 tnum">
            <span className="block text-xs font-medium text-[#475467] mb-1">
              Monto acreditado en destino
            </span>
            <div className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-tight">
              {receipt.currency === 'USD'
                ? `$${receipt.amountUsdt.toFixed(2)} USD`
                : `$${receipt.convertedArs.toLocaleString('es-AR')} ARS`}
            </div>
            <span className="block text-xs font-semibold text-[#12B76A] mt-1">
              Equivalente a ${receipt.amountUsdt.toFixed(2)} USDT · Comisión $0.00
            </span>
          </div>

          {/* Auditable Receipt Details */}
          <dl className="space-y-3 text-sm border-t border-b border-slate-100 py-4 mb-6 tnum">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#475467]">Entidad receptora</dt>
              <dd className="font-semibold text-[#0F172A] text-right">
                {receipt.destinationBank}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#475467]">Alias / CBU</dt>
              <dd className="font-mono text-xs text-[#0F172A] text-right">
                {receipt.destinationAlias} · {receipt.destinationMasked}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#475467]">Fecha y hora</dt>
              <dd className="text-[#0F172A] text-right">{receipt.timestamp}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-[#475467]">Código de operación</dt>
              <dd className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-[#0F172A]">
                  {receipt.referenceHash}
                </span>
                <button
                  type="button"
                  onClick={handleCopyHash}
                  aria-label="Copiar código de operación"
                  className="p-1.5 rounded-md hover:bg-slate-100 text-[#2B59FF] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-[#12B76A]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  )}
                </button>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <dt className="text-[#475467]">Nuevo saldo disponible en beca</dt>
              <dd className="font-semibold text-[#2B59FF]">
                ${remainingBalanceUsdt.toFixed(2)} USDT
              </dd>
            </div>
          </dl>

          {/* Exact XPath Return Button: //button[@id='return-btn'] */}
          <button
            id="return-btn"
            type="button"
            onClick={() => onNavigateTrigger('return-btn')}
            className="w-full h-12 px-5 rounded-[10px] bg-[#2B59FF] hover:bg-[#1E47E0] active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Volver a Mi beca</span>
          </button>
        </div>
      </main>
    </div>
  );
}
