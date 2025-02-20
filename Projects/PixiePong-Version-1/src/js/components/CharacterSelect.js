export default class CharacterSelect {
  constructor() {
    this.selectContainer = document.getElementById("character-select");
    this.exitButton = document.getElementById("exit-character-select");

    this.characterButtons = [
      document.getElementById("character-1"),
      document.getElementById("character-2"),
      document.getElementById("character-3"),
    ];

    this.initialize();
    this.updateLockStatus();
  }

  initialize() {
    this.characterButtons.forEach((button, index) => {
      button.addEventListener("click", () => this.selectCharacter(index));
    });

    this.exitButton.addEventListener("click", () => this.exitCharacterSelect());
  }

  selectCharacter(index) {
    const selectedCharacter = this.getCharacterData(index);
    if (selectedCharacter.locked) {
      alert(
        "This character is locked! Win a game with the previous character to unlock."
      );
      return;
    }

    // Dispatch a custom event to notify the Game component of the selected character
    const characterSelectedEvent = new CustomEvent("characterSelected", {
      detail: { ...selectedCharacter, index },
    });
    document.dispatchEvent(characterSelectedEvent);

    // Hide Character Select and show Game
    this.hide();
  }

  exitCharacterSelect() {
    this.hide();
    showMenu("main-menu");
  }

  show() {
    this.selectContainer.classList.remove("hidden");
  }

  hide() {
    this.selectContainer.classList.add("hidden");
  }

  getCharacterData(index) {
    const characters = [
      {
        name: "Sparkle",
        abilities: ["Fire Burst", "Ice Barrier", "Wind Gust"],
        stats: { speed: 8, stamina: 7 },
        locked: false,
      },
      {
        name: "Glitter",
        abilities: ["Lightning Strike", "Earth Shield", "Water Wave"],
        stats: { speed: 10, stamina: 9 },
        locked: true,
      },
      {
        name: "Twinkle",
        abilities: ["Shadow Dash", "Light Shield", "Meteor Shower"],
        stats: { speed: 12, stamina: 11 },
        locked: true,
      },
    ];
    return characters[index];
  }

  unlockCharacter(index) {
    const character = this.getCharacterData(index);
    if (index === 0 || !this.getCharacterData(index - 1).locked) {
      character.locked = false;
      this.updateLockStatus();
    }
  }

  updateLockStatus() {
    this.characterButtons.forEach((button, index) => {
      const character = this.getCharacterData(index);
      const lockIcon = button.querySelector(".lock-icon");
      if (character.locked) {
        button.classList.add("locked");
        if (lockIcon) lockIcon.style.display = "block";
      } else {
        button.classList.remove("locked");
        if (lockIcon) lockIcon.style.display = "none";
      }
    });
  }
}
