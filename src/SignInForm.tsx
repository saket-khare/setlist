"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Invalid password. Please try again.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Could not sign in, did you mean to sign up?"
                  : "Could not sign up, did you mean to sign in?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button
          className="btn-primary w-full"
          type="submit"
          disabled={submitting}
        >
          {submitting ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>
                {flow === "signIn" ? "Signing in..." : "Signing up..."}
              </span>
            </div>
          ) : flow === "signIn" ? (
            "Sign In"
          ) : (
            "Sign Up"
          )}
        </button>

        <div className="text-center text-sm text-neutral-600 dark:text-dark-500">
          <span>
            {flow === "signIn"
              ? "Don't have an account? "
              : "Already have an account? "}
          </span>
          <button
            type="button"
            className="text-primary-600 hover:text-primary-700 hover:underline font-medium cursor-pointer transition-colors"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center my-6">
        <hr className="flex-1 border-neutral-200 dark:border-dark-200" />
        <span className="mx-4 text-neutral-500 dark:text-dark-400 text-sm">
          or
        </span>
        <hr className="flex-1 border-neutral-200 dark:border-dark-200" />
      </div>

      <button
        className="btn-secondary w-full"
        onClick={() => void signIn("anonymous")}
      >
        Continue as Guest
      </button>
    </div>
  );
}
