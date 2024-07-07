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
    basket: string[];
    catalog: IItem[];
    loading: boolean;
    order: IOrder;
    formErrors: FormErrors = {};

```
Методы класса:
```
setCatalog(items: IItem[]): void – заполнение каталога карточками товаров
clearBasket(): void - очищает объект order
getTotal(): number – вычисление общей суммы заказа
validateOrder(): boolean – валидация данных, введенных пользователем 
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
_ catalog: HTMLElement[];
_basketCounter: number;
_wrapper: HTMLElement;
_basket: HTMLElement;
```
Методы класса:
```
set basketCounter (value: number): void – сеттер счетчика корзины
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
_button: HTMLButtonElement
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

Класс **Order ** отвечает за реализацию визуального отображения формы заказа в UI приложения, с выбором способа оплаты заказа и адреса доставки. В конструктор принимает контейнер типа HTMLFormElement, и кастомные события типа IEvents. Является дочерним классом Form.

```
constructor(container: HTMLFormElement, events: IEvents)
```

Методы класса:
```
    set phone(value: string): void
    set email(value: string): void
}
```
Класс **Basket** отвечает за реализацию отображения корзины и взаимодействия с пользователем через графический интерфейс. Содержит сеттеры для установки списка товаров к корзине и для установки значения общей суммы товаров к корзине.В конструктор пинимает контейнер типа HTMLElement,, и события типа EventEmitter. Является дочерним классом Component.

```
constructor(container: HTMLElement, protected events: EventEmitter)
```

Поля класса:
```
_list: HTMLElement;
_total: HTMLElement;
_button: HTMLElement;
```
Методы класса:
```
    set items(items: HTMLElement[]) : void
    set selected(items: string[]) : void
    set total(total: number) : void
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
}
```

```
interface IPage {
    basketCounter: number;
    catalog: HTMLElement[];
}
```
```
interface IItem<T> {
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


