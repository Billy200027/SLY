// URLs
const DEPOSITOS_URL =
  "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=depositos";
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyNAA3zGSu5RmgNH2hDU-Q-vUPPtW8ONP4LaB65qI9szarjjM9u0guOMjMhw9OkxZ4H/exec";

// Usuario
const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));

// Elementos DOM
const depositForm = document.getElementById("deposit-form");
const withdrawForm = document.getElementById("withdraw-form");
const cuentasContainer = document.getElementById("cuentas-container");

// ---------------- FUNCIONES ---------------- //

async function cargarCSV(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    return text
      .trim()
      .split("\n")
      .map((row) =>
        row.split(",").map((cell) => cell.replace(/['"]+/g, "").trim())
      );
  } catch (err) {
    console.error("Error al cargar CSV:", err);
    return [];
  }
}

async function cargarDepositos() {
  const datos = await cargarCSV(DEPOSITOS_URL);
  const tbody = document.querySelector("#tabla-depositos tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  const nCuentaUsuario = usuarioActual?.numeroCuenta;

  datos.slice(1).forEach(([nCuenta, nombre, monto, fecha, descripcion]) => {
    if (!nCuenta || (nCuentaUsuario && nCuenta !== nCuentaUsuario)) return;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${nCuenta}</td>
      <td>${nombre}</td>
      <td>${monto}</td>
      <td>${fecha}</td>
      <td>${descripcion}</td>
    `;
    tbody.appendChild(row);
  });
}

async function enviarFormulario(formulario, url) {
  const formData = new FormData(formulario);
  const boton = formulario.querySelector("button");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      boton.classList.add("active-submit");
      setTimeout(() => boton.classList.remove("active-submit"), 2000);
      formulario.reset();
    } else {
      alert("Error al enviar el formulario.");
    }
  } catch (err) {
    console.error("Error al enviar:", err);
    alert("Ocurrió un error al enviar.");
  }
}

// ---------------- EVENTOS ---------------- //

// Pestañas
const tabButtons = document.querySelectorAll(".tabs button");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Quitar clase activa de todos
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Mostrar u ocultar secciones
    const tab = btn.dataset.tab;

    depositForm.style.display = tab === "depositar" ? "flex" : "none";
    withdrawForm.style.display = tab === "retirar" ? "flex" : "none";
    cuentasContainer.style.display = tab === "cuentas" ? "grid" : "none";
  });
});

// Menú lateral
document.getElementById("menu-btn")?.addEventListener("click", () => {
  document.getElementById("sidebar")?.classList.add("active");
});

document.getElementById("close-btn")?.addEventListener("click", () => {
  document.getElementById("sidebar")?.classList.remove("active");
});

// Envío formularios
depositForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarFormulario(depositForm, SCRIPT_URL);
});

withdrawForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarFormulario(withdrawForm, SCRIPT_URL);
});

// Cargar depósitos si hay tabla
if (document.querySelector("#tabla-depositos")) {
  cargarDepositos();
}
