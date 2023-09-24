const fetchDatas = async () => {
  try {
    const res = await fetch('../json/productos.json');
    if (!res.ok) {
      throw new Error(`No se pudo acceder al enlace solicitado. Código de estado: ${res.status}`);
    }
    const data = await res.json();
    mostrarProductos(data);
  } catch (error) {
    console.error(error.message);
  }
};

const mostrarProductos = (productos) => {
  const contenedorProductos = document.querySelector(".listaDeProductos");
  contenedorProductos.innerHTML = "";

  productos.forEach((producto) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" />
      <h3>${producto.nombre}</h3>
      <p class="productoDescripcion">${producto.descripcion}</p>
      <p class="productoPrecio">$${producto.precio}</p>
      <button id="agregar-${producto.id}" class="botonAgregar">Agregar al carrito</button>`;

    contenedorProductos.appendChild(li);
    const boton = document.getElementById(`agregar-${producto.id}`);
    boton.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });
  });
};

const agregarAlCarrito = (producto) => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productoEnCarrito = carrito.find((prod) => prod.id === producto.id);

  productoEnCarrito ? productoEnCarrito.cantidad++ : (producto.cantidad = 1, carrito.push(producto));

  localStorage.setItem("carrito", JSON.stringify(carrito));

  Swal.fire({
    icon: 'success',
    title: 'Producto agregado',
    showConfirmButton: false,
    html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <img src="${producto.imagen}" alt="${producto.nombre}" width="100" height="100" style="margin-bottom: 10px;">
        <p>${producto.nombre}</p>
      </div>
    `,
    timer: 1212
  });
};

fetchDatas();
