"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Lock, Bell, Mail, Megaphone } from "lucide-react"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { updateProfile, changePassword, deleteAccount } from "./actions"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type UserData = {
    id: string
    name: string | null
    email: string
    phone: string | null
    bio: string | null
}

export default function SettingsClient({ user }: { user: UserData }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()


    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await updateProfile(formData)

            if (result.success) {
                toast.success(result.message || "Profil berhasil diperbarui")
                router.refresh()
            } else {
                toast.error(result.error || "Gagal memperbarui profil")
            }
        })
    }

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await changePassword(formData)

            if (result.success) {
                toast.success(result.message || "Password berhasil diubah")
                e.currentTarget.reset()
            } else {
                toast.error(result.error || "Gagal mengubah password")
            }
        })
    }


    const handleDeleteAccount = async () => {
        if (!confirm("Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!")) {
            return
        }

        startTransition(async () => {
            const result = await deleteAccount()

            if (result.success) {
                toast.success(result.message || "Akun berhasil dihapus")
                await signOut({ redirect: false })
                router.push("/")
            } else {
                toast.error(result.error || "Gagal menghapus akun")
            }
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-serif ">Pengaturan</h1>
                <p className=" mt-2">
                    Kelola akun dan preferensi aplikasi Anda
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="w-4 h-4" />
                        <span className="hidden sm:inline">Profil</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="w-4 h-4" />
                        <span className="hidden sm:inline">Keamanan</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        <span className="hidden sm:inline">Notifikasi</span>
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Informasi Profil
                            </CardTitle>
                            <CardDescription>
                                Update informasi profil dan email Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveProfile} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Lengkap</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={user.name || ""}
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={user.email}
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        defaultValue={user.phone || ""}
                                        placeholder="+62 812-3456-7890"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input
                                        id="bio"
                                        name="bio"
                                        defaultValue={user.bio || ""}
                                        placeholder="Ceritakan tentang diri Anda"
                                    />
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Ubah Password
                            </CardTitle>
                            <CardDescription>
                                Pastikan akun Anda menggunakan password yang kuat
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Password Saat Ini</Label>
                                    <Input
                                        id="current-password"
                                        name="currentPassword"
                                        type="password"
                                        placeholder="Masukkan password saat ini"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Password Baru</Label>
                                    <Input
                                        id="new-password"
                                        name="newPassword"
                                        type="password"
                                        placeholder="Masukkan password baru"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Konfirmasi Password Baru</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Konfirmasi password baru"
                                    />
                                </div>

                                <Separator />

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                    <Button type="submit" disabled={isPending}>
                                        {isPending ? "Mengubah..." : "Ubah Password"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-destructive/20 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Tindakan yang tidak dapat dibatalkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <Label className="text-destructive">Hapus Akun</Label>
                                    <p className="text-sm ">
                                        Hapus akun Anda secara permanen
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={isPending}>
                                    {isPending ? "Menghapus..." : "Hapus Akun"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab - Simplified */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Saluran Komunikasi BEM
                            </CardTitle>
                            <CardDescription>
                                Gunakan saluran resmi di bawah ini untuk koordinasi internal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                                <span className="text-2xl">📱</span>
                                <div>
                                    <p className="font-semibold text-foreground">WhatsApp Koordinasi</p>
                                    <p>Hubungi admin untuk bergabung grup koordinasi pengurus BEM Pesantren Indonesia.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                                <Mail className="w-6 h-6 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-semibold text-foreground">Email Resmi</p>
                                    <p>Gunakan email resmi organisasi untuk surat-menyurat dengan instansi dan kementerian.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                                <Megaphone className="w-6 h-6 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="font-semibold text-foreground">Pengumuman Internal</p>
                                    <p>Pengumuman resmi organisasi dipublikasikan melalui modul Warta pada panel admin.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>


            </Tabs>
        </div>
    )
}

