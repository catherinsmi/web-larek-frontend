# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss— корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Об архитектуре 
Приложение **Web-larek** выполнено в концепции архитектурного паттерна Model-View-Presenter, который разделяет приложение на три компонента: Model (слой работы с данными приложения), View (слой представления UI) и Presenter (содержит бизнес-логику приложения).

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

## Слой бизнес-логики:

В качестве презентера в начале разработки приложения будет выступать файл Index.js, в котором по средствам вызова коллбэков будет реализовано взаимодействие между слоем View и слоем Model. Также в этом файле реализуется работа класса Api.

Класс **Api** - отвечает за реализацию работы с запросами к серверу.
``` 
constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально)
```

Поля класса:
```
readonly baseUrl: string;
protected options: RequestInit;
```
Методы класса:
```
get(uri: string): void – метод, отвечающий за HTTP GET запрос к серверу
post(uri: string, data: object, method: ApiPostMethods): void - метод, отвечающий за HTTP POST запрос к серверу
handleResponse(response: Response): Promise<object> - обрабатывает HTTP-ответ
```

## Слой работы с данными приложения:

Абстрактный класс **Model** - базовая модель, чтобы можно было отличить ее от простых объектов с данными. В конструктор 
```
constructor(data: Partial<T>, protected events: IEvents) 
```
ожидает объект для инициализации модели и объект брокера событий.

Методы класса:
```
emitChanges(event: string, payload?: object): void – генерирует события
```


Класс **AppState** отвечает за данные товаров приложения и информацию заказа пользователя. Дочерний класс Model.

Поля класса:
```
catalog: массив товаров.
basket: массив строк, представляющий корзину (не используется в методах, но может быть предназначен для других целей).
basketProducts: массив товаров, находящихся в корзине (объекты типа IItem).
order: объект, представляющий текущий заказ с инициализацией всех полей.
formErrors: объект, содержащий ошибки в форме.

```
Методы класса:
```
setCatalog(items: IItem[]): void - устанавливает каталог товаров и вызывает событие изменения.

addItemToBasket(item: IItem): void - добавляет товар в корзину и обновляет заказ, добавляя идентификатор товара в массив items.
Вызывает событие изменения корзины.

getTotal(): number -  вычисляет и возвращает общую стоимость заказа, суммируя цены товаров по их идентификаторам.

getOrder(): IOrder - возвращает текущий заказ.

clearBasket(): void - очищает корзину, сбрасывает общую стоимость заказа и вызывает событие изменения.

deleteFromBasket(item: IItem): void - удаляет товар из корзины по идентификатору и вызывает события изменения корзины.

setOrderField(field: keyof IForm, value: string): void - устанавливает значение указанного поля заказа и вызывает валидацию. Если валидация проходит успешно, генерирует событие, что заказ готов.
validateOrder(): boolean - проверяет корректность введенных данных в заказе (email, телефон, способ оплаты и адрес). Если находятся ошибки, они обновляются в объекте formErrors и вызывается соответствующее событие.
```

## Слой представления UI:
Абстрактный класс **Component** - создает инструментарий для работы с DOM в дочерних компонентах. Конструктор класса:
```
constructor(protected readonly container: HTMLElement) 
``` 
Методы класса:
```
render(data?: Partial<T>): HTMLElement
setText(element: HTMLElement, value: unknown): void
```
Класс **Page** отвечает за реализацию отображения каталога товаров на главной странице приложения, управление счетчиком иконки корзины на главной странице. Является дочерним классом Component. Конструкторе класса ожидает два параметра: container типа HTMLElement и events типа IEvents.
```
constructor(container: HTMLElement, protected events: IEvents)
```


Поля класса:
```
_catalog: HTMLElement[];
_counter: number;
_wrapper: HTMLElement;
_basket: HTMLElement;
```
Методы класса: 
```
set counter (value: number): void – сеттер счетчика корзины
set catalog(items: HTMLElement[]): void – сеттер каталога товаров
```

Класс **Item** отвечает за реализацию визуального отображения карточки в UI приложения. Класс реализует интерфейс IItem. Является дочерним классом Component. В конструктор ожидает селектор типа string, контейнер типа HTMLElement:
```
constructor(protected blockName: string, container: HTMLElement, actions?: IItemActions)
```

Поля класса:
```
   _title: HTMLElement;
   _image?: HTMLImageElement;
   _description?: HTMLElement;
   _button?: HTMLButtonElement;
```

Методы класса – сеттеры и геттеры для заголовка, описания, изображения.



Класс **Modal** - отвечает за реализацию модальных окон приложения. В конструктор принимается контейнер, в котором будет размещаться контент модального окна. Является дочерним классом Component.
```
constructor(container: HTMLElement, protected events: IEvents)

```

