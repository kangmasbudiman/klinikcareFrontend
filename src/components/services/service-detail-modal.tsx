"use client";

import { motion } from "framer-motion";
import {
  Hash,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Power,
  FileText,
  Clock,
  Banknote,
  Building2,
  FolderOpen,
  CalendarCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Service } from "@/types/service";
import { formatDate } from "@/lib/utils";
import serviceService from "@/services/service.service";
import { ServiceIcon } from "./service-icon";

interface ServiceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function ServiceDetailModal({
  open,
  onOpenChange,
  service,
  onEdit,
  onToggleStatus,
}: ServiceDetailModalProps) {
  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Layanan</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            <div className="relative">
              <div
                className={`p-5 rounded-2xl ${serviceService.getColorClass(service.color)}`}
              >
                <ServiceIcon icon={service.icon} className="h-12 w-12" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  service.is_active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {service.is_active ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-muted-foreground">{service.code}</p>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant={service.is_active ? "success" : "error"}>
                {service.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
              <Badge
                variant="secondary"
                className={serviceService.getCategoryColorClass(service.category)}
              >
                {service.category_label}
              </Badge>
              {service.requires_appointment && (
                <Badge variant="outline" className="gap-1">
                  <CalendarCheck className="h-3 w-3" />
                  Appointment
                </Badge>
              )}
            </div>
          </motion.div>

          <Separator />

          {/* Service Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            {/* Code */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Kode</p>
                <p className="text-sm font-medium">{service.code}</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                <FolderOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Kategori</p>
                <p className="text-sm font-medium">{service.category_label}</p>
              </div>
            </div>

            {/* Department */}
            {service.department && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Departemen</p>
                  <p className="text-sm font-medium">{service.department.name}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {service.description && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-950">
                  <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Deskripsi</p>
                  <p className="text-sm font-medium">{service.description}</p>
                </div>
              </div>
            )}

            {/* Duration */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950">
                <Clock className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Durasi</p>
                <p className="text-sm font-medium">
                  {serviceService.formatDuration(service.duration)}
                </p>
              </div>
            </div>

            {/* Pricing */}
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <Banknote className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs text-muted-foreground">Informasi Tarif</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-background">
                  <p className="text-xs text-muted-foreground">Tarif Dasar</p>
                  <p className="text-sm font-semibold">
                    {serviceService.formatPrice(Number(service.base_price))}
                  </p>
                </div>
                <div className="p-2 rounded bg-background">
                  <p className="text-xs text-muted-foreground">Biaya Dokter</p>
                  <p className="text-sm font-semibold">
                    {serviceService.formatPrice(Number(service.doctor_fee))}
                  </p>
                </div>
                <div className="p-2 rounded bg-background">
                  <p className="text-xs text-muted-foreground">Biaya Klinik</p>
                  <p className="text-sm font-semibold">
                    {serviceService.formatPrice(Number(service.hospital_fee))}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Total Tarif</span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  {serviceService.formatPrice(service.total_price)}
                </span>
              </div>
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-950">
                <Calendar className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Dibuat Pada</p>
                <p className="text-sm font-medium">
                  {formatDate(service.created_at)}
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
              variant={service.is_active ? "destructive" : "default"}
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus();
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {service.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
