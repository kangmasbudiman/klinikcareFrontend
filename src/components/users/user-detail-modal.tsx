"use client";

import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Edit,
  Power,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/auth";
import { ROLE_LABELS } from "@/types/auth";
import { getInitials, formatDate } from "@/lib/utils";

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function UserDetailModal({
  open,
  onOpenChange,
  user,
  onEdit,
  onToggleStatus,
}: UserDetailModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Pengguna</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  user.is_active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {user.is_active ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold">{user.name}</h3>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={user.role}>{ROLE_LABELS[user.role]}</Badge>
              <Badge variant={user.is_active ? "success" : "error"}>
                {user.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </motion.div>

          <Separator />

          {/* User Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Email */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                <p className="text-sm font-medium">
                  {user.phone || "-"}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Bergabung Sejak</p>
                <p className="text-sm font-medium">
                  {formatDate(user.created_at)}
                </p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant={user.is_active ? "destructive" : "default"}
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus();
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {user.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
