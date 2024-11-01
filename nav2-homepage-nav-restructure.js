// Check if the current page is the homepage of any hostname
if (window.location.pathname === "/" || window.location.pathname === "") {
  // Define the elements
  const parentContainer = document.querySelector('[nav2="parent-container"]');
  const primaryNav = document.querySelector('[nav2="primary-nav"]');
  const secondaryNav = document.querySelector('[nav2="secondary-nav"]');
  const homepageHeader = document.querySelector('[nav2="homepage-header"]');

  if (parentContainer && primaryNav && homepageHeader) {
    // Store original styles for restoration
    const originalParentBgColor = window.getComputedStyle(parentContainer).backgroundColor;
    const originalParentBorderBottom = window.getComputedStyle(parentContainer).borderBottom;
    const originalPrimaryNavBgColor = window.getComputedStyle(primaryNav).backgroundColor;
    const originalSecondaryNavBgColor = secondaryNav ? window.getComputedStyle(secondaryNav)
      .backgroundColor : null;

    function updateStyles() {
      const primaryNavHeight = primaryNav.offsetHeight;
      const secondaryNavHeight = secondaryNav ? secondaryNav.offsetHeight : 0;
      const totalNavHeight = primaryNavHeight + secondaryNavHeight;
      const adjustedNavHeight = primaryNavHeight - 8; // Adjusted height for y-position check

      console.log("Primary nav height:", primaryNavHeight);
      console.log("Secondary nav height:", secondaryNavHeight);
      console.log("Total nav height:", totalNavHeight);
      console.log("Adjusted nav height (primaryNavHeight - 8px):", adjustedNavHeight);

      // Apply negative margin-top and padding-top based on totalNavHeight for homepageHeader
      homepageHeader.style.marginTop = `-${totalNavHeight}px`;
      homepageHeader.style.paddingTop = `${totalNavHeight}px`;

      // Check the current scroll position
      const currentScroll = window.scrollY;
      console.log("Current scroll position:", currentScroll);

      if (currentScroll <= adjustedNavHeight) {
        console.log("Scroll is less than or equal to adjusted nav height");
        parentContainer.style.backgroundColor = "transparent";
        parentContainer.style.borderBottom = "transparent";
        primaryNav.style.backgroundColor = "transparent";
        if (secondaryNav) {
          secondaryNav.style.backgroundColor = "transparent";
        }
      } else {
        console.log("Scroll is greater than adjusted nav height");
        parentContainer.style.backgroundColor = originalParentBgColor;
        parentContainer.style.borderBottom = originalParentBorderBottom;
        primaryNav.style.backgroundColor = originalPrimaryNavBgColor;
        if (secondaryNav) {
          secondaryNav.style.backgroundColor = originalSecondaryNavBgColor;
        }
      }
    }

    // Run the updateStyles function on page load and window resize
    updateStyles();
    window.addEventListener("resize", updateStyles);

    // Listen for scroll events
    window.addEventListener("scroll", function () {
      console.log("Scroll event triggered");
      updateStyles();
    });
  } else {
    console.error("One or more elements could not be found. Please check the selectors.");
  }
}
