/*
    Archivo: js/medicos.js
    Descripción: Carga y muestra el catálogo público de médicos.
*/

// 1. Importamos la lista inicial de médicos que teniamos cuando arrancamos el proyecto.
import { medicosInicial } from '../config/medicosInicial.js';

document.addEventListener('DOMContentLoaded', () => {
    const catalogoMedicos = document.getElementById('catalogoMedicos');
    let medicos;

    // 2. Lógica "Get or Create"
    if (localStorage.getItem('medicos')) {
        medicos = JSON.parse(localStorage.getItem('medicos'));
    } else {
        medicos = medicosInicial;
        localStorage.setItem('medicos', JSON.stringify(medicos));
    }

    // 3. Renderizado de tarjetas (con los campos nuevos)
    if (medicos.length === 0) {
        catalogoMedicos.innerHTML = '<p class="text-center">No hay médicos disponibles en este momento.</p>';
        return;
    }

    catalogoMedicos.innerHTML = medicos.map(medico => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${medico.foto}" class="card-img-top" alt="Foto de ${medico.nombre}">
                <div class="card-body d-flex flex-column">
                    <h4 class="card-title">${medico.nombre}</h4>
                    <p class="card-text mb-1"><strong>Matrícula:</strong> ${medico.matricula || 'No disponible'}</p>
                    <p class="card-text mb-1"><strong>Especialidad:</strong> ${medico.especialidad}</p>
                    <p class="card-text mb-1"><strong>Obras sociales:</strong> ${medico.obrasSociales || 'Consultar'}</p>
                    <p class="card-text mb-1"><strong>Turnos disponibles:</strong> ${medico.horarios}</p>
                    <p class="card-text"><strong>Valor consulta:</strong> $${medico.valorConsulta ? medico.valorConsulta.toLocaleString('es-AR') : 'Consultar'}</p>
                    <div class="mt-auto">
                        <a class="btn btn-primary btn-sm" href="#">Reservar turno</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
});