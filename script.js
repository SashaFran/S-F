const offcanvas = document.getElementById("offcanvasDarkNavbar");

offcanvas.addEventListener("show.bs.offcanvas", () => {
  document.body.classList.add("offcanvas-open");
});

offcanvas.addEventListener("hidden.bs.offcanvas", () => {
  document.body.classList.remove("offcanvas-open");
});

// Cuenta regresiva hasta la ceremonia
const targetDate = new Date("2025-09-20T10:30:00-03:00");

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.getElementById("countdown").textContent = "¡Ya llegó el gran día!";
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  document.getElementById("countdown").textContent = `${d}d ${h}h ${m}m ${s}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 🎶 Música suave al fondo
window.addEventListener("DOMContentLoaded", () => {
  const audio = new Audio("musica-boda.mp3");
  audio.loop = true;
  audio.volume = 0.3;
  setTimeout(() => {
    audio
      .play()
      .catch(() => console.log("Autoplay bloqueado por el navegador"));
  }, 2000);
});

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.nombre, data.comentario, new Date()]);
  return ContentService.createTextOutput("OK").setMimeType(
    ContentService.MimeType.TEXT,
  );
}

fetch("invitados.csv")
  .then((response) => response.text())
  .then((text) => {
    const lines = text.trim().split("\n").slice(1);
    const select = document.getElementById("guest");
    select.innerHTML = '<option value="">Seleccioná un grupo familiar</option>';
    lines.forEach((nombre) => {
      const option = document.createElement("option");
      option.value = nombre.trim();
      option.textContent = nombre.trim();
      select.appendChild(option);
    });
  });

// Enviar formulario sin recargar
document.getElementById("rsvp-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nombre = document.getElementById("guest").value;
  const comentario = document.getElementById("comments").value;

  if (!nombre) {
    alert("Por favor, seleccioná un grupo familiar.");
    return;
  }

  fetch(
    "https://script.google.com/macros/s/AKfycbzaH5dP_vKzazWHLjXsH8G3k6vBNtM8Sdi-jC4DYoTfaYnfdDMpR4KcZj7MNtK2-HfpXQ/exec",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        nombre,
        comentario,
      }),
    },
  )
    .then((response) => response.text())
    .then((text) => {
      if (text === "OK") {
        alert("¡Gracias por confirmar! Nos hace muy felices 😍");
        e.target.reset();
      } else {
        alert("Algo falló 😢. Por favor, intentá de nuevo más tarde.");
      }
    })
    .catch((err) => {
      console.error("Error al enviar:", err);
      alert("Ocurrió un error inesperado 😓. Reintentá en un ratito.");
    });
});
