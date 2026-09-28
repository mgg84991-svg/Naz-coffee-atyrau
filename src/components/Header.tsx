import React from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  ShoppingBag,
  User,
  UtensilsCrossed,
  CalendarDays,
  MapPin,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    brand,
    viewMode,
    setViewMode,
    guestTab,
    setGuestTab,
    cartCount,
    cartTotal,
    setIsCartOpen,
    setIsUserModalOpen,
    setIsBookingModalOpen,
  } = useCoffee();

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#e9e0d4] text-[#2c221a] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand identity: NAZ COFFEE in Atyrau */}
        <button
          onClick={() => {
            setViewMode('guest');
            setGuestTab('menu');
          }}
          className="flex items-center gap-3 text-left group focus-visible:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f0e6d8] border border-[#dccbb8] flex items-center justify-center transition-transform group-hover:scale-105 shadow-xs">
            <Coffee className="w-5 h-5 text-[#935a22]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-xl font-bold tracking-tight text-[#2c221a] group-hover:text-[#935a22] transition-colors">
                {brand.shopName}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#935a22]" />
              г. {brand.city || 'Атырау'}
            </span>
          </div>
        </button>

        {/* Central Navigation Tabs for Guests: ONLY Menu and Booking (NO waiter call) */}
        <nav className="hidden sm:flex items-center gap-2 text-sm font-medium">
          <button
            onClick={() => {
              setViewMode('guest');
              setGuestTab('menu');
            }}
            className={`px-3.5 py-1.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              viewMode === 'guest' && guestTab === 'menu'
                ? 'bg-[#935a22] text-white font-bold shadow-xs'
                : 'text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Меню (Напитки и Блюда)</span>
          </button>

          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0] transition-colors flex items-center gap-2 whitespace-nowrap cursor-pointer border border-[#e8dfd5]"
          >
            <CalendarDays className="w-4 h-4 text-[#935a22]" />
            <span>Бронь столика</span>
          </button>
        </nav>

        {/* Right Actions: User Icon (person icon), Shopping Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Icon: simply an icon of a person */}
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl border border-[#ded0c1] bg-[#faf6f0] hover:bg-[#f0e6da] text-[#705e4f] hover:text-[#231c16] transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
            title="Кабинет"
            aria-label="Кабинет"
          >
            <User className="w-5 h-5 text-[#935a22]" />
          </button>

          {/* Shopping Cart Button with Live Cost in Tenge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-semibold text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Корзина</span>
            {cartCount > 0 ? (
              <span className="font-mono px-2 py-0.5 bg-white text-[#935a22] text-xs font-bold rounded-full shadow-xs">
                {cartTotal.toLocaleString('ru-RU')} ₸
              </span>
            ) : (
              <span className="font-mono text-xs opacity-90">0 ₸</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
