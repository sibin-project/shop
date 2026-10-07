export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-svh grid-cols-2 max-[900px]:grid-cols-1">
      <aside className="flex bg-brand bg-[radial-gradient(900px_520px_at_12%_8%,rgba(77,107,255,0.28),transparent_62%),radial-gradient(700px_480px_at_92%_92%,rgba(49,186,205,0.18),transparent_60%)] p-[clamp(32px,5vw,64px)] text-white max-[900px]:px-6 max-[900px]:py-[30px]">
        <div className="my-auto w-full max-w-[520px]">
          <div className="inline-flex items-center gap-2.5 text-[17px] font-bold tracking-[-0.02em] text-white">
            <span className="size-[11px] rounded-[3px] bg-[linear-gradient(135deg,#4d6bff,#31bacd)] shadow-[0_0_0_3px_rgba(77,107,255,0.18)]" />
            shopnow
          </div>

          <div>
            <p className="mb-[18px] text-xs uppercase tracking-[0.16em] text-[#7f8cb3]">
              Accounts &amp; identity
            </p>
            <h1 className="mb-5 text-[clamp(34px,4.2vw,54px)] font-bold leading-[1.04] tracking-[-0.035em] max-[900px]:mb-3 max-[900px]:text-[clamp(28px,7vw,36px)]">
              One sign-in for
              <br />
              everything you ship.
            </h1>
          </div>
        </div>
      </aside>

      <main className="flex flex-col items-center justify-center gap-[22px] px-[clamp(20px,5vw,56px)] py-[clamp(28px,5vw,56px)] max-[900px]:pt-8 max-[900px]:pb-10">
        <div className="w-full max-w-[404px] rounded-xl border border-line bg-surface p-[clamp(26px,3vw,36px)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-18px_rgba(16,24,40,0.24)]">
          <header className="mb-6">
            <h2 className="mb-1.5 text-[25px] font-bold tracking-[-0.03em]">{title}</h2>
            <p className="text-[14.5px] leading-[1.5] text-ink-soft">{subtitle}</p>
          </header>
          {children}
        </div>
        {footer && <div className="text-[14.5px] text-ink-soft">{footer}</div>}
      </main>
    </div>
  );
}
