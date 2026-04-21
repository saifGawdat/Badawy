import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 2;

/**
 * Compresses a File to stay under MAX_SIZE_MB using the browser,
 * and converts it to WebP format.
 */
export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 4096, // Keep high resolution as requested
    useWebWorker: true,
    fileType: 'image/webp',
  };

  try {
    const compressedBlob = await imageCompression(file, options);
    // Keep original file name but update extension to .webp
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    return new File([compressedBlob], `${baseName}.webp`, { type: 'image/webp' });
  } catch (error) {
    console.error("Compression failed, returning original file", error);
    return file;
  }
}
