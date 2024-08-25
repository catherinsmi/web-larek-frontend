import {Form} from "./common/Form";
import { IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export interface IForm {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
}

interface IFormActions {
	onClick: (event: MouseEvent) => void;
}

export class Order extends Form<IForm> {
    protected _cashBtn: HTMLButtonElement;
    protected _cardBtn: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._cashBtn = ensureElement<HTMLButtonElement>('button[name=cash]', container);
        this._cardBtn = ensureElement<HTMLButtonElement>('button[name=card]', container);

        this._cashBtn.addEventListener('click', () => {
            this.toggleCash()
            this.toggleCard(false)
            events.emit('order.payment:change', {
                field: 'payment',
                value: 'cash',
            })
        });
        this._cardBtn.addEventListener('click', () => {
            this.toggleCard()
            this.toggleCash(false)
            events.emit('order.payment:change', {
                field: 'payment',
                value: 'online',
            })
        });
    }
    toggleCard(state: boolean = true) {
        this.toggleClass(this._cardBtn, 'button_alt-active', state);
    }

    toggleCash(state: boolean = true) {
        this.toggleClass(this._cashBtn, 'button_alt-active', state);
    }


    set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}


export class Contacts extends Form<IForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}