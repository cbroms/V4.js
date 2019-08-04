precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_deltaTime;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    //vec4 col = vec4(0);
    vec2 uv = gl_FragCoord.xy / u_resolution;
                    
    uv.x = uv.x+(rand(vec2(u_deltaTime,gl_FragCoord.y))-0.5)/256.0;
 
    uv.y = uv.y+(rand(vec2(u_deltaTime))-0.5)/128.0;

   col = col + (vec4(-0.5)+vec4(rand(vec2(gl_FragCoord.y,u_deltaTime)),rand(vec2(gl_FragCoord.y,u_deltaTime+1.0)),rand(vec2(gl_FragCoord.y,u_deltaTime+2.0)),0))*0.05;
   
    vec3 tex = texture2D(u_texture, uv).rgb;
    gl_FragColor = vec4(tex, 1.0);
}
