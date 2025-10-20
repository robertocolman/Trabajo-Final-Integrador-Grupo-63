// js/medicos.js
// ✅ PASO 1: Lista inicial duplicada para asegurar el fallback sin import fallido
const medicosInicial = [
    { id: 10234, nombre: "Dr. Esteban Chávez", especialidad: "Traumatología", obraSocial: "Medife, OSDE", turnos: "Lunes y Miércoles 9:00 - 12:00", costo: 30000, imagen: "img/esteban-chavez.jpg" },
    { id: 11345, nombre: "Dra. Carla Pérez", especialidad: "Kinesiología", obraSocial: "Unión Personal, IAPOS", turnos: "Martes y Jueves 14:00 - 17:00", costo: 45000, imagen: "img/carla-perez.jpg" },
    { id: 12078, nombre: "Dr. Martín Gómez", especialidad: "Clínica Médica", obraSocial: "PAMI, OSDE, Federada Salud", turnos: "Lunes a Viernes 10:00 - 13:00", costo: 50000, imagen: "img/martin-gomez.jpg" },
    { id: 10987, nombre: "Dra. Laura Fernández", especialidad: "Pediatría", obraSocial: "Medife, Swiss Medical", turnos: "Martes y Viernes 8:00 - 11:00", costo: 50000, imagen: "img/laura-fernandez.jpg" },
    { id: 11567, nombre: "Dr. Nicolás Torres", especialidad: "Cardiología", obraSocial: "OSDE, Unión Personal", turnos: "Lunes y Jueves 16:00 - 19:00", costo: 30000, imagen: "img/nicolas-torres.jpg" },
    { id: 33589, nombre: "Dra. Jimena Kim", especialidad: "Neumonología", obraSocial: "OSDE, Galeno, Andar", turnos: "Martes y Jueves 15:00 - 18:00", costo: 53000, imagen: "img/Jimena-Kim.jpg" }
];

document.addEventListener('DOMContentLoaded', () => {
    cargarCatalogoMedicos();
});

function cargarCatalogoMedicos() {
    const catalogo = document.getElementById('catalogoMedicos');
    catalogo.innerHTML = '';

    // 1. Intenta obtener los médicos del LocalStorage
    let medicos = JSON.parse(localStorage.getItem("medicos"));

    // 2. Si LocalStorage está vacío, usa los datos internos (FALLBACK)
    if (!medicos || medicos.length === 0) {
        medicos = medicosInicial;
        console.warn("LocalStorage vacío. Usando datos internos para el catálogo público.");
    }

    if (medicos.length === 0) {
        catalogo.innerHTML = '<p class="text-center mt-5 alert alert-warning">Actualmente no hay profesionales registrados.</p>';
        return;
    }

    medicos.forEach(medico => {
        const cardCol = document.createElement('div');
        cardCol.classList.add('col-md-4', 'mb-4');

        const costoFormateado = `$${medico.costo.toLocaleString('es-AR')}`;
        const imagePath = medico.imagen || 'img/default.jpg'; 

        cardCol.innerHTML = `
            <div class="card h-100">
                <img src="${imagePath}" class="fotoCatalogo" alt="Foto ${medico.nombre}">
                <div class="card-body">
                    <h3 class="card-title"><u><i>${medico.nombre.includes('Dra.') ? 'Dra.' : 'Dr.'}</i> ${medico.nombre.replace('Dr. ', '').replace('Dra. ', '')}</u></h3>
                    <p class="card-text"><strong>Matrícula:</strong> ${medico.id}</p>
                    <p class="card-text"><strong>Especialidad:</strong> ${medico.especialidad}</p>
                    <p class="card-text"><strong>Obras sociales:</strong> ${medico.obraSocial}</p>
                    <p class="card-text"><strong>Turnos disponibles:</strong> ${medico.turnos}</p>
                    <p class="card-text"><strong>Valor consulta:</strong> ${costoFormateado}</p>
                </div>
                <div class="card-footer">
                    <a class="btn btn-primary btn-sm" href="#">Reservar turno</a>
                </div>
            </div>
        `;
        catalogo.appendChild(cardCol);
    });
}