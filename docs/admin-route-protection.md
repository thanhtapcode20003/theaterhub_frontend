# Admin Route Protection

This document explains how admin route protection is implemented in the TheaterHub frontend.

## Overview

Only users with `admin` or `staff` roles can access `/admin` routes and all sub-routes within the admin section.

## Implementation

### 1. AdminRouteGuard Component

Location: `components/auth/AdminRouteGuard.tsx`

This component:

- Checks if user is authenticated
- Verifies user has `admin` or `staff` role
- Redirects unauthorized users appropriately
- Shows elegant loading UI using `PageLoading` component during checks

### 2. Admin Layout Protection

Location: `app/admin/layout.tsx`

The admin layout wraps all admin routes with `AdminRouteGuard`, ensuring protection for:

- `/admin` (dashboard)
- `/admin/users`
- `/admin/events`
- Any future admin sub-routes

### 3. Redirect Logic

- **Not authenticated**: Redirects to `/sign-in`
- **Authenticated but not admin/staff**: Redirects to home page (`/`)
- **Admin or staff**: Allows access to admin routes

## Usage

The protection is automatic for all admin routes. No additional setup needed for new admin pages.

## User Roles

- `admin`: Full admin access
- `staff`: Staff-level admin access
- `customer`: Regular user (no admin access)

## Testing

To test the protection:

1. Try accessing `/admin` without being logged in
2. Login as a customer role and try accessing `/admin`
3. Login as admin/staff and verify access is granted
