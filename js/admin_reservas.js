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

// Cargar y mostrar las reservas de localStorage
document.addEventListener('DOMContentLoaded', () => {
    const listaReservasContainer = document.getElementById('listaReservasContainer');
    
    function cargarReservas() {
        // Leemos de la clave 'turnos', que es donde 'reserva.js' las guarda
        const reservas = JSON.parse(localStorage.getItem('turnos')) || [];

        if (reservas.length === 0) {
            listaReservasContainer.innerHTML = "<p class='text-center'>No hay reservas registradas (en este navegador).</p>";
            return;
        }

        // Renderizar la tabla de reservas
        renderizarTablaReservas(reservas);
    }

    function renderizarTablaReservas(reservas) {
        // Ordenamos por ID (fecha) para ver las más nuevas primero
        reservas.sort((a, b) => b.id - a.id);
        
        const tablaHTML = `
            <table class="table table-striped table-hover table-sm">
                <thead class="table-dark">
                    <tr>
                        <th>ID Turno</th>
                        <th>Paciente</th>
                        <th>Email</th>
                        <th>Médico</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservas.map(reserva => `
                        <tr>
                            <td>${reserva.id}</td>
                            <td>${reserva.nombrePaciente}</td>
                            <td>${reserva.emailPaciente}</td>
                            <td>${reserva.nombreMedico}</td>
                            <td>${new Date(reserva.fecha + 'T00:00:00').toLocaleDateString('es-AR')}</td>
                            <td>${reserva.hora} hs</td>
                            <td><span class="badge bg-success">${reserva.estado}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        listaReservasContainer.innerHTML = tablaHTML;
    }

    // Iniciar la carga de reservas
    cargarReservas();
});