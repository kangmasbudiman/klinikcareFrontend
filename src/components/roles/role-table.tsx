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
  Shield,
  Users,
  Lock,
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
import type { Role } from "@/types/role";
import roleService from "@/services/role.service";

interface RoleTableProps {
  roles: Role[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
  onToggleStatus: (role: Role) => void;
}

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
        <div className="h-4 w-48 bg-muted animate-pulse rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
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

function EmptyState() {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <Shield className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Tidak ada role</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Belum ada role yang sesuai dengan filter
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function RoleTable({
  roles,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: RoleTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Deskripsi</TableHead>
              <TableHead className="font-semibold w-[120px]">
                Permissions
              </TableHead>
              <TableHead className="font-semibold w-[100px]">Users</TableHead>
              <TableHead className="font-semibold w-[100px]">Status</TableHead>
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
            ) : roles.length === 0 ? (
              <EmptyState />
            ) : (
              roles.map((role, index) => (
                <motion.tr
                  key={role.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${roleService.getSolidColorClass(role.color)} text-white`}
                      >
                        <Shield className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {role.display_name}
                          </p>
                          {role.is_system && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {role.name}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {role.description || "-"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {role.permissions_count || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {role.users_count || 0}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={role.is_active ? "success" : "error"}>
                      {role.is_active ? "Aktif" : "Nonaktif"}
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
                        <DropdownMenuItem onClick={() => onView(role)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(role)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {!role.is_system && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onToggleStatus(role)}
                            >
                              <Power className="mr-2 h-4 w-4" />
                              {role.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(role)}
                              className="text-destructive focus:text-destructive"
                              disabled={(role.users_count || 0) > 0}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
