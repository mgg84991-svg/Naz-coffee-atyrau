import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UtensilsCrossed, Sparkles, ShoppingBag, Calendar, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    guestTab,
    setGuestTab,
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsBookingModalOpen,
    setIsUserModalOpen,
  } = useCoffee();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/95 backdrop-blur-lg border-t border-[#e8dfd5] shadow-[0_-4px_16px_rgba(44,30,20,0.08)] pb-[env(safe-area-inset-bottom,0px)]"
      aria-label="Мобильная навигация"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center px-1">
        {/* Menu Tab */}
        <button
          onClick={() => {
            setViewMode('guest');
            setGuestTab('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 text-center transition-colors cursor-pointer ${
            viewMode === 'guest' && guestTab === 'menu'
              ? 'text-[#935a22] font-bold'
              : 'text-[#857467] hover:text-[#231c16]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${viewMode === 'guest' && guestTab === 'menu' ? 'bg-[#faf6f0]' : ''}`}>
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Меню</span>
        </button>

        {/* Drink Calculator Tab */}
        <button
          onClick={() => {
            setViewMode('guest');
            setGuestTab('calculator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center h-full w-full py-1 text-center transition-colors cursor-pointer ${
            viewMode === 'guest' && guestTab === 'calculator'
              ? 'text-[#935a22] font-bold'
              : 'text-[#857467] hover:text-[#231c16]'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${viewMode === 'guest' && guestTab === 'calculator' ? 'bg-[#faf6f0]' : ''}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Конструктор</span>
        </button>

        {/* Cart Tab with Count Badge */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-center relative text-[#857467] hover:text-[#935a22] cursor-pointer"
        >
          <div className="relative p-1 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-[#935a22]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 px-1.5 min-w-[18px] h-[18px] rounded-full bg-[#935a22] text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs animate-in zoom-in-75">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold text-[#231c16] tracking-tight mt-0.5">
            {cartTotal > 0 ? `${cartTotal.toLocaleString('ru-RU')} ₸` : 'Корзина'}
          </span>
        </button>

        {/* Table Booking Tab */}
        <button
          onClick={() => setIsBookingModalOpen(true)}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-center text-[#857467] hover:text-[#935a22] transition-colors cursor-pointer"
        >
          <div className="p-1 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Бронь</span>
        </button>

        {/* Profile / Owner Cabinet Tab */}
        <button
          onClick={() => setIsUserModalOpen(true)}
          className="flex flex-col items-center justify-center h-full w-full py-1 text-center text-[#857467] hover:text-[#935a22] transition-colors cursor-pointer"
        >
          <div className="p-1 rounded-xl">
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">Кабинет</span>
        </button>
      </div>
    </nav>
  );
};
