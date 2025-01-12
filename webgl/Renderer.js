import Handler from './abstract/Handler.js';
import * as THREE from 'three';

// Post Process
import PostProcessing from './utils/postprocessing';

export default class Renderer extends Handler {

  static instance;

  static get id() { return 'Renderer' }

  constructor() {
    super(Renderer.id);


    this.debug = this.experience.debug;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;


    this.options = {
      postprocessing: false,
      canvas: this.canvas,
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      clearColor: 0x000000,
      toneMapping: 'NoToneMapping',
      toneMappingExposure: 1,
      shadows: false,
      ...this.data.options
    }


    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.gui.addFolder('renderer')
    }


    if (this.canvas) {
      this._init();
    } else {
      console.warn('Canvas not found')
    }
  }


  static getInstance(_options) {
    if (!Renderer.instance) {
      Renderer.instance = new Renderer(_options);
    }

    return Renderer.instance;
  }


  _init() {
    this.webglRenderer = new THREE.WebGLRenderer({
      canvas: this.options.canvas,
      powerPreference: this.options.powerPreference,
      antialias: this.options.antialias,
      alpha: this.options.alpha,
      preserveDrawingBuffer: this.options.preserveDrawingBuffer,
      clearColor: this.options.clearColor,
      toneMapping: THREE[this.options.toneMapping],
      toneMappingExposure: this.options.toneMappingExposure
    });

    if (this.options.shadows) {
      this.webglRenderer.shadowMap.enabled = true;
      this.webglRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    this.webglRenderer.setSize(this.sizes.width, this.sizes.height);
    this.webglRenderer.setPixelRatio(this.sizes.pixelRatio);

    this._setDebug();
  }


  _setPostProcess() {
    this.postprocessing = PostProcessing.getInstance({
      experience: this.experience,
      renderer: this.webglRenderer,
      options: this.options.postprocessing
    });
  }


  onFrame() { }


  render() {
    if (!this.webglRenderer) return;
    this.webglRenderer.render(this.scene, this.camera.target);
  }


  onWorldLoaded() {
    if (this.options.postprocessing) this._setPostProcess();
  }


  resize() {
    if (!this.webglRenderer) return;
    this.webglRenderer.setSize(this.sizes.width, this.sizes.height);
    this.webglRenderer.setPixelRatio(this.sizes.pixelRatio);

    if (this.options.postprocessing) this.postprocessing.resize();
  }


  update(state) {
    if (!this.webglRenderer) return;
    this.webglRenderer.clear();

    this.debug.active && this.debug.stats.beforeRender();

    this.onFrame();

    if (this.postprocessing) {
      this.postprocessing.update(state)
    } else {
      this.render();
    };

    this.debug.active && this.debug.stats.afterRender();
  }


  _setDebug() {
    // Debug
    if (this.debug.active) {
      // Set Stats
      this.debug.stats.setRenderPanel(this.webglRenderer.getContext());

      // Set dat.GUI
      this.debugFolder
        .add(
          this.webglRenderer,
          'toneMapping',
          {
            'NoToneMapping': THREE.NoToneMapping,
            'LinearToneMapping': THREE.LinearToneMapping,
            'ReinhardToneMapping': THREE.ReinhardToneMapping,
            'CineonToneMapping': THREE.CineonToneMapping,
            'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
          }
        )
        .onChange(() => {
          this.scene.traverse((_child) => {
            if (_child instanceof THREE.Mesh)
              _child.material.needsUpdate = true
          })
        })

      this.debugFolder
        .add(
          this.webglRenderer,
          'toneMappingExposure'
        )
        .min(0)
        .max(10)
    }
  }


  dispose() {
    this.renderer.webglRenderer && this.renderer.webglRenderer.renderLists.dispose();
    this.postprocessing.dispose();
  }
}
