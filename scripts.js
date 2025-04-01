// Toggle for Dark/Light Mode
function toggleMode() {
  const body = document.body;
  const currentMode = body.classList.contains('dark-mode');

  // Toggle the dark-mode class on the body tag
  if (currentMode) {
    body.classList.remove('dark-mode');
    localStorage.setItem('mode', 'light'); // Save the preference in localStorage
  } else {
    body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark'); // Save the preference in localStorage
  }
}

// Check for saved mode preference in localStorage and apply it on page load
window.onload = () => {
  const savedMode = localStorage.getItem('mode');
  if (savedMode === 'dark') {
    document.body.classList.add('dark-mode');
  }
};
