import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 8;

/**
 * Compresses a File to stay under MAX_SIZE_MB using the browser.
 * If the file is already small enough, it is returned as-is (converted to File).
 */
export async function compressImage(file: File): Promise<File> {
  if (file.size <= MAX_SIZE_MB * 1024 * 1024) {
    return file;
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: MAX_SIZE_MB,
    maxWidthOrHeight: 6000,
    useWebWorker: true,
    fileType: file.type as string,
  });

  // imageCompression returns a Blob; cast back to File to keep the original name
  return new File([compressed], file.name, { type: compressed.type });
}
