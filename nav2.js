console.log("Nav2 Loaded");

// Utility function to debounce events
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

// Handle Alerts Based on Path
function handleAlertsBasedOnPath() {
  const currentPagePath = window.location.pathname;
  const listItems = document.querySelectorAll('[role="listitem"]');

  listItems.forEach((listItem) => {
    const pathDefinitionsElement = listItem.querySelector('[nav-announce-paths="definitions"]');

    if (!pathDefinitionsElement) return;

    const definitionsText = pathDefinitionsElement.textContent.trim();
    const includePaths = definitionsText.match(/includePaths:\s*["']([^"']+)["']/)?.[1]?.split(
      ',').map(path => path.trim()) || [];
    const excludePaths = definitionsText.match(/excludePaths:\s*["']([^"']+)["']/)?.[1]?.split(
      ',').map(path => path.trim()) || [];

    const foundInInclude = includePaths.some(path => currentPagePath === path);
    const foundInExclude = excludePaths.some(path => currentPagePath === path);

    if (foundInInclude) {
      return;
    } else if (foundInExclude) {
      listItem.remove();
    }
  });
}

// Rotate Announcement Items
function rotateAnnouncements() {
  const activeClass = 'active';
  let currentIndex = 0;

  // Retrieve all announcement items and filter only visible ones
  let announcementItems = Array.from(document.querySelectorAll('.nav2_announce_item'))
    .filter(item => item.offsetParent !== null);

  // If only one announcement item exists, display it and exit
  if (announcementItems.length === 1) {
    announcementItems[0].classList.add(activeClass);
    return;
  }

  // Proceed with rotation if there are multiple items
  if (announcementItems.length <= 1) return;

  const totalItems = announcementItems.length;
  const displayDuration = 7000;
  const fadeDuration = 1000;

  announcementItems[currentIndex].classList.add(activeClass);

  function showNextItem() {
    announcementItems[currentIndex].classList.remove(activeClass);
    currentIndex = (currentIndex + 1) % totalItems;
    announcementItems[currentIndex].classList.add(activeClass);
  }

  setInterval(showNextItem, displayDuration + fadeDuration);
}

// Initialize Announcement Bar Script
function initializeAnnouncementBarScript() {
  const navButton = document.querySelector('.nav2 .w-nav-button');

  if (!navButton) {
    console.log('Nav button not found.');
    return;
  }

  console.log('Nav button found. Running script.');

  const toggleBodyScroll = () => {
    document.body.style.overflow = navButton.classList.contains('w--open') ? 'hidden' : '';
  };

  const observer = new MutationObserver(toggleBodyScroll);
  observer.observe(navButton, { attributes: true, attributeFilter: ['class'] });

  toggleBodyScroll();

  window.addEventListener('beforeunload', () => observer.disconnect());
}

// Handle Navigation Position on Scroll
function initializeNavPositionScript() {
  const parentContainer = document.querySelector('[nav2="parent-container"]');
  const primaryNav = document.querySelector('[nav2="primary-nav"]');

  if (!parentContainer || !primaryNav) {
    console.log('Parent container or primary nav not found.');
    return;
  }

  let isFixed = false;
  let parentContainerTop = parentContainer.offsetTop;

  const calculateOffset = () => {
    const parentContainerHeight = parentContainer.offsetHeight;
    const primaryNavHeight = primaryNav.offsetHeight;
    return -(parentContainerHeight - primaryNavHeight);
  };

  const onScroll = () => {
    const scrollY = window.scrollY;
    const primaryNavTop = primaryNav.getBoundingClientRect().top;
    const offsetWhenFixed = calculateOffset();

    if (!isFixed && primaryNavTop <= 0) {
      isFixed = true;
      parentContainer.style.position = "fixed";
      parentContainer.style.top = `${offsetWhenFixed}px`;
      parentContainer.style.zIndex = "9999";
    } else if (isFixed && scrollY < Math.abs(offsetWhenFixed)) {
      isFixed = false;
      parentContainer.style.position = "";
      parentContainer.style.top = "";
      parentContainer.style.zIndex = "";
    }
  };

  window.addEventListener("scroll", onScroll);
  window.addEventListener("resize", () => {
    parentContainerTop = parentContainer.offsetTop;
    calculateOffset();
    onScroll();
  });
}

// Expose functions to the window object
window.handleAlertsBasedOnPath = handleAlertsBasedOnPath;
window.rotateAnnouncements = rotateAnnouncements;
window.initializeAnnouncementBarScript = initializeAnnouncementBarScript;
window.initializeNavPositionScript = initializeNavPositionScript;

// Initialize all scripts
handleAlertsBasedOnPath();
rotateAnnouncements();
initializeAnnouncementBarScript();
initializeNavPositionScript();
