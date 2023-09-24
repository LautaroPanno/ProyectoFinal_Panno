let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const mostrarCarrito = () => {
  const contenedorCarrito = document.querySelector(".carrito");
  contenedorCarrito.innerHTML = "";

  (carrito.length > 0 ? carrito.forEach((producto) => {
        const productosCarrito = document.createElement("ul");
        productosCarrito.classList.add("productosCarrito");
        contenedorCarrito.appendChild(productosCarrito);

        const li = document.createElement("li");
        li.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <div class="productContent">
            <h3>${producto.nombre}</h3>
            <p class="productoDescripcion">${producto.descripcion}</p>
            <p class="productoPrecio">$${producto.precio}</p>
            <div class="contador">
              <button id="decrementar-${producto.id}" class="button">-</button>
              <span class="productoPrecio">${producto.cantidad} unid.</span>
              <button id="incrementar-${producto.id}" class="button">+</button>
            </div>
          </div>
          <button id="eliminar-${producto.id}" class="eliminar">Eliminar</button>`;

        productosCarrito.appendChild(li);

        const boton = document.getElementById(`eliminar-${producto.id}`);
        boton.addEventListener("click", () => {
          eliminarProducto(producto.id);
        });

        const decrementar = document.getElementById(`decrementar-${producto.id}`);
        decrementar.addEventListener("click", () => {
          actualizarCantidadProducto(producto.id, -1);
        });

        const incrementar = document.getElementById(`incrementar-${producto.id}`);
        incrementar.addEventListener("click", () => {
          actualizarCantidadProducto(producto.id, 1);
        });
      })
    : (contenedorCarrito.innerHTML = '<p class="carritoVacio">No hay productos en el carrito</p>'));

  const mostrarModalVaciarCarrito = () => {
    Swal.fire({
      title: "¿Vaciar carrito?",
      text: "¿Estás seguro de que deseas vaciar el carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Vaciar carrito",
      cancelButtonText: "Cancelar",
      reverseButtons: "true",
    }).then((result) => {
      if (result.isConfirmed) {
        vaciarCarrito();
      }
    });
  };

  const botonVaciarCarrito = document.createElement("button");
  botonVaciarCarrito.textContent = "Vaciar Carrito";
  botonVaciarCarrito.classList.add("vaciar");
  botonVaciarCarrito.addEventListener("click", () => {
    mostrarModalVaciarCarrito();
  });

  (carrito.length > 0 && contenedorCarrito.appendChild(botonVaciarCarrito));

  const botonComprar = document.createElement("button");
  botonComprar.textContent = "Comprar";
  botonComprar.classList.add("btnComprar");
  botonComprar.addEventListener("click", () => {
    mostrarModalCompra();
  });

  (carrito.length > 0 && contenedorCarrito.appendChild(botonComprar));

  const contenedorTotal = document.createElement("p");
  (carrito.length > 0
    ? (contenedorTotal.textContent = `Total: $${carrito.reduce(
        (acumulador, producto) => acumulador + producto.precio * producto.cantidad,
        0
      )}`)
    : (contenedorTotal.textContent = ""));
  contenedorCarrito.appendChild(contenedorTotal);
};

const mostrarModalCompra = () => {
  Swal.fire({
    title: "¿Confirmar compra?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Comprar",
    cancelButtonText: "Cancelar",
    reverseButtons: "true",
  }).then((result) => {
    if (result.isConfirmed) {
      vaciarCarrito();
      Swal.fire(
        'Compra realizada con éxito',
        '¡Muchas gracias!',
        'success'
      );
    } else {
      Swal.fire({
        title: "Compra cancelada",
        text: "La compra ha sido cancelada.",
        confirmButtonText: "Aceptar",
      });
    }
  });
};

const actualizarCantidadProducto = (id, cantidad) => {
  const producto = carrito.find((prod) => prod.id === id);
  if (producto) {
    producto.cantidad += cantidad;
    producto.cantidad < 1 && eliminarProducto(id);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
  }
};

const eliminarProducto = (id) => {
  carrito = carrito.filter((producto) => producto.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.removeItem(`producto-${id}`);
  mostrarCarrito();
};

const vaciarCarrito = () => {
  carrito = [];
  localStorage.clear();
  mostrarCarrito();
};

mostrarCarrito();