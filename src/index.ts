import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { LarekAPI } from './components/LarekAPI';
import { Modal } from './components/common/Modal';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Item, IItem, PreviewItem, BasketItem   } from './components/Item';
import { Basket } from './components/common/Basket';
import { Order, Contacts, IForm} from './components/Order';
import { Success} from './components/Success';
import { cloneTemplate, ensureElement } from './utils/utils';

//Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events)
const appState = new AppState({}, events);
const page = new Page(document.body, events);
const order = new Order(cloneTemplate(orderFormTemplate), events)
const contacts = new Contacts(cloneTemplate(contactsFormTemplate), events)
const basket = new Basket(cloneTemplate(basketTemplate), events);


//Подписываемся на событие изменения товаров и рендерим карточку товара
events.on('items:changed', () => { 
	page.catalog = appState.catalog.map((item) => {
		const card = new Item(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
			
		});
	});	
})

//Открытие модального окна карточки товара с функцией добавления в корзину
events.on('card:select', (item: IItem) => {
	const card = new PreviewItem (cloneTemplate(cardPreviewTemplate),{
		onClick: () => {
			appState.addItemToBasket(item);
			modal.close();
		}
	})
	modal.render({content: card.render(
		{
			title: item.title,
			description: item.description,
			category: item.category,
			id: item.id,
			image: item.image,
			price: item.price
		}
	)});
	
});

//Открытие корзины
events.on('basket:open', () => {
	modal.render({
		content: basket.render({
			items: appState.basketProducts.map((item, index) => {
				const card = new BasketItem (cloneTemplate(cardBasketTemplate), {
					onClick: () => appState.deleteFromBasket(item)
				});
				return card.render({
					title: item.title,
					price: item.price,
					index: String(index + 1)
				});
			})
		}),
	});
	basket.total = appState.getTotal()
});

//Подписываемся на событие изменения товаров к крозине
events.on('basket:changed',  (item: IItem) => {
	page.counter = appState.basketProducts.length
	basket.total = appState.getTotal()
})

//Открытие формы заказа
events.on('order:open', () => {
    modal.render({
        content: order.render({
            payment: '',
            address: '',
            valid: false,
            errors: []
        })
    });
});

//Открытие формы контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

//Отпраляем данные заказа на сервер и открываем модальное окно успешного заказа
events.on('contacts:submit', () => {
    api.orderItems(appState.getOrder())
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => {
                    modal.close();
                    appState.clearBasket();
                }
            });
            modal.render({
                content: success.render({
					total: result.total
				})
            });
        })
        .catch(err => {
            console.error(err);
        });
});

//Подписываемся на собитие, которое срабатывает при изменении ошибок форм.
events.on('formErrors:change', (errors: Partial<IForm>) => {
    const { email, phone, payment, address } = errors;
    contacts.valid = !email && !phone;
    contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');

	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address }).filter((i) => !!i).join('; ');
});

//Подписываемся на событие, которое срабатывает при изменении любого поля в объектах order или contacts
events.on(/^(order\..*|contacts\..*):change/, (data: { field: keyof IForm, value: string }) => {
    appState.setOrderField(data.field, data.value);
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем, когда модалка закрыта
events.on('modal:close', () => {
	page.locked = false;
});

// Получаем каталог товаров с сервера
api
	.getItemList()
	.then(appState.setCatalog.bind(appState))
	.catch((err) => console.error(err));