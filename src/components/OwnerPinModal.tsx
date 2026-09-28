import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { Lock, X, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const OwnerPinModal: React.FC = () => {
  const {
    isOwnerPinModalOpen,
    setIsOwnerPinModalOpen,
    loginAsOwner,
    setViewMode,
  } = useCoffee();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOwnerPinModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAsOwner(pin)) {
      setError(false);
      setPin('');
      setIsOwnerPinModalOpen(false);
      setViewMode('admin');
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#faf7f2] border border-[#e2d8cd] rounded-3xl shadow-2xl p-6 text-[#2c221a]">
        <button
          onClick={() => {
            setIsOwnerPinModalOpen(false);
            setError(false);
            setPin('');
          }}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-200/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#f2e8dc] text-[#9c6530] flex items-center justify-center mx-auto border border-[#e2d4c3]">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-[#2c221a]">
            Вход для владелицы
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Только вы можете изменять меню, цены и рассчитывать себестоимость ингредиентов
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 block text-center">
              Введите PIN-код владелицы
            </label>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              placeholder="••••"
              className="w-full py-3 text-center text-2xl font-mono tracking-[10px] bg-white border border-[#e2d8cd] rounded-xl text-[#2c221a] focus:border-[#9c6530] outline-none shadow-sm"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 text-center flex items-center justify-center gap-1.5">
              <ShieldAlert className="w-4 h-4" />
              <span>Неверный PIN-код</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};
