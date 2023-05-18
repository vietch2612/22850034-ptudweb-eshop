'use strict';

async function addCart(id, quantity) {
	const response = await fetch('/products/cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({id, quantity}),
	});

	const json = await response.json();
	document.querySelector('#cart-quantity').innerText = `(${json.quantity})`;
}
