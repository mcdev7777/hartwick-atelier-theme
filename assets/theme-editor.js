// Create section classes
function updateThemeEditorSectionClasses() {
  const sections = document.querySelectorAll(
    '.content-for-layout > .shopify-section'
  );

  sections.forEach((section, index) => {
    // Remove any existing theme-editor-section-* classes
    section.className = section.className.replace(
      /\btheme-editor-section-\d+\b/g,
      ''
    ).trim();

    // Add the new class
    section.classList.add(`theme-editor-section-${index + 1}`);
  });
}

// Update section classes
document.addEventListener("DOMContentLoaded", updateThemeEditorSectionClasses);
document.addEventListener('shopify:section:reorder', (event) => updateThemeEditorSectionClasses(event));
document.addEventListener('shopify:section:load', (event) => updateThemeEditorSectionClasses(event));
document.addEventListener('shopify:section:unload', (event) => updateThemeEditorSectionClasses(event));


// Hide Popup to avoid it popping up whilst using editor
function hidePopupAll() {
  const Popup = document.querySelector('.popup--overlay');
  Popup.classList.add('hide-in-editor');
  popup.classList.remove('show-in-editor');
}

function hidePopup(event) {
  const popup = document.querySelector('.popup--overlay');
  if (!popup) return; // Check if the popup exists

  // Check if the selected section contains the popup
  if (!event.target.contains(popup)) {
    popup.classList.add('hide-in-editor');
    popup.classList.remove('show-in-editor');
  } else {
    popup.classList.remove('hide-in-editor'); // Ensure the class is removed if the section contains the popup
    popup.classList.add('show-in-editor'); // Ensure the class is removed if the section contains the popup
  }
}

document.addEventListener('shopify:section:select', (event) => hidePopup(event));

document.addEventListener('shopify:section:deselect', (event) => hidePopupAll(event));

document.addEventListener('shopify:section:load', (event) => hidePopup(event));


// Prevent fixed reveal image/video banner section from being visible at bottom of screen when scrolling down
document.addEventListener("DOMContentLoaded", function() {
  const thisSectionId = "{{ section.id }}";
  const fixedLandingSection =
    document.querySelector(
      ".theme-editor-section-1 .scroll-effect--overlap.banner-style-fullscreen"
    );

  function checkSectionVisibility() {
    if (!fixedLandingSection) return;

    const scrollYPosition = window.scrollY;
    const windowHeight = window.innerHeight + 200;

    if (scrollYPosition > windowHeight) {
      fixedLandingSection.style.opacity = "0";
      fixedLandingSection.style.zIndex = "-1";
    } else {
      fixedLandingSection.style.opacity = "1";
      fixedLandingSection.style.zIndex = "0";
    }
  }

  checkSectionVisibility(); // Check on page load
  window.addEventListener("scroll", checkSectionVisibility); // Check on scroll
});


