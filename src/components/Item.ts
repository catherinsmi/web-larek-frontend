import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";
import { settings } from '../utils/constants';

interface IItemActions {
	onClick: (event: MouseEvent) => void;
}

export interface IItem {
    title: string;
    description?: string | string[];
    image?: string;
    price: number;
    category?: string;
	id: string;
	index?: string;
	buttonAddToBasket?: HTMLButtonElement;
	deleteBtn?: HTMLButtonElement;
	productId?: string;
}


export class Item<T> extends Component<IItem> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _id: HTMLElement;
	protected _productId: HTMLElement;

	constructor(container: HTMLElement, actions?: IItemActions) {
		super(container);

        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
		
		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: string){
		this.setText(this._category, value);
		this.toggleClass(this._category, settings.handleCategory(value), true);
	}

	set price(value: number) {
		if (value) {
			this.setText(this._price, `${String(value)} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
		}
	}
}

export class PreviewItem extends Item<IItem> {
	protected _title: HTMLElement;
    protected _image: HTMLImageElement;
	protected _price: HTMLElement;
	protected _category: HTMLElement;
	protected _buttonAddToBasket: HTMLButtonElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?:IItemActions ){
		super(container)

		this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
		this._description = ensureElement<HTMLElement>('.card__text', container);
		this._buttonAddToBasket = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions?.onClick) {
			this._buttonAddToBasket.addEventListener('click', actions.onClick);
		}

	}

	set description(value: string) {
    	this.setText(this._description, value);
	}

	set price(value: number) {
        if (value) {
            this.setText(this._price, `${String(value)} синапсов`);
            this._buttonAddToBasket.removeAttribute('disabled'); 
        } else {
            this.setText(this._price, 'Бесценно');
            this._buttonAddToBasket.setAttribute('disabled', 'true'); 
        }
    }

}

export class BasketItem extends Component<IItem>{
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _index: HTMLElement
	protected _deleteBtn: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: IItemActions){
		super(container)
		this._title = ensureElement<HTMLElement>('.card__title', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
		this._deleteBtn = ensureElement<HTMLButtonElement>('.basket__item-delete', container);
	    this._index = ensureElement<HTMLButtonElement>('.basket__item-index', container);

		if (actions?.onClick) {
			this._deleteBtn.addEventListener('click', actions.onClick);
		}
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(this._price, `${String(value)} синапсов`);
	}

	set index(value: string) {
		this.setText(this._index, value);
	}
}



