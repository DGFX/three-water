import { SceneTransitionPass } from './SceneTransitionPass';

export function createSceneTransition({ effectComposer, scene, camera, sceneArray, debug }) {
    const sceneTransitionPass = new SceneTransitionPass({
        options: {
            progress: 0,
            scene1Key: 'banana',
            scene2Key: 'watermelon'
        },
        globalScene: scene,
        camera,
        sceneArray
    });

    effectComposer.addPass(sceneTransitionPass);

    if (debug) {
        debug.add(sceneTransitionPass.options, 'progress', 0, 1)
    }
}