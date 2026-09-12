"use client";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private humNodes: { osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null = null;

  private init() {
    if (this.ctx) return;
    if (typeof window === "undefined") return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    try {
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("AudioContext initialization failed:", e);
    }
  }

  public toggleMute(forceState?: boolean): boolean {
    this.init();
    if (!this.ctx) return true;

    const nextMuted = forceState !== undefined ? forceState : !this.isMuted;
    this.isMuted = nextMuted;

    if (nextMuted) {
      this.stopHum();
      if (this.ctx.state === "running") {
        this.ctx.suspend();
      }
    } else {
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      this.startHum();
    }

    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state === "suspended") return;

    const ctx = this.ctx;
    
    // Very subtle, fast mechanical click (like a camera lens ring turning)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.003, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.02);
  }

  public playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state === "suspended") return;

    const ctx = this.ctx;

    // Clean structural click
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  public playDetent() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state === "suspended") return;

    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(850, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.008);

    gain.gain.setValueAtTime(0.004, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.01);
  }

  public playAcquire() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.ctx.state === "suspended") return;

    const ctx = this.ctx;

    // Heavy mechanical shutter release click
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(180, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.25);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(90, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();
    
    osc1.stop(ctx.currentTime + 0.35);
    osc2.stop(ctx.currentTime + 0.35);
  }

  private startHum() {
    if (this.isMuted || !this.ctx || this.humNodes) return;
    const ctx = this.ctx;

    try {
      // Create a background noise / projector-hum synthesizer
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(45, ctx.currentTime); // Low detuned hum

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(45.6, ctx.currentTime); // Detuned chorusing

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(60, ctx.currentTime); // Deep warm roll-off

      // Set extremely low amplitude so it is a felt vibration rather than an annoying sound
      gain.gain.setValueAtTime(0.015, ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      this.humNodes = { osc1, osc2, gain };
    } catch (e) {
      console.warn("Failed to start hum nodes:", e);
    }
  }

  private stopHum() {
    if (!this.humNodes) return;
    try {
      this.humNodes.osc1.stop();
      this.humNodes.osc2.stop();
      this.humNodes.osc1.disconnect();
      this.humNodes.osc2.disconnect();
      this.humNodes.gain.disconnect();
    } catch (e) {
      // already stopped
    }
    this.humNodes = null;
  }
}

export const audioEngine = new AudioEngine();
