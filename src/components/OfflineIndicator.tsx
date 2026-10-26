import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 bg-amber-600/95 backdrop-blur-md text-white text-xs font-semibold py-2 px-4 shadow-md flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Оффлайн режим — меню и данные загружены из локальной памяти устройства</span>
    </div>
  );
};
