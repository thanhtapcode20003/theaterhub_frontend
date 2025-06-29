const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",

  // Dynamic role-based routes using [role] parameter
  ROLE_DASHBOARD: (role: string) => `/${role}`,
  ROLE_EVENTS: (role: string) => `/${role}/events`,
  ROLE_USERS: (role: string) => `/${role}/users`, // admin only
};

export default ROUTES;
