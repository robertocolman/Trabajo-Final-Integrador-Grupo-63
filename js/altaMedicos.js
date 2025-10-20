// js/altaMedicos.js

const listaMedicosContainer = document.getElementById('listaMedicosContainer');
const crudContainer = document.getElementById('crudContainer');
let visualizarModal; // Variable global para la instancia de Bootstrap Modal

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar la tabla de médicos siempre al inicio
    mostrarMedicos();

    // 2. Inicializar el Modal de Bootstrap globalmente (FUERA DE LA FUNCIÓN CONDICIONAL)
    const modalElement = document.getElementById('visualizarModal');
    if (modalElement) {
        visualizarModal = new bootstrap.Modal(modalElement);
    }
    
    // 3. Renderizar la sección de Alta/Login
    renderizarSeccionCRUD();
    
    // 4. Inicializar listeners que no dependen de si el formulario está inyectado
    inicializarListenersGlobales();
});

// ----------------------------------------------------
// Lógica de Renderizado y Acceso
// ----------------------------------------------------

function renderizarSeccionCRUD() {
    const usuario = sessionStorage.getItem("usuarioLogueado");
    crudContainer.innerHTML = ''; 

    if (usuario) {
        // Usuario Logueado: Mostrar formulario CRUD y botón de cerrar sesión
        crudContainer.innerHTML = `
            <div class="col-lg-8">
                <h2 class="mb-4 text-center" id="form-title">Registrar Nuevo Médico</h2>
                
                <form id="altaMedicoForm" class="card p-4 shadow-sm mx-auto mb-5" style="max-width: 600px;">
                    <input type="hidden" id="medicoId" value="">
                    
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" id="nombre" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label for="especialidad" class="form-label">Especialidad</label>
                        <input type="text" id="especialidad" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="obraSocial" class="form-label">Obra Social</label>
                        <input type="text" id="obraSocial" class="form-control" required>
                    </div>

                    <div class="mb-3">
                        <label for="turnos" class="form-label">Turnos</label>
                        <input type="text" id="turnos" class="form-control" placeholder="Ej: Lunes 9:00 - 12:00" required>
                    </div>

                    <div class="mb-3">
                        <label for="costo" class="form-label">Costo Consulta ($)</label>
                        <input type="number" id="costo" class="form-control" required min="0" step="1000">
                    </div>

                    <div class="mb-3">
                        <label for="imagen" class="form-label">URL Imagen (Opcional)</label>
                        <input type="text" id="imagen" class="form-control" placeholder="Ej: img/nuevo-medico.jpg">
                    </div>

                    <div class="d-flex gap-2">
                        <button type="submit" id="submitBtn" class="btn btn-primary w-100">Registrar Médico</button>
                        <button type="button" id="cancelarEdicionBtn" class="btn btn-secondary" style="display: none;">Cancelar Edición</button>
                    </div>
                </form>

                <div class="text-center mt-4">
                    <button id="logoutBtn" class="btn btn-danger">Cerrar sesión de ${usuario}</button>
                </div>
            </div>
        `;
        
        inicializarListenersDelFormulario(); // Inicializa solo listeners del formulario inyectado

    } else {
        // Usuario NO Logueado: Pedir iniciar sesión
        crudContainer.innerHTML = `
            <div class="col-lg-8 text-center alert alert-info">
                <p>Para agregar, modificar o eliminar médicos, por favor **inicie sesión**.</p>
                <a href="login.html" class="btn btn-success">Iniciar Sesión</a>
            </div>
        `;
    }
}

function inicializarListenersGlobales() {
    // Asigna las funciones a la ventana (scope global) para que los botones onclick funcionen
    window.eliminarMedico = eliminarMedico;
    window.cargarFormularioEdicion = cargarFormularioEdicion;
    window.visualizarMedico = visualizarMedico;
    
    // Listener de Logout (siempre existe en el DOM inyectado o no)
    const btnLogout = document.getElementById('logoutBtn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem("usuarioLogueado");
            window.location.reload(); 
        });
    }
}

