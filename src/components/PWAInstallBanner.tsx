import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallButton } from './PWAInstallButton';
import { Coffee, X, Sparkles } from 'lucide-react';

export const PWAInstallBanner: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('naz_pwa_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  if (isInstalled || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('naz_pwa_banner_dismissed', 'true');
  };

  return (
    <div className="bg-gradient-to-r from-[#2c1e14] via-[#3a281b] to-[#2c1e14] text-[#f5ede3] border-b border-[#c89257]/30 px-3 sm:px-4 py-2.5 shadow-md relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/apple-touch-icon.png"
            alt="NAZ COFFEE iPhone Icon"
            className="w-9 h-9 rounded-xl border border-[#c89257]/60 shadow-md shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white truncate">
              <span>NAZ COFFEE • Приложение для iPhone</span>
              <span className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-[#c89257]/30 text-[#e8bf83] text-[10px] font-medium">
                <Sparkles className="w-2.5 h-2.5" /> iOS & PWA
              </span>
            </div>
            <p className="text-[11px] text-[#ded0c1] truncate hidden sm:block">
              Добавьте на экран «Домой» в Safari для мгновенного онлайн-заказа в Атырау
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <PWAInstallButton variant="share" className="!bg-white/10 !text-white !border-white/20 hover:!bg-white/20" />
          <PWAInstallButton variant="header" className="!bg-[#c89257] hover:!bg-[#b57f46] !text-[#1a110a]" />
          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title="Скрыть"
            aria-label="Скрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
