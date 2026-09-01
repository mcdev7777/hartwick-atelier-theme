
// Dropdown and mega menu

const ddButtons = document.getElementsByClassName("mob-parent-button");

// Loop through each button
for (const ddButton of ddButtons) {
  // Add a click event listener to the button
  ddButton.addEventListener("click", function (event) {
    // Prevent the default behavior of the button click
    event.preventDefault();
    // Find the next sibling element and add the "active" class to it
    const nextElement = ddButton.nextElementSibling;
    if (nextElement) {
      nextElement.classList.add("active");
      updateSlHideVisibility();
    }
  });
} 

const ddPanels = document.getElementsByClassName("mob-secondary-level-ul");

// Function to update the visibility of sl-hide divs
function updateSlHideVisibility() {
  const isActivePanel = Array.from(ddPanels).some(panel => panel.classList.contains("active"));
  const slHideDivs = document.getElementsByClassName("sl-hide");

  for (const slHideDiv of slHideDivs) {
    if (isActivePanel) {
      slHideDiv.classList.add("sl-hide-oi");
    } else {
      slHideDiv.classList.remove("sl-hide-oi");
    }
  }
}

// Loop through each panel
for (const ddPanel of ddPanels) {
  // Find the "nav-secondary-fo-back-button" within the current panel
  const backButton = ddPanel.querySelector(".nav-secondary-fo-back-button");

  // Add a click event listener to the back button
  backButton.addEventListener("click", function () {
    // Remove the "active" class from the parent panel
    ddPanel.classList.toggle("active");
    updateSlHideVisibility();
  });

  // Create a MutationObserver for each panel
  const panelObserver = new MutationObserver(() => {
    updateSlHideVisibility();
  });

  // Define what to observe within the panel for specific changes
  const observerConfig = { subtree: true, childList: true, attributes: true, characterData: true };

  // Start observing the panel for changes
  panelObserver.observe(ddPanel, observerConfig);
}


const navDesktopButtons = document.querySelectorAll('.nav-desktop-dd-btn');
const headerMegaFwLists = document.querySelectorAll('.header-nav-desktop-dd-panel');
const gcHeader = document.querySelector('.header-bar-inner');
  
function applyBackgroundColor() {
  gcHeader.classList.add('hovered');
}

function removeBackgroundColor() {
  gcHeader.classList.remove('hovered');
}

navDesktopButtons.forEach((navDesktopButton) => {
  navDesktopButton.addEventListener('mouseover', applyBackgroundColor);
  navDesktopButton.addEventListener('mouseout', removeBackgroundColor);
});

headerMegaFwLists.forEach((headerMegaFwList) => {
  headerMegaFwList.addEventListener('mouseover', applyBackgroundColor);
  headerMegaFwList.addEventListener('mouseout', removeBackgroundColor);
});


// Scrolling transition for transparent header option

const headerDiv = document.getElementById('SiteHeader');
let isScrolled = false;

window.addEventListener('scroll', function() {
  const scrollPosition = window.pageYOffset;

  if (scrollPosition > 250 && !isScrolled) {
    headerDiv.classList.remove('hdr-trans-hp');
    isScrolled = true;
  } else if (scrollPosition <= 250 && isScrolled) {
    headerDiv.classList.add('hdr-trans-hp');
    isScrolled = false;
  }
});

// Menu drawer
  
var navdrawermobile = document.getElementById('mobNavDrawer');
var drawbg = document.getElementById('drawBg');
var navbtn = document.getElementById('hdrMenuBtn');
var navclose = document.getElementById('mobNavDrawerClose');

//if (navbtn) {
//  navbtn.addEventListener('click', function() {
//    navdrawermobile.classList.toggle('open');
//    navclose.focus();
//    drawbg.classList.toggle('open');
//    event.preventDefault();
//  });
//}


// Function to open the menu drawer and set focus to the close button
function openMenuDrawer(event) {
  navdrawermobile.classList.toggle('open');
  drawbg.classList.toggle('open');
  if (navdrawermobile.classList.contains('open')) {
    setTimeout(() => {
      navclose.focus();
    }, 200); // Adjust the delay time as needed to match the transition duration
  }
  event.preventDefault();
}

// Check if navbtn exists and is an element
if (navbtn) {
  // Click event listener
  navbtn.addEventListener('click', openMenuDrawer);

  // Keydown event listener for 'Enter' key
  navbtn.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
      openMenuDrawer(event);
    }
  });
}

if(navclose) { 
  navclose.addEventListener('click', function() {
    navdrawermobile.classList.remove('open');
    drawbg.classList.remove('open');
    navbtn.focus();
  });
}

if(drawbg) { 
  drawbg.addEventListener('click', function() {
    navdrawermobile.classList.remove('open');
    drawbg.classList.remove('open');
    navbtn.focus();
  });
}  