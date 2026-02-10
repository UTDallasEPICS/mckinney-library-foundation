import type { Grant, Grantor } from "~~/server/utils/generated/prisma/browser";

export const useGrantsDropDown = (grants:{grant:Grant, boardMember:{name:string}| null, grantor: {name: string} | null}[]) => {
    const grantPurposes: ComputedRef<string[]> = computed(() => {
    if (grants) {
        const uniquePurposes = new Set(
            grants.map((row) => row.grant.purpose).filter((purpose) => purpose != null)
        )
        return Array.from(uniquePurposes)
    }
    return []
})
    const grantMethods:ComputedRef<string[]> = computed(() => {
        if (grants) {
            const uniqueMethods = new Set(
                grants.map(row => row.grant.method).filter((method) => method != null)
            )
            return Array.from(uniqueMethods)
        }
        return []
    }) 
    return {
        grantPurposes,
        grantMethods
    }
}

export const useGrantorDropDown = (grantors:{grantor:Grantor, grants:Grant[],boardMember:{name:string}|null}[]) => {
    const grantorOrganizations:ComputedRef<string[]> = computed(() => {
        if (grantors) {
            const uniqueOrgs = new Set(
                grantors.map((row) => row.grantor.organization).filter((organization) => organization != null)
            )
            return Array.from(uniqueOrgs)
        }
        return []
    })
    return {
        grantorOrganizations
    }
}