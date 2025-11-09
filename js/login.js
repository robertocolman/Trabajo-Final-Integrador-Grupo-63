
document.addEventListener('DOMContentLoaded', () => {
    
    // agarro el form y el div del mensage
    const formLogin = document.getElementById('formLogin');
    const mensajeDiv = document.getElementById('mensaje');

    
    formLogin.addEventListener('submit', async (e) => {
        
        
        e.preventDefault(); 

        // optener los valores
        const usuario = document.getElementById('usuario').value;
        const clave = document.getElementById('clave').value;
        
        
        mensajeDiv.innerHTML = '';
        mensajeDiv.classList.remove('alert', 'alert-danger', 'alert-success');

        // probar el login
        try {
            // esto es para los headers, q sea json
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            // pasar el usuario y la clave a stringify
            const bodyEnJSON = JSON.stringify({
                username: usuario,
                password: clave
            });

            // llamar a la api dumyjson
            const respuesta = await fetch('https://dummyjson.com/auth/login', {
                method: 'POST',
                headers: myHeaders,
                body: bodyEnJSON
            });

            // agarro la data
            const data = await respuesta.json();

            // cheqear si anduvo
            if (!respuesta.ok) {
                
                throw new Error(data.message || 'Error en el inicio de sesión');
            }

            // si esta todo bien, guardar el token
            console.log('Login exitoso:', data);
            sessionStorage.setItem('accessToken', data.token);
            
            // pongo el cartel de exito
            mensajeDiv.innerHTML = '<strong>¡Éxito!</strong> Redirigiendo a la página de administración...';
            mensajeDiv.classList.add('alert', 'alert-success');

            // esperar 2 segundos y mandar a la otra pagina
            setTimeout(() => {
                window.location.href = 'altaMedicos.html';
            }, 2000);

        } catch (error) {
            // mostrar el error en el div si sale mal
            mensajeDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
            mensajeDiv.classList.add('alert', 'alert-danger');
        }
    });
});