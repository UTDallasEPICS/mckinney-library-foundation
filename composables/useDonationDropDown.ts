import type { Donation, Donor } from "~~/server/utils/generated/prisma/browser";

export const useDonationDropDown = (donations:{donation: Donation,boardMember: {name: string;} | null;donor: {name: string | null;} | null;}[]) => {
    const donationEvents: ComputedRef<string[]> = computed(() => {
        if (donations) {
            const uniqueEvents = new Set(
                donations.map((row) => row.donation.event).filter((event) => event != null)
            )
            return Array.from(uniqueEvents)
        }
        return []
    })
    const donationMethods:ComputedRef<string[]> = computed(() => {
        if (donations) {
            const uniqueMethods = new Set(
                donations.map(row => row.donation.method).filter((method) => method != null)
            )
            return Array.from(uniqueMethods)
        }
        return []
    }) 
    return {
        donationEvents,
        donationMethods
    }
}

export const useDonorDropDown = (donors:{donor:Donor, donations:Donation[],boardMember:{name:string}|null}[]) => {
    const donorOrganizations:ComputedRef<string[]> = computed(() => {
        if (donors) {
            const uniqueOrgs = new Set(
                donors.map((row) => row.donor.organization).filter((organization) => organization != null)
            )
            return Array.from(uniqueOrgs)
        }
        return []
    })
    return {
        donorOrganizations
    }
}

