const DEPOSITOS_URL =
  "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=depositos";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyNAA3zGSu5RmgNH2hDU-Q-vUPPtW8ONP4LaB65qI9szarjjM9u0guOMjMhw9OkxZ4H/exec";

// Obtener datos del usuario desde localStorage
const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));

// -------------------- FUNCIONES -------------------- //

// Cargar CSV como array
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
  } catch (error) {
    console.error("Error al cargar CSV:", error);
    return [];
  }
}

// Cargar y mostrar depósitos filtrados por cuenta
async function cargarDepositos() {
  const datos = await cargarCSV(DEPOSITOS_URL);
  const tbody = document.querySelector("#tabla-depositos tbody");

  if (!tbody || datos.length <= 1) return;

  tbody.innerHTML = "";

  const nCuentaUsuario = usuarioActual?.numeroCuenta;

  datos.slice(1).forEach(([nCuenta, nombre, monto, fecha, descripcion]) => {
    if (!nCuenta || (nCuentaUsuario && nCuenta !== nCuentaUsuario)) return;

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${nCuenta}</td>
      <td>${nombre}</td>
      <td>${monto || ""}</td>
      <td>${fecha || ""}</td>
      <td>${descripcion || ""}</td>
    `;
    tbody.appendChild(fila);
  });
}

// Enviar formulario a Google Apps Script
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
    console.error("Error al enviar el formulario:", err);
    alert("Ocurrió un error. Inténtalo nuevamente.");
  }
}

// -------------------- EVENTOS -------------------- //

// Tabla de depósitos
if (document.getElementById("tabla-depositos")) {
  cargarDepositos();
}

// Botones del menú lateral
document.getElementById("menu-btn")?.addEventListener("click", () => {
  document.getElementById("sidebar")?.classList.add("active");
});

document.getElementById("close-btn")?.addEventListener("click", () => {
  document.getElementById("sidebar")?.classList.remove("active");
});

// Pestañas Depositar/Retirar
const tabs = document.querySelectorAll(".tabs button");
const depositForm = document.getElementById("deposit-form");
const withdrawForm = document.getElementById("withdraw-form");

tabs.forEach((btn) =>
  btn.addEventListener("click", () => {
    tabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const mostrarDepositar = btn.dataset.tab === "depositar";
    depositForm.style.display = mostrarDepositar ? "flex" : "none";
    withdrawForm.style.display = mostrarDepositar ? "none" : "flex";
  })
);

// Envío de formularios
document.getElementById("deposit-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarFormulario(e.target, SCRIPT_URL);
});

document.getElementById("withdraw-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  enviarFormulario(e.target, SCRIPT_URL);
});
