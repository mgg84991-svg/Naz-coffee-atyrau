export type ProductCategory = 'coffee' | 'specialty' | 'tea' | 'bakery' | 'breakfast' | 'dessert';
export type ItemType = 'drink' | 'food';

export interface MenuItem {
  id: string;
  name: string;
  itemType: ItemType; // 'drink' (напитки) or 'food' (блюда)
  category: ProductCategory;
  price: number; // Цена продажи в тенге (₸)
  costPrice: number; // Себестоимость порции в тенге (₸) - доступна в кабинете владелицы
  description: string;
  ingredients: string[];
  image: string;
  volumeOrWeight: string;
  calories?: number;
  isAvailable: boolean;
  isSpecialOffer?: boolean;
  popular?: boolean;
  requiredStock?: {
    stockItemId: string;
    amount: number;
  }[];
}

export interface StockItem {
  id: string;
  name: string;
  category: 'coffee_beans' | 'milk' | 'syrup' | 'packaging' | 'food';
  quantity: number;
  unit: 'кг' | 'л' | 'бут' | 'шт';
  minThreshold: number;
  costPerUnit: number; // Стоимость закупки в тенге (₸)
  lastUpdated: string;
}

export interface DrinkCustomization {
  baseId: string;
  baseName: string;
  size: 's' | 'm' | 'l'; // 250, 350, 450 ml
  beanType: 'house' | 'ethiopia' | 'colombia_decaf';
  milkType: 'classic' | 'oat' | 'almond' | 'coconut' | 'lactose_free';
  extraShots: number;
  syrup: 'none' | 'salted_caramel' | 'lavender_vanilla' | 'hazelnut' | 'pumpkin_spice';
  temperature: 'hot' | 'extra_hot' | 'iced';
  sweetness: 'none' | 'low' | 'normal' | 'cane' | 'stevia';
  toppings: string[];
  calculatedPrice: number; // в тенге (₸)
  calculatedCalories: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  customization?: DrinkCustomization;
  itemTotalPrice: number; // в тенге (₸)
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: 'dine_in' | 'takeaway';
  tableNumber?: number;
  items: CartItem[];
  subtotal: number; // в тенге (₸)
  discount: number; // в тенге (₸)
  bonusUsed: number;
  total: number; // в тенге (₸)
  status: 'new' | 'brewing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'cash_register' | 'kaspi_qr' | 'card' | 'cash';
  paymentStatus: 'paid' | 'pending';
  payAtRegisterNotice?: boolean;
}

export interface TableBooking {
  id: string;
  customerName: string;
  customerPhone: string;
  tableNumber: number;
  guestCount: number;
  date: string;
  timeSlot: string;
  specialRequests?: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface WaiterCall {
  id: string;
  tableNumber: number;
  reason: 'bill' | 'menu' | 'clean' | 'water' | 'barista_question';
  reasonText: string;
  createdAt: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1-5
  tags: string[];
  comment: string;
  createdAt: string;
  response?: string;
}

export interface ShiftReport {
  id: string;
  date: string; // Формат: YYYY-MM-DD или ДД.ММ.ГГГГ
  shift: 'morning' | 'evening' | 'full_day';
  baristaName: string;
  revenueTotal: number; // Общая выручка за смену (₸)
  kaspiQrAmount: number; // Kaspi QR (₸)
  cardAmount: number; // Терминал / картой (₸)
  cashAmount: number; // Наличные (₸)
  checkCount: number; // Количество чеков / заказов
  expensesAmount: number; // Списания и мелкие расходы смены (₸)
  netCashRemainder: number; // Фактический остаток наличности в кассе (₸)
  comment?: string; // Примечание / комментарий
  createdAt: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  discountPercent?: number;
  fixedPrice?: number;
  applicableCategory?: ProductCategory;
  promoCode?: string;
  active: boolean;
  bannerImage?: string;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  promoCode?: string;
  timestamp: string;
  targetAudience: 'all' | 'loyal' | 'new';
  read?: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  name: string;
  email: string;
  birthday?: string;
  favoriteDrink: string;
  milkPreference: string;
  bonusBalance: number; // Зёрна/бонусы
  loyaltyLevel: 'Любитель' | 'Кофеман' | 'Шеф-бариста';
  orderCount: number;
  totalSpent: number;
  isPhoneVerified: boolean;
}

export interface TelegramMessage {
  id: string;
  type: 'order' | 'review' | 'booking' | 'system';
  title: string;
  text: string;
  recipient: string; // "Gainiden Madina (@GainidenMadina)"
  timestamp: string;
  status: 'sent' | 'delivered';
}

export interface BrandSettings {
  shopName: string;
  tagline: string;
  cityAddress: string;
  city: string;
  openingHours: string;
  phone: string;
  logoIcon: 'coffee' | 'cup' | 'sparkles' | 'flame' | 'droplet';
  primaryTheme: 'amber' | 'mocha' | 'matcha' | 'nordic';
  wifiName: string;
  wifiPass: string;
  telegramUsername: string;
  ownerName: string;
}
