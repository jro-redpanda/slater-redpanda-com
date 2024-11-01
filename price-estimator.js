console.log("Starting price estimator...");

// Initialize tooltips using Tippy.js
loadTippy();

// Function to load Tippy and Popper scripts for tooltips
function loadTippy() {
  console.log("Loading tippy.js and popper.js for tooltips...");

  function loadPopperScript(callback) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@popperjs/core@2';
    script.onload = callback;
    document.head.appendChild(script);
    console.log("Loading Popper.js...");
  }

  function loadTippyScript(callback) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/tippy.js@6';
    script.onload = callback;
    document.head.appendChild(script);
    console.log("Loading Tippy.js...");
  }

  function initializeTippy() {
    setTimeout(() => {
      tippy('[data-tippy-content]', { theme: '' });
      console.log("Tippy tooltips initialized.");
    }, 2000);
  }

  loadPopperScript(() => {
    loadTippyScript(initializeTippy);
  });
}

// Price Estimator functionality
function priceEstimator() {
  console.log("Initializing price estimator...");

  // Form element selectors
  const primaryContainer = document.querySelector('[calculator="primary-container"]');
  const serverlessContainer = document.querySelector('[calculator="serverless-container"]');
  const leadForm = document.querySelector('[calculator="lead-form"]');
  const availabilityContainer = document.querySelector(
    '[calculator="availability-container"]');
  const elementsToHide = document.querySelectorAll('[calculator-not-serverless="true"]');

  // Serverless form element selectors
  const serverlessIngressRangeInput = document.querySelector(
    '[serverless-calculator="avg_mbs_write-slider"]');
  const serverlessIngressNumberInput = document.querySelector(
    '[serverless-calculator="avg_mbs_write"]');
  const serverlessEgressRangeInput = document.querySelector(
    '[serverless-calculator="avg_mbs_read-slider"]');
  const serverlessEgressNumberInput = document.querySelector(
    '[serverless-calculator="avg_mbs_read"]');
  const serverlessRetentionRangeInput = document.querySelector(
    '[serverless-calculator="retention-slider"]');
  const serverlessRetentionNumberInput = document.querySelector(
    '[serverless-calculator="retention"]');
  const serverlessPartitionRangeInput = document.querySelector(
    '[serverless-calculator="partitions-slider"]');
  const serverlessPartitionNumberInput = document.querySelector(
    '[serverless-calculator="partitions"]');
  const serverlessRegionSelect = document.querySelector('[serverless-calculator="region"]');
  const serverlessEstimate = document.querySelector('[serverless-calculator="estimate"]');

  // Non-serverless form elements
  const deploymentTypeSelect = document.querySelector('[calculator="deploymentType"]');
  const cloudProviderSelect = document.querySelector('[calculator="cloudProviderType"]');
  const regionSelect = document.querySelector('[calculator="region"]');
  const availabilitySelect = document.querySelector('[calculator="availability"]');
  const ingressRangeInput = document.querySelector('[calculator="avgIngress-slider"]');
  const ingressNumberInput = document.querySelector('[calculator="avgIngress"]');
  const egressRangeInput = document.querySelector('[calculator="avgEgress-slider"]');
  const egressNumberInput = document.querySelector('[calculator="avgEgress"]');
  const retentionRangeInput = document.querySelector('[calculator="retention-slider"]');
  const retentionNumberInput = document.querySelector('[calculator="retention"]');
  const partitionRangeInput = document.querySelector('[calculator="partition-slider"]');
  const partitionNumberInput = document.querySelector('[calculator="partition"]');

  const dontKnowIngress = document.querySelector('[calculator="dontKnow_avgIngress"]');
  const dontKnowEgress = document.querySelector('[calculator="dontKnow_avgEgress"]');
  const dontKnowRetention = document.querySelector('[calculator="dontKnow_retention"]');
  const dontKnowPartition = document.querySelector('[calculator="dontKnow_partition"]');

  // Debugging: Check for missing elements
  console.log('Checking element selections:');
  console.log('Ingress slider: ', ingressRangeInput);
  console.log('Ingress input: ', ingressNumberInput);
  console.log('Egress slider: ', egressRangeInput);
  console.log('Egress input: ', egressNumberInput);
  console.log('Retention slider: ', retentionRangeInput);
  console.log('Retention input: ', retentionNumberInput);
  console.log('Partition slider: ', partitionRangeInput);
  console.log('Partition input: ', partitionNumberInput);

  if (!deploymentTypeSelect) {
    console.error("Deployment type select element not found!");
    return;
  }

  // Object to store form state
  const formState = {
    deploymentType: 'redpanda-serverless', // Default to serverless
    cloudProviderType: 'aws',
    cloudRegionGeo: 'North America',
    availability: 'single-az',
    avgIngress: 0,
    avgEgress: 0,
    retention: 0,
    partition: 0,
    region: 'us-east-1', // Default to 'us-east-1'
    isServerless: true, // Default to true for serverless
    estimate: "$0.00",
    dontKnow_avgIngress: false,
    dontKnow_avgEgress: false,
    dontKnow_retention: false,
    dontKnow_partition: false,
  };

  // Preselect region for serverless
  if (serverlessRegionSelect) {
    document.querySelector('[serverless-calculator="region"][value="us-east-1"]').checked =
      true;
  }

  // Function to check HubSpot form existence by ID
  function getHubspotForm() {
    return document.getElementById("hsForm_d99f4450-5a19-42a3-a3bb-3b8990b54ddc");
  }

  // Function to ensure form is loaded
  function waitForHubspotFormLoad(callback) {
    const formCheckInterval = setInterval(function () {
      const form = getHubspotForm();
      if (form) {
        clearInterval(formCheckInterval);
        console.log("HubSpot form loaded.");
        callback();
      }
    }, 100); // Check every 100 milliseconds
  }

  // Function to populate HubSpot form
  function populateHubspotForm() {
    const form = getHubspotForm();
    if (!form) {
      console.warn(
        "HubSpot form with ID 'hsForm_d99f4450-5a19-42a3-a3bb-3b8990b54ddc' not found.");
      return;
    }

    const dontKnow = "I don't know";

    const deploymentTypeField = form.querySelector('input[name="deployment_type"]');
    const cloudProviderField = form.querySelector('input[name="cloud_provider_rp"]');
    const cloudRegionField = form.querySelector('input[name="cloud_region_geo_rp"]');
    const availabilityField = form.querySelector('input[name="availability_rp"]');
    const avgIngressField = form.querySelector('input[name="avg_ingress_rp"]');
    const avgEgressField = form.querySelector('input[name="avg_egress_rp"]');
    const retentionField = form.querySelector('input[name="retention_rp"]');
    const partitionField = form.querySelector('input[name="partition_count_rp"]');

    if (deploymentTypeField) deploymentTypeField.value = formState.deploymentType;
    if (cloudProviderField) cloudProviderField.value = formState.cloudProviderType;
    if (cloudRegionField) cloudRegionField.value = formState.cloudRegionGeo;
    if (availabilityField) availabilityField.value = formState.availability;
    if (avgIngressField) avgIngressField.value = (formState.dontKnow_avgIngress) ? dontKnow :
      formState.avgIngress;
    if (avgEgressField) avgEgressField.value = (formState.dontKnow_avgEgress) ? dontKnow :
      formState.avgEgress;
    if (retentionField) retentionField.value = (formState.dontKnow_retention) ? dontKnow :
      formState.retention;
    if (partitionField) partitionField.value = (formState.dontKnow_partition) ? dontKnow :
      formState.partition;

    // Trigger change events for all inputs
    [deploymentTypeField, cloudProviderField, cloudRegionField, availabilityField,
      avgIngressField, avgEgressField, retentionField, partitionField
    ]
    .forEach(field => {
      if (field) {
        const event = new Event('change', { bubbles: true });
        field.dispatchEvent(event);
      }
    });

    console.log("HubSpot form populated with formState values.");
  }

  // Function to set all sliders' initial values to 0
  function initializeSliders() {
    const sliderElements = document.querySelectorAll('[calculator*="-slider"]');
    sliderElements.forEach(slider => {
      slider.value = 0;
      const relatedNumberInput = document.querySelector(
        `[calculator="${slider.getAttribute('calculator').replace('-slider', '')}"]`);
      if (relatedNumberInput) {
        relatedNumberInput.value = 0;
      }
      console.log(`${slider.getAttribute('calculator')} initialized to 0`);
    });

    // Serverless sliders
    const serverlessSliderElements = document.querySelectorAll(
      '[serverless-calculator*="-slider"]');
    serverlessSliderElements.forEach(slider => {
      slider.value = 0;
      const relatedServerlessNumberInput = document.querySelector(
        `[serverless-calculator="${slider.getAttribute('serverless-calculator').replace('-slider', '')}"]`
      );
      if (relatedServerlessNumberInput) {
        relatedServerlessNumberInput.value = 0;
      }
      console.log(`${slider.getAttribute('serverless-calculator')} initialized to 0`);
    });
  }

  // Call this function on page load to initialize all sliders to 0
  initializeSliders();

  // Function to sync range and number inputs
  function syncRangeAndNumber(rangeInput, numberInput, field, dontKnowCheckbox) {
    if (!rangeInput || !numberInput) {
      console.error(`Range or number input for ${field} not found!`);
      return;
    }
    console.log(`Syncing range and number inputs for: ${field}`);
    rangeInput.addEventListener("input", function () {
      numberInput.value = rangeInput.value;
      formState[field] = parseFloat(rangeInput.value);
      if (dontKnowCheckbox) dontKnowCheckbox.checked = false;
      calculateEstimate();
      populateHubspotForm();
    });
    numberInput.addEventListener("input", function () {
      rangeInput.value = numberInput.value;
      formState[field] = parseFloat(numberInput.value);
      if (dontKnowCheckbox) dontKnowCheckbox.checked = false;
      calculateEstimate();
      populateHubspotForm();
    });
  }

  // Function to handle "Don't Know" checkbox behavior
  function handleDontKnowClick(checkbox, rangeInput, numberInput, field) {
    checkbox.addEventListener('change', function () {
      if (checkbox.checked) {
        rangeInput.value = 0;
        numberInput.value = 0;
        formState[`dontKnow_${field}`] = true;
      } else {
        formState[`dontKnow_${field}`] = false;
      }
      calculateEstimate();
      populateHubspotForm();
    });
  }

  // Synchronize the range and number inputs, and uncheck the associated "Don't Know" checkbox on change for non-serverless
  syncRangeAndNumber(ingressRangeInput, ingressNumberInput, "avgIngress", dontKnowIngress);
  syncRangeAndNumber(egressRangeInput, egressNumberInput, "avgEgress", dontKnowEgress);
  syncRangeAndNumber(retentionRangeInput, retentionNumberInput, "retention",
    dontKnowRetention);
  syncRangeAndNumber(partitionRangeInput, partitionNumberInput, "partition",
    dontKnowPartition);

  // Add functionality for the "Don't Know" checkboxes
  handleDontKnowClick(dontKnowIngress, ingressRangeInput, ingressNumberInput, "avgIngress");
  handleDontKnowClick(dontKnowEgress, egressRangeInput, egressNumberInput, "avgEgress");
  handleDontKnowClick(dontKnowRetention, retentionRangeInput, retentionNumberInput,
    "retention");
  handleDontKnowClick(dontKnowPartition, partitionRangeInput, partitionNumberInput,
    "partition");

  // Synchronize the range and number inputs for serverless
  syncRangeAndNumber(serverlessIngressRangeInput, serverlessIngressNumberInput,
    "avgIngress", {});
  syncRangeAndNumber(serverlessEgressRangeInput, serverlessEgressNumberInput,
    "avgEgress", {});
  syncRangeAndNumber(serverlessRetentionRangeInput, serverlessRetentionNumberInput,
    "retention", {});
  syncRangeAndNumber(serverlessPartitionRangeInput, serverlessPartitionNumberInput,
    "partition", {});

  // Function to set usage for small/large examples
  function setUsage(avgWrite, avgRead, retention, partitions) {
    formState.avgIngress = avgWrite;
    formState.avgEgress = avgRead;
    formState.retention = retention;
    formState.partition = partitions;

    serverlessIngressRangeInput.value = avgWrite;
    serverlessIngressNumberInput.value = avgWrite;
    serverlessEgressRangeInput.value = avgRead;
    serverlessEgressNumberInput.value = avgRead;
    serverlessRetentionRangeInput.value = retention;
    serverlessRetentionNumberInput.value = retention;
    serverlessPartitionRangeInput.value = partitions;
    serverlessPartitionNumberInput.value = partitions;

    calculateEstimate();
    populateHubspotForm();
  }

  // Small usage preset
  document.querySelector('[serverless-calculator="serverless-smallUsage"]').addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      setUsage(0.1, 0.3, 24, 30);
    });

  // Large usage preset
  document.querySelector('[serverless-calculator="serverless-largeUsage"]').addEventListener(
    'click',
    function (event) {
      event.preventDefault();
      setUsage(0.5, 1.5, 12, 50);
    });

  // Calculation for the serverless pricing
  function calculateEstimate() {
    const avgWrite = formState.avgIngress;
    const avgRead = formState.avgEgress;
    const retention = formState.retention;
    const partitions = formState.partition;

    const ingressCost = (avgWrite / 1000) * 2592000 * 0.1;
    const retentionCost = (avgWrite / 1000) * 3600 * retention * 0.1;
    const egressCost = (avgRead / 1000) * 2592000 * 0.1;
    const partitionCost = partitions * 0.003 * 720;

    const totalCost = ingressCost + retentionCost + egressCost + partitionCost;

    formState.estimate = '$' + totalCost.toFixed(2);
    document.querySelector('[serverless-calculator="estimate"]').value = formState.estimate;
    console.log("Estimated cost:", formState.estimate);
  }

  // Function to hide or show elements based on isServerless
  function hideElementsForServerless(isServerless) {
    elementsToHide.forEach(element => {
      element.style.display = isServerless ? 'none' : 'block';
    });
    console.log(isServerless ? "Hiding elements for serverless." :
      "Showing elements for non-serverless.");
  }

  // Handle deployment type changes and toggle visibility for non-serverless elements
  function handleDeploymentTypeChange() {
    formState.deploymentType = deploymentTypeSelect.value;

    if (formState.deploymentType === 'redpanda-serverless') {
      serverlessContainer.style.display = 'block';
      leadForm.style.display = 'none';
      formState.isServerless = true;
      console.log("Serverless deployment selected.");
      hideElementsForServerless(true);
    } else {
      serverlessContainer.style.display = 'none';
      leadForm.style.display = 'block';
      formState.isServerless = false;
      console.log("Non-serverless deployment selected: " + formState.deploymentType);
      hideElementsForServerless(false);
    }

    formState.showAvailability = ['redpanda-cloud', 'byoc'].includes(formState
      .deploymentType);
    availabilityContainer.style.display = formState.showAvailability ? 'block' : 'none';

    populateHubspotForm();
  }

  // Add event listener for deployment type changes
  deploymentTypeSelect.addEventListener('change', handleDeploymentTypeChange);

  // Trigger initial state on page load
  handleDeploymentTypeChange();
}

// Initialize the price estimator
priceEstimator();

// Ensure HubSpot form is loaded before populating it
waitForHubspotFormLoad(function () {
  populateHubspotForm(); // Ensure form is populated after it fully loads
});
