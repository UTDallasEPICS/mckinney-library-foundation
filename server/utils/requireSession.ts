import { createError } from "#imports";
import { auth } from "./auth";

type AuthSession = (typeof auth)["$Infer"]["Session"];

// verify an active session exists and optionally check permission level
export async function requireSession(event: any, minPermission: number = 0): Promise<AuthSession> {
  try {
    const session = await auth.api.getSession({ headers: event.headers });
    if (!session?.user || session.user.permission < minPermission) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    return session;
  } catch (err: any) {
    if (err?.statusCode) throw err;
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }
}

// remove sensitive properties when permission < 1
export function filterSensitiveFields<T extends Record<string, any>>(obj: T, permission: number, fields: string[]): T {
  if (permission >= 1) return obj;
  const copy = { ...obj };
  fields.forEach((f) => delete copy[f]);
  return copy;
}
