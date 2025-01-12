import Handler from './Handler';

/**
 * Event Handler for THREE Views
 */
export default class WebGLView extends Handler {

    constructor() {
        super();

        this.debug = this.experience.debug;
    }


    // Update on every tick

    update(state) {
        this.onFrame(state);
    }


    // Inheritance

    onFrame() { }

    onEnter() { }

    onLeave() { }
}
