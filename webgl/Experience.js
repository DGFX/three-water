// Three.js

import * as THREE from 'three';
import Camera from './Camera.js';
import Renderer from './Renderer.js';


// Utils

import Debug from './utils/Debug.js';
import Sizes from './utils/Sizes.js';
import Mouse from './utils/Mouse.js';
import Time from './utils/Time.js';
import PerformanceMonitor from './utils/PerformanceMonitor.js';
import Resources from './utils/Resources.js';
import { debounce } from './helpers/utils'


// World

import World from './scenes/World.js';


export default class Experience {
  static instance;


  constructor(canvas, data) {
    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;

    this.canvas = canvas;
    this.data = data;

    // Setup

    this._init();
  }


  static getComponent(htmlTarget) {
    const uuid = htmlTarget.getAttribute('data-uuid');
    let el;

    Experience.instance.scene.traverse(_child => {
      if (_child instanceof THREE.Mesh && _child.uuid === uuid) {
        el = _child;
      };
    })

    return el;
  }


  static add(_mesh) {
    Experience.instance.scene.add(_mesh);
  }


  static remove(_mesh) {
    Experience.instance.scene.remove(_mesh);
  }


  _init() {
    this.debug = Debug.getInstance();
    this.sizes = Sizes.getInstance();
    this.time = Time.getInstance();
    this.mouse = Mouse.getInstance();
    this.scene = new THREE.Scene();
    this.resources = this.data && this.data.assets ? Resources.getInstance(this.data.assets) : null;
    this.camera = Camera.getInstance();
    this.renderer = Renderer.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();

    if (this.data && this.data.assets) {
      this.resources.on('ready', () => {
        this.world = World.getInstance();
        this.renderer.onWorldLoaded();
      })
    } else {
      this.world = World.getInstance();
      this.renderer.onWorldLoaded();
    }

    this.sizes.on('resize', () => {
      this.resize();
    });

    this.time.on('update', (time, delta) => {
      this.update({
        gl: this.renderer.webglRenderer,
        scene: this.scene,
        camera: this.camera.target,
        time,
        delta
      });
    });
  }


  scroll(e) {
    if (this.world) this.world.scroll(e);
  }


  resize() {
    if (this.camera.target) debounce(this.camera.resize(), 500);
    if (this.renderer.webglRenderer) debounce(this.renderer.resize(), 500);
    if (this.world) debounce(this.world.resize(), 500);
  }


  update(state) {
    if (this.debug.active) this.debug.stats.update();
    if (this.camera.target) this.camera.update();
    if (this.renderer.webglRenderer) this.renderer.update(state);
    if (this.world) this.world.update(state);
  }


  dispose() {
    // dispose geometries and materials in scene
    this.scene.traverse(o => {

      if (o.geometry) {
        o.geometry.dispose();
      }

      if (o.material) {
        if (o.material.length) {
          for (let i = 0; i < o.material.length; ++i) {
            o.material[i].dispose();
          }
        }
        else {
          o.material.dispose();
        }
      }

      this.camera.dispose();
      this.renderer.dispose();
      this.debug.dispose();
      this.sizes.dispose();
      this.time.dispose();
      this.mouse.dispose();
      this.resources.dispose();
      this.performanceMonitor.dispose();

      this.canvas.remove();

      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.debug = null;
      this.sizes = null;
      this.time = null;
      this.mouse = null;
      this.resources = null;
      this.performanceMonitor = null;
    })
  }
}
