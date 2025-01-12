#define PI 3.14159265358979323846

// Wave struct definition
struct Wave {
    vec2 direction;
    vec2 origin;
    float frequency;
    float amplitude;
    float phase;
    float steepness;
    int waveType;
};

vec2 GetDirection(vec3 v, Wave w) {
    #ifdef CIRCULAR_WAVES
    vec2 p = vec2(v.x, v.z);
    return normalize(p - w.origin);
    #else
    return w.direction;
    #endif
}

float GetWaveCoord(vec3 v, vec2 d, Wave w) {
    #ifdef CIRCULAR_WAVES
        vec2 p = vec2(v.x, v.z);
        return length(p - w.origin);
    #endif
    return v.x * d.x + v.z * d.y;
}

float GetTime(Wave w) {
    #ifdef CIRCULAR_WAVES
        return -uTime * w.phase;
    #else
    return uTime * w.phase;
    #endif
}

float Sine(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);
    return w.amplitude * sin(xz * w.frequency + t);
}

vec3 SineNormal(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);
    vec2 n = w.frequency * w.amplitude * d * cos(xz * w.frequency + t);
    return vec3(n.x, n.y, 0.0);
}

float SteepSine(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);
    return 2.0 * w.amplitude * pow((sin(xz * w.frequency + t) + 1.0) / 2.0, w.steepness);
}

vec3 SteepSineNormal(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);
    float h = pow((sin(xz * w.frequency + t) + 1.0) / 2.0, max(1.0, w.steepness - 1.0));
    vec2 n = d * w.steepness * w.frequency * w.amplitude * h * cos(xz * w.frequency + t);
    return vec3(n.x, n.y, 0.0);
}

vec3 Gerstner(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);

    vec3 g = vec3(0.0);
    g.x = w.steepness * w.amplitude * d.x * cos(w.frequency * xz + t);
    g.z = w.steepness * w.amplitude * d.y * cos(w.frequency * xz + t);
    g.y = w.amplitude * sin(w.frequency * xz + t);
    return g;
}

vec3 GerstnerNormal(vec3 v, Wave w) {
    vec2 d = GetDirection(v, w);
    float xz = GetWaveCoord(v, d, w);
    float t = GetTime(w);

    vec3 n = vec3(0.0);
    float wa = w.frequency * w.amplitude;
    float s = sin(w.frequency * xz + uTime * w.phase);
    float c = cos(w.frequency * xz + uTime * w.phase);

    n.x = d.x * wa * c;
    n.z = d.y * wa * c;
    n.y = w.steepness * wa * s;
    return n;
}

vec3 CalculateOffset(vec3 v, Wave w) {
    #ifdef SINE_WAVE
        return vec3(0.0, Sine(v, w), 0.0);
    #endif

    #ifdef STEEP_SINE_WAVE
        return vec3(0.0, SteepSine(v, w), 0.0);
    #endif

    #ifdef GERSTNER_WAVE
        return Gerstner(v, w);
    #endif

    return vec3(0.0);
}

vec3 CalculateNormal(vec3 v, Wave w) {
    #ifdef SINE_WAVE
        return SineNormal(v, w);
    #endif

    #ifdef STEEP_SINE_WAVE
        return SteepSineNormal(v, w);
    #endif

    #ifdef GERSTNER_WAVE
        return GerstnerNormal(v, w);
    #endif

    return vec3(0.0);
}

vec3 vertexFBM(vec3 v) {
    float f = uVertexFrequency;
    float a = uVertexAmplitude;
    float speed = uVertexInitialSpeed;
    float seed = uVertexSeed;
    vec3 p = v;
    float amplitudeSum = 0.0;

    float h = 0.0;
    vec2 n = vec2(0.0);
    for (int wi = 0; wi < uVertexWaveCount; ++wi) {
        vec2 d = normalize(vec2(cos(seed), sin(seed)));

        float x = dot(d, p.xz) * f + uTime * speed;
        float wave = a * exp(uVertexMaxPeak * sin(x) - uVertexPeakOffset);
        float dx = uVertexMaxPeak * wave * cos(x);

        h += wave;

        p.xz += d * -dx * a * uVertexDrag;

        amplitudeSum += a;
        f *= uVertexFrequencyMult;
        a *= uVertexAmplitudeMult;
        speed *= uVertexSpeedRamp;
        seed += uVertexSeedIter;
    }

    vec3 output = vec3(h, n.x, n.y) / amplitudeSum;
    output.x *= uVertexHeight;

    return output;
}

vec3 fragmentFBM(vec3 v) {
    float f = uFragmentFrequency;
    float a = uFragmentAmplitude;
    float speed = uFragmentInitialSpeed;
    float seed = uFragmentSeed;
    vec3 p = v;

    float h = 0.0;
    vec2 n = vec2(0.0);
    float amplitudeSum = 0.0;

    for (int wi = 0; wi < uFragmentWaveCount; ++wi) {
        vec2 d = normalize(vec2(cos(seed), sin(seed)));

        float x = dot(d, p.xz) * f + uTime * speed;
        float wave = a * exp(uFragmentMaxPeak * sin(x) - uFragmentPeakOffset);
        vec2 dw = f * d * (uFragmentMaxPeak * wave * cos(x));

        h += wave;
        p.xz += -dw * a * uFragmentDrag;

        n += dw;

        amplitudeSum += a;
        f *= uFragmentFrequencyMult;
        a *= uFragmentAmplitudeMult;
        speed *= uFragmentSpeedRamp;
        seed += uFragmentSeedIter;
    }

    vec3 output = vec3(h, n.x, n.y) / amplitudeSum;
    output.x *= uFragmentHeight;

    return output;
}