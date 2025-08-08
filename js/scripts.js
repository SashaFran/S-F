$(document).ready(function () {
  //Coundown
  $(".countdown").downCount({
    date: "09/20/2025 12:00:00",
    offset: +0,
  });
  // Scroll to ID
  function scrollToId(str) {
    $(str + '[href*="#"]').on("click", function (e) {
      e.preventDefault();

      $("html, body").animate(
        {
          scrollTop: $($(this).attr("href")).offset().top,
        },
        500,
        "linear",
      );
    });
  }

  //Scroll to ID init
  scrollToId(".header__menu-link");
  scrollToId(".rvsp-btn");

  //To top

  (function scrollTop() {
    const btn = $(".to-top");

    $(window).scroll(function () {
      if ($(window).scrollTop() > 300) {
        btn.fadeIn();
      } else {
        btn.fadeOut();
      }
    });

    btn.on("click", function (e) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: 0 }, "300");
    });
  })();

  //Mobile menu
  (function mobileMenu() {
    const openBtn = $(".mobile-menu-btn"),
      closeBtn = $(".mobile-menu__close"),
      menu = $(".mobile-menu"),
      navList = $(".mobile-navigation__list");

    openBtn.on("click", function (e) {
      e.preventDefault();
      menu.fadeIn(300);
    });

    closeBtn.on("click", function (e) {
      e.preventDefault();
      menu.fadeOut(300);
    });

    $(document).keypress(function (e) {
      if (e.which == 27) menu.fadeOut(300);
    });

    navList.on("click", function (e) {
      let target = e.target;

      if (target.tagName === "A") {
        menu.fadeOut(300);
        setTimeout(scrollToId(".mobile-navigation__link"), 500);
      }
    });
  })();

  //Dropdown
  (function selectDropdown() {
  const openBtn = $(".select--clicked");
  const dropdown = $(".select-dropdown");
  const label = $(".select__label");
  const span = $(".dropdown__select");

  span.on("click", function () {
    if ($(window).width() <= 1000) {
      label.animate({
        position: "absolute",
        lightHeight: "16px",
      });
    } else {
      label.animate({
        position: "absolute",
        lightHeight: "16px",
      });
    }

    $(".selected__item").html($(this).text());
  });

  openBtn.on("click", function (e) {
    e.stopPropagation(); // Para que el click en el botón no se propague al document
    dropdown.slideToggle(200);
  });

  // Aquí viene el cierre mágico cuando clickeas afuera
  $(document).on("click", function (e) {
    // Si el click no está dentro del dropdown ni el botón, lo cerramos
    if (
      !dropdown.is(e.target) &&
      dropdown.has(e.target).length === 0 &&
      !openBtn.is(e.target)
    ) {
      if (dropdown.is(":visible")) {
        dropdown.slideUp(200);
      }
    }
  });
})();

  //Fancybox
  $(".fancy").fancybox({
    hideOnContentClick: true,
  });

  //Photo slider
  var swiper = new Swiper(".photos__swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    centeredSlides: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
      renderFraction: function (currentClass, totalClass) {
        return `<span class="${currentClass}"></span> / <span class="${totalClass}"></span>`;
      },
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
      1440: {
        slidesPerView: 4,
        spaceBetween: 32,
      },
    },
  });

  //Init map
  (function initeMap() {
    let ceremonyMap, receptionMap;

    $(".styleswitch").on("click", function () {
      $(".map").empty();
      init();
    });

    ymaps.ready(init);

    function init() {
      //Switch map icon
      let defaultIcon =
        "img/map/icon--" +
        $('head link[id="skins"]').attr("data-color") +
        ".svg";
      console.log(defaultIcon);

      //Ceremony address map
      ceremonyMap = new ymaps.Map(
        "address__map--ceremony",
        {
          center: [-37.325597080268956, -59.164689168275],
          zoom: 15,
          controls: [],
        },
        {
          searchControlProvider: "yandex#search",
          lang: "es_ES",
        },
      );

      ((MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>',
      )),
        (myPlacemark = new ymaps.Placemark(
          ceremonyMap.getCenter(),
          {
            hintContent: "Mark",
            balloonContent: "Mark",
          },
          {
            iconLayout: "default#image",
            iconImageHref: defaultIcon,
            iconImageSize: [63, 83],
          },
        )));

      ceremonyMap.panes.get("ground").getElement().style.filter =
        "grayscale(100%)";

      ceremonyMap.geoObjects.add(myPlacemark);

      //END ceremony address map

      //Reception address map
      receptionMap = new ymaps.Map(
        "address__map--reception",
        {
          center: [40.760873, -73.976398],
          zoom: 17,
          controls: [],
          lang: "es_ES",
        },
        {
          searchControlProvider: "yandex#search",
        },
      );

      ((MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>',
      )),
        (myPlacemark = new ymaps.Placemark(
          receptionMap.getCenter(),
          {
            hintContent: "Mark",
            balloonContent: "Mark",
          },
          {
            iconLayout: "default#image",
            iconImageHref: defaultIcon,
            iconImageSize: [63, 83],
          },
        )),
        (receptionMap.panes.get("ground").getElement().style.filter =
          "grayscale(80%)"));

      receptionMap.geoObjects.add(myPlacemark);

      //END reception address map
    }
  })();
});

// Envío del formulario con campos nuevos

document.addEventListener("DOMContentLoaded", () => {
  fetch("invitados.csv")
    .then((response) => response.text())
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
            selectedItem.dataset.nombre = grupo; // guardamos el valor real
            const total = invitados.filter(Boolean).length + 1; // sumamos al grupo principal
            if (infoGrupo) {
              infoGrupo.innerHTML = `<p class="grupo-info"><strong>${total}</strong> invitado${total > 1 ? "s" : ""}.</p>`;
            }
          });
          dropdown.appendChild(span);
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar el CSV:", error);
    });
});

// Envío del formulario con campos nuevos

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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: new URLSearchParams({
        nombre,
        gfamiliar,
        dieta,
        comentario,
      }),
    },
  )
    .then((response) => response.text())
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
    .catch((err) => {
      console.error("Error al enviar:", err);
      alert("Ocurrió un error inesperado 😓. Reintentá en un ratito.");
    });
});


const offcanvas = document.getElementById("offcanvasDarkNavbar");

offcanvas.addEventListener("show.bs.offcanvas", () => {
  document.body.classList.add("offcanvas-open");
});

offcanvas.addEventListener("hidden.bs.offcanvas", () => {
  document.body.classList.remove("offcanvas-open");
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
