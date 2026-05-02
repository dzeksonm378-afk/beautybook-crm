"use client";

import { useFormStatus } from "react-dom";

type ClientSubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

export function ClientSubmitButton({
  idleText,
  pendingText,
}: ClientSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      className="h-12 w-full rounded-full bg-graphite px-5 text-sm font-bold text-porcelain transition hover:bg-plum disabled:cursor-not-allowed disabled:bg-graphite/45 sm:w-auto"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingText : idleText}
    </button>
  );
}
