import React, { useState, useMemo } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { DrinkCustomization, MenuItem } from '../types';
import {
  Sparkles,
  Flame,
  Snowflake,
  Check,
  RotateCcw,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { normalizeImageUrl, handleImageError } from '../utils/imageHelper';

interface DrinkBaseOption {
  id: string;
  name: string;
  basePrice: number; // в тенге
  baseCalories: number;
  category: 'coffee' | 'specialty' | 'tea';
  description: string;
  image: string;
  defaultMilk?: boolean;
}

const DRINK_BASES: DrinkBaseOption[] = [
  {
    id: 'base-cappuccino',
    name: 'Капучино',
    basePrice: 1600,
    baseCalories: 140,
    category: 'coffee',
    description: 'Идеальный баланс плотного эспрессо и шелковистой молочной пенки',
    image: '/images/coffee_flat_white_cup_1790603521645.jpg',
    defaultMilk: true,
  },
  {
    id: 'base-flat-white',
    name: 'Флэт Уайт',
    basePrice: 1800,
    baseCalories: 120,
    category: 'coffee',
    description: 'Двойной шот ристретто с бархатной текстурой фермерского молока',
    image: '/images/coffee_flat_white_cup_1790603521645.jpg',
    defaultMilk: true,
  },
  {
    id: 'base-latte',
    name: 'Латте',
    basePrice: 1900,
    baseCalories: 180,
    category: 'coffee',
    description: 'Мягкий молочный кофе с легкой воздушной пенкой',
    image: '/images/coffee_specialty_raf_1790603574318.jpg',
    defaultMilk: true,
  },
  {
    id: 'base-raf',
    name: 'Авторский Раф',
    basePrice: 2200,
    baseCalories: 260,
    category: 'specialty',
    description: 'Взбивается со сливками 10% и натуральной ванилью до шелковистой текстуры',
    image: '/images/coffee_specialty_raf_1790603574318.jpg',
    defaultMilk: true,
  },
  {
    id: 'base-pourover',
    name: 'Фильтр V60 Эфиопия',
    basePrice: 2100,
    baseCalories: 5,
    category: 'specialty',
    description: 'Ручной капельный пролив подчеркивает ноты бергамота и персика',
    image: '/images/coffee_pourover_chemex_1790603537900.jpg',
    defaultMilk: false,
  },
  {
    id: 'base-matcha',
    name: 'Матча Латте Uji',
    basePrice: 2200,
    baseCalories: 110,
    category: 'tea',
    description: 'Японский церемониальный зеленый чай Uji на растительном молоке',
    image: '/images/matcha_latte.jpg',
    defaultMilk: true,
  },
];

export const DrinkCalculator: React.FC = () => {
  const { addToCart, setIsCartOpen } = useCoffee();

  // Builder States
  const [selectedBase, setSelectedBase] = useState<DrinkBaseOption>(DRINK_BASES[0]);
  const [size, setSize] = useState<'s' | 'm' | 'l'>('m');
  const [beanType, setBeanType] = useState<'house' | 'ethiopia' | 'colombia_decaf'>('house');
  const [milkType, setMilkType] = useState<'classic' | 'oat' | 'almond' | 'coconut' | 'lactose_free'>('classic');
  const [extraShots, setExtraShots] = useState<number>(0);
  const [syrup, setSyrup] = useState<'none' | 'salted_caramel' | 'lavender_vanilla' | 'hazelnut' | 'pumpkin_spice'>('none');
  const [temperature, setTemperature] = useState<'hot' | 'extra_hot' | 'iced'>('hot');
  const [sweetness, setSweetness] = useState<'none' | 'low' | 'normal' | 'cane' | 'stevia'>('none');
  const [toppings, setToppings] = useState<string[]>([]);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  // Dynamic Price (₸) & Calorie Calculation
  const calculation = useMemo(() => {
    let price = selectedBase.basePrice;
    let calories = selectedBase.baseCalories;

    // Size multiplier in Tenge
    if (size === 's') {
      price -= 200;
      calories = Math.round(calories * 0.75);
    } else if (size === 'l') {
      price += 400;
      calories = Math.round(calories * 1.3);
    }

    // Specialty Beans in Tenge
    if (beanType === 'ethiopia') price += 300;
    if (beanType === 'colombia_decaf') price += 350;

    // Milk upgrade in Tenge
    if (selectedBase.defaultMilk) {
      if (milkType === 'oat') {
        price += 350;
        calories += 25;
      } else if (milkType === 'almond') {
        price += 400;
        calories -= 15;
      } else if (milkType === 'coconut') {
        price += 400;
        calories += 30;
      } else if (milkType === 'lactose_free') {
        price += 250;
      }
    }

    // Extra shots in Tenge
    price += extraShots * 300;
    calories += extraShots * 5;

    // Syrup in Tenge
    if (syrup !== 'none') {
      if (syrup === 'pumpkin_spice') price += 300;
      else if (syrup === 'lavender_vanilla') price += 300;
      else price += 250;
      calories += 65;
    }

    // Sweetness
    if (sweetness === 'low') calories += 20;
    if (sweetness === 'normal') calories += 40;
    if (sweetness === 'cane') {
      price += 100;
      calories += 35;
    }

    // Toppings in Tenge
    if (toppings.includes('whipped_cream')) {
      price += 250;
      calories += 70;
    }
    if (toppings.includes('marshmallow')) {
      price += 200;
      calories += 45;
    }
    if (toppings.includes('chocolate_chips')) {
      price += 150;
      calories += 35;
    }

    return { price, calories };
  }, [selectedBase, size, beanType, milkType, extraShots, syrup, sweetness, toppings]);

  const toggleTopping = (toppingId: string) => {
    setToppings((prev) =>
      prev.includes(toppingId) ? prev.filter((t) => t !== toppingId) : [...prev, toppingId]
    );
  };

  const handleReset = () => {
    setSize('m');
    setBeanType('house');
    setMilkType('classic');
    setExtraShots(0);
    setSyrup('none');
    setTemperature('hot');
    setSweetness('none');
    setToppings([]);
  };

  const handleAddCustomDrinkToCart = () => {
    const customization: DrinkCustomization = {
      baseId: selectedBase.id,
      baseName: selectedBase.name,
      size,
      beanType,
      milkType,
      extraShots,
      syrup,
      temperature,
      sweetness,
      toppings,
      calculatedPrice: calculation.price,
      calculatedCalories: calculation.calories,
    };

    const customMenuItem: MenuItem = {
      id: `custom-${selectedBase.id}-${Date.now()}`,
      name: `${selectedBase.name} (Авторский)`,
      itemType: 'drink',
      category: selectedBase.category,
      price: calculation.price,
      costPrice: Math.round(calculation.price * 0.3),
      description: `${size.toUpperCase()} (${size === 's' ? '250мл' : size === 'm' ? '350мл' : '450мл'}), ${
        beanType === 'ethiopia' ? 'Эфиопия' : beanType === 'colombia_decaf' ? 'Декаф' : 'Фирменный бленд NAZ'
      }, ${milkType === 'classic' ? 'Коровье молоко' : milkType === 'oat' ? 'Овсяное Nemoloko' : milkType === 'coconut' ? 'Кокосовое' : milkType === 'almond' ? 'Миндальное' : 'Безлактозное'}`,
      ingredients: ['Спешелти кофе', 'Индивидуальная рецептура'],
      image: selectedBase.image,
      volumeOrWeight: size === 's' ? '250 мл' : size === 'm' ? '350 мл' : '450 мл',
      calories: calculation.calories,
      isAvailable: true,
    };

    addToCart(customMenuItem, 1, customization);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2c221a]">
      {/* Top Section Intro */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#e8ded3] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#9c6530] font-bold">
            Конструктор вкуса NAZ COFFEE · Автоматический расчет стоимости
          </span>
          <h2 className="font-display text-3xl font-bold text-[#2c221a] mt-1">
            Калькулятор авторского напитка
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mt-1.5 leading-relaxed">
            Настройте ваш кофе: выберите сорт спешелти зерна, растительное молоко, уровень экстракции и сиропы. Цена в тенге (₸) обновляется автоматически!
          </p>
        </div>

        <button
          onClick={handleReset}
          className="self-start md:self-auto flex items-center gap-1.5 text-xs text-stone-600 hover:text-stone-900 px-3.5 py-2 rounded-xl bg-white border border-[#ded0c0] hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить рецепт</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Base Drink Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              1. Выберите основу кофе
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {DRINK_BASES.map((base) => {
                const isSelected = selectedBase.id === base.id;
                return (
                  <button
                    key={base.id}
                    onClick={() => setSelectedBase(base)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] ring-2 ring-[#9c6530]/20'
                        : 'bg-white border-[#e6dcce] text-stone-700 hover:border-[#cfbeab]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{base.name}</span>
                      <span className="font-mono-numbers text-xs font-extrabold text-[#9c6530]">
                        {base.basePrice.toLocaleString('ru-RU')} ₸
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                      {base.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Cup Size & Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Size */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                2. Объем чашки
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 's', label: 'S (250 мл)', mod: '-200 ₸' },
                  { id: 'm', label: 'M (350 мл)', mod: 'база' },
                  { id: 'l', label: 'L (450 мл)', mod: '+400 ₸' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSize(item.id as any)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer shadow-2xs ${
                      size === item.id
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                        : 'bg-white border-[#e6dcce] text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-xs font-semibold">{item.label}</div>
                    <div className="text-[10px] text-[#9c6530] font-mono-numbers mt-0.5">{item.mod}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                3. Температура
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'hot', label: 'Горячий', icon: Flame },
                  { id: 'extra_hot', label: 'Экстра горячий', icon: Flame },
                  { id: 'iced', label: 'Со льдом', icon: Snowflake },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = temperature === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTemperature(item.id as any)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 shadow-2xs ${
                        isSelected
                          ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                          : 'bg-white border-[#e6dcce] text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#9c6530]" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Coffee Beans Origin */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              4. Сорт кофейного зерна
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'house', name: 'Фирменный бленд NAZ', desc: 'Бразилия + Эфиопия · Шоколад и фундук', price: '+0 ₸' },
                { id: 'ethiopia', name: 'Эфиопия Иргачефф', desc: 'Мытая обработка · Бергамот и персик', price: '+300 ₸' },
                { id: 'colombia_decaf', name: 'Колумбия Декаф', desc: 'Без кофеина · Карамель и сухофрукты', price: '+350 ₸' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBeanType(item.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer shadow-2xs ${
                    beanType === item.id
                      ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a]'
                      : 'bg-white border-[#e6dcce] text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span>{item.name}</span>
                    <span className="text-[#9c6530] font-mono-numbers">{item.price}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Milk Type (If applicable) */}
          {selectedBase.defaultMilk && (
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                5. Молоко и растительные альтернативы
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'classic', label: 'Фермерское 3.2%', price: '+0 ₸' },
                  { id: 'oat', label: 'Овсяное Barista', price: '+350 ₸' },
                  { id: 'coconut', label: 'Кокосовое Alpro', price: '+400 ₸' },
                  { id: 'almond', label: 'Миндальное', price: '+400 ₸' },
                  { id: 'lactose_free', label: 'Безлактозное', price: '+250 ₸' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMilkType(item.id as any)}
                    className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer shadow-2xs ${
                      milkType === item.id
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                        : 'bg-white border-[#e6dcce] text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">{item.label}</div>
                    <div className="text-[10px] text-[#9c6530] font-mono-numbers mt-0.5">{item.price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Syrups & Sweetness */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                6. Крафтовые сиропы
              </label>
              <div className="space-y-2">
                {[
                  { id: 'none', name: 'Без сиропа', price: '0 ₸' },
                  { id: 'salted_caramel', name: 'Солёная карамель Maison 1883', price: '+250 ₸' },
                  { id: 'lavender_vanilla', name: 'Лаванда & Французская ваниль', price: '+300 ₸' },
                  { id: 'hazelnut', name: 'Обжаренный лесной орех', price: '+250 ₸' },
                  { id: 'pumpkin_spice', name: 'Пряная тыква & корица', price: '+300 ₸' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSyrup(item.id as any)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                      syrup === item.id
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                        : 'bg-white border-[#e6dcce] text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <span>{item.name}</span>
                    <span className="font-mono-numbers text-[#9c6530] font-semibold">{item.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extra shots & toppings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Дополнительный эспрессо
                </label>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((shots) => (
                    <button
                      key={shots}
                      onClick={() => setExtraShots(shots)}
                      className={`flex-1 py-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer shadow-2xs ${
                        extraShots === shots
                          ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                          : 'bg-white border-[#e6dcce] text-stone-600'
                      }`}
                    >
                      {shots === 0 ? 'Без доп. шотов' : `+${shots} шот (+${shots * 300} ₸)`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Топпинги
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'whipped_cream', name: 'Воздушные взбитые сливки', price: '+250 ₸' },
                    { id: 'marshmallow', name: 'Мини-маршмеллоу', price: '+200 ₸' },
                    { id: 'chocolate_chips', name: 'Бельгийская шоколадная стружка', price: '+150 ₸' },
                  ].map((top) => {
                    const active = toppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => toggleTopping(top.id)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition-all cursor-pointer shadow-2xs ${
                          active
                            ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                            : 'bg-white border-[#e6dcce] text-stone-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                              active ? 'border-[#9c6530] bg-[#9c6530] text-white' : 'border-stone-300'
                            }`}
                          >
                            {active && '✓'}
                          </span>
                          {top.name}
                        </span>
                        <span className="font-mono-numbers text-[#9c6530] font-semibold">{top.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Receipt Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#e4d8cb] shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-[#f0e6da] pb-4">
              <span className="text-xs uppercase tracking-wider text-[#9c6530] font-bold">
                Чек калькулятора
              </span>
              <span className="text-xs text-stone-500 font-mono-numbers">
                ~ {calculation.calories} ккал
              </span>
            </div>

            {/* Drink Snapshot */}
            <div className="flex items-center gap-3">
              <img
                src={normalizeImageUrl(selectedBase.image)}
                alt={selectedBase.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#e4d8cb] shadow-2xs"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e, selectedBase.category)}
              />
              <div>
                <h4 className="font-display text-lg font-bold text-[#2c221a]">
                  {selectedBase.name}
                </h4>
                <div className="text-xs text-stone-500 space-x-1">
                  <span>{size.toUpperCase()}</span>
                  <span>·</span>
                  <span>{temperature === 'iced' ? 'Со льдом' : 'Горячий'}</span>
                  <span>·</span>
                  <span>{beanType === 'ethiopia' ? 'Эфиопия' : beanType === 'colombia_decaf' ? 'Декаф' : 'Бленд NAZ'}</span>
                </div>
              </div>
            </div>

            {/* Recipe Details List */}
            <div className="space-y-2 text-xs border-t border-[#f0e6da] pt-4 text-stone-600">
              <div className="flex justify-between">
                <span>База: {selectedBase.name}</span>
                <span className="font-mono-numbers font-semibold text-[#2c221a]">
                  {selectedBase.basePrice.toLocaleString('ru-RU')} ₸
                </span>
              </div>
              {size !== 'm' && (
                <div className="flex justify-between">
                  <span>Объем: {size.toUpperCase()}</span>
                  <span className="font-mono-numbers text-[#2c221a]">
                    {size === 's' ? '-200 ₸' : '+400 ₸'}
                  </span>
                </div>
              )}
              {beanType !== 'house' && (
                <div className="flex justify-between">
                  <span>Зерно: {beanType === 'ethiopia' ? 'Эфиопия' : 'Декаф'}</span>
                  <span className="font-mono-numbers text-[#2c221a]">
                    {beanType === 'ethiopia' ? '+300 ₸' : '+350 ₸'}
                  </span>
                </div>
              )}
              {selectedBase.defaultMilk && milkType !== 'classic' && (
                <div className="flex justify-between">
                  <span>Молоко: {milkType}</span>
                  <span className="font-mono-numbers text-[#2c221a]">
                    {milkType === 'lactose_free' ? '+250 ₸' : milkType === 'oat' ? '+350 ₸' : '+400 ₸'}
                  </span>
                </div>
              )}
              {extraShots > 0 && (
                <div className="flex justify-between">
                  <span>Доп. эспрессо ({extraShots})</span>
                  <span className="font-mono-numbers text-[#2c221a]">+{extraShots * 300} ₸</span>
                </div>
              )}
              {syrup !== 'none' && (
                <div className="flex justify-between">
                  <span>Сироп: {syrup}</span>
                  <span className="font-mono-numbers text-[#2c221a]">+250 ₸</span>
                </div>
              )}
            </div>

            {/* Total Highlight in Tenge */}
            <div className="border-t border-[#f0e6da] pt-4 flex items-baseline justify-between">
              <span className="text-sm font-bold text-[#2c221a]">Итоговая стоимость:</span>
              <span className="font-mono-numbers text-3xl font-extrabold text-[#9c6530]">
                {calculation.price.toLocaleString('ru-RU')} ₸
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddCustomDrinkToCart}
                className="w-full py-3.5 rounded-2xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isAddedFeedback ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Добавлено в корзину!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Добавить мой кофе в заказ</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  handleAddCustomDrinkToCart();
                  setIsCartOpen(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-[#f5ede3] hover:bg-[#ebe0d4] text-[#824f21] font-semibold text-xs transition-colors cursor-pointer border border-[#e4d6c7]"
              >
                Оформить заказ в корзине
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f4ed] border border-[#e8ded3] flex items-center gap-3 text-xs text-stone-600">
            <Info className="w-4 h-4 text-[#9c6530] shrink-0" />
            <span>
              Сумма рассчитывается автоматически. Вы сможете оплатить заказ на кассе кофейни NAZ COFFEE!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
