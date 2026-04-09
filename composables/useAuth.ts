import type { authClient } from "~/server/utils/authClient";

type AuthSession = typeof authClient.$Infer.Session;

type SessionResponse = {
  success: boolean;
  statusCode: number;
  data: AuthSession | null;
};

export const useAuth = () => {
  const session = useState<AuthSession | null>("auth-session", () => null);
  const sessionLoaded = useState<boolean>("auth-session-loaded", () => false);

  const getSession = async (force = false): Promise<AuthSession | null> => {
    if (sessionLoaded.value && !force) {
      return session.value;
    }

<<<<<<< HEAD
    const result = await useFetch<SessionResponse>("/api/session");
    session.value = result.data.value?.data ?? null;
    sessionLoaded.value = true;
    return session.value;
  };

  return {
    getSession,
    session,
  };
};

  
=======
};
>>>>>>> eacb842 (chore: scope auth foundation changes for split PR)
