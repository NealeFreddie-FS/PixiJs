export default class DockManager {
  constructor() {
    this.dockZones = {
      left: { x: 0, width: 300 },
      right: { x: window.innerWidth - 350, width: 350 },
      center: { x: 300, width: window.innerWidth - 650 },
    };

    this.dockedWindows = {
      left: [],
      right: [],
      center: [],
    };

    this.setupDockingZones();
  }

  setupDockingZones() {
    // Create visual indicators for dock zones
    this.dockIndicators = {};
    ["left", "right", "center"].forEach((zone) => {
      const indicator = document.createElement("div");
      indicator.className = "dock-indicator";
      indicator.dataset.zone = zone;
      document.body.appendChild(indicator);
      this.dockIndicators[zone] = indicator;
    });

    this.updateDockZones();
    window.addEventListener("resize", () => this.updateDockZones());
  }

  updateDockZones() {
    const containerWidth = window.innerWidth;
    this.dockZones.right.x = containerWidth - this.dockZones.right.width;
    this.dockZones.center.width =
      containerWidth - this.dockZones.left.width - this.dockZones.right.width;
  }

  showDockingIndicators(x, y) {
    Object.entries(this.dockIndicators).forEach(([zone, indicator]) => {
      const zoneRect = this.getDockZoneRect(zone);
      const isNearZone = this.isNearDockZone(x, y, zoneRect);
      indicator.classList.toggle("active", isNearZone);

      if (isNearZone) {
        indicator.style.left = `${zoneRect.x}px`;
        indicator.style.top = "0";
        indicator.style.width = `${zoneRect.width}px`;
        indicator.style.height = "100%";
      }
    });
  }

  hideDockingIndicators() {
    Object.values(this.dockIndicators).forEach((indicator) => {
      indicator.classList.remove("active");
    });
  }

  getDockZoneRect(zone) {
    return {
      x: this.dockZones[zone].x,
      width: this.dockZones[zone].width,
      height: window.innerHeight,
    };
  }

  isNearDockZone(x, y, zoneRect, threshold = 50) {
    return (
      x >= zoneRect.x - threshold &&
      x <= zoneRect.x + zoneRect.width + threshold
    );
  }

  dockWindow(window, zone) {
    const zoneRect = this.getDockZoneRect(zone);
    window.dock(zone, zoneRect);
    this.dockedWindows[zone].push(window);
    this.updateDockedWindows(zone);
  }

  undockWindow(window, zone) {
    const index = this.dockedWindows[zone].indexOf(window);
    if (index > -1) {
      this.dockedWindows[zone].splice(index, 1);
      window.undock();
      this.updateDockedWindows(zone);
    }
  }

  updateDockedWindows(zone) {
    const windows = this.dockedWindows[zone];
    const zoneRect = this.getDockZoneRect(zone);
    const windowHeight = zoneRect.height / windows.length;

    windows.forEach((window, index) => {
      window.setDimensions(
        zoneRect.x,
        index * windowHeight,
        zoneRect.width,
        windowHeight
      );
    });
  }

  applyDefaultLayout() {
    // Clear all current docking
    Object.keys(this.dockedWindows).forEach((zone) => {
      this.dockedWindows[zone].forEach((window) => window.undock());
      this.dockedWindows[zone] = [];
    });

    // Get all windows from WindowManager
    const allWindows = Array.from(window.windowManager.windows.values());

    // Define default positions
    const defaultLayout = {
      center: ["viewport"],
      left: ["stats"],
      right: ["controls", "time-properties"],
    };

    // Apply default layout
    Object.entries(defaultLayout).forEach(([zone, windowIds]) => {
      windowIds.forEach((id) => {
        const window = allWindows.find((w) => w.id === id);
        if (window) {
          this.dockWindow(window, zone);
        }
      });
    });
  }
}
