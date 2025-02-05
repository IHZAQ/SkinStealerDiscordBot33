import { createCanvas, loadImage } from "canvas"
import axios from "axios"
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url'
import fs from "fs"
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const paths = path => resolve(__dirname, path);
async function isSlimSkin(img) {
    const c = createCanvas(img.width, img.height), ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return !ctx.getImageData(50, 16, 1, 1).data[3];
}
async function shirt(skin) {
    const template = await loadImage(paths('template.png'));
    const s = (await isSlimSkin(skin)) ? 1 : 0;

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d")
    ctx.drawImage(template, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // TORSO
    // Top
    ctx.drawImage(skin, 20, 16, 8, 4, 231, 8, 128, 64);
    ctx.drawImage(skin, 20, 32, 8, 4, 231, 8, 128, 64);
    // Front
    ctx.drawImage(skin, 20, 20, 8, 12, 231, 74, 128, 128);
    ctx.drawImage(skin, 20, 36, 8, 12, 231, 74, 128, 128);
    // R
    ctx.drawImage(skin, 16, 20, 4, 12, 165, 74, 64, 128);
    ctx.drawImage(skin, 16, 36, 4, 12, 165, 74, 64, 128);
    // L
    ctx.drawImage(skin, 28, 20, 4, 12, 361, 74, 64, 128);
    ctx.drawImage(skin, 28, 36, 4, 12, 361, 74, 64, 128);
    // Back
    ctx.drawImage(skin, 32, 20, 8, 12, 427, 74, 128, 128);
    ctx.drawImage(skin, 32, 36, 8, 12, 427, 74, 128, 128);
    // Down (need to be inverted)
    
    // RIGHTARM
    // F
    ctx.drawImage(skin, 44, 20, 4 - s, 12, 217, 355, 64, 128);
    ctx.drawImage(skin, 44, 36, 4 - s, 12, 217, 355, 64, 128);
    // R
    ctx.drawImage(skin, 40, 20, 4, 12, 151, 355, 64, 128);
    ctx.drawImage(skin, 40, 36, 4, 12, 151, 355, 64, 128);
    // B
    ctx.drawImage(skin, 52 - s, 20, 4 - s, 12, 85, 355, 64, 128);
    ctx.drawImage(skin, 52 - s, 36, 4 - s, 12, 85, 355, 64, 128);
    // L
    ctx.drawImage(skin, 48 - s, 20, 4, 12, 19, 355, 64, 128);
    ctx.drawImage(skin, 48 - s, 36, 4, 12, 19, 355, 64, 128);
    // U
    ctx.drawImage(skin, 44, 16, 4 - s, 4, 217, 289, 64, 64);
    ctx.drawImage(skin, 44, 32, 4 - s, 4, 217, 289, 64, 64);
    // LEFTARM
    // F
    ctx.drawImage(skin, 36, 52, 4 - s , 12, 308, 355, 64, 128);
    ctx.drawImage(skin, 52, 52, 4 - s, 12, 308, 355, 64, 128);
    // L
    ctx.drawImage(skin, 40 - s, 52, 4, 12, 374, 355, 64, 128);
    ctx.drawImage(skin, 56 - s, 52, 4, 12, 374, 355, 64, 128);
    // B
    ctx.drawImage(skin, 44 - s, 52, 4 - s, 12, 440, 355, 64, 128);
    ctx.drawImage(skin, 60 - s, 52, 4 - s, 12, 440, 355, 64, 128);
    // R
    ctx.drawImage(skin, 32, 52, 4, 12, 506, 355, 64, 128);
    ctx.drawImage(skin, 48, 52, 4, 12, 506, 355, 64, 128);
    // U
    ctx.drawImage(skin, 36, 48, 4 - s, 4, 308, 289, 64, 64);
    ctx.drawImage(skin, 52, 48, 4 - s, 4, 308, 289, 64, 64);
    // Avatar
    ctx.drawImage(skin, 8, 8, 8, 8, 40, 50, 64 , 64);
    ctx.drawImage(skin, 40, 8, 8, 8, 40, 50, 64 , 64);
    // INVERTED
    ctx.scale(1, -1);
    // Torso Down
    ctx.drawImage(skin, 28, 16, 8, 4, 231, -268, 128, 64);
    ctx.drawImage(skin, 28, 32, 8, 4, 231, -268, 128, 64);
    // Right Arm Down
    ctx.drawImage(skin, 48 - s, 16, 4 - s, 4, 217, -549, 64, 64);
    ctx.drawImage(skin, 48 - s, 32, 4 - s, 4, 217, -549, 64, 64);
    // Left Arm Down
    ctx.drawImage(skin, 40 - s, 48, 4 - s, 4, 308, -549, 64, 64);
    ctx.drawImage(skin, 56 - s, 48, 4 - s, 4, 308, -549, 64, 64);

    const buffer = canvas.toBuffer('image/png')
    return buffer
}
async function pants(skin) {
    const template = await loadImage(paths('templateleg.png'));

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext("2d")
    ctx.drawImage(template, 0, 0);
    ctx.imageSmoothingEnabled = false;
    // TORSO
    // Top
    ctx.drawImage(skin, 20, 16, 8, 4, 231, 8, 128, 64);
    ctx.drawImage(skin, 20, 32, 8, 4, 231, 8, 128, 64);
    // Front
    ctx.drawImage(skin, 20, 20, 8, 12, 231, 74, 128, 128);
    ctx.drawImage(skin, 20, 36, 8, 12, 231, 74, 128, 128);
    // R
    ctx.drawImage(skin, 16, 20, 4, 12, 165, 74, 64, 128);
    ctx.drawImage(skin, 16, 36, 4, 12, 165, 74, 64, 128);
    // L
    ctx.drawImage(skin, 28, 20, 4, 12, 361, 74, 64, 128);
    ctx.drawImage(skin, 28, 36, 4, 12, 361, 74, 64, 128);
    // Back
    ctx.drawImage(skin, 32, 20, 8, 12, 427, 74, 128, 128);
    ctx.drawImage(skin, 32, 36, 8, 12, 427, 74, 128, 128);
    // Down (need to be inverted)
    
    // RIGHTLEG
    // F
    ctx.drawImage(skin, 4, 20, 4, 12, 217, 355, 64, 128);
    ctx.drawImage(skin, 4, 36, 4, 12, 217, 355, 64, 128);
    // R
    ctx.drawImage(skin, 0, 20, 4, 12, 151, 355, 64, 128);
    ctx.drawImage(skin, 0, 36, 4, 12, 151, 355, 64, 128);
    // B
    ctx.drawImage(skin, 12, 20, 4, 12, 85, 355, 64, 128);
    ctx.drawImage(skin, 12, 36, 4, 12, 85, 355, 64, 128);
    // L
    ctx.drawImage(skin, 8, 20, 4, 12, 19, 355, 64, 128);
    ctx.drawImage(skin, 8, 36, 4, 12, 19, 355, 64, 128);
    // U
    ctx.drawImage(skin, 4, 16, 4, 4, 217, 289, 64, 64);
    ctx.drawImage(skin, 4, 32, 4, 4, 217, 289, 64, 64);
    // LEFTLEG
    // F
    ctx.drawImage(skin, 20, 52, 4, 12, 308, 355, 64, 128);
    ctx.drawImage(skin, 5, 52, 4, 12, 308, 355, 64, 128);
    // L
    ctx.drawImage(skin, 24, 52, 4, 12, 374, 355, 64, 128);
    ctx.drawImage(skin, 8, 52, 4, 12, 374, 355, 64, 128);
    // B
    ctx.drawImage(skin, 28, 52, 4, 12, 440, 355, 64, 128);
    ctx.drawImage(skin, 12, 52, 4, 12, 440, 355, 64, 128);
    // R
    ctx.drawImage(skin, 16, 52, 4, 12, 506, 355, 64, 128);
    ctx.drawImage(skin, 0, 52, 4, 12, 506, 355, 64, 128);
    // U
    ctx.drawImage(skin, 20, 48, 4, 4, 308, 289, 64, 64);
    ctx.drawImage(skin, 4, 48, 4, 4, 308, 289, 64, 64);
    // Avatar
    ctx.drawImage(skin, 8, 8, 8, 8, 40, 50, 64 , 64);
    ctx.drawImage(skin, 40, 8, 8, 8, 40, 50, 64 , 64);
    // INVERTED
    ctx.scale(1, -1);
    // Torso Down
    ctx.drawImage(skin, 28, 16, 8, 4, 231, -268, 128, 64);
    ctx.drawImage(skin, 28, 32, 8, 4, 231, -268, 128, 64);
    // Right Leg Down
    ctx.drawImage(skin, 8, 16, 4, 4, 217, -549, 64, 64);
    ctx.drawImage(skin, 8, 32, 4, 4, 217, -549, 64, 64);
    // Left Leg Down
    ctx.drawImage(skin, 24, 48, 4, 4, 308, -549, 64, 64);
    ctx.drawImage(skin, 8, 48, 4, 4, 308, -549, 64, 64);

    const buffer = canvas.toBuffer('image/png')
    return buffer
}
const generate = async (url) => {
  const res = await axios.get(url, { responseType: "arraybuffer" }).catch(err => {});
  const buffer = Buffer.from(res.data);
  const img = await loadImage(buffer);
  if (img.width !== 64 || img.height !== 64) return undefined;
  return [await shirt(img), await pants(img)]
}
export default generate