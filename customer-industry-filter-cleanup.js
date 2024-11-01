// Select all items in the industry-specific dropdown list group
const industryDropdownItems = document.querySelectorAll(
  '[filter-dropdown-list="industry"] .filter_dropdown-list-group .w-dyn-item');

// Iterate over each item in the industry dropdown
industryDropdownItems.forEach((filterDropdownItem) => {
  // Retrieve the label text within the filter dropdown item
  const labelElement = filterDropdownItem.querySelector('.w-form-label');
  const labelText = labelElement ? labelElement.textContent.trim() : '';

  // Select all items within the resource grid row
  const resourceGridItems = document.querySelectorAll('.resource-grid_row .w-dyn-item');

  let isMatchFound = false; // Flag to determine if a match is found

  // Iterate over each item in the resource grid row
  resourceGridItems.forEach((resourceGridItem) => {
    // Retrieve the industry text within the resource grid item
    const industryElement = resourceGridItem.querySelector(
      '[fs-cmsfilter-field="industry"]');
    const industryText = industryElement ? industryElement.textContent.trim() : '';

    // Check if industry text matches label text
    if (labelText === industryText) {
      isMatchFound = true; // Set flag to true if match is found
    }
  });

  // If no match was found, remove the filter dropdown item
  if (!isMatchFound) {
    filterDropdownItem.remove();
  }
});