function inicializarListenersDelFormulario() {
    // Listeners que solo existen cuando el usuario está logueado
    const formAltaMedico = document.getElementById('altaMedicoForm');
    if (formAltaMedico) {
        formAltaMedico.addEventListener('submit', altaMedicos);
    }
    
    const cancelarEdicionBtn = document.getElementById('cancelarEdicionBtn');
    if(cancelarEdicionBtn) {
        cancelarEdicionBtn.addEventListener('click', () => {
            formAltaMedico.reset();
            document.getElementById('medicoId').value = "";
            document.getElementById('submitBtn').textContent = "Registrar Médico";
            document.getElementById('form-title').textContent = "Registrar Nuevo Médico";
            cancelarEdicionBtn.style.display = 'none';
        });
    }
}


// ----------------------------------------------------
// Lógica de Datos CRUD
// ----------------------------------------------------

function mostrarMedicos() {
    listaMedicosContainer.innerHTML = "";
    let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    // ... (El resto de la función mostrarMedicos sigue igual, generando la tabla con botones) ...
    if (medicos.length === 0) {
        listaMedicosContainer.innerHTML = "<p class='text-center'>No hay médicos registrados.</p>";
        return;
    }

    let tablaHTML = `
        <table class="table table-striped table-hover align-middle">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Especialidad</th>
                    <th>Obra Social</th>
                    <th class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;
    const usuarioLogueado = !!sessionStorage.getItem("usuarioLogueado");
    const accionesHTML = (id) => usuarioLogueado ? 
        `<div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-info btn-sm" onclick="visualizarMedico(${id})"><i class="bi bi-eye"></i> Ver</button>
            <button class="btn btn-warning btn-sm" onclick="cargarFormularioEdicion(${id})"><i class="bi bi-pencil"></i> Modificar</button>
            <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${id})"><i class="bi bi-trash"></i> Eliminar</button>
        </div>` : 'Requiere Login';

    medicos.forEach(medico => {
        tablaHTML += `
            <tr>
                <td>${medico.id}</td>
                <td>${medico.nombre}</td>
                <td>${medico.especialidad}</td>
                <td>${medico.obraSocial}</td>
                <td class="text-center">${accionesHTML(medico.id)}</td>
            </tr>
        `;
    });

    tablaHTML += `</tbody></table>`;
    listaMedicosContainer.innerHTML = tablaHTML;
}

// ... (altaMedicos, eliminarMedico, cargarFormularioEdicion sin cambios relevantes) ...

function altaMedicos(event) {
    event.preventDefault();
    
    const medicoIdInput = document.getElementById('medicoId');
    const inputNombre = document.getElementById('nombre');
    const inputEspecialidad = document.getElementById('especialidad');
    const inputObraS = document.getElementById('obraSocial');
    const inputTurnos = document.getElementById('turnos');
    const inputCosto = document.getElementById('costo');
    const inputImagen = document.getElementById('imagen');
    const submitBtn = document.getElementById('submitBtn');
    const formTitle = document.getElementById('form-title');
    const cancelarEdicionBtn = document.getElementById('cancelarEdicionBtn');
    
    let id = medicoIdInput.value;
    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obraSocial = inputObraS.value.trim();
    let turnos = inputTurnos.value.trim() || '';
    let costo = parseInt(inputCosto.value.trim()) || 0;
    let imagen = inputImagen.value.trim() || '';
    
    if (!nombre || !especialidad || !obraSocial || !turnos || isNaN(costo)) {
        alert('Por favor completa todos los campos requeridos correctamente.');
        return;
    }

    let medicos = JSON.parse(localStorage.getItem("medicos")) || [];

    if (id) {
        let index = medicos.findIndex(m => m.id === parseInt(id));
        if (index !== -1) {
            medicos[index] = { id: parseInt(id), nombre, especialidad, obraSocial, turnos, costo, imagen };
            alert(`Médico ID ${id} modificado correctamente.`);
        }
        medicoIdInput.value = "";
        submitBtn.textContent = "Registrar Médico";
        formTitle.textContent = "Registrar Nuevo Médico";
        cancelarEdicionBtn.style.display = 'none';

    } else {
        const nuevoId = Date.now();
        let nuevoMedico = { id: nuevoId, nombre, especialidad, obraSocial, turnos, costo, imagen };
        medicos.push(nuevoMedico);
        alert(`Médico registrado correctamente.`);
    }

    localStorage.setItem("medicos", JSON.stringify(medicos));
    document.getElementById('altaMedicoForm').reset();
    mostrarMedicos();
}

function eliminarMedico(id) {
    if (!sessionStorage.getItem("usuarioLogueado")) return alert("Debes iniciar sesión para eliminar médicos.");

    if (confirm(`¿Estás seguro de que quieres eliminar al médico con ID ${id}?`)) {
        let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
        medicos = medicos.filter(m => m.id !== id);
        localStorage.setItem("medicos", JSON.stringify(medicos));
        mostrarMedicos();
        alert(`Médico ID ${id} eliminado.`);
    }
}

function cargarFormularioEdicion(id) {
    if (!sessionStorage.getItem("usuarioLogueado")) return alert("Debes iniciar sesión para modificar médicos.");
    
    let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const medico = medicos.find(m => m.id === id);

    if (medico) {
        document.getElementById('medicoId').value = medico.id;
        document.getElementById('nombre').value = medico.nombre;
        document.getElementById('especialidad').value = medico.especialidad;
        document.getElementById('obraSocial').value = medico.obraSocial;
        document.getElementById('turnos').value = medico.turnos;
        document.getElementById('costo').value = medico.costo;
        document.getElementById('imagen').value = medico.imagen || '';

        document.getElementById('submitBtn').textContent = "Guardar Cambios";
        document.getElementById('form-title').textContent = "Modificar Médico (ID: " + medico.id + ")";
        document.getElementById('cancelarEdicionBtn').style.display = 'inline-block';
        
        window.scrollTo(0, document.getElementById('crudContainer').offsetTop - 20); 
    } else {
        alert("Médico no encontrado para edición.");
    }
}

// ✅ FUNCIÓN VISUALIZAR MEJORADA
function visualizarMedico(id) {
    let medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    const medico = medicos.find(m => m.id === id);

    if (medico) {
        const modalBody = document.getElementById('modal-body-content');
        
        // 🛠️ Utilizamos la URL guardada en el objeto médico.
        // Si no está, o la ruta es inválida, se usará 'img/default.jpg' (asumiendo que existe).
        const imagePath = medico.imagen || 'img/default.jpg';
        
        modalBody.innerHTML = `
            <div class="text-center mb-3">
                <img src="${imagePath}" alt="Foto de ${medico.nombre}" class="img-fluid rounded-circle" style="width: 150px; height: 150px; object-fit: cover;">
            </div>
            <p><strong>Matrícula/ID:</strong> ${medico.id}</p>
            <p><strong>Nombre:</strong> ${medico.nombre}</p>
            <p><strong>Especialidad:</strong> ${medico.especialidad}</p>
            <p><strong>Obras Sociales:</strong> ${medico.obraSocial}</p>
            <p><strong>Horario:</strong> ${medico.turnos}</p>
            <p><strong>Costo Consulta:</strong> $${medico.costo.toLocaleString('es-AR')}</p>
        `;
        
        // El modal debería mostrarse correctamente ahora
        if(visualizarModal) {
            visualizarModal.show();
        } else {
             // Esto puede ocurrir si el script de Bootstrap no cargó correctamente.
             console.error("Error: El modal de Bootstrap no se pudo inicializar.");
             alert("Error al intentar abrir la visualización.");
        }
    } else {
        alert("Médico no encontrado.");
    }
}