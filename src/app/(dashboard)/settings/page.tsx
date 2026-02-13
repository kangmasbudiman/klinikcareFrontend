"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  User,
  Lock,
  Save,
  Loader2,
  Phone,
  Mail,
  Shield,
  Building2,
  ListOrdered,
  Eye,
  EyeOff,
  ChevronRight,
  Settings2,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useAuth } from "@/providers/auth-provider";
import authService from "@/services/auth.service";
import { ROLE_LABELS, ROLE_COLORS } from "@/types/auth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const adminQuickLinks = [
  {
    title: "Pengaturan Klinik",
    description: "Informasi klinik, logo, jam operasional, dan konfigurasi sistem",
    href: "/master/clinic",
    icon: Building2,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    title: "Hak Akses & Role",
    description: "Kelola role pengguna dan pengaturan permission",
    href: "/settings/roles",
    icon: Shield,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/50",
  },
  {
    title: "Pengaturan Antrian",
    description: "Konfigurasi antrian per poli, prefix, dan kuota harian",
    href: "/queue/settings",
    icon: ListOrdered,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
];

export default function SettingsPage() {
  const { user, checkAuth } = useAuth();

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isAdmin = user?.role === "super_admin" || user?.role === "admin_klinik";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = async () => {
    if (!profileName.trim()) {
      toast.error("Nama tidak boleh kosong");
      return;
    }

    setSavingProfile(true);
    try {
      const response = await authService.updateProfile({
        name: profileName.trim(),
        phone: profilePhone.trim() || null,
      });

      if (response.success) {
        toast.success("Profil berhasil diperbarui");
        await checkAuth();
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Gagal memperbarui profil";
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword) {
      toast.error("Masukkan password saat ini");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    setSavingPassword(true);
    try {
      const response = await authService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      if (response.success) {
        toast.success("Password berhasil diperbarui");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Gagal mengubah password";
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola profil akun dan preferensi Anda
        </p>
      </div>

      {/* Profile Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-base">Profil Akun</CardTitle>
                <CardDescription>
                  Informasi dasar akun Anda
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar & Info Preview */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold text-lg">{user.name}</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <Badge
                  className={`text-xs ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-800"}`}
                  variant="secondary"
                >
                  {ROLE_LABELS[user.role] || user.role}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Editable Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Nama Lengkap</Label>
                <Input
                  id="profile-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  maxLength={255}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-phone">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-phone"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="pl-10"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSaveProfile} disabled={savingProfile}>
                {savingProfile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Simpan Profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900">
                <KeyRound className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-base">Ubah Password</CardTitle>
                <CardDescription>
                  Pastikan menggunakan password yang kuat dan unik
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password saat ini"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">Password Baru</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {newPassword && newPassword.length < 8 && (
              <p className="text-sm text-destructive">
                Password minimal 8 karakter
              </p>
            )}
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-destructive">
                Konfirmasi password tidak cocok
              </p>
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleChangePassword}
                disabled={
                  savingPassword ||
                  !currentPassword ||
                  newPassword.length < 8 ||
                  newPassword !== confirmPassword
                }
                variant="outline"
              >
                {savingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="mr-2 h-4 w-4" />
                )}
                Ubah Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Admin Quick Links */}
      {isAdmin && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">
                  <Settings2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <CardTitle className="text-base">Pengaturan Sistem</CardTitle>
                  <CardDescription>
                    Akses cepat ke konfigurasi sistem klinik
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {adminQuickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <div className="group rounded-lg border p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className={`rounded-md p-2 ${link.bg}`}>
                          <link.icon className={`h-5 w-5 ${link.color}`} />
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h3 className="mt-3 font-medium text-sm">
                        {link.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
