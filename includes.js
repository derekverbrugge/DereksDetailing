/**
 * Load reusable header and footer fragments.
 * index.html includes a static header fallback, so navigation never depends on fetch.
 */
async function includePart(id, path) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const markup = await response.text();

    // Only replace a working fallback with a valid, expected fragment.
    const template = document.createElement("template");
    template.innerHTML = markup;
    const expected = id === "site-header" ? "header nav .navlinks" : "footer";
    if (!template.content.querySelector(expected)) {
      throw new Error("Invalid " + path + " markup");
    }
    target.replaceChildren(template.content.cloneNode(true));
  } catch (error) {
    console.warn("Keeping existing layout; could not load " + path, error);
  }
}

// Independent requests: failure of one fragment never prevents the other.
void includePart("site-header", "header.html");
void includePart("site-footer", "footer.html").then(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
