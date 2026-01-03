import { redirect } from "next/navigation";
import { getUser, type AuthUser } from "@/lib/supabase/get-user";

interface RequireAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Server component that ensures the user is authenticated.
 * Redirects to /login if not authenticated.
 *
 * Note: The middleware already handles redirects, so this is mainly for:
 * 1. Additional safety
 * 2. Accessing user data in layouts
 * 3. Providing a loading fallback
 */
export async function RequireAuth({ children, fallback }: RequireAuthProps) {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}

/**
 * Server component that checks if user is authenticated.
 * Renders children only if authenticated, otherwise renders fallback.
 */
export async function AuthGuard({
  children,
  fallback = null,
}: RequireAuthProps) {
  const user = await getUser();

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Server component that passes user data to children via render props.
 */
interface WithUserProps {
  children: (user: AuthUser) => React.ReactNode;
  fallback?: React.ReactNode;
}

export async function WithUser({ children, fallback = null }: WithUserProps) {
  const user = await getUser();

  if (!user) {
    return <>{fallback}</>;
  }

  return <>{children(user)}</>;
}
