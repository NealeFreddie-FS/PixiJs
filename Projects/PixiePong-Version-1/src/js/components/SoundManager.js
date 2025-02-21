export default class SoundManager {
  constructor() {
    // Initialize Howler with suspended state
    Howler.autoUnlock = false;
    Howler.autoSuspend = false;

    this.initialized = false;
    // Create simple beep sounds for game effects
    this.sounds = {
      // UI Sounds
      menuHover: new Howl({
        src: [this.createBeepSound(220, 0.1)], // 220Hz beep
        format: ["wav"],
        volume: 0.3,
      }),
      menuClick: new Howl({
        src: [this.createBeepSound(440, 0.1)], // 440Hz beep
        format: ["wav"],
        volume: 0.4,
      }),
      menuBack: new Howl({
        src: [this.createBeepSound(330, 0.1)], // 330Hz beep
        format: ["wav"],
        volume: 0.4,
      }),

      // Game Sounds
      paddle: new Howl({
        src: [this.createBeepSound(880, 0.1)], // 880Hz beep
        format: ["wav"],
        volume: 0.5,
      }),
      score: new Howl({
        src: [this.createBeepSound(660, 0.2)], // 660Hz beep
        format: ["wav"],
        volume: 0.7,
      }),
      win: new Howl({
        src: [this.createBeepSound(1100, 0.3)], // 1100Hz beep
        format: ["wav"],
        volume: 1.0,
      }),
      lose: new Howl({
        src: [this.createBeepSound(110, 0.3)], // 110Hz beep
        format: ["wav"],
        volume: 0.8,
      }),
      wallHit: new Howl({
        src: [this.createBeepSound(440, 0.05)], // 440Hz short beep
        format: ["wav"],
        volume: 0.4,
      }),

      // Music with improved melodies
      menuMusic: new Howl({
        src: [this.createMusic("menu")],
        format: ["wav"],
        volume: 0.3,
        loop: true,
      }),
      gameMusic: new Howl({
        src: [this.createMusic("game")],
        format: ["wav"],
        volume: 0.3,
        loop: true,
      }),
    };

    this.currentMusic = null;
    this.loaded = false;
  }

  // Modified to support continuous tones for music
  createBeepSound(frequency, duration, isMusic = false) {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, numSamples * 2, true);

    const volume = isMusic ? 0.3 : 0.5;
    for (let i = 0; i < numSamples; i++) {
      let sample;
      if (isMusic) {
        // Create a more complex waveform for music
        sample =
          volume *
          (0.5 * Math.sin((2 * Math.PI * frequency * i) / sampleRate) +
            0.3 * Math.sin((4 * Math.PI * frequency * i) / sampleRate) +
            0.2 * Math.sin((6 * Math.PI * frequency * i) / sampleRate));
      } else {
        sample = volume * Math.sin((2 * Math.PI * frequency * i) / sampleRate);
      }
      const int16Sample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
      view.setInt16(44 + i * 2, int16Sample, true);
    }

    const blob = new Blob([view], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  }

  createMusic(type) {
    const sampleRate = 44100;
    const bpm = 120;
    const beatLength = Math.floor((sampleRate * 60) / bpm);
    const barLength = beatLength * 4;
    const numBars = 4;
    const totalSamples = barLength * numBars;

    // Create WAV header
    const buffer = new ArrayBuffer(44 + totalSamples * 2);
    const view = new DataView(buffer);

    // WAV header setup
    this.writeWavHeader(view, totalSamples);

    // Define notes (frequencies) for melodies
    const menuNotes =
      type === "menu"
        ? [
            440,
            550,
            660,
            550, // A4, C#5, E5, C#5
            440,
            550,
            880,
            660, // A4, C#5, A5, E5
            440,
            550,
            660,
            550, // Repeat
            440,
            330,
            440,
            550, // End
          ]
        : [
            330,
            440,
            550,
            440, // E4, A4, C#5, A4
            330,
            440,
            660,
            550, // E4, A4, E5, C#5
            330,
            440,
            550,
            440, // Repeat
            330,
            220,
            330,
            440, // End
          ];

    // Generate samples
    for (let i = 0; i < totalSamples; i++) {
      const time = i / sampleRate;
      const beat = Math.floor(i / beatLength);
      const noteIndex = Math.floor(beat / 2) % menuNotes.length;
      const frequency = menuNotes[noteIndex];

      // Create a more complex waveform
      let sample = 0;

      // Main note (sine wave)
      sample += 0.3 * Math.sin(2 * Math.PI * frequency * time);

      // Octave higher (square wave)
      sample += 0.1 * Math.sign(Math.sin(4 * Math.PI * frequency * time));

      // Sub-bass (triangle wave)
      const subFreq = frequency / 2;
      sample +=
        (0.2 * Math.asin(Math.sin(2 * Math.PI * subFreq * time))) / Math.PI;

      // Add envelope
      const beatProgress = (i % beatLength) / beatLength;
      const envelope = Math.pow(1 - beatProgress, 2);
      sample *= envelope * 0.5; // Reduce overall volume

      // Write to buffer
      const int16Sample = Math.max(-1, Math.min(1, sample)) * 0x7fff;
      view.setInt16(44 + i * 2, int16Sample, true);
    }

    const blob = new Blob([view], { type: "audio/wav" });
    return URL.createObjectURL(blob);
  }

  writeWavHeader(view, numSamples) {
    const writeString = (view, offset, string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, "data");
    view.setUint32(40, numSamples * 2, true);
  }

  loadSounds() {
    let loadedCount = 0;
    const totalSounds = Object.keys(this.sounds).length;

    return new Promise((resolve) => {
      Object.entries(this.sounds).forEach(([name, sound]) => {
        sound.once("load", () => {
          loadedCount++;
          if (loadedCount === totalSounds) {
            this.loaded = true;
            resolve();
          }
        });

        sound.once("loaderror", (id, error) => {
          console.error(`Error loading sound ${name}:`, error);
        });
      });
    });
  }

  async init() {
    // Load sounds but don't play yet
    await this.loadSounds();
    return this;
  }

  // New method to unlock audio
  async unlockAudio() {
    if (!this.initialized) {
      // Resume AudioContext after user interaction
      await Howler.ctx.resume();
      this.initialized = true;
    }
  }

  // Modify sound methods to check for initialization
  async playSound(soundName) {
    await this.unlockAudio();
    if (this.sounds[soundName] && this.loaded) {
      this.sounds[soundName].play();
    }
  }

  async playMenuMusic() {
    await this.unlockAudio();
    if (this.loaded) {
      this.stopMusic();
      this.currentMusic = this.sounds.menuMusic;
      this.currentMusic.play();
    }
  }

  // Update all play methods to use unlockAudio
  async playHover() {
    await this.unlockAudio();
    this.sounds.menuHover.play();
  }

  async playClick() {
    await this.unlockAudio();
    this.sounds.menuClick.play();
  }

  async playBack() {
    await this.unlockAudio();
    this.sounds.menuBack.play();
  }

  // Game Sound Methods
  async playPaddleHit() {
    await this.playSound("paddle");
  }

  async playScore() {
    await this.playSound("score");
  }

  async playWin() {
    await this.playSound("win");
  }

  async playLose() {
    await this.playSound("lose");
  }

  async playWallHit() {
    await this.playSound("wallHit");
  }

  // Music Methods
  async playGameMusic() {
    await this.playSound("gameMusic");
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
    }
  }

  // Volume Controls
  setMasterVolume(volume) {
    Howler.volume(volume);
  }

  setMusicVolume(volume) {
    this.sounds.menuMusic.volume(volume);
    this.sounds.gameMusic.volume(volume);
  }

  setSFXVolume(volume) {
    // Set volume for all sound effects
    Object.keys(this.sounds).forEach((key) => {
      if (!key.includes("Music")) {
        this.sounds[key].volume(volume);
      }
    });
  }
}
