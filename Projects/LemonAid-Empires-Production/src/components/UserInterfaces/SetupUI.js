import {
  createInput,
  createLabel,
  createButton,
  createContainer,
} from "./UIManager.js";

export default class SetupUI {
  constructor() {
    this.uiContainer = document.getElementById("setup-container");
    if (!this.uiContainer) {
      throw new Error("Setup container not found!");
    }
  }

  handleSubmit(e, inputs) {
    e.preventDefault();
    console.log("Form submitted");

    const { nameInput, lemonsInput, sugarInput, iceInput } = inputs;

    const standName = nameInput.value;
    const initialLemons = parseInt(lemonsInput.value);
    const initialSugar = parseInt(sugarInput.value);
    const initialIce = parseInt(iceInput.value);

    localStorage.setItem("standName", standName);
    localStorage.setItem("initialLemons", initialLemons);
    localStorage.setItem("initialSugar", initialSugar);
    localStorage.setItem("initialIce", initialIce);

    window.location.href = "./level-select.html";
  }

  render() {
    const header = document.createElement("div");
    header.className = "setup-header";
    header.innerHTML = `
      <h1>Customize Your Stand</h1>
      <p>Set up your lemonade stand and buy initial ingredients!</p>
    `;

    const form = document.createElement("form");
    form.id = "setup-form";

    // Stand Name Input
    const nameGroup = document.createElement("div");
    nameGroup.className = "form-group";
    const nameLabel = createLabel("Stand Name:", "stand-name");
    nameLabel.innerHTML = '<i class="fas fa-sign"></i> Stand Name:';
    const nameInput = createInput(
      "text",
      "stand-name",
      "Enter your stand name",
      true
    );
    nameGroup.appendChild(nameLabel);
    nameGroup.appendChild(nameInput);

    // Initial Lemons Input
    const lemonsGroup = document.createElement("div");
    lemonsGroup.className = "form-group";
    const lemonsLabel = createLabel("Initial Lemons:", "initial-lemons");
    lemonsLabel.innerHTML = '<i class="fas fa-lemon"></i> Initial Lemons:';
    const lemonsInput = createInput("number", "initial-lemons", "10", true);
    lemonsInput.value = "10";
    lemonsInput.min = "0";
    lemonsGroup.appendChild(lemonsLabel);
    lemonsGroup.appendChild(lemonsInput);

    // Initial Sugar Input
    const sugarGroup = document.createElement("div");
    sugarGroup.className = "form-group";
    const sugarLabel = createLabel("Initial Sugar:", "initial-sugar");
    sugarLabel.innerHTML = '<i class="fas fa-cube"></i> Initial Sugar:';
    const sugarInput = createInput("number", "initial-sugar", "10", true);
    sugarInput.value = "10";
    sugarInput.min = "0";
    sugarGroup.appendChild(sugarLabel);
    sugarGroup.appendChild(sugarInput);

    // Initial Ice Input
    const iceGroup = document.createElement("div");
    iceGroup.className = "form-group";
    const iceLabel = createLabel("Initial Ice:", "initial-ice");
    iceLabel.innerHTML = '<i class="fas fa-ice-cream"></i> Initial Ice:';
    const iceInput = createInput("number", "initial-ice", "10", true);
    iceInput.value = "10";
    iceInput.min = "0";
    iceGroup.appendChild(iceLabel);
    iceGroup.appendChild(iceInput);

    // Submit Button
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary";
    submitBtn.innerHTML = '<i class="fas fa-play"></i> Start Game';

    // Add form submit handler
    form.addEventListener("submit", (e) =>
      this.handleSubmit(e, {
        nameInput,
        lemonsInput,
        sugarInput,
        iceInput,
      })
    );

    // Append all elements
    form.appendChild(nameGroup);
    form.appendChild(lemonsGroup);
    form.appendChild(sugarGroup);
    form.appendChild(iceGroup);
    form.appendChild(submitBtn);

    // Clear and append everything
    this.uiContainer.innerHTML = "";
    this.uiContainer.appendChild(header);
    this.uiContainer.appendChild(form);
  }
}
