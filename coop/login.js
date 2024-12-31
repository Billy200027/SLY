// URL de la base de datos (hoja de cálculo)
const url = 'https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/export?format=csv';

// Elementos del DOM (Interfaz de usuario)
const botonIngresar = document.getElementById("ingresar"); // Botón para iniciar sesión
const inputUsuario = document.getElementById("usuario"); // Input del usuario
const inputPassword = document.getElementById("password"); // Input de la contraseña
const mensajeError = document.getElementById("error-message"); // Elemento para mostrar mensajes de error

// Función que obtiene los datos de la hoja de cálculo
async function obtenerDatos() {
    try {
        // Realizamos una solicitud fetch para obtener los datos de la hoja de cálculo
        const response = await fetch(url);
        const data = await response.text(); // Convertimos la respuesta a texto

        // Dividimos los datos en filas y columnas (CSV)
        const filas = data.split("\n").map(row => row.split(","));
        return filas; // Devolvemos los datos procesados
    } catch (error) {
        // En caso de error, mostramos un mensaje
        mensajeError.textContent = "Error al obtener los datos. Intenta más tarde.";
        return [];
    }
}

// Event listener para el botón de inicio de sesión
botonIngresar.addEventListener("click", async () => {
    const usuario = inputUsuario.value.trim(); // Obtenemos el usuario
    const contraseña = inputPassword.value.trim(); // Obtenemos la contraseña

    // Verificamos si los campos están vacíos
    if (!usuario || !contraseña) {
        mensajeError.textContent = "Por favor, completa todos los campos."; // Mensaje de error
        return; // Detenemos la ejecución si falta algún campo
    }

    // Intentamos obtener los datos de la base de datos
    const datos = await obtenerDatos();
    let encontrado = false;

    // Iteramos sobre los datos obtenidos para verificar si existe una coincidencia
    for (let i = 1; i < datos.length; i++) { // Comenzamos desde la fila 1 para omitir la cabecera
        const [numCuenta, pass] = datos[i]; // Desestructuramos cada fila (número de cuenta y contraseña)

        // Comprobamos si el número de cuenta y la contraseña coinciden
        if (numCuenta === usuario && pass === contraseña) {
            encontrado = true;
        
            // Guarda el número de cuenta y el nombre del usuario en localStorage
            localStorage.setItem("currentUser", JSON.stringify({ 
                numeroCuenta: numCuenta,
                contraseña: datos[i][1], 
                nombre: datos[i][2], // Aquí obtienes el nombre del usuario desde la tabla
                WhatsApp: datos[i][3],
                rol: datos[i][4],
                depositos: datos[i][5],
                envios: datos[i][6],
                retiros: datos[i][7],
                capital: datos[i][8],
                hoy: datos[i][9],
                mañana: datos[i][10],
                interes: datos[i][11],
                total: datos[i][12],
            }));
        
            // Redirige a perfil.html
            window.location.href = "perfil.html";
            break;
        }
        
    }

    // Si no se encuentra el usuario o la contraseña no coincide
    if (!encontrado) {
        mensajeError.textContent = "Número de cuenta o contraseña incorrectos."; // Mostramos el mensaje de error
    }
});
