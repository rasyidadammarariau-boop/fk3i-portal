"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Lock, Bell, Palette, Shield } from "lucide-react"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { updateProfile, changePassword, deleteAccount, updateNotificationSettings, updatePreferences } from "./actions"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

type UserData = {
    id: string
    name: string | null
    email: string
    phone: string | null
    bio: string | null
}

type UserSettings = {
    emailNotifications: boolean
    newsNotifications: boolean
    agendaNotifications: boolean
    commentNotifications: boolean
    weeklyNewsletter: boolean
    darkMode: boolean
    compactMode: boolean
    animations: boolean
    language: string
    itemsPerPage: number
} | null

export default function SettingsClient({ user, settings }: { user: UserData, settings: UserSettings }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    // Notification states
    const [emailNotifications, setEmailNotifications] = useState(settings?.emailNotifications ?? true)
    const [newsNotifications, setNewsNotifications] = useState(settings?.newsNotifications ?? true)
    const [agendaNotifications, setAgendaNotifications] = useState(settings?.agendaNotifications ?? true)
    const [commentNotifications, setCommentNotifications] = useState(settings?.commentNotifications ?? false)
    const [weeklyNewsletter, setWeeklyNewsletter] = useState(settings?.weeklyNewsletter ?? true)

    // Preference states
    const [darkMode, setDarkMode] = useState(settings?.darkMode ?? false)
    const [compactMode, setCompactMode] = useState(settings?.compactMode ?? false)
    const [animations, setAnimations] = useState(settings?.animations ?? true)
    const [language, setLanguage] = useState(settings?.language ?? "id")
    const [itemsPerPage, setItemsPerPage] = useState(settings?.itemsPerPage ?? 10)

    // Apply dark mode to document
    // Apply dark mode to document
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme-preference', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme-preference', 'light')
        }
    }, [darkMode])

    // Apply compact mode
    React.useEffect(() => {
        if (compactMode) {
            document.documentElement.classList.add('compact')
        } else {
            document.documentElement.classList.remove('compact')
        }
    }, [compactMode])

    // Apply animations preference
    React.useEffect(() => {
        if (!animations) {
            document.documentElement.classList.add('no-animations')
        } else {
            document.documentElement.classList.remove('no-animations')
        }
    }, [animations])

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

    const handleSaveNotifications = async () => {
        startTransition(async () => {
            const result = await updateNotificationSettings({
                emailNotifications,
                newsNotifications,
                agendaNotifications,
                commentNotifications,
                weeklyNewsletter
            })

            if (result.success) {
                toast.success(result.message || "Pengaturan notifikasi berhasil disimpan")
                router.refresh()
            } else {
                toast.error(result.error || "Gagal menyimpan pengaturan notifikasi")
            }
        })
    }

    const handleSavePreferences = async () => {
        startTransition(async () => {
            const result = await updatePreferences({
                darkMode,
                compactMode,
                animations,
                language,
                itemsPerPage
            })

            if (result.success) {
                toast.success(result.message || "Preferensi berhasil disimpan")
                router.refresh()
            } else {
                toast.error(result.error || "Gagal menyimpan preferensi")
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
                <h1 className="text-3xl font-bold font-serif text-gray-900">Pengaturan</h1>
                <p className="text-muted-foreground mt-2">
                    Kelola akun dan preferensi aplikasi Anda
                </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
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
                    <TabsTrigger value="preferences" className="gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Preferensi</span>
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

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Keamanan Akun
                            </CardTitle>
                            <CardDescription>
                                Pengaturan keamanan tambahan untuk akun Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tambahkan lapisan keamanan ekstra
                                    </p>
                                </div>
                                <Switch />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Login Alerts</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notifikasi saat ada login dari perangkat baru
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Preferensi Notifikasi
                            </CardTitle>
                            <CardDescription>
                                Kelola bagaimana Anda menerima notifikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Terima notifikasi melalui email
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Berita Baru</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notifikasi saat ada berita baru dipublikasikan
                                    </p>
                                </div>
                                <Switch
                                    checked={newsNotifications}
                                    onCheckedChange={setNewsNotifications}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Agenda Mendatang</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Pengingat untuk agenda yang akan datang
                                    </p>
                                </div>
                                <Switch
                                    checked={agendaNotifications}
                                    onCheckedChange={setAgendaNotifications}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Komentar & Balasan</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notifikasi untuk komentar dan balasan
                                    </p>
                                </div>
                                <Switch
                                    checked={commentNotifications}
                                    onCheckedChange={setCommentNotifications}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Newsletter Mingguan</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Ringkasan aktivitas mingguan
                                    </p>
                                </div>
                                <Switch
                                    checked={weeklyNewsletter}
                                    onCheckedChange={setWeeklyNewsletter}
                                />
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                                <Button onClick={handleSaveNotifications} disabled={isPending}>
                                    {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Tampilan & Preferensi
                            </CardTitle>
                            <CardDescription>
                                Sesuaikan tampilan aplikasi sesuai keinginan Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Mode Gelap</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Aktifkan tema gelap untuk kenyamanan mata
                                    </p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Compact Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tampilkan lebih banyak konten di layar
                                    </p>
                                </div>
                                <Switch
                                    checked={compactMode}
                                    onCheckedChange={setCompactMode}
                                />
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Animasi</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Aktifkan animasi dan transisi
                                    </p>
                                </div>
                                <Switch
                                    checked={animations}
                                    onCheckedChange={setAnimations}
                                />
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Bahasa</Label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                >
                                    <option value="id">Bahasa Indonesia</option>
                                    <option value="en">English</option>
                                    <option value="ar">العربية</option>
                                </select>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <Label>Items Per Page</Label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md bg-background"
                                    value={itemsPerPage}
                                    onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                                >
                                    <option value="10">10 items</option>
                                    <option value="25">25 items</option>
                                    <option value="50">50 items</option>
                                    <option value="100">100 items</option>
                                </select>
                            </div>

                            <Separator />

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                                <Button onClick={handleSavePreferences} disabled={isPending}>
                                    {isPending ? "Menyimpan..." : "Simpan Preferensi"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="text-red-900">Danger Zone</CardTitle>
                            <CardDescription className="text-red-700">
                                Tindakan yang tidak dapat dibatalkan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-red-900">Hapus Akun</Label>
                                    <p className="text-sm text-red-700">
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
            </Tabs>
        </div>
    )
}
