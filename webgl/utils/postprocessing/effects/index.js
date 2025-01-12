import { createMotionTrailPass } from "./motionTrail";
import { createVolumetricRays } from './volumetricRays'
import { createMotionBlur } from './motionBlur'
import { createSSAOPass } from "./ssao";
import { createNoise } from './noise';
import { createSceneTransition } from './sceneTransition';

export default {
    'motionTrail': createMotionTrailPass,
    'volumetricRays': createVolumetricRays,
    'motionBlur': createMotionBlur,
    'ssao': createSSAOPass,
    'noise': createNoise,
    'sceneTransition': createSceneTransition
}