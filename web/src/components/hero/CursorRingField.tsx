/*
 * CursorRingField — Originkit(originkit.dev)에서 가져온 WebGL 컴포넌트.
 *
 * ⚠️ 라이선스: Originkit은 일부 컴포넌트가 유료(크레딧)다. 상용 배포 전에
 *    이 컴포넌트가 무료 범위인지 Originkit 라이선스 문서를 반드시 확인할 것.
 *
 * 원본에서 바꾼 것:
 *  - "use client" 디렉티브 제거 (Next.js 전용. Vite에서는 번들러 경고만 낸다)
 *  - 하단 __originkitPresetProps의 색을 브랜드 팔레트로 지정 (캔버스 #faf9f6,
 *    포인트 퍼플 단계) — 가이드의 "가져온 색을 그대로 두지 마세요" 대응
 *  - RENDER_FRAG 끝부분: 점을 검정으로 어둡게 하던 `color *= vEnergy`를 알파 페이드로
 *    교체 (밝은 배경 가독성). 해당 줄에 주석 있음.
 *  - RENDER_FRAG 점 모양: 링 중심을 향해 회전한 알약 → 원. 회전 계산 제거.
 *  - onMove: 커서가 [data-quiet](텍스트 블록) 위면 링이 따라가지 않음 (가독성).
 *  - preserveDrawingBuffer: true → false (성능. 매 프레임 버퍼 복사 제거).
 *  - onMove: 매 이벤트 getBoundingClientRect() 호출 제거 + rAF 스로틀 (성능. 강제 레이아웃 제거).
 *    (sdRoundBox/rotate 헬퍼 함수는 남겨둠 — 되돌리기 쉽게. GLSL은 미사용 함수를 무시한다.)
 *
 * 그 외 로직은 원본 그대로다. 색·크기·속도 조정은 HeroCursorRing에서 props로 넘길 것.
 */

import * as React from "react"
import { useEffect, useRef } from "react"

const FIELD = 500
const HALF = FIELD / 2
const WORLD = 5
const CURSOR_REACH = 0.175

const CURSOR_LERP = 0.12
const WANDER_LERP = 0.01
const HANDOVER_LERP = 0.08

const CURSOR_JITTER = 0.01
const FOV = 40
// [수정] 원본 2 → 1.5. Retina에서 2배면 뷰포트 전체가 매 프레임 520만 픽셀이 된다.
// 점이 원래 옅고 부드러워 1.5배로도 차이가 거의 안 보이면서 픽셀 작업이 ~44% 줄어든다.
const DPR_CAP = 1.5
const MAX_POINTS = 65536
const TAU = Math.PI * 2
const MAX_COLORS = 5
const DEFAULT_COLORS = ["#7189ff", "#3074f9", "#0b0b18"]

const RING_EDGE = 4

