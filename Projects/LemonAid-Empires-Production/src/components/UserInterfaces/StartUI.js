import { createButton, createContainer } from "./UIManager.js";

export default class StartUI {
  constructor() {
    this.uiContainer = document.getElementById("main-menu");
    if (!this.uiContainer) {
      throw new Error("Main menu container not found!");
    }
  }

  render() {
    // Create elements directly instead of using template literals
    const header = document.createElement("div");
    header.className = "menu-header";
    header.innerHTML = `
      <h1>LemonAid Empires</h1>
      <p>Build your lemonade empire from scratch!</p>
    `;

    const options = document.createElement("div");
    options.className = "menu-options";

    // Create New Game button
    const newGameBtn = createButton(
      "New Game",
      () => {
        console.log("New Game clicked");
        window.location.href = "./setup.html";
      },
      "menu-button"
    );

    // Create Load Game button
    const loadGameBtn = createButton(
      "Load Game",
      () => {
        console.log("Load Game clicked");
        const savedGame = JSON.parse(localStorage.getItem("savedGame"));
        if (savedGame) {
          window.location.href = "./game.html";
        } else {
          alert("No saved game found!");
        }
      },
      "menu-button"
    );

    // Create Settings button
    const settingsBtn = createButton(
      "Settings",
      () => {
        console.log("Settings clicked");
        alert("Settings functionality coming soon!");
      },
      "menu-button"
    );

    // Create Exit button
    const exitBtn = createButton(
      "Exit",
      () => {
        console.log("Exit clicked");
        window.close();
      },
      "menu-button"
    );

    // Append buttons
    options.appendChild(newGameBtn);
    options.appendChild(loadGameBtn);
    options.appendChild(settingsBtn);
    options.appendChild(exitBtn);

    // Create footer
    const footer = document.createElement("div");
    footer.className = "menu-footer";
    footer.innerHTML = `<p>© 2023 LemonAid Empires. All rights reserved.</p>`;

    // Clear and append everything
    this.uiContainer.innerHTML = "";
    this.uiContainer.appendChild(header);
    this.uiContainer.appendChild(options);
    this.uiContainer.appendChild(footer);
  }
}
