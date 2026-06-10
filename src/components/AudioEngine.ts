/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmNode: OscillatorNode[] = [];
  private bgmAmp: GainNode | null = null;
  private bgmIntervalId: any = null;
  private currentBgmType: "ambient" | "tension" | "sad" | "action" | "none" = "none";
  private isMuted: boolean = false;

  constructor() {
    // Lazy initialisation of AudioContext on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.bgmAmp) {
      this.bgmAmp.gain.value = muted ? 0 : 0.15;
    }
  }

  public stopBgm() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.bgmNode.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    this.bgmNode = [];
    this.currentBgmType = "none";
  }

  public playBgm(type: "ambient" | "tension" | "sad" | "action") {
    this.initCtx();
    if (this.isMuted) return;
    if (this.currentBgmType === type) return;

    this.stopBgm();
    this.currentBgmType = type;

    if (!this.ctx) return;

    const amp = this.ctx.createGain();
    amp.gain.value = 0.15;
    amp.connect(this.ctx.destination);
    this.bgmAmp = amp;

    if (type === "ambient") {
      // Soft ambient pulse (cyberpunk lab atmosphere)
      let step = 0;
      const notes = [110, 130.81, 146.83, 164.81, 196.00]; // Am/C/D/E/G bass harmony
      this.bgmIntervalId = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const oId = this.ctx.createOscillator();
        const gId = this.ctx.createGain();
        oId.type = "triangle";
        oId.frequency.value = notes[step % notes.length];
        step++;

        gId.gain.setValueAtTime(0, this.ctx.currentTime);
        gId.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.5);
        gId.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3);

        oId.connect(gId);
        gId.connect(amp);
        oId.start();
        oId.stop(this.ctx.currentTime + 3);
      }, 1500);

    } else if (type === "tension") {
      // Direct, fast suspense ticks + synth whine
      let step = 0;
      this.bgmIntervalId = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const cur = this.ctx.currentTime;
        const tick = this.ctx.createOscillator();
        const tickGain = this.ctx.createGain();
        tick.type = "sine";
        // alternating stressful notes
        tick.frequency.value = step % 2 === 0 ? 330 : 349.23; // E4 to F4 oscillation
        
        tickGain.gain.setValueAtTime(0.02, cur);
        tickGain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.15);

        tick.connect(tickGain);
        tickGain.connect(amp);
        tick.start();
        tick.stop(cur + 0.2);

        // Occasional high anxiety tone
        if (step % 8 === 0) {
          const high = this.ctx.createOscillator();
          const highGain = this.ctx.createGain();
          high.type = "sawtooth";
          high.frequency.setValueAtTime(880, cur);
          high.frequency.linearRampToValueAtTime(783.99, cur + 0.8); // slight down pitch
          highGain.gain.setValueAtTime(0.005, cur);
          highGain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.9);
          high.connect(highGain);
          highGain.connect(amp);
          high.start();
          high.stop(cur + 1.0);
        }
        step++;
      }, 400);

    } else if (type === "sad") {
      // Sweet piano-like melancholic chime loop
      let step = 0;
      // Beautiful sorrowful progression (C6, B5, A5, F5, E5)
      const pianoNotes = [523.25, 493.88, 440.00, 349.23, 329.63, 440.00];
      this.bgmIntervalId = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const cur = this.ctx.currentTime;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        noteOsc.type = "sine";
        noteOsc.frequency.value = pianoNotes[step % pianoNotes.length];
        
        noteGain.gain.setValueAtTime(0, cur);
        noteGain.gain.linearRampToValueAtTime(0.05, cur + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, cur + 2.0);

        noteOsc.connect(noteGain);
        noteGain.connect(amp);
        noteOsc.start();
        noteOsc.stop(cur + 2.5);
        step++;
      }, 2000);

    } else if (type === "action") {
      // Rapid clock tick, ticking down to catastrophe
      let count = 0;
      this.bgmIntervalId = setInterval(() => {
        if (!this.ctx || this.isMuted) return;
        const cur = this.ctx.currentTime;
        const pulse = this.ctx.createOscillator();
        const pulseGain = this.ctx.createGain();
        pulse.type = "triangle";
        pulse.frequency.value = 180 + (count % 4) * 40; // rising steps

        pulseGain.gain.setValueAtTime(0.06, cur);
        pulseGain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.18);

        pulse.connect(pulseGain);
        pulseGain.connect(amp);
        pulse.start();
        pulse.stop(cur + 0.25);
        count++;
      }, 200);
    }
  }

  public playSfx(type: "click" | "phone_ring" | "steiner" | "beep" | "tutturu_vo" | "fuahaha_vo" | "christina_vo" | "laser" | "fail") {
    this.initCtx();
    if (this.isMuted || !this.ctx) return;

    const cur = this.ctx.currentTime;
    const amp = this.ctx.createGain();
    amp.gain.value = 0.25;
    amp.connect(this.ctx.destination);

    if (type === "click") {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, cur);
      osc.frequency.exponentialRampToValueAtTime(300, cur + 0.08);

      gain.gain.setValueAtTime(0.08, cur);
      gain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.08);

      osc.connect(gain);
      gain.connect(amp);
      osc.start();
      osc.stop(cur + 0.1);

    } else if (type === "beep") {
      // Microwave finish / button click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, cur);

      gain.gain.setValueAtTime(0.05, cur);
      gain.gain.setValueAtTime(0.05, cur + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.12);

      osc.connect(gain);
      gain.connect(amp);
      osc.start();
      osc.stop(cur + 0.2);

    } else if (type === "phone_ring") {
      // 8-bit classic digital trill ringtone
      for (let i = 0; i < 4; i++) {
        const timeOffset = i * 0.3;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "square";
        
        osc.frequency.setValueAtTime(880, cur + timeOffset);
        osc.frequency.setValueAtTime(987.77, cur + timeOffset + 0.07);
        osc.frequency.setValueAtTime(880, cur + timeOffset + 0.14);
        osc.frequency.setValueAtTime(987.77, cur + timeOffset + 0.21);

        gain.gain.setValueAtTime(0, cur + timeOffset);
        gain.gain.linearRampToValueAtTime(0.03, cur + timeOffset + 0.02);
        gain.gain.setValueAtTime(0.03, cur + timeOffset + 0.23);
        gain.gain.exponentialRampToValueAtTime(0.0001, cur + timeOffset + 0.28);

        osc.connect(gain);
        gain.connect(amp);
        osc.start(cur + timeOffset);
        osc.stop(cur + timeOffset + 0.3);
      }

    } else if (type === "steiner") {
      // READING STEINER SHIFT EFFECT:
      // Intense synthesized sweep: pitch rising, vibrating, resonance filter, ending in electric sparks.
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const noise = this.ctx.createOscillator(); // Simulated noise via high freq sawtooth
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "triangle";
      noise.type = "sawtooth";

      filter.type = "bandpass";
      filter.Q.value = 12;

      // Starting low, rising high rapidly
      osc1.frequency.setValueAtTime(80, cur);
      osc1.frequency.linearRampToValueAtTime(2200, cur + 1.8);
      osc2.frequency.setValueAtTime(82, cur);
      osc2.frequency.linearRampToValueAtTime(2210, cur + 1.8);
      
      noise.frequency.setValueAtTime(100, cur);
      noise.frequency.setValueAtTime(8000, cur + 1.2);

      filter.frequency.setValueAtTime(100, cur);
      filter.frequency.exponentialRampToValueAtTime(4000, cur + 1.6);

      gain.gain.setValueAtTime(0, cur);
      gain.gain.linearRampToValueAtTime(0.12, cur + 0.3);
      gain.gain.linearRampToValueAtTime(0.15, cur + 1.2);
      gain.gain.setValueAtTime(0.15, cur + 1.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, cur + 2.2);

      osc1.connect(filter);
      osc2.connect(filter);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(amp);

      osc1.start(cur);
      osc2.start(cur);
      noise.start(cur);
      
      osc1.stop(cur + 2.3);
      osc2.stop(cur + 2.3);
      noise.stop(cur + 2.3);

    } else if (type === "tutturu_vo") {
      // Generated high-pitch Tutturu~! vocal chime (C6, G5, E6, C6)
      const notes = [1046.50, 783.99, 1318.51, 1046.50]; // Beautiful ringing C-major chime
      notes.forEach((freq, idx) => {
        const timeOffset = idx * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, cur + timeOffset);
        gain.gain.linearRampToValueAtTime(0.05, cur + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, cur + timeOffset + 0.25);

        osc.connect(gain);
        gain.connect(amp);
        osc.start(cur + timeOffset);
        osc.stop(cur + timeOffset + 0.28);
      });

    } else if (type === "fuahaha_vo") {
      // Simulated Hououin Kyouma vocal laugh synth sequence: fast rising-falling staccato beeps "Fu-ha-ha-ha!"
      const laughFreqs = [220, 330, 290, 440, 390, 550];
      laughFreqs.forEach((freq, idx) => {
        const timeOffset = idx * 0.15;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sawtooth";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, cur + timeOffset);
        gain.gain.linearRampToValueAtTime(0.04, cur + timeOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, cur + timeOffset + 0.16);

        osc.connect(gain);
        gain.connect(amp);
        osc.start(cur + timeOffset);
        osc.stop(cur + timeOffset + 0.18);
      });

    } else if (type === "christina_vo") {
      // Synthesized indignant assistant voice: sharp rapid double-beep scale
      const notes = [440, 493.88, 587.33];
      notes.forEach((freq, idx) => {
        const timeOffset = idx * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "triangle";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, cur + timeOffset);
        gain.gain.linearRampToValueAtTime(0.06, cur + timeOffset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, cur + timeOffset + 0.15);

        osc.connect(gain);
        gain.connect(amp);
        osc.start(cur + timeOffset);
        osc.stop(cur + timeOffset + 0.18);
      });

    } else if (type === "laser") {
      // Time leap electron beam SFX
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(2000, cur);
      osc.frequency.exponentialRampToValueAtTime(90, cur + 0.5);

      gain.gain.setValueAtTime(0.08, cur);
      gain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.5);

      osc.connect(gain);
      gain.connect(amp);
      osc.start();
      osc.stop(cur + 0.55);

    } else if (type === "fail") {
      // Heavy mechanical shock or system crash chime
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, cur);
      osc.frequency.linearRampToValueAtTime(40, cur + 0.8);
      
      sub.type = "sine";
      sub.frequency.setValueAtTime(75, cur);
      sub.frequency.linearRampToValueAtTime(30, cur + 0.8);

      gain.gain.setValueAtTime(0.12, cur);
      gain.gain.exponentialRampToValueAtTime(0.0001, cur + 0.8);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(amp);
      osc.start();
      sub.start();
      osc.stop(cur + 0.85);
      sub.stop(cur + 0.85);
    }
  }
}

export const gameAudio = new AudioEngine();
