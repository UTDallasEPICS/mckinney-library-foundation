import { createAuthClient } from "better-auth/vue"
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins"
import type { auth } from "~~/server/utils/auth"

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        inferAdditionalFields<typeof auth>()
    ]
})

// session lookup through better auth's /get-session endpoint; works during SSR by forwarding the request cookie
export const useAuth = () => {
    const headers = useRequestHeaders(["cookie"]);
    return authClient.useSession((url: string, opts: Record<string, any>) => useFetch(url, { ...opts, headers }));
}
