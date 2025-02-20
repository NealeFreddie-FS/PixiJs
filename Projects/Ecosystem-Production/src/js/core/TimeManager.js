export default class TimeManager {
  constructor(simulation) {
    this.simulation = simulation;
    // Time settings
    this.timeScale = 1; // 1 second real time = 1 minute game time
    this.dayLengthInMinutes = 24 * 60; // 24 hours in minutes
    this.startTime = 6 * 60; // Start at 6:00 AM
    this.currentTime = this.startTime;
    this.currentDay = 1;

    // Time of day settings
    this.sunriseTime = 6 * 60; // 6:00 AM
    this.sunsetTime = 18 * 60; // 6:00 PM
    this.dawnDuration = 60; // 1 hour transition
    this.duskDuration = 60; // 1 hour transition

    // Lighting settings
    this.dayLightIntensity = 1.0;
    this.nightLightIntensity = 0.2;
    this.currentLightLevel = this.calculateLightLevel();
  }

  update(deltaTime) {
    // Convert deltaTime from milliseconds to game minutes
    const gameMinutes = (deltaTime / 1000) * this.timeScale * 60;

    // Update current time
    this.currentTime += gameMinutes;

    // Handle day change
    while (this.currentTime >= this.dayLengthInMinutes) {
      this.currentTime -= this.dayLengthInMinutes;
      this.currentDay++;
    }

    // Handle negative time (shouldn't normally happen, but just in case)
    while (this.currentTime < 0) {
      this.currentTime += this.dayLengthInMinutes;
      this.currentDay--;
    }

    // Update lighting
    this.currentLightLevel = this.calculateLightLevel();
  }

  calculateLightLevel() {
    const time = this.currentTime;

    // Dawn transition
    if (
      time >= this.sunriseTime - this.dawnDuration &&
      time < this.sunriseTime
    ) {
      const progress =
        (time - (this.sunriseTime - this.dawnDuration)) / this.dawnDuration;
      return (
        this.nightLightIntensity +
        (this.dayLightIntensity - this.nightLightIntensity) * progress
      );
    }

    // Dusk transition
    if (time >= this.sunsetTime && time < this.sunsetTime + this.duskDuration) {
      const progress = (time - this.sunsetTime) / this.duskDuration;
      return (
        this.dayLightIntensity +
        (this.nightLightIntensity - this.dayLightIntensity) * progress
      );
    }

    // Day or night
    return time >= this.sunriseTime && time < this.sunsetTime
      ? this.dayLightIntensity
      : this.nightLightIntensity;
  }

  getCurrentTimeString() {
    const hours = Math.floor(this.currentTime / 60);
    const minutes = Math.floor(this.currentTime % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  getDayPeriod() {
    const time = this.currentTime;

    // Dawn period
    if (
      time >= this.sunriseTime - this.dawnDuration &&
      time < this.sunriseTime
    ) {
      return "Dawn";
    }

    // Day period
    if (time >= this.sunriseTime && time < this.sunsetTime) {
      return "Day";
    }

    // Dusk period
    if (time >= this.sunsetTime && time < this.sunsetTime + this.duskDuration) {
      return "Dusk";
    }

    // Night period
    return "Night";
  }

  getTimeOfDayColor() {
    const period = this.getDayPeriod();
    switch (period) {
      case "Dawn":
        return "#ff7e50"; // Warm orange
      case "Day":
        return "#ffffff"; // White
      case "Dusk":
        return "#ff6b35"; // Deep orange
      case "Night":
        return "#1a237e"; // Deep blue
      default:
        return "#ffffff";
    }
  }

  // Helper methods for time conversion
  minutesToHours(minutes) {
    return minutes / 60;
  }

  hoursToMinutes(hours) {
    return hours * 60;
  }

  setTimeOfDay(hours, minutes = 0) {
    this.currentTime = this.hoursToMinutes(hours) + minutes;
    this.currentLightLevel = this.calculateLightLevel();
  }
}
