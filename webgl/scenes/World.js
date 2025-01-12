import Handler from '../abstract/Handler.js';
import * as THREE from 'three';

export default class World extends Handler {
  static instance;

  static get id() { return 'World' }

  constructor() {
    super(World.id);

    this.scene = this.experience.scene;

    this.createCube();
  }

  static getInstance() {
    if (!World.instance) {
      World.instance = new World();
    }

    return World.instance;
  }

  createCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshNormalMaterial();
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  resize() { }

  update(state) { }

  dispose() { }
}