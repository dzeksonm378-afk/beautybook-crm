export type SupabaseConfigErrorCategory = "invalid_api_key" | "invalid_project_url";

export class SupabaseConfigError extends Error {
  category: SupabaseConfigErrorCategory;

  constructor(category: SupabaseConfigErrorCategory) {
    super("Invalid Supabase configuration.");
    this.name = "SupabaseConfigError";
    this.category = category;
  }
}

function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isValidProjectUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}

function isValidPublicKey(value: string) {
  return value.trim() === value && value.length >= 20;
}

export function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = getSupabaseKey();

  if (!supabaseUrl || !isValidProjectUrl(supabaseUrl)) {
    throw new SupabaseConfigError("invalid_project_url");
  }

  if (!supabaseKey || !isValidPublicKey(supabaseKey)) {
    throw new SupabaseConfigError("invalid_api_key");
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}
