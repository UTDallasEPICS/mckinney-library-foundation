import { createAuthClient } from "better-auth/vue" // make sure to import from better-auth/vue
import { emailOTPClient } from "better-auth/client/plugins"
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        emailOTPClient(),
        inferAdditionalFields<typeof auth>()
    ]
})