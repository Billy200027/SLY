const depositosURL = "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=depositos";

// Función para cargar datos del CSV
async function cargarCSV(url) {
    const response = await fetch(url);
    const data = await response.text();
    return data.split("\n").map((row) => row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim()));
}

// Obtén los datos del usuario desde localStorage
const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));



// Función para cargar la tabla de depósitos con filtro dinámico
async function cargarDepositos() {
    const datos = await cargarCSV(depositosURL);

    const tbody = document.querySelector("#tabla-depositos tbody");
    const nombresUnicos = new Set();

    tbody.innerHTML = "";

    // Si el usuario está logueado, filtramos los depósitos por su número de cuenta
    const numeroCuentaUsuario = usuarioActual ? usuarioActual.numeroCuenta : null;

    datos.slice(1).forEach(([nCuenta, Nombre, Monto, fecha, descripción]) => {
        if (nCuenta && (!numeroCuentaUsuario || nCuenta === numeroCuentaUsuario)) {  // Filtramos por el número de cuenta
            nombresUnicos.add(nCuenta); // Guardar nombres únicos para el filtro

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${nCuenta}</td>
                <td>${Nombre}</td>
                <td>${Monto || ""}</td>
                <td>${fecha || ""}</td>
                <td>${descripción}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Inicialización de la tabla correspondiente
if (document.getElementById("tabla-depositos")) {
    cargarDepositos();
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
