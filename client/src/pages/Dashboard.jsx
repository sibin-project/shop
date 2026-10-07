import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState("…");
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loadError, setLoadError] = useState("");

  function loadProducts() {
    api.products
      .list()
      .then((d) => {
        setProducts(d.products);
        setLoadError("");
      })
      .catch((err) => setLoadError(err.message));
  }

  useEffect(() => {
    api.health().then((d) => setHealth(d.status)).catch(() => setHealth("offline"));
    loadProducts();
  }, []);

  function onSaved() {
    setEditing(null);
    loadProducts();
  }

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 flex items-center justify-between border-b border-line bg-surface px-[clamp(20px,5vw,56px)] py-[18px]">
        <div className="inline-flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.02em] text-ink">
          <span className="size-[11px] rounded-[3px] bg-[linear-gradient(135deg,#4d6bff,#31bacd)] shadow-[0_0_0_3px_rgba(77,107,255,0.18)]" />
          shopnow
        </div>
        <button
          className="inline-flex cursor-pointer items-center justify-center gap-[9px] rounded-lg border border-line-strong bg-transparent px-[15px] py-[9px] text-sm font-semibold text-ink transition-[background,border-color,transform] duration-150 hover:bg-paper active:translate-y-px"
          onClick={onLogout}
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto max-w-[960px] px-[clamp(20px,5vw,56px)] py-[clamp(48px,8vw,96px)]">
        <p className="mb-[14px] text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Catalog
        </p>
        <h1 className="mb-[14px] text-[clamp(30px,4.4vw,46px)] font-bold leading-[1.06] tracking-[-0.035em]">
          Products
        </h1>
        <p className="max-w-[62ch] text-base leading-[1.65] text-ink-soft">
          Signed in as <strong className="text-ink">{user.name}</strong>. Products
          are stored in Atlas and are private to your account.
        </p>

        <dl className="mt-[clamp(32px,5vw,48px)] grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-px overflow-hidden rounded-xl border border-line bg-line">
          {[
            ["Products", products.length],
            ["Email", user.email],
            ["API health", health],
          ].map(([k, v]) => (
            <div className="bg-surface px-[22px] py-5" key={k}>
              <dt className="mb-2 text-xs uppercase tracking-[0.09em] text-ink-faint">{k}</dt>
              <dd className="text-[15.5px] font-medium break-words">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[clamp(32px,5vw,48px)]">
          <ProductForm
            key={editing?._id ?? "new"}
            editing={editing}
            onDone={onSaved}
          />
        </div>

        <div className="mt-8">
          {loadError ? (
            <p className="rounded-[9px] border border-[#f6d5d3] bg-danger-soft px-[13px] py-[11px] text-[13.5px] text-danger">
              {loadError}
            </p>
          ) : (
            <ProductList
              products={products}
              editingId={editing?._id ?? null}
              onEdit={setEditing}
              onChanged={loadProducts}
            />
          )}
        </div>
      </main>
    </div>
  );
}
