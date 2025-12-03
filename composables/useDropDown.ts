import type { Donation, Donor } from "@prisma/client";

export const useDonationDropDown = (donations:{donation: Donation,boardMember: {name: string;} | null;donor: {name: string | null;} | null;}[]) => {
    const events: ComputedRef<string[]> = computed(() => {
        if (donations) {
            const uniqueEvents = new Set(
                donations.map((row) => row.donation.event).filter((event) => event != null)
            )
            return Array.from(uniqueEvents)
        }
        return []
    })
    const methods:ComputedRef<string[]> = computed(() => {
        if (donations) {
            const uniqueMethods = new Set(
                donations.map(row => row.donation.method).filter((method) => method != null)
            )
            return Array.from(uniqueMethods)
        }
        return []
    }) 
    return {
        events,
        methods
    }
}

export const useDonorDropDown = (donors:{donor:Donor, donations:Donation[],boardMember:{name:string}|null}[]) => {
    const organizations:ComputedRef<string[]> = computed(() => {
        if (donors) {
            const uniqueOrgs = new Set(
                donors.map((row) => row.donor.organization).filter((organization) => organization != null)
            )
            return Array.from(uniqueOrgs)
        }
        return []
    })
    return {
        organizations
    }
}