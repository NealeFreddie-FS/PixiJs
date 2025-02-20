export default class Settings {
  constructor() {
    this.difficultySelect = document.getElementById("difficulty");
    this.backButton = document.getElementById("back-to-menu");

    this.initialize();
  }

  initialize() {
    this.difficultySelect.addEventListener("change", (event) => {
      const selectedDifficulty = event.target.value;
      // Dispatch a custom event to notify the Game component of the difficulty change
      const difficultyChangeEvent = new CustomEvent("difficultyChange", {
        detail: selectedDifficulty,
      });
      document.dispatchEvent(difficultyChangeEvent);
    });
  }

  setDifficulty(difficulty) {
    this.difficultySelect.value = difficulty;
  }

  destroy() {
    this.difficultySelect.removeEventListener(
      "change",
      this.handleDifficultyChange
    );
  }
}
