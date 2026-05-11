fetch("./assets/js/evento.json")
  .then((res) => res.json())
  .then((data) => {
    /* ================= 🔧 HELPERS ================= */

    const isEnabled = (obj) => obj?.enabled !== false;

    const removeSection = (id) => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };

    /* ================= META ================= */

    if (data.meta?.title) document.title = data.meta.title;
    if (data.meta?.lang) document.documentElement.lang = data.meta.lang;

    if (data.meta?.favicon) {
      let link =
        document.querySelector("link[rel='icon']") ||
        document.createElement("link");
      link.rel = "icon";
      link.href = `assets/img/${data.meta.favicon}`;
      document.head.appendChild(link);
    }

    /* ================= LOGO ================= */

    const logoEl = document.querySelector(".logo");
    if (logoEl && data.logo?.type === "text") {
      logoEl.textContent = data.logo.value;
    }

    /* ================= AUDIO ================= */

    const audio = document.getElementById("bgSong");
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = document.getElementById("musicIcon");

    if (audio && isEnabled(data.audio)) {
      audio.src = `assets/audio/${data.audio.src}`;
      audio.loop = data.audio.loop ?? true;
      audio.volume = data.audio.volume ?? 1;

      if (musicIcon && data.audio.icons?.play) {
        musicIcon.src = `assets/img/${data.audio.icons.play}`;
      }

      if (musicToggle && musicIcon) {
        musicToggle.addEventListener("click", () => {
          if (audio.paused) {
            audio.play().catch(() => { });
            musicIcon.src = `assets/img/${data.audio.icons.pause}`;
          } else {
            audio.pause();
            musicIcon.src = `assets/img/${data.audio.icons.play}`;
          }
        });
      }
    }

    /* ================= NAVBAR ================= */

    const navMenu = document.getElementById("navMenu");

    if (navMenu && isEnabled(data.navbar)) {
      navMenu.innerHTML = "";

      data.navbar.items.forEach((item) => {
        if (!item.href || !item.label) return;

        const targetId = item.href.replace("#", "");
        if (data[targetId]?.enabled === false) return;

        navMenu.insertAdjacentHTML(
          "beforeend",
          `<li><a href="${item.href}">${item.label}</a></li>`
        );
      });
    }

    /* ================= HERO ================= */

    if (isEnabled(data.hero)) {
      const hero = data.hero;

      document.getElementById(
        "hero-names"
      ).textContent = `${hero.names.novia} & ${hero.names.novio}`;

      document.querySelector(
        ".hero-bg"
      ).style.backgroundImage = `url('assets/img/${hero.background}')`;

      const labels = hero.countdown_labels;
      if (labels) {
        document.getElementById("label-dias").textContent = labels.dias;
        document.getElementById("label-horas").textContent = labels.horas;
        document.getElementById("label-minutos").textContent = labels.minutos;
        document.getElementById("label-segundos").textContent = labels.segundos;
      }
    } else {
      removeSection("inicio");
    }

    /* ================= PRESENTACIÓN ================= */

    if (isEnabled(data.presentacion)) {
      const p = data.presentacion;
      const padrinosEl = document.getElementById("padrinos");
      const labelPadrinosEl = document.getElementById("label-padrinos");

      document.getElementById("titulo-presentacion").textContent = p.titulo;
      document.getElementById("nombres-presentacion").textContent = p.nombres;
      document.getElementById("frase-presentacion").textContent = p.frase;

      document.getElementById("padres-novia").innerHTML =
        p.padres?.novia?.join("<br>") || "";
      document.getElementById("padres-novio").innerHTML =
        p.padres?.novio?.join("<br>") || "";
      document.getElementById("label-padres-novia").textContent =
        p.labels?.padres_novia || "";
      document.getElementById("label-padres-novio").textContent =
        p.labels?.padres_novio || "";


      if (Array.isArray(p.padrinos) && p.padrinos.length > 0) {
        padrinosEl.innerHTML = p.padrinos.join("<br>");
        labelPadrinosEl.textContent = p.labels?.padrinos || "Padrinos";
      } else {
        padrinosEl?.remove();
        labelPadrinosEl?.remove();
      }

      document.getElementById("texto-final-presentacion").textContent =
        p.texto_final || "";

      const img = document.querySelector(".arco-img img");
      if (img && p.imagen) img.src = `assets/img/${p.imagen}`;
    } else {
      removeSection("presentacion");
    }
/* ================= UBICACIÓN ================= */

if (isEnabled(data.ubicacion)) {
  const u = data.ubicacion;

  document.getElementById("ubicacion-titulo").textContent = u.titulo;

  /* ===== FECHA GENERAL ===== */

  const fechaEl = document.getElementById("ubicacion-fecha-general");

  if (fechaEl && data.hero?.fecha_boda) {
    const fecha = new Date(data.hero.fecha_boda);

    fechaEl.textContent = fecha.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  /* ===== LISTA ===== */

  const lista = document.getElementById("ubicacion-lista");
  lista.innerHTML = "";

  u.lugares
    .filter((l) => isEnabled(l) && l.lugar && l.hora)
    .forEach((lugar) => {
      lista.insertAdjacentHTML(
        "beforeend",
        `
        <div class="ubicacion-card reveal">
          <h3 class="ubicacion-subtitle">${lugar.tipo}</h3>

          <div class="ubicacion-hora">
            ${lugar.hora}
          </div>

          <div class="ubicacion-lugar">
            ${lugar.lugar}
          </div>

          ${
            lugar.direccion?.length
              ? `
              <div class="ubicacion-direccion">
                ${lugar.direccion.join("<br>")}
              </div>
            `
              : ""
          }

          ${
            lugar.mapa
              ? `
              <a href="${lugar.mapa}" target="_blank" class="btn-ubicacion">
                Ver ubicación
              </a>
            `
              : ""
          }
        </div>
      `
      );
    });

} else {
  removeSection("ubicacion");
}

    /* ================= PROGRAMA ================= */

    if (isEnabled(data.programa)) {
      const programa = data.programa;
      document.getElementById("programa-titulo").textContent = programa.titulo;

      const timeline = document.getElementById("timeline-programa");
      timeline.innerHTML = "";

      programa.items.forEach((item) => {
        timeline.insertAdjacentHTML(
          "beforeend",
          `
          <div class="item ${item.lado} reveal">
            <img class="icon" src="assets/img/${item.icono}">
            <div class="hora">${item.hora}</div>
            <div class="texto">${item.texto}</div>
          </div>
        `
        );
      });
    } else {
      removeSection("programa");
    }

    /* ================= VESTIMENTA ================= */

    if (isEnabled(data.vestimenta)) {
      const v = data.vestimenta;
      document.getElementById("vestimenta-titulo").textContent = v.titulo;
      document.getElementById("vestimenta-icon").src = `assets/img/${v.icono}`;
      document.getElementById("vestimenta-formal").textContent = v.formal;
      document.getElementById("vestimenta-mujeres").innerHTML = v.mujeres;
      document.getElementById("vestimenta-hombres").innerHTML = v.hombres;
    } else {
      removeSection("vestimenta");
    }

    /* ================= REGALOS ================= */

    if (isEnabled(data.regalos)) {
      const r = data.regalos;
      document.getElementById("regalos-titulo").textContent = r.titulo;
      document.querySelector(".regalos-desc").innerHTML = r.descripcion;

      const cont = document.getElementById("regalos-inner");
      cont.innerHTML = "";

      r.items.forEach((item) => {
        cont.insertAdjacentHTML(
          "beforeend",
          `
          <div class="regalo-item reveal-zoom">
            <img src="assets/img/${item.icono}" class="regalo-icon">
            <p class="regalo-label">${item.label}</p>
          </div>
        `
        );
      });
    } else {
      removeSection("regalos");
    }

    /* ================= GALERÍA ================= */

    if (isEnabled(data.galeria)) {
      const g = data.galeria;
      document.getElementById("galeria-titulo").textContent = g.titulo;

      const track = document.getElementById("carousel-track");
      track.innerHTML = "";

      g.imagenes.forEach((img) => {
        track.insertAdjacentHTML(
          "beforeend",
          `<img src="assets/img/${img}" class="carousel-img">`
        );
      });
    } else {
      removeSection("galeria");
    }

    /* ================= RSVP ================= */

    if (isEnabled(data.rsvp)) {
      const rsvp = data.rsvp;
      const form = document.getElementById("rsvp-form");

      if (form) {
        form.querySelector(".arco-title").textContent = rsvp.titulo || "";
        form.querySelector(".rsvp-text").innerHTML = rsvp.texto || "";
        form.querySelector(".rsvp-note").innerHTML = rsvp.nota || "";
        form.querySelector(".rsvp-btn.yes").textContent =
          rsvp.botones?.si || "";
        form.querySelector(".rsvp-btn.no").textContent = rsvp.botones?.no || "";
      }

      const passLabel = document.getElementById("rsvpPassLabel");
      const passValue = document.getElementById("rsvpPassValue");
      const tableLabel = document.getElementById("rsvpTableLabel");
      const tableValue = document.getElementById("rsvpTableValue");

      /* ===== PASE ===== */
      if (rsvp.pase?.enabled !== false && passLabel && passValue) {
        passLabel.textContent = rsvp.pase.label || "Pase para";
        passValue.textContent = `${rsvp.pase.cantidad} personas`;
      } else {
        passLabel?.closest(".rsvp-pass-item")?.remove();
      }

      /* ===== MESA ===== */
      if (rsvp.mesa?.enabled !== false && tableLabel && tableValue) {
        tableLabel.textContent = rsvp.mesa.label || "Mesa asignada";
        tableValue.textContent = `Mesa ${rsvp.mesa.numero}`;
      } else {
        tableLabel?.closest(".rsvp-pass-item")?.remove();
      }
      /* ===== LIMPIAR CONTENEDOR VACÍO ===== */
      const passInfo = document.querySelector(".rsvp-pass-info");

      if (passInfo && !rsvp.pase?.enabled && !rsvp.mesa?.enabled) {
        passInfo.remove();
      }
    } else {
      removeSection("rsvp");
    }

    /* ================= FOOTER ================= */

    if (data.footer?.enabled !== false) {
      const footer = document.getElementById("footer-text");
      if (footer && data.footer?.text) {
        footer.innerHTML = data.footer.text;
      }
    }

    /* ================= EDITORIAL TEXTS ================= */

    applyEditorialTexts(data.editorial);

    /* ================= GLOBAL ================= */

    window.__EVENT_DATA__ = data;
    document.dispatchEvent(new Event("event:data:ready"));
  })
  .catch((err) => {
    console.error("Error cargando evento.json:", err);
  });

/* ================= EDITORIAL ENGINE ================= */

function applyEditorialTexts(editorial) {
  if (!editorial) return;

  document.querySelectorAll("[data-editorial]").forEach((el) => {
    const key = el.dataset.editorial;
    const cfg = editorial[key];

    if (!cfg || !cfg.enabled || !cfg.text) {
      el.remove();
      return;
    }

    el.textContent = cfg.text;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
  });
}
