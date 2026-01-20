"use client";
import { useState } from "react";
import Link from "next/link";
import { getErrorMessage } from "@/lib/api";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FormInput } from "@/components/FormInput";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { initialFormState, RegisterFormState } from "./consts";
import { EyeIcon } from "@/components/EyeIcon";
export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const { signup } = useAuth();

  const [form, setForm] = useState<RegisterFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const passwordsMatch = form.password === form.passwordConfirmation;
  const canSubmit =
    form.password && form.passwordConfirmation && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!passwordsMatch) {
      setError(t("passwordsDontMatch"));
      setLoading(false);
      return;
    }

    try {
      const { passwordConfirmation, ...rest } = form;
      await signup(rest);
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            {t("title")}
          </h2>
        </div>

        <ErrorBanner error={error} onClear={() => setError("")} />

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label={t("name")}
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <FormInput
            label={t("surname")}
            id="surname"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <FormInput
            label={t("username")}
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <FormInput
            label={t("email")}
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <div className="relative">
            <FormInput
              label={t("password")}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="!pr-10"
            />
            <EyeIcon
              show={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="relative">
            <FormInput
              label={t("passwordConfirmation")}
              id="passwordConfirmation"
              name="passwordConfirmation"
              type={showConfirmPassword ? "text" : "password"}
              value={form.passwordConfirmation || ""}
              onChange={handleChange}
              required
              disabled={loading}
              className="!pr-10"
            />
            <EyeIcon
              show={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {form.passwordConfirmation && (
            <div
              className={`text-sm ${
                passwordsMatch ? "text-green-600" : "text-red-600"
              }`}
            >
              {passwordsMatch ? t("matchPasswords") : t("notMatchPasswords")}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{t("submitting")}</span>
                </>
              ) : (
                t("submit")
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              {t("loginLink")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
