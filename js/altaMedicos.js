const formAltaMedico = document.getElementById('altaMedicoForm');
const inputNombre = document.getElementById('nombre');
const inputEspecialidad = document.getElementById('especialidad');
const inputObraS = document.getElementById('obraSocial');

function altaMedicos(event){
    event.preventDefault();
    
    let nombre = inputNombre.value.trim();
    let especialidad = inputEspecialidad.value.trim();
    let obraSocial = inputObraS.value.trim();

    if(!nombre || !especialidad || !obraSocial ){
        alert('Por favor completa los campos requeridos');
        return;
    }
    
    alert(
        `Médico registrado:\n\n` +
        `Nombre: ${nombre}\n` +
        `Especialidad: ${especialidad}\n` +
        `Obra Social: ${obraSocial}\n`
    );

    formAltaMedico.reset();
}

formAltaMedico.addEventListener('submit', altaMedicos)