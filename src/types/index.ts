// Карточка товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

// Корзина
export interface IBasket {
  counterProduct: number;
  listProduct: TCounterProduct[];
  totalPrice: number;
}

// Интерфейс корзтины
export interface IBasketData {
  addProduct(value: IProduct): void;
  deleteProduct(productId: string): void;
  getTotalPrice(): number;
}

// Оформление заказа
export interface IOrder {
  payment: TPaymentMethod;
  adress: string;
  email: string;
  phone: string;
  totalPrice: number;
}

// Интерфейс оформления заказа
export interface IOrderData {
  checkValidation(data: Record<keyof IOrder, string>): boolean;
}

// Инфорфейс списка карточек на главной странице
export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getProduct(productId: string): IProduct;
  getCounterProduct(): TCounterProduct;
}

// Выбор способа оплаты
export type TPaymentMethod = 'card' | 'cash';

// Счетчик товаров в корзине в шапке
export type TCounterProduct = Pick<IBasket, 'counterProduct'>;

// Список товаров в корзине
export type TProdctInBasket = Pick<IProduct, 'id' | 'title' | 'price'>;

// Корзина
export type TBasket = Pick<IBasket, 'listProduct' | 'totalPrice'>;

// Оформление - Форма с выбором отплаты и доставка
export type TOrderForm = Pick<IOrder, 'payment' | 'adress'>;

// Оформление - формат контактов
export type TOrderContact = Pick<IOrder, 'email' | 'phone'>;

// Оформление - страница успеха
export type TOrderSuccess = Pick<IOrder, 'totalPrice'>;
