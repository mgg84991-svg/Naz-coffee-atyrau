import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  X,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  Coffee,
} from 'lucide-react';

interface TableSpot {
  id: number;
  label: string;
  capacity: number;
  zone: 'main' | 'window' | 'lounge' | 'terrace';
  zoneName: string;
}

const TABLES: TableSpot[] = [
  { id: 1, label: 'Столик №1', capacity: 2, zone: 'main', zoneName: 'Уютный центр зала' },
  { id: 2, label: 'Столик №2', capacity: 2, zone: 'window', zoneName: 'У панорамного окна' },
  { id: 3, label: 'Столик №3', capacity: 4, zone: 'main', zoneName: 'Круглый деревянный стол' },
  { id: 4, label: 'Столик №4', capacity: 4, zone: 'window', zoneName: 'Вид на город Атырау' },
  { id: 5, label: 'Столик №5', capacity: 6, zone: 'lounge', zoneName: 'Мягкий лаунж-диван' },
  { id: 6, label: 'Столик №6', capacity: 2, zone: 'main', zoneName: 'Рядом с баром' },
  { id: 7, label: 'Столик №7', capacity: 3, zone: 'terrace', zoneName: 'Уединенный столик' },
  { id: 8, label: 'Столик №8', capacity: 4, zone: 'terrace', zoneName: 'Семейная зона' },
];

export const TableBookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    createBooking,
    user,
    bookings,
    brand,
  } = useCoffee();

  const [selectedTable, setSelectedTable] = useState<number>(2);
  const [guestCount, setGuestCount] = useState<number>(2);
  const [date, setDate] = useState<string>('Сегодня');
  const [timeSlot, setTimeSlot] = useState<string>('18:30');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(user.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user.phone || '+7 (701) 555-23-45');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isBookingModalOpen) return null;

  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00', '22:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;

    createBooking({
      tableNumber: selectedTable,
      guestCount,
      date,
      timeSlot,
      customerName,
      customerPhone,
      specialRequests: specialRequests.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsBookingModalOpen(false);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231c16]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#ffffff] border border-[#e8dfd5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#f0eae3] bg-[#faf6f0]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#f0e6da] border border-[#ded0c1] text-[#935a22]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#231c16]">
                Онлайн-бронирование столика
              </h3>
              <p className="text-xs text-[#705e4f] flex items-center gap-1.5 mt-0.5">
                <span>{brand.shopName}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-[#935a22]" />
                  г. Атырау
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="p-2 text-[#705e4f] hover:text-[#231c16] rounded-xl hover:bg-[#ede5dc] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-display text-2xl font-bold text-[#231c16]">
              Столик №{selectedTable} успешно забронирован!
            </h4>
            <p className="text-sm text-[#705e4f] max-w-md mx-auto">
              Ждем вас в кофейне {brand.shopName} ({date} в {timeSlot}). Мы с радостью подготовим уютный столик и встретим вас горячим кофе!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
            {/* Visual Floor Map */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#705e4f]">
                  1. Выберите столик на схеме зала
                </label>
                <span className="text-xs font-semibold text-[#935a22]">
                  Выбран: {TABLES.find((t) => t.id === selectedTable)?.label} ({TABLES.find((t) => t.id === selectedTable)?.zoneName})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#ebe1d5] space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TABLES.map((tbl) => {
                    const isSelected = selectedTable === tbl.id;
                    const isBusy = bookings.some(
                      (b) => b.tableNumber === tbl.id && b.status === 'confirmed' && b.date === date && b.timeSlot === timeSlot
                    );

                    return (
                      <button
                        type="button"
                        key={tbl.id}
                        onClick={() => {
                          if (!isBusy) setSelectedTable(tbl.id);
                        }}
                        disabled={isBusy}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isBusy
                            ? 'bg-[#f0ebe5] border-[#dfd6cc] opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-[#ffffff] border-[#935a22] shadow-md ring-2 ring-[#935a22]/20'
                            : 'bg-[#ffffff] border-[#e8dfd5] hover:border-[#b89f88] hover:bg-[#fffdfa]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-[#231c16]">
                          <span>{tbl.label}</span>
                          <span className="flex items-center gap-0.5 text-[10px] text-[#935a22]">
                            <Users className="w-3 h-3" />
                            {tbl.capacity}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#705e4f] mt-1 truncate">
                          {tbl.zoneName}
                        </p>
                        <div className="mt-2 text-[10px] font-semibold">
                          {isBusy ? (
                            <span className="text-rose-600">Занят</span>
                          ) : isSelected ? (
                            <span className="text-[#935a22]">✓ Выбран</span>
                          ) : (
                            <span className="text-emerald-600">Свободен</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Date, Time & Guests Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231c16]">Дата</label>
                <select
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs font-medium text-[#231c16] focus:border-[#935a22] focus:bg-white outline-none"
                >
                  <option value="Сегодня">Сегодня</option>
                  <option value="Завтра">Завтра</option>
                  <option value="Послезавтра">Послезавтра</option>
                  <option value="Суббота">Суббота</option>
                  <option value="Воскресенье">Воскресенье</option>
                </select>
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231c16]">Время визита</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs font-mono font-medium text-[#231c16] focus:border-[#935a22] focus:bg-white outline-none"
                >
                  {timeSlots.map((ts) => (
                    <option key={ts} value={ts}>
                      {ts}
                    </option>
                  ))}
                </select>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231c16]">Количество гостей</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 6].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setGuestCount(num)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        guestCount === num
                          ? 'bg-[#935a22] border-[#935a22] text-white shadow-sm'
                          : 'bg-[#faf6f0] border-[#e8dfd5] text-[#705e4f] hover:bg-[#ede5dc]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231c16]">Ваше имя</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Айгерим или Руслан"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] placeholder-[#a69687] focus:border-[#935a22] focus:bg-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#231c16]">Номер телефона</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+7 (701) 000-00-00"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs font-mono text-[#231c16] placeholder-[#a69687] focus:border-[#935a22] focus:bg-white outline-none"
                />
              </div>
            </div>

            {/* Special requests */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#231c16]">
                Пожелания (розетка для ноутбука, тихий уголок, детский стульчик)
              </label>
              <input
                type="text"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Например: столик с хорошим естественным светом для фото"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] placeholder-[#a69687] focus:border-[#935a22] focus:bg-white outline-none"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Подтвердить бронирование столика №{selectedTable}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
