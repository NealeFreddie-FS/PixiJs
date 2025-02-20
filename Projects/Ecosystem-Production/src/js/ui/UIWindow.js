export default class UIWindow {
  constructor(options = {}) {
    this.id = options.id || "window";
    this.title = options.title || "Window";
    this.width = options.width || 300;
    this.height = options.height || 400;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.content = options.content || "";
    this.isActive = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    this.isDocked = false;
    this.dockZone = null;
    this.previousState = null;
    this.isResizing = false;
    this.resizeHandle = null;
    this.minWidth = 200;
    this.minHeight = 150;

    this.createElement();
    this.setupEventListeners();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.className = "window";
    this.element.id = this.id;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    this.element.innerHTML = `
      <div class="window-titlebar">
        <div class="window-title">${this.title}</div>
        <div class="window-controls">
          <button class="window-minimize">_</button>
          <button class="window-maximize">□</button>
          <button class="window-close">×</button>
        </div>
      </div>
      <div class="window-content">
        ${this.content}
      </div>
    `;

    // Add resize handles
    const handles = ["n", "e", "s", "w", "ne", "se", "sw", "nw"];
    handles.forEach((direction) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${direction}`;
      this.element.appendChild(handle);
    });
  }

  setupEventListeners() {
    const titlebar = this.element.querySelector(".window-titlebar");

    titlebar.addEventListener("mousedown", (e) => {
      if (e.target === titlebar) {
        this.startDragging(e);
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isDragging) {
        this.drag(e);
      }
    });

    window.addEventListener("mouseup", () => {
      this.stopDragging();
    });

    this.element.addEventListener("mousedown", () => {
      this.activate();
    });

    // Add window control buttons functionality
    const closeBtn = this.element.querySelector(".window-close");
    const minimizeBtn = this.element.querySelector(".window-minimize");
    const maximizeBtn = this.element.querySelector(".window-maximize");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.close());
    }

    if (minimizeBtn) {
      minimizeBtn.addEventListener("click", () => this.minimize());
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener("click", () => this.maximize());
    }

    // Setup resize handlers
    const handles = this.element.querySelectorAll(".resize-handle");
    handles.forEach((handle) => {
      handle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        this.startResizing(e, handle.className.split(" ")[1].split("-")[1]);
      });
    });

    window.addEventListener("mousemove", (e) => {
      if (this.isResizing) {
        this.resize(e);
      }
    });

    window.addEventListener("mouseup", () => {
      this.stopResizing();
    });
  }

  startDragging(e) {
    this.isDragging = true;
    const rect = this.element.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    this.activate();
  }

  drag(e) {
    if (!this.isDragging) return;

    const x = e.clientX - this.dragOffset.x;
    const y = e.clientY - this.dragOffset.y;

    // Keep window within viewport bounds
    const maxX = window.innerWidth - this.width;
    const maxY = window.innerHeight - this.height;

    this.x = Math.max(0, Math.min(maxX, x));
    this.y = Math.max(0, Math.min(maxY, y));

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  stopDragging() {
    this.isDragging = false;
  }

  activate() {
    document.querySelectorAll(".window").forEach((window) => {
      window.classList.remove("active");
    });
    this.element.classList.add("active");
    this.isActive = true;
  }

  minimize() {
    this.element.classList.toggle("minimized");
  }

  maximize() {
    this.element.classList.toggle("maximized");
    if (this.element.classList.contains("maximized")) {
      this.previousState = {
        width: this.width,
        height: this.height,
        x: this.x,
        y: this.y,
      };
      this.element.style.width = "100%";
      this.element.style.height = "100%";
      this.element.style.left = "0";
      this.element.style.top = "0";
    } else {
      this.element.style.width = `${this.previousState.width}px`;
      this.element.style.height = `${this.previousState.height}px`;
      this.element.style.left = `${this.previousState.x}px`;
      this.element.style.top = `${this.previousState.y}px`;
    }
  }

  close() {
    this.element.remove();
  }

  setContent(content) {
    this.element.querySelector(".window-content").innerHTML = content;
  }

  dock(zone, zoneRect) {
    if (this.isDocked) {
      this.undock();
    }

    this.isDocked = true;
    this.dockZone = zone;

    // Save current state
    this.previousState = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };

    this.element.classList.add("docked", `docked-${zone}`);
    this.setDimensions(zoneRect.x, 0, zoneRect.width, zoneRect.height);
  }

  undock() {
    if (!this.isDocked) return;

    this.isDocked = false;
    this.element.classList.remove("docked", `docked-${this.dockZone}`);

    if (this.previousState) {
      this.setDimensions(
        this.previousState.x,
        this.previousState.y,
        this.previousState.width,
        this.previousState.height
      );
    }

    if (window.dockManager) {
      window.dockManager.undockWindow(this, this.dockZone);
    }

    this.dockZone = null;
  }

  setDimensions(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
  }

  startResizing(e, direction) {
    if (this.isDocked) return;

    this.isResizing = true;
    this.resizeHandle = direction;
    this.activate();

    const rect = this.element.getBoundingClientRect();
    this.resizeStart = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
    };
  }

  resize(e) {
    if (!this.isResizing) return;

    const dx = e.clientX - this.resizeStart.x;
    const dy = e.clientY - this.resizeStart.y;
    const direction = this.resizeHandle;

    let newWidth = this.resizeStart.width;
    let newHeight = this.resizeStart.height;
    let newX = this.resizeStart.left;
    let newY = this.resizeStart.top;

    // Handle different resize directions
    if (direction.includes("e")) newWidth += dx;
    if (direction.includes("w")) {
      newWidth -= dx;
      newX += dx;
    }
    if (direction.includes("s")) newHeight += dy;
    if (direction.includes("n")) {
      newHeight -= dy;
      newY += dy;
    }

    // Apply minimum dimensions
    newWidth = Math.max(this.minWidth, newWidth);
    newHeight = Math.max(this.minHeight, newHeight);

    // Update dimensions and position
    this.setDimensions(newX, newY, newWidth, newHeight);
  }

  stopResizing() {
    this.isResizing = false;
    this.resizeHandle = null;
  }
}
