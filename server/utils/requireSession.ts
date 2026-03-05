import { auth } from "./auth";
import { createError } from "h3";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  permission: number;
}

// verify an active session exists and optionally check permission level
export async function requireSession(event: any, minPermission: number = 0): Promise<AuthenticatedUser> {
  try {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session || !session.user) {
      throw createError({ statusCode: 401, statusMessage: "Unauthorized", data: { message: "No active session" } });
    }
    const user = session.user as AuthenticatedUser;
    if (user.permission < minPermission) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden", data: { message: "Insufficient permissions" } });
    }
    return user;
  } catch (err: any) {
    if (err.statusCode) throw err;
    throw createError({ statusCode: 401, statusMessage: "Unauthorized", data: { message: "Failed to authenticate" } });
  }
}

// remove sensitive properties when permission < 1
export function filterSensitiveFields<T extends Record<string, any>>(obj: T, permission: number, fields: string[]): T {
  if (permission >= 1) return obj;
  const copy = { ...obj };
  fields.forEach((f) => delete copy[f]);
  return copy;
}
