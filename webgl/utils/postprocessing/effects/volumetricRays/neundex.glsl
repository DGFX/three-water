#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\nvarying vec3 vVertexPosition;varying vec2 vTextureCoord;uniform sampler2D sceneTexture,targetTexture;uniform vec2 uMouse,uResolution;uniform float uDirection;void main(){vec2 st=(gl_FragCoord.xy-.5*uResolution)/min(uResolution.x,uResolution.y),mouse=(uMouse-.5*uResolution)/min(uResolution.x,uResolution.y),st1=(gl_FragCoord.xy-.5*uResolution)/min(uResolution.x,uResolution.y),mouse1=(uMouse-.5*uResolution)/min(uResolution.x,uResolution.y),pos=vTextureCoord+vec2((mouse1-st1)*pow(clamp(.5-length(st1-mouse1)/.5,0.,1.),1.)*.2);gl_FragColor=texture2D(targetTexture,pos)*.65+texture2D(sceneTexture,pos)*.35;}\n