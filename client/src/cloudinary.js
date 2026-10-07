const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryReady = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export const cloudinaryCloudName = CLOUD_NAME || null;

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export async function uploadImage(file) {
  if (!cloudinaryReady) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and " +
        "VITE_CLOUDINARY_UPLOAD_PRESET in client/.env, then restart the dev server."
    );
  }

  if (!ALLOWED.includes(file.type)) {
    throw new Error("Use a JPEG, PNG, WebP, AVIF or GIF image.");
  }

  if (file.size > MAX_BYTES) {
    throw new Error("Images must be 5 MB or smaller.");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: "POST",
    body,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.secure_url;
}