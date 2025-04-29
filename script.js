const buttons = document.querySelectorAll('.burger-card button'); 
const cartList = document.getElementById('cart-list');
const totalDisplay = document.getElementById('total');
const reservarBtn = document.getElementById('consultar-btn');
const medallonesDisponiblesDisplay = document.getElementById('medallones-disponibles'); // Contenedor de medallones disponibles
const diaSelect = document.getElementById('saturday-date');
const horarioSelect = document.getElementById('saturday-time');
const errorMsg = document.getElementById('reserva-error'); // Mensaje de error

let cart = [];
let total = 0;

// Inicializar el almacenamiento local de medallones si no existe
if (!localStorage.getItem('medallonesDisponibles')) {
  localStorage.setItem('medallonesDisponibles', 50); // Inicializar con 50 medallones si no existe
}

let medallonesDisponibles = parseInt(localStorage.getItem('medallonesDisponibles')); // Obtener los medallones disponibles desde localStorage

// ✅ NUEVA FUNCIÓN: calcular medallones según el tipo
function medallonesNecesarios(tipo) {
  return tipo === 'doble' ? 2 : 1;
}

// Actualizar carrito
function updateCart() {
  cartList.innerHTML = '';
  total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';

    const texto = document.createElement('span');
    texto.textContent = `${item.name} - $${item.price}`;

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = '🗑️';
    eliminarBtn.style.background = 'none';
    eliminarBtn.style.border = 'none';
    eliminarBtn.style.cursor = 'pointer';
    eliminarBtn.style.fontSize = '1.2rem';

    eliminarBtn.addEventListener('click', () => {
      const medallones = medallonesNecesarios(item.tipo); // ✅ basado en data-type
      medallonesDisponibles += medallones;
      updateMedallonesDisponibles();
      cart.splice(index, 1);
      updateCart();
      verificarStock();
    });

    li.appendChild(texto);
    li.appendChild(eliminarBtn);
    cartList.appendChild(li);
    total += item.price;
  });

  totalDisplay.textContent = total;
}

// Botones para agregar hamburguesas
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const card = button.parentElement;
    const name = card.getAttribute('data-name');
    const price = parseInt(card.getAttribute('data-price'));
    const tipo = card.getAttribute('data-type'); // ✅ obtenemos el tipo

    const medallones = medallonesNecesarios(tipo);

    if (medallonesDisponibles >= medallones) {
      medallonesDisponibles -= medallones;
      updateMedallonesDisponibles();
      cart.push({ name, price, tipo }); // ✅ guardamos el tipo
      updateCart();
      verificarStock();
    } else {
      alert("No hay suficientes medallones disponibles para esta hamburguesa 😢");
    }
  });
});

// Verificar stock
function verificarStock() {
  buttons.forEach(button => {
    const card = button.parentElement;
    const tipo = card.getAttribute('data-type'); // ✅ usamos el tipo
    const necesarios = medallonesNecesarios(tipo);

    if (medallonesDisponibles < necesarios) {
      button.disabled = true;
      button.textContent = "Sin stock";
    } else {
      button.disabled = false;
      button.textContent = "🍔 Agregar";
    }
  });
}

// Actualizar el contador de medallones disponibles en la interfaz
function updateMedallonesDisponibles() {
  medallonesDisponiblesDisplay.textContent = medallonesDisponibles;
  // Guardar el número actualizado de medallones en localStorage
  localStorage.setItem('medallonesDisponibles', medallonesDisponibles);
}

// Generar sábados
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

// BOTÓN CONSULTAR (solo efectivo)
reservarBtn.addEventListener('click', () => {
  const fecha = diaSelect.value;
  const hora = horarioSelect.value;
  const telefonoCliente = document.getElementById('telefono-cliente').value.trim();

  // Verificamos si el carrito está vacío
  if (cart.length === 0) {
    errorMsg.textContent = "Tu carrito está vacío. Agregá al menos una hamburguesa para reservar.";
    errorMsg.style.display = "block";
    return;
  }

  // Verificamos si se seleccionó fecha y hora
  if (!fecha || !hora) {
    errorMsg.textContent = "Elegí una fecha y un horario.";
    errorMsg.style.display = "block";
    return;
  }

  // Verificamos si el teléfono está vacío
  if (!telefonoCliente) {
    errorMsg.textContent = "Por favor ingresá tu número de WhatsApp.";
    errorMsg.style.display = "block";
    return;
  }

  // Verificación de que la reserva sea al menos con un día de anticipación
  const fechaHora = new Date(`${fecha}T${hora}:00`);
  const ahora = new Date();
  const unDia = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

  if ((fechaHora - ahora) < unDia) {
    errorMsg.textContent = "La reserva debe hacerse con al menos 1 día de anticipación.";
    errorMsg.style.display = "block";
    return;
  }

  // Si pasa todas las validaciones, realizamos la reserva
  const mensajeCliente = `Hola! Confirmamos tu pedido:\n\n${cart.map(i => `• ${i.name} - $${i.price}`).join('\n')}\n\nTotal: $${total}\nFecha de entrega: ${fecha} a las ${hora}.\n\nEl pago será en efectivo al momento de la entrega. ¡Gracias por tu compra!`;

  const mensajeParaMi = `Nuevo pedido!\n\n${cart.map(i => `• ${i.name} - $${i.price}`).join('\n')}\n\nTotal: $${total}\nFecha: ${fecha} ${hora}\nTeléfono cliente: ${telefonoCliente}\nMétodo de pago: Efectivo\n\n⚡ Medallones disponibles: ${medallonesDisponibles}`;

  // Mostrar mensaje de éxito en la interfaz
  const mensajeExito = document.createElement("p");
  mensajeExito.textContent = "¡Reserva realizada! El pago será en efectivo al momento de la entrega.";
  mensajeExito.style.color = "green";
  document.body.appendChild(mensajeExito);

  // Solo enviar mensaje a tu número de WhatsApp
  const urlMiPedido = `https://wa.me/3496516330?text=${encodeURIComponent(mensajeParaMi)}`;
  window.open(urlMiPedido, '_blank');

  // Vaciar el carrito y actualizar la interfaz
  cart = [];
  updateCart();

  // Descontar medallones y guardar en localStorage
  cart.forEach(item => {
    const medallones = medallonesNecesarios(item.tipo);
    medallonesDisponibles -= medallones;
  });

  // Guardar los medallones restantes en localStorage
  localStorage.setItem('medallonesDisponibles', medallonesDisponibles);

  // Actualizar el contador de medallones disponibles
  updateMedallonesDisponibles();

  // Deshabilitar los botones de las hamburguesas sin stock
  verificarStock();
});
