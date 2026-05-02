"use client";

import { useFormStatus } from "react-dom";

type AppointmentSubmitButtonProps = {
  idleText: string;
  pendingText: string;
  variant?: "primary" | "secondary";
};

export function AppointmentSubmitButton({
  idleText,
  pendingText,
  variant = "primary",
}: AppointmentSubmitButtonProps) {
  const { pending } = useFormStatus();
  const className =
    variant === "secondary"
      ? "h-10 w-full rounded-full border border-taupe/35 px-4 text-xs font-bold uppercase tracking-[0.14em] text-plum transition hover:border-champagne hover:text-graphite disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      : "h-12 w-full rounded-full bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum disabled:cursor-not-allowed disabled:bg-graphite/45 sm:w-auto";

  return (
    <button className={className} disabled={pending} type="submit">
      {pending ? pendingText : idleText}
    </button>
  );
}
