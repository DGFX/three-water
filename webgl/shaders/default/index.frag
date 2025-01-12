uniform float uTime;
uniform sampler2D uImage;
uniform vec4 uResolution;

varying vec2 vUv;


void main() {
    vec2 newUV = (vUv - vec2(0.5))*uResolution.zw + vec2(0.5);

    vec4 tex = texture2D(uImage, newUV);

    gl_FragColor = tex;
}