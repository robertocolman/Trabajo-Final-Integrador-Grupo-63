// VERIFICAR LOGIN 
const token = sessionStorage.getItem('accessToken');
if (!token) {
    window.location.href = 'login.html';
}

// CERRAR SESIÓN (Igual que antes)
const botonCerrarSesion = document.getElementById('botonCerrarSesion');
if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.removeItem('accessToken');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // REFERENCIAS 
    const listaObrasSocialesContainer = document.getElementById('listaObrasSocialesContainer');
    const crudObrasSocialesContainer = document.getElementById('crudObrasSocialesContainer');
    
    // USAR LOCALSTORAGE 
    let obrasSociales = JSON.parse(localStorage.getItem('obrasSociales')) || [];
    let esModoEdicion = false;
    let idObraSocialEditar = null;

    function renderizarTabla() {
        if (obrasSociales.length === 0) {
            listaObrasSocialesContainer.innerHTML = "<p>No hay obras sociales registradas.</p>";
            return;
        }

        // TABLA  Obras Sociales
        const tablaHTML = `
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre de Obra Social</th>
                        <th>Email de Contacto</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${obrasSociales.map(os => `
                        <tr>
                            <td>${os.id}</td>
                            <td>${os.nombre}</td>
                            <td>${os.email}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="iniciarEdicion(${os.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarObraSocial(${os.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listaObrasSocialesContainer.innerHTML = tablaHTML;
    }

    function renderizarFormulario(os = {}) {
        const titulo = esModoEdicion ? 'Modificar Obra Social' : 'Crear Nueva Obra Social';
        const botonTexto = esModoEdicion ? 'Guardar Cambios' : 'Crear Obra Social';

        // FORMULARIO Obras Sociales
        crudObrasSocialesContainer.innerHTML = `
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">${titulo}</h4>
                    </div>
                    <div class="card-body">
                        <form id="formObraSocial">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" value="${os.nombre || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email de Contacto</label>
                                <input type="email" class="form-control" id="email" value="${os.email || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="text" class="form-control" id="telefono" value="${os.telefono || ''}">
                            </div>
                            <button type="submit" class="btn btn-primary">${botonTexto}</button>
                            ${esModoEdicion ? '<button type="button" class="btn btn-secondary ms-2" onclick="cancelarEdicion()">Cancelar</button>' : ''}
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('formObraSocial').addEventListener('submit', manejarSubmitFormulario);
    }

    function manejarSubmitFormulario(e) {
        e.preventDefault();
        const nuevaObraSocial = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
        };

        if (esModoEdicion) {
            const index = obrasSociales.findIndex(os => os.id === idObraSocialEditar);
            obrasSociales[index] = { ...obrasSociales[index], ...nuevaObraSocial };
            alert('Obra Social modificada con éxito.');
        } else {
            nuevaObraSocial.id = obrasSociales.length > 0 ? Math.max(...obrasSociales.map(os => os.id)) + 1 : 1;
            obrasSociales.push(nuevaObraSocial);
            alert('Obra Social creada con éxito.');
        }

        guardarEnLocalStorage();
        resetearFormulario();
        renderizarTabla();
    }
    
    // FUNCIONES GLOBALES 
    window.iniciarEdicion = function(id) {
        esModoEdicion = true;
        idObraSocialEditar = id;
        const os = obrasSociales.find(o => o.id === id);
        renderizarFormulario(os);
        window.scrollTo(0, document.body.scrollHeight);
    }

    window.eliminarObraSocial = function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta Obra Social?')) {
            obrasSociales = obrasSociales.filter(os => os.id !== id);
            guardarEnLocalStorage();
            renderizarTabla();
            alert('Obra Social eliminada.');
        }
    }

    window.cancelarEdicion = function() {
        resetearFormulario();
    }

    function guardarEnLocalStorage() {
        // GUARDAR 
        localStorage.setItem('obrasSociales', JSON.stringify(obrasSociales));
    }

    function resetearFormulario() {
        esModoEdicion = false;
        idObraSocialEditar = null;
        renderizarFormulario();
    }

    // INICIAR
    renderizarTabla();
    renderizarFormulario();
});