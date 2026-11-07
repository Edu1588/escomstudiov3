document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("page-content");

  // Delegación para todos los enlaces internos
  document.body.addEventListener("click", async (e) => {
    const link = e.target.closest("a.ajax--link");

    if (!link) return;

    const url = link.getAttribute("href");
    const isInternal =
      url &&
      !url.startsWith("http") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("#");

    if (!isInternal) return;

    e.preventDefault(); // evitamos navegación normal

    // fade--out
    container.classList.add("fade--out");

    // esperamos la duración del fade
    await new Promise((r) => setTimeout(r, 400));

    // cargamos la siguiente página
    const res = await fetch(url);
    const text = await res.text();

    // parseamos el HTML y extraemos #page-content
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const newContent = doc.getElementById("page-content");

    // reemplazamos el contenido
    container.innerHTML = newContent.innerHTML;

    // fade--in
    container.classList.remove("fade--out");

    // actualizar URL
    history.pushState({}, "", url);
  });

  // soportar navegación del navegador (atrás/adelante)
  window.addEventListener("popstate", async () => {
    const res = await fetch(window.location.href);
    const text = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const newContent = doc.getElementById("page-content");

    container.innerHTML = newContent.innerHTML;
  });
});
