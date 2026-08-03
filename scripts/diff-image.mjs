/* Renders a red-highlight overlay of where two parity screenshots differ, and
   prints the bounding box, so a diff can be judged as real or as noise. */
import fs from "node:fs";
import { PNG } from "pngjs";
const [a, b, out] = process.argv.slice(2);
const A = PNG.sync.read(fs.readFileSync(a));
const B = PNG.sync.read(fs.readFileSync(b));
const O = new PNG({ width: A.width, height: A.height });
let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1, n = 0;
for (let y = 0; y < A.height; y++) {
  for (let x = 0; x < A.width; x++) {
    const i = (y * A.width + x) * 4;
    const d = Math.abs(A.data[i]-B.data[i]) + Math.abs(A.data[i+1]-B.data[i+1]) + Math.abs(A.data[i+2]-B.data[i+2]);
    const g = (A.data[i]*0.3 + A.data[i+1]*0.6 + A.data[i+2]*0.1) * 0.35;
    if (d > 6) {
      O.data[i]=255; O.data[i+1]=0; O.data[i+2]=0; O.data[i+3]=255;
      n++; if(x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y;
    } else { O.data[i]=g; O.data[i+1]=g; O.data[i+2]=g; O.data[i+3]=255; }
  }
}
fs.writeFileSync(out, PNG.sync.write(O));
console.log(JSON.stringify({ differing:n, bbox:{ x:minX, y:minY, w:maxX-minX+1, h:maxY-minY+1 }, size:{w:A.width,h:A.height} }));
