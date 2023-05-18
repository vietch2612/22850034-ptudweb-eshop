'use strict';

class Cart {
	constructor(oldCart) {
		this.items = oldCart.items || {};
		this.shipping = oldCart.shipping || 0;
		this.discount = oldCart.discount || 0;

		this.couponCode = oldCart.couponCode || '';
		this.paymentMethod = oldCart.paymentMethod || 'COD';
		this.shippingAddress = oldCart.shippingAddress || '';
	}

	get quantity() {
		let quantity = 0;
		for (const id in this.items) {
			quantity += Number.parseInt(this.items[id].quantity);
		}

		return quantity;
	}

	get subtotal() {
		let price = 0;
		for (const id in this.items) {
			price += Number.parseFloat(this.items[id].total);
		}

		return Number.parseFloat(price).toFixed(2);
	}

	get total() {
		const price = Number.parseFloat(this.subtotal) + Number.parseFloat(this.shipping) - Number.parseFloat(this.discount);
		return Number.parseFloat(price).toFixed(2);
	}

	add(product, quantity) {
		const id = product.id;
		let storedItem = this.items[id];
		if (!storedItem) {
			this.items[id] = {product, quantity: 0, total: 0};
			storedItem = this.items[id];
		}

		storedItem.quantity += Number.parseInt(quantity);
		storedItem.total = Number.parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
		return storedItem;
	}

	remove(id) {
		const storedItem = this.items[id];
		if (storedItem) {
			delete this.items[id];
		}
	}

	update(id, quantity) {
		const storedItem = this.items[id];
		if (storedItem && quantity >= 1) {
			storedItem.quantity = quantity;
			storedItem.total = Number.parseFloat(storedItem.product.price * storedItem.quantity).toFixed(2);
		}

		return storedItem;
	}

	clear() {
		this.items = {};
		this.discount = 0;
		this.shipping = 0;
		this.couponCode = '';
	}

	#generateArray() {
		const array = [];
		for (const id in this.items) {
			this.items[id].product.price = Number.parseFloat(this.items[id].product.price).toFixed(2);
			this.items[id].total = Number.parseFloat(this.items[id].total).toFixed(2);
			array.push(this.items[id]);
		}

		return array;
	}

	getCart() {
		return {
			items: this.#generateArray(),
			quantity: this.quantity,
			subtotal: this.subtotal,
			total: this.total,
			shipping: Number.parseFloat(this.shipping).toFixed(2),
			discount: Number.parseFloat(this.discount).toFixed(2),
			couponCode: this.couponCode,
			paymentMethod: this.paymentMethod,
			shippingAddress: this.shippingAddress,
		};
	}
}

module.exports = Cart;