Содержит методы открытия и закрытия модального окна, также сеттер установки входящего контента.


Поля класса:
```
_content: HTMLElement
_closeButton: HTMLButtonElement
```
Методы класса:
```
open(): void
close(): void
set content(data:HTMLElement): void
```


Класс **Form** отвечает за реализацию базовых форм приложения, с помощью которого собираются данные от пользователя. Дочерний класс Component.
```
constructor(protected container: HTMLFormElement, protected events: IEvents)
```

Поля класса:
```
_submit: HTMLButtonElement;
_errors: HTMLElement;
```
Методы класса:
```
    onInputChange(field: keyof T, value: string): void – вызывается при наборе текста в формах
    set valid(value: boolean): void – валидирует кнопку сабмита для отправки 
    set errors(value: string): void – устанавливает формат ошибки в формах
    render(state: Partial<T> & IFormState): HTMLElemenet – возвращает элемент формы в разметке
```


Класс **Order**  расширяет класс Form с типом IForm и отвечает за функциональность заказа в форме. В конструктор принимает контейнер типа HTMLFormElement, и кастомные события типа IEvents.  Он имеет два защищенных поля:

```
_cashBtn: кнопка для выбора оплаты наличными.
_cardBtn: кнопка для выбора онлайн-оплаты.
```

```
constructor(container: HTMLFormElement, events: IEvents)
```

Методы класса:
```
    set address(value: string): void -  устанавливает значение адреса в соответствующий элемент формы.
    toggleButtons(activeButton: HTMLButtonElement, inactiveButton: HTMLButtonElement): void  - управляет классами CSS кнопок, чтобы визуально отображать активное состояние кнопки.

```

Класс **Contacts** также расширяет класс Form с типом IForm и предоставляет простую функциональность для управления контактной информацией

```
constructor(container: HTMLFormElement, events: IEvents)
```

```
set phone(value: string): void -  устанавливает значение номера телефона в соответствующий элемент формы.
set email(value: string): void -  устанавливает значениев соответствующий элемент формы.
```

Класс **Basket** отвечает за реализацию отображения корзины и взаимодействия с пользователем через графический интерфейс. Содержит сеттеры для установки списка товаров к корзине и для установки значения общей суммы товаров к корзине.В конструктор пинимает контейнер типа HTMLElement,, и события типа EventEmitter. Является дочерним классом Component.

```
constructor(container: HTMLElement, protected events: EventEmitter)
```

Поля класса:
```
_list: элемент DOM, представляющий список товаров в корзине.
_total: элемент DOM, показывающий общую стоимость товаров в корзине.
_button: кнопка для открытия заказа.
```
Методы класса:
```
    set items(items: HTMLElement[]) : void - cеттер для items. Если в массиве items есть товары, кнопка становится активной (вызывает метод setDisabled с параметром false), и элементы списка заменяются на новые.
    set total(total: number) : void - cеттер для свойства total.
```
Класс **Success** расширяет класс Component и отвечает за отображение информации о завершенном заказе. Конструктор принимает два параметра: container: HTMLElement элемент, в котором будет размещено уведомление об успешном заказе.
actions:ISuccessActions.

```
constructor(container: HTMLElement, actions: ISuccessActions)
```
Поля класса:
```
_close: элемент DOM, представляющий кнопку закрытия уведомления об успешном заказе.
_total: элемент DOM, показывающий общую сумму, списанную с клиента.
```

Метод класса:
```
 set total(value: number): void - cеттер для свойства total
```


## Брокер событий:
Класс EventEmitter – отвечает за реализацию работы событий приложения. Его функции: возможность установить и снять слушателей̆ событий, вызвать слушателей̆ при возникновении события.
Методы:
```
оn() - устанавливает обработчик на событие
off() – снимает обработчик с события
emit() - инициализирует событие с данными
onAll() - устанавливает обработчик на все события
offAll() - снимает обработчик со всех событий
trigger() - сделать коллбек триггер, генерирующий событие при вызове
```
## Основные типы/интерфейсы проекта:

```
interface IAppState {
    catalog: IItem[];
    basket: string[];
    order: IOrder | null;
    дописать
}
```

```
interface IPage {
    basketCounter: number;
    catalog: HTMLElement[];
}
```
```
interface IItem {
    title: string;
    description?: string | string[];
    image: string;
    price: number;
    category: string
}
interface IItemActions {
    onClick: (event: MouseEvent) => void;
}
```
```
interface IModalData {
    content: HTMLElement;
}
```
```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```
```
interface IOrderForm {
	payment: string;
	email?: string;
	phone?: string;
	address: string;
}
```
```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```
```
interface ISuccess {
    total: number;
}
```


