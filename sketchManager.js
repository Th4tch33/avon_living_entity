function isMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return window.innerWidth <= 768 || /android|iphone|ipod|ipad|windows phone|mobile/i.test(userAgent);
}
  
if (isMobile()) {
  console.log("User is on a mobile device");
  loadScript('mobile.js');  // Load mobile-specific JS file
} else {
  console.log("User is on a desktop device");
  loadScript('main.js');  // Load desktop-specific JS file
}

// Function to dynamically load a script
function loadScript(scriptUrl) {
  const script = document.createElement('script');
  script.src = scriptUrl;
  script.type = 'text/javascript';
  script.onload = function () {
    console.log(`${scriptUrl} loaded successfully!`);
  };
  script.onerror = function () {
    console.error(`Failed to load ${scriptUrl}`);
  };
  document.head.appendChild(script);  // Append the script tag to the <head>
}