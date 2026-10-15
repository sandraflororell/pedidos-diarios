// Array principal que almacena los pedidos con sus detalles
// Intentamos cargar lo que está guardado; si no hay nada, inicia vacío []
let pedidos = localStorage.getItem("pedidosGuardados") 
    ? JSON.parse(localStorage.getItem("pedidosGuardados")) 
    : [];

// Array temporal para almacenar los productos del pedido actual del cliente
let detalleActual = [];

const inputCliente = document.getElementById("nombre-cliente");
const inputNombreProducto = document.getElementById("nombre-producto");
const inputCantidad = document.getElementById("cantidad");
const inputPrecio = document.getElementById("precio");

const btnAgregarProducto = document.getElementById("btn-agregar-producto");
const btnRegistrarPedido = document.getElementById("btn-registrar-pedido");
const listaDetalle = document.getElementById("lista-detalle");
const listaPedidos = document.getElementById("lista-pedidos");
const spanValorTotal = document.getElementById("valor-total");
const btnModo = document.getElementById("btn-modo");

// Función para actualizar la vista previa de los productos del cliente actual
function mostrarDetalleActual() {
    listaDetalle.innerHTML = "";
    detalleActual.forEach(item => {
        const li = document.createElement("li");
        const subtotal = item.cantidad * item.precio;
        li.textContent = `• ${item.producto} | Cantidad: ${item.cantidad} | Precio: Bs${item.precio} | Subtotal: Bs${subtotal}`;
        
        // Marcar con rojo si la cantidad es menor a 5
        if (item.cantidad < 5) {
            li.classList.add("bajo-stock");
        }
        
        listaDetalle.appendChild(li);
    });
}

// Botón para agregar un producto al detalle actual del cliente
btnAgregarProducto.addEventListener("click", () => {
    const producto = inputNombreProducto.value.trim();
    const cantidad = parseInt(inputCantidad.value);
    const precio = parseFloat(inputPrecio.value);

    if (producto === "" || isNaN(cantidad) || isNaN(precio)) {
        alert("Por favor, completa los datos del producto correctamente.");
        return;
    }

    // Añadir al array temporal usando push
    detalleActual.push({ producto, cantidad, precio });

    // Limpiar campos de producto
    inputNombreProducto.value = "";
    inputCantidad.value = "";
    inputPrecio.value = "";

    mostrarDetalleActual();
});

// Función para calcular el total general de todos los pedidos registrados
function calcularTotalGeneral() {
    let totalGeneral = 0;
    pedidos.forEach(p => {
        p.detalles.forEach(d => {
            totalGeneral += (d.cantidad * d.precio);
        });
    });
    spanValorTotal.textContent = totalGeneral;
}

// Función para renderizar todos los pedidos registrados en la página
function mostrarPedidosRegistrados() {
    listaPedidos.innerHTML = "";

    pedidos.forEach(p => {
        const liCliente = document.createElement("li");
        liCliente.innerHTML = `<strong>Cliente: ${p.cliente}</strong>`;
        listaPedidos.appendChild(liCliente);

        p.detalles.forEach(d => {
            const liProd = document.createElement("li");
            const subtotal = d.cantidad * d.precio;
            liProd.style.marginLeft = "15px";
            liProd.textContent = `↳ ${d.producto} - Cantidad: ${d.cantidad} | Precio: Bs${d.precio} | Total: Bs${subtotal}`;
            
            if (d.cantidad < 5) {
                liProd.classList.add("bajo-stock");
            }
            listaPedidos.appendChild(liProd);
        });
    });

    calcularTotalGeneral();
}

// Botón para registrar el pedido completo con todos sus productos acumulados
btnRegistrarPedido.addEventListener("click", () => {
    const cliente = inputCliente.value.trim();

    if (cliente === "") {
        alert("Por favor, ingresa el nombre del cliente.");
        return;
    }

    if (detalleActual.length === 0) {
        alert("Debe agregar al menos un producto al detalle del pedido.");
        return;
    }

    // Registrar el pedido completo usando push
    pedidos.push({
        cliente: cliente,
        detalles: [...detalleActual] // Copia del array temporal
    });

    // NUEVO: Guardar la lista actualizada en el almacenamiento del navegador
    localStorage.setItem("pedidosGuardados", JSON.stringify(pedidos));

    // Limpiar todo para un nuevo pedido
    inputCliente.value = "";
    detalleActual = [];
    mostrarDetalleActual();
    mostrarPedidosRegistrados();
});

// Botón Modo Oscuro usando classList.toggle
btnModo.addEventListener("click", () => {
    document.body.classList.toggle("oscuro");
});

// NUEVO: Ejecutar automáticamente al cargar para mostrar lo que guardaste ayer
mostrarPedidosRegistrados();
