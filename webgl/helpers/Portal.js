import { Vector4 } from 'three';

/**
 * TODO:
 * Fix portal for multiple elements
 */
export default class Portal {
    constructor({ target, width, height, clientRect, renderer }) {
        this.$target = target;
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.clientRect = clientRect;
        this.renderer = renderer.webglRenderer;

        // Setup Scissor
        this.renderer.setScissorTest(true);


        // Scissor dimensions
        this.scissor = new Vector4();

        this.update();
    }

    update(canvasWidth, canvasHeight, clientRect, scroll) {

        // Update dimensions if provided
        if (canvasWidth) this.canvasWidth = canvasWidth;
        if (canvasHeight) this.canvasHeight = canvasHeight;
        if (clientRect) this.clientRect = clientRect;

        // Calculate the position and size of the scissor
        const scissorX = this.clientRect.left;
        const scissorY = this.canvasHeight - (this.clientRect.top - scroll) - this.clientRect.height;
        const scissorWidth = this.clientRect.width;
        const scissorHeight = this.clientRect.height;


        // Update scissor dimensions
        this.scissor.set(scissorX, scissorY, scissorWidth, scissorHeight);

        // Set the scissor
        this.renderer.setScissor(this.scissor);

        // Set the viewport to match the scissor
        this.renderer.setViewport(this.scissor);
    }

    getScissorDimensions() {
        return {
            x: this.scissor.x,
            y: this.scissor.y,
            width: this.scissor.z,
            height: this.scissor.w
        };
    }
}