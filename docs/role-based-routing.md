# Role-Based Dynamic Routing System

This document explains the role-based dynamic routing system in TheaterHub frontend.

## Overview

- **Admin**: Full access to `/admin` routes
- **Staff**: Limited access to `/staff` routes
- **Customer**: Public and customer-specific routes only

The system uses Next.js 14 app router with a unified `[role]` dynamic route structure for better maintainability.

## Route Structure

### Dynamic Routes (`app/[role]/`)

All role-based routes use the dynamic `[role]` parameter:

- `/admin` - Admin dashboard
- `/admin/events` - Admin events management
- `/admin/users` - User management (admin only)
- `/staff` - Staff dashboard
- `/staff/events` - Staff assigned events
- `/staff/users` - Returns 404 (staff cannot access)

## Implementation

### 1. RoleRouteGuard Component

**Location**: `components/auth/RoleRouteGuard.tsx`

This flexible component:

- Accepts `allowedRoles` prop to specify which roles can access the route
- Checks user authentication and role permissions
- Redirects unauthorized users appropriately
- Shows loading UI during permission checks

```tsx
interface RoleRouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ("admin" | "staff" | "customer")[];
  redirectTo?: string;
}
```

### 2. Dynamic Layout Protection

**Location**: `app/[role]/layout.tsx`

The layout component:

- Validates the role parameter (admin/staff only)
- Sets appropriate `allowedRoles` for `RoleRouteGuard`
- Admin routes: `allowedRoles={["admin"]}`
- Staff routes: `allowedRoles={["staff"]}`

### 3. Route Generation

The system automatically generates routes for:

- `{ role: "admin" }`
- `{ role: "staff" }`

Using `generateStaticParams()` for optimal performance.

## Components and Utilities

### Dynamic Sidebar Links

**Location**: `constants/index.ts`

```tsx
export const getSidebarLinks = (userRole?: string) => {
  switch (userRole) {
    case "admin":
      return [
        { title: "Dashboard", url: "/admin", icon: ChartSpline },
        { title: "Users", url: "/admin/users", icon: Users },
        { title: "Events", url: "/admin/events", icon: Calendar },
      ];
    case "staff":
      return [
        { title: "Dashboard", url: "/staff", icon: ChartSpline },
        { title: "My Events", url: "/staff/events", icon: Calendar },
      ];
    default:
      return [];
  }
};
```

### Navbar Integration

**Location**: `components/navigation/navbar/index.tsx`

Dynamic dropdown menu that shows:

- "Admin Panel" for admin users → links to `/admin`
- "Staff Panel" for staff users → links to `/staff`

### Dashboard Route Helper

**Location**: `lib/utils.ts`

```tsx
export function getDashboardRoute(userRole?: string | null): string {
  switch (userRole) {
    case "admin":
    case "staff":
      return `/${userRole}`;
    default:
      return "/";
  }
}
```

## Permission Matrix

| Route           | Admin | Staff | Customer |
| --------------- | ----- | ----- | -------- |
| `/admin`        | ✅    | ❌    | ❌       |
| `/admin/users`  | ✅    | ❌    | ❌       |
| `/admin/events` | ✅    | ❌    | ❌       |
| `/staff`        | ❌    | ✅    | ❌       |
| `/staff/events` | ❌    | ✅    | ❌       |
| `/` (public)    | ✅    | ✅    | ✅       |

## Redirect Logic

- **Not authenticated**: → `/sign-in`
- **Authenticated but wrong role**: → `/` (home)
- **Correct role**: Allow access

## Architecture Benefits

### Before vs After

**Before**: `app/admin/` + `app/staff/` (separate folders)
**After**: `app/[role]/` (unified dynamic routing)

### Advantages

1. **Maintainability**: Single codebase for similar role-based features
2. **Scalability**: Easy to add new roles (manager, moderator, etc.)
3. **Code Reuse**: Shared components and layouts
4. **Type Safety**: Consistent role validation
5. **Performance**: Static generation for known roles

### File Structure

```
app/
  [role]/
    layout.tsx          # Role-based layout with RoleRouteGuard
    page.tsx           # Dynamic dashboard
    events/
      page.tsx         # Role-specific events management
    users/
      page.tsx         # Admin-only user management
```

## Usage Examples

### Creating Protected Routes

```tsx
// Automatic protection based on [role] parameter
export default function RoleLayout({ children, params }: RoleLayoutProps) {
  const { role } = params;
  const allowedRoles = role === "admin" ? ["admin"] : ["staff"];

  return (
    <RoleRouteGuard allowedRoles={allowedRoles}>{children}</RoleRouteGuard>
  );
}
```

### Adding New Roles

1. Update `RoleRouteGuard` types
2. Add role to `generateStaticParams()`
3. Update `getSidebarLinks()` function
4. Create role-specific pages as needed

## Testing

1. **Admin Access**: Login as admin → visit `/admin` → should access
2. **Staff Access**: Login as staff → visit `/staff` → should access
3. **Cross-Role**: Login as staff → visit `/admin` → should redirect to home
4. **Unauthenticated**: Visit `/admin` or `/staff` → should redirect to `/sign-in`
