(function () {
  const STORAGE_KEY = "theme";
  const DARK = "dark";
  const LIGHT = "light";

  // Get saved theme or detect system preference
  function getTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === DARK || saved === LIGHT) {
      return saved;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? DARK
      : LIGHT;
  }

  // Apply theme to document
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateToggleIcon(theme);
  }

  // Update toggle button icon visibility
  function updateToggleIcon(theme) {
    const lightIcon = document.querySelector(".theme-icon-light");
    const darkIcon = document.querySelector(".theme-icon-dark");
    if (lightIcon && darkIcon) {
      lightIcon.style.display = theme === DARK ? "block" : "none";
      darkIcon.style.display = theme === LIGHT ? "block" : "none";
    }
  }

  // Toggle between light and dark
  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply theme immediately to prevent flash
  applyTheme(getTheme());

  // Set up toggle button when DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.addEventListener("click", toggleTheme);
    }
    // Re-apply icon visibility after DOM is ready
    updateToggleIcon(getTheme());
  });

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
})();
