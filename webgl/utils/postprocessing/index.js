// Three
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { ShaderMaterial } from 'three';

// Effect Passes
import getEffectPasses from './effects';

export default class PostProcessing {
    constructor({ experience, renderer, options }) {
        this.experience = experience;
        this.options = options;
        this.effects = getEffectPasses();
        this.renderer = renderer;
        this.scene = this.experience.scene;
        this.sceneArray = this.experience.world.scenes;
        this.camera = this.experience.camera;
        this.sizes = this.experience.sizes;
        this.mouse = this.experience.mouse;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.resources = this.experience.resources;


        // Debug

        if (this.debug.active) this.debugFolder = this.debug.gui.addFolder('Post Processing');

        this._init();
    }


    static getInstance(args) {
        if (!PostProcessing.instance) {
            PostProcessing.instance = new PostProcessing(args);
        }

        return PostProcessing.instance;
    }


    // Init

    _init() {
        this._setupEffect();
    }


    _setupEffect() {
        const { effect } = this.options;


        // Check current effect

        let currEffect = this.effects[effect];
        if (!currEffect) currEffect = this.options.customEffect;
        if (!currEffect && !this.options.customEffect && typeof this.options.customEffect !== 'object') return;

        const { type, fn } = currEffect;


        // Post Processing Settings

        if (type === 'three') {
            const { fn } = currEffect;
            this.threeEffect = this._setupThreeEffect(fn);
        } else {
            this.customEffect = new currEffect(this, { EffectComposer, RenderPass, OutputPass, ShaderPass, ShaderMaterial });
        }
    }


    // MR.DOOB POST PROCESSING

    _setupThreeEffectPass(fn) {
        let updateFunction;
        const onUpdate = (callback) => {
            updateFunction = callback;
        };

        fn({
            effectComposer: this.composer,
            scene: this.scene,
            sceneArray: this.sceneArray,
            camera: this.camera.target,
            debug: this.debugFolder,
            texture: this.texture,
            mouse: this.mouse,
            onUpdate: onUpdate,
            props: this.options.props || {}
        });

        if (typeof updateFunction === 'function') {
            this.effect = { update: updateFunction };
        }
    }


    _setupThreeEffect(fn) {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera.target);
        this.composer.addPass(renderPass);


        // Setup Effect Pass

        this._setupThreeEffectPass(fn);

        const outputPass = new OutputPass();
        this.composer.addPass(outputPass);
    }


    resize() {
        if (this.composer) {
            this.composer.setSize(this.sizes.width, this.sizes.height);
            this.composer.setPixelRatio(this.sizes.pixelRatio);
        }

        if (this.customEffect) this.customEffect.resize();
    }


    update(state) {
        const { time } = state;

        if (this.composer) this.composer.render();
        if (this.effect) this.effect.update(time);
        if (this.customEffect) this.customEffect.update();
    }


    dispose() {
        if (this.composer) this.composer.dispose();
        if (this.customEffect) this.customEffect.dispose();
    }
}