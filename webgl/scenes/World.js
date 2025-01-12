import Handler from '../abstract/Handler.js';
import * as THREE from 'three';
import Water from '../components/Water/Water.js';

export default class World extends Handler {
  static instance;

  static get id() { return 'World' }

  constructor() {
    super(World.id);

    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.resources = this.experience.resources;

    this._setupWater();
    // this._setupLight();
  }

  static getInstance() {
    if (!World.instance) {
      World.instance = new World();
    }

    return World.instance;
  }

  _setupWater() {
    this.water = new Water(this.experience);
  }

  _setupLight() {
    const texture = this.resources.items.hdri.hdri;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    this.scene.environment = texture;
    this.scene.environmentIntensity = 0.7;
    this.scene.background = texture;
  }

  resize() { }

  update(state) {
    if (this.water) this.water.update(state.time);
  }

  dispose() { }
}