
// Карточка товара
export interface IProduct {
	id: string;
  description: string;
	title: string;
	image: string;
	category: string;
	price: number;
  index: number;
}

// Корзина
export interface IBasket {
	products: HTMLElement[];
	totalPrice: number | null;
	buttonState: number;
}

// Оформление заказа
export interface IOrder {
	payment: string;
  address: string;
	email: string;
	phone: string;
	total: number;
  items: string[];
}

// Успешный заказ
export interface IOrderResult {
	id: string;
}

// Вид страницы
export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

// Cтраницы магазина
export interface IAppState {
	catalog: IProduct[];
	basket: string[];
  preview: string | null;
	order: IOrder | null;
	basketCounter: number;
}

// Api
export interface IApi {
	getProducts: () => Promise<IProduct[]>;
	orderProducts(order: IOrder): Promise<IOrderResult>;
}

// Сосотояние формы
export interface IForm {
	valid: boolean;
	errors: string[];
}

// Оформление заказа
export type TOrder = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

// Ошибки в форме
export type FormErrors = Partial<Record<keyof IOrder, string>>;

