import Device from "./core/Device.js";
import TouchHandler from "./core/TouchHandler.js";
import AppManager from "./core/AppManager.js";

class IPhoneOS {
  constructor() {
    this.device = new Device();
    this.touchHandler = new TouchHandler();
    this.appManager = new AppManager();

    this.initialize();
  }

  initialize() {
    // Handle gestures
    document.addEventListener("gesture", (e) => {
      this.handleGesture(e.detail.type);
    });
  }

  handleGesture(type) {
    switch (type) {
      case "swipe-up":
        if (this.device.isLocked) {
          this.device.unlock();
        }
        break;
      case "swipe-down":
        // Show control center
        break;
      case "swipe-left":
      case "swipe-right":
        // Handle app switching
        break;
    }
  }
}

// Initialize OS when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.iPhoneOS = new IPhoneOS();
});
