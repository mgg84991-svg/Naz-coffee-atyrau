import React, { useState, useMemo } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { MenuItem, StockItem, ProductCategory, ItemType } from '../../types';
import {
  TrendingUp,
  Package,
  UtensilsCrossed,
  Bell,
  Calendar,
  Send,
  Sliders,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  Search,
  DollarSign,
  Coffee,
  CheckCircle2,
  Lock,
  LogOut,
  MapPin,
  Calculator,
  ArrowUpRight,
  Sparkles,
  Croissant,
} from 'lucide-react';
import { normalizeImageUrl, handleImageError } from '../../utils/imageHelper';

export const AdminDashboard: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    brand,
    updateBrand,
    menu,
    addMenuItem,
    updateMenuItem,
    updateItemPrice,
    updateItemCostPrice,
    toggleItemAvailability,
    deleteMenuItem,
    stock,
    updateStockQuantity,
    addStockItem,
    lowStockItems,
    orders,
    updateOrderStatus,
    bookings,
    updateBookingStatus,
    waiterCalls,
    resolveWaiterCall,
    reviews,
    replyToReview,
    promotions,
    togglePromotion,
    sendPushNotification,
    logoutOwner,
  } = useCoffee();

  // Search & Filters in Admin
  const [menuSearch, setMenuSearch] = useState('');
  const [menuTypeTab, setMenuTypeTab] = useState<'all' | 'drink' | 'food'>('all');

  // Dish Add / Edit Modal state
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishForm, setDishForm] = useState({
    name: '',
    itemType: 'drink' as ItemType,
    category: 'coffee' as ProductCategory,
    price: 1800, // в тенге
    costPrice: 480, // себестоимость в тенге
    volumeOrWeight: '300 мл',
    calories: 120,
    description: '',
    ingredientsStr: '',
    image: '/images/coffee_flat_white_cup_1790603521645.jpg',
    isAvailable: true,
    isSpecialOffer: false,
    popular: false,
  });

  // Food Cost Calculator Interactive State (Себестоимость только для владелицы)
  const [calcDishName, setCalcDishName] = useState('Флэт Уайт на фермерском молоке');
  const [calcCategory, setCalcCategory] = useState<'drink' | 'food'>('drink');
  const [calcCoffeeGrams, setCalcCoffeeGrams] = useState(20); // грамм зерна
  const [calcCoffeeKgPrice, setCalcCoffeeKgPrice] = useState(11500); // тенге за кг
  const [calcMilkMl, setCalcMilkMl] = useState(150); // мл молока
  const [calcMilkLiterPrice, setCalcMilkLiterPrice] = useState(680); // тенге за литр
  const [calcSyrupGrams, setCalcSyrupGrams] = useState(0); // мл сиропа
  const [calcSyrupLiterPrice, setCalcSyrupLiterPrice] = useState(7200); // тенге за литр
  const [calcCupPackaging, setCalcCupPackaging] = useState(65); // стаканчик тенге
  const [calcOtherFoodCost, setCalcOtherFoodCost] = useState(0); // доп ингредиенты
  const [calcTargetSellingPrice, setCalcTargetSellingPrice] = useState(1800); // розничная цена в тенге

  // Calculated Prime Cost
  const calculatedPrimeCost = useMemo(() => {
    const coffeeCost = (calcCoffeeGrams / 1000) * calcCoffeeKgPrice;
    const milkCost = (calcMilkMl / 1000) * calcMilkLiterPrice;
    const syrupCost = (calcSyrupGrams / 1000) * calcSyrupLiterPrice;
    const totalCost = coffeeCost + milkCost + syrupCost + calcCupPackaging + calcOtherFoodCost;
    return Math.round(totalCost);
  }, [
    calcCoffeeGrams,
    calcCoffeeKgPrice,
    calcMilkMl,
    calcMilkLiterPrice,
    calcSyrupGrams,
    calcSyrupLiterPrice,
    calcCupPackaging,
    calcOtherFoodCost,
  ]);

  const calculatedProfitMargin = useMemo(() => {
    return Math.max(0, calcTargetSellingPrice - calculatedPrimeCost);
  }, [calcTargetSellingPrice, calculatedPrimeCost]);

  const calculatedMarkupPercent = useMemo(() => {
    if (calculatedPrimeCost <= 0) return 0;
    return Math.round(((calcTargetSellingPrice - calculatedPrimeCost) / calculatedPrimeCost) * 100);
  }, [calcTargetSellingPrice, calculatedPrimeCost]);

  // Stock Add Modal state
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockForm, setStockForm] = useState({
    name: '',
    category: 'coffee_beans' as StockItem['category'],
    quantity: 10,
    unit: 'кг' as StockItem['unit'],
    minThreshold: 3,
    costPerUnit: 11500,
  });

  // Push Notification state
  const [pushTitle, setPushTitle] = useState('Счастливые часы в NAZ COFFEE!');
  const [pushMessage, setPushMessage] = useState('Скидка 15% на авторский лавандовый раф и десерты по промокоду HAPPY15.');
  const [pushPromoCode, setPushPromoCode] = useState('HAPPY15');
  const [pushAudience, setPushAudience] = useState<'all' | 'loyal' | 'new'>('all');
  const [pushSuccessNotice, setPushSuccessNotice] = useState(false);

  // Analytics Metrics in Tenge
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeUnresolvedCalls = waiterCalls.filter((c) => !c.resolved);

  // Open dish modal for creating
  const handleOpenAddDish = (type: ItemType = 'drink') => {
    setEditingDishId(null);
    setDishForm({
      name: '',
      itemType: type,
      category: type === 'drink' ? 'coffee' : 'bakery',
      price: type === 'drink' ? 1800 : 1600,
      costPrice: type === 'drink' ? 480 : 450,
      volumeOrWeight: type === 'drink' ? '300 мл' : '150 г',
      calories: 120,
      description: '',
      ingredientsStr: type === 'drink' ? 'Эспрессо, Молоко' : 'Сливочное масло, Мука',
      image:
        type === 'drink'
          ? '/images/coffee_flat_white_cup_1790603521645.jpg'
          : '/images/pastry_artisan_croissant_1790603557602.jpg',
      isAvailable: true,
      isSpecialOffer: false,
      popular: false,
    });
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (item: MenuItem) => {
    setEditingDishId(item.id);
    setDishForm({
      name: item.name,
      itemType: item.itemType || 'drink',
      category: item.category,
      price: item.price,
      costPrice: item.costPrice || Math.round(item.price * 0.3),
      volumeOrWeight: item.volumeOrWeight,
      calories: item.calories || 100,
      description: item.description,
      ingredientsStr: item.ingredients.join(', '),
      image: item.image,
      isAvailable: item.isAvailable,
      isSpecialOffer: !!item.isSpecialOffer,
      popular: !!item.popular,
    });
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredients = dishForm.ingredientsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingDishId) {
      updateMenuItem(editingDishId, {
        name: dishForm.name,
        itemType: dishForm.itemType,
        category: dishForm.category,
        price: Number(dishForm.price),
        costPrice: Number(dishForm.costPrice),
        volumeOrWeight: dishForm.volumeOrWeight,
        calories: Number(dishForm.calories),
        description: dishForm.description,
        ingredients,
        image: dishForm.image,
        isAvailable: dishForm.isAvailable,
        isSpecialOffer: dishForm.isSpecialOffer,
        popular: dishForm.popular,
      });
    } else {
      addMenuItem({
        name: dishForm.name,
        itemType: dishForm.itemType,
        category: dishForm.category,
        price: Number(dishForm.price),
        costPrice: Number(dishForm.costPrice),
        volumeOrWeight: dishForm.volumeOrWeight,
        calories: Number(dishForm.calories),
        description: dishForm.description,
        ingredients,
        image: dishForm.image,
        isAvailable: dishForm.isAvailable,
        isSpecialOffer: dishForm.isSpecialOffer,
        popular: dishForm.popular,
      });
    }
    setIsDishModalOpen(false);
  };

  const handleAddStock = (e: React.FormEvent) => {
    e.preventDefault();
    addStockItem({
      name: stockForm.name,
      category: stockForm.category,
      quantity: Number(stockForm.quantity),
      unit: stockForm.unit,
      minThreshold: Number(stockForm.minThreshold),
      costPerUnit: Number(stockForm.costPerUnit),
    });
    setIsStockModalOpen(false);
    setStockForm({
      name: '',
      category: 'coffee_beans',
      quantity: 10,
      unit: 'кг',
      minThreshold: 3,
      costPerUnit: 11500,
    });
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) return;

    sendPushNotification({
      title: pushTitle.trim(),
      message: pushMessage.trim(),
      promoCode: pushPromoCode.trim() || undefined,
      targetAudience: pushAudience,
    });

    setPushSuccessNotice(true);
    setTimeout(() => setPushSuccessNotice(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fbf9f6] text-[#2c221a]">
      {/* Top Admin Sub-bar */}
      <div className="border-b border-[#ebdcd0] bg-white sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto scrollbar-none py-2 gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[
              { id: 'cost_calculator', label: 'Себестоимость & Food Cost', icon: Calculator },
              { id: 'menu_manager', label: 'Управление меню и ценами', icon: UtensilsCrossed },
              { id: 'analytics', label: 'Аналитика продаж', icon: TrendingUp },
              { id: 'inventory', label: 'Складской учет', icon: Package, badge: lowStockItems.length },
              { id: 'waiter_calls', label: 'Вызовы зала', icon: Bell, badge: activeUnresolvedCalls.length },
              { id: 'bookings', label: 'Бронирования', icon: Calendar, badge: bookings.length },
              { id: 'marketing', label: 'Push & Акции', icon: Send },
              { id: 'brand', label: 'Бренд (Атырау)', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#9c6530] text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white text-[#9c6530]' : 'bg-red-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-stone-500 hidden sm:inline">
              Владелица: <strong>NAZ COFFEE</strong>
            </span>
            <button
              onClick={logoutOwner}
              className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
              title="Выйти из режима владелицы"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================================= */}
        {/* TAB 1: FOOD COST & PRIME COST CALCULATOR (ТОЛЬКО ДЛЯ ВЛАДЕЛИЦЫ) */}
        {/* ========================================================================= */}
        {adminTab === 'cost_calculator' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#fbf4eb] to-[#f4ebe0] border border-[#e8dccf] shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-white text-[#9c6530] border border-[#e3d3c2] shadow-2xs">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#2c221a]">
                    Калькулятор себестоимости и маржинальности блюд и напитков
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Доступен <strong>только вам (владелице)</strong>. Рассчитывайте затраты на ингредиенты в тенге (₸), наценку в %, чистую маржу и устанавливайте идеальную цену продажи.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Calculator inputs */}
              <div className="lg:col-span-7 space-y-6 bg-white p-6 rounded-3xl border border-[#e8ded3] shadow-xs">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Название позиции</label>
                      <input
                        type="text"
                        value={calcDishName}
                        onChange={(e) => setCalcDishName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-semibold text-[#2c221a] outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-700">Тип позиции</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setCalcCategory('drink')}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            calcCategory === 'drink'
                              ? 'bg-[#9c6530] text-white border-[#855325]'
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          Напиток
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalcCategory('food')}
                          className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            calcCategory === 'food'
                              ? 'bg-[#9c6530] text-white border-[#855325]'
                              : 'bg-stone-50 border-stone-200 text-stone-600'
                          }`}
                        >
                          Блюдо / Десерт
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients cost parameters in Tenge */}
                  <div className="pt-2 border-t border-[#f0e6da] space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                      Ингредиенты и упаковка на 1 порцию
                    </h4>

                    {calcCategory === 'drink' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] space-y-2">
                          <span className="text-xs font-bold text-stone-700">Кофейное зерно</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-stone-500">Грамм на порцию:</span>
                              <input
                                type="number"
                                value={calcCoffeeGrams}
                                onChange={(e) => setCalcCoffeeGrams(Number(e.target.value))}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0c0] font-mono font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-500">Закупка 1 кг (₸):</span>
                              <input
                                type="number"
                                value={calcCoffeeKgPrice}
                                onChange={(e) => setCalcCoffeeKgPrice(Number(e.target.value))}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0c0] font-mono font-bold text-[#9c6530]"
                              />
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono-numbers">
                            Затраты на зерно: <strong>{Math.round((calcCoffeeGrams / 1000) * calcCoffeeKgPrice)} ₸</strong>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] space-y-2">
                          <span className="text-xs font-bold text-stone-700">Молоко</span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-stone-500">Мл на порцию:</span>
                              <input
                                type="number"
                                value={calcMilkMl}
                                onChange={(e) => setCalcMilkMl(Number(e.target.value))}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0c0] font-mono font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-500">Закупка 1 л (₸):</span>
                              <input
                                type="number"
                                value={calcMilkLiterPrice}
                                onChange={(e) => setCalcMilkLiterPrice(Number(e.target.value))}
                                className="w-full mt-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#ded0c0] font-mono font-bold text-[#9c6530]"
                              />
                            </div>
                          </div>
                          <div className="text-[11px] text-stone-500 font-mono-numbers">
                            Затраты на молоко: <strong>{Math.round((calcMilkMl / 1000) * calcMilkLiterPrice)} ₸</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-stone-600">Сироп (мл):</label>
                        <input
                          type="number"
                          value={calcSyrupGrams}
                          onChange={(e) => setCalcSyrupGrams(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-stone-600">Стакан / упаковка (₸):</label>
                        <input
                          type="number"
                          value={calcCupPackaging}
                          onChange={(e) => setCalcCupPackaging(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-mono font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-stone-600">Прочие затраты (₸):</label>
                        <input
                          type="number"
                          value={calcOtherFoodCost}
                          onChange={(e) => setCalcOtherFoodCost(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#f0e6da] space-y-2">
                      <label className="text-xs font-bold text-stone-700">
                        Планируемая цена продажи в меню (в тенге ₸):
                      </label>
                      <input
                        type="number"
                        value={calcTargetSellingPrice}
                        onChange={(e) => setCalcTargetSellingPrice(Number(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl bg-[#fff7ed] border-2 border-[#ea580c]/30 text-lg font-mono font-extrabold text-[#9a3412] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Margin & Profit Results */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 rounded-3xl bg-white border border-[#e8ded3] shadow-md space-y-5">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#9c6530]">
                    Финансовый анализ порции
                  </span>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8ded3] space-y-1">
                      <span className="text-xs text-stone-500">Себестоимость ингредиентов:</span>
                      <div className="text-2xl font-extrabold font-mono text-stone-800">
                        {calculatedPrimeCost.toLocaleString('ru-RU')} ₸
                      </div>
                      <span className="text-[11px] text-stone-500">
                        Food Cost: {calcTargetSellingPrice > 0 ? Math.round((calculatedPrimeCost / calcTargetSellingPrice) * 100) : 0}% от цены
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                      <span className="text-xs text-emerald-800">Чистая маржа с 1 порции:</span>
                      <div className="text-2xl font-extrabold font-mono text-emerald-700">
                        +{calculatedProfitMargin.toLocaleString('ru-RU')} ₸
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        Наценка к себестоимости: +{calculatedMarkupPercent}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addMenuItem({
                        name: calcDishName,
                        itemType: calcCategory,
                        category: calcCategory === 'drink' ? 'coffee' : 'bakery',
                        price: calcTargetSellingPrice,
                        costPrice: calculatedPrimeCost,
                        volumeOrWeight: calcCategory === 'drink' ? '300 мл' : '150 г',
                        calories: 120,
                        description: `Авторская рецептура NAZ COFFEE. Себестоимость: ${calculatedPrimeCost} ₸`,
                        ingredients: calcCategory === 'drink' ? ['Спешелти кофе', 'Молоко'] : ['Рецепт NAZ'],
                        image:
                          calcCategory === 'drink'
                            ? '/images/coffee_flat_white_cup_1790603521645.jpg'
                            : '/images/pastry_artisan_croissant_1790603557602.jpg',
                        isAvailable: true,
                        popular: true,
                      });
                      alert(`Позиция «${calcDishName}» добавлена в меню по цене ${calcTargetSellingPrice} ₸ (себестоимость ${calculatedPrimeCost} ₸)!`);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    Внести эту позицию в меню
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MENU & PRICES MANAGER (ТОЛЬКО ВЛАДЕЛИЦА МЕНЯЕТ ЦЕНЫ) */}
        {/* ========================================================================= */}
        {adminTab === 'menu_manager' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded3] pb-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#2c221a]">
                  Ручное управление меню и ценами
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Выкладывайте новые напитки и блюда, редактируйте цены в тенге (₸) и себестоимость
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenAddDish('drink')}
                  className="px-3.5 py-2 rounded-xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить напиток</span>
                </button>

                <button
                  onClick={() => handleOpenAddDish('food')}
                  className="px-3.5 py-2 rounded-xl bg-[#486348] hover:bg-[#395039] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить блюдо</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="rounded-3xl bg-white border border-[#e8ded3] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7f1e9] text-stone-700 uppercase tracking-wider text-[10px] border-b border-[#e8ded3]">
                    <tr>
                      <th className="py-3.5 px-4">Позиция</th>
                      <th className="py-3.5 px-4">Тип</th>
                      <th className="py-3.5 px-4">Цена продажи (₸)</th>
                      <th className="py-3.5 px-4">Себестоимость (₸)</th>
                      <th className="py-3.5 px-4">Маржа (₸)</th>
                      <th className="py-3.5 px-4">Наличие</th>
                      <th className="py-3.5 px-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2e9df]">
                    {menu.map((item) => {
                      const cost = item.costPrice || Math.round(item.price * 0.3);
                      const margin = item.price - cost;

                      return (
                        <tr key={item.id} className="hover:bg-[#faf7f2] transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={normalizeImageUrl(item.image)}
                                alt={item.name}
                                className="w-10 h-10 rounded-xl object-cover border border-[#e0d3c5]"
                                referrerPolicy="no-referrer"
                                onError={(e) => handleImageError(e, item.category)}
                              />
                              <div>
                                <div className="font-bold text-[#2c221a]">{item.name}</div>
                                <div className="text-[11px] text-stone-500 truncate max-w-xs">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                                item.itemType === 'drink'
                                  ? 'bg-[#f7ede2] text-[#9c6530]'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {item.itemType === 'drink' ? 'Напиток' : 'Блюдо'}
                            </span>
                          </td>

                          {/* Quick In-Place Selling Price Edit in Tenge */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                                className="w-24 px-2 py-1 rounded-lg bg-white border border-[#ded0c0] text-xs font-mono font-bold text-[#9c6530] outline-none"
                              />
                              <span className="font-bold text-stone-500">₸</span>
                            </div>
                          </td>

                          {/* Quick In-Place Prime Cost Edit in Tenge (Only owner sees this) */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={cost}
                                onChange={(e) => updateItemCostPrice(item.id, Number(e.target.value))}
                                className="w-20 px-2 py-1 rounded-lg bg-stone-50 border border-stone-300 text-xs font-mono text-stone-700 outline-none"
                              />
                              <span className="text-stone-400">₸</span>
                            </div>
                          </td>

                          {/* Margin in Tenge */}
                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                            +{margin.toLocaleString('ru-RU')} ₸
                          </td>

                          {/* Stop-List Toggle */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleItemAvailability(item.id)}
                              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                item.isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-red-100 text-red-800 border border-red-300'
                              }`}
                            >
                              {item.isAvailable ? '✓ В наличии' : 'Стоп-лист'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleOpenEditDish(item)}
                              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100"
                              title="Редактировать состав и фото"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANALYTICS IN TENGE */}
        {/* ========================================================================= */}
        {adminTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#e8ded3] space-y-2 shadow-xs">
                <span className="text-xs text-stone-500 uppercase font-bold">
                  Выручка сегодня
                </span>
                <div className="text-3xl font-extrabold font-mono text-[#9c6530]">
                  {totalRevenue.toLocaleString('ru-RU')} ₸
                </div>
                <div className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>г. Атырау · Оплата на кассе & Kaspi QR</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e8ded3] space-y-2 shadow-xs">
                <span className="text-xs text-stone-500 uppercase font-bold">
                  Заказов оформлено
                </span>
                <div className="text-3xl font-extrabold font-mono text-stone-800">
                  {totalOrders}
                </div>
                <span className="text-xs text-stone-500 block">
                  За столиками и навынос
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e8ded3] space-y-2 shadow-xs">
                <span className="text-xs text-stone-500 uppercase font-bold">
                  Средний чек
                </span>
                <div className="text-3xl font-extrabold font-mono text-stone-800">
                  {avgTicket.toLocaleString('ru-RU')} ₸
                </div>
                <span className="text-xs text-stone-500 block">
                  Кофе + Десерт / Завтрак
                </span>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#e8ded3] space-y-2 shadow-xs">
                <span className="text-xs text-stone-500 uppercase font-bold">
                  Складской остаток
                </span>
                <div className="text-3xl font-extrabold font-mono text-stone-800">
                  {lowStockItems.length === 0 ? 'Норма' : `${lowStockItems.length} позиции`}
                </div>
                <span
                  className={`text-xs block font-medium ${
                    lowStockItems.length > 0 ? 'text-amber-700' : 'text-emerald-700'
                  }`}
                >
                  {lowStockItems.length > 0 ? 'Требуется закупка сырья' : 'Все ингредиенты в наличии'}
                </span>
              </div>
            </div>

            {/* Live Orders Feed */}
            <div className="p-6 rounded-3xl bg-white border border-[#e8ded3] space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-[#2c221a]">
                  Живая лента заказов NAZ COFFEE
                </h3>
                <span className="text-xs text-stone-500">
                  Суммы в тенге ₸ · Возможность оплаты на кассе
                </span>
              </div>

              <div className="divide-y divide-[#f2e8de]">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#9c6530]">
                          {ord.id}
                        </span>
                        <span className="text-xs text-stone-500">· {ord.createdAt}</span>
                        <span className="text-xs text-stone-800 font-bold">
                          ({ord.customerName})
                        </span>
                        {ord.tableNumber && (
                          <span className="px-2 py-0.5 rounded-md bg-[#f7ede2] text-[10px] font-bold text-[#824f21]">
                            Столик №{ord.tableNumber}
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[10px] font-bold text-[#c2410c]">
                          Оплата на кассе
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        {ord.items.map((it) => `${it.quantity}× ${it.menuItem.name}`).join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono-numbers text-base font-extrabold text-[#2c221a]">
                        {ord.total.toLocaleString('ru-RU')} ₸
                      </span>

                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-stone-300 bg-white outline-none"
                      >
                        <option value="new">Новый заказ</option>
                        <option value="brewing">Варится бариста</option>
                        <option value="ready">Готов / Подан</option>
                        <option value="completed">Оплачен и выдан</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INVENTORY & STOCK IN TENGE */}
        {/* ========================================================================= */}
        {adminTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8ded3] pb-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#2c221a]">
                  Складской учет ингредиентов
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Цены закупки в тенге (₸) и автоматическое списание при каждом заказе
                </p>
              </div>

              <button
                onClick={() => setIsStockModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить сырьё</span>
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-[#e8ded3] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f1e9] text-stone-700 uppercase tracking-wider text-[10px] border-b border-[#e8ded3]">
                  <tr>
                    <th className="py-3.5 px-4">Сырьё / Ингредиент</th>
                    <th className="py-3.5 px-4">Категория</th>
                    <th className="py-3.5 px-4">Текущий остаток</th>
                    <th className="py-3.5 px-4">Цена закупки (₸)</th>
                    <th className="py-3.5 px-4">Пополнение</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9df]">
                  {stock.map((item) => (
                    <tr key={item.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#2c221a]">{item.name}</td>
                      <td className="py-3.5 px-4 text-stone-500">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#9c6530]">
                        {item.costPerUnit.toLocaleString('ru-RU')} ₸ / {item.unit}
                      </td>
                      <td className="py-3.5 px-4 space-x-1.5">
                        <button
                          onClick={() => updateStockQuantity(item.id, item.unit === 'кг' ? 5 : item.unit === 'л' ? 10 : 20)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold border border-stone-200 transition-colors"
                        >
                          +{item.unit === 'кг' ? '5 кг' : item.unit === 'л' ? '10 л' : '20 шт'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: WAITER CALLS */}
        {/* ========================================================================= */}
        {adminTab === 'waiter_calls' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-[#e8ded3] pb-4">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#2c221a]">
                  Вызовы бариста из зала NAZ COFFEE
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  Оперативные запросы гостей со столиков
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-[#9c6530]">
                Активных: {activeUnresolvedCalls.length}
              </span>
            </div>

            {waiterCalls.length === 0 ? (
              <div className="p-12 text-center text-xs text-stone-500 rounded-3xl bg-white border border-[#e8ded3]">
                Активных вызовов нет. Все гости обслужены!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {waiterCalls.map((call) => (
                  <div
                    key={call.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      call.resolved
                        ? 'bg-white border-[#e8ded3] opacity-60'
                        : 'bg-[#fffaf5] border-[#ea580c]/40 shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-[#9c6530] text-white font-mono font-bold text-xs">
                        Столик №{call.tableNumber}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        {call.createdAt}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1">
                      <h4 className="text-sm font-bold text-[#2c221a]">
                        {call.reasonText}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {call.resolved ? `Обслужен в ${call.resolvedAt}` : 'Ожидает бариста'}
                      </p>
                    </div>

                    {!call.resolved && (
                      <button
                        onClick={() => resolveWaiterCall(call.id)}
                        className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Выполнено</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: BOOKINGS */}
        {/* ========================================================================= */}
        {adminTab === 'bookings' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-[#e8ded3] pb-4">
              <h3 className="font-display font-bold text-2xl text-[#2c221a]">
                Бронирование столиков в Атырау
              </h3>
            </div>

            <div className="rounded-3xl bg-white border border-[#e8ded3] overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f1e9] text-stone-700 uppercase tracking-wider text-[10px] border-b border-[#e8ded3]">
                  <tr>
                    <th className="py-3.5 px-4">Столик</th>
                    <th className="py-3.5 px-4">Гость</th>
                    <th className="py-3.5 px-4">Телефон</th>
                    <th className="py-3.5 px-4">Дата / Время</th>
                    <th className="py-3.5 px-4">Персон</th>
                    <th className="py-3.5 px-4">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9df]">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#faf7f2] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#9c6530]">
                        №{b.tableNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2c221a]">{b.customerName}</td>
                      <td className="py-3.5 px-4 font-mono">{b.customerPhone}</td>
                      <td className="py-3.5 px-4">{b.date}, {b.timeSlot}</td>
                      <td className="py-3.5 px-4 font-mono">{b.guestCount} чел</td>
                      <td className="py-3.5 px-4">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                          className="px-2 py-1 rounded-lg border border-stone-300 text-xs font-semibold bg-white"
                        >
                          <option value="confirmed">Подтвержден</option>
                          <option value="completed">Гости в зале</option>
                          <option value="cancelled">Отменен</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MARKETING & PUSH */}
        {/* ========================================================================= */}
        {adminTab === 'marketing' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-white border border-[#e8ded3] space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-lg text-[#2c221a]">
                  Отправка Push-уведомления гостям
                </h4>

                <form onSubmit={handleSendPush} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Заголовок</label>
                    <input
                      type="text"
                      required
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-semibold text-[#2c221a] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Текст сообщения</label>
                    <textarea
                      required
                      rows={3}
                      value={pushMessage}
                      onChange={(e) => setPushMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Промокод</label>
                      <input
                        type="text"
                        value={pushPromoCode}
                        onChange={(e) => setPushPromoCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-mono font-bold text-[#9c6530] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">Аудитория</label>
                      <select
                        value={pushAudience}
                        onChange={(e) => setPushAudience(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-semibold text-stone-700 outline-none"
                      >
                        <option value="all">Все гости</option>
                        <option value="loyal">Постоянные клиенты</option>
                        <option value="new">Новые гости</option>
                      </select>
                    </div>
                  </div>

                  {pushSuccessNotice && (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Push успешно отправлен на экраны гостей!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                  >
                    Отправить Push
                  </button>
                </form>
              </div>

              {/* Active Promotions List */}
              <div className="p-6 rounded-3xl bg-white border border-[#e8ded3] space-y-4 shadow-xs">
                <h4 className="font-display font-bold text-lg text-[#2c221a]">
                  Эксклюзивные акции NAZ COFFEE
                </h4>
                <div className="space-y-3">
                  {promotions.map((p) => (
                    <div
                      key={p.id}
                      className="p-3.5 rounded-2xl bg-[#faf7f2] border border-[#ebdcd0] flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#2c221a]">{p.title}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f5ede3] text-[#9c6530] font-mono font-bold">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-600 mt-0.5">{p.description}</p>
                      </div>

                      <button
                        onClick={() => togglePromotion(p.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                          p.active
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {p.active ? 'Активна' : 'Откл'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: BRAND SETTINGS (Атырау) */}
        {/* ========================================================================= */}
        {adminTab === 'brand' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-[#e8ded3] pb-4">
              <h3 className="font-display font-bold text-2xl text-[#2c221a]">
                Настройки кофейни в г. Атырау
              </h3>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#e8ded3] space-y-4 shadow-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Название кофейни</label>
                <input
                  type="text"
                  value={brand.shopName}
                  onChange={(e) => updateBrand({ shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-sm font-display font-bold text-[#2c221a] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Слоган и концепция</label>
                <input
                  type="text"
                  value={brand.tagline}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Город</label>
                  <input
                    type="text"
                    value={brand.city}
                    onChange={(e) => updateBrand({ city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs font-bold text-[#2c221a] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Телефон</label>
                  <input
                    type="text"
                    value={brand.phone}
                    onChange={(e) => updateBrand({ phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] font-mono outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Точный адрес кофейни</label>
                <input
                  type="text"
                  value={brand.cityAddress}
                  onChange={(e) => updateBrand({ cityAddress: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Wi-Fi сеть</label>
                  <input
                    type="text"
                    value={brand.wifiName}
                    onChange={(e) => updateBrand({ wifiName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Пароль Wi-Fi</label>
                  <input
                    type="text"
                    value={brand.wifiPass}
                    onChange={(e) => updateBrand({ wifiPass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] text-xs text-[#2c221a] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT DISH OR DRINK (РУЧНАЯ ВЫКЛАДКА БЛЮД И НАПИТКОВ ВЛАДЕЛИЦЕЙ) */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white border border-[#e4d8cb] rounded-3xl shadow-2xl p-6 text-[#2c221a] max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl text-[#2c221a] mb-4">
              {editingDishId ? 'Редактировать позицию' : 'Выложить новую позицию в меню'}
            </h3>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Тип</label>
                  <select
                    value={dishForm.itemType}
                    onChange={(e) => setDishForm({ ...dishForm, itemType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] font-bold"
                  >
                    <option value="drink">☕ Напиток</option>
                    <option value="food">🥐 Блюдо / Выпечка</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Категория</label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] font-bold"
                  >
                    <option value="coffee">Классический кофе</option>
                    <option value="specialty">Спешелти</option>
                    <option value="tea">Чай & Матча</option>
                    <option value="bakery">Ремесленная выпечка</option>
                    <option value="breakfast">Свежие завтраки</option>
                    <option value="dessert">Десерты</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Название</label>
                <input
                  type="text"
                  required
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  placeholder="Например: Флэт Уайт, Сырники или Круассан"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Цена продажи (₸ тенге)</label>
                  <input
                    type="number"
                    required
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#fff7ed] border border-[#ea580c]/30 font-mono font-bold text-sm text-[#9a3412]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Себестоимость (₸ тенге)</label>
                  <input
                    type="number"
                    required
                    value={dishForm.costPrice}
                    onChange={(e) => setDishForm({ ...dishForm, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] font-mono font-bold text-sm text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Объем / Вес</label>
                  <input
                    type="text"
                    value={dishForm.volumeOrWeight}
                    onChange={(e) => setDishForm({ ...dishForm, volumeOrWeight: e.target.value })}
                    placeholder="300 мл или 150 г"
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Калорийность (ккал)</label>
                  <input
                    type="number"
                    value={dishForm.calories}
                    onChange={(e) => setDishForm({ ...dishForm, calories: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Описание для гостей</label>
                <textarea
                  rows={2}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Состав (через запятую)</label>
                <input
                  type="text"
                  value={dishForm.ingredientsStr}
                  onChange={(e) => setDishForm({ ...dishForm, ingredientsStr: e.target.value })}
                  placeholder="Эспрессо, Молоко 3.2%"
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.isAvailable}
                    onChange={(e) => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                    className="accent-[#9c6530]"
                  />
                  <span>В наличии</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dishForm.popular}
                    onChange={(e) => setDishForm({ ...dishForm, popular: e.target.checked })}
                    className="accent-[#9c6530]"
                  />
                  <span>Отметить как Хит</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#f0e6da]">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RAW STOCK ITEM */}
      {isStockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white border border-[#e4d8cb] rounded-3xl p-6 text-[#2c221a]">
            <h3 className="font-display font-bold text-lg mb-3">Добавить сырье на склад</h3>
            <form onSubmit={handleAddStock} className="space-y-3 text-xs">
              <div>
                <label className="font-bold">Название ингредиента</label>
                <input
                  type="text"
                  required
                  value={stockForm.name}
                  onChange={(e) => setStockForm({ ...stockForm, name: e.target.value })}
                  placeholder="Зерно Бразилия, Молоко и т.д."
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold">Количество</label>
                  <input
                    type="number"
                    value={stockForm.quantity}
                    onChange={(e) => setStockForm({ ...stockForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                  />
                </div>
                <div>
                  <label className="font-bold">Единица</label>
                  <select
                    value={stockForm.unit}
                    onChange={(e) => setStockForm({ ...stockForm, unit: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0]"
                  >
                    <option value="кг">кг</option>
                    <option value="л">л</option>
                    <option value="бут">бут</option>
                    <option value="шт">шт</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold">Цена закупки в тенге (₸)</label>
                <input
                  type="number"
                  value={stockForm.costPerUnit}
                  onChange={(e) => setStockForm({ ...stockForm, costPerUnit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#faf7f2] border border-[#ded0c0] font-mono text-[#9c6530] font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#9c6530] text-white font-bold"
                >
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
