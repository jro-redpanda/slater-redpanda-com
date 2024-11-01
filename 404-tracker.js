// Capture necessary information
const referrer = document.referrer || "Direct";
const currentUrl = window.location.href;
const timestamp = new Date().toISOString();

// Log the data to be sent for debugging
console.log("404 Tracker Debugging:");
console.log("Referrer:", referrer);
console.log("Intended URL:", currentUrl);
console.log("Timestamp:", timestamp);

// Prepare data payload for webhook
const data = {
  referrer: referrer,
  intendedUrl: currentUrl,
  timestamp: timestamp
};

// Log data payload for verification
console.log("Data Payload:", data);

// Send data to Pabbly Connect webhook
fetch(
    "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZjMDYzNTA0MzE1MjZjNTUzMzUxMzEi_pc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  .then(response => {
    console.log("Response Status:", response.status);
    if (!response.ok) throw new Error("Network response was not ok");
    console.log("404 information sent successfully.");
  })
  .catch(error => {
    console.error("Error sending 404 information:", error);
  });
