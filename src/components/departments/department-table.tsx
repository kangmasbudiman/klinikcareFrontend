"use client";

import { motion } from "framer-motion";
import {
  Eye,
  Edit,
  Trash2,
  Power,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Department } from "@/types/department";
import { formatDate } from "@/lib/utils";
import departmentService from "@/services/department.service";
import { DepartmentIcon } from "./department-icon";

interface DepartmentTableProps {
  departments: Department[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (department: Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onToggleStatus: (department: Department) => void;
}

// Skeleton row for loading state
function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-muted animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
            <div className="h-3 w-20 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-40 bg-muted animate-pulse rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-8 bg-muted animate-pulse rounded" />
      </TableCell>
    </TableRow>
  );
}

// Empty state
function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={5} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Tidak ada departemen</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Belum ada departemen yang sesuai dengan filter
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function DepartmentTable({
  departments,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: DepartmentTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Departemen</TableHead>
              <TableHead className="font-semibold">Deskripsi</TableHead>
              <TableHead className="font-semibold">Kuota/Hari</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold w-[80px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
              </>
            ) : departments.length === 0 ? (
              <EmptyState />
            ) : (
              departments.map((department, index) => (
                <motion.tr
                  key={department.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${departmentService.getColorClass(department.color)}`}
                      >
                        <DepartmentIcon
                          icon={department.icon}
                          className="h-5 w-5"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{department.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {department.code}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <p className="text-sm text-muted-foreground truncate">
                      {department.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {department.quota_per_day}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={department.is_active ? "success" : "error"}>
                      {department.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Buka menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onView(department)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(department)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onToggleStatus(department)}
                        >
                          <Power className="mr-2 h-4 w-4" />
                          {department.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(department)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
