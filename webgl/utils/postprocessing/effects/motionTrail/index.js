import { MotiontrailPass } from './MotiontrailPass'

export function createMotionTrailPass({ effectComposer, scene, camera, debug, props: { fade, background }}) {    
    const motiontrailPass = new MotiontrailPass(fade, scene, camera, background);
    effectComposer.addPass( motiontrailPass );

    if (debug) {
        debug.add(motiontrailPass.options, 'fadeFactor', 0, 0.3)
        debug.add(motiontrailPass.options, 'scaleX', -1, 1, 0.05)
        debug.add(motiontrailPass.options, 'scaleY', -1, 1, 0.05)
        debug.add(motiontrailPass.options, 'rotationAngle', -5, 5, 0.1)
    }
}