/**
 * Inject shared navigation and footer HTML.
 * The fragments are requested relative to the GitHub Pages site root.
 */
async function includePart(elementId, path) {
  // Always revalidate shared fragments so navigation edits appear promptly.
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Unable to load " + path + ": HTTP " + response.status);
  }

  document.getElementById(elementId).innerHTML = await response.text();
}

// Load both fragments, then set the current copyright year.
Promise.all([
  includePart("site-header", "header.html"),
  includePart("site-footer", "footer.html")
])
  .then(() => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  })
  .catch((error) => {
    console.error("Unable to load shared layout:", error);
  });
