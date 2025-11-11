document.addEventListener('DOMContentLoaded', () => {
    
    // Obtener el ID del médico desde la URL
    const params = new URLSearchParams(window.location.search);
    const idMedico = params.get('id'); 

    // Si no hay ID, no podemos seguir. Devolvemos al usuario a la lista.
    if (!idMedico) {
        window.location.href = 'medicos.html'; 
        return;
    }

    // Carga los médicos de localStorage para mostrar el nombre
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
   
    const medico = medicos.find(m => m.id == idMedico); 
    
    if (medico) {
        
        document.getElementById('nombreMedicoReserva').textContent = `Reservar turno con: ${medico.nombre}`;
    } else {
        
        window.location.href = 'medicos.html';
        return;
    }

    // Manejar el envío del formulario
    const formReserva = document.getElementById('formReserva');
    const mensajeReserva = document.getElementById('mensajeReserva');

    formReserva.addEventListener('submit', (e) => {
        e.preventDefault(); 

        // Obtener datos del formulario
        const nombrePaciente = document.getElementById('nombrePaciente').value;
        const emailPaciente = document.getElementById('emailPaciente').value;
        // Leemos los dos campos nuevos (fecha y el select de hora)
        const fecha = document.getElementById('fechaTurno').value;
        const hora = document.getElementById('horaTurno').value;
        
        // Formateamos la fecha para que sea más legible
       
        const fechaFormateada = new Date(fecha + 'T' + hora).toLocaleDateString('es-AR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });
        const horaFormateada = hora + ' hs.';

        // Cargar turnos...
        const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

        // Crear el nuevo turno
        const nuevoTurno = {
            id: Date.now(),
            idMedico: idMedico,
            nombreMedico: medico.nombre,
            nombrePaciente: nombrePaciente,
            emailPaciente: emailPaciente,
            fecha: fecha, 
            hora: hora, 
            estado: 'Reservado'
        };

        // Agregar el nuevo turno al array y guardar...
        turnos.push(nuevoTurno);
        localStorage.setItem('turnos', JSON.stringify(turnos));

        // Mostrar el RESUMEN FINAL con todos los datos
        mensajeReserva.innerHTML = `
            <div class="alert alert-success">
                <h4 class="alert-heading">¡Turno reservado con éxito!</h4>
                <p>Aquí está el resumen de tu reserva. ¡Te esperamos!</p>
                <hr>
                <ul class="list-group">
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Médico:</strong>
                        <span>${medico.nombre}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Especialidad:</strong>
                        <span>${medico.especialidad}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Obras Sociales:</strong>
                        <span>${medico.obrasSociales || 'Consultar'}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Día:</strong>
                        <span>${fechaFormateada}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Horario:</strong>
                        <span>${horaFormateada}</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <strong>Costo Total:</strong>
                        <span>$${medico.valorConsulta ? medico.valorConsulta.toLocaleString('es-AR') : 'Consultar'}</span>
                    </li>
                </ul>
            </div>
        `;
        
        // Ocultamos el formulario y cambiamos el título
        formReserva.style.display = 'none';
        document.getElementById('nombreMedicoReserva').textContent = 'Resumen de tu Turno';
    });
});