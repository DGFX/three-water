import { Raycaster } from 'three';

export default class Events {
    constructor({
        events,
        $target,
        uniforms,
        experience
    }) {
        this.events = events;
        this.$target = $target;
        this.uniforms = uniforms;
        this.mouse = experience.mouse;
        this.camera = experience.camera;
        this.scene = experience.scene;


        if (this.events.hover) this._addHoverEvents();
        if (this.events.mousemove) this._addMouseMoveEvents();
    }


    // Set hover based on view

    _addHoverEvents() {

        if (!this.events.hover.tween) {
            throw new Error("No timeline provided");
        }

        this.uniforms.uHover = { value: 0 };

        const timeline = this.events.hover.tween.hover(this.uniforms.uHover);

        this.$target.addEventListener('mouseenter', () => {

            this.hovered = true;

            timeline.play();
        })

        this.$target.addEventListener('mouseout', () => {

            this.hovered = false;

            timeline.reverse();
        })
    }


    // Set mousemove from intersection observer

    _addMouseMoveEvents() {

        this.raycaster = new Raycaster();

        this.mouse.on('mousemove', () => {

            // Update the picking ray with the camera and mouse position

            this.raycaster.setFromCamera(this.mouse.cursorPosition, this.camera.target);


            // Calculate objects intersecting the picking ray

            const intersects = this.raycaster.intersectObjects(this.scene.children);


            // When mouse on object, animate and send intersects to uniform

            if (intersects.length > 0) {
                let obj = intersects[0].object;
                obj.material.uniforms.uMouse.value = intersects[0].uv;
            }
        })
    }


    dispose() {
        // TODO: Dispose Events Instance
    }
}