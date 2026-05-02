"use server";

import { redirect } from "next/navigation";

import { loginSchema, registerSchema } from "@/lib/validations/auth.schema";
import { SupabaseConfigError } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

type WorkingHours = Record<
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday",
  { from: string; to: string } | null
>;

type AuthErrorCategory =
  | "invalid_api_key"
  | "invalid_project_url"
  | "signup_disabled"
  | "weak_password"
  | "email_exists"
  | "invalid_email"
  | "network_error"
  | "rate_limit"
  | "unknown";

type SafeAuthError = {
  name?: string;
  status?: number;
  code?: string;
  category: AuthErrorCategory;
};

const defaultWorkingHours: WorkingHours = {
  monday: { from: "10:00", to: "20:00" },
  tuesday: { from: "10:00", to: "20:00" },
  wednesday: { from: "10:00", to: "20:00" },
  thursday: { from: "10:00", to: "20:00" },
  friday: { from: "10:00", to: "20:00" },
  saturday: { from: "10:00", to: "18:00" },
  sunday: null,
};

function getField(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function getErrorProperty(error: unknown, property: "name" | "status" | "code" | "message") {
  if (!error || typeof error !== "object" || !(property in error)) {
    return undefined;
  }

  const value = (error as Record<string, unknown>)[property];

  if (property === "status") {
    return typeof value === "number" ? value : undefined;
  }

  return typeof value === "string" ? value : undefined;
}

function getStringErrorProperty(error: unknown, property: "name" | "code" | "message") {
  const value = getErrorProperty(error, property);
  return typeof value === "string" ? value : undefined;
}

function getNumberErrorProperty(error: unknown, property: "status") {
  const value = getErrorProperty(error, property);
  return typeof value === "number" ? value : undefined;
}

function categorizeAuthError(error: unknown): AuthErrorCategory {
  if (error instanceof SupabaseConfigError) {
    return error.category;
  }

  const status = getNumberErrorProperty(error, "status");
  const code = getStringErrorProperty(error, "code")?.toLowerCase() ?? "";
  const name = getStringErrorProperty(error, "name")?.toLowerCase() ?? "";
  const message = getStringErrorProperty(error, "message")?.toLowerCase() ?? "";
  const combined = `${name} ${code} ${message}`;

  if (status === 401 || combined.includes("invalid api key") || combined.includes("jwt")) {
    return "invalid_api_key";
  }

  if (combined.includes("signups not allowed") || combined.includes("signup disabled")) {
    return "signup_disabled";
  }

  if (combined.includes("weak password") || combined.includes("password")) {
    return "weak_password";
  }

  if (
    combined.includes("already registered") ||
    combined.includes("already exists") ||
    combined.includes("user_already_exists")
  ) {
    return "email_exists";
  }

  if (combined.includes("invalid email") || combined.includes("email_address_invalid")) {
    return "invalid_email";
  }

  if (status === 429 || combined.includes("rate limit") || combined.includes("too many")) {
    return "rate_limit";
  }

  if (
    name.includes("fetch") ||
    combined.includes("network") ||
    combined.includes("failed to fetch")
  ) {
    return "network_error";
  }

  return "unknown";
}

function sanitizeAuthError(error: unknown): SafeAuthError {
  return {
    name: getStringErrorProperty(error, "name"),
    status: getNumberErrorProperty(error, "status"),
    code: getStringErrorProperty(error, "code"),
    category: categorizeAuthError(error),
  };
}

function logAuthError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(scope, sanitizeAuthError(error));
  }
}

function getRegisterReason(category: AuthErrorCategory) {
  return category === "network_error" ? "network" : category;
}

function authRedirect(path: "/login" | "/register", error: string, reason?: string): never {
  const params = new URLSearchParams({ error });

  if (reason) {
    params.set("reason", reason);
  }

  redirect(`${path}?${params.toString()}`);
}

async function ensureOwnerOnboarding(
  supabase: Awaited<ReturnType<typeof createClient>>,
  ownerId: string,
  fullName: string,
  salonName: string,
) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || userData.user?.id !== ownerId) {
    return false;
  }

  const safeFullName = fullName.trim() || "Owner";
  const safeSalonName = salonName.trim() || "BeautyBook Studio";

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: ownerId,
      full_name: safeFullName,
      role: "owner",
    },
    { onConflict: "id" },
  );

  if (profileError) {
    return false;
  }

  const { data: existingSalon, error: salonSelectError } = await supabase
    .from("salons")
    .select("id")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (salonSelectError) {
    return false;
  }

  if (existingSalon) {
    return true;
  }

  const { error: salonError } = await supabase.from("salons").insert({
    owner_id: ownerId,
    name: safeSalonName,
    working_hours: defaultWorkingHours,
  });

  return !salonError;
}

// Deprecated: public registration is disabled. Keep this setup-only action out
// of routed UI to avoid open signup and Supabase Auth rate limits.
export async function registerOwnerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    fullName: getField(formData, "fullName"),
    email: getField(formData, "email"),
    password: getField(formData, "password"),
    salonName: getField(formData, "salonName"),
  });

  if (!parsed.success) {
    authRedirect("/register", "validation");
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;

  try {
    supabase = await createClient();
  } catch (error) {
    const sanitizedError = sanitizeAuthError(error);
    logAuthError("[auth:config]", error);
    authRedirect("/register", "create", getRegisterReason(sanitizedError.category));
  }

  const { fullName, email, password, salonName } = parsed.data;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        salon_name: salonName,
        role: "owner",
      },
    },
  });

  const userId = signUpData.user?.id;

  if (signUpError || !userId) {
    const signUpIssue = signUpError ?? new Error("Auth user was not returned.");
    const sanitizedError = sanitizeAuthError(signUpIssue);
    logAuthError("[auth:signUp]", signUpIssue);
    authRedirect("/register", "create", getRegisterReason(sanitizedError.category));
  }

  if (!signUpData.session) {
    redirect("/login?status=registered");
  }

  const onboardingReady = await ensureOwnerOnboarding(
    supabase,
    userId,
    fullName,
    salonName,
  );

  if (!onboardingReady) {
    redirect("/login?status=registered");
  }

  redirect("/admin");
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: getField(formData, "email"),
    password: getField(formData, "password"),
  });

  if (!parsed.success) {
    authRedirect("/login", "validation");
  }

  let supabase: Awaited<ReturnType<typeof createClient>>;

  try {
    supabase = await createClient();
  } catch {
    authRedirect("/login", "env");
  }

  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    if (error) {
      logAuthError("[auth:signIn]", error);
    }

    authRedirect("/login", "credentials");
  }

  redirect("/admin");
}

export async function logoutAction() {
  let supabase: Awaited<ReturnType<typeof createClient>>;

  try {
    supabase = await createClient();
  } catch {
    redirect("/login?error=env");
  }

  await supabase.auth.signOut();
  redirect("/login");
}
