"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Patient } from "@/types/patient";
import patientService from "@/services/patient.service";

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onSuccess: () => void;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  patient,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!patient) return;

    setIsDeleting(true);
    setError(null);

    try {
      await patientService.deletePatient(patient.id);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Gagal menghapus pasien. Silakan coba lagi."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-950">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <DialogTitle>Hapus Pasien</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Apakah Anda yakin ingin menghapus pasien berikut?
          </p>
          <div className="mt-3 p-3 rounded-lg bg-muted">
            <p className="font-medium">{patient.name}</p>
            <p className="text-sm text-muted-foreground">
              {patient.medical_record_number}
            </p>
          </div>

          {error && (
            <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Pasien"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
