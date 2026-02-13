"use client";

import { motion } from "framer-motion";
import {
  Pencil,
  Trash2,
  MoreHorizontal,
  Power,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { useState } from "react";
import { toast } from "sonner";

import type { DoctorSchedule } from "@/types/schedule";
import scheduleService from "@/services/schedule.service";

interface ScheduleTableProps {
  schedules: DoctorSchedule[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (schedule: DoctorSchedule) => void;
  onRefresh: () => void;
}

export function ScheduleTable({
  schedules,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onRefresh,
}: ScheduleTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete
  const handleDeleteClick = (schedule: DoctorSchedule) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSchedule) return;

    setIsDeleting(true);
    try {
      await scheduleService.deleteSchedule(selectedSchedule.id);
      toast.success("Jadwal berhasil dihapus");
      onRefresh();
    } catch (error) {
      toast.error("Gagal menghapus jadwal");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedSchedule(null);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (schedule: DoctorSchedule) => {
    try {
      await scheduleService.toggleScheduleStatus(schedule.id);
      toast.success(
        schedule.is_active ? "Jadwal dinonaktifkan" : "Jadwal diaktifkan"
      );
      onRefresh();
    } catch (error) {
      toast.error("Gagal mengubah status jadwal");
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokter</TableHead>
              <TableHead>Poli</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Kuota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Empty state
  if (schedules.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Belum ada jadwal</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Klik tombol &quot;Tambah Jadwal&quot; untuk membuat jadwal praktek dokter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dokter</TableHead>
              <TableHead>Poli</TableHead>
              <TableHead>Hari</TableHead>
              <TableHead>Jam</TableHead>
              <TableHead>Kuota</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule, index) => (
              <motion.tr
                key={schedule.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group hover:bg-muted/50"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {schedule.doctor?.name?.charAt(0).toUpperCase() || "D"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{schedule.doctor?.name || "-"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`bg-${schedule.department?.color || "gray"}-100 text-${schedule.department?.color || "gray"}-800 dark:bg-${schedule.department?.color || "gray"}-900 dark:text-${schedule.department?.color || "gray"}-300 border-0`}
                  >
                    {schedule.department?.name || "-"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{schedule.day_label}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{schedule.time_range}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{schedule.quota} pasien</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={schedule.is_active ? "success" : "secondary"}>
                    {schedule.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(schedule)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(schedule)}>
                        <Power className="mr-2 h-4 w-4" />
                        {schedule.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(schedule)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jadwal?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus jadwal{" "}
              <strong>{selectedSchedule?.doctor?.name}</strong> pada hari{" "}
              <strong>{selectedSchedule?.day_label}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
