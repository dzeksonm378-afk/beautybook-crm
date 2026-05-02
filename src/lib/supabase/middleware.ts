import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSupabaseConfig } from "@/lib/supabase/config";

export async function updateSession(request: NextRequest) {
  let supabaseConfig: ReturnType<typeof getSupabaseConfig>;

  try {
    supabaseConfig = getSupabaseConfig();
  } catch {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      },
    },
  });

  // TODO(auth): add dashboard route protection after real auth UI is connected.
  await supabase.auth.getUser();

  return response;
}
