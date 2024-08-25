import {Model} from "./base/Model";
import {IItem} from '../components/Item'
import { IForm } from "./Order";

export interface IOrder  {
    items: string[];
    email: string;
    phone: string;
    total: number;
    address: string;
    payment: string;
}

interface IAppState {
    catalog: IItem[];
    basket: string[];
    basketProducts: IItem[];
}

type FormErrors = Partial<Record<keyof IOrder, string>>;

export class AppState extends Model<IAppState> {
    catalog: IItem[];
    basket: string[];
    basketProducts: IItem[] = [];
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        total: 0,
        address: '',
        payment: ''
    };
    formErrors: FormErrors = {};
   

    setCatalog(items: IItem[]) {
        this.catalog = items;
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    addItemToBasket(item:IItem){
       if (this.isItemInBasket(item.id)) {
            alert(`Товар ${item.title} уже в корзине, одного вам достаточно 😛.`);
            return; 
       }    
    
       this.basketProducts.push(item)
       this.order.items.push(item.id)
       this.emitChanges('basket:changed', {})
    }

    getTotal() {
        this.order.total = this.basketProducts.reduce((a, c) => a + c.price, 0)
        return this.order.total
    }

    getOrder(){
        return this.order 
    }

    clearBasket() {
        this.basketProducts = [];
        this.order = Object.assign({}, {    
        email: '',
        phone: '',
        items: [],
        total: 0,
        address: '',
        payment: ''})
        this.emitChanges('basket:changed', {})
    }

    deleteFromBasket(item:IItem){
        this.basketProducts = this.basketProducts.filter(i => i.id != item.id)
        this.order.items = this.order.items.filter((i) => i !== item.id);

        this.emitChanges('basket:open', {})
        this.emitChanges('basket:changed', {})
    }

    setOrderField(field: keyof IForm , value: string) {
        this.order[field] = value;
       
        if (this.validateOrder()) {
            this.emitChanges('order:ready', this.order)
            
        }
    }

    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email.match(/^[^\.\s][\w\-\.{2,}]+@([\w-]+\.)+[\w-]{2,}$/gm) || '') {
            errors.email = 'Необходимо указать верный email';
        }
        if (!this.order.phone.match(
            /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm
        )) {
            errors.phone = 'Необходимо указать верный номер телефона';
        }
        if (!this.order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    isItemInBasket(itemId: string): boolean {
        return this.basketProducts.some(item => item.id === itemId);
    }
}

  