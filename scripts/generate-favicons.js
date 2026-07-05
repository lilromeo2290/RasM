#!/usr/bin/env node
/**
 * Generate favicons from the RAS MUTA Foundation logo.
 * Outputs:
 *   - favicon.ico (multi-size ICO: 16x16, 32x32, 48x48)
 *   - favicon-16x16.png
 *   - favicon-32x32.png
 *   - favicon-48x48.png
 *   - apple-touch-icon.png (180x180)
 *   - icon-192x192.png (Android)
 *   - icon-512x512.png (Android/PWA)
 */

const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SOURCE = '/home/z/my-project/public/ras-muta-logo.jpg'
const OUT_DIR = '/home/z/my-project/public'

async function generatePng(size, outName) {
  const outPath = path.join(OUT_DIR, outName)
  await sharp(SOURCE)
    .resize(size, size, { fit: 'cover', position: 'center' })
    .png()
    .toFile(outPath)
  console.log(`✓ ${outName} (${size}x${size})`)
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error('Source logo not found:', SOURCE)
    process.exit(1)
  }

  // Generate PNG favicons in various sizes
  await generatePng(16, 'favicon-16x16.png')
  await generatePng(32, 'favicon-32x32.png')
  await generatePng(48, 'favicon-48x48.png')
  await generatePng(180, 'apple-touch-icon.png')
  await generatePng(192, 'icon-192x192.png')
  await generatePng(512, 'icon-512x512.png')

  // Create favicon.ico by concatenating the 16, 32, 48 PNGs into an ICO
  // ICO format is a simple header + directory entries + image data.
  const sizes = [16, 32, 48]
  const pngBuffers = await Promise.all(
    sizes.map(size =>
      sharp(SOURCE)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer()
    )
  )

  const ico = createIco(pngBuffers, sizes)
  const icoPath = path.join(OUT_DIR, 'favicon.ico')
  fs.writeFileSync(icoPath, ico)
  console.log(`✓ favicon.ico (${sizes.join(', ')} multi-size)`)

  console.log('\nAll favicons generated in', OUT_DIR)
}

/**
 * Build a multi-image ICO file from PNG buffers.
 */
function createIco(pngBuffers, sizes) {
  const count = pngBuffers.length
  const headerSize = 6
  const dirEntrySize = 16
  const dirSize = dirEntrySize * count
  let offset = headerSize + dirSize

  // Build directory entries
  const dirEntries = []
  for (let i = 0; i < count; i++) {
    const size = sizes[i]
    const png = pngBuffers[i]
    const entry = Buffer.alloc(dirEntrySize)
    entry.writeUInt8(size === 256 ? 0 : size, 0)   // width (0 = 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1)   // height (0 = 256)
    entry.writeUInt8(0, 2)                          // color palette count (0 for PNG)
    entry.writeUInt8(0, 3)                          // reserved
    entry.writeUInt16LE(1, 4)                       // color planes
    entry.writeUInt16LE(32, 6)                      // bits per pixel
    entry.writeUInt32LE(png.length, 8)              // image size
    entry.writeUInt32LE(offset, 12)                 // offset to image data
    dirEntries.push(entry)
    offset += png.length
  }

  // Build header
  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)   // reserved
  header.writeUInt16LE(1, 2)   // type: 1 = ICO
  header.writeUInt16LE(count, 4)  // number of images

  return Buffer.concat([header, ...dirEntries, ...pngBuffers])
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
