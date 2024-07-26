import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder, IProduct, TOrder } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/base/Modal';
import { AppState } from './components/AppState';
import { Page } from './components/Page';
import { Basket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { ProductCard } from './components/ProductCard';
import { Success } from './components/Success';
import { AppApi } from './components/AppApi';


const events = new EventEmitter();

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const modalTemplate =	ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate =	ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const api = new AppApi(CDN_URL, API_URL);
const appState = new AppState({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate),events);


// Получение данных с сервера
api.getProducts()
    .then(products => {
        appState.products = products; 
        events.emit('products:changed', products); 
    })
    .catch(console.error);

// Управление состоянием модальных окон
events.on('modal:open', () => page.locked = true);
events.on('modal:close', () => page.locked = false);

// Событие на рендеринг карточек товаров
events.on('products:changed', () => {
	page.catalog = appState.products.map((product) => {
		const card = new ProductCard('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('product:selected', product),
		});

		return card.render({
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
		});
	});
});

// Событие выбора карточки товара 
events.on('product:selected', (product: IProduct) => {
  const selectedCard = appState.getProduct(product.id);
  const card = new ProductCard('card', cloneTemplate(modalTemplate), {
      onClick: () => {
          const isInBasket = appState.basket.includes(product);
          const action = isInBasket ? 'product:delete' : 'product:add';
          const buttonText = isInBasket ? 'В корзину' : 'Удалить из корзины';

          card.setText(card.button, buttonText);
          events.emit(action, product);
      },
  });

	if (selectedCard.price === null) {
		card.setDisabled(card.button, true);
	}
	if (appState.basket.includes(product)) {
		card.setDisabled(card.button, true);
	} else {
		card.setDisabled(card.button, false);
	}

	
	card.setText(
		card.button,
		appState.basket.includes(product) ? 'Удалить из корзины' : 'В корзину'
	);

	modal.render({
		content: card.render({
			image: product.image,
			title: product.title,
			category: product.category,
			price: product.price,
			description: product.description,
		}),
	});
});

// Событие добавления в корзину карточки товара 
events.on('product:add', (product: IProduct) => {
	appState.addToBasket(product);
	page.counter = appState.basket.length;
});

// Событие открытия корзины 
events.on('basket:open', () => {
	const products = appState.basket.map((product, index) => {
		const productCard = new ProductCard(
			'card',
			cloneTemplate(cardBasketTemplate),
			{
				onClick: () => {
					events.emit('product:delete', product);
					events.emit('basket:open');
				},
			}
		);

		return productCard.render({
			price: product.price,
			title: product.title,
			id: product.id,
			index: index + 1,
		});
	});

	modal.render({
		content: basket.render({
			products,
			totalPrice: appState.setTotal(),
			buttonState: products.length,
		}),
	});
});

// Событие удаления из корзины карточки товара
events.on('product:delete', (product: IProduct) => {
	appState.deleteFromBasket(product);
	page.counter = appState.basket.length;
});

// События открытия формы с заказом
events.on('order-form:open', () => {
	appState.order.total = appState.setTotal();
	appState.order.items = appState.basket.map((item) => item.id);
	modal.render({
		content: orderForm.render({
			valid: false,
			errors: [],
		}),
	});
});

// Функция для обновления полей заказа и контактов
const updateFormsValue = (data: { field: keyof TOrder; value: string }) => {
	appState.setOrderField(data.field, data.value);
};

events.on(/^order\..*:change/, updateFormsValue);
events.on(/^contacts\..*:change/, updateFormsValue);

// Событие выбора способа оплаты
events.on('payment:selected', (data: { payment: string }) => {
	appState.setOrderField('payment', data.payment);
});

// Событие ошибок
events.on('form-errors:change', (errors: Partial<IOrder>) => {


	const { payment, address } = errors;

	orderForm.valid = !payment && !address;
	orderForm.errors = Object.values({ address, payment })
		.filter(Boolean)
		.join('; ');


	const { phone, email } = errors;

	contactsForm.valid = !phone && !email;
	contactsForm.errors = Object.values({ phone, email })
		.filter(Boolean)
		.join('; ');
});

// События сохранение данных пользователя
events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			valid: false,
			errors: [],
		}),
	});
});

// События сохранение данных пользователя в модальном окне и оформления заказа
events.on('contacts:submit', () => {
	api
		.orderProducts(appState.order)
		.then(() => {
			appState.clearBasket();
			appState.order = {
				payment: '',
        address: '',
				email: '',
				phone: '',
				items: [],
				total: appState.order.total,
			};
			page.counter = appState.basket.length;

			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					appState.order.total = 0;
				},
			});

			modal.render({
				content: success.render({
					total: appState.order.total,
				}),
			});
		})
		.catch((err) => console.error(err));
});