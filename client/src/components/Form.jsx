export const inputClassName =
  "w-full rounded-[9px] border border-line-strong bg-surface px-[13px] py-[11px] text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-faint focus:border-accent focus:shadow-[0_0_0_3px_rgba(19,40,199,0.14)] disabled:bg-paper";

export function Field({ label, error, hint, children }) {
  return (
    <label className="grid gap-[7px]">
      <span className="text-[13px] font-semibold tracking-[-0.01em] text-ink">{label}</span>
      {children}
      {error ? (
        <span className="text-[12.5px] leading-[1.4] text-danger" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="text-[12.5px] leading-[1.4] text-ink-faint">{hint}</span>
      ) : null}
    </label>
  );
}

export function Alert({ kind = "error", children }) {
  if (!children) return null;
  const tone =
    kind === "error"
      ? "border-[#f6d5d3] bg-danger-soft text-danger"
      : "border-[#cbe9da] bg-[#eaf7f0] text-ok";
  return (
    <div
      className={`rounded-[9px] border px-[13px] py-[11px] text-[13.5px] leading-[1.5] ${tone}`}
      role={kind === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
