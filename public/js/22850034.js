'use strict';

async function addCart(id, quantity) {
	const response = await fetch('/products/cart', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ id, quantity }),
	});

	const json = await response.json();
	document.querySelector('#cart-quantity').innerText = `(${json.quantity})`;
}

async function updateCart(id, quantity) {
	if (quantity > 0) {
		const response = await fetch('/products/cart', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ id, quantity }),
		});

		if (response.status == 200) {
			const json = await response.json();
			document.getElementById('cart-quantity').innerText = `(${json.quantity})`;
			document.getElementById('subtotal').innerText = `$${json.subtotal}`;
			document.getElementById(`total`).innerText = `$${json.total}`;
			document.getElementById(`total${id}`).innerText = `$${json.item.total}`;
		}
	} else {
		removeCart(id);
	}
}

async function removeCart(id) {
	if (confirm('Do you really want to remove?')) {
		const response = await fetch('/products/cart', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			body: JSON.stringify({ id }),
		});

		if (response.status == 200) {
			const json = await response.json();
			document.getElementById('cart-quantity').innerText = `(${json.quantity})`;

			if (json.quantity > 0) {
				document.getElementById('subtotal').innerText = `$${json.subtotal}`;
				document.getElementById(`total`).innerText = `$${json.total}`;
				document.getElementById(`product${id}`).remove();
			} else {
				document.querySelector('.cart-page .container').innerHTML = `<div class="text-center border py-3">
					<h3>Your cart is empty.</h3>
			  	</div>`
			}
		}
	}
}

async function clearCart() {
	if (confirm('Do you really want to clear all carts?')) {
		const response = await fetch('/products/cart/all', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			}
		});

		if (response.status == 200) {
			document.getElementById('cart-quantity').innerText = `(0)`;
			document.querySelector('.cart-page .container').innerHTML = `<div class="text-center border py-3">
				<h3>Your cart is empty.</h3>
			</div>`
		}
	}
}

function placeorder(e) {
	e.preventDefault();

	const addressId = document.querySelector('input[name=adressId]:checked');
	if (addressId.value == 0) {
		if (!e.target.checkValidity()) {
			e.target.reportValidity();
		}
	}

	e.target.submit();
}
