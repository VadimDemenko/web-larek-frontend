import { FormErrors, IAppState, IOrder, IProduct, TOrder } from "../types/index";
import { IEvents } from "./base/events";
import { Model } from "./base/Model";


// Класс старницы
export class AppState extends Model<IAppState> {
	protected _products: IProduct[];
	protected _order: IOrder = {
		payment: "",
    address: "",
		email: "",
		phone: "",
		total: 0,
    items: []
	};
	protected _basket: IProduct[] = [];
	protected _preview: string | null;
	protected events: IEvents;
	protected formErrors: FormErrors = {};

	set products(products: IProduct[]) {
		this._products = products;
	}

	set order(order: IOrder) {
		this._order = order;
	}

	get order() {
		return this._order
	}

	get basket() {
		return this._basket
	}

	get products() {
		return this._products
	}

	set id(id: string) {
		this.preview = id;
	}

	get id() {
		return this.preview;
	}

  // Метод для получения товара по id
	getProduct(cardId: string) {
		return  this._products.find((item) => item.id === cardId)
	}

  // Сеттер для установки id товара для просмотра
	set preview(cardId: string | null) {
		if (!cardId) {
			this._preview = null;
			return;
		}
		const selectedCard = this.getProduct(cardId);
		if (selectedCard) {
			this._preview = cardId;
		}
	}

  // Метод для очистки корзины
	clearBasket() {
		this._basket = [];
	}

	// Метод для добавления товара в корзину 
	addToBasket(product: IProduct) {
    this._basket.push(product);
}

	// Метод для удаления товара из корзины
	deleteFromBasket(product: IProduct) {
		const index = this._basket.findIndex(item => item.id === product.id);
		if (index !== -1) {
				this._basket.splice(index, 1); 
		}
	}	

  // Метод для установки общей стоимости товаров в корзине
	setTotal(): number {
		return this.basket.reduce((sum, product) => sum + product.price, 0);
	}

  // Метод для валидации формы заказа
	validateOrderForm() {
		const errors: typeof this.formErrors = {};

		if(!this._order.payment) {
			errors.payment = 'Необходимо указать тип оплаты';
		}

		if (!this._order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		this.formErrors = errors;
		this.events.emit('form-errors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

  // Метод для валидации контактной информации
	validateContactsForm() {
		const errors: typeof this.formErrors = {};

		if (!this._order.email) {
			errors.email = 'Укажите email';
		}

		if (!this._order.phone) {
			errors.phone = 'Укажите номер телефона';
		}

		this.formErrors = errors;
		this.events.emit('form-errors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

  // Метод для обновления поля в заказе и проверки правильности формы
	setOrderField(field: keyof TOrder, value: string) {
		this._order[field] = value;
		this.validateOrderForm() && this.validateContactsForm()
	}

	// Метод очистки заказа
	clearOrder() {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: this._order.total,
		};
	}
}



