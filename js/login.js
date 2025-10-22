/*
    Archivo: js/login.js
    Descripción: Maneja la lógica del formulario de inicio de sesión con mensajes de diagnóstico.
*/

console.log("✅ El archivo login.js se cargó correctamente.");

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ El HTML de la página terminó de cargar.");

    const formLogin = document.getElementById('formLogin');
    const usuarioInput = document.getElementById('usuario');
    const claveInput = document.getElementById('clave');
    const mensajeDiv = document.getElementById('mensaje');

    // Verificamos si encontramos el formulario
    if (formLogin) {
        console.log("✅ Formulario de login encontrado en el HTML.");

        formLogin.addEventListener('submit', (evento) => {
            console.log("🅿️ El usuario presionó 'Ingresar'.");
            
            // Prevenimos que el formulario recargue la página.
            evento.preventDefault(); 

            const usuario = usuarioInput.value;
            const clave = claveInput.value;
            console.log(`🔎 Buscando usuario: '${usuario}' con clave: '${clave}'`);

            // Verificamos si la variable 'usuarios' existe antes de usarla
            if (typeof usuarios !== 'undefined') {
                const usuarioValido = usuarios.find(user => user.usuario === usuario && user.clave === clave);

                if (usuarioValido) {
                    console.log("👍 ¡Usuario válido encontrado!", usuarioValido);
                    mensajeDiv.innerHTML = '<div class="alert alert-success">¡Bienvenido! Redirigiendo...</div>';
                    localStorage.setItem('usuarioLogueado', 'true');
                    setTimeout(() => {
                        window.location.href = 'altaMedicos.html';
                    }, 1500);
                } else {
                    console.log("❌ Usuario o clave incorrectos.");
                    mensajeDiv.innerHTML = '<div class="alert alert-danger">Usuario o contraseña incorrectos.</div>';
                }
            } else {
                console.error("🔥 ERROR: El archivo 'usuarius.js' no se cargó o la variable 'usuarios' no está definida.");
                mensajeDiv.innerHTML = '<div class="alert alert-danger">Error de configuración. Contacte al administrador.</div>';
            }
        });
    } else {
        console.error("🔥 ERROR: No se encontró el formulario con id='formLogin' en el HTML.");
    }
});