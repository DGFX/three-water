import { MotionBlurPass } from './MotionBlurPass';

export function createMotionBlur({ effectComposer, scene, camera, mouse, debug, props: { intensity } }) {

    const volumetricRaysPass = new MotionBlurPass(intensity, scene, camera, mouse);
    effectComposer.addPass(volumetricRaysPass);

    if (debug) {
        // debug.add(volumetricRaysPass.options, 'intensity', 0, 1)
    }
}