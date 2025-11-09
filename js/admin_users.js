//  Verificar si el usuario está logueado
const token = sessionStorage.getItem('accessToken');
if (!token) {
    window.location.href = 'login.html';
}

// Funcionalidad de Cerrar Sesión 
const botonCerrarSesion = document.getElementById('botonCerrarSesion');
if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.removeItem('accessToken');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });
}

// Cargar y mostrar los usuarios de DumyJSON
document.addEventListener('DOMContentLoaded', () => {
    const listaUsuariosContainer = document.getElementById('listaUsuariosContainer');
    
    async function cargarUsuarios() {
        try {
            // Llamar a la API 
            const respuesta = await fetch('https://dummyjson.com/users');

            if (!respuesta.ok) {
                throw new Error(`Error al cargar los usuarios: ${respuesta.statusText}`);
            }

            const data = await respuesta.json();
            const usuarios = data.users;

            if (usuarios.length === 0) {
                listaUsuariosContainer.innerHTML = "<p>No se encontraron usuarios.</p>";
                return;
            }

            // Renderizar la tabla de usuarios del domyjson
            renderizarTablaUsuarios(usuarios);

        } catch (error) {
            listaUsuariosContainer.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        }
    }

    function renderizarTablaUsuarios(usuarios) {
        const tablaHTML = `
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre Completo</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Nombre de Usuario</th>
                    </tr>
                </thead>
                <tbody>
                    ${usuarios.map(usuario => `
                        <tr>
                            <td>${usuario.id}</td>
                            <td>${usuario.firstName} ${usuario.lastName}</td>
                            <td>${usuario.email}</td>
                            <td>${usuario.phone}</td>
                            <td>${usuario.username}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listaUsuariosContainer.innerHTML = tablaHTML;
    }

    // Iniciar la cargs de usuarios
    cargarUsuarios();
});