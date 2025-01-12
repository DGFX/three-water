import * as THREE from 'three';
import vertexShader from './vertex.glsl';
import fragmentShader from './fragment.glsl';

export default class Water {
    constructor(experience) {
        this.experience = experience;
        this.scene = this.experience.scene
        this.debug = this.experience.debug;

        this._setupColors();
        this._setupWater();
        this._setupDebug();
    }

    _setupColors() {
        this.colors = {
            depthColor: '#19628f',
            surfaceColor: '#8ac2ff',
        }
    }

    _setupMaterial() {
        this.uniforms = {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#118c9c') },

            uBigWavesElevation: { value: 0.013 },
            uBigWavesFrequency: { value: new THREE.Vector2(10, 7) },
            uBigWavesSpeed: { value: 0.75 },

            uTiling: { value: 1.6 },

            uSmallWavesElevation: { value: 0.035 },
            uSmallWavesFrequency: { value: 7.8 },
            uSmallWavesSpeed: { value: 0.4 },
            uSmallWavesIterations: { value: 5 },

            uDepthColor: { value: new THREE.Color(this.colors.depthColor) },
            uSurfaceColor: { value: new THREE.Color(this.colors.surfaceColor) },
            uColorOffset: { value: 0.04 },
            uColorMultiplier: { value: 6.7 },
        };

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader,
            fragmentShader,
            // wireframe: true,
        });
    }

    _setupGeometry() {
        this.geometry = new THREE.PlaneGeometry(2, 2, 256, 256);
        this.geometry.rotateX(-Math.PI / 2);
    }

    _setupWater() {
        this._setupGeometry();
        this._setupMaterial();

        const plane = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(plane);
    }

    _setupDebug() {
        if (!this.debug.active) return;

        this.vertexDebugFolder = this.debug.gui.addFolder('Water Vertex');
        this.vertexDebugFolder.add(this.uniforms.uBigWavesElevation, 'value', 0, 1, 0.001).name('uBigWavesElevation');
        this.vertexDebugFolder.add(this.uniforms.uBigWavesFrequency.value, 'x', 0, 100, 0.001).name('uBigWavesFrequencyX');
        this.vertexDebugFolder.add(this.uniforms.uBigWavesFrequency.value, 'y', 0, 100, 0.001).name('uBigWavesFrequencyY');
        this.vertexDebugFolder.add(this.uniforms.uBigWavesSpeed, 'value', 0, 10, 0.001).step(0.001).name('uBigWavesSpeed');

        this.vertexDebugFolder.add(this.uniforms.uTiling, 'value', 0, 10, 0.001).name('uTiling');

        this.vertexDebugFolder.add(this.uniforms.uSmallWavesElevation, 'value', 0, 1, 0.001).name('uSmallWavesElevation');
        this.vertexDebugFolder.add(this.uniforms.uSmallWavesFrequency, 'value', 0, 100, 0.001).name('uSmallWavesFrequency');
        this.vertexDebugFolder.add(this.uniforms.uSmallWavesSpeed, 'value', 0, 10, 0.001).name('uSmallWavesSpeed');
        this.vertexDebugFolder.add(this.uniforms.uSmallWavesIterations, 'value', 0, 10, 0.001).name('uSmallWavesIterations');

        this.colorDebugFolder = this.debug.gui.addFolder('Water Color');
        this.colorDebugFolder.addColor(this.colors, 'depthColor').name('uDepthColor').onChange(() => {
            this.uniforms.uDepthColor.value = new THREE.Color(this.colors.depthColor);
        });
        this.colorDebugFolder.addColor(this.colors, 'surfaceColor').name('uSurfaceColor').onChange(() => {
            this.uniforms.uSurfaceColor.value = new THREE.Color(this.colors.surfaceColor);
        });
        this.colorDebugFolder.add(this.uniforms.uColorOffset, 'value', 0, 1, 0.001).name('uColorOffset');
        this.colorDebugFolder.add(this.uniforms.uColorMultiplier, 'value', 0, 10, 0.001).name('uColorMultiplier');
    }

    update(time) {
        this.uniforms.uTime.value = time;
        this.geometry.computeVertexNormals()
    }
}