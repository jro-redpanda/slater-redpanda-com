// Running Convert tagged Rich-Text Images to Lightboxes
document.querySelectorAll('.w-richtext[rte-image-lightbox="true"]').forEach(container => {
  console.log('Found a container with rte-image-lightbox="true":', container);

  // Find all img elements within the container
  container.querySelectorAll('img').forEach(img => {
    console.log('Found an image:', img);

    img.style.cursor = 'pointer'; // Set cursor to pointer for original image
    img.onclick = () => {
      console.log('Image clicked:', img);

      // Create fullscreen overlay
      const fullscreenDiv = document.createElement('div');
      fullscreenDiv.classList.add('modal_full-screen');
      fullscreenDiv.style.display = 'flex'; // Set display to flex to make it visible
      console.log('Created fullscreen div:', fullscreenDiv);

      // Clone the clicked image and set cursor to auto
      const imgClone = img.cloneNode();
      imgClone.style.cursor = 'auto'; // Ensure cursor is auto for cloned image
      fullscreenDiv.appendChild(imgClone);
      console.log('Appended cloned image:', imgClone);

      // Create and append close button
      const closeButton = document.createElement('button');
      closeButton.classList.add('modal_close-button');
      closeButton.innerHTML = '&times;'; // Close icon
      fullscreenDiv.appendChild(closeButton);
      console.log('Appended close button:', closeButton);

      // Append overlay to body
      document.body.appendChild(fullscreenDiv);
      console.log('Appended fullscreen div to body');

      // Function to remove overlay
      const removeOverlay = () => {
        fullscreenDiv.remove();
        console.log('Fullscreen div removed');
      };

      // Remove overlay on clicking background or close button
      fullscreenDiv.onclick = removeOverlay;
      closeButton.onclick = removeOverlay;

      // Prevent propagation of click event from image to overlay
      imgClone.onclick = (event) => {
        event.stopPropagation();
        console.log('Click on cloned image, propagation stopped');
      };
    };
  });
});
