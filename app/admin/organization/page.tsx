import prisma from "@/lib/prisma"
import { OrganizationProfileForm } from "@/components/admin/organization-profile-form"

async function getOrganizationProfile() {
    try {
        return await prisma.organizationProfile.findUnique({
            where: { id: "default" }
        })
    } catch (e) {
        return null
    }
}

export default async function OrganizationPage() {
    const profile = await getOrganizationProfile()

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Profil Organisasi</h1>
                <p className="text-muted-foreground">Kelola informasi kontak dan profil organisasi</p>
            </div>

            <OrganizationProfileForm profile={profile} />
        </div>
    )
}
