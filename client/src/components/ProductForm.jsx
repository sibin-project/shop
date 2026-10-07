import { useState } from "react";
import { api } from "../api";
import { uploadImage, cloudinaryReady } from "../cloudinary";
import { Field, Alert, inputClassName } from "./Form";

const EMPTY = { title: "", image: "", price: "", description: "" };

function toForm(product) {
  if (!product) return EMPTY;
  return {
    title: product.title ?? "",
    image: product.image ?? "",
    price: product.price === null || product.price === undefined ? "" : String(product.price),
    description: product.description ?? "",
  };
}

export default function ProductForm({ editing, onDone }) {
  const [form, setForm] = useState(() => toForm(editing));
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [key]: "" }));
  };

  function reset() {
    setForm(EMPTY);
    setFieldErrors({});
    setError("");
  }

  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      setFieldErrors((f) => ({ ...f, image: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (editing) {
        await api.products.update(editing._id, form);
      } else {
        await api.products.create(form);
      }
      reset();
      onDone();
    } catch (err) {
      if (err.issues) {
        setFieldErrors(Object.fromEntries(err.issues.map((i) => [i.path, i.message])));
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  function onCancel() {
    reset();
    onDone();
  }

  return (
    <form
      className="grid gap-4 rounded-xl border border-line bg-surface p-[clamp(20px,3vw,28px)]"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold tracking-[-0.03em]">
          {editing ? "Edit product" : "New product"}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer text-sm font-medium text-ink-soft hover:underline"
          >
            Cancel edit
          </button>
        )}
      </div>

      <Alert>{error}</Alert>

      <Field label="Title" error={fieldErrors.title}>
        <input
          className={inputClassName}
          type="text"
          name="title"
          placeholder="Leather messenger bag"
          value={form.title}
          onChange={update("title")}
          required
        />
      </Field>

      <Field
        label="Image"
        error={fieldErrors.image}
        hint={
          cloudinaryReady
            ? "Upload a photo, or paste a link. JPEG/PNG/WebP, up to 5 MB."
            : "Paste an image URL. (Set VITE_CLOUDINARY_UPLOAD_PRESET in client/.env to enable uploads.)"
        }
      >
        {form.image && (
          <div className="relative overflow-hidden rounded-[9px] border border-line bg-paper">
            <img
              src={form.image}
              alt="Product preview"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="aspect-[16/9] w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, image: "" }))}
              className="absolute top-2 right-2 cursor-pointer rounded-md border border-line bg-surface/90 px-2 py-1 text-xs font-semibold text-danger backdrop-blur-sm hover:bg-danger-soft"
            >
              Remove
            </button>
          </div>
        )}

        <label
          className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-dashed border-line-strong px-[18px] py-[10px] text-sm font-semibold text-ink transition-colors duration-150 hover:bg-paper ${
            uploading ? "pointer-events-none opacity-60" : ""
          }`}
        >
          {uploading ? (
            <span className="size-[14px] animate-spin rounded-full border-2 border-line-strong border-t-accent" />
          ) : null}
          {uploading
            ? "Uploading…"
            : form.image
              ? "Replace image"
              : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onPickImage}
            disabled={uploading}
          />
        </label>

        <input
          className={inputClassName}
          type="url"
          name="image"
          placeholder="https://example.com/bag.jpg"
          value={form.image}
          onChange={update("image")}
        />
      </Field>

      <Field label="Price" error={fieldErrors.price} hint="In rupees, e.g. 1299.00">
        <input
          className={inputClassName}
          type="number"
          name="price"
          step="0.01"
          min="0"
          placeholder="1299.00"
          value={form.price}
          onChange={update("price")}
          required
        />
      </Field>

      <Field label="Description" error={fieldErrors.description}>
        <textarea
          className={`${inputClassName} min-h-[96px] resize-y`}
          name="description"
          placeholder="Full-grain leather, brass hardware, fits a 13&quot; laptop."
          value={form.description}
          onChange={update("description")}
          required
        />
      </Field>

      <button
        className="mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-[9px] rounded-[9px] border border-transparent bg-accent px-[18px] py-3 text-[15px] font-semibold text-white transition-[background,border-color,transform] duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 hover:enabled:bg-accent-hover"
        type="submit"
        disabled={busy}
      >
        {busy ? (
          <span className="size-[15px] animate-spin rounded-full border-2 border-white/40 border-t-white" />
        ) : null}
        {busy
          ? editing
            ? "Saving…"
            : "Creating…"
          : editing
            ? "Save changes"
            : "Add product"}
      </button>
    </form>
  );
}