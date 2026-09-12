const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const img1Path = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/53e190ab-1a75-4b66-80ca-9521e28a1b65/.user_uploaded/media_1788974398890.png';
const img2Path = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/53e190ab-1a75-4b66-80ca-9521e28a1b65/.user_uploaded/media_1788974408238.png';
const outDir = 'd:/Aethex Store New/public/images/a711';

async function processImages() {
  console.log('--- Starting High-Resolution Image Upscaling ---');

  // ==========================================
  // 1. Process Image 2: Phone Mounted in Holder
  // ==========================================
  console.log('Processing Image 2 (Mounted Smartphone)...');
  const img2 = sharp(img2Path);
  const meta2 = await img2.metadata();
  const { data: raw2, info: info2 } = await sharp(img2Path).raw().toBuffer({ resolveWithObject: true });

  // Find bounding box of non-white pixels
  let minX = info2.width, maxX = 0, minY = info2.height, maxY = 0;
  for (let y = 0; y < info2.height; y++) {
    for (let x = 0; x < info2.width; x++) {
      const idx = (y * info2.width + x) * info2.channels;
      const r = raw2[idx];
      const g = raw2[idx + 1];
      const b = raw2[idx + 2];
      // Check if not white background (threshold 245)
      if (r < 242 || g < 242 || b < 242) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Image 2 Bounding Box: [${minX}, ${minY}, ${maxX}, ${maxY}] (Width: ${maxX - minX}, Height: ${maxY - minY})`);

  // Add 30px padding around bounding box
  const pad = 30;
  const cropX = Math.max(0, minX - pad);
  const cropY = Math.max(0, minY - pad);
  const cropW = Math.min(info2.width - cropX, (maxX - minX) + pad * 2);
  const cropH = Math.min(info2.height - cropY, (maxY - minY) + pad * 2);

  // Extract raw cropped buffer and convert white background to dark luxury studio background (#0B0B0B)
  const cropped = await sharp(img2Path)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cData = cropped.data;
  const cInfo = cropped.info;
  const darkBuf = Buffer.alloc(cInfo.width * cInfo.height * 4);

  for (let i = 0; i < cInfo.width * cInfo.height; i++) {
    const srcIdx = i * cInfo.channels;
    const dstIdx = i * 4;
    const r = cData[srcIdx];
    const g = cData[srcIdx + 1];
    const b = cData[srcIdx + 2];

    // Whiteness factor: 0 (dark hardware) to 1 (pure white background)
    const brightness = (r + g + b) / 3;
    if (brightness > 240) {
      // Background: deep dark luxury surface (#0B0B0B)
      darkBuf[dstIdx] = 11;
      darkBuf[dstIdx + 1] = 11;
      darkBuf[dstIdx + 2] = 11;
      darkBuf[dstIdx + 3] = 255;
    } else if (brightness > 215) {
      // Smooth anti-aliased edge feathering
      const t = (brightness - 215) / 25; // 0 to 1
      darkBuf[dstIdx] = Math.round(r * (1 - t) + 11 * t);
      darkBuf[dstIdx + 1] = Math.round(g * (1 - t) + 11 * t);
      darkBuf[dstIdx + 2] = Math.round(b * (1 - t) + 11 * t);
      darkBuf[dstIdx + 3] = 255;
    } else {
      // Original hardware pixel
      darkBuf[dstIdx] = r;
      darkBuf[dstIdx + 1] = g;
      darkBuf[dstIdx + 2] = b;
      darkBuf[dstIdx + 3] = 255;
    }
  }

  // Save upscaled 1600x1600 dark luxury studio version
  await sharp(darkBuf, { raw: { width: cInfo.width, height: cInfo.height, channels: 4 } })
    .resize(1600, 1600, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 11, g: 11, b: 11, alpha: 1 }
    })
    .sharpen({ sigma: 1.2, m1: 1.2, m2: 0.5 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'mounted_phone_studio.jpg'));

  // Also save clean original white studio version upscaled to 1600x1600
  await sharp(img2Path)
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .resize(1600, 1600, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .sharpen({ sigma: 1.2, m1: 1.2, m2: 0.5 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'mounted_phone_clean.jpg'));

  console.log('✓ Created mounted_phone_studio.jpg and mounted_phone_clean.jpg (1600x1600)');

  // ==========================================
  // 2. Process Image 1: Retail Packaging & Hardware
  // ==========================================
  console.log('Processing Image 1 (Retail Box & Angles)...');

  // Full composite upscaled to 2048x2048 with Lanczos3 and crisp unsharp masking
  await sharp(img1Path)
    .resize(2048, 2048, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 1.3, m1: 1.4, m2: 0.6 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'packaging_and_mount_2k.jpg'));

  // Crop: Official Retail Box (left section)
  // Box is located approximately: left 40, top 20, width 450, height 670
  await sharp(img1Path)
    .extract({ left: 40, top: 20, width: 440, height: 670 })
    .resize(1200, 1600, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .sharpen({ sigma: 1.4, m1: 1.5, m2: 0.6 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'retail_package_box.jpg'));

  // Crop: Main High-Detail Hardware Mount (right section)
  // Mount is located approximately: left 530, top 120, width 470, height 830
  await sharp(img1Path)
    .extract({ left: 530, top: 120, width: 470, height: 830 })
    .resize(1400, 1800, {
      kernel: sharp.kernel.lanczos3,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .sharpen({ sigma: 1.3, m1: 1.3, m2: 0.5 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'aspor_hardware_angle.jpg'));

  // Crop: 3 Technical Inset Views (bottom row)
  // Sub 1: Front Clamp View (left: 30, top: 720, width: 180, height: 210)
  await sharp(img1Path)
    .extract({ left: 30, top: 720, width: 180, height: 210 })
    .resize(800, 800, { kernel: sharp.kernel.lanczos3, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 1.4 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'technical_front_clamp.jpg'));

  // Sub 2: 45° Articulated View (left: 220, top: 720, width: 190, height: 210)
  await sharp(img1Path)
    .extract({ left: 220, top: 720, width: 190, height: 210 })
    .resize(800, 800, { kernel: sharp.kernel.lanczos3, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 1.4 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'technical_side_articulation.jpg'));

  // Sub 3: Rear Ball Joint & Base (left: 430, top: 720, width: 180, height: 210)
  await sharp(img1Path)
    .extract({ left: 430, top: 720, width: 180, height: 210 })
    .resize(800, 800, { kernel: sharp.kernel.lanczos3, fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .sharpen({ sigma: 1.4 })
    .jpeg({ quality: 95 })
    .toFile(path.join(outDir, 'technical_rear_socket.jpg'));

  console.log('✓ Created retail packaging, high-detail mount, and technical insets.');
  console.log('--- All Images Upscaled Successfully ---');
}

processImages().catch(err => {
  console.error('Error processing images:', err);
  process.exit(1);
});
