import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Sparkles,
  CreditCard,
  QrCode,
  Banknote,
  Store,
  ArrowRight,
  Info,
  Send,
  ExternalLink,
} from 'lucide-react';
import { normalizeImageUrl, handleImageError } from '../utils/imageHelper';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartItemQty,
    clearCart,
    cartTotal,
    placeOrder,
    user,
    promotions,
    brand,
  } = useCoffee();

  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway'>('dine_in');
  const [tableNumber, setTableNumber] = useState<number>(3);
  const [paymentMethod, setPaymentMethod] = useState<'cash_register' | 'kaspi_qr' | 'card' | 'cash'>('cash_register');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [useBonus, setUseBonus] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  if (!isCartOpen) return null;

  // Calculate discounts in Tenge
  let discountAmount = 0;
  if (appliedPromo) {
    const matched = promotions.find(
      (p) => p.active && p.promoCode?.toUpperCase() === appliedPromo.toUpperCase()
    );
    if (matched?.discountPercent) {
      discountAmount = Math.round((cartTotal * matched.discountPercent) / 100);
    } else if (matched?.fixedPrice && cartTotal > matched.fixedPrice) {
      discountAmount = Math.min(600, Math.round(cartTotal * 0.15));
    }
  }

  const bonusDeduction = useBonus
    ? Math.min(user.bonusBalance, Math.max(0, cartTotal - discountAmount))
    : 0;

  // Automatic live total calculation in Tenge
  const finalTotal = Math.max(0, cartTotal - discountAmount - bonusDeduction);

  const handleApplyPromo = () => {
    const code = promoCodeInput.trim().toUpperCase();
    const matched = promotions.find(
      (p) => p.active && p.promoCode?.toUpperCase() === code
    );
    if (matched) {
      setAppliedPromo(code);
    } else {
      alert('Промокод не найден или срок действия истек');
    }
  };

  const handleCheckout = () => {
    const order = placeOrder({
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      paymentMethod,
      promoCode: appliedPromo || undefined,
      useBonusPoints: bonusDeduction,
    });
    if (order) {
      setConfirmedOrder(order);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf7f2] border-l border-[#e4d8cc] shadow-2xl flex flex-col justify-between text-[#2c221a]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebdcd0] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#f5ede3] border border-[#e3d2c1] text-[#9c6530]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-[#2c221a]">
                  Ваш заказ в NAZ COFFEE
                </h3>
                <span className="text-xs text-stone-500 font-medium">
                  {cart.length > 0 ? `${cart.length} позиций в заказе` : 'Корзина пока пуста'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                setConfirmedOrder(null);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {confirmedOrder ? (
            /* Order Success State - Prominently emphasizing payment at register! */
            <div className="p-6 sm:p-8 text-center space-y-5 my-auto overflow-y-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 animate-in zoom-in shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-[#9c6530] tracking-widest font-bold">
                  Заказ {confirmedOrder.id} успешно принят!
                </span>
                <h4 className="font-display text-2xl font-bold text-[#2c221a] mt-1">
                  Бариста уже готовит ваш заказ
                </h4>
              </div>

              {/* HIGHLIGHTED PAYMENT AT CASH REGISTER NOTICE */}
              <div className="p-4 rounded-2xl bg-[#fff7ed] border-2 border-[#ea580c]/30 text-left space-y-2 shadow-xs">
                <div className="flex items-center gap-2 text-[#9a3412] font-bold text-sm">
                  <Store className="w-5 h-5 shrink-0 text-[#ea580c]" />
                  <span>Оплата на кассе кофейни</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  Пожалуйста, подойдите к кассе: <strong>вы можете оплатить заказ на кассе кофейни</strong> удобным способом — наличными, через Kaspi QR или банковской картой при получении!
                </p>
                <div className="pt-2 border-t border-[#fed7aa] flex items-center justify-between text-xs font-bold text-[#9a3412]">
                  <span>Сумма к оплате на кассе:</span>
                  <span className="font-mono-numbers text-base font-extrabold text-[#c2410c]">
                    {confirmedOrder.total.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>

              {/* Order receipt summary */}
              <div className="p-4 rounded-2xl bg-white border border-[#e4d8cc] text-left text-xs space-y-2.5 text-stone-700 shadow-2xs">
                <div className="flex justify-between text-stone-800 font-bold border-b border-[#f0e6da] pb-2">
                  <span>Итого к оплате:</span>
                  <span className="font-mono-numbers text-[#9c6530] text-sm">
                    {confirmedOrder.total.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Формат:</span>
                  <span>
                    {confirmedOrder.orderType === 'dine_in'
                      ? `В зале (Столик №${confirmedOrder.tableNumber || 1})`
                      : 'Навынос (с собой)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Адрес:</span>
                  <span className="font-medium text-stone-800">{brand.cityAddress}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Начислено бонусов:</span>
                  <span>+{Math.round(confirmedOrder.total * 0.05)} ₸</span>
                </div>
                <div className="pt-2 border-t border-[#f0e6da] flex items-center justify-between text-[11px] text-[#24A1DE] font-semibold">
                  <span>Telegram {brand.ownerName}:</span>
                  <span>✓ Доставлено (@{brand.telegramUsername})</span>
                </div>
              </div>

              {/* Direct Telegram Chat with Pre-filled Order */}
              {(() => {
                const tgOrderText = `☕ Новый заказ ${confirmedOrder.id} в NAZ COFFEE (Атырау)!\nСумма: ${confirmedOrder.total.toLocaleString('ru-RU')} ₸ (оплата на кассе)\nФормат: ${confirmedOrder.orderType === 'dine_in' ? 'В зале (Стол №' + (confirmedOrder.tableNumber || 1) + ')' : 'Навынос'}\nГость: ${confirmedOrder.customerName} (${confirmedOrder.customerPhone})\nСостав: ${confirmedOrder.items.map((i: any) => `${i.quantity}x ${i.menuItem.name}`).join(', ')}`;
                const tgLink = `https://t.me/${brand.telegramUsername || 'GainidenMadina'}?text=${encodeURIComponent(tgOrderText)}`;
                return (
                  <a
                    href={tgLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#24A1DE] hover:bg-[#1f8ec4] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Открыть заказ в Telegram (@{brand.telegramUsername})</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                );
              })()}

              <button
                onClick={() => {
                  setConfirmedOrder(null);
                  setIsCartOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
              >
                Вернуться в меню
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty State */
            <div className="p-8 text-center space-y-4 my-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#f5ede3] text-[#9c6530] flex items-center justify-center mx-auto border border-[#e2d2c1]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-display text-lg font-bold text-[#2c221a]">
                В вашей корзине пока пусто
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Выберите понравившиеся напитки или блюда в меню, и стоимость рассчитается автоматически!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#9c6530] text-white text-xs font-semibold hover:bg-[#855325] transition-colors cursor-pointer shadow-xs"
              >
                Перейти к меню
              </button>
            </div>
          ) : (
            /* Cart Content Form with Automatic Cost Calculation */
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Items List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-white border border-[#e8ded3] flex gap-3 items-center justify-between shadow-2xs"
                  >
                    <img
                      src={normalizeImageUrl(item.menuItem.image)}
                      alt={item.menuItem.name}
                      className="w-14 h-14 rounded-xl object-cover border border-[#e2d5c5] shrink-0"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, item.menuItem.category)}
                    />

                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-[#2c221a] truncate">
                        {item.menuItem.name}
                      </h4>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        {item.customization ? (
                          <span>
                            {item.customization.size.toUpperCase()} · {item.customization.milkType} ·{' '}
                            {item.customization.beanType}
                          </span>
                        ) : (
                          <span>{item.menuItem.volumeOrWeight}</span>
                        )}
                      </div>
                      <div className="font-mono-numbers text-xs font-bold text-[#9c6530] mt-1">
                        {item.itemTotalPrice.toLocaleString('ru-RU')} ₸
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#ded0c0] rounded-lg bg-[#faf7f2]">
                        <button
                          onClick={() => updateCartItemQty(item.cartItemId, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono-numbers text-xs px-2 font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartItemQty(item.cartItemId, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Delivery Type (Dine-in vs Takeaway) */}
              <div className="space-y-3 pt-2 border-t border-[#ebdcd0]">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Где будете пить кофе?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine_in')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                      orderType === 'dine_in'
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                        : 'bg-white border-[#ded0c0] text-stone-600'
                    }`}
                  >
                    В зале (к столику)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeaway')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-2xs ${
                      orderType === 'takeaway'
                        ? 'bg-[#f7ede2] border-[#9c6530] text-[#2c221a] font-bold'
                        : 'bg-white border-[#ded0c0] text-stone-600'
                    }`}
                  >
                    Навынос (с собой)
                  </button>
                </div>

                {orderType === 'dine_in' && (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#ded0c0] shadow-2xs">
                    <span className="text-xs text-stone-700 font-medium">Номер вашего столика:</span>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(Number(e.target.value))}
                      className="px-3 py-1.5 rounded-xl bg-[#faf7f2] border border-[#d6c7b5] text-xs text-[#2c221a] font-mono-numbers font-semibold outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          Столик №{n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Promo code input */}
              <div className="space-y-2 pt-2 border-t border-[#ebdcd0]">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                  Промокод на скидку
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value)}
                    placeholder="Например: HAPPY15, MORNING24"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#ded0c0] text-xs text-[#2c221a] placeholder-stone-400 uppercase font-mono outline-none focus:border-[#9c6530]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 rounded-xl bg-[#f0e4d6] hover:bg-[#e6d8c8] text-xs font-bold text-[#7d4b1e] border border-[#d8c5b3] transition-colors cursor-pointer"
                  >
                    Применить
                  </button>
                </div>
                {appliedPromo && (
                  <span className="text-[11px] text-emerald-700 font-medium block">
                    ✓ Промокод {appliedPromo} применен к заказу!
                  </span>
                )}
              </div>

              {/* Loyalty Bonus Balance */}
              {user.bonusBalance > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#fffaf5] border border-[#e8dacb] flex items-center justify-between text-xs shadow-2xs">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-stone-800">
                      <Sparkles className="w-3.5 h-3.5 text-[#9c6530]" />
                      <span>Бонусы NAZ: {user.bonusBalance} Зёрен</span>
                    </div>
                    <span className="text-[11px] text-stone-500">
                      1 зерно = 1 тенге скидки
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseBonus(!useBonus)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      useBonus
                        ? 'bg-[#9c6530] text-white border-[#855325]'
                        : 'bg-white text-stone-700 border-[#ded0c0]'
                    }`}
                  >
                    {useBonus ? 'Списано ✓' : 'Списать'}
                  </button>
                </div>
              )}

              {/* PAYMENT AT REGISTER OPTION PROMINENTLY DISPLAYED */}
              <div className="space-y-2.5 pt-2 border-t border-[#ebdcd0]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                    Способ оплаты
                  </label>
                  <span className="text-[11px] font-bold text-[#ea580c] bg-orange-100 px-2 py-0.5 rounded-md">
                    Оплата на кассе доступна
                  </span>
                </div>

                <div className="space-y-2">
                  {/* Option 1: Cash Register (Primary) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_register')}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'cash_register'
                        ? 'bg-[#fff7ed] border-[#ea580c] text-stone-900 ring-2 ring-[#ea580c]/20'
                        : 'bg-white border-[#ded0c0] text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-orange-100 text-[#ea580c] shrink-0 mt-0.5">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          Оплатить на кассе кофейни
                        </span>
                        {paymentMethod === 'cash_register' && (
                          <span className="text-xs font-bold text-[#ea580c]">✓ Выбрано</span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Наличными, через Kaspi QR или картой прямо на стойке при выдаче заказа
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Kaspi QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kaspi_qr')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'kaspi_qr'
                        ? 'bg-[#fff7ed] border-[#ea580c] text-stone-900 ring-2 ring-[#ea580c]/20'
                        : 'bg-white border-[#ded0c0] text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-red-100 text-red-600 shrink-0">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold">Kaspi QR / Kaspi Red</span>
                      <span className="text-[11px] text-stone-500 block">Быстрый перевод без комиссии</span>
                    </div>
                  </button>

                  {/* Option 3: Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-[#fff7ed] border-[#ea580c] text-stone-900 ring-2 ring-[#ea580c]/20'
                        : 'bg-white border-[#ded0c0] text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-stone-100 text-stone-700 shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold">Банковская карта онлайн</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Footer Checkout Summary with Real-Time Total in Tenge */}
          {!confirmedOrder && cart.length > 0 && (
            <div className="p-6 border-t border-[#ebdcd0] bg-white space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Сумма позиций:</span>
                  <span className="font-mono-numbers font-semibold text-stone-900">
                    {cartTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Скидка по акции:</span>
                    <span className="font-mono-numbers">
                      -{discountAmount.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                )}
                {bonusDeduction > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Списание бонусов:</span>
                    <span className="font-mono-numbers">
                      -{bonusDeduction.toLocaleString('ru-RU')} ₸
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-[#2c221a] border-t border-[#f0e6da] pt-2">
                  <span>Автоматический итог:</span>
                  <span className="font-mono-numbers text-2xl font-extrabold text-[#9c6530]">
                    {finalTotal.toLocaleString('ru-RU')} ₸
                  </span>
                </div>
              </div>

              {/* Callout: Notice about payment at cash register */}
              <div className="p-3 rounded-xl bg-[#fff7ed] border border-[#ea580c]/30 text-[11px] text-[#9a3412] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-[#ea580c]" />
                <span>
                  Заказ поступит бариста сразу, а оплатить можно <strong>на кассе кофейни</strong> при получении!
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-2xl bg-[#9c6530] hover:bg-[#855325] text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Подтвердить заказ · {finalTotal.toLocaleString('ru-RU')} ₸</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
