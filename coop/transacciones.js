const transaccionesURL = "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=transacciones";

// Función para cargar datos del CSV
async function cargarCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data.split("\n").map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim()));
}

// Obtén los datos del usuario desde localStorage
const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));







// Función para cargar la tabla de depósitos con filtro dinámico
async function cargarTransaciones() {
    const datos = await cargarCSV(transaccionesURL);

    const tbody = document.querySelector("#tabla-transaciones tbody");
    const nombresUnicos = new Set();

    tbody.innerHTML = "";

    // Si el usuario está logueado, filtramos los depósitos por su número de cuenta
    const numeroCuentaUsuario = usuarioActual ? usuarioActual.numeroCuenta : null;

    datos.slice(1).forEach(([nCuenta, Nombre, Monto, fecha, descripción, ultimo]) => {
        if (nCuenta && (!numeroCuentaUsuario || nCuenta === numeroCuentaUsuario || fecha === numeroCuentaUsuario)) {  // Filtramos por el número de cuenta
            nombresUnicos.add(nCuenta); // Guardar nombres únicos para el filtro

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${nCuenta}</td>
                <td>${Nombre}</td>
                <td>${Monto || ""}</td>
                <td>${fecha || ""}</td>
                <td>${descripción}</td>
                <td>${ultimo}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Inicialización de la tabla correspondiente
if (document.getElementById("tabla-transaciones")) {
    cargarTransaciones();
}




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





// Datos del usuario activo
const usuario = JSON.parse(localStorage.getItem("currentUser"));

// Lista de números de cuenta posibles
const receptores = ["100", "101", "102", "103", "104", "105","106","107","108","109","110","111","112","113","114","115",
"116","117","118","119","120","121","122","123","124","125","126","127","128","129","130","131","132","133","134","135",
"136","137","138","139","140","141","142","143","144","145","146","147","148","149","150"];

// Fecha actual
const hoy = new Date().toISOString().split("T")[0];

// URL del endpoint de Google Apps Script (reemplaza con tu URL)
const urlAppScript = "https://script.google.com/macros/s/AKfycbyVwEjwN9k9hfbMBFiTaGZ_4xIQf87M_JYal0O15wdljgBKpN8sleAlPjYd0YAITTYFQQ/exec";

// Elementos del DOM
const inputEnvia = document.getElementById("envia");
const inputRecibe = document.getElementById("recibe");
const inputMonto = document.getElementById("monto");
const inputFecha = document.getElementById("fecha");
const inputDescripcion = document.getElementById("descripcion");
const formEnvio = document.getElementById("form-envio");
const mensaje = document.getElementById("mensaje");
// mi codigo
const inputtotal = document.getElementById("totalInput");
inputtotal.value = parseFloat(usuarioActual.total.replace(/[$,]/g, ""));

// Limpia el valor eliminando el símbolo $ y separadores de miles
const totalNumerico = inputtotal.value;

// fin de mi codigo

// Mostrar número de cuenta del usuario actual
inputEnvia.value = usuario.numeroCuenta;

// Rellenar opciones del selector de receptores, excluyendo al usuario actual
receptores.forEach((numCuenta) => {
  if (numCuenta !== usuario.numeroCuenta) {
    const option = document.createElement("option");
    option.value = numCuenta;
    option.textContent = `Cuenta: ${numCuenta}`;
    inputRecibe.appendChild(option);
  }
});


// Mostrar la fecha actual
inputFecha.value = hoy;

// Manejar el envío del formulario
formEnvio.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que el formulario se recargue

  const monto = parseFloat(inputMonto.value);
  const totalDisponible = parseFloat(totalNumerico);
  

  const recibe = inputRecibe.value;
  const descripcion = inputDescripcion.value.trim();

  // Validaciones
  if (monto < 1) {
    mensaje.textContent = "El monto debe ser mayor o igual a $1.";
    return;
  }

  if (monto > totalDisponible) {
    mensaje.textContent = "No tienes suficiente saldo disponible.";
    return;
  }
  console.log("Monto: ", monto, "Total: ", totalDisponible);
  // Confirmar la transacción
  const confirmacion = confirm(`¿Confirmas enviar $${monto} a la cuenta ${recibe}?`);
  if (!confirmacion) return;

  // Datos a enviar al servidor
  const datos = {
    envia: usuario.numeroCuenta,
    monto: monto,
    fecha: hoy,
    recibe: recibe,
    descripcion: descripcion,
  };

  try {
    // Enviar los datos al Google Apps Script
    const response = await fetch(urlAppScript, {
      method: "POST",
      redirect:"follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datos),
    });

    const resultado = await response.json(); // Analiza la respuesta JSON

    if (resultado.success) {
      mensaje.textContent = "¡Transacción exitosa! ✅";
    } else {
      mensaje.textContent = "Error al registrar la transacción. 🚨";
    }
  } catch (error) {
    mensaje.textContent = "Error al conectar con el servidor.";
    console.error(error);
  }
});


