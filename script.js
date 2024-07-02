document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');
    const productosContainer = document.getElementById('productos');
    const apiUrl = 'https://codoback.onrender.com/productos'; // URL de tu backend (para desarrollo local)

    // Función para obtener y mostrar los productos desde el servidor
    const fetchProducts = async () => {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de productos');
            }
            const products = await response.json();
            productosContainer.innerHTML = '';
            products.forEach(product => {
                const productElement = document.createElement('div');
                productElement.innerHTML = `
                    <h2>${product.nombre}</h2>
                    <p>${product.descripcion}</p>
                    <ul>
                        <li>Id: ${product.id_producto}</li>
                        <li>Stock: ${product.stock}</li>
                        <li>Categoría: ${product.categoria}</li>
                        <li>Banco: ${product.banco} - Descuento: ${product.descuento}</li>
                        <li>Cuotas: ${product.cuotas}</li>
                    </ul>
                    <strong>$ ${product.precio}</strong>
                    <button class="edit" data-id="${product.id_producto}">Editar</button>
                    <button class="delete" data-id="${product.id_producto}">Borrar</button>
                `;
                productosContainer.appendChild(productElement);
            });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Evento para enviar el formulario de creación o actualización de productos
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(productForm);
        const producto = {};
        formData.forEach((value, key) => {
            producto[key] = value;
        });

        try {
            let response;
            if (producto.id_producto) {
                // Si existe id_producto, se trata de una actualización (PUT)
                response = await fetch(`${apiUrl}/${producto.id_producto}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                });
            } else {
                // Si no existe id_producto, se trata de una creación (POST)
                response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(producto)
                });
            }

            if (response.ok) {
                alert('Producto creado o actualizado exitosamente');
                productForm.reset();
                fetchProducts(); // Actualizar la lista de productos después de crear o actualizar
            } else {
                alert('Error al crear o actualizar el producto');
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            alert('Hubo un problema al enviar el formulario');
        }
    });

    // Evento para manejar la edición o eliminación de productos
    productosContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit')) {
            const id = e.target.dataset.id;
            try {
                const response = await fetch(`${apiUrl}/${id}`);
                const product = await response.json();
                document.getElementById('productId').value = id;
                document.getElementById('nombre').value = product.nombre;
                document.getElementById('descripcion').value = product.descripcion;
                document.getElementById('precio').value = product.precio;
                document.getElementById('stock').value = product.stock;
                document.getElementById('categoria').value = product.fk_categoria;
                document.getElementById('fk_promos').value = product.fk_promos;
                document.getElementById('fk_cuotas').value = product.fk_cuotas;
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        } else if (e.target.classList.contains('delete')) {
            const id = e.target.dataset.id;
            try {
                await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                fetchProducts(); // Actualizar la lista de productos después de eliminar
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    });

    // Cargar los productos al cargar la página inicialmente
    fetchProducts();
});
