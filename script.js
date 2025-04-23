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
function generarSabados() {
  const select = document.getElementById('saturday-date');
  const hoy = new Date();
  let sabadosGenerados = 0;
  let dia = new Date(hoy);

  while (sabadosGenerados < 4) {
      dia.setDate(dia.getDate() + 1);
      if (dia.getDay() === 6) {
          const yyyy = dia.getFullYear();
          const mm = String(dia.getMonth() + 1).padStart(2, '0');
          const dd = String(dia.getDate()).padStart(2, '0');
          const fecha = `${yyyy}-${mm}-${dd}`;

          const option = document.createElement('option');
          option.value = fecha;
          option.textContent = `${dd}/${mm}/${yyyy}`;
          select.appendChild(option);
          sabadosGenerados++;
      }
  }
}
generarSabados();

document.getElementById('reservar-btn').addEventListener('click', () => {
  const fecha = document.getElementById('saturday-date').value;
  const hora = document.getElementById('saturday-time').value;
  const errorMsg = document.getElementById('reserva-error');

  if (!fecha || !hora) {
      errorMsg.textContent = "Elegí una fecha y un horario.";
      errorMsg.style.display = "block";
      return;
  }

  const fechaHora = new Date(`${fecha}T${hora}:00`);
  const ahora = new Date();
  const tresHoras = 3 * 60 * 60 * 1000;

  if ((fechaHora - ahora) < tresHoras) {
      errorMsg.textContent = "La reserva debe hacerse con al menos 3 horas de anticipación.";
      errorMsg.style.display = "block";
      return;
  }

  // Redirigir a Mercado Pago (modo prueba)
  window.open("https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=123456789", "_blank");
});



