// Helper function to create a button
export function createButton(text, onClick, className = "btn") {
  try {
    const button = document.createElement("button");
    button.className = className;
    button.textContent = text;
    button.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(`Button clicked: ${text}`);
      onClick();
    });
    return button;
  } catch (error) {
    console.error(`Error creating button ${text}:`, error);
    return null;
  }
}

// Helper function to create a form input
export function createInput(type, id, placeholder, required = false) {
  const input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.placeholder = placeholder;
  input.required = required;
  return input;
}

// Helper function to create a label
export function createLabel(text, htmlFor) {
  const label = document.createElement("label");
  label.textContent = text;
  label.htmlFor = htmlFor;
  return label;
}

// Helper function to create a container
export function createContainer(className) {
  const container = document.createElement("div");
  container.className = className;
  return container;
}
