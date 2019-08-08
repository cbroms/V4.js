precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_deltaTime;
                
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    float frequency = 6.0 * 2.0;
    float amplitude = 0.015 * 2.0;
    float x = uv.y * frequency + u_deltaTime * .7; 
    float y = uv.x * frequency + u_deltaTime * .3;
    uv.x += cos(x+y) * amplitude * cos(y);
    uv.y += sin(x-y) * amplitude * cos(y);

    gl_FragColor = texture2D(u_texture, uv);
}