const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
    + i.y+vec4(0.0,i1.y,i2.y,1.0))
    + i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const FIELD_TERMS = `
void fieldTerms(
    vec2 ref, vec2 ringPos, float time,
    float ringRadius, float w1, float w2, float turb,
    out vec2 disp, out float bandT, out float bandHot
){
    float dist = distance(ref, ringPos);

    // Break the ring's own edge with a slow noise so it never reads as a
    // mathematically clean circle. Only the OUTER smoothstep uses the wobbled
    // distance — wobbling both would just translate the band.
    float n0 = snoise(vec3(ref * 0.2 + vec2(18.4924, 72.9744), time * 0.5));
    float dist1 = distance(ref + (n0 * 0.005), ringPos);

    float t  = smoothstep(ringRadius - (w1 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w1, dist1);
    float t2 = smoothstep(ringRadius - (w2 * 2.0), ringRadius, dist)
             - smoothstep(ringRadius, ringRadius + w2, dist1);
    float t3 = smoothstep(ringRadius + w2, ringRadius, dist); // solid interior

    t  = pow(max(t, 0.0), 2.0);
    t2 = pow(max(t2, 0.0), 3.0);

    t += t2 * 3.0;                                   // hot core of the band
    t += t3 * 0.4;                                   // lift everything inside
    t += snoise(vec3(ref * 30.0 + vec2(11.4924, 12.9744), time * 0.5)) * t3 * 0.5;

    // Baseline shimmer, present with no ring anywhere near: this is what keeps
    // the rest of the field alive instead of black.
    float nS = snoise(vec3(ref * 2.0 + vec2(18.4924, 72.9744), time * 0.5));
    t += pow((nS + 1.5) * 0.5, 2.0) * 0.6;

    // Two octaves of drift plus a standing wave. The wave is scaled by the
    // distance to the ring so the band itself stays coherent while the far
    // field ripples.
    float n1 = snoise(vec3(ref * 4.0 + vec2(88.494, 32.4397), time * 0.35));
    float n2 = snoise(vec3(ref * 4.0 + vec2(50.904, 120.947), time * 0.35));
    float n3 = snoise(vec3(ref * 20.0 + vec2(18.4924, 72.9744), time * 0.5));
    float n4 = snoise(vec3(ref * 20.0 + vec2(50.904, 120.947), time * 0.5));

    vec2 d = vec2(n1, n2) * 0.03 + vec2(n3, n4) * 0.005;
    d.x += sin((ref.x * 20.0) + (time * 4.0)) * 0.02 * clamp(dist, 0.0, 1.0);
    d.y += cos((ref.y * 20.0) + (time * 3.0)) * 0.02 * clamp(dist, 0.0, 1.0);

    disp = d * turb;
    bandT = t;
    bandHot = t2;
}
`

