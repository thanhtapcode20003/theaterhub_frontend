"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/ui/loading";
import ROUTES from "@/constants/routes";

interface RoleRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "staff" | "customer")[];
  redirectTo?: string;
}

export default function RoleRouteGuard({
  children,
  allowedRoles,
  redirectTo = ROUTES.HOME,
}: RoleRouteGuardProps) {
  const { isAuthenticated, getUserRole, loading } = useAuth();
  const router = useRouter();
  const userRole = getUserRole();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated, redirect to sign in
    if (!isAuthenticated) {
      router.push(ROUTES.HOME);
      return;
    }

    // If user role is not in allowed roles, redirect
    if (!userRole || !allowedRoles.includes(userRole)) {
      router.push(redirectTo);
      return;
    }
  }, [isAuthenticated, userRole, loading, router, allowedRoles, redirectTo]);

  // Show loading while checking auth
  if (loading) {
    return (
      <Loading
        fullScreen
        size="lg"
        variant="primary"
        text="Checking permissions..."
      />
    );
  }

  // Show loading if not authenticated or not authorized
  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    return (
      <Loading fullScreen size="lg" variant="primary" text="Redirecting..." />
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
