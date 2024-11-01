function tippyInit() {
  createScript('popper', 'https://unpkg.com/@popperjs/core@2', () => {
    createScript('tippy', 'https://unpkg.com/tippy.js@6', () => {
      if (typeof tippy !== 'undefined') {
        tippy('[data-tippy-content]', { theme: '', trigger: 'mouseenter' });
      } else {
        console.error('Tippy.js failed to load.');
      }
    });
  });
}

function createScript(id, src, onLoad) {
  if (document.getElementById(id)) return onLoad();
  const script = document.createElement('script');
  script.src = src;
  script.id = id;
  script.async = true;
  script.onload = onLoad;
  script.onerror = () => console.error(`Failed to load ${src}`);
  document.head.appendChild(script);
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', tippyInit);
