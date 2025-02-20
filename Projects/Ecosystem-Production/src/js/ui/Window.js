export default class Window {
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

    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
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

  setContent(content) {
    this.element.querySelector(".window-content").innerHTML = content;
  }
}
