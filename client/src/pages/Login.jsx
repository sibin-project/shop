import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { Field, Alert, inputClassName } from "../components/Form";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((f) => ({ ...f, [key]: "" }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate(location.state?.from || "/", { replace: true });
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

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Enter your details to continue."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={onSubmit} noValidate>
        <Alert>{error}</Alert>

        <Field label="Email" error={fieldErrors.email}>
          <input
            className={inputClassName}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update("email")}
            required
          />
        </Field>

        <Field label="Password" error={fieldErrors.password}>
          <input
            className={inputClassName}
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update("password")}
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
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}
