"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Search,
  Menu,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  X,
  ShoppingCart,
  AlertTriangle,
  FileText,
  Loader2,
  Volume2,
  VolumeX,
  BellRing,
  BellOff,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_LABELS, type UserRole } from "@/types";
import { getInitials } from "@/lib/utils";
import { useNotification } from "@/hooks/useNotification";
import { notificationService } from "@/services/notification.service";
import { RINGTONE_OPTIONS } from "@/lib/notification-sound";
import type { NotificationType } from "@/types/notification";
import { NOTIFICATION_TYPE_COLORS } from "@/types/notification";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

// Icon mapping for notification types
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "po_pending_approval":
    case "po_approved":
    case "po_rejected":
      return <ShoppingCart className="h-4 w-4" />;
    case "low_stock":
    case "expiring_medicine":
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === "super_admin" || user?.role === "admin_klinik";

  // Use notification hook (only for admins)
  const {
    notifications,
    unreadCount,
    loading: loadingNotifications,
    refresh: refreshNotifications,
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
    ringtone,
    setRingtone,
    previewRingtone,
    browserNotificationEnabled,
    setBrowserNotificationEnabled,
    browserNotificationPermission,
    requestBrowserNotificationPermission,
    handleNotificationClick: onNotificationClick,
    markAsRead,
    markAllAsRead,
    testSound,
    isRinging,
    stopRinging,
  } = useNotification({
    enabled: isAdmin,
    refreshInterval: 30000,
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Refresh when dropdown opens
  useEffect(() => {
    if (notificationOpen && isAdmin) {
      refreshNotifications();
    }
  }, [notificationOpen, isAdmin, refreshNotifications]);

  const handleNotificationClick = (notification: any) => {
    onNotificationClick(notification);
    stopRinging(); // Stop ringing when notification clicked
    setNotificationOpen(false);
  };

  // Stop ringing when dropdown opens
  const handleNotificationDropdownOpen = (open: boolean) => {
    setNotificationOpen(open);
    if (open && isRinging) {
      stopRinging();
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 border-b border-border",
        "bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80",
        "flex items-center justify-between px-4 md:px-6",
        "transition-all duration-300",
        sidebarCollapsed ? "left-20" : "left-[280px]",
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-muted"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari pasien, dokter, atau menu..."
                  className="pl-10 pr-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowSearch(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
                className="hover:bg-muted"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-muted relative"
          >
            <AnimatePresence mode="wait">
              {resolvedTheme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* Notification Settings */}
        {isAdmin && (
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-muted"
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Pengaturan Notifikasi</h4>

                {/* Sound Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {soundEnabled ? (
                        <Volume2 className="h-4 w-4" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label htmlFor="sound-enabled" className="text-sm">
                        Suara Notifikasi
                      </Label>
                    </div>
                    <Switch
                      id="sound-enabled"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>

                  {soundEnabled && (
                    <div className="space-y-3">
                      {/* Ringtone Selection */}
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Pilih Ringtone
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {RINGTONE_OPTIONS.map((option) => (
                            <Button
                              key={option.value}
                              variant={
                                ringtone === option.value
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                setRingtone(option.value);
                                previewRingtone(option.value);
                              }}
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Volume */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-muted-foreground">
                            Volume
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(soundVolume * 100)}%
                          </span>
                        </div>
                        <Slider
                          value={[soundVolume]}
                          onValueChange={([value]) => setSoundVolume(value)}
                          max={1}
                          step={0.1}
                          className="w-full"
                        />
                      </div>

                      {/* Test Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={testSound}
                      >
                        Test Suara
                      </Button>
                    </div>
                  )}
                </div>

                <DropdownMenuSeparator />

                {/* Browser Notification Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {browserNotificationEnabled ? (
                        <BellRing className="h-4 w-4" />
                      ) : (
                        <BellOff className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Label htmlFor="browser-notif" className="text-sm">
                        Notifikasi Browser
                      </Label>
                    </div>
                    <Switch
                      id="browser-notif"
                      checked={browserNotificationEnabled}
                      onCheckedChange={setBrowserNotificationEnabled}
                    />
                  </div>

                  {browserNotificationEnabled &&
                    browserNotificationPermission !== "granted" && (
                      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                        <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                          Izin notifikasi browser belum diberikan
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={requestBrowserNotificationPermission}
                        >
                          Minta Izin
                        </Button>
                      </div>
                    )}

                  {browserNotificationEnabled &&
                    browserNotificationPermission === "granted" && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Notifikasi browser aktif
                      </p>
                    )}

                  {browserNotificationPermission === "denied" && (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Notifikasi browser diblokir. Aktifkan di pengaturan
                      browser.
                    </p>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Notifications */}
        <DropdownMenu
          open={notificationOpen}
          onOpenChange={handleNotificationDropdownOpen}
        >
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "relative hover:bg-muted",
                isRinging && "animate-pulse",
              )}
            >
              {isRinging ? (
                <motion.div
                  animate={{ rotate: [0, -15, 15, -15, 15, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <BellRing className="h-5 w-5 text-destructive" />
                </motion.div>
              ) : (
                <Bell className="h-5 w-5" />
              )}
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full text-[10px] font-medium flex items-center justify-center",
                    isRinging
                      ? "bg-destructive text-destructive-foreground animate-ping"
                      : "bg-destructive text-destructive-foreground",
                  )}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </motion.span>
              )}
              {isRinging && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-md bg-destructive/20"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="font-semibold">Notifikasi</span>
              <div className="flex items-center gap-2">
                {isRinging && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      stopRinging();
                    }}
                  >
                    <VolumeX className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                )}
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-primary hover:text-primary/80"
                    onClick={(e) => {
                      e.preventDefault();
                      markAllAsRead();
                    }}
                  >
                    Tandai Dibaca
                  </Button>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {loadingNotifications ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Tidak ada notifikasi</p>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-3 cursor-pointer",
                      !notification.read && "bg-primary/5",
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
                        NOTIFICATION_TYPE_COLORS[notification.type],
                        "text-white",
                      )}
                    >
                      <NotificationIcon type={notification.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                        )}
                        <p
                          className={cn(
                            "text-sm truncate",
                            !notification.read && "font-medium",
                          )}
                        >
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notificationService.formatTime(
                          notification.created_at,
                        )}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-primary font-medium"
                  onClick={() => {
                    router.push(
                      "/pharmacy/purchase-orders?status=pending_approval",
                    );
                    setNotificationOpen(false);
                  }}
                >
                  Lihat semua PO pending
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full hover:bg-muted"
            >
              <Avatar className="h-9 w-9 ring-2 ring-border">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-primary/10 text-primary w-fit">
                  {user?.role ? ROLE_LABELS[user.role as UserRole] : ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive cursor-pointer focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
