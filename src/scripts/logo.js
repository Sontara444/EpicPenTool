export function addToolbarLogo(toolbarId, logoSrc) {
  const toolbar = document.getElementById(toolbarId);
  if (!toolbar) return;

  const logo = document.createElement("div");
  logo.classList.add("toolbar-logo");
  logo.innerHTML = `
    <img src="${logoSrc}" alt="Logo" style="width: 30px; height: 30px; margin: 4px auto; display: block;" />
  `;

  toolbar.insertBefore(logo, toolbar.firstChild);
}
