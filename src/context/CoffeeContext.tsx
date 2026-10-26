import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MenuItem,
  StockItem,
  CartItem,
  Order,
  TableBooking,
  WaiterCall,
  Review,
  Promotion,
  PushNotification,
  UserProfile,
  BrandSettings,
  DrinkCustomization,
  ShiftReport,
  TelegramMessage,
} from '../types';
import {
  INITIAL_BRAND_SETTINGS,
  INITIAL_STOCK,
  INITIAL_MENU,
  INITIAL_PROMOTIONS,
  INITIAL_REVIEWS,
  INITIAL_USER,
  INITIAL_ORDERS,
  INITIAL_BOOKINGS,
  INITIAL_REPORTS,
} from '../data/initialData';
import { normalizeImageUrl } from '../utils/imageHelper';

interface CoffeeContextType {
  // Brand
  brand: BrandSettings;
  updateBrand: (settings: Partial<BrandSettings>) => void;

  // View state (guest or admin)
  viewMode: 'guest' | 'admin';
  setViewMode: (mode: 'guest' | 'admin') => void;
  guestTab: 'menu' | 'calculator' | 'booking' | 'reviews';
  setGuestTab: (tab: 'menu' | 'calculator' | 'booking' | 'reviews') => void;
  adminTab: 'cost_calculator' | 'menu_manager' | 'analytics' | 'inventory' | 'waiter_calls' | 'bookings' | 'marketing' | 'brand' | 'reviews';
  setAdminTab: (tab: 'cost_calculator' | 'menu_manager' | 'analytics' | 'inventory' | 'waiter_calls' | 'bookings' | 'marketing' | 'brand' | 'reviews') => void;

  // Owner authentication (PIN protected for prices & себестоимость)
  isOwnerAuthenticated: boolean;
  loginAsOwner: (pin: string) => boolean;
  logoutOwner: () => void;
  isOwnerPinModalOpen: boolean;
  setIsOwnerPinModalOpen: (open: boolean) => void;

  // Menu (drinks and dishes added manually by owner)
  menu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  updateItemPrice: (id: string, newPrice: number) => void;
  updateItemCostPrice: (id: string, newCostPrice: number) => void;
  toggleItemAvailability: (id: string) => void;
  deleteMenuItem: (id: string) => void;

  // Warehouse / Stock
  stock: StockItem[];
  updateStockQuantity: (id: string, delta: number) => void;
  setStockQuantity: (id: string, quantity: number) => void;
  addStockItem: (item: Omit<StockItem, 'id' | 'lastUpdated'>) => void;
  lowStockItems: StockItem[];

