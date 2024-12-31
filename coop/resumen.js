// URL del archivo CSV exportado desde Google Sheets
const slyURL = "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=user";

// Función para cargar el archivo CSV desde una URL
async function cargarCSV(url) {
  // Realiza una solicitud HTTP para obtener el contenido del archivo CSV
  const response = await fetch(url); // Espera la respuesta del servidor
  const data = await response.text(); // Obtiene el contenido del archivo como texto

  // Divide el texto del CSV en filas y columnas
  // Cada fila se separa por el salto de línea "\n" y las columnas por comas ","
  return data.split("\n").map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim()));
}

// Función para cargar y mostrar la tabla de resumen
async function cargarResumen() {
  // Carga el contenido del archivo CSV en una variable
  const datos = await cargarCSV(slyURL);

  // Selecciona el cuerpo de la tabla HTML donde se mostrarán los datos
  const tbody = document.querySelector("#tabla-resumen tbody");
  tbody.innerHTML = ""; // Limpia cualquier contenido previo en la tabla

  // Aquí definimos los índices de las columnas que queremos mostrar:
  // - Número de cuenta: columna 0
  // - Nombre: columna 2
  // - Capital: columna 7
  // - Intereses: columna 11
  // - Total: columna 13
  // NOTA: Ajusta estos índices si tu archivo CSV tiene columnas en otra posición.
  const [cuentaIdx, nombreIdx, capitalIdx, interesIdx, totalIdx] = [0, 2, 8, 11, 12];

  // Recorre cada fila del CSV, empezando desde la segunda fila (datos, no encabezados)
  datos.slice(1).forEach((fila) => {
    // Verifica que la fila tenga datos en la columna "Número de cuenta" (para evitar filas vacías)
    if (fila[cuentaIdx]) {
      // Crea una nueva fila (<tr>) para la tabla
      const row = document.createElement("tr");

      // Agrega celdas (<td>) con los valores de las columnas seleccionadas
      row.innerHTML = `
        <td>${fila[cuentaIdx]}</td> <!-- Número de cuenta -->
        <td>${fila[nombreIdx]}</td> <!-- Nombre -->
        <td>${fila[capitalIdx]}</td> <!-- Capital -->
        <td>${fila[interesIdx]}</td> <!-- Intereses -->
        <td>${fila[totalIdx]}</td> <!-- Total -->
      `;

      // Añade la fila creada al cuerpo de la tabla
      tbody.appendChild(row);
    }
  });
}

// Ejecuta la función cargarResumen() cuando la página haya cargado completamente
document.addEventListener("DOMContentLoaded", cargarResumen);



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
