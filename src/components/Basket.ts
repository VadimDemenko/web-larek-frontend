import { IEvents } from './base/events';
import { IBasket } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';


// Класс корзины
export class Basket extends Component<IBasket> {
	protected _basketList: HTMLElement;
	protected _totalPrice: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
		this._totalPrice = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order-form:open');
			});
		}

		this.products = [];
	}

	set products(products: HTMLElement[]) {
		this._basketList.replaceChildren(...products);
	}

	set totalPrice(total: number) {
		this.setText(this._totalPrice, `${total}` + ' синапсисов');
	}

	set buttonState(items: number) {
		this.setDisabled(this._button, items <= 0);
	}
}