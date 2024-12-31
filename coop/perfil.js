// Abrir y cerrar el menú lateral
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});




// Obtén los datos del usuario desde localStorage
const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));

// Verifica si hay datos disponibles (por si alguien entra sin iniciar sesión)
if (usuarioActual) {
    // Muestra el número de cuenta y el nombre del usuario en la página
    const numeroCuenta = document.getElementById("Ncuenta");
    numeroCuenta.textContent = usuarioActual.numeroCuenta;
    const nombreCompleto = document.getElementById("Nombre");
    nombreCompleto.textContent = usuarioActual.nombre;
    const contraseña = document.getElementById("contraseña");
    contraseña.textContent = usuarioActual.contraseña;
    const celular = document.getElementById("celular");
    celular.textContent = usuarioActual.WhatsApp;
    const  Rol= document.getElementById("rol");
    Rol.textContent = usuarioActual.rol;
    const  depositos= document.getElementById("deposito");
    depositos.textContent = usuarioActual.depositos;
    const  envio= document.getElementById("envio");
    envio.textContent = usuarioActual.envios;
    const  retiro= document.getElementById("retiro");
    retiro.textContent = usuarioActual.retiros;
    const  capital= document.getElementById("capital");
    capital.textContent = usuarioActual.capital;
    const  idm= document.getElementById("mañana");
    idm.textContent = usuarioActual.mañana;
    const  interes= document.getElementById("interes");
    interes.textContent = usuarioActual.interes;
    const  total= document.getElementById("total");
    total.textContent = usuarioActual.total;
    const contraseñaHoy = document.getElementById("contraseñaHoy");
    contraseñaHoy.textContent = usuarioActual.contraseña;
} else {
    // Si no hay datos, redirige al inicio de sesión
    alert("No has iniciado sesión. Por favor, ingresa tu cuenta.");
    window.location.href = "login.html";
}









// Obtén los datos desde el localStorage (por ejemplo, el ID del usuario)
const contraseña = localStorage.getItem("contraseña");  // Asumimos que el ID del usuario está guardado en localStorage

// Obtenemos el formulario y los inputs
const boton = document.getElementById('actualizar');
const nuevaContraseñaEl = document.getElementById('nuevaContrasena');

// Event listener para cuando el usuario envíe el formulario
boton.addEventListener('click', function(event) {
  const nuevaContraseña = nuevaContraseñaEl.value;  // Obtener el nuevo número de celular

  // Verificar si el número está vacío
  if (nuevaContraseña.trim() === "") {
    alert("Por favor, ingresa un número de celular válido.");
    return;
  }

  // Hacer la solicitud POST a Google Apps Script
  fetch('https://script.google.com/macros/s/AKfycbwHoKic8c2OIssaA-c9AVeM6zafoF0yxAZtsvyC8ErB010Dzw_B6jb0P-y0SpRmIrOFIg/exec', {  // Reemplaza 'URL_DEL_SCRIPT_DE_GOOGLE' por la URL del script
    redirect:"follow",
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify({
      usuario: usuarioActual.numeroCuenta,
      nuevaContrasena: nuevaContraseña
    })
  })
  .then(response => response.text())
  .then(result => {
    alert(result);  // Mostrar mensaje de éxito o error
    nuevaContraseña.value = "";  // Limpiar el input
  })
  .catch(error => {
    console.error('Error:', error);
    alert("Hubo un error al actualizar el número.");
  });
});
