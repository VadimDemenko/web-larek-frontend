import { IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";


interface IProductActions {
	onClick: (event: MouseEvent) => void;
}

// Класс вида карточки товара
export class ProductCard extends Component<IProduct> {
	protected _index?: HTMLElement;
	protected _category?: HTMLElement;
	protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _price: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _categoryType = <Record<string, string>>{
		'софт-скил': 'soft',
		другое: 'other',
		дополнительное: 'additional',
		кнопка: 'button',
		'хард-скил': 'hard',
	};

	constructor(blockName: string, parentElement: HTMLElement, actions?: IProductActions) {
		super(parentElement);
		this._index = parentElement.querySelector(`.basket__item-index`);
		this._category = parentElement.querySelector(`.${blockName}__category`);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, parentElement);
		this._image = parentElement.querySelector(`.${blockName}__image`);
		this._description = parentElement.querySelector(`.${blockName}__text`);
		this._price = parentElement.querySelector(`.${blockName}__price`);
		this._button = parentElement.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				parentElement.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: number | null) {
		this.setText(this._index, value);
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(
			this._category,
			`card__category_${this._categoryType[value]}`,
			true
		);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set price(value: string) {
		if (value) {
			this.setText(this._price, `${value} синапсов`);
			this.setDisabled(this._button, false);
		} else {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get button() {
		return this._button;
	}
}