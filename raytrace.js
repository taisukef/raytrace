import * as THREE from "https://unpkg.com/three@0.128.0/build/three.module.js";
import { PNG } from "https://taisukef.github.io/PNG/PNG.js";

const peye = new THREE.Vector3(0, 0, -5);
const psphere = new THREE.Vector3(0, 0, 3);
const rsphere = 1.0;
 
const pw = new THREE.Vector3(0, 0, 0);

const width = 32;
const height = width;
const imgd = new Uint8Array(width * height * 4);
let idx = 0;
for (let y = 0; y < height; y++) {
  pw.y = -2 * y / (height - 1) + 1.0;
  for (let x = 0; x < width; x++) {
    pw.x = 2 * x / (width - 1) - 1.0;
    
    const direye = new THREE.Vector3();
    direye.subVectors(pw, peye);
    const t = direye.sub(psphere);
    
    const a = Math.pow(t.length(), 2);
    const b = 2 * t.dot(psphere);
    const c = Math.pow(psphere.length(), 2) - Math.pow(rsphere, 2);
    const d = b * b - 4 * a * c;
    
    let col = 0;
    if (d >= 0) {
      col = 200 << 16;
    } else {
      col = 0;
    }
    imgd[idx++] = (col >> 16) & 0xff;
    imgd[idx++] = (col >> 8) & 0xff;
    imgd[idx++] = col & 0xff;
    imgd[idx++] = 0xff; // (col >> 24) & 0xff; // alpha
  }
}

const showConsole = (imgd, w) => {
  const h = imgd.length / 4 / w;
  let idx = 0;
  for (let y = 0; y < h; y++) {
    const s = [];
    for (let x = 0; x < w; x++) {
      const c = imgd[idx];
      idx += 4;
      s.push(c ? "o" : " ");
    }
    console.log(s.join(""));
  }
};

showConsole(imgd, width);
await Deno.writeFile("output.png", PNG.encode(imgd, width, height));
