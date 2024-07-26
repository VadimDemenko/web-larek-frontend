import { IOrder } from '../types';
import { Form } from './base/Form';
import { IEvents } from './base/events';

// Класс формы с заказом
export class OrderForm extends Form<IOrder> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _payment: string;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this.cashButton = this.container.querySelector('button[name="cash"]');
		this.cardButton = this.container.querySelector('button[name="card"]');

		this._addressInput = container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		this.cardButton.addEventListener('click', () => {
			this.toggleCardButton();
			this.toggleCashButton(false);
			this.setPayment(this.cardButton);
		});

		this.cashButton.addEventListener('click', () => {
			this.toggleCashButton();
			this.toggleCardButton(false);
			this.setPayment(this.cashButton);
		});
	}

	set address(value: string) {
		this._addressInput.value = value;
	}

  // Метод для переключения состояния кнопки оплаты картой
	toggleCardButton(state: boolean = true) {
		this.toggleClass(this.cardButton, 'button_alt-active', state);
	}

  // Метод для переключения состояния кнопки оплаты наличными
	toggleCashButton(state: boolean = true) {
		this.toggleClass(this.cashButton, 'button_alt-active', state);
	}

  // Метод для установки типа оплаты
	setPayment(button: HTMLButtonElement) {
		if (
			button.classList.contains('button_alt-active') &&
			button.getAttribute('name') === 'card'
		) {
			this._payment = 'card';
		} else {
			this._payment = 'cash';
		}

		this.events.emit('payment:selected', { payment: this._payment });
	}
}