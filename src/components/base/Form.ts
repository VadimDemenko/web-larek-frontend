import { IForm } from '../../types';
import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';


// Класс для форм
export class Form<IOrder> extends Component<IForm> {
	protected submitBtn: HTMLButtonElement;
	protected formName: string;
	protected _errors: HTMLElement;
	protected _form: HTMLFormElement;

	constructor(container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this.submitBtn = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);
		this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
		this.formName = this.container.getAttribute('name') as string;

		// Обработчик на отправку
		this.container.addEventListener('submit', (e) => {
			e.preventDefault();
			events.emit(`${this.formName}:submit`);
		});

		// Обработчик ввода данных пользователя
		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof IOrder;
			const value = target.value;
			this.onInputChange(field, value);
		});
	}

	// Обработчик изменения формы
	protected onInputChange(field: keyof IOrder, value: string) {
		this.events.emit(`${this.formName}.${String(field)}:change`, {
			field,
			value,
		});
	}

	// Сеттер для валидности формы
	set valid(value: boolean) {
		this.setDisabled(this.submitBtn, !value);
	}

	// Сеттер для ошибок формы
	set errors(value: string) {
		this.setText(this._errors, value);
	}

		
	// Метод для рендеринга состояния формы
	render(state: Partial<IOrder> & IForm) {
		const { valid, errors, ...inputs } = state;
		super.render({ valid, errors });
		Object.assign(this, inputs);
		return this.container;
	}
}