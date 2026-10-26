import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, Check, Share2 } from 'lucide-react';
import { IPhoneInstallShareModal } from './IPhoneInstallShareModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'modal' | 'share';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowIOSModal(true);
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NAZ COFFEE Атырау',
          text: 'Спешелти кофейня NAZ COFFEE в г. Атырау: кофе, десерты и онлайн-заказ',
          url: window.location.href,
        });
        return;
      } catch (err) {
        console.log('Share dismissed:', err);
      }
    }
    setShowIOSModal(true);
  };

  return (
    <>
      {variant === 'share' && (
        <button
          onClick={handleShareClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf6f0] hover:bg-[#f0e6da] border border-[#ded0c1] text-[#231c16] text-xs font-bold transition-all shadow-2xs cursor-pointer ${className}`}
          title="Поделиться или установить на iPhone"
        >
          <Share2 className="w-3.5 h-3.5 text-[#935a22]" />
          <span>Поделиться</span>
        </button>
      )}

      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2c1e14] hover:bg-[#3d2c1e] text-[#f5ede3] text-xs font-bold transition-all shadow-xs cursor-pointer border border-[#c89257]/30 ${className}`}
          title="Установить на iPhone / Android"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#e8bf83]" />
          <span className="hidden sm:inline">Для iPhone</span>
          <span className="sm:hidden">iPhone</span>
        </button>
      )}

      {variant === 'banner' && (
        <button
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#935a22] to-[#b06f2d] hover:from-[#7e4c1b] hover:to-[#935a22] text-white text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Установить / Скачать на iPhone</span>
        </button>
      )}

      {/* iPhone Share & Install Full Guide Modal */}
      <IPhoneInstallShareModal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
};
