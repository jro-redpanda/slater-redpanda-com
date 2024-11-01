initCTAs();

function initCTAs() {
  const rteBlog = document.querySelector('.rte-blog');
  if (!rteBlog) return;

  // Find all elements in .rte-blog that contain '[CTA_MODULE]'
  const ctaModules = [];
  const elements = rteBlog.querySelectorAll('*');
  elements.forEach(function (element) {
    if (element.children.length === 0 && element.textContent.includes('[CTA_MODULE]')) {
      ctaModules.push(element);
    }
  });

  const ctas = document.querySelectorAll(
    '.blog-cta'); // Assuming .blog-cta elements exist in the DOM

  console.log(ctaModules, ctas);

  ctaModules.forEach(function (item, i) {
    // If no CTAs assigned, then simply remove the [CTA_MODULE]s
    if (ctas.length === 0) {
      item.remove();
      return;
    }
    // If only one CTA defined, then replace all [CTA_MODULE]s with the only CTA
    if (ctas.length === 1) {
      item.insertAdjacentHTML('afterend', ctas[0].outerHTML);
      item.remove();
      return;
    }
    // If multiple CTAs, replace each [CTA_MODULE] with corresponding CTA
    if (ctas[i] !== undefined) {
      item.insertAdjacentHTML('afterend', ctas[i].outerHTML);
    }
    item.remove();
  });
}
