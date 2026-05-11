(function () {
  let initialized = false;

  function initReveals() {
    const reveals = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-title, .reveal-zoom, .reveal-fx"
    );

    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible", "is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    reveals.forEach((el) => observer.observe(el));
  }

  document.addEventListener("event:data:ready", () => {
    if (initialized) return;
    initialized = true;
    initReveals();
  });
})();
