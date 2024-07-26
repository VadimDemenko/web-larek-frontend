import { IOrder } from '../types';
import { Form } from "./base/Form";
import { IEvents } from './base/events';


// Класс формы с контактами
export class ContactsForm extends Form<IOrder> {
	protected _emailInput: HTMLInputElement;
	protected _phoneInput: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._emailInput = container.elements.namedItem('email') as HTMLInputElement;
		this._phoneInput = container.elements.namedItem('phone') as HTMLInputElement;
	}

	set email(value: string) {
		this._emailInput.value = value;
	}

	set phone(value: string) {
		this._phoneInput.value = value;
	}
}