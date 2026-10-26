import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Smartphone,
  PlusSquare,
  Check,
  ExternalLink,
  Sparkles,
  ArrowDown,
  Copy,
} from 'lucide-react';

interface IPhoneInstallShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IPhoneInstallShareModal: React.FC<IPhoneInstallShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [sharedSuccess, setSharedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://naz-coffee.vercel.app';

  // Handle native Web Share API (opens iOS Share Sheet in Safari)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NAZ COFFEE Атырау',
          text: 'Спешелти кофейня NAZ COFFEE в г. Атырау: меню напитков, свежие десерты и онлайн-заказ',
          url: currentUrl,
        });
        setSharedSuccess(true);
        setTimeout(() => setSharedSuccess(false), 3000);
      } catch (err) {
        // User closed or cancelled share dialog
        console.log('Share dismissed or failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1a110a]/80 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-[#ffffff] rounded-t-3xl sm:rounded-3xl border border-[#e8dfd5] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#f0eae3] bg-[#faf6f0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2c1e14] border border-[#c89257]/40 flex items-center justify-center text-[#e8bf83] shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#231c16]">
                Для iPhone и Safari
              </h3>
              <p className="text-[11px] text-[#705e4f]">
                Поделиться и установить на экран Домой
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* iOS Icon Preview Card */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-[#2c1e14] via-[#20150d] to-[#140d08] text-white border border-[#c89257]/30 flex items-center gap-4 shadow-lg">
            {/* Apple Touch Icon */}
            <div className="relative group shrink-0">
              <img
                src="/apple-touch-icon.png"
                alt="Иконка NAZ COFFEE для iPhone"
                className="w-18 h-18 rounded-[22%] object-cover shadow-2xl border-2 border-[#e8bf83]/60 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#c89257] text-[#1a110a] text-[9px] font-black uppercase tracking-wider shadow-xs">
                iOS
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-[#e8bf83] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Фирменная иконка NAZ</span>
              </div>
              <h4 className="font-display font-extrabold text-base text-white tracking-wide truncate mt-0.5">
                NAZ COFFEE
              </h4>
              <p className="text-[11px] text-[#ded0c1] leading-tight mt-0.5">
                Готова для добавления на рабочий стол iPhone
              </p>
            </div>
          </div>

          {/* Quick Action Buttons: Share & Download Icon */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* 1. Share button (triggers native iOS Share Sheet) */}
            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Поделиться</span>
            </button>

            {/* 2. Download Icon PNG button */}
            <a
              href="/apple-touch-icon-512x512.png"
              download="NAZ_COFFEE_iPhone_Icon.png"
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#faf6f0] hover:bg-[#f0e6da] border border-[#ded0c1] text-[#231c16] text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#935a22]" />
              <span>Скачать иконку</span>
            </a>
          </div>

          {/* Copy Link fallback option */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#faf7f2] border border-[#e8dfd5] text-xs">
            <span className="text-[#705e4f] truncate pr-2 font-mono text-[11px]">
              {currentUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#ded0c1] text-[#231c16] font-semibold text-[11px] hover:bg-[#faf6f0] flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#935a22]" />
                  <span>Копировать</span>
                </>
              )}
            </button>
          </div>

          {/* Step-by-Step Visual Instruction for iPhone Safari */}
          <div className="space-y-2.5 pt-2 border-t border-[#f0eae3]">
            <h5 className="font-display font-bold text-xs uppercase tracking-wider text-[#935a22] flex items-center gap-1.5">
              <span>Как установить на экран iPhone:</span>
            </h5>

            <div className="space-y-2 text-xs">
              {/* Step 1 */}
              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ded0c1] flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#935a22] text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  1
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#231c16]">
                    Нажмите «Поделиться» внизу экрана Safari
                  </p>
                  <p className="text-[11px] text-[#705e4f] flex items-center gap-1 mt-0.5">
                    Иконка квадрата со стрелочкой вверх
                    <span className="inline-flex p-1 rounded-md bg-stone-200 text-stone-800">
                      <Share2 className="w-3 h-3" />
                    </span>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-2xl bg-[#faf7f2] border border-[#ded0c1] flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-[#935a22] text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  2
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#231c16]">
                    Прокрутите вниз и выберите «На экран «Домой»»
                  </p>
                  <p className="text-[11px] text-[#705e4f] flex items-center gap-1 mt-0.5">
                    Пункт с иконкой
                    <span className="inline-flex p-1 rounded-md bg-stone-200 text-stone-800">
                      <PlusSquare className="w-3 h-3" />
                    </span>
                    <span>(Add to Home Screen)</span>
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center gap-3 text-emerald-950">
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-2xs">
                  3
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-emerald-900">
                    Нажмите «Добавить» в правом верхнем углу
                  </p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Иконка NAZ COFFEE появится на рабочем столе и будет открываться на весь экран!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Animated arrow pointing down to Safari bottom bar on iPhone */}
          <div className="p-3 rounded-2xl bg-[#faf6f0] border border-[#ded0c1] flex items-center justify-center gap-2 text-center text-xs text-[#705e4f] animate-pulse">
            <ArrowDown className="w-4 h-4 text-[#935a22]" />
            <span className="font-semibold text-[#231c16]">
              Кнопка «Поделиться» находится в самом низу экрана Safari
            </span>
            <ArrowDown className="w-4 h-4 text-[#935a22]" />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#f0eae3] bg-[#faf6f0]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};
