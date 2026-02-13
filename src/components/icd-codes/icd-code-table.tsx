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
  FileCode2,
  ShieldCheck,
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
import type { IcdCode } from "@/types/icd-code";
import icdCodeService from "@/services/icd-code.service";

interface IcdCodeTableProps {
  icdCodes: IcdCode[];
  isLoading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onView: (icdCode: IcdCode) => void;
  onEdit: (icdCode: IcdCode) => void;
  onDelete: (icdCode: IcdCode) => void;
  onToggleStatus: (icdCode: IcdCode) => void;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="h-3 w-16 bg-muted animate-pulse rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          <div className="h-3 w-48 bg-muted animate-pulse rounded" />
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
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
      <TableCell colSpan={7} className="h-48">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-muted/50 mb-4">
            <FileCode2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">Tidak ada kode ICD</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Belum ada kode ICD yang sesuai dengan filter
          </p>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function IcdCodeTable({
  icdCodes,
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: IcdCodeTableProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold w-[120px]">Kode</TableHead>
              <TableHead className="font-semibold w-[130px]">Tipe</TableHead>
              <TableHead className="font-semibold">Nama</TableHead>
              <TableHead className="font-semibold w-[100px]">Chapter</TableHead>
              <TableHead className="font-semibold w-[100px]">BPJS</TableHead>
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
            ) : icdCodes.length === 0 ? (
              <EmptyState />
            ) : (
              icdCodes.map((icdCode, index) => (
                <motion.tr
                  key={icdCode.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <TableCell>
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono font-semibold">
                      {icdCode.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={icdCodeService.getTypeColorClass(icdCode.type)}
                    >
                      {icdCodeService.formatTypeLabel(icdCode.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium truncate max-w-md" title={icdCode.name_id}>
                        {icdCode.name_id}
                      </p>
                      {icdCode.name_en && (
                        <p className="text-sm text-muted-foreground truncate max-w-md" title={icdCode.name_en}>
                          {icdCode.name_en}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {icdCode.chapter ? (
                      <span className="text-sm font-medium">{icdCode.chapter}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {icdCode.is_bpjs_claimable ? (
                      <Badge variant="secondary" className={icdCodeService.getBpjsClass(true)}>
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Ya
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className={icdCodeService.getBpjsClass(false)}>
                        Tidak
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={icdCode.is_active ? "success" : "error"}>
                      {icdCode.is_active ? "Aktif" : "Nonaktif"}
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
                        <DropdownMenuItem onClick={() => onView(icdCode)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(icdCode)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(icdCode)}>
                          <Power className="mr-2 h-4 w-4" />
                          {icdCode.is_active ? "Nonaktifkan" : "Aktifkan"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(icdCode)}
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