  // Cart (automatic cost calculation in tenge)
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number, customization?: DrinkCustomization) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;

  // Orders & Payment at register
  orders: Order[];
  placeOrder: (details: {
    orderType: 'dine_in' | 'takeaway';
    tableNumber?: number;
    paymentMethod: 'cash_register' | 'kaspi_qr' | 'card' | 'cash';
    promoCode?: string;
    useBonusPoints?: number;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Table Bookings
  bookings: TableBooking[];
  createBooking: (booking: Omit<TableBooking, 'id' | 'createdAt' | 'status'>) => TableBooking;
  updateBookingStatus: (bookingId: string, status: TableBooking['status']) => void;

  // Waiter Calls
  waiterCalls: WaiterCall[];
  callWaiter: (tableNumber: number, reason: WaiterCall['reason'], reasonText: string) => WaiterCall;
  resolveWaiterCall: (callId: string) => void;
  activeWaiterCallsCount: number;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  replyToReview: (reviewId: string, response: string) => void;

  // Shift & Daily Reports (ввести отчет за смену / день)
  shiftReports: ShiftReport[];
  addShiftReport: (report: Omit<ShiftReport, 'id' | 'createdAt'>) => void;
  deleteShiftReport: (id: string) => void;

  // Telegram Notifications to Gainiden Madina (@GainidenMadina)
  telegramLogs: TelegramMessage[];
  sendTelegramNotification: (msg: { type: TelegramMessage['type']; title: string; text: string }) => TelegramMessage;

  // Promotions & Push
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => void;
  togglePromotion: (id: string) => void;
  deletePromotion: (id: string) => void;

  pushNotifications: PushNotification[];
  sendPushNotification: (push: { title: string; message: string; promoCode?: string; targetAudience: 'all' | 'loyal' | 'new' }) => void;
  activePushBanner: PushNotification | null;
  dismissPushBanner: () => void;

  // User & Auth
  user: UserProfile;
  isLoggedIn: boolean;
  requestSmsCode: (phone: string) => { code: string };
  verifySmsCode: (phone: string, code: string) => boolean;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logoutUser: () => void;

  // Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  isWaiterModalOpen: boolean;
  setIsWaiterModalOpen: (open: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
}

const CoffeeContext = createContext<CoffeeContextType | undefined>(undefined);

const STORAGE_PREFIX = 'naz_coffee_v3_';

export const CoffeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand
  const [brand, setBrand] = useState<BrandSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}brand`);
    return saved ? JSON.parse(saved) : INITIAL_BRAND_SETTINGS;
  });

  // View mode: default is 'guest' (menu and selection of drinks and food)
  const [viewMode, setViewMode] = useState<'guest' | 'admin'>('guest');
  const [guestTab, setGuestTab] = useState<'menu' | 'calculator' | 'booking' | 'reviews'>('menu');
  const [adminTab, setAdminTab] = useState<'cost_calculator' | 'menu_manager' | 'analytics' | 'inventory' | 'waiter_calls' | 'bookings' | 'marketing' | 'brand' | 'reviews'>('cost_calculator');

  // Owner authentication for editing prices & calculating себестоимость (PIN 2026)
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(false);
  const [isOwnerPinModalOpen, setIsOwnerPinModalOpen] = useState(false);

  // Menu (drinks and dishes)
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}menu`);
    if (saved) {
      try {
        const parsed: MenuItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          image: normalizeImageUrl(item.image),
        }));
      } catch {
        return INITIAL_MENU;
      }
    }
    return INITIAL_MENU;
  });

  // Stock
  const [stock, setStock] = useState<StockItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}stock`);
    return saved ? JSON.parse(saved) : INITIAL_STOCK;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
    if (saved) {
      try {
        const parsed: CartItem[] = JSON.parse(saved);
        return parsed.map((item) => ({
          ...item,
          menuItem: {
            ...item.menuItem,
            image: normalizeImageUrl(item.menuItem.image),
          },
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Bookings
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}bookings`);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  // Waiter calls
  const [waiterCalls, setWaiterCalls] = useState<WaiterCall[]>([]);

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}reviews`);
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Shift & Daily reports (отчеты смены / дня)
  const [shiftReports, setShiftReports] = useState<ShiftReport[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}shift_reports`);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  // Promotions
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}promos`);
    return saved ? JSON.parse(saved) : INITIAL_PROMOTIONS;
  });

  // Telegram Notifications to Gainiden Madina (@GainidenMadina)
  const [telegramLogs, setTelegramLogs] = useState<TelegramMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}telegram_logs`);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'tg-init-1',
            type: 'system',
            title: 'Интеграция Telegram подключена',
            text: 'Все заказы, отзывы и бронирования кофейни NAZ COFFEE поступают к Gainiden Madina (@GainidenMadina).',
            recipient: 'Gainiden Madina (@GainidenMadina)',
            timestamp: 'Сегодня, 08:00',
            status: 'delivered',
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}telegram_logs`, JSON.stringify(telegramLogs));
  }, [telegramLogs]);

  const sendTelegramNotification = ({
    type,
    title,
    text,
  }: {
    type: TelegramMessage['type'];
    title: string;
    text: string;
  }): TelegramMessage => {
    const newMsg: TelegramMessage = {
      id: `tg-${Date.now()}`,
      type,
      title,
      text,
      recipient: `${brand.ownerName || 'Gainiden Madina'} (@${brand.telegramUsername || 'GainidenMadina'})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };
    setTelegramLogs((prev) => [newMsg, ...prev]);
    return newMsg;
  };

  // Push notifications
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);
  const [activePushBanner, setActivePushBanner] = useState<PushNotification | null>(null);

  // User profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}brand`, JSON.stringify(brand));
  }, [brand]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}menu`, JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}stock`, JSON.stringify(stock));
  }, [stock]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}bookings`, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}reviews`, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}shift_reports`, JSON.stringify(shiftReports));
  }, [shiftReports]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}promos`, JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}owner_auth`, isOwnerAuthenticated ? 'true' : 'false');
  }, [isOwnerAuthenticated]);

  // Brand update
  const updateBrand = (settings: Partial<BrandSettings>) => {
    setBrand((prev) => ({ ...prev, ...settings }));
  };

  // Owner authentication
  const loginAsOwner = (pin: string) => {
    if (pin.trim() === '2026' || pin.trim() === '1234') {
      setIsOwnerAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutOwner = () => {
    setIsOwnerAuthenticated(false);
    setViewMode('guest');
  };

  // Menu functions
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: `menu-${Date.now()}`,
    };
    setMenu((prev) => [newItem, ...prev]);
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const updateItemPrice = (id: string, newPrice: number) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: Math.max(0, newPrice) } : item))
    );
  };

  const updateItemCostPrice = (id: string, newCostPrice: number) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, costPrice: Math.max(0, newCostPrice) } : item))
    );
  };

  const toggleItemAvailability = (id: string) => {
    setMenu((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item))
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  // Stock functions
  const updateStockQuantity = (id: string, delta: number) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStock((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, Number((item.quantity + delta).toFixed(2)));
          return {
            ...item,
            quantity: newQty,
            lastUpdated: `Сегодня, ${now}`,
          };
        }
        return item;
      })
    );
  };

  const setStockQuantity = (id: string, quantity: number) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setStock((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: Math.max(0, quantity),
            lastUpdated: `Сегодня, ${now}`,
          };
        }
        return item;
      })
    );
  };

  const addStockItem = (itemData: Omit<StockItem, 'id' | 'lastUpdated'>) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newItem: StockItem = {
      ...itemData,
      id: `stock-${Date.now()}`,
      lastUpdated: `Сегодня, ${now}`,
    };
    setStock((prev) => [...prev, newItem]);
  };

  const lowStockItems = stock.filter((item) => item.quantity <= item.minThreshold);

  // Cart functions
  const addToCart = (menuItem: MenuItem, quantity = 1, customization?: DrinkCustomization) => {
    const itemTotalPrice = customization ? customization.calculatedPrice : menuItem.price;
    const cartItemId = customization
      ? `custom-${menuItem.id}-${Date.now()}`
      : `standard-${menuItem.id}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1 && !customization) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId,
          menuItem,
          quantity,
          customization,
          itemTotalPrice,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateCartItemQty = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotalPrice * item.quantity, 0);

  // Orders & Stock deduction
  const placeOrder = ({
    orderType,
    tableNumber,
    paymentMethod,
    promoCode,
    useBonusPoints = 0,
  }: {
    orderType: 'dine_in' | 'takeaway';
    tableNumber?: number;
    paymentMethod: 'cash_register' | 'kaspi_qr' | 'card' | 'cash';
    promoCode?: string;
    useBonusPoints?: number;
  }): Order | null => {
    if (cart.length === 0) return null;

    let discount = 0;
    if (promoCode) {
      const activePromo = promotions.find(
        (p) => p.active && p.promoCode?.toUpperCase() === promoCode.trim().toUpperCase()
      );
      if (activePromo?.discountPercent) {
        discount = Math.round((cartTotal * activePromo.discountPercent) / 100);
      } else if (activePromo?.fixedPrice && cartTotal > activePromo.fixedPrice) {
        discount = Math.min(600, Math.round(cartTotal * 0.15));
      }
    }

    const appliedBonus = Math.min(useBonusPoints, user.bonusBalance, cartTotal - discount);
    const finalTotal = Math.max(0, cartTotal - discount - appliedBonus);

    const now = new Date();
    const timeStr = `Сегодня, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: timeStr,
      customerName: user.name || 'Гость NAZ COFFEE',
      customerPhone: user.phone || '+7 (701) 000-00-00',
      orderType,
      tableNumber,
      items: [...cart],
      subtotal: cartTotal,
      discount,
      bonusUsed: appliedBonus,
      total: finalTotal,
      status: 'brewing',
      paymentMethod,
      paymentStatus: paymentMethod === 'cash_register' ? 'pending' : 'paid',
      payAtRegisterNotice: true,
    };

    // Deduct stock for items
    cart.forEach((cartItem) => {
      const itemQty = cartItem.quantity;
      if (cartItem.menuItem.requiredStock) {
        cartItem.menuItem.requiredStock.forEach((req) => {
          updateStockQuantity(req.stockItemId, -req.amount * itemQty);
        });
      }
      if (cartItem.customization) {
        if (cartItem.customization.milkType === 'oat') {
          updateStockQuantity('stock-milk-oat', -0.2 * itemQty);
        } else if (cartItem.customization.milkType === 'coconut') {
          updateStockQuantity('stock-milk-coconut', -0.2 * itemQty);
        }
        if (cartItem.customization.syrup === 'salted_caramel') {
          updateStockQuantity('stock-syrup-caramel', -0.02 * itemQty);
        } else if (cartItem.customization.syrup === 'lavender_vanilla') {
          updateStockQuantity('stock-syrup-lavender', -0.02 * itemQty);
        }
      }
    });

    setOrders((prev) => [newOrder, ...prev]);

    // Send Telegram Notification to Gainiden Madina
    const itemsSummary = cart.map((c) => `${c.quantity}x ${c.menuItem.name}`).join(', ');
    sendTelegramNotification({
      type: 'order',
      title: `Новый заказ #${newOrder.id} • ${finalTotal.toLocaleString()} ₸`,
      text: `Заказ ${orderType === 'dine_in' ? 'в заведении (Столик №' + (tableNumber || 1) + ')' : 'с собой'}.\nСостав: ${itemsSummary}\nК оплате на кассе: ${finalTotal.toLocaleString()} ₸\nГость: ${newOrder.customerName} (${newOrder.customerPhone})`,
    });

    // Cashback 5% in bonus beans
    const earnedBonus = Math.round(finalTotal * 0.05);
    setUser((prev) => ({
      ...prev,
      bonusBalance: prev.bonusBalance - appliedBonus + earnedBonus,
      orderCount: prev.orderCount + 1,
      totalSpent: prev.totalSpent + finalTotal,
    }));

    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  // Bookings
  const createBooking = (bookingData: Omit<TableBooking, 'id' | 'createdAt' | 'status'>): TableBooking => {
    const newBooking: TableBooking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      status: 'confirmed',
      createdAt: `Сегодня, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setBookings((prev) => [newBooking, ...prev]);

    // Send Telegram Notification to Gainiden Madina
    sendTelegramNotification({
      type: 'booking',
      title: `Бронь столика №${bookingData.tableNumber} на ${bookingData.date} (${bookingData.timeSlot})`,
      text: `Гость: ${bookingData.customerName} (${bookingData.customerPhone})\nГостей: ${bookingData.guestCount}\n${bookingData.specialRequests ? 'Пожелание: ' + bookingData.specialRequests : ''}`,
    });

    return newBooking;
  };

  const updateBookingStatus = (bookingId: string, status: TableBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
    );
  };

  // Waiter calls
  const callWaiter = (tableNumber: number, reason: WaiterCall['reason'], reasonText: string): WaiterCall => {
    const newCall: WaiterCall = {
      id: `call-${Date.now()}`,
      tableNumber,
      reason,
      reasonText,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      resolved: false,
    };
    setWaiterCalls((prev) => [newCall, ...prev]);
    return newCall;
  };

  const resolveWaiterCall = (callId: string) => {
    setWaiterCalls((prev) =>
      prev.map((c) =>
        c.id === callId
          ? {
              ...c,
              resolved: true,
              resolvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : c
      )
    );
  };

  const activeWaiterCallsCount = waiterCalls.filter((c) => !c.resolved).length;

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: 'Только что',
    };
    setReviews((prev) => [newRev, ...prev]);

    // Send Telegram Notification to Gainiden Madina
    sendTelegramNotification({
      type: 'review',
      title: `Новый отзыв ${reviewData.rating}/5 от ${reviewData.customerName}!`,
      text: `«${reviewData.comment}»\nТеги: ${reviewData.tags.join(', ')}`,
    });
  };

  const replyToReview = (reviewId: string, response: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, response } : r))
    );
  };

  // Shift & Daily reports
  const addShiftReport = (reportData: Omit<ShiftReport, 'id' | 'createdAt'>) => {
    const newReport: ShiftReport = {
      ...reportData,
      id: `rep-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setShiftReports((prev) => [newReport, ...prev]);
  };

  const deleteShiftReport = (id: string) => {
    setShiftReports((prev) => prev.filter((r) => r.id !== id));
  };

  // Promotions & Push
  const addPromotion = (promoData: Omit<Promotion, 'id'>) => {
    const newPromo: Promotion = {
      ...promoData,
      id: `promo-${Date.now()}`,
    };
    setPromotions((prev) => [newPromo, ...prev]);
  };

  const updatePromotion = (id: string, updates: Partial<Promotion>) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const togglePromotion = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  };

  const sendPushNotification = ({
    title,
    message,
    promoCode,
    targetAudience,
  }: {
    title: string;
    message: string;
    promoCode?: string;
    targetAudience: 'all' | 'loyal' | 'new';
  }) => {
    const newPush: PushNotification = {
      id: `push-${Date.now()}`,
      title,
      message,
      promoCode,
      targetAudience,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setPushNotifications((prev) => [newPush, ...prev]);
    setActivePushBanner(newPush);
  };

  const dismissPushBanner = () => setActivePushBanner(null);

  // User Auth & Profile
  const requestSmsCode = (phone: string) => {
    const code = '5421';
    return { code };
  };

  const verifySmsCode = (phone: string, code: string) => {
    if (code.trim() === '5421' || code.trim().length === 4) {
      setUser((prev) => ({
        ...prev,
        phone,
        isPhoneVerified: true,
      }));
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
  };

  return (
    <CoffeeContext.Provider
      value={{
        brand,
        updateBrand,
        viewMode,
        setViewMode,
        guestTab,
        setGuestTab,
        adminTab,
        setAdminTab,
        isOwnerAuthenticated,
        loginAsOwner,
        logoutOwner,
        isOwnerPinModalOpen,
        setIsOwnerPinModalOpen,
        menu,
        addMenuItem,
        updateMenuItem,
        updateItemPrice,
        updateItemCostPrice,
        toggleItemAvailability,
        deleteMenuItem,
        stock,
        updateStockQuantity,
        setStockQuantity,
        addStockItem,
        lowStockItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQty,
        clearCart,
        cartCount,
        cartTotal,
        orders,
        placeOrder,
        updateOrderStatus,
        bookings,
        createBooking,
        updateBookingStatus,
        waiterCalls,
        callWaiter,
        resolveWaiterCall,
        activeWaiterCallsCount,
        reviews,
        addReview,
        replyToReview,
        shiftReports,
        addShiftReport,
        deleteShiftReport,
        telegramLogs,
        sendTelegramNotification,
        promotions,
        addPromotion,
        updatePromotion,
        togglePromotion,
        deletePromotion,
        pushNotifications,
        sendPushNotification,
        activePushBanner,
        dismissPushBanner,
        user,
        isLoggedIn,
        requestSmsCode,
        verifySmsCode,
        updateUserProfile,
        logoutUser,
        isCartOpen,
        setIsCartOpen,
        isUserModalOpen,
        setIsUserModalOpen,
        isWaiterModalOpen,
        setIsWaiterModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,
      }}
    >
      {children}
    </CoffeeContext.Provider>
  );
};

export const useCoffee = () => {
  const context = useContext(CoffeeContext);
  if (!context) {
    throw new Error('useCoffee must be used within a CoffeeProvider');
  }
  return context;
};
