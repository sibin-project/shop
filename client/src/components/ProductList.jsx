import { api } from "../api";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export default function ProductList({ products, editingId, onEdit, onChanged }) {
  async function onDelete(product) {
    const ok = window.confirm(
      `Delete "${product.title}"? This cannot be undone.`
    );
    if (!ok) return;

    try {
      await api.products.remove(product._id);
      onChanged();
    } catch {
      window.alert("Could not delete that product. Try again.");
    }
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
        <p className="mb-2 text-[15px] font-semibold">No products yet</p>
        <p className="m-0 text-sm text-ink-soft">
          Use the form to add your first product.
        </p>
      </div>
    );
  }

  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 p-0">
      {products.map((p) => (
        <li
          key={p._id}
          className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface"
        >
          <div className="grid aspect-[4/3] place-items-center bg-paper">
            {p.image ? (
              <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-xs uppercase tracking-[0.09em] text-ink-faint">
                No image
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="m-0 text-[15px] font-semibold leading-snug">
                {p.title}
              </h3>
              <span className="shrink-0 text-[15px] font-bold text-accent">
                {currency.format(p.price)}
              </span>
            </div>

            <p className="m-0 line-clamp-3 text-[13.5px] leading-[1.55] text-ink-soft">
              {p.description}
            </p>

            <div className="mt-auto flex gap-2 pt-2">
              <button
                onClick={() => onEdit(p)}
                className="flex-1 cursor-pointer rounded-lg border border-line-strong bg-transparent px-3 py-2 text-[13px] font-semibold text-ink transition-colors duration-150 hover:bg-paper"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(p)}
                className="flex-1 cursor-pointer rounded-lg border border-[#f6d5d3] bg-transparent px-3 py-2 text-[13px] font-semibold text-danger transition-colors duration-150 hover:bg-danger-soft"
              >
                Delete
              </button>
            </div>

            {editingId === p._id && (
              <p className="m-0 text-center text-xs text-accent">
                Editing this product…
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}