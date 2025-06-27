// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Protected routes that require authentication
  const clientRoutes = ["/client/dashboard"];
  const expertRoutes = ["/expert/dashboard"];
  const protectedRoutes = [...clientRoutes, ...expertRoutes];

  // Auth routes that authenticated users shouldn't access
  const authRoutes = ["/auth"];

  const isClientRoute = clientRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isExpertRoute = expertRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Skip auth check for non-protected and non-auth routes
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  let response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          response.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          response.cookies.delete(name);
        },
      },
    }
  );

  // Use getUser() instead of getSession() for security
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If accessing protected route without valid user, redirect to sign-in
  if (isProtectedRoute && (!user || error)) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  // If accessing auth route with valid user, redirect based on user type
  if (isAuthRoute && user && !error) {
    const userType = user.user_metadata?.user_type;

    if (userType === "expert") {
      return NextResponse.redirect(new URL("/expert/dashboard/home", req.url));
    } else {
      return NextResponse.redirect(new URL("/client/dashboard/home", req.url));
    }
  }

  // Role-based access control for protected routes
  if (user && !error && isProtectedRoute) {
    const userType = user.user_metadata?.user_type;

    // Client trying to access expert routes
    if (isExpertRoute && userType !== "expert") {
      return NextResponse.redirect(new URL("/client/dashboard/home", req.url));
    }

    // Expert trying to access client routes
    if (isClientRoute && userType === "expert") {
      return NextResponse.redirect(new URL("/expert/dashboard/home", req.url));
    }

    // If user_type is not set, assume client and only allow client routes
    if (!userType && isExpertRoute) {
      return NextResponse.redirect(new URL("/client/dashboard/home", req.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
