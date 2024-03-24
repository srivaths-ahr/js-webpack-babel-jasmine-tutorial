var webgl = {
  draw: {
    rectangle: function (canvas) {
      var indices = [3, 2, 1, 3, 1, 0],
        gl = canvas.getContext("webgl", { preserveDrawingBuffer: !0 }),
        vertex_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer),
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            -0.75,
            0.75,
            0,
            -0.75,
            -0.75,
            0,
            0.75,
            -0.75,
            0,
            0.75,
            0.75,
            0,
          ]),
          gl.STATIC_DRAW
        ),
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
      var index_buffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer),
        gl.bufferData(
          gl.ELEMENT_ARRAY_BUFFER,
          new Uint16Array(indices),
          gl.STATIC_DRAW
        ),
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      var vertShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(
        vertShader,
        "attribute vec3 coordinates;void main(void) { gl_Position = vec4(coordinates, 1.0);}"
      ),
        gl.compileShader(vertShader);
      var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(
        fragShader,
        "void main(void) { gl_FragColor = vec4(255, 0, 0, 1);}"
      ),
        gl.compileShader(fragShader);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertShader),
        gl.attachShader(shaderProgram, fragShader),
        gl.linkProgram(shaderProgram),
        gl.useProgram(shaderProgram),
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer),
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
      var coord = gl.getAttribLocation(shaderProgram, "coordinates");
      gl.vertexAttribPointer(coord, 3, gl.FLOAT, !1, 0, 0),
        gl.enableVertexAttribArray(coord),
        gl.clearColor(0, 0, 0, 0),
        gl.enable(gl.DEPTH_TEST),
        gl.clear(gl.COLOR_BUFFER_BIT),
        gl.viewport(0, 0, canvas.width, canvas.height),
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    },
    cube: function (canvas) {
      let ARRAY_TYPE =
        "undefined" != typeof Float32Array ? Float32Array : Array;
      function create() {
        let out = new ARRAY_TYPE(16);
        return (
          ARRAY_TYPE != Float32Array &&
            ((out[1] = 0),
            (out[2] = 0),
            (out[3] = 0),
            (out[4] = 0),
            (out[6] = 0),
            (out[7] = 0),
            (out[8] = 0),
            (out[9] = 0),
            (out[11] = 0),
            (out[12] = 0),
            (out[13] = 0),
            (out[14] = 0)),
          (out[0] = 1),
          (out[5] = 1),
          (out[10] = 1),
          (out[15] = 1),
          out
        );
      }
      function perspective(out, fovy, aspect, near, far) {
        let nf,
          f = 1 / Math.tan(fovy / 2);
        return (
          (out[0] = f / aspect),
          (out[1] = 0),
          (out[2] = 0),
          (out[3] = 0),
          (out[4] = 0),
          (out[5] = f),
          (out[6] = 0),
          (out[7] = 0),
          (out[8] = 0),
          (out[9] = 0),
          (out[11] = -1),
          (out[12] = 0),
          (out[13] = 0),
          (out[15] = 0),
          null !== far && far !== 1 / 0
            ? ((nf = 1 / (near - far)),
              (out[10] = (far + near) * nf),
              (out[14] = 2 * far * near * nf))
            : ((out[10] = -1), (out[14] = -2 * near)),
          out
        );
      }
      function translate(out, a, v) {
        let a00,
          a01,
          a02,
          a03,
          a10,
          a11,
          a12,
          a13,
          a20,
          a21,
          a22,
          a23,
          x = v[0],
          y = v[1],
          z = v[2];
        return (
          a === out
            ? ((out[12] = a[0] * x + a[4] * y + a[8] * z + a[12]),
              (out[13] = a[1] * x + a[5] * y + a[9] * z + a[13]),
              (out[14] = a[2] * x + a[6] * y + a[10] * z + a[14]),
              (out[15] = a[3] * x + a[7] * y + a[11] * z + a[15]))
            : ((a00 = a[0]),
              (a01 = a[1]),
              (a02 = a[2]),
              (a03 = a[3]),
              (a10 = a[4]),
              (a11 = a[5]),
              (a12 = a[6]),
              (a13 = a[7]),
              (a20 = a[8]),
              (a21 = a[9]),
              (a22 = a[10]),
              (a23 = a[11]),
              (out[0] = a00),
              (out[1] = a01),
              (out[2] = a02),
              (out[3] = a03),
              (out[4] = a10),
              (out[5] = a11),
              (out[6] = a12),
              (out[7] = a13),
              (out[8] = a20),
              (out[9] = a21),
              (out[10] = a22),
              (out[11] = a23),
              (out[12] = a00 * x + a10 * y + a20 * z + a[12]),
              (out[13] = a01 * x + a11 * y + a21 * z + a[13]),
              (out[14] = a02 * x + a12 * y + a22 * z + a[14]),
              (out[15] = a03 * x + a13 * y + a23 * z + a[15])),
          out
        );
      }
      const shaders = {
        vertex:
          "\n          precision mediump float;\n          attribute vec4 avertPosition;\n          attribute vec4 avertColor;\n          varying vec4 vfragColor;\n          uniform mat4 umodelMatrix;\n          uniform mat4 uprojectionMatrix;\n          void main()\n          {\n            vfragColor = avertColor;\n            gl_Position  =  uprojectionMatrix * umodelMatrix * avertPosition;\n          }\n        ",
        fragment:
          "\n          precision mediump float;\n          varying vec4 vfragColor;\n          void main()\n          {\n            gl_FragColor = vfragColor;\n          }\n        ",
      };
      class Cube {
        constructor(gl) {
          (this.gl = gl), this.buffers;
        }
        setUp() {
          const positionBuffer = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
          this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            new Float32Array([
              -1,
              -1,
              1,
              1,
              -1,
              1,
              1,
              1,
              1,
              -1,
              1,
              1,
              -1,
              -1,
              -1,
              -1,
              1,
              -1,
              1,
              1,
              -1,
              1,
              -1,
              -1,
              -1,
              1,
              -1,
              -1,
              1,
              1,
              1,
              1,
              1,
              1,
              1,
              -1,
              -1,
              -1,
              -1,
              1,
              -1,
              -1,
              1,
              -1,
              1,
              -1,
              -1,
              1,
              1,
              -1,
              -1,
              1,
              1,
              -1,
              1,
              1,
              1,
              1,
              -1,
              1,
              -1,
              -1,
              -1,
              -1,
              -1,
              1,
              -1,
              1,
              1,
              -1,
              1,
              -1,
            ]),
            this.gl.STATIC_DRAW
          );
          const faceColors = [
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [0, 1, 0, 1],
            [0, 0, 1, 1],
            [1, 1, 0, 1],
            [1, 0, 1, 1],
          ];
          for (var colors = [], j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
            colors = colors.concat(c, c, c, c);
          }
          const colorBuffer = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer),
            this.gl.bufferData(
              this.gl.ARRAY_BUFFER,
              new Float32Array(colors),
              this.gl.STATIC_DRAW
            );
          const indexBuffer = this.gl.createBuffer();
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer),
            this.gl.bufferData(
              this.gl.ELEMENT_ARRAY_BUFFER,
              new Uint16Array([
                0,
                1,
                2,
                0,
                2,
                3,
                4,
                5,
                6,
                4,
                6,
                7,
                8,
                9,
                10,
                8,
                10,
                11,
                12,
                13,
                14,
                12,
                14,
                15,
                16,
                17,
                18,
                16,
                18,
                19,
                20,
                21,
                22,
                20,
                22,
                23,
              ]),
              this.gl.STATIC_DRAW
            ),
            (this.buffers = {
              color: colorBuffer,
              indices: indexBuffer,
              position: positionBuffer,
            });
        }
      }
      let webgl = new (class {
        constructor(canvas) {
          (this.gl = canvas.getContext("webgl", {
            preserveDrawingBuffer: !0,
          })),
            this.program,
            (this.shaders = {}),
            (this.cubes = []);
        }
        async setUp() {
          if (
            (this.gl ||
              (log("WebGL not supported, falling back on experimental-webgl"),
              (this.gl = canvas.getContext("experimental-webgl", {
                preserveDrawingBuffer: !0,
              }))),
            !this.gl)
          )
            return log("Your browser does not support WebGL"), null;
          let vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER),
            fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
          if (
            (this.gl.shaderSource(vertexShader, shaders.vertex),
            this.gl.shaderSource(fragmentShader, shaders.fragment),
            (this.program = this.gl.createProgram()),
            [vertexShader, fragmentShader].forEach((shader) => {
              if (
                (this.gl.compileShader(shader),
                !this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))
              )
                return (
                  error(
                    "ERROR compiling a shader!",
                    this.gl.getShaderInfoLog(shader)
                  ),
                  void this.gl.deleteShader(shader)
                );
              this.gl.attachShader(this.program, shader);
            }),
            this.gl.linkProgram(this.program),
            this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS))
          ) {
            if (
              (this.gl.validateProgram(this.program),
              this.gl.getProgramParameter(
                this.program,
                this.gl.VALIDATE_STATUS
              ))
            )
              return (
                (this.shaders.attributes = {
                  positionAttrib: this.gl.getAttribLocation(
                    this.program,
                    "avertPosition"
                  ),
                  colorAttrib: this.gl.getAttribLocation(
                    this.program,
                    "avertColor"
                  ),
                }),
                (this.shaders.uniforms = {
                  modelMatrix: this.gl.getUniformLocation(
                    this.program,
                    "umodelMatrix"
                  ),
                  projectionMatrix: this.gl.getUniformLocation(
                    this.program,
                    "uprojectionMatrix"
                  ),
                }),
                "Webgl Set Up"
              );
            error(
              "ERROR validating program!",
              this.gl.getProgramInfoLog(this.program)
            );
          } else
            error(
              "ERROR linking program!",
              this.gl.getProgramInfoLog(this.program)
            );
        }
        clear(color) {
          return (
            this.gl.clearColor(color[0], color[1], color[2], color[3]),
            this.gl.clearDepth(1),
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT),
            "Cleared"
          );
        }
        makeCube() {
          let newCube = new Cube(this.gl);
          return newCube.setUp(), this.cubes.push(newCube), "FillRect called";
        }
        render() {
          for (let i = 0; i < this.cubes.length; i++) {
            this.gl.bindBuffer(
              this.gl.ARRAY_BUFFER,
              this.cubes[i].buffers.position
            ),
              this.gl.vertexAttribPointer(
                this.shaders.attributes.positionAttrib,
                3,
                this.gl.FLOAT,
                this.gl.FALSE,
                0 * Float32Array.BYTES_PER_ELEMENT,
                0 * Float32Array.BYTES_PER_ELEMENT
              ),
              this.gl.enableVertexAttribArray(
                this.shaders.attributes.positionAttrib
              ),
              this.gl.bindBuffer(
                this.gl.ARRAY_BUFFER,
                this.cubes[i].buffers.color
              ),
              this.gl.vertexAttribPointer(
                this.shaders.attributes.colorAttrib,
                4,
                this.gl.FLOAT,
                this.gl.FALSE,
                0 * Float32Array.BYTES_PER_ELEMENT,
                0 * Float32Array.BYTES_PER_ELEMENT
              ),
              this.gl.enableVertexAttribArray(
                this.shaders.attributes.colorAttrib
              ),
              this.gl.bindBuffer(
                this.gl.ELEMENT_ARRAY_BUFFER,
                this.cubes[i].buffers.indices
              ),
              this.gl.useProgram(this.program);
            const projectionMatrix = create(),
              modelMatrix = create();
            perspective(
              projectionMatrix,
              (45 * Math.PI) / 180,
              this.gl.canvas.clientWidth / this.gl.canvas.clientHeight,
              0.1,
              100
            ),
              translate(modelMatrix, modelMatrix, [0, 0, -6]),
              this.gl.uniformMatrix4fv(
                this.shaders.uniforms.projectionMatrix,
                !1,
                projectionMatrix
              ),
              this.gl.uniformMatrix4fv(
                this.shaders.uniforms.modelMatrix,
                !1,
                modelMatrix
              ),
              this.gl.drawElements(
                this.gl.TRIANGLES,
                36,
                this.gl.UNSIGNED_SHORT,
                0
              );
          }
        }
      })(canvas);
      webgl.setUp().then(() => {
        webgl.gl.viewport(0, 0, 500, 500),
          webgl.makeCube(),
          requestAnimationFrame(function () {
            webgl.clear([1, 1, 0, 1]), webgl.render();
          });
      });
    },
  },
};

