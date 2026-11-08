// Lógica del Sistema Integral de Gestión de Restaurante (SIGR)
// Módulos: menú digital, pedidos en línea y reservas por fecha y hora.

let total = 0;

// Desplazamiento suave hacia el menú digital
function irMenu() {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
}

// Agrega un producto del menú al pedido actual
function agregar(nombre, precio) {
  let lista = document.getElementById("lista");
  let producto = document.createElement("li");
  producto.textContent = nombre + " - $" + precio.toLocaleString("es-CO");
  lista.appendChild(producto);
  total += precio;
  document.getElementById("total").textContent =
    "Total: $" + total.toLocaleString("es-CO");
}

// Vacía el carrito y reinicia el total del pedido
function vaciar() {
  document.getElementById("lista").innerHTML = "";
  total = 0;
  document.getElementById("total").textContent = "Total: $0";
}

// Registra una reserva por fecha y hora y muestra la confirmación automática
function reservar(evento) {
  evento.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let fecha = document.getElementById("fecha").value;
  let hora = document.getElementById("hora").value;
  document.getElementById("confirmacion").textContent =
    "Reserva confirmada a nombre de " + nombre + " para el " + fecha +
    " a las " + hora + ".";
  return false;
}
