import{n as e,r as t,t as n}from"./index-mPtam_iy.js";var r=t(e(),1),i=n(),a=500,o=a/2,s=5,c=.175,l=.01,u=.01,d=40,f=1.5,p=65536,m=Math.PI*2,h=5,g=[`#7189ff`,`#3074f9`,`#0b0b18`],_=4,v=`
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
`,y=`
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
`,b=`
precision highp float;
attribute vec2 aPos;
varying vec2 vUV;
void main(){
    vUV = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}
`,x=`
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

${v}
${y}

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
`,S=e=>`
precision highp float;

attribute vec2 aUV;
attribute vec2 aRef;

uniform sampler2D uState;
uniform float uProjF;
uniform float uAspect;
uniform float uCamDist;
uniform float uPointScale;
${e?`uniform vec2  uRingPos;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uRingWidth2;
uniform float uTurb;
uniform float uTime;`:``}

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

${e?v:``}
${e?y:``}

void main(){
${e?`    vec2 disp; float t; float t2;
    fieldTerms(aRef, uRingPos, uTime * 0.5, uRingRadius, uRingWidth, uRingWidth2, uTurb, disp, t, t2);
    vec4 state = vec4(aRef + disp, t, t * 0.5);`:`    vec4 state = texture2D(uState, aUV);`}

    vLocalPos = state.xy;
    vScale    = state.z;
    vEnergy   = state.w;

    vec2 world = state.xy * ${s.toFixed(1)};

    gl_Position = vec4(world.x * uProjF / uAspect, world.y * uProjF, 0.0, uCamDist);

    gl_PointSize = max(vScale, 0.0) * 7.0 * uPointScale;
}
`,C=`
precision highp float;

varying vec2  vLocalPos;
varying float vScale;
varying float vEnergy;

uniform vec3  uColors[${h}];
uniform int   uColorCount;
uniform vec2  uRingPos;
uniform float uTime;

${v}

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
    for (int i = 0; i < 4; i++) {
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
`;function w(e,t,n){let r=e.createShader(t);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS)){let t=e.getShaderInfoLog(r);throw e.deleteShader(r),Error(t||`shader compile failed`)}return r}function T(e,t,n,r){let i=e.createProgram(),a=w(e,e.VERTEX_SHADER,t),o=w(e,e.FRAGMENT_SHADER,n);if(e.attachShader(i,a),e.attachShader(i,o),e.linkProgram(i),e.deleteShader(a),e.deleteShader(o),!e.getProgramParameter(i,e.LINK_STATUS)){let t=e.getProgramInfoLog(i);throw e.deleteProgram(i),Error(t||`program link failed`)}let s={},c=[];for(let t of r){let n=e.getUniformLocation(i,t);n===null&&c.push(t),s[t]=n}return{prog:i,u:s,nulls:c}}function E(e){let t={alpha:!0,antialias:!1,premultipliedAlpha:!1,depth:!1,stencil:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!1},n=e.getContext(`webgl2`,t),r=null;if(n)r=n.getExtension(`EXT_color_buffer_float`)?{internal:n.RGBA32F,format:n.RGBA,type:n.FLOAT}:{internal:n.RGBA16F,format:n.RGBA,type:n.HALF_FLOAT};else{if(n=e.getContext(`webgl`,t)||e.getContext(`experimental-webgl`,t),!n)return null;r=n.getExtension(`OES_texture_float`)&&n.getExtension(`WEBGL_color_buffer_float`)?{internal:n.RGBA,format:n.RGBA,type:n.FLOAT}:null}return n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS)<2&&(r=null),{gl:n,fmt:r}}function D(e,t,n,r){let i=e.createTexture();return e.bindTexture(e.TEXTURE_2D,i),e.texImage2D(e.TEXTURE_2D,0,t.internal,n,n,0,t.format,t.type,r||null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(e.TEXTURE_2D,null),i}function O(e,t,n){let r=D(e,t,n,null),i=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,r,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:r,fbo:i,ok:a}}function k(e){return function(){e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var A=(e,t,n,r,i)=>(e-t)*(i-r)/(n-t)+r;function j(e,t,n,r,i){let a=t/Math.SQRT2,o=Math.ceil(e/a),s=Math.ceil(e/a),c=new Int32Array(o*s).fill(-1),l=[],u=[],d=[],f=t*t,h=(e,t)=>{let n=l.length;l.push(e),u.push(t),c[(t/a|0)*o+(e/a|0)]=n,d.push(n)};for(h(i()*e,i()*e);d.length>0&&l.length<p;){let p=i()*d.length|0,g=d[p],_=!1;for(let d=0;d<r;d++){let r=i()*m,d=t+(n-t)*i(),p=l[g]+Math.cos(r)*d,v=u[g]+Math.sin(r)*d;if(p<0||v<0||p>=e||v>=e)continue;let y=p/a|0,b=v/a|0,x=!0;for(let e=Math.max(0,b-2);e<=Math.min(s-1,b+2)&&x;e++)for(let t=Math.max(0,y-2);t<=Math.min(o-1,y+2);t++){let n=c[e*o+t];if(n<0)continue;let r=l[n]-p,i=u[n]-v;if(r*r+i*i<f){x=!1;break}}if(x){h(p,v),_=!0;break}}_||(d[p]=d[d.length-1],d.pop())}return{px:l,py:u,count:l.length}}function M(e){let t=k(2654435769),{px:n,py:r,count:i}=j(a,A(e,0,300,10,2),A(e,0,300,11,3),20,t),s=8;for(;s*s<i;)s*=2;let c=new Float32Array(s*s*4),l=new Float32Array(i*2),u=new Float32Array(i*2);for(let e=0;e<i;e++){let t=(n[e]-o)/o,i=(r[e]-o)/o;c[e*4+0]=t,c[e*4+1]=i,u[e*2+0]=t,u[e*2+1]=i,l[e*2+0]=(e%s+.5)/s,l[e*2+1]=(Math.floor(e/s)+.5)/s}return{count:i,texSize:s,refs:c,aUV:l,aRef:u}}function ee(e,t){let n=Math.floor(e),r=e-n,i=e=>{let n=Math.sin((e+t)*127.1)*43758.5453;return n-Math.floor(n)},a=r*r*(3-2*r);return i(n)*(1-a)+i(n+1)*a}function N(e){if(typeof e!=`string`)return[1,1,1];let t=e.trim(),n=t.match(/^rgba?\(([^)]+)\)$/i);if(n){let e=n[1].split(`,`).map(e=>parseFloat(e));return[(e[0]||0)/255,(e[1]||0)/255,(e[2]||0)/255]}if(t=t.replace(`#`,``),t.length===3&&(t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),t.length===8&&(t=t.slice(0,6)),t.length!==6)return[1,1,1];let r=parseInt(t,16);return isFinite(r)?[(r>>16&255)/255,(r>>8&255)/255,(r&255)/255]:[1,1,1]}function P(e){let{background:t,colors:n,density:a=300,dotSize:o=120,speed:s=6,cameraDistance:p=160,ring:m={push:50,width:9,radius:12,turbulence:100},style:v}=e,y=n&&!Array.isArray(n)?n:{},w=t??y.background??`#04050a`,k=e=>(e??[]).filter(e=>!!e),A=[k(y.items),k(Array.isArray(n)?n:void 0),k(y.points),y.color1||y.color2||y.color3?[y.color1??g[0],y.color2??g[1],y.color3??g[2]]:[]].find(e=>e.length>0)??g,j=m.radius??12,P=m.width??9,F=m.push??0,I=m.turbulence??0,L=(0,r.useRef)(null),R=(0,r.useRef)(null),z=A.slice(0,h).map(N);z.length===0&&z.push(N(g[0]));let B=new Float32Array(15);for(let e=0;e<h;e++){let t=z[Math.min(e,z.length-1)];B[e*3+0]=t[0],B[e*3+1]=t[1],B[e*3+2]=t[2]}let V=(0,r.useRef)({});V.current={colors:B,colorCount:z.length,dotSize:o/100,speed:s/50,camDist:p/100,ringRadius:j/100,ringWidth:Math.max(P,1)/100,ringEdge:_/100,push:F/100,turb:I/100};let H=(0,r.useRef)(a),U=(0,r.useRef)(!0);return H.current!==a&&(H.current=a,U.current=!0),(0,r.useEffect)(()=>{let e=L.current,t=R.current;if(!e||!t)return;let n=E(e);if(!n)return;let{gl:r,fmt:i}=n,a=!!i,o=null,s=null;try{a&&(o=T(r,b,x,[`uState`,`uRefs`,`uRingPos`,`uRingRadius`,`uRingWidth`,`uRingWidth2`,`uPush`,`uTurb`,`uTime`]));let e=[`uProjF`,`uAspect`,`uCamDist`,`uPointScale`,`uColors[0]`,`uColorCount`,`uRingPos`,`uTime`];a?e.push(`uState`):e.push(`uRingRadius`,`uRingWidth`,`uRingWidth2`,`uTurb`),s=T(r,S(!a),C,e)}catch(e){console.warn(`CursorRingField:`,e.message);return}e.__probe={simNulls:o?o.nulls:[],renderNulls:s.nulls,useSim:a};let p=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,p),r.bufferData(r.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),r.STATIC_DRAW);let m=r.createBuffer(),h=r.createBuffer(),g=null,_=null,v=null,y=0,w=8;function k(){g&&r.deleteTexture(g),_&&(r.deleteTexture(_.tex),r.deleteFramebuffer(_.fbo)),v&&(r.deleteTexture(v.tex),r.deleteFramebuffer(v.fbo)),g=null,_=null,v=null}function A(e){k();let t=M(e);if(y=t.count,w=t.texSize,r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferData(r.ARRAY_BUFFER,t.aUV,r.STATIC_DRAW),r.bindBuffer(r.ARRAY_BUFFER,h),r.bufferData(r.ARRAY_BUFFER,t.aRef,r.STATIC_DRAW),!a)return;let n={internal:i.internal,format:r.RGBA,type:r.FLOAT};g=D(r,n,w,t.refs),_=O(r,i,w),v=O(r,i,w),r.bindTexture(r.TEXTURE_2D,_.tex),r.texImage2D(r.TEXTURE_2D,0,i.internal,w,w,0,r.RGBA,r.FLOAT,t.refs),r.bindTexture(r.TEXTURE_2D,v.tex),r.texImage2D(r.TEXTURE_2D,0,i.internal,w,w,0,r.RGBA,r.FLOAT,t.refs),r.bindTexture(r.TEXTURE_2D,null)}let j=1,N=1,P=1,F=()=>{j=Math.min(window.devicePixelRatio||1,f),N=Math.max(e.clientWidth||t.clientWidth||1,1),P=Math.max(e.clientHeight||t.clientHeight||1,1);let n=Math.max(1,Math.round(N*j)),r=Math.max(1,Math.round(P*j));(e.width!==n||e.height!==r)&&(e.width=n,e.height=r)};F();let I=new ResizeObserver(F);I.observe(e);let z={x:0,y:0,over:!1},B={x:0,y:0},W=0,G=0,K=null,te=()=>{if(G=0,K){if(K.quiet){z.over=!1;return}z.x=K.x/Math.max(N,1)*2-1,z.y=-(K.y/Math.max(P,1)*2-1),z.over=z.x>=-1&&z.x<=1&&z.y>=-1&&z.y<=1}},ne=e=>{K={x:e.clientX,y:e.clientY,quiet:!!e.target?.closest?.(`[data-quiet]`)},G||=requestAnimationFrame(te)},re=()=>{z.over=!1};window.addEventListener(`pointermove`,ne),e.addEventListener(`pointerleave`,re);let q=0,J=0,Y=0,X=0,Z=!0,ie=o?r.getAttribLocation(o.prog,`aPos`):-1,Q=r.getAttribLocation(s.prog,`aUV`),$=r.getAttribLocation(s.prog,`aRef`);r.disable(r.DEPTH_TEST),r.enable(r.BLEND),r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);let ae=t=>{q=requestAnimationFrame(ae);let n=V.current;if(U.current&&(U.current=!1,A(H.current)),!y)return;let i=J?(t-J)/1e3:1/60;J=t;let f=Math.min(i,1/20);Y=(Y+f*n.speed)%3600,X+=f*n.speed;let b=Math.max(N/Math.max(P,1),1e-4),x=1/Math.tan(d*Math.PI/180/2),S=(ee(X*.66,94.234)-.5)*2,C=(ee(X*.75,21.028)-.5)*2;W+=(+!!z.over-W)*(1-.92**(f*60));let T=S*.2,E=C*.1,D=T,O=E;if(W>1e-4){let e=z.x*b*n.camDist/x,t=z.y*n.camDist/x,r=e*c+S*u,i=t*c+C*u;D=T+(r-T)*W,O=E+(i-E)*W}let k=1-(1-(l+.11*W))**(f*60);B.x+=(D-B.x)*k,B.y+=(O-B.y)*k;let M=n.ringRadius+Math.sin(Y)*.03+Math.cos(Y*3)*.02;if(a){let e=Z?_:v,t=Z?v:_;r.bindFramebuffer(r.FRAMEBUFFER,t.fbo),r.viewport(0,0,w,w),r.disable(r.BLEND),r.useProgram(o.prog),r.bindBuffer(r.ARRAY_BUFFER,p),r.enableVertexAttribArray(ie),r.vertexAttribPointer(ie,2,r.FLOAT,!1,0,0),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,e.tex),r.uniform1i(o.u.uState,0),r.activeTexture(r.TEXTURE1),r.bindTexture(r.TEXTURE_2D,g),r.uniform1i(o.u.uRefs,1),r.uniform2f(o.u.uRingPos,B.x,B.y),r.uniform1f(o.u.uRingRadius,M),r.uniform1f(o.u.uRingWidth,n.ringWidth),r.uniform1f(o.u.uRingWidth2,n.ringEdge),r.uniform1f(o.u.uPush,n.push),r.uniform1f(o.u.uTurb,n.turb),r.uniform1f(o.u.uTime,Y),r.drawArrays(r.TRIANGLES,0,3),r.bindFramebuffer(r.FRAMEBUFFER,null),r.enable(r.BLEND),Z=!Z}if(r.viewport(0,0,e.width,e.height),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT),r.useProgram(s.prog),Q>=0&&(r.bindBuffer(r.ARRAY_BUFFER,m),r.enableVertexAttribArray(Q),r.vertexAttribPointer(Q,2,r.FLOAT,!1,0,0)),$>=0&&(r.bindBuffer(r.ARRAY_BUFFER,h),r.enableVertexAttribArray($),r.vertexAttribPointer($,2,r.FLOAT,!1,0,0)),a){let e=Z?_:v;r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,e.tex),r.uniform1i(s.u.uState,0)}else r.uniform1f(s.u.uRingRadius,M),r.uniform1f(s.u.uRingWidth,n.ringWidth),r.uniform1f(s.u.uRingWidth2,n.ringEdge),r.uniform1f(s.u.uTurb,n.turb);r.uniform1f(s.u.uProjF,x),r.uniform1f(s.u.uAspect,b),r.uniform1f(s.u.uCamDist,n.camDist),r.uniform1f(s.u.uPointScale,N/2e3*n.dotSize*j*.5),r.uniform3fv(s.u[`uColors[0]`],n.colors),r.uniform1i(s.u.uColorCount,n.colorCount),r.uniform2f(s.u.uRingPos,B.x,B.y),r.uniform1f(s.u.uTime,Y),r.drawArrays(r.POINTS,0,y)};return q=requestAnimationFrame(ae),()=>{cancelAnimationFrame(q),G&&cancelAnimationFrame(G),I.disconnect(),window.removeEventListener(`pointermove`,ne),e.removeEventListener(`pointerleave`,re),k(),r.deleteBuffer(p),r.deleteBuffer(m),r.deleteBuffer(h),o&&r.deleteProgram(o.prog),r.deleteProgram(s.prog)}},[]),(0,i.jsx)(`div`,{ref:R,style:{minWidth:240,minHeight:160,width:`100%`,height:`100%`,position:`relative`,overflow:`hidden`,background:w,...v},children:(0,i.jsx)(`canvas`,{ref:L,style:{position:`absolute`,inset:0,width:`100%`,height:`100%`,display:`block`}})})}var F={background:`#FAF9F6`,colors:{items:[`#857BF8`,`#20CBDD`,`#D8EC29`]}};function I(e){return(0,i.jsx)(P,{...F,...e})}export{I as default};