const SIM_VERT = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUV;
void main(){
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`

const SIM_FRAG = `
precision highp float;

uniform sampler2D uState;
uniform sampler2D uRefs;
uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uPush;
uniform float uTurb;
uniform float uTime;

varying vec2 vUV;

${NOISE}
${FIELD_TERMS}

void main(){
    vec4 frame = texture2D(uState, vUV);
    vec2 ref   = texture2D(uRefs, vUV).xy;

    float scale  = frame.z;
    float energy = frame.w;
    float time   = uTime * 0.5;

    vec2 disp; float t; float t2;
    fieldTerms(ref, uRingPos, time, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);

    vec2 mem = frame.xy * 0.8;

    mem -= (uRingPos - (ref + disp)) * pow(max(t2, 0.0), 0.75) * uPush;

    scale += (t - scale) * 0.2;

    vec2 finalPos = ref + disp + (mem * 0.25);

    energy = energy * 0.5 + scale * 0.25;

    gl_FragColor = vec4(finalPos, scale, energy);
}
`

const RENDER_VERT = (isStatic: boolean) => `
precision highp float;

attribute vec2 aUV;
attribute vec2 aRef;

uniform sampler2D uState;
uniform float uProjF;
uniform float uAspect;
uniform float uCamDist;
uniform float uPointScale;
${
    isStatic
        ? `uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uTurb;
uniform float uTime;`
        : ``
}

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

${isStatic ? NOISE : ``}
${isStatic ? FIELD_TERMS : ``}

void main(){
${
    isStatic
        ? `    vec2 disp; float t; float t2;
    fieldTerms(aRef, uRingPos, uTime * 0.5, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);
    vec4 state = vec4(aRef + disp, t, t * 0.5);`
        : `    vec4 state = texture2D(uState, aUV);`
}

    vLocalPos = state.xy;
    vScale    = state.z;
    vEnergy   = state.w;

    vec2 world = state.xy * ${WORLD.toFixed(1)};

    gl_Position = vec4(world.x * uProjF / uAspect, world.y * uProjF, 0.0, uCamDist);

    gl_PointSize = max(vScale, 0.0) * 7.0 * uPointScale;
}
`

const RENDER_FRAG = `
precision highp float;

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

uniform vec3  uColors[${MAX_COLORS}];
uniform int   uColorCount;
uniform vec2  uRingPos;
uniform float uTime;

${NOISE}

float sdRoundBox(in vec2 p, in vec2 b, in float r){
    vec2 q = abs(p) - b + r;
    return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec2 rotate(vec2 v, float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, s, -s, c) * v;
}

void main(){
    float noiseColor = snoise(vec3(vLocalPos * 2.0  + vec2(74.664,  91.556),  uTime * 0.5));
    noiseColor = (noiseColor + 1.0) * 0.5;

    vec2 uv = gl_PointCoord.xy - vec2(0.5);

    float p = smoothstep(0.0, 0.75, pow(noiseColor, 2.0));
    vec3 color = uColors[0];
    for (int i = 0; i < ${MAX_COLORS - 1}; i++) {
        if (i < uColorCount - 1) {
            float span = 1.0 / float(uColorCount - 1);
            float t = clamp((p - float(i) * span) / span, 0.0, 1.0);
            color = mix(color, uColors[i + 1], t);
        }
    }

    // 원본: 링 중심을 향해 회전한 알약(sdRoundBox 0.5×0.2) — 링 주변에서 '획'처럼 늘어져 보였다.
    // 원으로 교체. 반지름 0.35는 알약과 면적이 비슷한 값 (점이 갑자기 굵어지지 않게).
    // 회전(angle/noiseAngle)은 원엔 의미가 없어 위에서 함께 제거 — 픽셀당 noise 호출 1회 절감.
    float d = length(uv) - 0.35;
    float mask = smoothstep(0.08, 0.0, d);

    float a = mask * smoothstep(0.1, 0.2, vScale);
    if (a < 0.01) discard;

    color = clamp(color, 0.0, 1.0);
    // 원본: color *= vEnergy — 에너지가 낮은 점을 검정으로 어둡게 만든다. 원본 배경이
    // 거의 검정(#04050a)이라 '꺼지는' 효과였지만, 우리 크림색 배경에선 회색 얼룩이 된다.
    // 색은 그대로 두고 알파를 줄여 '옅어지게' 바꿈. 0.2는 바닥값 — 링에서 먼 점도 완전히 사라지진 않게.
    // 0.6배: 점 전체를 한 단계 더 옅게 (글자 뒤로 지나갈 때 덜 거슬리도록). 바닥값 0.2 → 0.15
    a *= clamp(0.15 + vEnergy, 0.0, 1.0) * 0.6;

    gl_FragColor = vec4(color, clamp(a, 0.0, 1.0));
}
`

function compile(gl: any, type: number, src: string) {
    const sh = gl.createShader(type)
    gl.shaderSource(sh, src)
    gl.compileShader(sh)
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh)
        gl.deleteShader(sh)
        throw new Error(log || "shader compile failed")
    }
    return sh
}

function program(gl: any, vs: string, fs: string, names: string[]) {
    const prog = gl.createProgram()
    const v = compile(gl, gl.VERTEX_SHADER, vs)
    const f = compile(gl, gl.FRAGMENT_SHADER, fs)
    gl.attachShader(prog, v)
    gl.attachShader(prog, f)
    gl.linkProgram(prog)
    gl.deleteShader(v)
    gl.deleteShader(f)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const log = gl.getProgramInfoLog(prog)
        gl.deleteProgram(prog)
        throw new Error(log || "program link failed")
    }
    const u: Record<string, any> = {}
    const nulls: string[] = []
    for (const n of names) {
        const loc = gl.getUniformLocation(prog, n)
        if (loc === null) nulls.push(n)
        u[n] = loc
    }
    return { prog, u, nulls }
}

function makeContext(canvas: HTMLCanvasElement) {
    const opts = {
        alpha: true,
        antialias: false,

        premultipliedAlpha: false,
        depth: false,
        stencil: false,
        powerPreference: "high-performance" as const,
        // [수정] 원본 true → false. true면 매 프레임 버퍼를 복사해야 해서 느리다. 스크린샷 용도가 아니면 불필요
        preserveDrawingBuffer: false,
    }
    let gl: any = canvas.getContext("webgl2", opts)
    let fmt: any = null
    if (gl) {
        fmt = gl.getExtension("EXT_color_buffer_float")
            ? { internal: gl.RGBA32F, format: gl.RGBA, type: gl.FLOAT }
            : { internal: gl.RGBA16F, format: gl.RGBA, type: gl.HALF_FLOAT }
    } else {
        gl =
            canvas.getContext("webgl", opts) ||
            canvas.getContext("experimental-webgl", opts)
        if (!gl) return null
        const ok =
            gl.getExtension("OES_texture_float") &&
            gl.getExtension("WEBGL_color_buffer_float")
        fmt = ok ? { internal: gl.RGBA, format: gl.RGBA, type: gl.FLOAT } : null
    }

    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) < 2) fmt = null
    return { gl, fmt }
}

function stateTexture(gl: any, fmt: any, size: number, pixels: any) {
    const tex = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        fmt.internal,
        size,
        size,
        0,
        fmt.format,
        fmt.type,
        pixels || null
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    return tex
}

function renderTarget(gl: any, fmt: any, size: number) {
    const tex = stateTexture(gl, fmt, size, null)
    const fbo = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        tex,
        0
    )
    const ok =
        gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return { tex, fbo, ok }
}

function mulberry32(a: number) {
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

const linMap = (x: number, a: number, b: number, c: number, d: number) =>
    ((x - a) * (d - c)) / (b - a) + c

function poissonDisk(
    size: number,
    minD: number,
    maxD: number,
    tries: number,
    rand: () => number
) {
    const cell = minD / Math.SQRT2
    const gw = Math.ceil(size / cell)
    const gh = Math.ceil(size / cell)
    const grid = new Int32Array(gw * gh).fill(-1)
    const px: number[] = []
    const py: number[] = []
    const active: number[] = []
    const minD2 = minD * minD

    const add = (x: number, y: number) => {
        const i = px.length
        px.push(x)
        py.push(y)
        grid[((y / cell) | 0) * gw + ((x / cell) | 0)] = i
        active.push(i)
    }

    add(rand() * size, rand() * size)

    while (active.length > 0 && px.length < MAX_POINTS) {
        const ai = (rand() * active.length) | 0
        const idx = active[ai]
        let placed = false
        for (let t = 0; t < tries; t++) {
            const ang = rand() * TAU
            const r = minD + (maxD - minD) * rand()
            const nx = px[idx] + Math.cos(ang) * r
            const ny = py[idx] + Math.sin(ang) * r
            if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue
            const cx = (nx / cell) | 0
            const cy = (ny / cell) | 0
            let ok = true
            for (let j = Math.max(0, cy - 2); j <= Math.min(gh - 1, cy + 2) && ok; j++) {
                for (let i = Math.max(0, cx - 2); i <= Math.min(gw - 1, cx + 2); i++) {
                    const q = grid[j * gw + i]
                    if (q < 0) continue
                    const dx = px[q] - nx
                    const dy = py[q] - ny
                    if (dx * dx + dy * dy < minD2) {
                        ok = false
                        break
                    }
                }
            }
            if (ok) {
                add(nx, ny)
                placed = true
                break
            }
        }
        if (!placed) {
            active[ai] = active[active.length - 1]
            active.pop()
        }
    }
    return { px, py, count: px.length }
}

function buildField(density: number) {
    const rand = mulberry32(0x9e3779b9)
    const minD = linMap(density, 0, 300, 10, 2)
    const maxD = linMap(density, 0, 300, 11, 3)
    const { px, py, count } = poissonDisk(FIELD, minD, maxD, 20, rand)

    let texSize = 8
    while (texSize * texSize < count) texSize *= 2

    const refs = new Float32Array(texSize * texSize * 4)
    const aUV = new Float32Array(count * 2)
    const aRef = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
        const x = (px[i] - HALF) / HALF
        const y = (py[i] - HALF) / HALF
        refs[i * 4 + 0] = x
        refs[i * 4 + 1] = y
        aRef[i * 2 + 0] = x
        aRef[i * 2 + 1] = y

        aUV[i * 2 + 0] = ((i % texSize) + 0.5) / texSize
        aUV[i * 2 + 1] = (Math.floor(i / texSize) + 0.5) / texSize
    }
    return { count, texSize, refs, aUV, aRef }
}

function valueNoise1(x: number, seed: number) {
    const i = Math.floor(x)
    const f = x - i
    const h = (n: number) => {
        const s = Math.sin((n + seed) * 127.1) * 43758.5453
        return s - Math.floor(s)
    }
    const u = f * f * (3 - 2 * f)
    return h(i) * (1 - u) + h(i + 1) * u
}

function hexToRgb(hex: string): [number, number, number] {
    if (typeof hex !== "string") return [1, 1, 1]
    let s = hex.trim()
    const m = s.match(/^rgba?\(([^)]+)\)$/i)
    if (m) {
        const p = m[1].split(",").map((v) => parseFloat(v))
        return [(p[0] || 0) / 255, (p[1] || 0) / 255, (p[2] || 0) / 255]
    }
    s = s.replace("#", "")
    if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2]
    if (s.length === 8) s = s.slice(0, 6)
    if (s.length !== 6) return [1, 1, 1]
    const n = parseInt(s, 16)
    if (!isFinite(n)) return [1, 1, 1]
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

interface ColorsGroup {
    items?: string[]
    background?: string
    points?: string[]

    color1?: string
    color2?: string
    color3?: string

}
interface RingProps {
    radius?: number
    width?: number
    push?: number
    turbulence?: number
}
interface CursorRingFieldProps {
    background?: string

    colors?: ColorsGroup | string[]
    density?: number
    dotSize?: number
    speed?: number
    cameraDistance?: number
    ring?: RingProps
    style?: React.CSSProperties
}

function __OriginkitBase_CursorRingField(props: CursorRingFieldProps) {
    const {
        background: backgroundProp,
        colors,
        density = 300,
        dotSize = 120,
        speed = 6,
        cameraDistance = 160,
        ring = { push: 50, width: 9, radius: 12, turbulence: 100 },
        style,
    } = props

    const group: ColorsGroup = colors && !Array.isArray(colors) ? colors : {}
    const background = backgroundProp ?? group.background ?? "#04050a"

    const clean = (list?: string[]) => (list ?? []).filter((c) => !!c)
    const rawPoints = [
        clean(group.items),
        clean(Array.isArray(colors) ? colors : undefined),
        clean(group.points),
        group.color1 || group.color2 || group.color3
            ? [
                  group.color1 ?? DEFAULT_COLORS[0],
                  group.color2 ?? DEFAULT_COLORS[1],
                  group.color3 ?? DEFAULT_COLORS[2],
              ]
            : [],
    ].find((list) => list.length > 0) ?? DEFAULT_COLORS

    const ringRadius = ring.radius ?? 12
    const ringWidth = ring.width ?? 9
    const ringPush = ring.push ?? 0
    const turbulence = ring.turbulence ?? 0

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const hostRef = useRef<HTMLDivElement | null>(null)

    const swatches = rawPoints.slice(0, MAX_COLORS).map(hexToRgb)
    if (swatches.length === 0) swatches.push(hexToRgb(DEFAULT_COLORS[0]))
    const flatColors = new Float32Array(MAX_COLORS * 3)
    for (let i = 0; i < MAX_COLORS; i++) {
        const c = swatches[Math.min(i, swatches.length - 1)]
        flatColors[i * 3 + 0] = c[0]
        flatColors[i * 3 + 1] = c[1]
        flatColors[i * 3 + 2] = c[2]
    }

    const live = useRef<any>({})
    live.current = {
        colors: flatColors,
        colorCount: swatches.length,
        dotSize: dotSize / 100,
        speed: speed / 50,
        camDist: cameraDistance / 100,
        ringRadius: ringRadius / 100,
        ringWidth: Math.max(ringWidth, 1) / 100,
        ringEdge: RING_EDGE / 100,
        push: ringPush / 100,
        turb: turbulence / 100,
    }

    const densityRef = useRef(density)
    const densityDirty = useRef(true)
    if (densityRef.current !== density) {
        densityRef.current = density
        densityDirty.current = true
    }

    useEffect(() => {
        const canvas = canvasRef.current
        const host = hostRef.current
        if (!canvas || !host) return

        const ctx = makeContext(canvas)
        if (!ctx) return
        const { gl, fmt } = ctx
        const useSim = !!fmt

        let simProg: any = null
        let renderProg: any = null
        try {
            if (useSim) {
                simProg = program(gl, SIM_VERT, SIM_FRAG, [
                    "uState",
                    "uRefs",
                    "uRingPos",
                    "uRingRadius",
                    "uRingWidth",
                    "uRingWidth2",
                    "uPush",
                    "uTurb",
                    "uTime",
                ])
            }
            const renderNames = [
                "uProjF",
                "uAspect",
                "uCamDist",
                "uPointScale",

                "uColors[0]",
                "uColorCount",
                "uRingPos",
                "uTime",
            ]
            if (useSim) renderNames.push("uState")
            else
                renderNames.push(
                    "uRingRadius",
                    "uRingWidth",
                    "uRingWidth2",
                    "uTurb"
                )
            renderProg = program(
                gl,
                RENDER_VERT(!useSim),
                RENDER_FRAG,
                renderNames
            )
        } catch (e) {
            console.warn("CursorRingField:", (e as Error).message)
            return
        }

        ;(canvas as any).__probe = {
            simNulls: simProg ? simProg.nulls : [],
            renderNulls: renderProg.nulls,
            useSim,
        }

        const quad = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, quad)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW
        )

        const uvBuf = gl.createBuffer()
        const refBuf = gl.createBuffer()
        let refsTex: any = null
        let rt1: any = null
        let rt2: any = null
        let count = 0
        let texSize = 8

        function disposeField() {
            if (refsTex) gl.deleteTexture(refsTex)
            if (rt1) {
                gl.deleteTexture(rt1.tex)
                gl.deleteFramebuffer(rt1.fbo)
            }
            if (rt2) {
                gl.deleteTexture(rt2.tex)
                gl.deleteFramebuffer(rt2.fbo)
            }
            refsTex = null
            rt1 = null
            rt2 = null
        }

        function rebuildField(d: number) {
            disposeField()
            const f = buildField(d)
            count = f.count
            texSize = f.texSize

            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
            gl.bufferData(gl.ARRAY_BUFFER, f.aUV, gl.STATIC_DRAW)
            gl.bindBuffer(gl.ARRAY_BUFFER, refBuf)
            gl.bufferData(gl.ARRAY_BUFFER, f.aRef, gl.STATIC_DRAW)

            if (!useSim) return

            const src = { internal: fmt.internal, format: gl.RGBA, type: gl.FLOAT }
            refsTex = stateTexture(gl, src, texSize, f.refs)
            rt1 = renderTarget(gl, fmt, texSize)
            rt2 = renderTarget(gl, fmt, texSize)

            gl.bindTexture(gl.TEXTURE_2D, rt1.tex)
            gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, texSize, texSize, 0, gl.RGBA, gl.FLOAT, f.refs)
            gl.bindTexture(gl.TEXTURE_2D, rt2.tex)
            gl.texImage2D(gl.TEXTURE_2D, 0, fmt.internal, texSize, texSize, 0, gl.RGBA, gl.FLOAT, f.refs)
            gl.bindTexture(gl.TEXTURE_2D, null)
        }

        let dpr = 1
        let cssW = 1
        let cssH = 1

        const resize = () => {
            dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
            cssW = Math.max(canvas.clientWidth || host.clientWidth || 1, 1)
            cssH = Math.max(canvas.clientHeight || host.clientHeight || 1, 1)
            const w = Math.max(1, Math.round(cssW * dpr))
            const h = Math.max(1, Math.round(cssH * dpr))
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w
                canvas.height = h
            }
        }
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(canvas)

        const pointer = { x: 0, y: 0, over: false }
        const ringPos = { x: 0, y: 0 }

        let follow = 0

        /*
         * [수정] 원본은 pointermove마다 getBoundingClientRect()를 불러 강제 레이아웃을 일으켰다
         * (트랙패드는 초당 120회까지 발생 → 마우스 이동이 버벅임). 캔버스는 fixed inset-0 이라
         * rect가 창 크기 바뀔 때만 변하므로 resize()에서 캐시한 cssW/cssH를 쓴다 (left/top은 0).
         * 좌표 변환은 rAF로 프레임당 1회만 수행하고, 이벤트 핸들러는 좌표를 적어두기만 한다.
         */
        let moveFrame = 0
        let lastEvent: { x: number; y: number; quiet: boolean } | null = null

        const applyMove = () => {
            moveFrame = 0
            if (!lastEvent) return
            // 커서가 텍스트 블록([data-quiet]) 위면 따라가지 않는다 — 글 읽는 자리에 점이 몰리지 않도록
            if (lastEvent.quiet) {
                pointer.over = false
                return
            }
            pointer.x = (lastEvent.x / Math.max(cssW, 1)) * 2 - 1
            pointer.y = -((lastEvent.y / Math.max(cssH, 1)) * 2 - 1)
            pointer.over =
                pointer.x >= -1 && pointer.x <= 1 && pointer.y >= -1 && pointer.y <= 1
        }

        const onMove = (e: PointerEvent) => {
            lastEvent = {
                x: e.clientX,
                y: e.clientY,
                quiet: !!(e.target as Element | null)?.closest?.("[data-quiet]"),
            }
            if (!moveFrame) moveFrame = requestAnimationFrame(applyMove)
        }
        const onLeave = () => {
            pointer.over = false
        }

        window.addEventListener("pointermove", onMove)
        canvas.addEventListener("pointerleave", onLeave)

        let raf = 0
        let last = 0
        let simTime = 0
        let wander = 0
        let ping = true

        const posLocSim = simProg ? gl.getAttribLocation(simProg.prog, "aPos") : -1

        const uvLoc = gl.getAttribLocation(renderProg.prog, "aUV")
        const refLoc = gl.getAttribLocation(renderProg.prog, "aRef")

        gl.disable(gl.DEPTH_TEST)
        gl.enable(gl.BLEND)

        gl.blendFuncSeparate(
            gl.SRC_ALPHA,
            gl.ONE_MINUS_SRC_ALPHA,
            gl.ONE,
            gl.ONE_MINUS_SRC_ALPHA
        )

        const frame = (now: number) => {
            raf = requestAnimationFrame(frame)
            const L = live.current

            if (densityDirty.current) {
                densityDirty.current = false
                rebuildField(densityRef.current)
            }
            if (!count) return

            const dtRaw = last ? (now - last) / 1000 : 1 / 60
            last = now
            const dt = Math.min(dtRaw, 1 / 20)
            simTime = (simTime + dt * L.speed) % 3600
            wander += dt * L.speed

            const aspect = Math.max(cssW / Math.max(cssH, 1), 0.0001)
            const projF = 1 / Math.tan(((FOV * Math.PI) / 180) / 2)

            const wx = (valueNoise1(wander * 0.66, 94.234) - 0.5) * 2
            const wy = (valueNoise1(wander * 0.75, 21.028) - 0.5) * 2

            follow +=
                ((pointer.over ? 1 : 0) - follow) *
                (1 - Math.pow(1 - HANDOVER_LERP, dt * 60))

            const wanderX = wx * 0.2
            const wanderY = wy * 0.1
            let tx = wanderX
            let ty = wanderY
            if (follow > 0.0001) {
                const worldX = (pointer.x * aspect * L.camDist) / projF
                const worldY = (pointer.y * L.camDist) / projF
                const cx = worldX * CURSOR_REACH + wx * CURSOR_JITTER
                const cy = worldY * CURSOR_REACH + wy * CURSOR_JITTER
                tx = wanderX + (cx - wanderX) * follow
                ty = wanderY + (cy - wanderY) * follow
            }

            const lerp = WANDER_LERP + (CURSOR_LERP - WANDER_LERP) * follow
            const rk = 1 - Math.pow(1 - lerp, dt * 60)
            ringPos.x += (tx - ringPos.x) * rk
            ringPos.y += (ty - ringPos.y) * rk

            const radius =
                L.ringRadius +
                Math.sin(simTime) * 0.03 +
                Math.cos(simTime * 3) * 0.02

            if (useSim) {
                const src = ping ? rt1 : rt2
                const dst = ping ? rt2 : rt1
                gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo)
                gl.viewport(0, 0, texSize, texSize)
                gl.disable(gl.BLEND)
                gl.useProgram(simProg.prog)
                gl.bindBuffer(gl.ARRAY_BUFFER, quad)
                gl.enableVertexAttribArray(posLocSim)
                gl.vertexAttribPointer(posLocSim, 2, gl.FLOAT, false, 0, 0)
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, src.tex)
                gl.uniform1i(simProg.u.uState, 0)
                gl.activeTexture(gl.TEXTURE1)
                gl.bindTexture(gl.TEXTURE_2D, refsTex)
                gl.uniform1i(simProg.u.uRefs, 1)
                gl.uniform2f(simProg.u.uRingPos, ringPos.x, ringPos.y)
                gl.uniform1f(simProg.u.uRingRadius, radius)
                gl.uniform1f(simProg.u.uRingWidth, L.ringWidth)
                gl.uniform1f(simProg.u.uRingWidth2, L.ringEdge)
                gl.uniform1f(simProg.u.uPush, L.push)
                gl.uniform1f(simProg.u.uTurb, L.turb)
                gl.uniform1f(simProg.u.uTime, simTime)
                gl.drawArrays(gl.TRIANGLES, 0, 3)
                gl.bindFramebuffer(gl.FRAMEBUFFER, null)
                gl.enable(gl.BLEND)
                ping = !ping
            }

            gl.viewport(0, 0, canvas.width, canvas.height)
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT)
            gl.useProgram(renderProg.prog)

            if (uvLoc >= 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf)
                gl.enableVertexAttribArray(uvLoc)
                gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0)
            }
            if (refLoc >= 0) {
                gl.bindBuffer(gl.ARRAY_BUFFER, refBuf)
                gl.enableVertexAttribArray(refLoc)
                gl.vertexAttribPointer(refLoc, 2, gl.FLOAT, false, 0, 0)
            }

            if (useSim) {
                const shown = ping ? rt1 : rt2
                gl.activeTexture(gl.TEXTURE0)
                gl.bindTexture(gl.TEXTURE_2D, shown.tex)
                gl.uniform1i(renderProg.u.uState, 0)
            } else {
                gl.uniform1f(renderProg.u.uRingRadius, radius)
                gl.uniform1f(renderProg.u.uRingWidth, L.ringWidth)
                gl.uniform1f(renderProg.u.uRingWidth2, L.ringEdge)
                gl.uniform1f(renderProg.u.uTurb, L.turb)
            }

            gl.uniform1f(renderProg.u.uProjF, projF)
            gl.uniform1f(renderProg.u.uAspect, aspect)
            gl.uniform1f(renderProg.u.uCamDist, L.camDist)

            gl.uniform1f(
                renderProg.u.uPointScale,
                (cssW / 2000) * L.dotSize * dpr * 0.5
            )
            gl.uniform3fv(renderProg.u["uColors[0]"], L.colors)
            gl.uniform1i(renderProg.u.uColorCount, L.colorCount)
            gl.uniform2f(renderProg.u.uRingPos, ringPos.x, ringPos.y)
            gl.uniform1f(renderProg.u.uTime, simTime)

            gl.drawArrays(gl.POINTS, 0, count)
        }
        raf = requestAnimationFrame(frame)

        return () => {
            cancelAnimationFrame(raf)
            if (moveFrame) cancelAnimationFrame(moveFrame)
            ro.disconnect()
            window.removeEventListener("pointermove", onMove)
            canvas.removeEventListener("pointerleave", onLeave)
            disposeField()
            gl.deleteBuffer(quad)
            gl.deleteBuffer(uvBuf)
            gl.deleteBuffer(refBuf)
            if (simProg) gl.deleteProgram(simProg.prog)
            gl.deleteProgram(renderProg.prog)

        }

    }, [])

    return (
        <div
            ref={hostRef}
            style={{
                minWidth: 240,
                minHeight: 160,
                width: "100%",
                height: "100%",
                position: "relative",
                overflow: "hidden",
                background,
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
            {}
        </div>
    )
}

// 브랜드 팔레트 프리셋 — 캔버스 #faf9f6 + 포인트 퍼플 단계 (theme.css와 동일 값)
const __originkitPresetProps = {
  "background": "#FAF9F6",
  "colors": {
    "items": [
      "#857BF8",
      "#20CBDD",
      "#D8EC29"
    ]
  }
};

export default function CursorRingField(props: Record<string, unknown>) {
  return <__OriginkitBase_CursorRingField {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
