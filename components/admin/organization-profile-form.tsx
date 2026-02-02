'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { updateOrganizationProfile } from "@/app/admin/organization/actions"
import { useEffect } from "react"
import { toast } from "sonner"

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button disabled={pending} type="submit" className="w-full md:w-auto">
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
    )
}

interface OrganizationProfileFormProps {
    profile: any
}

export function OrganizationProfileForm({ profile }: OrganizationProfileFormProps) {
    const [state, formAction] = useActionState(updateOrganizationProfile, null)

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message)
        } else if (state?.error) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <form action={formAction}>
            <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="contact">Kontak</TabsTrigger>
                    <TabsTrigger value="address">Alamat</TabsTrigger>
                    <TabsTrigger value="social">Sosial Media</TabsTrigger>
                    <TabsTrigger value="about">Tentang</TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Kontak</CardTitle>
                            <CardDescription>Email, telepon, dan WhatsApp organisasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Utama</label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={profile?.email || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="sekretariat@fk3i.or.id"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Kedua</label>
                                    <input
                                        type="email"
                                        name="emailSecondary"
                                        defaultValue={profile?.emailSecondary || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="humas@fk3i.or.id"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telepon Utama</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={profile?.phone || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="+62 21 1234 5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telepon Kedua</label>
                                    <input
                                        type="tel"
                                        name="phoneSecondary"
                                        defaultValue={profile?.phoneSecondary || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp Utama (format: 6281234567890)</label>
                                    <input
                                        type="text"
                                        name="whatsapp"
                                        defaultValue={profile?.whatsapp || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="6281234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp Kedua</label>
                                    <input
                                        type="text"
                                        name="whatsappSecondary"
                                        defaultValue={profile?.whatsappSecondary || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="6285678901234"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="address">
                    <Card>
                        <CardHeader>
                            <CardTitle>Alamat</CardTitle>
                            <CardDescription>Alamat kantor pusat organisasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Alamat Lengkap</label>
                                <textarea
                                    name="address"
                                    defaultValue={profile?.address || ''}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Jl. Kramat Raya No. 164"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kota/Kabupaten</label>
                                    <input
                                        type="text"
                                        name="city"
                                        defaultValue={profile?.city || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="Jakarta Pusat"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Provinsi</label>
                                    <input
                                        type="text"
                                        name="province"
                                        defaultValue={profile?.province || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="DKI Jakarta"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kode Pos</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        defaultValue={profile?.postalCode || ''}
                                        className="w-full px-3 py-2 border rounded-md"
                                        placeholder="10430"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="social">
                    <Card>
                        <CardHeader>
                            <CardTitle>Media Sosial</CardTitle>
                            <CardDescription>Link ke akun media sosial organisasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Facebook</label>
                                <input
                                    type="url"
                                    name="facebook"
                                    defaultValue={profile?.facebook || ''}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://facebook.com/fk3i"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instagram</label>
                                <input
                                    type="url"
                                    name="instagram"
                                    defaultValue={profile?.instagram || ''}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://instagram.com/fk3i"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Twitter / X</label>
                                <input
                                    type="url"
                                    name="twitter"
                                    defaultValue={profile?.twitter || ''}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://twitter.com/fk3i"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">YouTube</label>
                                <input
                                    type="url"
                                    name="youtube"
                                    defaultValue={profile?.youtube || ''}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="https://youtube.com/@fk3i"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tentang Organisasi</CardTitle>
                            <CardDescription>Visi, misi, dan sejarah organisasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi Singkat</label>
                                <textarea
                                    name="shortDescription"
                                    defaultValue={profile?.shortDescription || ''}
                                    rows={2}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Deskripsi singkat untuk hero section"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi Lengkap</label>
                                <textarea
                                    name="longDescription"
                                    defaultValue={profile?.longDescription || ''}
                                    rows={4}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Deskripsi lengkap organisasi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visi</label>
                                <textarea
                                    name="vision"
                                    defaultValue={profile?.vision || ''}
                                    rows={3}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Visi organisasi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Misi (pisahkan dengan enter untuk numbered list)</label>
                                <textarea
                                    name="mission"
                                    defaultValue={profile?.mission || ''}
                                    rows={5}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="1. Misi pertama&#10;2. Misi kedua&#10;3. Misi ketiga"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sejarah</label>
                                <textarea
                                    name="history"
                                    defaultValue={profile?.history || ''}
                                    rows={6}
                                    className="w-full px-3 py-2 border rounded-md"
                                    placeholder="Sejarah singkat organisasi"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
                <SubmitButton />
            </div>
        </form>
    )
}
