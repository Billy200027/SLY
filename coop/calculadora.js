// Lógica del menú lateral
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

// Lógica de la calculadora
const formCalculadora = document.getElementById("form-calculadora");
const interesField = document.getElementById("interes");
const totalPagarField = document.getElementById("total-pagar");
const cuotaMensualField = document.getElementById("cuota-mensual");

formCalculadora.addEventListener("submit", (e) => {
  e.preventDefault();

  const monto = parseFloat(document.getElementById("monto").value);
  const meses = parseInt(document.getElementById("meses").value);

  if (!isNaN(monto) && !isNaN(meses) && meses > 0 && monto >= 50 && monto <= 1000 && meses <= 12) {
    // Calcula el interés
    const interes = monto * 0.03 * meses;

    // Calcula el total a pagar
    const totalPagar = monto + interes;

    // Calcula la cuota mensual
    const cuotaMensual = totalPagar / meses;

    // Muestra los resultados
    interesField.value = interes.toFixed(2);
    totalPagarField.value = totalPagar.toFixed(2);
    cuotaMensualField.value = cuotaMensual.toFixed(2);
  } else {
    alert("Por favor, ingresa valores válidos: \n- Monto entre $50 y $1000. \n- Meses entre 1 y 12.");
  }
});
