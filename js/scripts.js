document.addEventListener("DOMContentLoaded", () => {
  // Cuenta regresiva
  $(".countdown").downCount({
    date: "09/20/2025 12:00:00",
    offset: +0,
  });

  // Scroll suave a secciones
  function scrollToId(selector) {
    $(selector + '[href*="#"]').on("click", function (e) {
      e.preventDefault();
      $("html, body").animate(
        { scrollTop: $($(this).attr("href")).offset().top },
        500,
        "linear"
      );
    });
  }
  scrollToId(".header__menu-link");
  scrollToId(".rvsp-btn");

  // Botón "to top"
  const btnToTop = $(".to-top");
  $(window).scroll(() => {
    $(window).scrollTop() > 300 ? btnToTop.fadeIn() : btnToTop.fadeOut();
  });
  btnToTop.on("click", (e) => {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, 300);
  });

  // Menú móvil
  const openBtn = $(".mobile-menu-btn"),
    closeBtn = $(".mobile-menu__close"),
    menu = $(".mobile-menu"),
    navList = $(".mobile-navigation__list");

  openBtn.on("click", (e) => {
    e.preventDefault();
    menu.fadeIn(300);
  });
  closeBtn.on("click", (e) => {
    e.preventDefault();
    menu.fadeOut(300);
  });
  $(document).keypress((e) => {
    if (e.which === 27) menu.fadeOut(300);
  });
  navList.on("click", (e) => {
    if (e.target.tagName === "A") {
      menu.fadeOut(300);
      setTimeout(scrollToId(".mobile-navigation__link"), 500);
    }
  });

  // Dropdown personalizado
  const openDropdownBtn = $(".select--clicked");
  const dropdownMenu = $(".select-dropdown");
  const label = $(".select__label");
  const selectedSpan = $(".dropdown__select");

  selectedSpan.on("click", function () {
    label.css({ position: "absolute", lineHeight: "16px" });
    $(".selected__item").html($(this).text());
  });

  openDropdownBtn.on("click", function (e) {
    e.stopPropagation();
    dropdownMenu.slideToggle(200);
  });

  $(document).on("click", function (e) {
    if (
      !dropdownMenu.is(e.target) &&
      dropdownMenu.has(e.target).length === 0 &&
      !openDropdownBtn.is(e.target)
    ) {
      dropdownMenu.slideUp(200);
    }
  });

  // Fancybox
  $(".fancy").fancybox({ hideOnContentClick: true });

  // Swiper
  new Swiper(".photos__swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
      renderFraction: (currentClass, totalClass) =>
        `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`,
    },
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 32 },
      1024: { slidesPerView: 3, spaceBetween: 32 },
      1440: { slidesPerView: 4, spaceBetween: 32 },
    },
  });

  // Cargar CSV solo una vez
  fetch("invitados.csv")
    .then((res) => res.text())
    .then((csvText) => {
      const lines = csvText.trim().split("\n");
      const dropdown = document.getElementById("invitadoSelect");
      const selectedItem = document.getElementById("gfamiliarr");
      const infoGrupo = document.getElementById("infoGrupo");

      lines.forEach((line) => {
        const values = line.split(",").map((v) => v.trim());
        const grupo = values[0];
        const invitados = values.slice(1);

        if (grupo) {
          const span = document.createElement("span");
          span.classList.add("dropdown-item");
          span.textContent = grupo;
          span.addEventListener("click", () => {
            selectedItem.textContent = grupo;
            selectedItem.dataset.nombre = grupo;
            const total = invitados.filter(Boolean).length + 1;
            infoGrupo.innerHTML = `<p class="grupo-info"><strong>${total}</strong> invitado${total > 1 ? "s" : ""}.</p>`;
          });
          dropdown.appendChild(span);
        }
      });
    });

  // Envío del formulario principal
  document.querySelector(".rvsp__form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("name").value;
    const gfamiliar = document.getElementById("gfamiliarr").dataset.nombre || "";
    const comentario = document.getElementById("textarea comments").value;
    const dieta = document.getElementById("dieta")?.value || "";

    if (!gfamiliar) {
      alert("Por favor, seleccioná tu grupo familiar.");
      return;
    }

    fetch(
      "https://script.google.com/macros/s/AKfycbxV87lQHEPcodHPhRGh0Ff4b9yTP-lbbYxbCSec8es9jmP6wCHSiaSBA5ODXQWnv5KEBA/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ nombre, gfamiliar, dieta, comentario }),
      }
    )
      .then((res) => res.text())
      .then((text) => {
        if (text === "OK") {
          alert("¡Gracias por confirmar! Nos hace muy felices 😍");
          e.target.reset();
          document.getElementById("gfamiliarr").textContent = "";
          delete document.getElementById("gfamiliarr").dataset.nombre;
          document.getElementById("infoGrupo").innerHTML = "";
        } else {
          alert("Algo falló 😢. Por favor, intentá de nuevo más tarde.");
        }
      })
      .catch(() =>
        alert("Ocurrió un error inesperado 😓. Reintentá en un ratito.")
      );
  });
});
