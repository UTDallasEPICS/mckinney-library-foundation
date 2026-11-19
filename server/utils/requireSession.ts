import { createError } from "#imports";
import { auth } from "./auth";

// verify an active session exists and optionally check permission level
export async function requireSession(event: any, minPermission: number = 0) {
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
