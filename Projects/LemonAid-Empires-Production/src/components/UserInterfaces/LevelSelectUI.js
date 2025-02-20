import { createButton, createContainer } from "./UIManager.js";

export default class LevelSelectUI {
  constructor() {
    this.uiContainer = document.getElementById("level-select-container");
  }

  render() {
    this.uiContainer.innerHTML = `
      <div class="level-select-header">
        <h1>Select a Level</h1>
        <p>Choose where to start your lemonade empire!</p>
      </div>
      <div class="level-grid">
        <div class="level-card">
          <h3>Level 1: Park</h3>
          <p>Start small in the local park.</p>
          ${
            createButton(
              "Play",
              () => (window.location.href = "./level-one-park.html"),
              "btn btn-primary"
            ).outerHTML
          }
        </div>
        <div class="level-card">
          <h3>Level 2: Beach</h3>
          <p>Expand to the sunny beach.</p>
          ${
            createButton(
              "Play",
              () => (window.location.href = "./level-two-beach.html"),
              "btn btn-primary"
            ).outerHTML
          }
        </div>
        <div class="level-card">
          <h3>Level 3: City Center</h3>
          <p>Conquer the bustling city center.</p>
          ${
            createButton(
              "Play",
              () => (window.location.href = "./level-three-city.html"),
              "btn btn-primary"
            ).outerHTML
          }
        </div>
      </div>
    `;
  }
}
