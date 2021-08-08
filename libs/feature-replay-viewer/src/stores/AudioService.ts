// HTML5 Audio supports time stretching without pitch changing (otherwise sounds like night core / chipmunks dying).
// Chromium's implementation of <audio> is the best.
// HTML5 Audio currentTime sucks though in terms of accuracy

import { GameClock } from "../clocks/GameClock";
import { action, computed, makeObservable, observable } from "mobx";

export class AudioService implements GameClock {
  context: AudioContext;

  // Just like in osu!, we can change the volume of music and samples separately
  musicGain: GainNode;
  samplesGain: GainNode;
  masterGain: GainNode;

  musicUrl?: string;
  musicBuffer?: AudioBuffer;

  song?: MediaElementAudioSourceNode;

  sampleBuffers: { [key: string]: AudioBuffer };

  // In seconds
  sampleWindow = 0.1;
  schedulePointer = 0;

  playbackRate = 1;
  isPlaying = false;

  constructor() {
    this.context = new AudioContext();

    this.masterGain = this.context.createGain();
    this.musicGain = this.context.createGain();
    this.musicGain.connect(this.masterGain);
    this.samplesGain = this.context.createGain();
    this.samplesGain.connect(this.masterGain);
    this.masterGain.connect(this.context.destination);

    // Just like how I play osu! :) TODO: Make it changeable
    this.masterGain.gain.value = 0.8;
    this.musicGain.gain.value = 0.35;
    this.samplesGain.gain.value = 1.0;

    this.sampleBuffers = {};
    makeObservable(this, {
      start: action,
      pause: action,
      isPlaying: observable,
      playbackRate: observable,
      currentSpeed: computed,
    });
  }

  async loadSong(url: string): Promise<boolean> {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.src = url;
    this.song = this.context.createMediaElementSource(audio);
    this.song.connect(this.musicGain);
    return true;
  }

  /**
   * Returns in seconds
   */
  getMusicDuration(): number {
    return (this.song?.mediaElement.duration ?? 0) * 1000;
  }

  start() {
    // TODO: ?
    this.context.resume();
    this.song?.mediaElement.play();
    this.isPlaying = true;
  }

  pause() {
    if (this.song) {
      this.song.mediaElement.pause();
      this.isPlaying = false;
      this.schedulePointer = 0;
    }
  }

  changePlaybackRate(newPlaybackRate: number) {
    const wasPlaying = this.isPlaying;
    if (this.song) {
      if (wasPlaying) this.pause();
      this.playbackRate = newPlaybackRate;
      this.song.mediaElement.playbackRate = newPlaybackRate;
      if (wasPlaying) this.start();
    }
  }

  // Don't know if this is accurate *enough*
  currentTime() {
    return (this.song?.mediaElement.currentTime ?? 0) * 1000;
  }

  seekTo(toInMs: number) {
    const wasPlaying = this.isPlaying;
    if (this.song) {
      // We also reset the schedulePointer to 0, and maybe possibility to stop samples.
      if (wasPlaying) this.pause();
      this.song.mediaElement.currentTime = toInMs / 1000;
      if (wasPlaying) this.start();
    }
  }

  get currentSpeed() {
    return this.playbackRate;
  }

  getCurrentTime(): number {
    return this.currentTime(); // was given in seconds
  }

  togglePlaying(): boolean {
    if (this.isPlaying) this.pause();
    else this.start();
    return this.isPlaying;
  }

  setSpeed(speed: number): void {
    this.changePlaybackRate(speed);
  }

  get maxTime() {
    return this.getMusicDuration();
  }
}