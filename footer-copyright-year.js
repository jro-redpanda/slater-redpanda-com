function footerCopyright() {
  var footerElement = document.querySelector('[data-year="current"]');
  if (footerElement) {
    footerElement.textContent = new Date().getFullYear();
  }
}
footerCopyright();
