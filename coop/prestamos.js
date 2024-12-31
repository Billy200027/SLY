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
  cargarDatos("Prestamos", "ctabla");
  
  
  
  
  
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
  