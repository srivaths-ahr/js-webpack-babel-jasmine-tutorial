"use strict";

const canvas_utils = {
  buf2hex: (buffer) =>
    Array.prototype.map
      .call(new Uint8Array(buffer), (x) => ("00" + x.toString(16)).slice(-2))
      .join(""),
  hash: (buffer) =>
    crypto.subtle.digest("SHA-256", buffer).then((hash) => canvas_utils.buf2hex(hash)),
  hashes: {
    canvas: "e1611c0f76dfefc367d7e5411993eaf1295aafcb5f7b574157b3e686a789380c",
    webgl: "bf9da7959d914298f9ce9e41a480fd66f76fac5c6f5e0a9b5a99b18cfc6fd997"
  },
};

function isFingerPrintSpoofedByPersistentNoise() {
  const c = document.createElement("canvas");
  (c.width = 256), (c.height = 24);
  const ctx = c.getContext("2d", { willReadFrequently: true });
  (ctx.fillStyle = "rgb(255, 0, 0)"),
    ctx.fillRect(4, 4, c.width - 8, c.height - 8);
  const buffer = ctx.getImageData(0, 0, c.width, c.height).data.buffer;
  return canvas_utils.hash(buffer);
}

function getBrowserFingerPrint(method = "binary") {
  const c = document.createElement("canvas");
  (c.width = 256), (c.height = 24);
  const ctx = c.getContext("2d", { willReadFrequently: true }),
    txt = "Browser Fingerprinting <canvas> 1.0";
  (ctx.textBaseline = "middle"),
    (ctx.font = '14px "Arial"'),
    (ctx.textBaseline = "alphabetic"),
    (ctx.fillStyle = "rgb(255, 102, 0)"),
    ctx.fillRect(c.width / 4, 0, c.width / 2, c.height),
    (ctx.fillStyle = "rgb(0, 102, 153)"),
    ctx.fillText(txt, 2, 15),
    (ctx.fillStyle = "rgb(102, 204, 0)"),
    ctx.fillText(txt, 4, 17);
  const enc = new TextEncoder(),
    buffer =
      "binary" === method
        ? ctx.getImageData(0, 0, c.width, c.height).data.buffer
        : enc.encode(c.toDataURL());
  return canvas_utils.hash(buffer);
}

async function checkFingerPrints() {
  const redHash = await isFingerPrintSpoofedByPersistentNoise();
  const isSpoofedByPersistentNoise = redHash !== canvas_utils.hashes.canvas;

  const randomHashBefore = await getBrowserFingerPrint("png");
  const randomHashAfter = await getBrowserFingerPrint("png");
  const isSpoofedByRandomNoise = randomHashBefore !== randomHashAfter;

  const isSpoofed = isSpoofedByPersistentNoise || isSpoofedByRandomNoise;

  console.log(
    "Canvas Fingerprint spoofed by persistent noise:",
    isSpoofedByPersistentNoise
  );
  console.log("Canvas Fingerprint spoofed by random noise:", isSpoofedByRandomNoise);
  console.log("Canvas Fingerprint spoofed:", isSpoofed);

  document.getElementById("canvas_fp_spoofed").textContent = isSpoofed;
}

checkFingerPrints();
