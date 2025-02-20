export default class TouchHandler {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.lastTouchEnd = 0;
    this.homeScreen = document.querySelector(".home-screen");
    this.isDragging = false;
    this.startScrollY = 0;
    this.homeIndicator = document.querySelector(".home-indicator");
    this.swipeThreshold = 50; // Minimum distance to trigger home gesture
    this.isMouseDown = false;

    // Add corner detection properties
    this.cornerThreshold = 50; // Distance from corner to trigger gesture
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    this.deviceContainer = document.querySelector(".device-container");
    this.screenBounds = null;

    // Track gesture state
    this.isCornerGesture = false;
    this.cornerGestureType = null;

    this.initializeHandlers();
    this.updateScreenBounds();
  }

  initializeHandlers() {
    document.addEventListener("touchstart", (e) => this.handleTouchStart(e));
    document.addEventListener("touchmove", (e) => this.handleTouchMove(e));
    document.addEventListener("touchend", (e) => this.handleTouchEnd(e));

    document.addEventListener("mousedown", (e) => this.handleMouseStart(e));
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    document.addEventListener("mouseup", (e) => this.handleMouseEnd(e));

    document.addEventListener("contextmenu", (e) => e.preventDefault());

    this.homeIndicator.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Left click only
        this.handleHomeStart(this.convertMouseToTouch(e));
        e.stopPropagation();
      }
    });

    this.homeIndicator.addEventListener("mousemove", (e) => {
      if (this.isMouseDown) {
        this.handleHomeMove(this.convertMouseToTouch(e));
        e.stopPropagation();
      }
    });

    this.homeIndicator.addEventListener("mouseup", (e) => {
      if (e.button === 0) {
        this.handleHomeEnd(this.convertMouseToTouch(e));
        e.stopPropagation();
      }
    });

    document.addEventListener(
      "touchmove",
      (e) => {
        if (e.target.closest(".home-screen")) {
          e.preventDefault();
        }
      },
      { passive: false }
    );

    // Add home indicator touch handlers
    this.homeIndicator.addEventListener("touchstart", (e) => {
      this.handleHomeStart(e);
      e.stopPropagation();
    });

    this.homeIndicator.addEventListener("touchmove", (e) => {
      this.handleHomeMove(e);
      e.stopPropagation();
    });

    this.homeIndicator.addEventListener("touchend", (e) => {
      this.handleHomeEnd(e);
      e.stopPropagation();
    });

    // Add click handler for desktop testing
    this.homeIndicator.addEventListener("click", () => {
      this.emitGesture("home");
    });

    // Add resize handler to update bounds
    window.addEventListener("resize", () => this.updateScreenBounds());
  }

  convertMouseToTouch(mouseEvent) {
    return {
      touches: [
        {
          clientX: mouseEvent.clientX,
          clientY: mouseEvent.clientY,
        },
      ],
      changedTouches: [
        {
          clientX: mouseEvent.clientX,
          clientY: mouseEvent.clientY,
        },
      ],
      preventDefault: () => mouseEvent.preventDefault(),
      stopPropagation: () => mouseEvent.stopPropagation(),
    };
  }

  handleMouseStart(e) {
    if (e.button === 0) {
      // Left click only
      this.isMouseDown = true;
      this.handleTouchStart(this.convertMouseToTouch(e));
    }
  }

  handleMouseMove(e) {
    if (this.isMouseDown) {
      this.handleTouchMove(this.convertMouseToTouch(e));
    }
  }

  handleMouseEnd(e) {
    if (e.button === 0) {
      this.isMouseDown = false;
      this.handleTouchEnd(this.convertMouseToTouch(e));
    }
  }

  handleTouchStart(e) {
    if (e.touches) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    } else {
      this.touchStartX = e.clientX;
      this.touchStartY = e.clientY;
    }
    this.startScrollY = this.homeScreen.scrollTop;
    this.isDragging = true;

    // Check for corner gesture
    const corner = this.checkCornerGesture(
      e.touches ? e.touches[0].clientX : e.clientX,
      e.touches ? e.touches[0].clientY : e.clientY
    );

    if (corner) {
      this.isCornerGesture = true;
      this.cornerGestureType = corner;
      e.preventDefault();
    }
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const currentY = e.touches ? e.touches[0].clientY : e.clientY;
    const xDiff = this.touchStartX - currentX;
    const yDiff = this.touchStartY - currentY;

    // Handle corner gestures
    if (this.isCornerGesture) {
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      if (distance > this.cornerThreshold) {
        switch (this.cornerGestureType) {
          case "top-left":
            this.emitGesture("app-switcher");
            break;
          case "top-right":
            this.emitGesture("control-center");
            break;
          case "bottom-left":
            this.emitGesture("quick-app-switch-back");
            break;
          case "bottom-right":
            this.emitGesture("quick-app-switch-forward");
            break;
        }
        this.isCornerGesture = false;
        return;
      }
    }

    if (Math.abs(yDiff) > Math.abs(xDiff)) {
      this.homeScreen.scrollTop = this.startScrollY + yDiff;
    } else {
      if (xDiff > 0) {
        this.emitGesture("swipe-left");
      } else {
        this.emitGesture("swipe-right");
      }
    }
  }

  handleTouchEnd(e) {
    this.isDragging = false;
    const now = Date.now();

    if (now - this.lastTouchEnd < 300) {
      this.emitGesture("double-tap");
      e.preventDefault();
    }

    this.lastTouchEnd = now;
    this.touchStartX = null;
    this.touchStartY = null;

    // Reset corner gesture state
    this.isCornerGesture = false;
    this.cornerGestureType = null;
  }

  handleHomeStart(e) {
    this.touchStartY = e.touches[0].clientY;
    this.homeIndicator.classList.add("active");
  }

  handleHomeMove(e) {
    if (!this.touchStartY) return;

    const currentY = e.touches[0].clientY;
    const deltaY = this.touchStartY - currentY;

    // If swiping up
    if (deltaY > 0) {
      this.homeIndicator.style.opacity = Math.max(
        0.3,
        1 - deltaY / this.swipeThreshold
      );
    }
  }

  handleHomeEnd(e) {
    if (!this.touchStartY) return;

    const deltaY = this.touchStartY - e.changedTouches[0].clientY;

    // If swiped up far enough
    if (deltaY > this.swipeThreshold) {
      this.emitGesture("home");
    }

    // Reset
    this.touchStartY = null;
    this.homeIndicator.classList.remove("active");
    this.homeIndicator.style.opacity = "";
  }

  emitGesture(type) {
    const event = new CustomEvent("gesture", {
      detail: { type },
    });
    document.dispatchEvent(event);
  }

  updateScreenBounds() {
    this.screenBounds = this.deviceContainer.getBoundingClientRect();
  }

  checkCornerGesture(x, y) {
    const bounds = this.screenBounds;
    const threshold = this.cornerThreshold;

    // Convert page coordinates to device coordinates
    const deviceX = x - bounds.left;
    const deviceY = y - bounds.top;

    // Check each corner
    if (deviceY < threshold) {
      if (deviceX < threshold) {
        return "top-left";
      } else if (deviceX > bounds.width - threshold) {
        return "top-right";
      }
    } else if (deviceY > bounds.height - threshold) {
      if (deviceX < threshold) {
        return "bottom-left";
      } else if (deviceX > bounds.width - threshold) {
        return "bottom-right";
      }
    }

    return null;
  }
}
