import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';

export function createSSAOPass({ effectComposer, scene, camera, debug }) {
    const saoPass = new SAOPass( scene, camera );
    effectComposer.addPass( saoPass );

    saoPass.params.saoBias = -7;
    saoPass.params.saoIntensity = 0.045;
    saoPass.params.saoScale = 500;
    saoPass.params.saoKernelRadius = 200;
    saoPass.params.saoBlurRadius = 12;
    saoPass.params.saoBlurStdDev = 12;
    saoPass.params.saoBlurDepthCutoff = 0.1;

    if (debug) {
        debug.add( saoPass.params, 'output', {
            'Default': SAOPass.OUTPUT.Default,
            'SAO Only': SAOPass.OUTPUT.SAO,
            'Normal': SAOPass.OUTPUT.Normal
        }).onChange( function ( value ) {
            saoPass.params.output = value;
        });

        debug.add( saoPass.params, 'saoBias', - 10, 100 );
        debug.add( saoPass.params, 'saoIntensity', 0, 0.07 ).step(0.001);
        debug.add( saoPass.params, 'saoScale', -10, 500 );
        debug.add( saoPass.params, 'saoKernelRadius', -10, 200 );
        // debug.add( saoPass.params, 'saoMinResolution', -10, 1 );
        debug.add( saoPass.params, 'saoBlur' );
        debug.add( saoPass.params, 'saoBlurRadius', -10, 200 );
        debug.add( saoPass.params, 'saoBlurStdDev', -10, 150 );
        debug.add( saoPass.params, 'saoBlurDepthCutoff', -10, 0.1 );
        debug.add( saoPass, 'enabled' );
    }
}