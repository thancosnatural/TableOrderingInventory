// Resizes an image to a max edge and returns { base64, file }.
// - base64: data URL string for your current API
// - file:   a File you can preview with URL.createObjectURL() or send as multipart later
export async function resizeImageToBase64(
  file,
  {
    maxEdge = 1500,                // cap on longer side (px)
    mimeType = "image/jpeg",       // "image/webp" also fine
    quality = 0.82,                // 0..1
  } = {}
) {
  // Load bitmap (handles orientation in most modern browsers)
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height));
  const width = Math.max(1, Math.round(bmp.width * scale));
  const height = Math.max(1, Math.round(bmp.height * scale));

  // Use OffscreenCanvas if available, otherwise a normal canvas
  const useOffscreen = typeof OffscreenCanvas !== "undefined";
  const canvas = useOffscreen
    ? new OffscreenCanvas(width, height)
    : Object.assign(document.createElement("canvas"), { width, height });

  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(bmp, 0, 0, width, height);

  // Encode
  const blob = await (canvas.convertToBlob
    ? canvas.convertToBlob({ type: mimeType, quality })
    : new Promise((resolve) => (canvas.toBlob((b) => resolve(b), mimeType, quality)))
  );

  const base64 = await blobToDataURL(blob);
  const outExt = mimeType === "image/webp" ? ".webp" : ".jpg";
  const outName = file.name.replace(/\.\w+$/, outExt);
  const outFile = new File([blob], outName, { type: mimeType, lastModified: Date.now() });

  return { base64, file: outFile };
}

export function blobToDataURL(blob) {
  return new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
}
