// VERIFICAR LOGIN 
const token = sessionStorage.getItem('accessToken');
if (!token) {
    window.location.href = 'login.html';
}

// CERRAR SESIÓN 
const botonCerrarSesion = document.getElementById('botonCerrarSesion');
if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
        sessionStorage.removeItem('accessToken');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    //  REFERENCIAS 
    const listaEspecialidadesContainer = document.getElementById('listaEspecialidadesContainer');
    const crudEspecialidadesContainer = document.getElementById('crudEspecialidadesContainer');
    
    // USAR LOCALSTORAGE 
    let especialidades = JSON.parse(localStorage.getItem('especialidades')) || [];
    let esModoEdicion = false;
    let idEspecialidadEditar = null;

    function renderizarTabla() {
        if (especialidades.length === 0) {
            listaEspecialidadesContainer.innerHTML = "<p>No hay especialidades registradas.</p>";
            return;
        }

        // TABLA  Especialidades
        const tablaHTML = `
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${especialidades.map(esp => `
                        <tr>
                            <td>${esp.id}</td>
                            <td>${esp.nombre}</td>
                            <td>${esp.descripcion || 'Sin descripción'}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="iniciarEdicion(${esp.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarEspecialidad(${esp.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listaEspecialidadesContainer.innerHTML = tablaHTML;
    }

    function renderizarFormulario(esp = {}) {
        const titulo = esModoEdicion ? 'Modificar Especialidad' : 'Crear Nueva Especialidad';
        const botonTexto = esModoEdicion ? 'Guardar Cambios' : 'Crear Especialidad';

        // FORMULARIO  Especialidades
        crudEspecialidadesContainer.innerHTML = `
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">${titulo}</h4>
                    </div>
                    <div class="card-body">
                        <form id="formEspecialidad">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre</label>
                                <input type="text" class="form-control" id="nombre" value="${esp.nombre || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="descripcion" class="form-label">Descripción (Opcional)</label>
                                <textarea class="form-control" id="descripcion" rows="3">${esp.descripcion || ''}</textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">${botonTexto}</button>
                            ${esModoEdicion ? '<button type="button" class="btn btn-secondary ms-2" onclick="cancelarEdicion()">Cancelar</button>' : ''}
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('formEspecialidad').addEventListener('submit', manejarSubmitFormulario);
    }

    function manejarSubmitFormulario(e) {
        e.preventDefault();
        const nuevaEspecialidad = {
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
        };

        if (esModoEdicion) {
            const index = especialidades.findIndex(esp => esp.id === idEspecialidadEditar);
            especialidades[index] = { ...especialidades[index], ...nuevaEspecialidad };
            alert('Especialidad modificada con éxito.');
        } else {
            nuevaEspecialidad.id = especialidades.length > 0 ? Math.max(...especialidades.map(esp => esp.id)) + 1 : 1;
            especialidades.push(nuevaEspecialidad);
            alert('Especialidad creada con éxito.');
        }

        guardarEnLocalStorage();
        resetearFormulario();
        renderizarTabla();
    }
    
    // FUNCIONES GLOBALES 
    window.iniciarEdicion = function(id) {
        esModoEdicion = true;
        idEspecialidadEditar = id;
        const esp = especialidades.find(e => e.id === id);
        renderizarFormulario(esp);
        window.scrollTo(0, document.body.scrollHeight);
    }

    window.eliminarEspecialidad = function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta Especialidad?')) {
            especialidades = especialidades.filter(esp => esp.id !== id);
            guardarEnLocalStorage();
            renderizarTabla();
            alert('Especialidad eliminada.');
        }
    }

    window.cancelarEdicion = function() {
        resetearFormulario();
    }

    function guardarEnLocalStorage() {
        // GUARDAR 
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
    }

    function resetearFormulario() {
        esModoEdicion = false;
        idEspecialidadEditar = null;
        renderizarFormulario();
    }

    // INICIAR
    renderizarTabla();
    renderizarFormulario();
});