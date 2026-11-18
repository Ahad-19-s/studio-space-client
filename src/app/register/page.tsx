"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Check, Eye, EyeOff, UserPlus, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/loaders";
import AuthShell from "@/components/auth/auth-shell";
import GoogleButton from "@/components/auth/google-button";
import { cn } from "cn";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState(false);

  // Assignment password rules: >=6 chars, >=1 uppercase, >=1 lowercase.
  const rules = useMemo(
    () => [
      { label: "At least 6 characters", passed: password.length >= 6 },
      {
        label: "One uppercase letter",
        passed: /[A-Z]/.test(password),
      },
      {
        label: "One lowercase letter",
        passed: /[a-z]/.test(password),
      },
    ],
    [password]
  );
  const passwordValid = rules.every((rule) => rule.passed);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched(true);

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in your name, email and password.");
      return;
    }
    if (!passwordValid) {
      toast.error("Your password doesn't meet the requirements yet.");
      return;
    }
    if (photoURL.trim() && !/^https?:\/\//i.test(photoURL.trim())) {
      toast.error("Photo URL must start with http:// or https://");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
        setSubmitting(false);
        return;
      }

      toast.success("Account created! You can sign in now.");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Rivera"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo URL</Label>
        <Input
          id="photo"
          type="url"
          placeholder="https://…/avatar.jpg"
          value={photoURL}
          onChange={(event) => setPhotoURL(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Optional — used for your avatar. Leave blank for an auto-generated one.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="pr-10"
            aria-invalid={touched && !passwordValid}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {/* Live password rules — errors shown in the form, never alert() */}
        <ul className="grid grid-cols-1 gap-1.5 pt-1 sm:grid-cols-3">
          {rules.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-1.5 text-xs transition-colors",
                rule.passed
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground"
              )}
            >
              {rule.passed ? (
                <Check className="size-3.5 shrink-0" />
              ) : (
                <X className="size-3.5 shrink-0" />
              )}
              {rule.label}
            </li>
          ))}
        </ul>
        {touched && !passwordValid && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400">
            Password must meet all three requirements above.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-bold tracking-wide text-primary-foreground uppercase transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <UserPlus className="size-4" />
        )}
        {submitting ? "Creating account…" : "Register"}
      </button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs tracking-wide text-muted-foreground uppercase">
          or continue with
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleButton label="Sign up with Google" />
    </form>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Start booking"
      title="Register"
      subtitle="Create your free account to book studios, list your own space and track every reservation."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:underline"
          >
            Login instead
          </Link>
        </>
      }
    >
      <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-muted" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
