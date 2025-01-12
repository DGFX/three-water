import { EventEmitter } from 'events';
import Experience from '../Experience';
import { debounce } from '../helpers/utils';

export default class Sizes extends EventEmitter {

  static instance;

  constructor() {
    super();

    this.experience = new Experience();
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.frustrum = 4.5;

    window.addEventListener('resize', () => {
      this._handleResize();
    });

    window.addEventListener('orientationchange', () => {
      this._handleResize();
    })
  }


  static getInstance() {
    if (!Sizes.instance) {
      Sizes.instance = new Sizes();
    }

    return Sizes.instance;
  }


  _handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.frustrum = 4.5;

    this.emit('resize');
  }


  dispose() { }
}
