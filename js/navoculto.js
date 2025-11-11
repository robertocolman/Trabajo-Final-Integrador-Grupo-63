document.addEventListener('DOMContentLoaded', () => {
    const token = sessionStorage.getItem('accessToken');

    // Referencias a los <li> de la Navbar para que se muestren cuando te logueas:
    const navAltaMedico = document.getElementById('navAltaMedico');
    const navAdminMedico = document.getElementById('navAdminMedico');
    const navAdminOS = document.getElementById('navAdminOS');
    const navAdminEsp = document.getElementById('navAdminEsp');
    const navAdminReservas = document.getElementById('navAdminReservas');
    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');

    if (token) {
       
        // Mostrar links solo para los user logueador como admin.
        
        if (navAltaMedico) navAltaMedico.style.display = 'list-item';
        if (navAdminMedico) navAdminMedico.style.display = 'list-item';
        if (navAdminOS) navAdminOS.style.display = 'list-item';
        if (navAdminEsp) navAdminEsp.style.display = 'list-item';
        if (navAdminReservas) navAdminReservas.style.display = 'list-item';

        // Ocultar el link de "Login"
        if (navLogin) navLogin.style.display = 'none';

        // Mostrar el botón de "Cerrar Sesión"
        if (navLogout) navLogout.style.display = 'list-item';

    } else {
        // --- Usuario NO LOGUEADO ---
    }

    // ---  botón de Cerrar Sesión ---
   
    const botonCerrar = document.getElementById('botonCerrarSesionPublico');
    if (botonCerrar) {
        botonCerrar.addEventListener('click', () => {
            sessionStorage.removeItem('accessToken');
            alert('Sesión cerrada correctamente.');
           
            window.location.reload();
        });
    }
});