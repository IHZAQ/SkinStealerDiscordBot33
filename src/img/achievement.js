import { createCanvas, loadImage, registerFont } from 'canvas';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const paths = path => resolve(__dirname, path);
const fontPath = paths('minecraft.ttf');
const baseImagePath = paths('base.png');

const items = readdirSync(paths('./items')).filter(file => file.endsWith(".png")).map(e => e.split(".")[0]);

registerFont(fontPath, { family: 'Minecraft' });

async function drawImage({ title, description, icon, color1 = '#FFFF00', color2 = '#FFFFFF' }) {
    const canvas = createCanvas(640, 128);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const base = await loadImage(baseImagePath);
    const iconImagePath = paths(`items/${icon}.png`);
    const iconImage = await loadImage(iconImagePath);

    ctx.drawImage(base, 0, 0);

    ctx.font = '30px "Minecraft"';
    ctx.fillStyle = color1;
    ctx.fillText(title, 120, 56);

    ctx.fillStyle = color2;
    ctx.fillText(description, 120, 100);

    ctx.drawImage(iconImage, 34, 32, 64, 64);

    return canvas.toBuffer('image/png');
}
export { drawImage, items }