("use strict");
const utils = {
  buf2hex: (buffer) =>
    Array.prototype.map
      .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
      .join(""),
  hash: (buffer) => crypto.subtle.digest("SHA-256", buffer),
};

// Predefined hash value for comparison
const hashes = {
  webgl: "bf9da7959d914298f9ce9e41a480fd66f76fac5c6f5e0a9b5a99b18cfc6fd997",
};
function isFingerPrintSpoofedByPersistentNoise() {
  const c = document.createElement("canvas");
  return (
    (c.width = 256),
    (c.height = 24),
    new Promise((resolve, reject) => {
      webgl.draw.rectangle(c);
      // const container = document.getElementById("red-solid-box");
      // Create a new div element
      const container = document.createElement("div");
      container.id = "red-solid-box";
      container.style.display = "none";
      const style = document.createElement("style");
      style.textContent = `
        #red-solid-box canvas {
          max-width: 110px;
          border: solid 1px rgba(0, 0, 0, 0.2);
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(container);
      container.appendChild(c),
        window.setTimeout(function () {
          var gl = c.getContext("webgl", { preserveDrawingBuffer: !0 }),
            buffer = new Uint8Array(
              gl.drawingBufferWidth * gl.drawingBufferHeight * 4
            );
          gl.readPixels(
            0,
            0,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            buffer
          ),
            window.setTimeout(function () {
              utils.hash(buffer).then(utils.buf2hex).then(resolve, reject);
            }, 500);
        }, 500);
    })
  );
}
function getBrowserFingerPrint(method = "binary", loc) {
  const c = document.createElement("canvas");
  return (
    (c.width = 512),
    (c.height = 512),
    new Promise((resolve, reject) => {
      webgl.draw.cube(c);
      const container = document.createElement("div");
      container.id = "random-image-with-color-mixing-" + loc;
      container.style.display = "none";
      document.body.appendChild(container);
      container.appendChild(c),
        window.setTimeout(function () {
          var gl = c.getContext("webgl", { preserveDrawingBuffer: !0 }),
            buffer = new Uint8Array(
              gl.drawingBufferWidth * gl.drawingBufferHeight * 4
            );
          gl.readPixels(
            0,
            0,
            gl.drawingBufferWidth,
            gl.drawingBufferHeight,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            buffer
          ),
            window.setTimeout(function () {
              utils.hash(buffer).then(utils.buf2hex).then(resolve, reject);
            }, 500);
        }, 500);
    })
  );
}
const results = [];

function verdict() {
  if (results.length === 2) {
    const isSpoofed = results[0] || results[1];
    document.getElementById("webgl_fp_spoofed").textContent = isSpoofed;
    console.log("WebGL Fingerprint spoofed:", isSpoofed);
  }
}

isFingerPrintSpoofedByPersistentNoise().then((hash) => {
  const isSpoofed = hash !== hashes.webgl;
  console.log("WebGL Spoofed By Persistent Noise:", isSpoofed);
  results.push(isSpoofed), verdict();
}),
  Promise.all([
    getBrowserFingerPrint("png", "a"),
    new Promise((resolve, reject) => {
      window.addEventListener("load", () => {
        getBrowserFingerPrint("png", "b").then(resolve, reject);
      });
    }),
  ]).then(([hash1, hash2]) => {
    const isSpoofed = hash1 !== hash2;
    console.log("WebGL Spoofed random:", isSpoofed);
    results.push(isSpoofed);
    verdict();
  });

window.addEventListener("load", () => document.body.classList.add("ready"));
