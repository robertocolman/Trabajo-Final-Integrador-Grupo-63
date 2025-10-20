// js/medicos.js
// ✅ CORRECCIÓN CLAVE: Usamos la ruta absoluta desde la raíz (/) del proyecto.
import { medicosInicial } from '/config/medicosInicial.js'; 

// Exportamos la función para que el HTML pueda llamarla como módulo
export { cargarCatalogoMedicos }; 

function cargarCatalogoMedicos() {
    const catalogo = document.getElementById('catalogoMedicos');
    catalogo.innerHTML = '';

    // 1. Intenta obtener los médicos del LocalStorage (datos actualizados)
    let medicos = JSON.parse(localStorage.getItem("medicos"));

    // 2. Si LocalStorage está vacío o la lectura falla, usa los datos iniciales (FALLBACK).
    if (!medicos || medicos.length === 0) {
        medicos = medicosInicial;
        console.warn("LocalStorage vacío o fallido. Usando datos iniciales de respaldo.");
        
        // Inicializamos LocalStorage aquí como fallback
        if (!localStorage.getItem("medicos")) {
             localStorage.setItem("medicos", JSON.stringify(medicosInicial));
        }
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