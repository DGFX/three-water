import Experience from '../Experience.js';


/**
 * Handler for THREE views
 */
export default class Handler {

    constructor(id) {

        if (new.target === Handler) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        // Global instances

        this.experience = new Experience();

        this.time = this.experience.time;

        this.sizes = this.experience.sizes;


        // Data passed from project config

        const data = this.experience.data && this.experience.data[id];

        this.data = data || {};
    }

    update() { };

    resize() { };

    scroll() { };

    dispose() { };
}
