

// Código para controlar el menú lateral
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

// Abre el menú lateral al hacer clic en el botón del menú
menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
});

// Cierra el menú lateral al hacer clic en el botón de cerrar
closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

async function cargarCSV(url) {
  // Realiza una solicitud HTTP para obtener el contenido del archivo CSV
  const response = await fetch(url); // Espera la respuesta del servidor
  const data = await response.text(); // Obtiene el contenido del archivo como texto
  console.log(data);
  // Divide el texto del CSV en filas y columnas
  // Cada fila se separa por el salto de línea "\n" y las columnas por comas ","
  return data.split("\n").map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim()));
}
async function cargarDatos(hoja,ctabla){
  const ctbl = document.getElementById(ctabla);

  dats = await cargarCSV(`https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=${hoja}`)
  console.log("Datos: ", dats.slice(1)[73]);
  dats.slice(1).forEach((dat) => {
    let row = document.createElement("tr");
    //console.log("Dat2 ind=",index,": ", dat);

        // Agrega celdas (<td>) con los valores de las columnas seleccionadas
        dat.forEach(celd => {
        row.innerHTML += `<td>${celd} </td>
        `
        });
      
    ctbl.appendChild(row);

  });
}
cargarDatos("solicitud", "ctabla");




// Ejecuta el código solo cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Obtén los datos del usuario desde el localStorage
  const usuarioActual = JSON.parse(localStorage.getItem("currentUser") || "{}");
  if (!usuarioActual || !usuarioActual.numeroCuenta || !usuarioActual.nombre) {
    console.error("Datos del usuario incompletos o no encontrados");
    return; // Termina la ejecución si faltan datos del usuario
  }

  // Asigna valores por defecto en caso de que falten datos
  const cuenta = usuarioActual?.numeroCuenta || "Sin cuenta";
  const nombre = usuarioActual?.nombre || "Sin nombre";

  // Genera la fecha actual en formato "YYYY-MM-DD" compatible con campos type="date"
  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toISOString().split("T")[0]; // Obtiene solo la parte de la fecha

  // Asigna los valores a los campos correspondientes
  const ncuenta = document.getElementById("ncuenta");
  if (ncuenta) ncuenta.value = cuenta;

  const nombreInput = document.getElementById("nombre");
  if (nombreInput) nombreInput.value = nombre;

  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    fechaInput.value = fechaFormateada; // Usa el formato compatible
    console.log("Fecha asignada correctamente:", fechaFormateada);
  } else {
    console.error("El elemento con id 'fecha' no existe en el DOM.");
  }

  // Muestra los valores en consola
  console.log("Nombre:", nombre, "Cuenta:", cuenta, "Fecha:", fechaFormateada);
});


// Ejecuta el código solo cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona los elementos de "Monto" y "Meses"
  const montoInput = document.getElementById("monto");
  const mesesInput = document.getElementById("meses");

  // Variables para almacenar los valores
  let monto = 0;
  let meses = 0;

  // Escucha los cambios en el campo "Monto"
  montoInput.addEventListener("input", (event) => {
    monto = parseFloat(event.target.value) || 0; // Convierte a número o 0 si está vacío
    console.log("Monto ingresado:", monto);
  });

  // Escucha los cambios en el campo "Meses"
  mesesInput.addEventListener("input", (event) => {
    meses = parseInt(event.target.value, 10) || 0; // Convierte a número entero o 0 si está vacío
    console.log("Meses ingresados:", meses);
  });
});





document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form.caja");

  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita que el formulario se envíe de forma predeterminada

    // Obtén los valores del formulario
    const numeroCuenta = document.getElementById("ncuenta").value;
    const nombre = document.getElementById("nombre").value;
    const monto = parseFloat(document.getElementById("monto").value) || 0;
    const meses = parseInt(document.getElementById("meses").value, 10) || 0;
    const fecha = document.getElementById("fecha").value;
    const estado = "Pendiente";

    // Crea un objeto con los datos
    const data = [
      numeroCuenta,
      nombre,
      monto,
      meses,
      fecha,
      estado,
  ];

    console.log("Datos a enviar:", data);

    const urlAppScript = "https://script.google.com/macros/s/AKfycby_4ZcW_4FmXCqbMC_5PMZdN6xVIykeDJaQ_XI4XlRKk3NWfmChT8gtwERg0aL9_kzG/exec";


    try {
      // Envía los datos a la hoja de Google Sheets
      const response = await fetch(urlAppScript, {
        method: "POST",
        redirect:"follow",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          "datos": data,
          "hoja": "solicitud"
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Formulario enviado con éxito ✅");
        formulario.reset(); // Limpia el formulario
      } else {
        alert("Hubo un problema al enviar el formulario ❌");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al conectar con el servidor ❌");
    }
  });
});
