import * as THREE from 'three';
import { EventEmitter } from 'events';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

export default class Resources extends EventEmitter {

  static instance;

  constructor(assets) {
    super();

    this.assets = assets;

    this.items = {
      gltfModel: {},
      texture: {},
      cubeTexture: {},
      audio: {},
      font: {},
    };


    this.queue = this.assets.length;
    this.loaded = 0;

    this._setLoaders();
    this._startLoading();
  }

  static getInstance(assets) {
    if (!Resources.instance) {
      Resources.instance = new Resources(assets);
    }

    return Resources.instance;
  }

  _setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader(this.loadingManager);
    this.loaders.dracoLoader = new DRACOLoader();
    this.loaders.dracoLoader.setDecoderPath('/draco/');
    this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);

    this.loaders.hdriLoader = new RGBELoader();

    this.loaders.textureLoader = new THREE.TextureLoader(this.loadingManager);
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader(
      this.loadingManager
    );
    this.loaders.audioLoader = new THREE.AudioLoader(this.loadingManager);
    this.loaders.fontLoader = new FontLoader(this.loadingManager);
  }

  _startLoading() {
    for (const asset of this.assets) {
      if (asset.type === 'gltfModel') {
        this.loaders.gltfLoader.load(asset.path, (file) => {
          this._singleAssetLoaded(asset, file);
        });
      } else if (asset.type === 'texture') {
        this.loaders.textureLoader.load(asset.path, (file) => {
          this._singleAssetLoaded(asset, file);
        });
      } else if (asset.type === 'cubeTexture') {
        this.loaders.cubeTextureLoader.load(asset.path, (file) => {
          this._singleAssetLoaded(asset, file);
        });
      } else if (asset.type === 'hdri') {
          this.loaders.hdriLoader.load(asset.path, (buffer) => {
            this._singleAssetLoaded(asset, buffer);
          });
      } else if (asset.type === 'audio') {
        this.loaders.audioLoader.load(asset.path, (buffer) => {
          this._singleAssetLoaded(asset, buffer);
        });
      } else if (asset.type === 'font') {
        this.loaders.fontLoader.load(asset.path, (buffer) => {
          this._singleAssetLoaded(asset, buffer);
        });
      } else if (asset.type === 'video') {
        this.video = {};
        this.videoTexture = {};

        this.video[asset.name] = document.createElement('video');
        this.video[asset.name].src = asset.path;
        this.video[asset.name].muted = true;
        this.video[asset.name].playsInline = true;
        this.video[asset.name].autoplay = true;
        this.video[asset.name].loop = true;
        this.video[asset.name].play();

        this.videoTexture[asset.name] = new THREE.VideoTexture(
          this.video[asset.name]
        );
        this.videoTexture[asset.name].flipY = true;
        this.videoTexture[asset.name].minFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].magFilter = THREE.NearestFilter;
        this.videoTexture[asset.name].generateMipmaps = false;
        this.videoTexture[asset.name].colorSpace = THREE.SRGBColorSpace;

        this._singleAssetLoaded(asset, this.videoTexture[asset.name]);
      }
    }
  }

  _singleAssetLoaded(asset, file) {
    this.items[asset.type] = { ...this.items[asset.type], [asset.name]: file };
    this.loaded++;

    if (this.loaded === this.queue) {
      this.emit('ready');
    }
  }


  dispose() { }
}
