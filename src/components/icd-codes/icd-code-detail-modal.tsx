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
  BookOpen,
  Globe,
  Link2,
  ShieldCheck,
  FileCode2,
  Layers,
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
import type { IcdCode } from "@/types/icd-code";
import { formatDate } from "@/lib/utils";
import icdCodeService from "@/services/icd-code.service";

interface IcdCodeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icdCode: IcdCode | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function IcdCodeDetailModal({
  open,
  onOpenChange,
  icdCode,
  onEdit,
  onToggleStatus,
}: IcdCodeDetailModalProps) {
  if (!icdCode) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Kode ICD</DialogTitle>
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
                className={`p-5 rounded-2xl ${icdCodeService.getTypeColorClass(icdCode.type)}`}
              >
                <FileCode2 className="h-12 w-12" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                  icdCode.is_active ? "bg-emerald-500" : "bg-gray-400"
                }`}
              >
                {icdCode.is_active ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            </div>

            <code className="mt-4 px-3 py-1 bg-muted rounded font-mono text-lg font-bold">
              {icdCode.code}
            </code>
            <p className="mt-2 text-sm font-medium text-center max-w-sm">
              {icdCode.name_id}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
              <Badge variant={icdCode.is_active ? "success" : "error"}>
                {icdCode.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
              <Badge
                variant="secondary"
                className={icdCodeService.getTypeColorClass(icdCode.type)}
              >
                {icdCodeService.formatTypeLabel(icdCode.type)}
              </Badge>
              {icdCode.is_bpjs_claimable && (
                <Badge variant="secondary" className={icdCodeService.getBpjsClass(true)}>
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  BPJS
                </Badge>
              )}
            </div>
          </motion.div>

          <Separator />

          {/* ICD Code Details */}
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
                <p className="text-xs text-muted-foreground">Kode ICD</p>
                <code className="text-sm font-mono font-semibold">{icdCode.code}</code>
              </div>
            </div>

            {/* Name Indonesian */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <BookOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Nama (Indonesia)</p>
                <p className="text-sm font-medium">{icdCode.name_id}</p>
              </div>
            </div>

            {/* Name English */}
            {icdCode.name_en && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950">
                  <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Nama (English)</p>
                  <p className="text-sm font-medium">{icdCode.name_en}</p>
                </div>
              </div>
            )}

            {/* Chapter Info - Only for ICD-10 */}
            {icdCode.type === "icd10" && icdCode.chapter && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                    <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">Informasi Chapter</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-background">
                    <p className="text-xs text-muted-foreground">Chapter</p>
                    <p className="text-sm font-semibold">{icdCode.chapter}</p>
                  </div>
                  {icdCode.chapter_name && (
                    <div className="p-2 rounded bg-background">
                      <p className="text-xs text-muted-foreground">Nama Chapter</p>
                      <p className="text-sm font-medium truncate" title={icdCode.chapter_name}>
                        {icdCode.chapter_name}
                      </p>
                    </div>
                  )}
                </div>
                {(icdCode.block || icdCode.block_name) && (
                  <div className="grid grid-cols-2 gap-2">
                    {icdCode.block && (
                      <div className="p-2 rounded bg-background">
                        <p className="text-xs text-muted-foreground">Block</p>
                        <p className="text-sm font-semibold">{icdCode.block}</p>
                      </div>
                    )}
                    {icdCode.block_name && (
                      <div className="p-2 rounded bg-background">
                        <p className="text-xs text-muted-foreground">Nama Block</p>
                        <p className="text-sm font-medium truncate" title={icdCode.block_name}>
                          {icdCode.block_name}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Parent Code */}
            {icdCode.parent_code && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950">
                  <Link2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Parent Code</p>
                  <code className="text-sm font-mono font-medium">{icdCode.parent_code}</code>
                </div>
              </div>
            )}

            {/* DTD Code */}
            {icdCode.dtd_code && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-teal-100 dark:bg-teal-950">
                  <Hash className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">DTD Code (SatuSehat)</p>
                  <code className="text-sm font-mono font-medium">{icdCode.dtd_code}</code>
                </div>
              </div>
            )}

            {/* Notes */}
            {icdCode.notes && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-950">
                  <FileText className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">Catatan</p>
                  <p className="text-sm font-medium">{icdCode.notes}</p>
                </div>
              </div>
            )}

            {/* BPJS Status */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Status BPJS</p>
                <p className="text-sm font-medium">
                  {icdCode.is_bpjs_claimable ? "Dapat diklaim BPJS" : "Tidak dapat diklaim BPJS"}
                </p>
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
                  {formatDate(icdCode.created_at)}
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
              variant={icdCode.is_active ? "destructive" : "default"}
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus();
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {icdCode.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
