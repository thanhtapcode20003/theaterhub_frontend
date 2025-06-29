"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/ui/loading";
import ROUTES from "@/constants/routes";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { isAuthenticated, isAdmin, isStaff, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If not authenticated, redirect to sign in
    if (!isAuthenticated) {
      router.push(ROUTES.HOME);
      return;
    }

    // If authenticated but not admin or staff, redirect to home
    if (!isAdmin() && !isStaff()) {
      router.push(ROUTES.HOME);
      return;
    }
  }, [isAuthenticated, isAdmin, isStaff, loading, router]);

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
  if (!isAuthenticated || (!isAdmin() && !isStaff())) {
    return (
      <Loading fullScreen size="lg" variant="primary" text="Redirecting..." />
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
}
