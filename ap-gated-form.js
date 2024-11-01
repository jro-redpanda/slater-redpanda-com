// Ensure (window.append2URL = "{webflow-append-to-url-for-gateable-buttons-here}";) is set on the page set via CMS attribute.
// Ensure (window.apUngateFileURL = "URLHERE";) is set on the page

const pagePath = window.location.pathname.split(/[?#]/)[0];

function appendApGateButton() {
  window.addEventListener('load', function () {
    const apGateElements = document.querySelectorAll(
      '[ap-gate="after-ungate"] [ap-gate="ungated-button"]');

    if (append2URL) {
      apGateElements.forEach(function (element) {
        const href = element.getAttribute('href');

        if (href) {
          const url = new URL(href, window.location.href);

          // Check for both redpanda.com and redpanda-data.webflow.io domains
          const validDomains = ["redpanda.com", "redpanda-data.webflow.io"];
          const isValidDomain = validDomains.some(domain =>
            url.href.includes(`${domain}/resources/`) ||
            url.href.includes(`${domain}/events/`) ||
            url.href.includes(`${domain}/lps/`)
          );

          if (isValidDomain) {
            if (!url.search.includes(append2URL)) {
              const querySeparator = url.search ? '&' : '?';
              url.search += querySeparator + append2URL;
              if (element.tagName.toLowerCase() === 'button') {
                element.setAttribute('data-href', url.href);
              } else if (element.tagName.toLowerCase() === 'a') {
                element.setAttribute('href', url.href);
              }
            }
          }
        }
      });
    }
  });
}

function unGate() {
  console.log("unGate was Run");
  const gateStatus = localStorage.getItem("gate_status");
  const urlSearchParams = new URLSearchParams(window.location.search);
  let cookieValue = getGateURLQueryCookie("ungate_url_param");
  if (cookieValue === null) {
    cookieValue = [];
  } else {
    cookieValue = JSON.parse(cookieValue);
  }

  if (gateStatus?.includes(pagePath) || urlSearchParams.toString().includes("unga=tru") ||
    cookieValue.includes(pagePath)) {
    console.log("The Update Styling for UnGate was Ran");

    // First, show all elements with ap-gate="after-ungate"
    const gateableContents = document.querySelectorAll('[ap-gate="after-ungate"]');
    gateableContents.forEach(function (content) {
      content.classList.remove("w-condition-invisible");
      content.style.display = "block"; // Ensure it's displayed
    });

    // Then, hide all elements with ap-gate="before-ungate" even if nested inside after-ungate elements
    const gateFormContainers = document.querySelectorAll('[ap-gate="before-ungate"]');
    gateFormContainers.forEach(function (container) {
      container.style.display = "none"; // Hide all elements that should be hidden
    });

    // Set cookie if needed
    if (!cookieValue.includes(pagePath) && urlSearchParams.toString().includes("unga=tru")) {
      console.log(
        "unGate If no cookieValue for the current page was run to set cookie with page path");
      cookieValue.push(pagePath);
      setGateURLQueryCookie("ungate_url_param", JSON.stringify(cookieValue));
    }

    // Clean up the URL to remove "unga=tru" from the search parameters
    urlSearchParams.delete("unga");
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("unga");
    window.history.replaceState({}, document.title, newUrl.href);
  }
}

function getGateURLQueryCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      console.log("getGateURLQueryCookie ran if statement");
      return JSON.parse(cookie.substring(name.length, cookie.length));
    }
  }
  return null;
}

function setGateURLQueryCookie(cookieName, cookieValue) {
  document.cookie = cookieName + "=" + JSON.stringify(cookieValue) + "; path=/";
  console.log("setGateURLQueryCookie was run with cookieName as: " + cookieName +
    " | and cookieValue as: " + cookieValue + " | and page path");
}

function checkGateLS() {
  console.log("checkGateLS Ran");
  let gateStatus = localStorage.getItem("gate_status");
  if (gateStatus) {
    gateStatus = JSON.parse(gateStatus);
    gateStatus.push(pagePath);
  } else {
    gateStatus = [pagePath];
  }
  localStorage.setItem("gate_status", JSON.stringify(gateStatus));
  unGate();
};

// Check if window.defaultUnlock is defined and is set to "true"
if (typeof window.defaultUnlock !== "undefined" && window.defaultUnlock === "true") {
  checkGateLS();
} else {
  console.log("window.defaultUnlock is not 'true' or is undefined. Running the normal flow.");
}

function handleModalDisplay() {
  // Handle Modal if `[ap-gate-modal="open"]` is clicked
  const triggerElement = document.querySelector('[ap-gate-modal="open"]');
  const modalElement = document.querySelector('.modal_full-screen');

  // Check if the trigger and modal elements exist
  if (triggerElement && modalElement) {
    triggerElement.addEventListener('click', function () {
      modalElement.style.display = 'block';
      modalElement.style.opacity = '1';
    });
  } else {
    console.error("Trigger or modal element not found.");
  }
}

appendApGateButton();
unGate();
handleModalDisplay();
