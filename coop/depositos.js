
const depositosURL = "https://docs.google.com/spreadsheets/d/1CUws7OKTZvn0ZMgkR4ba7l1kktACUbz2KRXAjRDfh68/gviz/tq?tqx=out:csv&sheet=depositos";

async function cargarCSV(url) {
  const response = await fetch(url);
  const data = await response.text();
  return data.split("\n").map(row =>
    row.split(",").map(cell => cell.replace(/['"]+/g, "").trim())
  );
}

const usuarioActual = JSON.parse(localStorage.getItem("currentUser"));

async function cargarDepositos() {
  const datos = await cargarCSV(depositosURL);
  const tbody = document.querySelector("#tabla-depositos tbody");
  tbody.innerHTML = "";

  const numeroCuentaUsuario = usuarioActual ? usuarioActual.numeroCuenta : null;

  datos.slice(1).forEach(([nCuenta, Nombre, Monto, fecha, descripción]) => {
    if (nCuenta && (!numeroCuentaUsuario || nCuenta === numeroCuentaUsuario)) {
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

if (document.getElementById("tabla-depositos")) {
  cargarDepositos();
}

const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

menuBtn?.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn?.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

const tabButtons = document.querySelectorAll(".tabs button");
const depositForm = document.getElementById("deposit-form");
const withdrawForm = document.getElementById("withdraw-form");

if (depositForm) depositForm.style.display = "flex";
if (withdrawForm) withdrawForm.style.display = "none";

tabButtons.forEach(button => {
  button.addEventListener("click", () => {
    tabButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    if (button.dataset.tab === "depositar") {
      depositForm.style.display = "flex";
      withdrawForm.style.display = "none";
    } else {
      depositForm.style.display = "none";
      withdrawForm.style.display = "flex";
    }
  });
});

async function enviarFormulario(formulario, urlScript) {
  const formData = new FormData(formulario);
  const button = formulario.querySelector("button");

  try {
    const response = await fetch(urlScript, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      button.classList.add("active-submit");
      setTimeout(() => button.classList.remove("active-submit"), 2000);
      formulario.reset();
    } else {
      alert("Error al enviar el formulario.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error al enviar el formulario.");
  }
}

const scriptURL = "https://script.google.com/macros/s/AKfycbyNAA3zGSu5RmgNH2hDU-Q-vUPPtW8ONP4LaB65qI9szarjjM9u0guOMjMhw9OkxZ4H/exec";

document.getElementById("deposit-form")?.addEventListener("submit", e => {
  e.preventDefault();
  enviarFormulario(e.target, scriptURL);
});

document.getElementById("withdraw-form")?.addEventListener("submit", e => {
  e.preventDefault();
  enviarFormulario(e.target, scriptURL);
});
