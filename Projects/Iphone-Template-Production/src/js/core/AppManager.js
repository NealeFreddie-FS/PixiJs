export default class AppManager {
  constructor() {
    this.apps = new Map();
    this.currentApp = null;
    this.appWindows = document.querySelector(".app-windows");
    this.appGrid = document.querySelector(".app-grid");
    this.container = document.querySelector(".screen");

    this.appHistory = [];
    this.currentAppIndex = -1;

    this.initializeApps();
    this.setupEventListeners();

    // Add gesture handlers
    document.addEventListener("gesture", (e) => {
      switch (e.detail.type) {
        case "home":
          this.handleHomeGesture();
          break;
        case "app-switcher":
          this.showAppSwitcher();
          break;
        case "control-center":
          this.showControlCenter();
          break;
        case "quick-app-switch-back":
          this.quickSwitchApp(-1);
          break;
        case "quick-app-switch-forward":
          this.quickSwitchApp(1);
          break;
      }
    });
  }

  initializeApps() {
    // Register default apps
    this.registerApp("phone", {
      name: "Phone",
      icon: "https://api.iconify.design/fluent/phone-24-filled.svg?color=%23ffffff",
      component: null, // Will be loaded dynamically
    });

    this.registerApp("messages", {
      name: "Messages",
      icon: "https://api.iconify.design/fluent/chat-24-filled.svg?color=%23ffffff",
      component: null,
    });

    this.registerApp("settings", {
      name: "Settings",
      icon: "https://api.iconify.design/fluent/settings-24-filled.svg?color=%23ffffff",
      component: null,
    });

    this.registerApp("camera", {
      name: "Camera",
      icon: "https://api.iconify.design/fluent/camera-24-filled.svg?color=%23ffffff",
      component: null,
    });

    this.renderAppGrid();
  }

  registerApp(id, config) {
    this.apps.set(id, {
      id,
      ...config,
      isRunning: false,
    });
  }

  async launchApp(appId) {
    const app = this.apps.get(appId);
    if (!app) return;

    // Load app component if not loaded
    if (!app.component) {
      try {
        const module = await import(`../apps/${appId}.js`);
        app.component = module.default;
      } catch (error) {
        console.error(`Failed to load app: ${appId}`, error);
        return;
      }
    }

    // Create app instance
    if (!app.instance) {
      app.instance = new app.component();
    }

    // Show app window
    this.showAppWindow(app);
  }

  showAppWindow(app) {
    // Hide current app if any
    if (this.currentApp) {
      this.currentApp.window.style.display = "none";
    }

    // Create or show app window
    if (!app.window) {
      app.window = document.createElement("div");
      app.window.className = "app-window";
      app.window.id = `app-${app.id}`;
      this.appWindows.appendChild(app.window);
      app.instance.mount(app.window);
    }

    app.window.style.display = "block";
    this.currentApp = app;
    app.isRunning = true;

    // Add app-active class to hide dock
    this.container.classList.add("app-active");

    // Add to app history
    this.appHistory.push(app.id);
    this.currentAppIndex = this.appHistory.length - 1;
  }

  closeApp(appId) {
    const app = this.apps.get(appId);
    if (!app || !app.isRunning) return;

    app.window.style.display = "none";
    app.isRunning = false;

    if (this.currentApp && this.currentApp.id === appId) {
      this.currentApp = null;
      // Remove app-active class to show dock
      this.container.classList.remove("app-active");
    }
  }

  renderAppGrid() {
    this.appGrid.innerHTML = "";

    this.apps.forEach((app) => {
      const appIcon = document.createElement("div");
      appIcon.className = "app-icon";
      appIcon.dataset.app = app.id;

      appIcon.innerHTML = `
                <img src="${app.icon}" alt="${app.name}" />
                <span class="app-name">${app.name}</span>
            `;

      this.appGrid.appendChild(appIcon);
    });
  }

  setupEventListeners() {
    // Handle app launches
    document.addEventListener("click", (e) => {
      const appIcon = e.target.closest(".app-icon");
      if (appIcon) {
        this.launchApp(appIcon.dataset.app);
      }
    });

    // Handle home button
    document.addEventListener("home-button-press", () => {
      if (this.currentApp) {
        this.closeApp(this.currentApp.id);
      }
    });
  }

  handleHomeGesture() {
    if (this.currentApp) {
      // Add closing animation
      this.currentApp.window.classList.add("closing");

      // Wait for animation to complete
      setTimeout(() => {
        this.closeApp(this.currentApp.id);
        this.currentApp.window.classList.remove("closing");
        // Make sure dock is shown
        this.container.classList.remove("app-active");
      }, 300);
    }
  }

  quickSwitchApp(direction) {
    if (!this.currentApp) return;

    const newIndex = this.currentAppIndex + direction;
    if (newIndex >= 0 && newIndex < this.appHistory.length) {
      const appId = this.appHistory[newIndex];
      this.currentAppIndex = newIndex;

      // Add switching animation
      this.currentApp.window.classList.add(
        direction > 0 ? "slide-left" : "slide-right"
      );

      setTimeout(() => {
        this.launchApp(appId);
      }, 300);
    }
  }

  showAppSwitcher() {
    // Add app switcher view implementation
    console.log("App switcher triggered");
  }

  showControlCenter() {
    // Add control center implementation
    console.log("Control center triggered");
  }
}
