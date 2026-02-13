"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronDown, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo, LogoMini } from "@/components/shared/logo";
import { useAuth } from "@/providers/auth-provider";
import { useClinicSettings } from "@/providers/clinic-settings-provider";
import {
  getNavigationForRole,
  type NavSection,
  type NavItem,
} from "@/config/navigation";
import { ROLE_LABELS, type UserRole } from "@/types";
import { getInitials } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings } = useClinicSettings();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "Menu Utama",
    "Master Data",
    "Manajemen User",
    "Operasional",
    "Praktek",
    "Pembayaran",
  ]);

  // Get clinic logo for mini version
  const clinicLogo = settings?.logo_url;
  const clinicName = settings?.name || "KlinikCare";

  const navigation = user ? getNavigationForRole(user.role as UserRole) : [];

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (items: NavItem[]) =>
    items.some((item) => pathname.startsWith(item.href));

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 z-40 h-screen",
          "flex flex-col",
          "bg-card border-r border-border",
          "shadow-sm",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {isCollapsed ? (
              <motion.div
                key="mini-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center w-full"
              >
                {clinicLogo ? (
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                    <img
                      src={clinicLogo}
                      alt={clinicName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <LogoMini className="w-10 h-10" />
                )}
              </motion.div>
            ) : (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Logo
                  size="sm"
                  showText={true}
                  animated={false}
                  animatedText={true}
                  useClinicLogo={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Collapse button when collapsed */}
        {isCollapsed && (
          <div className="flex justify-center py-2 border-b border-border">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-2">
            {navigation.map((section: NavSection) => (
              <div key={section.title} className="mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 mb-1",
                      "text-xs font-semibold uppercase tracking-wider",
                      "text-muted-foreground hover:text-foreground",
                      "rounded-md hover:bg-muted/50 transition-colors",
                    )}
                  >
                    <span>{section.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        expandedSections.includes(section.title) ||
                          isSectionActive(section.items)
                          ? "rotate-180"
                          : "",
                      )}
                    />
                  </button>
                )}
                <AnimatePresence>
                  {(isCollapsed ||
                    expandedSections.includes(section.title) ||
                    isSectionActive(section.items)) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item: NavItem) => (
                        <NavLink
                          key={item.href}
                          item={item}
                          isActive={isActive(item.href)}
                          isCollapsed={isCollapsed}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* User Profile */}
        <div className="border-t border-border p-4 bg-muted/30">
          <div
            className={cn("flex items-center gap-3", isCollapsed && "flex-col")}
          >
            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-sm">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role ? ROLE_LABELS[user.role as UserRole] : ""}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Keluar</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "transition-all duration-200 relative",
        isCollapsed && "justify-center px-2",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {/* Active indicator */}
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-foreground rounded-r-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <Icon
        className={cn(
          "h-5 w-5 shrink-0",
          isActive ? "text-primary-foreground" : "",
        )}
      />
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="truncate"
          >
            {item.title}
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          <p>{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
