'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
    profile: { name?: string | null, tagline?: string | null, logoUrl?: string | null, email?: string | null, emailSecondary?: string | null, phone?: string | null, phoneSecondary?: string | null, whatsapp?: string | null, whatsappSecondary?: string | null, address?: string | null, city?: string | null, province?: string | null, postalCode?: string | null, facebook?: string | null, instagram?: string | null, twitter?: string | null, youtube?: string | null, shortDescription?: string | null, longDescription?: string | null, vision?: string | null, mission?: string | null, history?: string | null } | null
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
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="identity">Identitas</TabsTrigger>
                    <TabsTrigger value="contact">Kontak</TabsTrigger>
                    <TabsTrigger value="address">Alamat</TabsTrigger>
                    <TabsTrigger value="social">Sosial Media</TabsTrigger>
                    <TabsTrigger value="about">Tentang</TabsTrigger>
                </TabsList>

                <TabsContent value="identity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identitas Organisasi</CardTitle>
                            <CardDescription>Nama resmi, tagline, dan logo organisasi</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Nama Organisasi</label>
                                <Input
                                    type="text"
                                    name="name"
                                    defaultValue={profile?.name || ''}
                                    placeholder="BEM Pesantren Indonesia"
                                />
                                <p className="text-xs text-muted-foreground">Nama ini akan ditampilkan di seluruh halaman website.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tagline / Slogan</label>
                                <Input
                                    type="text"
                                    name="tagline"
                                    defaultValue={profile?.tagline || ''}
                                    placeholder="Santri Bergerak, Indonesia Maju"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">URL Logo</label>
                                <Input
                                    type="url"
                                    name="logoUrl"
                                    defaultValue={profile?.logoUrl || ''}
                                    placeholder="https://bem-pesantren.or.id/logo.png"
                                />
                                <p className="text-xs text-muted-foreground">Masukkan URL gambar logo. Untuk mengupload, gunakan menu Galeri terlebih dahulu lalu copy link-nya.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

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
                                    <Input
                                        type="email"
                                        name="email"
                                        defaultValue={profile?.email || ''}
                                        placeholder="sekretariat@bem-pesantren.or.id"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email Kedua</label>
                                    <Input
                                        type="email"
                                        name="emailSecondary"
                                        defaultValue={profile?.emailSecondary || ''}
                                        placeholder="humas@bem-pesantren.or.id"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telepon Utama</label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        defaultValue={profile?.phone || ''}
                                        placeholder="+62 21 1234 5678"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Telepon Kedua</label>
                                    <Input
                                        type="tel"
                                        name="phoneSecondary"
                                        defaultValue={profile?.phoneSecondary || ''}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp Utama (format: 6281234567890)</label>
                                    <Input
                                        type="text"
                                        name="whatsapp"
                                        defaultValue={profile?.whatsapp || ''}
                                        placeholder="6281234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">WhatsApp Kedua</label>
                                    <Input
                                        type="text"
                                        name="whatsappSecondary"
                                        defaultValue={profile?.whatsappSecondary || ''}
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
                                <Textarea
                                    name="address"
                                    defaultValue={profile?.address || ''}
                                    rows={3}
                                    placeholder="Jl. Kramat Raya No. 164"
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kota/Kabupaten</label>
                                    <Input
                                        type="text"
                                        name="city"
                                        defaultValue={profile?.city || ''}
                                        placeholder="Jakarta Pusat"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Provinsi</label>
                                    <Input
                                        type="text"
                                        name="province"
                                        defaultValue={profile?.province || ''}
                                        placeholder="DKI Jakarta"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Kode Pos</label>
                                    <Input
                                        type="text"
                                        name="postalCode"
                                        defaultValue={profile?.postalCode || ''}
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
                                <Input
                                    type="url"
                                    name="facebook"
                                    defaultValue={profile?.facebook || ''}
                                    placeholder="https://facebook.com/bempesantren"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Instagram</label>
                                <Input
                                    type="url"
                                    name="instagram"
                                    defaultValue={profile?.instagram || ''}
                                    placeholder="https://instagram.com/bempesantren"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Twitter / X</label>
                                <Input
                                    type="url"
                                    name="twitter"
                                    defaultValue={profile?.twitter || ''}
                                    placeholder="https://twitter.com/bempesantren"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">YouTube</label>
                                <Input
                                    type="url"
                                    name="youtube"
                                    defaultValue={profile?.youtube || ''}
                                    placeholder="https://youtube.com/@bempesantren"
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
                                <Textarea
                                    name="shortDescription"
                                    defaultValue={profile?.shortDescription || ''}
                                    rows={2}
                                    placeholder="Deskripsi singkat untuk hero section"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Deskripsi Lengkap</label>
                                <Textarea
                                    name="longDescription"
                                    defaultValue={profile?.longDescription || ''}
                                    rows={4}
                                    placeholder="Deskripsi lengkap organisasi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Visi</label>
                                <Textarea
                                    name="vision"
                                    defaultValue={profile?.vision || ''}
                                    rows={3}
                                    placeholder="Visi organisasi"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Misi (pisahkan dengan enter untuk numbered list)</label>
                                <Textarea
                                    name="mission"
                                    defaultValue={profile?.mission || ''}
                                    rows={5}
                                    placeholder="1. Misi pertama&#10;2. Misi kedua&#10;3. Misi ketiga"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Sejarah</label>
                                <Textarea
                                    name="history"
                                    defaultValue={profile?.history || ''}
                                    rows={6}
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

