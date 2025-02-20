export default class Phone {
  constructor() {
    this.contacts = [
      { name: "John Doe", number: "(555) 123-4567" },
      { name: "Jane Smith", number: "(555) 234-5678" },
      { name: "Bob Johnson", number: "(555) 345-6789" },
    ];
    this.currentView = "keypad"; // or 'contacts', 'recents'
  }

  mount(container) {
    this.container = container;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.container.innerHTML = `
            <div class="phone-app">
                <div class="app-header">
                    <div class="tab-bar">
                        <button class="tab-button ${
                          this.currentView === "keypad" ? "active" : ""
                        }" data-view="keypad">
                            <i class="fas fa-keypad"></i>
                            <span>Keypad</span>
                        </button>
                        <button class="tab-button ${
                          this.currentView === "recents" ? "active" : ""
                        }" data-view="recents">
                            <i class="fas fa-clock"></i>
                            <span>Recents</span>
                        </button>
                        <button class="tab-button ${
                          this.currentView === "contacts" ? "active" : ""
                        }" data-view="contacts">
                            <i class="fas fa-user"></i>
                            <span>Contacts</span>
                        </button>
                    </div>
                </div>
                
                <div class="app-content">
                    ${this.renderView()}
                </div>
            </div>
        `;
  }

  renderView() {
    switch (this.currentView) {
      case "keypad":
        return this.renderKeypad();
      case "contacts":
        return this.renderContacts();
      case "recents":
        return this.renderRecents();
      default:
        return "";
    }
  }

  renderKeypad() {
    return `
            <div class="keypad-view">
                <div class="number-display">
                    <input type="text" class="phone-number" placeholder="Enter number" />
                </div>
                <div class="keypad">
                    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"]
                      .map(
                        (num) => `
                        <button class="keypad-button" data-number="${num}">${num}</button>
                    `
                      )
                      .join("")}
                    <button class="call-button">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            </div>
        `;
  }

  renderContacts() {
    return `
            <div class="contacts-view">
                <div class="search-bar">
                    <input type="text" placeholder="Search contacts" />
                </div>
                <div class="contacts-list">
                    ${this.contacts
                      .map(
                        (contact) => `
                        <div class="contact-item">
                            <div class="contact-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <div class="contact-info">
                                <div class="contact-name">${contact.name}</div>
                                <div class="contact-number">${contact.number}</div>
                            </div>
                            <button class="call-contact">
                                <i class="fas fa-phone"></i>
                            </button>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
        `;
  }

  renderRecents() {
    return `
            <div class="recents-view">
                <div class="recents-list">
                    <div class="recent-call">
                        <div class="call-info">
                            <div class="call-name">John Doe</div>
                            <div class="call-details">
                                <i class="fas fa-phone-arrow-up-right"></i>
                                <span>Yesterday, 3:24 PM</span>
                            </div>
                        </div>
                        <button class="call-recent">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
  }

  setupEventListeners() {
    // Tab switching
    this.container.querySelectorAll(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        this.currentView = button.dataset.view;
        this.render();
      });
    });

    // Keypad input
    if (this.currentView === "keypad") {
      this.container.querySelectorAll(".keypad-button").forEach((button) => {
        button.addEventListener("click", () => {
          const input = this.container.querySelector(".phone-number");
          if (input) {
            input.value += button.dataset.number;
          }
        });
      });
    }
  }
}
