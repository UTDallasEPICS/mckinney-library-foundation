import type { Grant, Grantor } from "@prisma/client";

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

// export const useDonorDropDown = (donors:{donor:Donor, donations:Donation[],boardMember:{name:string}|null}[]) => {
//     const organizations:ComputedRef<string[]> = computed(() => {
//         if (donors) {
//             const uniqueOrgs = new Set(
//                 donors.map((row) => row.donor.organization).filter((organization) => organization != null)
//             )
//             return Array.from(uniqueOrgs)
//         }
//         return []
//     })
//     return {
//         organizations
//     }
// }