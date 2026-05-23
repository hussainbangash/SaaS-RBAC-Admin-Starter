import { auth } from "@/auth";
import { redirect } from "next/navigation";

export type AppRole = "ADMIN" | "MANAGER" | "USER";

export const roleLabels: Record<AppRole, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  USER: "User",
};

export const dashboardRoutes = [
  {
    label: "Dashboard",
    href: "/dashboard",
    allowedRoles: ["ADMIN", "MANAGER", "USER"] as AppRole[],
  },
  {
    label: "Users",
    href: "/dashboard/users",
    allowedRoles: ["ADMIN"] as AppRole[],
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    allowedRoles: ["ADMIN", "MANAGER"] as AppRole[],
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    allowedRoles: ["ADMIN", "MANAGER", "USER"] as AppRole[],
  },
];

export function canAccess(userRole: AppRole, allowedRoles: AppRole[]) {
  return allowedRoles.includes(userRole);
}

export async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const user = await requireUser();

  if (!canAccess(user.role, allowedRoles)) {
    redirect("/unauthorized");
  }

  return user;
}