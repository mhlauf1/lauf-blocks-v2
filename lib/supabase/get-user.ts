import { createClient } from "./server";
import type { Database } from "./types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];

export interface AuthUser {
  id: string;
  email: string;
  profile: Profile | null;
  subscription: Subscription | null;
}

/**
 * Get the current authenticated user with their profile and subscription.
 * Returns null if not authenticated.
 */
export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return null;
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? "",
    profile,
    subscription,
  };
}

/**
 * Get the current authenticated user. Throws if not authenticated.
 * Use this in protected routes where you're confident the user is logged in.
 */
export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  return user;
}

/**
 * Check if the current user has a Pro subscription.
 */
export async function isProUser(): Promise<boolean> {
  const user = await getUser();
  return user?.subscription?.tier === "pro" && user?.subscription?.status === "active";
}
