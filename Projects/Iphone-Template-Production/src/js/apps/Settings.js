export default class Settings {
  constructor() {
    this.settings = {
      wifi: {
        enabled: true,
        networks: [
          { name: "Home WiFi", connected: true, strength: 3 },
          { name: "Coffee Shop", strength: 2, secured: true },
          { name: "Library", strength: 1, secured: true },
        ],
      },
      bluetooth: {
        enabled: false,
        devices: [
          { name: "AirPods Pro", type: "audio", paired: true },
          { name: "Car Stereo", type: "audio", paired: true },
        ],
      },
      display: {
        brightness: 0.8,
        autoLock: "2 minutes",
        darkMode: false,
      },
      sounds: {
        volume: 0.6,
        ringtone: "Opening",
        textTone: "Note",
        vibrateOnRing: true,
      },
    };

    this.currentSection = null;
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    if (this.currentSection) {
      this.renderSection(this.currentSection);
    } else {
      this.renderMainMenu();
    }
  }

  renderMainMenu() {
    this.container.innerHTML = `
      <div class="settings-app">
        <div class="app-header">
          <h2>Settings</h2>
        </div>
        
        <div class="settings-list">
          <div class="settings-group">
            <div class="settings-item" data-section="wifi">
              <div class="settings-icon wifi">
                <i class="fas fa-wifi"></i>
              </div>
              <div class="settings-info">
                <div class="settings-label">Wi-Fi</div>
                <div class="settings-value">${
                  this.settings.wifi.enabled ? "Connected" : "Off"
                }</div>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>

            <div class="settings-item" data-section="bluetooth">
              <div class="settings-icon bluetooth">
                <i class="fab fa-bluetooth-b"></i>
              </div>
              <div class="settings-info">
                <div class="settings-label">Bluetooth</div>
                <div class="settings-value">${
                  this.settings.bluetooth.enabled ? "On" : "Off"
                }</div>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>

          <div class="settings-group">
            <div class="settings-item" data-section="display">
              <div class="settings-icon display">
                <i class="fas fa-adjust"></i>
              </div>
              <div class="settings-info">
                <div class="settings-label">Display & Brightness</div>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>

            <div class="settings-item" data-section="sounds">
              <div class="settings-icon sounds">
                <i class="fas fa-volume-up"></i>
              </div>
              <div class="settings-info">
                <div class="settings-label">Sounds & Haptics</div>
              </div>
              <i class="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupMainMenuListeners();
  }

  renderSection(section) {
    switch (section) {
      case "wifi":
        this.renderWiFiSection();
        break;
      case "bluetooth":
        this.renderBluetoothSection();
        break;
      case "display":
        this.renderDisplaySection();
        break;
      case "sounds":
        this.renderSoundsSection();
        break;
    }
  }

  renderWiFiSection() {
    this.container.innerHTML = `
      <div class="settings-app">
        <div class="app-header">
          <button class="back-button">
            <i class="fas fa-chevron-left"></i>
          </button>
          <h2>Wi-Fi</h2>
        </div>

        <div class="settings-list">
          <div class="settings-group">
            <div class="toggle-setting">
              <span>Wi-Fi</span>
              <label class="switch">
                <input type="checkbox" ${
                  this.settings.wifi.enabled ? "checked" : ""
                }>
                <span class="slider"></span>
              </label>
            </div>
          </div>

          ${
            this.settings.wifi.enabled
              ? `
            <div class="settings-group">
              <div class="section-header">NETWORKS</div>
              ${this.settings.wifi.networks
                .map(
                  (network) => `
                <div class="network-item">
                  <div class="network-info">
                    <div class="network-name">
                      ${network.name}
                      ${network.secured ? '<i class="fas fa-lock"></i>' : ""}
                    </div>
                    <div class="network-status">
                      ${this.renderWiFiStrength(network.strength)}
                      ${
                        network.connected
                          ? '<span class="connected">Connected</span>'
                          : ""
                      }
                    </div>
                  </div>
                  ${network.connected ? '<i class="fas fa-check"></i>' : ""}
                </div>
              `
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `;

    this.setupSectionListeners();
  }

  renderWiFiStrength(strength) {
    const bars = [];
    for (let i = 0; i < 3; i++) {
      bars.push(`<div class="wifi-bar ${i < strength ? "active" : ""}"></div>`);
    }
    return `<div class="wifi-strength">${bars.join("")}</div>`;
  }

  setupMainMenuListeners() {
    this.container.querySelectorAll(".settings-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.currentSection = item.dataset.section;
        this.render();
      });
    });
  }

  setupSectionListeners() {
    const backButton = this.container.querySelector(".back-button");
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.currentSection = null;
        this.render();
      });
    }

    const wifiToggle = this.container.querySelector('input[type="checkbox"]');
    if (wifiToggle) {
      wifiToggle.addEventListener("change", (e) => {
        this.settings.wifi.enabled = e.target.checked;
        this.render();
      });
    }
  }
}
