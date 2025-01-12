import Handler from './abstract/Handler.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


export default class Camera extends Handler {

  static instance;

  static get id() { return 'Camera' }

  constructor() {
    super(Camera.id);

    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    const fov = 52;
    this.options = {
      orbitControls: true,
      frustrum: 5000, // TODO: FIX FRUSTRUM
      near: 0.1,
      fov: 52,
      z: 5,
      ...this.data.options
    }

    // Setup

    this._setupCamera();
    this._addOrbitControls();
  }


  static getInstance(args) {
    if (!Camera.instance) {
      Camera.instance = new Camera(args);
    }

    return Camera.instance;
  }


  _setupCamera() {
    this.target = new THREE.PerspectiveCamera(this.options.fov, this.options.aspect, this.options.near, this.options.frustrum);
    this.target.position.set(0, 3, this.options.z);
    this.scene.add(this.target);
    this.resize();
  }


  _addOrbitControls() {
    if (!this.options.orbitControls) return;

    this.orbitControls = new OrbitControls(this.target, this.canvas);

    this.orbitControls.enableDamping = this.options.orbitControls.damping || true;
    this.orbitControls.enableZoom = this.options.orbitControls.zoom || true;
    this.orbitControls.enablePan = this.options.orbitControls.pan || true;
    this.orbitControls.enableRotate = this.options.orbitControls.rotate || true;
    this.orbitControls.maxPolarAngle = this.options.orbitControls.maxPolarAngle || Math.PI;
  }


  resize() {
    this.target.aspect = this.sizes.aspect;
    this.target.updateProjectionMatrix();
  }


  update() {
    if (this.options.orbitControls)
      this.orbitControls.update();
  }


  dispose() {
    this.target.dispose();
  }
}
