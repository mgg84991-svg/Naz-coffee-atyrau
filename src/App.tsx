import React from 'react';
import { CoffeeProvider, useCoffee } from './context/CoffeeContext';
import { Header } from './components/Header';
import { MenuSection } from './components/MenuSection';
import { DrinkCalculator } from './components/DrinkCalculator';
import { CartDrawer } from './components/CartDrawer';
import { UserCabinetModal } from './components/UserCabinetModal';
import { TableBookingModal } from './components/TableBookingModal';
import { ReviewModal } from './components/ReviewModal';
import { OwnerPinModal } from './components/OwnerPinModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { MobileBottomNav } from './components/MobileBottomNav';
import {
  UtensilsCrossed,
  Calendar,
  MapPin,
  Clock,
  Wifi,
  Phone,
  Coffee,
  MessageSquare,
  User,
  Sparkles,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    viewMode,
    guestTab,
    setGuestTab,
    brand,
    setIsBookingModalOpen,
    setIsReviewModalOpen,
    setIsUserModalOpen,
  } = useCoffee();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf7f2] text-[#231c16]">
      {/* PWA Mobile App Install Top Banner */}
      <PWAInstallBanner />

      {/* Connectivity Status Indicator */}
      <OfflineIndicator />

      {/* Main Header */}
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        {/* MAIN VIEW: GUEST VIEW (MENU, CALCULATOR, BOOKING) */}
        {viewMode === 'guest' && (
          <div className="space-y-6">
            {/* Guest Action Bar: Menu, Calculator, Booking, Review */}
            <div className="border-b border-[#e8dfd5] bg-[#ffffff] sticky top-16 z-30 shadow-xs">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-2.5 gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setGuestTab('menu')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      guestTab === 'menu'
                        ? 'bg-[#935a22] text-white shadow-xs'
                        : 'text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0] border border-[#e8dfd5]'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Меню (Напитки и Блюда)</span>
                  </button>

                  <button
                    onClick={() => setGuestTab('calculator')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      guestTab === 'calculator'
                        ? 'bg-[#935a22] text-white shadow-xs'
                        : 'text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0] border border-[#e8dfd5]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#935a22]" />
                    <span>Конструктор напитка</span>
                  </button>

                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0] flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer border border-[#e8dfd5]"
                  >
                    <Calendar className="w-4 h-4 text-[#935a22]" />
                    <span>Бронь столика</span>
                  </button>

                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs font-semibold text-[#705e4f] hover:text-[#231c16] hover:bg-[#faf6f0] items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer border border-[#e8dfd5]"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#935a22]" />
                    <span>Оставить отзыв</span>
                  </button>
                </div>

                <div className="hidden lg:flex items-center gap-4 text-xs text-[#705e4f]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Wifi className="w-3.5 h-3.5 text-[#935a22]" />
                    <span>{brand.wifiName}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Столики свободны • г. Атырау</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Active Guest Tab View */}
            {guestTab === 'menu' && <MenuSection />}
            {guestTab === 'calculator' && (
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <DrinkCalculator />
              </div>
            )}
          </div>
        )}

        {/* OWNER & ADMIN DASHBOARD */}
        {viewMode === 'admin' && <AdminDashboard />}
      </main>

      {/* Native Mobile Bottom Navigation Bar (Fixed at bottom on phones) */}
      <MobileBottomNav />

      {/* Global Modals */}
      <CartDrawer />
      <UserCabinetModal />
      <TableBookingModal />
      <ReviewModal />
      <OwnerPinModal />
      <PushNotificationToast />

      {/* Warm Light Coffee Footer */}
      <footer className="border-t border-[#e8dfd5] bg-[#ffffff] text-xs text-[#705e4f] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#faf6f0] border border-[#ded0c1] flex items-center justify-center shadow-xs">
                <Coffee className="w-4 h-4 text-[#935a22]" />
              </div>
              <div>
                <span className="font-display font-extrabold text-base text-[#231c16]">
                  {brand.shopName}
                </span>
                <span className="text-[11px] text-[#705e4f] block font-medium">
                  {brand.tagline}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#705e4f]">
              <span className="flex items-center gap-1.5 font-semibold text-[#231c16]">
                <MapPin className="w-4 h-4 text-[#935a22]" />
                {brand.cityAddress}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#935a22]" />
                {brand.openingHours}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-[#935a22]" />
                {brand.phone}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-[11px] font-mono px-3 py-1 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-[#231c16]">
                Wi-Fi: <strong>{brand.wifiName}</strong> ({brand.wifiPass})
              </div>
              <button
                onClick={() => setIsUserModalOpen(true)}
                className="p-2 rounded-xl border border-[#ded0c1] hover:bg-[#faf6f0] transition-colors cursor-pointer flex items-center justify-center text-[#935a22]"
                title="Кабинет"
                aria-label="Кабинет"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0eae3] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8f7e70]">
            <span>
              © {new Date().getFullYear()} {brand.shopName} (г. Атырау). Все права защищены.
            </span>
            <span className="font-medium">
              Оплата заказов производится на кассе кофейни (наличные, банковские карты, Kaspi QR). Все уведомления поступают в Telegram Gainiden Madina.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <CoffeeProvider>
      <MainContent />
    </CoffeeProvider>
  );
}
