const usuarioLogueado = localStorage.getItem('usuarioLogueado');
if (!usuarioLogueado) {
    window.location.href = 'login.html';
}

const botonCerrarSesion = document.getElementById('botonCerrarSesion');
if (botonCerrarSesion) {
    botonCerrarSesion.addEventListener('click', () => {
        localStorage.removeItem('usuarioLogueado');
        alert('Sesión cerrada correctamente.');
        window.location.href = 'login.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const listaMedicosContainer = document.getElementById('listaMedicosContainer');
    const crudContainer = document.getElementById('crudContainer');
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    let esModoEdicion = false;
    let idMedicoEditar = null;

    function renderizarTabla() {
        if (medicos.length === 0) {
            listaMedicosContainer.innerHTML = "<p>No hay médicos registrados.</p>";
            return;
        }

        const tablaHTML = `
            <table class="table table-striped table-hover">
                <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Especialidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${medicos.map(medico => `
                        <tr>
                            <td>${medico.id}</td>
                            <td>${medico.nombre}</td>
                            <td>${medico.especialidad}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onclick="visualizarMedico(${medico.id})">Ver</button>
                                <button class="btn btn-warning btn-sm" onclick="iniciarEdicion(${medico.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${medico.id})">Eliminar</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listaMedicosContainer.innerHTML = tablaHTML;
    }

    function renderizarFormulario(medico = {}) {
        const titulo = esModoEdicion ? 'Modificar Médico' : 'Crear Nuevo Médico';
        const botonTexto = esModoEdicion ? 'Guardar Cambios' : 'Crear Médico';

        crudContainer.innerHTML = `
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4 class="mb-0">${titulo}</h4>
                    </div>
                    <div class="card-body">
                        <form id="formMedico">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="nombre" class="form-label">Nombre Completo</label>
                                    <input type="text" class="form-control" id="nombre" value="${medico.nombre || ''}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="especialidad" class="form-label">Especialidad</label>
                                    <input type="text" class="form-control" id="especialidad" value="${medico.especialidad || ''}" required>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label for="matricula" class="form-label">Matrícula</label>
                                    <input type="text" class="form-control" id="matricula" value="${medico.matricula || ''}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label for="valorConsulta" class="form-label">Valor Consulta ($)</label>
                                    <input type="number" class="form-control" id="valorConsulta" value="${medico.valorConsulta || ''}" required min="0">
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="foto" class="form-label">URL de la Foto</label>
                                <input type="text" class="form-control" id="foto" value="${medico.foto || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="email" class="form-label">Email</label>
                                <input type="email" class="form-control" id="email" value="${medico.email || ''}" required>
                            </div>
                            <div class="mb-3">
                                <label for="horarios" class="form-label">Horarios</label>
                                <textarea class="form-control" id="horarios" rows="2" required>${medico.horarios || ''}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="obrasSociales" class="form-label">Obras Sociales (separadas por coma)</label>
                                <input type="text" class="form-control" id="obrasSociales" value="${medico.obrasSociales || ''}">
                            </div>
                            <button type="submit" class="btn btn-primary">${botonTexto}</button>
                            ${esModoEdicion ? '<button type="button" class="btn btn-secondary ms-2" onclick="cancelarEdicion()">Cancelar</button>' : ''}
                        </form>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('formMedico').addEventListener('submit', manejarSubmitFormulario);
    }

    function manejarSubmitFormulario(e) {
    e.preventDefault();
    const nuevoMedico = {
        nombre: document.getElementById('nombre').value,
        especialidad: document.getElementById('especialidad').value,
        obrasSociales: document.getElementById('obrasSociales').value,
        matricula: document.getElementById('matricula').value,
        valorConsulta: document.getElementById('valorConsulta').value,
        foto: document.getElementById('foto').value,
        email: document.getElementById('email').value,
        horarios: document.getElementById('horarios').value,
    };

        if (esModoEdicion) {
            const index = medicos.findIndex(m => m.id === idMedicoEditar);
            medicos[index] = { ...medicos[index], ...nuevoMedico };
            alert('Médico modificado con éxito.');
        } else {
            // Crear nuevo médico
            nuevoMedico.id = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
            medicos.push(nuevoMedico);
            alert('Médico creado con éxito.');
        }

        guardarEnLocalStorage();
        resetearFormulario();
        renderizarTabla();
    }
    
    window.visualizarMedico = function(id) {
        const medico = medicos.find(m => m.id === id);
        const modalBody = document.getElementById('modal-body-content');
        modalBody.innerHTML = `
            <div class="text-center mb-3">
                <img src="${medico.foto}" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover;" alt="Foto de ${medico.nombre}">
            </div>
            <p><strong>ID:</strong> ${medico.id}</p>
            <p><strong>Nombre:</strong> ${medico.nombre}</p>
            <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
            <p><strong>Obras Sociales:</strong> ${medico.obrasSociales || 'No especificadas'}</p>
            <p><strong>Email:</strong> ${medico.email}</p>
            <p><strong>Horarios:</strong> ${medico.horarios}</p>
            <p><strong>Matrícula:</strong> ${medico.matricula}</p>
            <p><strong>Valor Consulta:</strong> $${medico.valorConsulta.toLocaleString('es-AR')}</p>
        `;
        new bootstrap.Modal(document.getElementById('visualizarModal')).show();
    }

    window.iniciarEdicion = function(id) {
        esModoEdicion = true;
        idMedicoEditar = id;
        const medico = medicos.find(m => m.id === id);
        renderizarFormulario(medico);
        window.scrollTo(0, document.body.scrollHeight);
    }

    window.eliminarMedico = function(id) {
        if (confirm('¿Estás seguro de que quieres eliminar a este médico?')) {
            medicos = medicos.filter(m => m.id !== id);
            guardarEnLocalStorage();
            renderizarTabla();
            alert('Médico eliminado.');
        }
    }

    window.cancelarEdicion = function() {
        resetearFormulario();
    }

    function guardarEnLocalStorage() {
        localStorage.setItem('medicos', JSON.stringify(medicos));
    }

    function resetearFormulario() {
        esModoEdicion = false;
        idMedicoEditar = null;
        renderizarFormulario();
    }

    renderizarTabla();
    renderizarFormulario();
});