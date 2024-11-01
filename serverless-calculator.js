function serverlessCalculator() {
  var totalField = document.querySelector('[serverless-calc="estimate-total"]');
  if (totalField) {
    totalField.setAttribute('readonly', 'true');
  }

  // Initialize variables
  var avg_mbs_write = 0;
  var avg_mbs_read = 0;
  var retention = 0;
  var partitions = 0;
  var estimate = "$0.00";

  // Function to calculate the estimate
  function calculate() {
    var cost = (
      (((0.1 * avg_mbs_write) / 1e3) * 2592e6) +
      (((0.1 * avg_mbs_write) / 1e3) * 3600 * retention * 1e3) +
      (((0.1 * avg_mbs_read) / 1e3) * 2592e6) +
      (0.003 * partitions * 72e4)
    ) / 1e3;

    estimate = '$' + cost.toFixed(2);
    if (totalField) {
      totalField.value = estimate;
    }
  }

  // General function to sync input and slider values, with min/max validation
  function synchronizePair(selector, updateFunction) {
    var slider = document.querySelector(`[serverless-calc="${selector}_slider"]`);
    var input = document.querySelector(`[serverless-calc="${selector}"]`);

    if (slider && input) {
      slider.addEventListener('input', function (e) {
        var value = parseFloat(e.target.value) || 0;
        input.value = value;
        updateFunction(value);
        calculate();
      });

      input.addEventListener('input', function (e) {
        var value = parseFloat(e.target.value) || 0;

        // Get min and max values from the input element
        var min = parseFloat(input.getAttribute('min')) || 0;
        var max = parseFloat(input.getAttribute('max')) || Infinity;

        // Enforce min and max constraints
        if (value < min) value = min;
        if (value > max) value = max;

        input.value = value; // Update the input value if it was outside range
        slider.value = value; // Ensure slider is synced to this value
        updateFunction(value);
        calculate();
      });
    }
  }

  // Synchronize all input-slider pairs
  synchronizePair('avg_mbs_write', function (value) { avg_mbs_write = value; });
  synchronizePair('avg_mbs_read', function (value) { avg_mbs_read = value; });
  synchronizePair('retention', function (value) { retention = value; });
  synchronizePair('partitions', function (value) { partitions = value; });

  // Event listeners for small and large usage buttons
  document.querySelector('[serverless-calc="smallUsage"]')?.addEventListener('click', function (e) {
    e.preventDefault();
    setUsage(0.1, 0.3, 24, 30);
  });

  document.querySelector('[serverless-calc="largeUsage"]')?.addEventListener('click', function (e) {
    e.preventDefault();
    setUsage(0.5, 1.5, 12, 50);
  });

  // Function to set usage values and update sliders and inputs
  function setUsage(newAvgMbsWrite, newAvgMbsRead, newRetention, newPartitions) {
    avg_mbs_write = newAvgMbsWrite;
    avg_mbs_read = newAvgMbsRead;
    retention = newRetention;
    partitions = newPartitions;

    ['avg_mbs_write', 'avg_mbs_read', 'retention', 'partitions'].forEach(function (selector) {
      var slider = document.querySelector(`[serverless-calc="${selector}_slider"]`);
      var input = document.querySelector(`[serverless-calc="${selector}"]`);
      var value = eval(selector); // Dynamically fetches the variable

      if (slider && input) {
        slider.value = value;
        input.value = value;
      }
    });

    calculate();
  }

  // Initial calculation
  calculate();
}

serverlessCalculator();

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

tippyInit();
