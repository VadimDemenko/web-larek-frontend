// Импорты
import { Component } from './Component';
import { IEvents } from './events';


// Класс для работы с модальными окнами
export class Modal<IModal> extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = this.container.querySelector('.modal__close');
		this._content = this.container.querySelector('.modal__content');

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

  // Сеттер для установки содержания модального окна
	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

  // Метод для переключения состояния видимости модального окна
	toggleModal(state: boolean = true) {
		this.toggleClass(this.container, 'modal_active', state);
	}

  // Обработчик события нажатия клавиши Escape
	handleEscape = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.close();
		}
	};

  // Метод для открытия модального окна
	open() {
		this.toggleModal();
		document.addEventListener('keydown', this.handleEscape);
		this.events.emit('modal:open');
	}

  // Метод для закрытия модального окна
	close() {
		this.toggleModal(false);
		document.removeEventListener('keydown', this.handleEscape);
		this.content = null;
		this.events.emit('modal:close');
	}

  // Метод для рендеринга содержимого модального окна
	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}