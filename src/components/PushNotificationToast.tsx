import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { Bell, X, Sparkles, ArrowRight, Tag } from 'lucide-react';

export const PushNotificationToast: React.FC = () => {
  const {
    activePushBanner,
    dismissPushBanner,
    setIsCartOpen,
    setViewMode,
    setGuestTab,
  } = useCoffee();

  if (!activePushBanner) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#ffffff] border border-[#e8dfd5] rounded-3xl shadow-2xl p-4 text-[#231c16] animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-[#faf6f0] border border-[#ded0c1] text-[#935a22] shrink-0 mt-0.5 shadow-sm">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#935a22]">
                Спецпредложение • NAZ COFFEE
              </span>
              <span className="text-[10px] text-[#705e4f] font-mono">
                • {activePushBanner.timestamp}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#231c16]">
              {activePushBanner.title}
            </h4>
            <p className="text-xs text-[#705e4f] leading-relaxed">
              {activePushBanner.message}
            </p>

            {activePushBanner.promoCode && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-1 rounded-xl bg-[#faf6f0] border border-[#ded0c1] text-xs font-mono font-bold text-[#935a22]">
                <Tag className="w-3.5 h-3.5" />
                <span>Промокод: <strong>{activePushBanner.promoCode}</strong></span>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={dismissPushBanner}
          className="p-1.5 text-[#705e4f] hover:text-[#231c16] rounded-lg hover:bg-[#faf6f0] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-3 mt-3 border-t border-[#f0eae3] flex items-center justify-between text-xs">
        <button
          onClick={() => {
            dismissPushBanner();
            setViewMode('guest');
            setGuestTab('menu');
          }}
          className="text-[#935a22] hover:text-[#7e4c1b] font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>Смотреть в меню</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={dismissPushBanner}
          className="text-[11px] text-[#705e4f] hover:text-[#231c16] cursor-pointer"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
