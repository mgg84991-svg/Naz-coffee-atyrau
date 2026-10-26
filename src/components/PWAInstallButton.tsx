import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'modal';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA mode
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
        <Check className="w-3.5 h-3.5 text-emerald-600" />
        <span>Установлено</span>
      </span>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General instructions for browser menu
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c1e14] hover:bg-[#3d2c1e] text-[#f5ede3] text-xs font-bold transition-all shadow-xs cursor-pointer border border-[#c89257]/30 ${className}`}
          title="Установить как приложение на телефон"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#e8bf83]" />
          <span className="hidden md:inline">Установить PWA</span>
          <span className="md:hidden">Приложение</span>
        </button>
      )}

      {variant === 'banner' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#935a22] to-[#b06f2d] hover:from-[#7e4c1b] hover:to-[#935a22] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Установить на экран телефона</span>
        </button>
      )}

      {/* Guide modal for iOS and devices needing home-screen pinning */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-[#ffffff] p-6 shadow-2xl border border-[#e8dfd5] text-[#231c16] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0eae3]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#faf6f0] border border-[#ded0c1] flex items-center justify-center shadow-xs">
                  <Smartphone className="w-5 h-5 text-[#935a22]" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#231c16]">
                    Установка NAZ COFFEE
                  </h3>
                  <p className="text-[11px] text-[#705e4f]">
                    Как добавить приложение на экран
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-xl hover:bg-[#faf6f0] text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#4a3f35] leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ded0c1] flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#935a22] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <p className="font-semibold text-[#231c16]">
                    Откройте меню браузера
                  </p>
                  <p className="text-[11px] text-[#705e4f] mt-0.5">
                    {isIOS ? (
                      <>Нажмите иконку <Share className="inline w-3.5 h-3.5 text-[#935a22] mx-1" /> («Поделиться») в нижней панели Safari.</>
                    ) : (
                      <>Нажмите на три точки меню (⋮) в верхнем углу браузера Chrome / Яндекс.</>
                    )}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ded0c1] flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#935a22] text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <p className="font-semibold text-[#231c16]">
                    Выберите «На экран «Домой»»
                  </p>
                  <p className="text-[11px] text-[#705e4f] mt-0.5 flex items-center gap-1">
                    <PlusSquare className="w-3.5 h-3.5 text-[#935a22] shrink-0" />
                    <span>Пункт «Добавить на главный экран» или «Установить приложение».</span>
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <p className="font-semibold text-emerald-900">
                    Готово!
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Иконка NAZ COFFEE появится на рабочем столе смартфона и будет запускаться мгновенно без адресной строки.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-3 rounded-2xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
            >
              Понятно, закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
};
