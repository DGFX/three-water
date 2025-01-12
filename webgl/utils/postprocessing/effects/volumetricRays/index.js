import { VolumetricRaysPass } from './VolumetricRaysPass';

export function createVolumetricRays({ effectComposer, scene, camera, mouse, debug, props: { intensity } }) {

    const volumetricRaysPass = new VolumetricRaysPass(intensity, scene, camera, mouse);
    effectComposer.addPass(volumetricRaysPass);

    if (debug) {
        // debug.add(volumetricRaysPass.options, 'intensity', 0, 100)
    }
}