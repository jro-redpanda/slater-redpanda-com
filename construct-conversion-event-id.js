// Loads as unique sitewide script not dynamic smart script

console.log("Construct-Conversion-Event-ID.js started");

// Check if formConversionAttributes is already defined, and only declare if not
if (typeof window.formConversionAttributes === 'undefined') {
  window.formConversionAttributes = {}; // Declare it as a global object
}

// Helper function to convert string to CamelCase and remove non-alphanumeric characters
function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr
      .toUpperCase()) // Convert to CamelCase after non-alphanumeric characters
    .replace(/[^a-zA-Z0-9]/g, ''); // Remove remaining non-alphanumeric characters
}

// Function to inject the current page URL into forms with the input "form_submission_page_url"
function injectCurrentPageUrlIntoForms() {
  const currentPageUrl = window.location.href;

  // Select all input fields with name "form_submission_page_url" across all forms
  const urlInputFields = document.querySelectorAll('input[name="form_submission_page_url"]');

  // Set the value of each input field to the current page URL
  urlInputFields.forEach(inputField => {
    inputField.value = currentPageUrl;
  });
}

// Function to construct the value for the input fields based on the conversion event ID
function constructConversionEventId(conversionEventId) {
  // Make sure formConversionAttributes for the specific conversionEventId exists
  const formAttributes = window.formConversionAttributes[conversionEventId];
  if (!formAttributes) {
    return null; // Return null if formAttributes don't exist
  }

  // Get the values from the formAttributes object and apply CamelCase conversion
  const tier = formAttributes.tier || "";
  const eventName = toCamelCase(formAttributes.eventName || "");
  const productService = toCamelCase(formAttributes.productService || "");
  const deploymentType = toCamelCase(formAttributes.deploymentType || "");
  const cloudProvider = toCamelCase(formAttributes.cloudProvider || "");

  // Construct the value based on the provided format
  const constructedEventId =
    `tier${tier}-${eventName}${productService}${deploymentType}${cloudProvider}-form`;
  console.log("ConstructedEventId: " + constructedEventId);

  // Find all input fields (both hidden and visible) within this specific form and set their values
  const formElement = document.querySelector(
    `form[data-conversion-event-id="${conversionEventId}"]`
  );
  if (!formElement) {
    return constructedEventId; // Return constructedEventId even if no form
  }

  const inputFields = formElement.querySelectorAll('input[name="contact_conversion_event_id"]');
  inputFields.forEach(inputField => {
    inputField.value = constructedEventId;
  });

  // Inject the current page URL into any input field named "form_submission_page_url"
  injectCurrentPageUrlIntoForms();

  return constructedEventId;
}

// Function to push event to GTM data layer with constructedEventId
function triggerAnalyticEvent(constructedEventId) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'hubspotFormSubmit',
    'conversionEventId': constructedEventId
  });

  console.log('Analytic Event Pushed - Constructed Event ID:', constructedEventId);
}

function triggerAnalytics2(email, firstName, lastName, companyName, constructedEventId) {
  // Check if Heap is available
  if (typeof heap !== 'undefined') {
    try {
      // Identify user in Heap
      heap.identify(email);
      console.log('Heap Identify Called:', email);

      // Add user properties to Heap
      heap.addUserProperties({
        Name: `${firstName} ${lastName}`,
        Company: companyName
      });
      console.log('Heap Add User Properties Called:', {
        Name: `${firstName} ${lastName}`,
        Company: companyName
      });

      // Clear previous event properties and add new ones
      heap.clearEventProperties();
      console.log('Heap Clear Event Properties Called');

      // Track a custom event with properties
      heap.track('Form Submission', {
        conversionEventId: constructedEventId,
        Name: `${firstName} ${lastName}`,
        Company: companyName,
        Email: email
      });
      console.log('Heap Track Event Called:', { conversionEventId: constructedEventId });
    } catch (error) {
      console.error('Error with Heap API:', error);
    }
  } else {
    console.warn('Heap is not available.');
  }

  // Push event to GTM data layer
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'hubspotFormSubmit',
    'conversionEventId': constructedEventId
  });

  console.log('Analytic Event Pushed - Constructed Event ID:', constructedEventId);
}

// Function to trigger a VWO event with a dynamic event name
function triggerVWOEvent(conversionEventId, vwoEventName) {
  const formAttributes = window.formConversionAttributes[conversionEventId];
  if (!formAttributes) {
    return;
  }

  // Ensure VWO is defined
  window.VWO = window.VWO || [];
  VWO.event = VWO.event || function () {
    VWO.push(["event"].concat([].slice.call(arguments)));
  };

  // Create the payload in the correct format and apply CamelCase conversion where necessary
  const vwoPayload = {
    cloudProvider: toCamelCase(formAttributes.cloudProvider || ""),
    deploymentType: toCamelCase(formAttributes.deploymentType || ""),
    eventName: toCamelCase(formAttributes.eventName || ""),
    productService: toCamelCase(formAttributes.productService || ""),
    tier: typeof formAttributes.tier === 'number' ? formAttributes.tier : 0
  };

  // Send events to VWO with the correct structure
  VWO.event(vwoEventName, vwoPayload);

  // VWO Goal for Tier-1 Submissions
  if (vwoPayload.tier === 1) {
    window.VWO = window.VWO || [];
    window.VWO.push(['track.goalConversion', 5]);
  }

  // Inject the current page URL into any input field named "form_submission_page_url"
  injectCurrentPageUrlIntoForms();
}

// Ensure that the form URL field is updated when forms are loaded or when a conversion event happens
document.addEventListener('DOMContentLoaded', () => {
  injectCurrentPageUrlIntoForms();
});
