import { EventEmitter } from 'events';

import Experience from '../Experience.js';

export default class PerformanceMonitor extends EventEmitter {

  static instance;

  constructor() {
    super();

    this.experience = new Experience();
    this.renderer = this.experience.renderer;
    this.sizes = this.experience.sizes;

    this.objects = [];
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }

    return PerformanceMonitor.instance;
  }

  add(object) {
    this.objects.push(object);
  }


  // TODO: Setup Object Update management

  enableUpdate(object) {

  }


  disableUpdate(object) {

  }


  // TODO: Find the best way to detect viewport incline and decline

  onIncline() {

  }

  onDecline() {

  }

  onChange() {

  }

  onFallback() {

  }


  dispose() { }
}
