import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  Sparkles,
  Calendar,
  Sliders,
  Calculator,
  BellRing,
  ArrowRight,
  TrendingUp,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  HeartHandshake,
  Tag,
} from 'lucide-react';

export const BrandSlide: React.FC = () => {
  const {
    brand,
    setViewMode,
    setGuestTab,
    setIsBookingModalOpen,
    setIsWaiterModalOpen,
    menu,
    stock,
    orders,
    addToCart,
  } = useCoffee();

  const [activeSlideTab, setActiveSlideTab] = useState<'vision' | 'menu' | 'tech'>('vision');

  // Real-time sales calculations for the slide
  const todayRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrdersCount = orders.length;
  const houseBeansInStock = stock.find((s) => s.id === 'stock-beans-house')?.quantity || 0;
  const featuredCoffee = menu.find((m) => m.id === 'menu-flat-white') || menu[0];
  const featuredPourover = menu.find((m) => m.id === 'menu-v60-pourover') || menu[1];
  const featuredPastry = menu.find((m) => m.id === 'menu-croissant') || menu[3];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#0c0b0a] text-[#f4efe8]">
      {/* Background Hero with Atmosphere and Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_coffee_atmosphere_1790603502421.jpg"
          alt="Интерьер спешелти кофейни"
          className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-105 scale-[1.02] transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/70 to-[#0c0b0a]/30" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0c0b0a]/40 to-[#0c0b0a]/90" />
      </div>

      {/* Main Slide Body */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full flex-1 flex flex-col justify-between">
        {/* Top Slide Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#d8be9f] font-mono-numbers">
              Прямой эфир кофейни · Склад и заказы синхронизированы
            </span>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[#b8afa4]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c89257]" />
              {brand.cityAddress}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c89257]" />
              {brand.openingHours}
            </span>
          </div>
        </div>

        {/* Hero Presentation Core */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center my-auto py-8">
          {/* Left Column: Brand Statement & Primary Calls to Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#26201b]/90 border border-[#473a2e] text-[#e8b982] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#c89257]" />
              <span>Экосистема кофейни нового поколения</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#fdfbf7] leading-[1.12] max-w-2xl text-balance">
              {brand.shopName}
            </h1>

            <p className="text-base sm:text-lg text-[#ccc4b8] max-w-xl leading-relaxed">
              {brand.tagline}. Интерактивное меню с живым калькулятором вкуса, бронирование любимых столиков и свежая обжарка каждый день.
            </p>

            {/* Quick Action Matrix */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setViewMode('guest');
                  setGuestTab('menu');
                }}
                className="px-6 py-3.5 rounded-xl bg-[#c89257] hover:bg-[#d89f62] text-[#12100e] font-bold text-sm sm:text-base transition-all shadow-lg shadow-[#c89257]/20 flex items-center gap-2 group cursor-pointer"
              >
                <span>Открыть меню и заказать</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setViewMode('guest');
                  setGuestTab('calculator');
                }}
                className="px-5 py-3.5 rounded-xl bg-[#1f1b17] hover:bg-[#2c2620] border border-[#3e352d] text-[#e8ded3] font-medium text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#c89257]" />
                <span>Конструктор напитка</span>
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-5 py-3.5 rounded-xl bg-[#1f1b17] hover:bg-[#2c2620] border border-[#3e352d] text-[#e8ded3] font-medium text-sm sm:text-base transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#c89257]" />
                <span>Забронировать столик</span>
              </button>
            </div>

            {/* Quick Value Props */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-[#f4efe8]">
                  100%
                </div>
                <div className="text-xs text-[#a39a8e] mt-0.5">Спешелти арабика</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-[#c89257]">
                  0:40 мин
                </div>
                <div className="text-xs text-[#a39a8e] mt-0.5">Скорость отклика зала</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono-numbers text-[#f4efe8]">
                  SMS
                </div>
                <div className="text-xs text-[#a39a8e] mt-0.5">Быстрая авторизация</div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Glass Showcase Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Interactive Card: Live Real-Time Pulse */}
            <div className="p-5 rounded-2xl bg-[#171412]/80 border border-[#332b24] backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-[#2b241e] border border-[#42372c]">
                    <TrendingUp className="w-4 h-4 text-[#c89257]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f4efe8]">Пульс продаж кофейни</h4>
                    <span className="text-xs text-[#8f8579]">Синхронизировано со складом</span>
                  </div>
                </div>
                <button
                  onClick={() => setViewMode('admin')}
                  className="text-xs font-semibold text-[#c89257] hover:text-[#e4a969] flex items-center gap-1 transition-colors"
                >
                  <span>Админ-панель</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#26211c]">
                  <span className="text-xs text-[#8f8579]">Выручка сегодня</span>
                  <div className="text-xl font-bold font-mono-numbers text-[#f4efe8] mt-1">
                    {todayRevenue.toLocaleString('ru-RU')} ₽
                  </div>
                  <span className="text-[11px] text-emerald-400 mt-0.5 block">
                    {totalOrdersCount} заказов выполнено
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#0f0e0d] border border-[#26211c]">
                  <span className="text-xs text-[#8f8579]">Зерно в бункерах</span>
                  <div className="text-xl font-bold font-mono-numbers text-[#f4efe8] mt-1">
                    {houseBeansInStock} кг
                  </div>
                  <span className="text-[11px] text-[#c89257] mt-0.5 block">
                    Автосписание по рецептам
                  </span>
                </div>
              </div>


            </div>

            {/* Featured Item Preview from Live Menu */}
            <div className="p-4 rounded-2xl bg-[#171412]/80 border border-[#332b24] backdrop-blur-xl flex items-center gap-4">
              <img
                src={featuredCoffee.image}
                alt={featuredCoffee.name}
                className="w-20 h-20 rounded-xl object-cover border border-[#3b3228]"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#c89257] font-semibold">
                    Хит меню
                  </span>
                  <span className="font-mono-numbers font-bold text-sm text-[#f4efe8]">
                    {featuredCoffee.price} ₽
                  </span>
                </div>
                <h5 className="font-display text-base font-semibold text-[#f4efe8] truncate mt-0.5">
                  {featuredCoffee.name}
                </h5>
                <p className="text-xs text-[#9c9388] line-clamp-1 mt-1">
                  {featuredCoffee.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => addToCart(featuredCoffee)}
                    className="px-2.5 py-1 rounded-md bg-[#c89257] text-[#12100e] text-xs font-semibold hover:bg-[#db9f5e] transition-colors"
                  >
                    В заказ
                  </button>
                  <button
                    onClick={() => {
                      setViewMode('guest');
                      setGuestTab('calculator');
                    }}
                    className="text-xs text-[#c89257] hover:underline"
                  >
                    Кастомизировать
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Slide Bar: Live System Modules Summary */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#a69c8f]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Калькулятор стоимости напитков в реальном времени</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Складской учет с автосписанием ингредиентов</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Онлайн-бронирование столиков с картой зала</span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Push-уведомления и эксклюзивные промокоды</span>
          </div>
        </div>
      </div>
    </div>
  );
};
