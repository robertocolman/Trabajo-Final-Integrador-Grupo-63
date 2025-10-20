/*
    Archivo: js/medicos.js
    Descripción: Carga y muestra el catálogo público de médicos desde LocalStorage.
*/
document.addEventListener('DOMContentLoaded', () => {
    const catalogoMedicos = document.getElementById('catalogoMedicos');
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];

    if (medicos.length === 0) {
        catalogoMedicos.innerHTML = '<p class="text-center">No hay médicos disponibles en este momento.</p>';
        return;
    }

    catalogoMedicos.innerHTML = medicos.map(medico => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 text-center">
                <img src="${medico.foto}" class="card-img-top mx-auto mt-3 rounded-circle" 
                     style="width: 150px; height: 150px; object-fit: cover;" alt="Foto de ${medico.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${medico.nombre}</h5>
                    <p class="card-text"><strong>Especialidad:</strong> ${medico.especialidad}</p>
                    <p class="card-text"><strong>Email:</strong> ${medico.email}</p>
                    <p class="card-text"><strong>Horarios:</strong> ${medico.horarios}</p>
                </div>
            </div>
        </div>
    `).join('');
});