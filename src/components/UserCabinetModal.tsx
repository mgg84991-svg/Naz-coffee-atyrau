import React, { useState, useMemo } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { MenuItem, ShiftReport, ProductCategory, ItemType, Promotion } from '../types';
import {
  X,
  User,
  Calculator,
  FileSpreadsheet,
  Trash2,
  Save,
  CheckCircle2,
  TrendingUp,
  QrCode,
  CreditCard,
  Banknote,
  Coffee,
  Lock,
  UtensilsCrossed,
  Delete,
  Plus,
  Image as ImageIcon,
  Upload,
  Tag,
  Send,
  MapPin,
  Clock,
  Phone,
  Wifi,
  Edit2,
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShoppingBag,
} from 'lucide-react';

export const UserCabinetModal: React.FC = () => {
  const {
    isUserModalOpen,
    setIsUserModalOpen,
    brand,
    updateBrand,
    menu,
    addMenuItem,
    updateMenuItem,
    updateItemPrice,
    updateItemCostPrice,
    toggleItemAvailability,
    deleteMenuItem,
    shiftReports,
    addShiftReport,
    deleteShiftReport,
    promotions,
    addPromotion,
    updatePromotion,
    togglePromotion,
    deletePromotion,
    telegramLogs,
    sendTelegramNotification,
    isOwnerAuthenticated,
    loginAsOwner,
    logoutOwner,
  } = useCoffee();

  // PIN Gate State
  const [pin, setPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  // Tabs once unlocked by 2026
  const [activeTab, setActiveTab] = useState<
    'cost_calculator' | 'shift_report' | 'menu_prices' | 'promotions' | 'telegram' | 'address'
  >('cost_calculator');

  // Handle PIN entry
  const handleDigitPress = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setPinError(false);
      if (nextPin.length === 4) {
        if (nextPin === '2026') {
          loginAsOwner('2026');
          setPin('');
        } else {
          setPinError(true);
          setTimeout(() => {
            setPin('');
            setPinError(false);
          }, 1000);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setPinError(false);
  };

  const handleClearPin = () => {
    setPin('');
    setPinError(false);
  };

  const handleLockAndClose = () => {
    logoutOwner();
    setPin('');
    setPinError(false);
    setIsUserModalOpen(false);
  };

  const handleLockOnly = () => {
    logoutOwner();
    setPin('');
    setPinError(false);
  };

  // -------------------------------------------------------------
  // 1. КАЛЬКУЛЯТОР СЕБЕСТОИМОСТИ (FOOD COST)
  // -------------------------------------------------------------
  const [selectedItemId, setSelectedItemId] = useState<string>(menu[0]?.id || '');
  const [costCoffeeGrams, setCostCoffeeGrams] = useState<number>(18);
  const [costCoffeePricePerKg, setCostCoffeePricePerKg] = useState<number>(12000);
  const [costMilkMl, setCostMilkMl] = useState<number>(200);
  const [costMilkPricePerLiter, setCostMilkPricePerLiter] = useState<number>(850);
  const [costSyrupMl, setCostSyrupMl] = useState<number>(20);
  const [costSyrupPricePerLiter, setCostSyrupPricePerLiter] = useState<number>(4500);
  const [costCupLidPrice, setCostCupLidPrice] = useState<number>(45);
  const [costOtherExtras, setCostOtherExtras] = useState<number>(30);
  const [targetSellPrice, setTargetSellPrice] = useState<number>(1600);
  const [costUpdatedNotice, setCostUpdatedNotice] = useState<string | null>(null);

  const handleSelectMenuItem = (id: string) => {
    setSelectedItemId(id);
    const item = menu.find((m) => m.id === id);
    if (item) {
      setTargetSellPrice(item.price);
      if (item.name.toLowerCase().includes('эспрессо') || item.name.toLowerCase().includes('американо')) {
        setCostMilkMl(0);
      } else if (item.category === 'tea') {
        setCostCoffeeGrams(0);
        setCostMilkMl(250);
      }
    }
  };

  const beansCost = (costCoffeeGrams / 1000) * costCoffeePricePerKg;
  const milkCost = (costMilkMl / 1000) * costMilkPricePerLiter;
  const syrupCost = (costSyrupMl / 1000) * costSyrupPricePerLiter;
  const totalCostPrice = Math.round(beansCost + milkCost + syrupCost + costCupLidPrice + costOtherExtras);
  const grossProfit = Math.max(0, targetSellPrice - totalCostPrice);
  const marginPercent = targetSellPrice > 0 ? Math.round((grossProfit / targetSellPrice) * 100) : 0;
  const markupPercent = totalCostPrice > 0 ? Math.round(((targetSellPrice - totalCostPrice) / totalCostPrice) * 100) : 0;

  const handleApplyCostToMenu = () => {
    if (!selectedItemId) return;
    updateItemPrice(selectedItemId, targetSellPrice);
    updateItemCostPrice(selectedItemId, totalCostPrice);
    const item = menu.find((m) => m.id === selectedItemId);
    setCostUpdatedNotice(`Цена «${item?.name}» обновлена: ${targetSellPrice.toLocaleString()} ₸ (себестоимость: ${totalCostPrice} ₸)`);
    setTimeout(() => setCostUpdatedNotice(null), 3000);
  };

  // -------------------------------------------------------------
  // 2. ВВЕСТИ КАССОВЫЙ ОТЧЕТ ЗА СМЕНУ / ДЕНЬ
  // -------------------------------------------------------------
  const [reportDate, setReportDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reportShift, setReportShift] = useState<'morning' | 'evening' | 'full_day'>('full_day');
  const [reportBarista, setReportBarista] = useState<string>('Динара (Старший бариста)');
  const [reportKaspiQr, setReportKaspiQr] = useState<number>(115000);
  const [reportCard, setReportCard] = useState<number>(45000);
  const [reportCash, setReportCash] = useState<number>(20000);
  const [reportChecksCount, setReportChecksCount] = useState<number>(65);
  const [reportExpenses, setReportExpenses] = useState<number>(5000);
  const [reportCashRemainder, setReportCashRemainder] = useState<number>(15000);
  const [reportComment, setReportComment] = useState<string>('');
  const [reportSavedNotice, setReportSavedNotice] = useState<boolean>(false);

  const calculatedTotalRevenue = Number(reportKaspiQr || 0) + Number(reportCard || 0) + Number(reportCash || 0);
  const calculatedAvgCheck = reportChecksCount > 0 ? Math.round(calculatedTotalRevenue / reportChecksCount) : 0;

  const handleSaveShiftReport = (e: React.FormEvent) => {
    e.preventDefault();
    addShiftReport({
      date: reportDate,
      shift: reportShift,
      baristaName: reportBarista.trim() || 'Бариста NAZ COFFEE',
      revenueTotal: calculatedTotalRevenue,
      kaspiQrAmount: Number(reportKaspiQr || 0),
      cardAmount: Number(reportCard || 0),
      cashAmount: Number(reportCash || 0),
      checkCount: Number(reportChecksCount || 0),
      expensesAmount: Number(reportExpenses || 0),
      netCashRemainder: Number(reportCashRemainder || 0),
      comment: reportComment.trim() || undefined,
    });

    // Send Telegram Notification about shift report
    sendTelegramNotification({
      type: 'system',
      title: `📊 Закрытие смены (${calculatedTotalRevenue.toLocaleString()} ₸)`,
      text: `Смена за ${reportDate} сдана бариста ${reportBarista}.\nВыручка: ${calculatedTotalRevenue.toLocaleString()} ₸ (Kaspi: ${reportKaspiQr.toLocaleString()} ₸, Карты: ${reportCard.toLocaleString()} ₸, Нал: ${reportCash.toLocaleString()} ₸).\nЧеков: ${reportChecksCount}, Расходы: ${reportExpenses.toLocaleString()} ₸, Остаток в кассе: ${reportCashRemainder.toLocaleString()} ₸.`,
    });

    setReportSavedNotice(true);
    setReportComment('');
    setTimeout(() => setReportSavedNotice(false), 3000);
  };

  const reportsStats = useMemo(() => {
    const totalRev = shiftReports.reduce((acc, r) => acc + r.revenueTotal, 0);
    const totalChecks = shiftReports.reduce((acc, r) => acc + r.checkCount, 0);
    const totalExp = shiftReports.reduce((acc, r) => acc + r.expensesAmount, 0);
    const totalKaspi = shiftReports.reduce((acc, r) => acc + r.kaspiQrAmount, 0);
    return { totalRev, totalChecks, totalExp, totalKaspi };
  }, [shiftReports]);

  // -------------------------------------------------------------
  // 3. ДОБАВИТЬ ПОЗИЦИЮ В МЕНЮ С ЗАГРУЗКОЙ ФОТО
  // -------------------------------------------------------------
  const [menuSearch, setMenuSearch] = useState('');
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishType, setNewDishType] = useState<ItemType>('drink');
  const [newDishCategory, setNewDishCategory] = useState<ProductCategory>('coffee');
  const [newDishPrice, setNewDishPrice] = useState<number>(1600);
  const [newDishCostPrice, setNewDishCostPrice] = useState<number>(450);
  const [newDishVolume, setNewDishVolume] = useState('350 мл');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIngredients, setNewDishIngredients] = useState('Эспрессо, молоко, сироп');
  const [newDishImage, setNewDishImage] = useState<string>('/src/assets/images/coffee_flat_white_cup_1790603521645.jpg');
  const [dishCreatedNotice, setDishCreatedNotice] = useState<string | null>(null);

  // File upload for new dish photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewDishImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addMenuItem({
      name: newDishName.trim(),
      itemType: newDishType,
      category: newDishCategory,
      price: Number(newDishPrice),
      costPrice: Number(newDishCostPrice),
      volumeOrWeight: newDishVolume.trim() || (newDishType === 'drink' ? '350 мл' : '150 г'),
      description: newDishDesc.trim() || 'Фирменное блюдо кофейни NAZ COFFEE',
      ingredients: newDishIngredients.split(',').map((s) => s.trim()).filter(Boolean),
      image: newDishImage,
      isAvailable: true,
      popular: false,
    });

    setDishCreatedNotice(`Позиция «${newDishName}» успешно добавлена в меню кофейни!`);
    setShowAddDishModal(false);
    setNewDishName('');
    setNewDishDesc('');
    setTimeout(() => setDishCreatedNotice(null), 3000);
  };

  const filteredMenu = useMemo(() => {
    return menu.filter((item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase())
    );
  }, [menu, menuSearch]);

  // -------------------------------------------------------------
  // 4. УПРАВЛЕНИЕ АКЦИЯМИ (И ЧТОБЫ АКЦИИ ТОЖЕ МОГЛА ИЗМЕНИТЬ)
  // -------------------------------------------------------------
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoBadge, setPromoBadge] = useState('Выгодно');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(20);
  const [promoNotice, setPromoNotice] = useState<string | null>(null);

  const handleOpenEditPromo = (promo: Promotion) => {
    setEditingPromoId(promo.id);
    setPromoTitle(promo.title);
    setPromoDesc(promo.description);
    setPromoBadge(promo.badge);
    setPromoCode(promo.promoCode || '');
    setPromoDiscount(promo.discountPercent || 20);
    setShowAddPromoModal(true);
  };

  const handleOpenCreatePromo = () => {
    setEditingPromoId(null);
    setPromoTitle('');
    setPromoDesc('');
    setPromoBadge('Выгодно');
    setPromoCode('');
    setPromoDiscount(20);
    setShowAddPromoModal(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim()) return;

    if (editingPromoId) {
      updatePromotion(editingPromoId, {
        title: promoTitle.trim(),
        description: promoDesc.trim(),
        badge: promoBadge.trim() || 'Акция',
        promoCode: promoCode.trim() || undefined,
        discountPercent: Number(promoDiscount),
      });
      setPromoNotice('Параметры акции успешно изменены и обновлены в меню!');
    } else {
      addPromotion({
        title: promoTitle.trim(),
        description: promoDesc.trim() || 'Спецпредложение для постоянных клиентов',
        badge: promoBadge.trim() || 'Акция',
        promoCode: promoCode.trim() || undefined,
        discountPercent: Number(promoDiscount),
        active: true,
      });
      setPromoNotice('Новая акция успешно создана и отображается в кофейне!');
    }

    setShowAddPromoModal(false);
    setEditingPromoId(null);
    setPromoTitle('');
    setPromoDesc('');
    setPromoCode('');
    setTimeout(() => setPromoNotice(null), 3000);
  };

  // -------------------------------------------------------------
  // 5. ИЗМЕНЕНИЕ АДРЕСА (ТОЛЬКО ВЛАДЕЛИЦА)
  // -------------------------------------------------------------
  const [editAddress, setEditAddress] = useState(brand.cityAddress);
  const [editCity, setEditCity] = useState(brand.city);
  const [editHours, setEditHours] = useState(brand.openingHours);
  const [editPhone, setEditPhone] = useState(brand.phone);
  const [editWifiName, setEditWifiName] = useState(brand.wifiName);
  const [editWifiPass, setEditWifiPass] = useState(brand.wifiPass);
  const [addressSavedNotice, setAddressSavedNotice] = useState(false);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand({
      cityAddress: editAddress.trim(),
      city: editCity.trim(),
      openingHours: editHours.trim(),
      phone: editPhone.trim(),
      wifiName: editWifiName.trim(),
      wifiPass: editWifiPass.trim(),
    });
    setAddressSavedNotice(true);
    setTimeout(() => setAddressSavedNotice(false), 3000);
  };

  // -------------------------------------------------------------
  // 6. ТЕЛЕГРАМ УВЕДОМЛЕНИЯ ДЛЯ GAINIDEN MADINA
  // -------------------------------------------------------------
  const [testTgSent, setTestTgSent] = useState(false);

  const handleSendTestTelegram = () => {
    sendTelegramNotification({
      type: 'system',
      title: '🔔 Тестовое уведомление из NAZ COFFEE',
      text: `Здравствуйте, ${brand.ownerName}! Связь с вашим Telegram (@${brand.telegramUsername}) работает отлично. Все заказы и отзывы гостей будут приходить сюда в реальном времени.`,
    });
    setTestTgSent(true);
    setTimeout(() => setTestTgSent(false), 3000);
  };

  if (!isUserModalOpen) return null;

  // =================================================================
  // ЭКРАН 1: PIN-КОД ЗАЩИТА: КЛИЕНТЫ НЕ ВИДЯТ НИЧЕГО БЕЗ КОДА 2026
  // =================================================================
  if (!isOwnerAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#231c16]/75 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-sm bg-[#ffffff] border border-[#e8dfd5] rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6">
          <button
            onClick={() => {
              setPin('');
              setIsUserModalOpen(false);
            }}
            className="absolute top-4 right-4 p-2 text-[#705e4f] hover:text-[#231c16] rounded-xl hover:bg-[#faf6f0] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Simple Person Icon */}
          <div className="w-16 h-16 rounded-3xl bg-[#faf6f0] border border-[#ded0c1] flex items-center justify-center mx-auto text-[#935a22] shadow-sm">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-[#231c16]">
              Вход
            </h3>
            <p className="text-xs text-[#705e4f]">
              Введите PIN-код для доступа
            </p>
          </div>

          {/* Dots preview */}
          <div className="flex items-center justify-center gap-3 py-2">
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    pinError
                      ? 'bg-rose-500 scale-110'
                      : isFilled
                      ? 'bg-[#935a22] scale-105'
                      : 'border-2 border-[#ded0c1] bg-[#faf6f0]'
                  }`}
                />
              );
            })}
          </div>

          {pinError && (
            <div className="text-xs text-rose-600 font-semibold animate-shake">
              Неверный код доступа
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2.5 pt-2 max-w-[240px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitPress(digit)}
                className="w-16 h-14 rounded-2xl bg-[#faf6f0] hover:bg-[#f0e6da] active:bg-[#e8dccf] text-lg font-mono font-bold text-[#231c16] transition-colors cursor-pointer shadow-2xs mx-auto flex items-center justify-center"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClearPin}
              className="w-16 h-14 rounded-2xl bg-white hover:bg-stone-50 text-xs font-semibold text-[#705e4f] transition-colors cursor-pointer border border-[#e8dfd5] mx-auto flex items-center justify-center"
            >
              C
            </button>

            <button
              type="button"
              onClick={() => handleDigitPress('0')}
              className="w-16 h-14 rounded-2xl bg-[#faf6f0] hover:bg-[#f0e6da] active:bg-[#e8dccf] text-lg font-mono font-bold text-[#231c16] transition-colors cursor-pointer shadow-2xs mx-auto flex items-center justify-center"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleBackspace}
              className="w-16 h-14 rounded-2xl bg-white hover:bg-stone-50 text-[#705e4f] transition-colors cursor-pointer border border-[#e8dfd5] mx-auto flex items-center justify-center"
              title="Стереть"
            >
              <Delete className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // ЭКРАН 2: ВХОД ВЫПОЛНЕН (КОД 2026): ПОЛНЫЙ ЛИЧНЫЙ КАБИНЕТ
  // =================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#231c16]/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#ffffff] border border-[#e8dfd5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f0eae3] bg-[#faf6f0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#f0e6da] border border-[#ded0c1] flex items-center justify-center text-[#935a22] shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#231c16]">
                  Кабинет управления • {brand.ownerName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  г. Атырау
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center gap-1">
                  <Send className="w-3 h-3 text-blue-600" />
                  @{brand.telegramUsername}
                </span>
              </div>
              <p className="text-xs text-[#705e4f]">
                {brand.shopName} • Себестоимость, отчеты, меню с фото, акции, Telegram и адрес
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLockOnly}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#ded0c1] bg-white hover:bg-stone-50 text-xs font-bold text-[#705e4f] transition-colors cursor-pointer shadow-2xs"
              title="Заблокировать"
            >
              <Lock className="w-3.5 h-3.5 text-[#935a22]" />
              <span className="hidden sm:inline">Заблокировать</span>
            </button>

            <button
              onClick={handleLockAndClose}
              className="p-2 text-[#705e4f] hover:text-[#231c16] rounded-xl hover:bg-[#ede5dc] transition-colors cursor-pointer"
              title="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#f0eae3] px-6 bg-[#faf6f0] gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('cost_calculator')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'cost_calculator'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Себестоимость</span>
          </button>

          <button
            onClick={() => setActiveTab('shift_report')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'shift_report'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ввести отчет ({shiftReports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu_prices')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'menu_prices'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Меню и фото</span>
          </button>

          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'promotions'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Акции ({promotions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'telegram'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <Send className="w-4 h-4 text-blue-600" />
            <span>Telegram ({telegramLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'address'
                ? 'border-[#935a22] text-[#935a22]'
                : 'border-transparent text-[#705e4f] hover:text-[#231c16]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Адрес кофейни</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-white space-y-6">
          {/* ========================================================= */}
          {/* 1. КАЛЬКУЛЯТОР СЕБЕСТОИМОСТИ (FOOD COST)                  */}
          {/* ========================================================= */}
          {activeTab === 'cost_calculator' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-[#231c16] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#935a22]" />
                    <span>Расчет точной себестоимости и маржинальности (₸)</span>
                  </h4>
                  <p className="text-xs text-[#705e4f] mt-0.5">
                    Выберите позицию из меню или задайте состав для калькуляции порции
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#231c16] whitespace-nowrap">Позиция:</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => handleSelectMenuItem(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-semibold text-[#231c16] outline-none focus:border-[#935a22]"
                  >
                    {menu.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.price.toLocaleString()} ₸)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {costUpdatedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{costUpdatedNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ingredients Column */}
                <div className="space-y-4 p-5 rounded-2xl bg-[#fcfbf9] border border-[#ebe4dc]">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-[#935a22] flex items-center gap-1.5">
                    <Coffee className="w-4 h-4" />
                    <span>Расход сырья на 1 порцию</span>
                  </h5>

                  {/* Coffee Beans */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#231c16]">Кофе зерновой (обжарка)</span>
                      <span className="font-mono text-[#705e4f]">{beansCost.toFixed(1)} ₸</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Граммовка (г):</label>
                        <input
                          type="number"
                          value={costCoffeeGrams}
                          onChange={(e) => setCostCoffeeGrams(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Закупка за 1 кг (₸):</label>
                        <input
                          type="number"
                          step="500"
                          value={costCoffeePricePerKg}
                          onChange={(e) => setCostCoffeePricePerKg(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Milk */}
                  <div className="space-y-1.5 pt-2 border-t border-[#f0eae3]">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-[#231c16]">Молоко (мл)</span>
                      <span className="font-mono text-[#705e4f]">{milkCost.toFixed(1)} ₸</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Объем молока (мл):</label>
                        <input
                          type="number"
                          value={costMilkMl}
                          onChange={(e) => setCostMilkMl(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Закупка за 1 литр (₸):</label>
                        <input
                          type="number"
                          step="50"
                          value={costMilkPricePerLiter}
                          onChange={(e) => setCostMilkPricePerLiter(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Syrups & Extras */}
                  <div className="space-y-1.5 pt-2 border-t border-[#f0eae3]">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Сироп (мл):</label>
                        <input
                          type="number"
                          value={costSyrupMl}
                          onChange={(e) => setCostSyrupMl(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#705e4f]">Стаканчик + крышка (₸):</label>
                        <input
                          type="number"
                          value={costCupLidPrice}
                          onChange={(e) => setCostCupLidPrice(Number(e.target.value))}
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Margins Column */}
                <div className="space-y-4 p-5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5] flex flex-col justify-between">
                  <div className="space-y-4">
                    <h5 className="font-bold text-xs uppercase tracking-wider text-[#935a22] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      <span>Финансовые показатели</span>
                    </h5>

                    <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd5] space-y-1.5">
                      <label className="text-xs font-bold text-[#231c16] block">
                        Желаемая цена продажи в меню (₸):
                      </label>
                      <input
                        type="number"
                        step="50"
                        value={targetSellPrice}
                        onChange={(e) => setTargetSellPrice(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-base font-bold font-mono text-[#935a22] outline-none focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd5]">
                        <span className="text-[11px] text-[#705e4f] block font-medium">Себестоимость:</span>
                        <div className="text-xl font-extrabold font-mono text-[#231c16] mt-0.5">
                          {totalCostPrice.toLocaleString()} ₸
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white border border-[#e8dfd5]">
                        <span className="text-[11px] text-[#705e4f] block font-medium">Чистая прибыль:</span>
                        <div className="text-xl font-extrabold font-mono text-emerald-700 mt-0.5">
                          +{grossProfit.toLocaleString()} ₸
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          {marginPercent}% маржа
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#e8dfd5]">
                    <button
                      onClick={handleApplyCostToMenu}
                      className="w-full py-3 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Применить {targetSellPrice.toLocaleString()} ₸ в меню NAZ COFFEE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ВВЕСТИ КАССОВЫЙ ОТЧЕТ ЗА СМЕНУ / ДЕНЬ                 */}
          {/* ========================================================= */}
          {activeTab === 'shift_report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#705e4f]">
                    Выручка за смены
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-[#935a22] mt-0.5">
                    {reportsStats.totalRev.toLocaleString()} ₸
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#705e4f]">
                    Доля Kaspi QR
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-700 mt-0.5">
                    {reportsStats.totalKaspi.toLocaleString()} ₸
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#705e4f]">
                    Чеков пробито
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-[#231c16] mt-0.5">
                    {reportsStats.totalChecks}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#705e4f]">
                    Списания и расходы
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold font-mono text-rose-700 mt-0.5">
                    {reportsStats.totalExp.toLocaleString()} ₸
                  </div>
                </div>
              </div>

              {/* Form to enter a report */}
              <div className="p-6 rounded-2xl bg-[#fcfbf9] border border-[#ebe4dc] space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-base text-[#231c16] flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-[#935a22]" />
                    <span>Ввод кассового отчета за смену / день</span>
                  </h4>
                  <span className="text-xs text-[#705e4f]">г. Атырау</span>
                </div>

                {reportSavedNotice && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Отчет успешно сохранен и передан в Telegram Gainiden Madina!</span>
                  </div>
                )}

                <form onSubmit={handleSaveShiftReport} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Дата смены</label>
                      <input
                        type="date"
                        required
                        value={reportDate}
                        onChange={(e) => setReportDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-medium text-[#231c16] outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Смена</label>
                      <select
                        value={reportShift}
                        onChange={(e) => setReportShift(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-medium text-[#231c16] outline-none"
                      >
                        <option value="full_day">Полный рабочий день (08:00–23:00)</option>
                        <option value="morning">Утренняя смена (08:00–16:00)</option>
                        <option value="evening">Вечерняя смена (16:00–23:00)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Имя бариста / кассира</label>
                      <input
                        type="text"
                        required
                        value={reportBarista}
                        onChange={(e) => setReportBarista(e.target.value)}
                        placeholder="Динара"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] outline-none"
                      />
                    </div>
                  </div>

                  {/* Revenue types */}
                  <div className="p-4 rounded-xl bg-white border border-[#e8dfd5] space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#935a22] block">
                      Выручка по типам оплат (₸)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-[#705e4f] flex items-center gap-1">
                          <QrCode className="w-3.5 h-3.5 text-red-500" />
                          Kaspi QR (₸):
                        </label>
                        <input
                          type="number"
                          step="100"
                          value={reportKaspiQr}
                          onChange={(e) => setReportKaspiQr(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#e8dfd5] text-sm font-bold font-mono text-[#231c16]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#705e4f] flex items-center gap-1">
                          <CreditCard className="w-3.5 h-3.5 text-blue-500" />
                          Терминал / Карты (₸):
                        </label>
                        <input
                          type="number"
                          step="100"
                          value={reportCard}
                          onChange={(e) => setReportCard(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#e8dfd5] text-sm font-bold font-mono text-[#231c16]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#705e4f] flex items-center gap-1">
                          <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                          Наличные (₸):
                        </label>
                        <input
                          type="number"
                          step="100"
                          value={reportCash}
                          onChange={(e) => setReportCash(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-[#faf6f0] border border-[#e8dfd5] text-sm font-bold font-mono text-[#231c16]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#f0eae3] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#705e4f]">Итого выручка за смену (автоматически):</span>
                      <span className="font-mono font-extrabold text-base text-[#935a22]">
                        {calculatedTotalRevenue.toLocaleString()} ₸
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Чеков пробито</label>
                      <input
                        type="number"
                        min="1"
                        value={reportChecksCount}
                        onChange={(e) => setReportChecksCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                      />
                      <span className="text-[10px] text-[#705e4f]">
                        Средний чек: {calculatedAvgCheck.toLocaleString()} ₸
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Списания и расходы (₸)</label>
                      <input
                        type="number"
                        step="100"
                        value={reportExpenses}
                        onChange={(e) => setReportExpenses(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-rose-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#231c16]">Остаток налички в кассе (₸)</label>
                      <input
                        type="number"
                        step="100"
                        value={reportCashRemainder}
                        onChange={(e) => setReportCashRemainder(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#231c16]">Комментарий к смене</label>
                    <input
                      type="text"
                      value={reportComment}
                      onChange={(e) => setReportComment(e.target.value)}
                      placeholder="Заметки по смене, остаток молока, состояние оборудования..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить кассовый отчет смены ({calculatedTotalRevenue.toLocaleString()} ₸)</span>
                  </button>
                </form>
              </div>

              {/* Reports list */}
              <div className="space-y-2.5">
                <h5 className="font-display font-bold text-sm text-[#231c16]">
                  Журнал сохраненных отчетов ({shiftReports.length})
                </h5>

                {shiftReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-white border border-[#e8dfd5] space-y-2 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#231c16]">{report.date}</span>
                        <span className="text-xs text-[#705e4f]">•</span>
                        <span className="text-xs font-medium text-[#705e4f]">{report.baristaName}</span>
                        <span className="text-xs text-[#705e4f]">•</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#faf6f0] text-[10px] font-semibold text-[#935a22]">
                          {report.shift === 'full_day' ? 'Весь день' : report.shift === 'morning' ? 'Утро' : 'Вечер'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-xs text-[#705e4f]">Выручка: </span>
                          <span className="font-mono font-extrabold text-sm text-[#935a22]">
                            {report.revenueTotal.toLocaleString()} ₸
                          </span>
                        </div>
                        <button
                          onClick={() => deleteShiftReport(report.id)}
                          title="Удалить"
                          className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#f0eae3] text-xs">
                      <div>
                        <span className="text-[#705e4f] block text-[10px]">Kaspi QR:</span>
                        <span className="font-mono font-bold text-[#231c16]">{report.kaspiQrAmount.toLocaleString()} ₸</span>
                      </div>
                      <div>
                        <span className="text-[#705e4f] block text-[10px]">Терминал:</span>
                        <span className="font-mono font-bold text-[#231c16]">{report.cardAmount.toLocaleString()} ₸</span>
                      </div>
                      <div>
                        <span className="text-[#705e4f] block text-[10px]">Наличные:</span>
                        <span className="font-mono font-bold text-[#231c16]">{report.cashAmount.toLocaleString()} ₸</span>
                      </div>
                      <div>
                        <span className="text-[#705e4f] block text-[10px]">Чеков:</span>
                        <span className="font-mono font-bold text-[#231c16]">{report.checkCount} шт.</span>
                      </div>
                    </div>

                    {report.comment && (
                      <div className="p-2.5 rounded-xl bg-[#faf6f0] text-[11px] text-[#705e4f] italic">
                        «{report.comment}»
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. УПРАВЛЕНИЕ МЕНЮ, ЦЕНАМИ И ВЫКЛАДКА ФОТО                */}
          {/* ========================================================= */}
          {activeTab === 'menu_prices' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-bold text-base text-[#231c16]">
                    Управление меню, ценами и выкладка фото
                  </h4>
                  <p className="text-xs text-[#705e4f]">
                    Выкладывайте новые авторские напитки и блюда с фото и меняйте цены в реальном времени
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Поиск по меню..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] outline-none"
                  />

                  <button
                    onClick={() => setShowAddDishModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Выложить позицию с фото</span>
                  </button>
                </div>
              </div>

              {dishCreatedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{dishCreatedNotice}</span>
                </div>
              )}

              {/* Modal or expander to add a new dish/drink with photo upload */}
              {showAddDishModal && (
                <div className="p-5 rounded-2xl bg-[#fcfbf9] border-2 border-[#935a22] space-y-4 shadow-md animate-in slide-in-from-top-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-[#231c16] flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#935a22]" />
                      <span>Добавление новой позиции в меню NAZ COFFEE</span>
                    </h5>
                    <button
                      onClick={() => setShowAddDishModal(false)}
                      className="p-1 text-stone-400 hover:text-stone-800 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateDish} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Название позиции</label>
                        <input
                          type="text"
                          required
                          value={newDishName}
                          onChange={(e) => setNewDishName(e.target.value)}
                          placeholder="Например: Раф Атырау или Бриошь с ягодами"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Тип</label>
                        <select
                          value={newDishType}
                          onChange={(e) => setNewDishType(e.target.value as ItemType)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        >
                          <option value="drink">☕ Напиток</option>
                          <option value="food">🥐 Блюдо / Еда</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Категория</label>
                        <select
                          value={newDishCategory}
                          onChange={(e) => setNewDishCategory(e.target.value as ProductCategory)}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        >
                          <option value="coffee">Классический кофе</option>
                          <option value="specialty">Спешелти & Фильтр</option>
                          <option value="tea">Чай & Матча</option>
                          <option value="bakery">Ремесленная выпечка</option>
                          <option value="breakfast">Завтраки</option>
                          <option value="dessert">Десерты</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Цена продажи (₸)</label>
                        <input
                          type="number"
                          step="50"
                          required
                          value={newDishPrice}
                          onChange={(e) => setNewDishPrice(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono font-bold text-[#935a22]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Себестоимость (₸)</label>
                        <input
                          type="number"
                          step="50"
                          value={newDishCostPrice}
                          onChange={(e) => setNewDishCostPrice(Number(e.target.value))}
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#705e4f]"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Объем / Граммовка</label>
                        <input
                          type="text"
                          value={newDishVolume}
                          onChange={(e) => setNewDishVolume(e.target.value)}
                          placeholder="350 мл или 180 г"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        />
                      </div>
                    </div>

                    {/* Photo upload section */}
                    <div className="p-4 rounded-xl bg-white border border-[#e8dfd5] space-y-3">
                      <label className="text-xs font-bold text-[#231c16] flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#935a22]" />
                        <span>Фотография позиции</span>
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#ded0c1] overflow-hidden bg-[#faf6f0] shrink-0 flex items-center justify-center">
                          {newDishImage ? (
                            <img src={newDishImage} alt="Превью" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-stone-300" />
                          )}
                        </div>

                        <div className="space-y-2 flex-1 w-full">
                          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0e6da] border border-[#ded0c1] text-xs font-bold text-[#231c16] cursor-pointer transition-colors">
                            <Upload className="w-4 h-4 text-[#935a22]" />
                            <span>📷 Загрузить фото со своего устройства</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="space-y-1">
                            <p className="text-[11px] text-[#705e4f]">
                              Или выберите готовое аппетитное фото:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {[
                                { label: 'Капучино', url: '/src/assets/images/coffee_flat_white_cup_1790603521645.jpg' },
                                { label: 'Фильтр', url: '/src/assets/images/coffee_pourover_chemex_1790603537900.jpg' },
                                { label: 'Раф', url: '/src/assets/images/coffee_specialty_raf_1790603574318.jpg' },
                                { label: 'Круассан', url: '/src/assets/images/pastry_artisan_croissant_1790603557602.jpg' },
                                { label: 'Сырники', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80' },
                                { label: 'Авокадо тост', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80' },
                                { label: 'Чизкейк', url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80' },
                                { label: 'Матча', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80' },
                                { label: 'Ягодный чай', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
                              ].map((p) => (
                                <button
                                  key={p.label}
                                  type="button"
                                  onClick={() => setNewDishImage(p.url)}
                                  className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border cursor-pointer ${
                                    newDishImage === p.url
                                      ? 'bg-[#935a22] text-white border-[#935a22]'
                                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                                  }`}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <p className="text-[11px] text-[#705e4f]">
                            Или вставьте ссылку на изображение:
                          </p>
                          <input
                            type="text"
                            value={newDishImage}
                            onChange={(e) => setNewDishImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-1.5 rounded-lg bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Описание</label>
                        <input
                          type="text"
                          value={newDishDesc}
                          onChange={(e) => setNewDishDesc(e.target.value)}
                          placeholder="Нежная текстура, нотки шоколада и специй..."
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#231c16]">Состав (через запятую)</label>
                        <input
                          type="text"
                          value={newDishIngredients}
                          onChange={(e) => setNewDishIngredients(e.target.value)}
                          placeholder="Зерно 100% арабика, фермерское молоко, ваниль"
                          className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDishModal(false)}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold shadow-md cursor-pointer"
                      >
                        Опубликовать в меню
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Menu items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-[#e8dfd5] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#231c16] truncate">
                          {item.name}
                        </div>
                        <span className="text-[10px] text-[#705e4f] block">
                          Себестоимость: {item.costPrice?.toLocaleString() || 350} ₸ • {item.volumeOrWeight}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`text-[10px] font-semibold cursor-pointer ${
                              item.isAvailable ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {item.isAvailable ? '● В наличии' : '○ Стоп-лист'}
                          </button>
                          <span className="text-stone-300">•</span>
                          <button
                            onClick={() => deleteMenuItem(item.id)}
                            className="text-[10px] text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-[#705e4f]">₸</span>
                      <input
                        type="number"
                        step="50"
                        value={item.price}
                        onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                        className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-[#e8dfd5] text-xs font-bold font-mono text-[#935a22] text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 4. УПРАВЛЕНИЕ АКЦИЯМИ (И ЧТОБЫ АКЦИИ ТОЖЕ МОГЛА ИЗМЕНИТЬ) */}
          {/* ========================================================= */}
          {activeTab === 'promotions' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display font-bold text-base text-[#231c16]">
                    Акции и спецпредложения кофейни NAZ COFFEE
                  </h4>
                  <p className="text-xs text-[#705e4f]">
                    Создавайте и изменяйте скидки, промокоды и праздничные предложения
                  </p>
                </div>

                <button
                  onClick={handleOpenCreatePromo}
                  className="px-4 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Создать новую акцию</span>
                </button>
              </div>

              {promoNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{promoNotice}</span>
                </div>
              )}

              {/* Add / Edit Promotion Modal */}
              {showAddPromoModal && (
                <form onSubmit={handleSavePromo} className="p-5 rounded-2xl bg-[#fcfbf9] border-2 border-[#935a22] space-y-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-[#231c16] flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#935a22]" />
                      <span>{editingPromoId ? 'Редактирование параметров акции' : 'Параметры новой акции'}</span>
                    </h5>
                    <button onClick={() => { setShowAddPromoModal(false); setEditingPromoId(null); }} type="button">
                      <X className="w-4 h-4 text-stone-400" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#231c16]">Название акции</label>
                      <input
                        type="text"
                        required
                        value={promoTitle}
                        onChange={(e) => setPromoTitle(e.target.value)}
                        placeholder="Например: Счастливые часы -20% на весь кофе"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#231c16]">Бейдж на карточке</label>
                      <input
                        type="text"
                        value={promoBadge}
                        onChange={(e) => setPromoBadge(e.target.value)}
                        placeholder="-20%, 1+1, Утро в Атырау"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-[#231c16]">Промокод (если есть)</label>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="NAZCOFFEE"
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#231c16]">Размер скидки (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="70"
                        value={promoDiscount}
                        onChange={(e) => setPromoDiscount(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#231c16]">Описание условий акции</label>
                    <input
                      type="text"
                      value={promoDesc}
                      onChange={(e) => setPromoDesc(e.target.value)}
                      placeholder="Действует при заказе с 08:00 до 11:00 на все кофейные напитки..."
                      className="w-full mt-1 px-3 py-2 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => { setShowAddPromoModal(false); setEditingPromoId(null); }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold shadow-md cursor-pointer"
                    >
                      {editingPromoId ? 'Сохранить изменения' : 'Сохранить акцию'}
                    </button>
                  </div>
                </form>
              )}

              {/* Promotions Cards List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      promo.active
                        ? 'bg-white border-[#e8dfd5] shadow-xs'
                        : 'bg-stone-50 border-stone-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#faf6f0] text-[#935a22] border border-[#ded0c1]">
                          {promo.badge}
                        </span>
                        <h5 className="font-display font-bold text-sm text-[#231c16] mt-2">
                          {promo.title}
                        </h5>
                        <p className="text-xs text-[#705e4f] mt-1">
                          {promo.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleOpenEditPromo(promo)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1 cursor-pointer"
                          title="Редактировать акцию"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Изменить</span>
                        </button>
                        <button
                          onClick={() => togglePromotion(promo.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                            promo.active
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {promo.active ? 'Активна' : 'Отключена'}
                        </button>
                        <button
                          onClick={() => deletePromotion(promo.id)}
                          className="p-1 text-stone-400 hover:text-rose-600"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#f0eae3] flex items-center justify-between text-xs text-[#705e4f]">
                      {promo.promoCode ? (
                        <span>Промокод: <strong className="font-mono text-[#935a22]">{promo.promoCode}</strong></span>
                      ) : (
                        <span>Скидка {promo.discountPercent || 15}%</span>
                      )}
                      <span>NAZ COFFEE г. Атырау</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 5. TELEGRAM УВЕДОМЛЕНИЯ (GAINIDEN MADINA)                  */}
          {/* ========================================================= */}
          {activeTab === 'telegram' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#24A1DE]/10 via-[#faf6f0] to-[#ffffff] border border-[#24A1DE]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#24A1DE] text-white flex items-center justify-center shadow-md">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-base text-[#231c16]">
                        Телеграм-уведомления: Gainiden Madina
                      </h4>
                      <p className="text-xs text-[#705e4f]">
                        Каждый онлайн-заказ, отзыв гостя и бронь столика мгновенно отправляются в ваш Telegram
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://t.me/${brand.telegramUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-[#24A1DE] hover:bg-[#1f8fc6] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <span>Открыть @{brand.telegramUsername}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={handleSendTestTelegram}
                      className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#ded0c1] text-xs font-bold text-[#705e4f] transition-colors cursor-pointer"
                    >
                      Тестовый сигнал
                    </button>
                  </div>
                </div>

                {testTgSent && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Тестовое уведомление успешно отправлено в Telegram @{brand.telegramUsername}!</span>
                  </div>
                )}
              </div>

              {/* Feed of sent telegram messages */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-display font-bold text-sm text-[#231c16]">
                    Лента уведомлений, переданных в Telegram ({telegramLogs.length})
                  </h5>
                  <span className="text-xs text-[#705e4f]">Получатель: {brand.ownerName}</span>
                </div>

                <div className="space-y-2.5">
                  {telegramLogs.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 rounded-2xl bg-white border border-[#e8dfd5] space-y-2 shadow-2xs hover:border-[#b89f88] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1.5 rounded-lg text-xs font-bold ${
                              msg.type === 'order'
                                ? 'bg-amber-100 text-amber-800'
                                : msg.type === 'review'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {msg.type === 'order' ? '🛒 Заказ' : msg.type === 'review' ? '⭐ Отзыв' : '📌 Система'}
                          </span>
                          <span className="font-bold text-xs text-[#231c16]">{msg.title}</span>
                        </div>
                        <span className="text-[11px] text-[#705e4f] font-mono">{msg.timestamp}</span>
                      </div>

                      <p className="text-xs text-[#705e4f] whitespace-pre-line leading-relaxed">
                        {msg.text}
                      </p>

                      <div className="pt-2 border-t border-[#f0eae3] flex items-center justify-between text-[11px] text-[#705e4f]">
                        <span>Канал: Telegram Bot → <strong>{msg.recipient}</strong></span>
                        <span className="text-emerald-600 font-semibold">✓ Доставлено</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 6. ИЗМЕНЕНИЕ АДРЕСА КОФЕЙНИ (ТОЛЬКО ВЛАДЕЛИЦА)             */}
          {/* ========================================================= */}
          {activeTab === 'address' && (
            <div className="space-y-6 max-w-2xl">
              <div className="p-4 rounded-2xl bg-[#faf6f0] border border-[#e8dfd5] space-y-1">
                <h4 className="font-display font-bold text-base text-[#231c16] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#935a22]" />
                  <span>Адрес и реквизиты кофейни в городе Атырау</span>
                </h4>
                <p className="text-xs text-[#705e4f]">
                  Только вы (Gainiden Madina) можете изменить локацию, расписание и контакты кофейни
                </p>
              </div>

              {addressSavedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Адрес и данные кофейни успешно обновлены во всем приложении!</span>
                </div>
              )}

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231c16]">Полный адрес (г. Атырау)</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="г. Атырау, пр. Каныша Сатпаева, 19 / ТРК Baizaar, 1 этаж"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs font-medium text-[#231c16]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#231c16]">Город</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      placeholder="Атырау"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#231c16]">График работы</label>
                    <input
                      type="text"
                      required
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value)}
                      placeholder="Пн-Вс: 08:00 – 23:00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#231c16]">Телефон для гостей</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+7 (7122) 95-20-26"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#231c16]">Имя сети Wi-Fi</label>
                    <input
                      type="text"
                      value={editWifiName}
                      onChange={(e) => setEditWifiName(e.target.value)}
                      placeholder="NAZ_COFFEE_Guest"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#231c16]">Пароль от Wi-Fi</label>
                  <input
                    type="text"
                    value={editWifiPass}
                    onChange={(e) => setEditWifiPass(e.target.value)}
                    placeholder="nazcoffee"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#231c16]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Сохранить адрес и контакты кофейни</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
