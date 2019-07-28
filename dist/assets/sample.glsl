precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
                
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec3 tex = texture2D(u_texture, uv).rgb;
    gl_FragColor = vec4(tex, 1.0);
}