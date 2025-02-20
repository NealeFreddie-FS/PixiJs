export default class Device {
  constructor() {
    this.statusBar = {
      time: document.querySelector(".time"),
      signal: document.querySelector(".signal"),
      wifi: document.querySelector(".wifi"),
      battery: document.querySelector(".battery"),
    };

    this.screen = document.querySelector(".screen");
    this.homeIndicator = document.querySelector(".home-indicator");

    this.isLocked = false;
    this.brightness = 1;
    this.volume = 0.5;

    this.initializeDevice();
  }

  initializeDevice() {
    // Update time
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    // Initialize device status
    this.updateBatteryStatus();
    this.updateNetworkStatus();

    // Add home indicator handler
    this.homeIndicator.addEventListener("click", () => this.handleHomeButton());
  }

  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    this.statusBar.time.textContent = `${hours}:${minutes}`;
  }

  updateBatteryStatus() {
    // Simulate battery API
    const level = Math.random();
    const batteryIcon = this.statusBar.battery.querySelector("i");

    if (level > 0.75) batteryIcon.className = "fas fa-battery-full";
    else if (level > 0.5)
      batteryIcon.className = "fas fa-battery-three-quarters";
    else if (level > 0.25) batteryIcon.className = "fas fa-battery-half";
    else batteryIcon.className = "fas fa-battery-quarter";
  }

  updateNetworkStatus() {
    // Simulate network status
    const signalStrength = Math.floor(Math.random() * 5);
    const wifiStrength = Math.floor(Math.random() * 5);

    this.statusBar.signal.style.opacity = 0.2 + signalStrength * 0.2;
    this.statusBar.wifi.style.opacity = 0.2 + wifiStrength * 0.2;
  }

  handleHomeButton() {
    // Emit home button event
    const event = new CustomEvent("home-button-press");
    document.dispatchEvent(event);
  }

  lock() {
    this.isLocked = true;
    this.screen.classList.add("locked");
  }

  unlock() {
    this.isLocked = false;
    this.screen.classList.remove("locked");
  }

  setBrightness(level) {
    this.brightness = Math.max(0, Math.min(1, level));
    this.screen.style.filter = `brightness(${this.brightness})`;
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(1, level));
  }
}
