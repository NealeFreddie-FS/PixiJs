import SetupUI from "../components/UserInterfaces/SetupUI.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("Setup page initializing...");
    const setupUI = new SetupUI();
    setupUI.render();
    console.log("Setup page rendered");

    // Add event listener to check if form exists
    const form = document.getElementById("setup-form");
    if (form) {
      console.log("Setup form found");
      form.addEventListener("submit", (e) => {
        console.log("Form submit triggered");
      });
    } else {
      console.error("Setup form not found!");
    }
  } catch (error) {
    console.error("Error initializing setup page:", error);
  }
});
