varying vec2 vUv;
varying float vElevation;

uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorMultiplier;
uniform float uColorOffset;

#include <common>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>

void main() {
    #include <colorspace_fragment>

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(color, 1.0);
}