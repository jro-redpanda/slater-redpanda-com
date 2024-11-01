// Select all form fields (input, select, textarea, checkbox, radio)
const formFields = document.querySelectorAll('input, select, textarea');

// Function to trigger VWO event with formId and inputClicked
function triggerVWOFormEngagementEvent(event) {
  const inputElement = event.target; // The element that was clicked or focused
  const formElement = inputElement.closest('form'); // Find the closest parent <form>

  if (formElement && inputElement) {
    const formId = formElement.id; // Get the form's ID
    const inputName = inputElement.name; // Get the name attribute of the clicked input

    // Debugging logs
    console.log("Input engaged:", inputElement); // Logs the entire input element
    console.log("Form ID:", formId); // Logs the form ID
    console.log("Input name:", inputName); // Logs the name of the input field

    // Trigger VWO event with formId and inputClicked
    window.VWO = window.VWO || [];
    VWO.event = VWO.event || function () {
      VWO.push(["event"].concat([].slice.call(arguments)));
    };

    VWO.event("formInputEngagement", {
      "formId": formId || "unknown", // Use "unknown" if no form ID is found
      "inputClicked": inputName || "unknown" // Use "unknown" if no name is found
    });

    // Additional log for confirming event trigger
    console.log("VWO event triggered with:", {
      "formId": formId || "unknown",
      "inputClicked": inputName || "unknown"
    });
  } else {
    console.warn("No parent form or input element found.");
  }
}

// Add event listeners for focus and click events on each form field
formFields.forEach(field => {
  field.addEventListener('focus', triggerVWOFormEngagementEvent);
  field.addEventListener('click', triggerVWOFormEngagementEvent);
});
