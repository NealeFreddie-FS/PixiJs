// Utility functions for Pixie Pong

export function showMenu(menuId) {
  document.querySelectorAll(".menu").forEach((menu) => {
    menu.classList.add("hidden");
  });
  document.getElementById(menuId).classList.remove("hidden");
}

export function hideMenu(menuId) {
  document.getElementById(menuId).classList.add("hidden");
}

export function exitGame() {
  // Functionality to exit the game
  // This could redirect to another page or close the window
  window.close(); // Note: May not work in all browsers
}
