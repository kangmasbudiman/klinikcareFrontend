"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ticket, Loader2, Building2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/types/department";
import type { Queue } from "@/types/queue";
import queueService from "@/services/queue.service";
import departmentService from "@/services/department.service";
import { toast } from "sonner";

interface QueueTakeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (queue: Queue) => void;
}

export function QueueTakeModal({
  open,
  onOpenChange,
  onSuccess,
}: QueueTakeModalProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [createdQueue, setCreatedQueue] = useState<Queue | null>(null);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!open) return;

      setIsLoadingDepartments(true);
      try {
        const response = await departmentService.getActiveDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [open]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedDepartment("");
      setCreatedQueue(null);
    }
  }, [open]);

  const handleTakeQueue = async () => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      const response = await queueService.takeQueue({
        department_id: parseInt(selectedDepartment),
      });
      setCreatedQueue(response.data);
    } catch (error: any) {
      console.error("Error taking queue:", error);
      toast.error("Gagal mengambil nomor antrian", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (createdQueue) {
      onSuccess(createdQueue);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            {createdQueue ? "Nomor Antrian" : "Ambil Antrian"}
          </DialogTitle>
          <DialogDescription>
            {createdQueue
              ? "Nomor antrian berhasil diambil"
              : "Pilih poli/departemen tujuan untuk mengambil nomor antrian"}
          </DialogDescription>
        </DialogHeader>

        {createdQueue ? (
          // Success state - show queue number
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Nomor Antrian Anda
              </p>
              <div className="text-6xl font-bold text-primary">
                {createdQueue.queue_code}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Poli Tujuan</p>
              <p className="font-medium">{createdQueue.department?.name}</p>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Silakan tunggu sampai nomor antrian Anda dipanggil
            </p>
          </motion.div>
        ) : (
          // Form state - select department
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>
                Pilih Poli/Departemen{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue
                      placeholder={
                        isLoadingDepartments ? "Memuat..." : "Pilih poli tujuan"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${departmentService.getColorClass(dept.color)}`}
                          />
                          <span>{dept.name}</span>
                          <span className="text-muted-foreground text-xs">
                            ({dept.code})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center py-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Ticket className="h-10 w-10 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Klik tombol di bawah untuk mengambil nomor antrian
                </p>
              </div>
            </motion.div>
          </div>
        )}

        <DialogFooter>
          {createdQueue ? (
            <Button onClick={handleClose} className="w-full">
              Selesai
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button
                onClick={handleTakeQueue}
                disabled={!selectedDepartment || isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengambil...
                  </>
                ) : (
                  <>
                    <Ticket className="mr-2 h-4 w-4" />
                    Ambil Antrian
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
