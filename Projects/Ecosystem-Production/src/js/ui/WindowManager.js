import UIWindow from "./UIWindow.js";
import DockManager from "./DockManager.js";

export default class WindowManager {
  constructor() {
    this.windows = new Map();
    this.setupContainer();

    // Create dock manager if it doesn't exist
    if (!window.dockManager) {
      window.dockManager = new DockManager();
    }
  }

  setupContainer() {
    this.container = document.createElement("div");
    this.container.id = "window-container";
    document.body.appendChild(this.container);
  }

  createWindow(options) {
    const window = new UIWindow(options);
    this.windows.set(window.id, window);
    this.container.appendChild(window.element);
    return window;
  }

  getWindow(id) {
    return this.windows.get(id);
  }

  removeWindow(id) {
    const window = this.windows.get(id);
    if (window) {
      window.element.remove();
      this.windows.delete(id);
    }
  }
}
