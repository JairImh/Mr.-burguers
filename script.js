const buttons = document.querySelectorAll('.burger-card button');
const cartList = document.getElementById('cart-list');
const totalDisplay = document.getElementById('total');
const whatsappBtn = document.getElementById('whatsapp-btn');

const deliveryDate = document.getElementById('delivery-date');
const deliveryTime = document.getElementById('delivery-time');

let cart = [];
let total = 0;

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.parentElement;
    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'));

    cart.push({ name, price });
    updateCart();
  });
});

function updateCart() {
  cartList.innerHTML = '';
  total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price}`;
    cartList.appendChild(li);
    total += item.price;
  });

  totalDisplay.textContent = total;
}

// ✅ FUNCIONALIDAD DEL BOTÓN
whatsappBtn.addEventListener('click', () => {
  const dateValue = deliveryDate.value;
  const timeValue = deliveryTime.value;

  if (!dateValue || !timeValue) {
    alert('Por favor, completá el día y la hora de entrega.');
    return;
  }

  const deliveryDateTime = new Date(`${dateValue}T${timeValue}`);
  const now = new Date();
  const diffHours = (deliveryDateTime - now) / 1000 / 60 / 60;

  if (diffHours < 3) {
    alert('El pedido debe hacerse con al menos 3 horas de anticipación.');
    return;
  }

  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agregá al menos una hamburguesa.');
    return;
  }

  const message = cart.map(i => `${i.name} - $${i.price}`).join('%0A') +
    `%0A%0ATotal: $${total}` +
    `%0A📅 Entrega: ${dateValue} a las ${timeValue}`;

  const phone = "543496516330"; // Cambiar por tu número real
  const link = `https://wa.me/${phone}?text=Hola! Quiero hacer este pedido:%0A${message}`;

  window.open(link, '_blank');
});

