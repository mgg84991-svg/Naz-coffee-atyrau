import React, { useState, useMemo } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { MenuItem, ProductCategory, ItemType } from '../types';
import {
  Search,
  Plus,
  Check,
  Sparkles,
  Coffee,
  Croissant,
  Sliders,
  Lock,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { normalizeImageUrl, handleImageError } from '../utils/imageHelper';

const PRESET_PHOTOS = [
  { label: 'Флэт Уайт / Капучино', url: '/images/coffee_flat_white_cup_1790603521645.jpg' },
  { label: 'Кемекс / Фильтр', url: '/images/coffee_pourover_chemex_1790603537900.jpg' },
  { label: 'Авторский Раф', url: '/images/coffee_specialty_raf_1790603574318.jpg' },
  { label: 'Ремесленный круассан', url: '/images/pastry_artisan_croissant_1790603557602.jpg' },
  { label: 'Сырники со сметаной', url: '/images/syrniki.jpg' },
  { label: 'Авокадо тост', url: '/images/avocado_toast.jpg' },
  { label: 'Чизкейк Сан-Себастьян', url: '/images/cheesecake.jpg' },
  { label: 'Матча Латте', url: '/images/matcha_latte.jpg' },
  { label: 'Ягодный чай', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80' },
];

export const MenuSection: React.FC = () => {
  const {
    menu,
    addToCart,
    promotions,
    isOwnerAuthenticated,
    loginAsOwner,
    setIsUserModalOpen,
    addMenuItem,
    updateItemPrice,
    updateItemCostPrice,
  } = useCoffee();

  const [itemTypeFilter, setItemTypeFilter] = useState<'all' | 'drink' | 'food'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<{ [id: string]: boolean }>({});

  // Bottom Add Position / Edit Prices Section State
  const [isBottomFormExpanded, setIsBottomFormExpanded] = useState(false);
  const [bottomPinInput, setBottomPinInput] = useState('');
  const [bottomPinError, setBottomPinError] = useState(false);

  // New Dish Form
  const [newDishName, setNewDishName] = useState('');
  const [newDishType, setNewDishType] = useState<ItemType>('drink');
  const [newDishCategory, setNewDishCategory] = useState<ProductCategory>('coffee');
  const [newDishPrice, setNewDishPrice] = useState<number>(1600);
  const [newDishCostPrice, setNewDishCostPrice] = useState<number>(450);
  const [newDishVolume, setNewDishVolume] = useState('350 мл');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishIngredients, setNewDishIngredients] = useState('Спешелти зерно, молоко, авторский сироп');
  const [newDishImage, setNewDishImage] = useState<string>(PRESET_PHOTOS[0].url);
  const [dishCreatedSuccess, setDishCreatedSuccess] = useState<string | null>(null);

  // Quick price editor at bottom
  const [quickPriceSearch, setQuickPriceSearch] = useState('');

  const categories = [
    { id: 'all', label: 'Все категории' },
    { id: 'coffee', label: 'Классический кофе' },
    { id: 'specialty', label: 'Спешелти & Фильтр' },
    { id: 'tea', label: 'Матча & Чай' },
    { id: 'bakery', label: 'Ремесленная выпечка' },
    { id: 'breakfast', label: 'Свежие завтраки' },
    { id: 'dessert', label: 'Десерты' },
  ];

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      if (itemTypeFilter !== 'all' && item.itemType !== itemTypeFilter) {
        return false;
      }
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      if (showOnlyAvailable && !item.isAvailable) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIng = item.ingredients?.some((ing) => ing.toLowerCase().includes(query));
        return matchesName || matchesDesc || matchesIng;
      }
      return true;
    });
  }, [menu, itemTypeFilter, activeCategory, showOnlyAvailable, searchQuery]);

  const handleQuickAdd = (item: MenuItem) => {
    if (!item.isAvailable) return;
    addToCart(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  // Handle Photo Upload from User Device
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

  // Handle Create Dish from Bottom Form
  const handleCreateDishFromBottom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    addMenuItem({
      name: newDishName.trim(),
      itemType: newDishType,
      category: newDishCategory,
      price: Number(newDishPrice),
      costPrice: Number(newDishCostPrice),
      volumeOrWeight: newDishVolume.trim() || (newDishType === 'drink' ? '350 мл' : '180 г'),
      description: newDishDesc.trim() || 'Авторская позиция спешелти-кофейни NAZ COFFEE',
      ingredients: newDishIngredients.split(',').map((s) => s.trim()).filter(Boolean),
      image: newDishImage,
      isAvailable: true,
      popular: false,
    });

    setDishCreatedSuccess(`Позиция «${newDishName}» успешно выложена в меню с ценой ${Number(newDishPrice).toLocaleString('ru-RU')} ₸!`);
    setNewDishName('');
    setNewDishDesc('');
    setTimeout(() => setDishCreatedSuccess(null), 4000);
  };

  // Handle Bottom PIN Unlock
  const handleBottomPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bottomPinInput.trim() === '2026' || bottomPinInput.trim() === '1234') {
      loginAsOwner(bottomPinInput.trim());
      setBottomPinInput('');
      setBottomPinError(false);
      setIsBottomFormExpanded(true);
    } else {
      setBottomPinError(true);
      setTimeout(() => setBottomPinError(false), 2000);
    }
  };

  const drinkCount = useMemo(() => menu.filter((m) => m.itemType === 'drink').length, [menu]);
  const foodCount = useMemo(() => menu.filter((m) => m.itemType === 'food').length, [menu]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#2c221a]">
      {/* Top Welcome Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#fbf4eb] to-[#f4ebe0] border border-[#e8dccf] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white text-[#9c6530] border border-[#e3d3c2] shrink-0 shadow-2xs">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base sm:text-lg text-[#2c221a]">
              Свежее меню спешелти кофейни NAZ COFFEE (г. Атырау)
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Выбирайте напитки и блюда. Итоговая стоимость в тенге рассчитывается автоматически, оплатить можно прямо на кассе!
            </p>
          </div>
        </div>

        {isOwnerAuthenticated && (
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-white hover:bg-stone-50 border border-[#dfcfbd] text-xs font-semibold text-[#824f21] flex items-center gap-2 transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#9c6530]" />
            <span>Личный кабинет</span>
          </button>
        )}
      </div>

      {/* Promotions Strip (Live from Promotions State, can be modified by owner) */}
      {promotions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-[#9c6530] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Акции и спецпредложения кофейни в Атырау
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {promotions.filter((p) => p.active).map((promo) => (
              <div
                key={promo.id}
                className="p-4 rounded-2xl bg-white border border-[#ebdcd0] flex flex-col justify-between space-y-2 hover:border-[#cfb6a3] transition-colors shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#f5e8db] text-[#834f20] border border-[#e5d0be]">
                      {promo.badge}
                    </span>
                    {promo.promoCode && (
                      <span className="text-[10px] font-mono font-semibold text-stone-500">
                        Промокод: <strong className="text-stone-800">{promo.promoCode}</strong>
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#2c221a] mt-2">
                    {promo.title}
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {promo.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f5ede3] flex items-center justify-between text-[11px] text-stone-500">
                  <span>{promo.discountPercent ? `Скидка ${promo.discountPercent}%` : 'Спеццена'}</span>
                  <span className="font-semibold text-[#9c6530]">Применяется в корзине</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Type Switcher: Drinks (Напитки) / Food (Блюда) / All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex p-1.5 bg-[#f5ede3] rounded-2xl border border-[#e5d5c5] max-w-md">
          <button
            onClick={() => setItemTypeFilter('all')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              itemTypeFilter === 'all'
                ? 'bg-white text-[#9c6530] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Все ({menu.length})
          </button>
          <button
            onClick={() => setItemTypeFilter('drink')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              itemTypeFilter === 'drink'
                ? 'bg-white text-[#9c6530] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>Напитки ({drinkCount})</span>
          </button>
          <button
            onClick={() => setItemTypeFilter('food')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              itemTypeFilter === 'food'
                ? 'bg-white text-[#9c6530] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Croissant className="w-4 h-4" />
            <span>Блюда ({foodCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск напитка или блюда..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#e4d6c7] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#9c6530] shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#9c6530] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-[#e8ded3] hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {filteredMenu.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#ebdcd0] space-y-3">
          <Coffee className="w-10 h-10 text-stone-300 mx-auto" />
          <p className="text-sm text-stone-500 font-medium">
            Позиции по выбранным параметрам не найдены
          </p>
          <button
            onClick={() => {
              setItemTypeFilter('all');
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#f5ede3] text-[#9c6530] text-xs font-semibold hover:bg-[#ebdcd0] transition-colors"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item) => {
            const isAdded = addedItemIds[item.id];
            return (
              <div
                key={item.id}
                className="group rounded-3xl bg-white border border-[#e8dfd5] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#cfb6a3] transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#f5ede3]">
                  <img
                    src={normalizeImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, item.category)}
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-[#9c6530] shadow-xs">
                      {item.itemType === 'drink' ? '☕ Напиток' : '🥐 Блюдо'}
                    </span>
                    {item.popular && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs">
                        Хит
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-stone-900/70 text-white backdrop-blur-xs">
                      {item.volumeOrWeight}
                    </span>
                  </div>

                  {!item.isAvailable && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg shadow-sm">
                        Стоп-лист (закончилось)
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-bold text-[#2c221a] group-hover:text-[#9c6530] transition-colors">
                        {item.name}
                      </h3>
                      {/* Live Price in Tenge */}
                      <span className="font-mono-numbers text-xl font-extrabold text-[#9c6530] shrink-0">
                        {item.price.toLocaleString('ru-RU')} ₸
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[#f2e7db]">
                        {item.ingredients.map((ing, idx) => (
                          <span key={idx} className="text-[11px] text-stone-500">
                            {ing}
                            {idx < item.ingredients.length - 1 && ' ·'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions: Add to Cart */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleQuickAdd(item)}
                      disabled={!item.isAvailable}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        !item.isAvailable
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#9c6530] hover:bg-[#855325] text-white shadow-xs'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Добавлено в заказ!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>В корзину · {item.price.toLocaleString('ru-RU')} ₸</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ➕ ВЛОЖИТЬ ЦЕНЫ ИЛИ ПОЗИЦИЮ СНИЗУ С ВЫКЛАДКОЙ ФОТО (ПО ЗАПРОСУ ПОЛЬЗОВАТЕЛЯ) */}
      {/* ========================================================================= */}
      <section className="mt-12 pt-6 border-t border-[#e8dfd5]">
        {!isOwnerAuthenticated ? (
          <div className="text-center py-2">
            {!isBottomFormExpanded ? (
              <button
                onClick={() => setIsBottomFormExpanded(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#8f7e70] hover:text-[#231c16] hover:bg-[#ede5dc]/60 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#935a22]" />
                <span>Управление меню</span>
              </button>
            ) : (
              <form onSubmit={handleBottomPinSubmit} className="p-5 rounded-2xl bg-white border border-[#ded0c1] max-w-sm mx-auto text-center space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#f0eae3]">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#231c16]">
                    <Lock className="w-4 h-4 text-[#935a22]" />
                    <span>Доступ к управлению</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBottomFormExpanded(false);
                      setBottomPinError(false);
                      setBottomPinInput('');
                    }}
                    className="p-1 text-[#8f7e70] hover:text-[#231c16] rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-[#705e4f]">
                  Введите PIN-код для редактирования меню и цен
                </p>

                <div className="flex items-center justify-center gap-2">
                  <input
                    type="password"
                    maxLength={4}
                    value={bottomPinInput}
                    onChange={(e) => {
                      setBottomPinInput(e.target.value);
                      setBottomPinError(false);
                    }}
                    placeholder="••••"
                    className="w-28 text-center tracking-widest text-lg font-mono font-bold px-3 py-2 rounded-xl bg-[#faf6f0] border border-[#ded0c1] text-[#231c16] outline-none focus:border-[#935a22]"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold cursor-pointer transition-colors"
                  >
                    Войти
                  </button>
                </div>

                {bottomPinError && (
                  <p className="text-xs text-rose-600 font-semibold">
                    Неверный PIN-код
                  </p>
                )}
              </form>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-[#e8dfd5] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f0eae3]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#faf6f0] border border-[#ded0c1] flex items-center justify-center text-[#935a22] shadow-xs shrink-0">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-bold text-lg text-[#231c16]">
                      Вложить позицию и цены снизу страницы
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Режим владелицы
                    </span>
                  </div>
                  <p className="text-xs text-[#705e4f] mt-0.5">
                    Быстрое добавление напитков или блюд с фото и настройка цен меню кофейни
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsBottomFormExpanded((prev) => !prev)}
                  className="px-4 py-2 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isBottomFormExpanded ? 'Свернуть форму' : '➕ Вложить позицию сейчас'}</span>
                  {isBottomFormExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Success Banner */}
            {dishCreatedSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{dishCreatedSuccess}</span>
              </div>
            )}

            {/* If Authenticated: Interactive Full Form to Add Position with Photo Upload directly from bottom! */}
            {isBottomFormExpanded && (
              <form onSubmit={handleCreateDishFromBottom} className="space-y-5 p-5 rounded-2xl bg-[#faf6f0] border border-[#ded0c1]">
              <div className="flex items-center justify-between pb-2 border-b border-[#e8dfd5]">
                <h5 className="font-bold text-sm text-[#231c16] flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#935a22]" />
                  <span>Форма выкладки нового напитка или блюда в меню</span>
                </h5>
                <span className="text-xs text-[#705e4f]">г. Атырау • NAZ COFFEE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#231c16]">Название позиции *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Например: Раф Атырау или Бриошь с ягодами"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#231c16]">Тип позиции</label>
                  <select
                    value={newDishType}
                    onChange={(e) => setNewDishType(e.target.value as ItemType)}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
                  >
                    <option value="drink">☕ Напиток</option>
                    <option value="food">🥐 Блюдо / Еда</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#231c16]">Категория меню</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value as ProductCategory)}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#231c16]">Цена продажи в тенге (₸) *</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono font-bold text-[#935a22] focus:border-[#935a22] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#231c16]">Себестоимость порции (₸)</label>
                  <input
                    type="number"
                    step="50"
                    value={newDishCostPrice}
                    onChange={(e) => setNewDishCostPrice(Number(e.target.value))}
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs font-mono text-[#705e4f] focus:border-[#935a22] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#231c16]">Объем или вес</label>
                  <input
                    type="text"
                    value={newDishVolume}
                    onChange={(e) => setNewDishVolume(e.target.value)}
                    placeholder="350 мл или 180 г"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
                  />
                </div>
              </div>

              {/* PHOTO UPLOAD & PRESET SELECTION */}
              <div className="p-4 rounded-2xl bg-white border border-[#e8dfd5] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#231c16] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#935a22]" />
                    <span>Выкладка фотографии для позиции (с устройства или из галереи)</span>
                  </label>
                  <span className="text-[11px] text-[#705e4f]">JPG, PNG, WebP</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview */}
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-[#ded0c1] overflow-hidden bg-[#faf6f0] shrink-0 flex items-center justify-center shadow-xs">
                    {newDishImage ? (
                      <img
                        src={normalizeImageUrl(newDishImage)}
                        alt="Предпросмотр"
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e, newDishCategory)}
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-300" />
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0e6da] border border-[#ded0c1] text-xs font-bold text-[#231c16] cursor-pointer transition-colors shadow-2xs">
                        <Upload className="w-4 h-4 text-[#935a22]" />
                        <span>📷 Загрузить фото со своего устройства</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>

                      <span className="text-xs text-[#705e4f]">или выберите готовое фото:</span>
                    </div>

                    {/* Presets Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PHOTOS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setNewDishImage(preset.url)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer border ${
                            newDishImage === preset.url
                              ? 'bg-[#935a22] text-white border-[#935a22]'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={newDishImage}
                      onChange={(e) => setNewDishImage(e.target.value)}
                      placeholder="Или вставьте прямую ссылку на фото (URL)"
                      className="w-full px-3 py-1.5 rounded-lg bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#231c16]">Описание для гостей</label>
                  <input
                    type="text"
                    value={newDishDesc}
                    onChange={(e) => setNewDishDesc(e.target.value)}
                    placeholder="Например: Нежный кофейный напиток на основе сливок с нотками карамели..."
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#231c16]">Состав (через запятую)</label>
                  <input
                    type="text"
                    value={newDishIngredients}
                    onChange={(e) => setNewDishIngredients(e.target.value)}
                    placeholder="Эспрессо, сливки 10%, ванильный сахар, карамель"
                    className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white border border-[#e8dfd5] text-xs text-[#231c16] focus:border-[#935a22] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <span className="text-xs text-[#705e4f]">
                  После сохранения позиция мгновенно появится в общем меню кофейни!
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBottomFormExpanded(false)}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-xs font-semibold text-stone-700"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#935a22] hover:bg-[#7e4c1b] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Выложить в меню прямо сейчас</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Quick Price Editor: directly at bottom of page */}
          {isOwnerAuthenticated && (
            <div className="pt-4 border-t border-[#f0eae3] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#935a22]" />
                  <span className="font-bold text-xs text-[#231c16]">
                    Быстрое изменение цен на существующие позиции (₸):
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Быстрый поиск позиции..."
                  value={quickPriceSearch}
                  onChange={(e) => setQuickPriceSearch(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] text-xs text-[#231c16] outline-none max-w-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {menu
                  .filter((m) =>
                    !quickPriceSearch.trim() ||
                    m.name.toLowerCase().includes(quickPriceSearch.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#faf6f0] border border-[#e8dfd5] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-[#231c16] truncate block">{item.name}</span>
                        <span className="text-[10px] text-[#705e4f]">{item.volumeOrWeight}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="number"
                          step="50"
                          value={item.price}
                          onChange={(e) => updateItemPrice(item.id, Number(e.target.value))}
                          className="w-20 px-2 py-1 rounded-lg bg-white border border-[#ded0c1] text-xs font-bold font-mono text-[#935a22] text-right"
                        />
                        <span className="font-bold text-[#705e4f]">₸</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
      </section>
    </div>
  );
};
