import SimulationManager from "./core/SimulationManager.js";
import DockManager from "./ui/DockManager.js";

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Create project panel
    const projectPanel = document.createElement("div");
    projectPanel.className = "project-panel";
    document.body.appendChild(projectPanel);

    // Add Font Awesome for icons
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(fontAwesome);

    // Initialize dock manager
    window.dockManager = new DockManager();

    // Initialize simulation
    window.simulation = new SimulationManager();
  } catch (error) {
    console.error("Failed to initialize:", error);
    showErrorMessage(error);
  }
});

function showErrorMessage(error) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.innerHTML = `
    <h2><i class="fas fa-exclamation-triangle"></i> Error</h2>
    <p>Failed to initialize simulation: ${error.message}</p>
    <p class="error-details">${error.stack}</p>
  `;
  document.body.appendChild(errorDiv);
}

// Add error handling for asynchronous errors
window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
  showErrorMessage(event.reason);
});

// Add resize handler
window.addEventListener("resize", () => {
  if (window.simulation) {
    window.simulation.handleResize();
  }
});

// Add keyboard controls
window.addEventListener("keydown", (event) => {
  if (!window.simulation) return;

  switch (event.key) {
    case " ":
      // Space bar to pause/unpause
      window.simulation.togglePause();
      break;
    case "ArrowUp":
      // Speed up
      window.simulation.adjustSpeed(1.5);
      break;
    case "ArrowDown":
      // Slow down
      window.simulation.adjustSpeed(0.75);
      break;
    case "r":
      // Generate new random terrain
      window.simulation.generateTerrain();
      break;
    case "f":
      // Toggle fertility overlay
      const fertilityCheckbox = document.getElementById("show-fertility");
      fertilityCheckbox.checked = !fertilityCheckbox.checked;
      fertilityCheckbox.dispatchEvent(new Event("change"));
      break;
    case "w":
      // Toggle water distance overlay
      const waterCheckbox = document.getElementById("show-water-distance");
      waterCheckbox.checked = !waterCheckbox.checked;
      waterCheckbox.dispatchEvent(new Event("change"));
      break;
  }
});

// Add some CSS for error messages
const style = document.createElement("style");
style.textContent = `
  .error-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(231, 76, 60, 0.95);
    color: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    z-index: 1000;
    max-width: 80%;
  }

  .error-message h2 {
    margin: 0 0 10px 0;
  }

  .error-message p {
    margin: 0;
    opacity: 0.9;
  }

  .error-message .error-details {
    margin-top: 10px;
    font-family: monospace;
    font-size: 12px;
    text-align: left;
    background: rgba(0,0,0,0.2);
    padding: 10px;
    border-radius: 5px;
    white-space: pre-wrap;
  }

  .error-message i {
    margin-right: 10px;
  }
`;
document.head.appendChild(style);
