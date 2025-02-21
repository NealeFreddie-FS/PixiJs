// Utility functions for Pixie Pong

export function showMenu(menuId) {
  // Hide all menus first
  document.querySelectorAll(".menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
  // Show the requested menu
  document.getElementById(menuId).classList.remove("hidden");
}

export function hideMenu(menuId) {
  document.getElementById(menuId).classList.add("hidden");
}

export function exitGame() {
  if (confirm("Are you sure you want to exit?")) {
    window.close();
    // Fallback if window.close() is blocked
    window.location.href = "about:blank";
  }
}
