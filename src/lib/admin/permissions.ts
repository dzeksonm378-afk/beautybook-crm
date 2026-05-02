export type StaffRole = "owner" | "admin" | "master";

export type Permission =
  | "viewDashboard"
  | "manageClients"
  | "manageServices"
  | "manageMasters"
  | "manageAppointments"
  | "viewAnalytics"
  | "viewSettings"
  | "manageSettings";

const permissions = [
  "viewDashboard",
  "manageClients",
  "manageServices",
  "manageMasters",
  "manageAppointments",
  "viewAnalytics",
  "viewSettings",
  "manageSettings",
] as const satisfies readonly Permission[];

const permissionMatrix: Record<StaffRole, Record<Permission, boolean>> = {
  owner: {
    viewDashboard: true,
    manageClients: true,
    manageServices: true,
    manageMasters: true,
    manageAppointments: true,
    viewAnalytics: true,
    viewSettings: true,
    manageSettings: true,
  },
  admin: {
    viewDashboard: true,
    manageClients: true,
    manageServices: true,
    manageMasters: true,
    manageAppointments: true,
    viewAnalytics: true,
    viewSettings: false,
    manageSettings: false,
  },
  master: {
    viewDashboard: false,
    manageClients: false,
    manageServices: false,
    manageMasters: false,
    manageAppointments: false,
    viewAnalytics: false,
    viewSettings: false,
    manageSettings: false,
  },
};

export function isValidStaffRole(role: unknown): role is StaffRole {
  return role === "owner" || role === "admin" || role === "master";
}

export function can(role: StaffRole, permission: Permission) {
  return permissionMatrix[role][permission];
}

export function getPermissionsForRole(role: StaffRole) {
  return permissions.filter((permission) => can(role, permission));
}
