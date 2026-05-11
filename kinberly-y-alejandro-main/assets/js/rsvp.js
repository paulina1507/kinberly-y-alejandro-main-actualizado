(function () {
  let initialized = false;

  function initRSVP() {
    if (initialized) return;
    initialized = true;

    const formBox = document.getElementById("rsvp-form");
    const finalBox = document.getElementById("rsvp-final");
    const section = document.getElementById("rsvp");

    if (!formBox || !finalBox || !section) return;

    const btnYes = formBox.querySelector(".rsvp-btn.yes");
    const btnNo = formBox.querySelector(".rsvp-btn.no");

    const guestNameInput = document.getElementById("rsvpGuestName");
    const guestMessageInput = document.getElementById("rsvpGuestMessage");

    const titleEl = document.getElementById("rsvp-final-title");
    const textEl = document.getElementById("rsvp-final-text");
    const namesEl = document.getElementById("rsvp-names");

    const passInfo = section.querySelector(".rsvp-pass-info");
    const passLabel = section.querySelector("#rsvpPassLabel");
    const passValue = section.querySelector("#rsvpPassValue");
    const tableLabel = section.querySelector("#rsvpTableLabel");
    const tableValue = section.querySelector("#rsvpTableValue");

    const data = window.__EVENT_DATA__;
    if (!data?.rsvp?.final) return;

    const whatsappNumber = data.rsvp.whatsapp || "521XXXXXXXXXX";

    function sendRSVP(statusText) {
      const guestName = guestNameInput.value.trim();
      const guestMessage = guestMessageInput.value.trim();

      if (!guestName) {
        alert("Por favor escribe tu nombre.");
        guestNameInput.focus();
        return;
      }

      let message = `Hola, soy ${guestName}.%0A%0A`;
      message += `Confirmación de asistencia:%0A${statusText}%0A%0A`;

      if (data.rsvp.pase?.enabled && data.rsvp.pase?.cantidad) {
        message += `Pase: ${data.rsvp.pase.cantidad} personas%0A`;
      }

      if (data.rsvp.mesa?.enabled && data.rsvp.mesa?.numero) {
        message += `Mesa asignada: Mesa ${data.rsvp.mesa.numero}%0A`;
      }

      if (guestMessage) {
        message += `%0AMensaje:%0A${guestMessage}`;
      }

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      window.open(whatsappUrl, "_blank");

      showFinal(statusText);
    }

    function showFinal(statusText) {
      formBox.classList.add("hidden");
      section.classList.add("completed");

      const isAttending = statusText === "Sí, asistiremos";

      if (isAttending) {
        titleEl.textContent = data.rsvp.final.titulo || "¡Gracias por confirmar!";
        textEl.innerHTML = data.rsvp.final.texto || "";
      } else {
        titleEl.textContent = data.rsvp.final_no?.titulo || "Gracias por avisarnos";
        textEl.innerHTML = data.rsvp.final_no?.texto || "Lamentamos que no puedan acompañarnos, pero agradecemos mucho que nos hayan avisado.";
      }

      namesEl.textContent = data.rsvp.final.firma || "";

      if (passInfo) {
        passInfo.classList.toggle("hidden", !isAttending);
      }

      if (isAttending && data.rsvp.pase?.enabled && data.rsvp.pase?.cantidad && passLabel && passValue) {
        passLabel.textContent = data.rsvp.pase.label || "Pase para";
        passValue.textContent = `${data.rsvp.pase.cantidad} personas`;
      }

      if (isAttending && data.rsvp.mesa?.enabled && data.rsvp.mesa?.numero && tableLabel && tableValue) {
        tableLabel.textContent = data.rsvp.mesa.label || "Mesa asignada";
        tableValue.textContent = `Mesa ${data.rsvp.mesa.numero}`;
      }

      finalBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    btnYes?.addEventListener("click", function () {
      sendRSVP("Sí, asistiremos");
    });

    btnNo?.addEventListener("click", function () {
      sendRSVP("No podremos asistir");
    });
  }

  document.addEventListener("event:data:ready", initRSVP);

  if (window.__EVENT_DATA__) {
    initRSVP();
  }
})();