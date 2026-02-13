"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  FileCode2,
  CheckCircle,
  XCircle,
  Stethoscope,
  Scissors,
  ShieldCheck,
  Search,
  Plus,
  RefreshCw,
  Filter,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IcdCodeTable,
  IcdCodeModal,
  IcdCodeDetailModal,
  DeleteConfirmModal,
  ImportModal,
} from "@/components/icd-codes";
import icdCodeService from "@/services/icd-code.service";
import type { IcdCode, IcdCodeStats, IcdCodeFilters, IcdType } from "@/types/icd-code";

const statsCardConfig = [
  {
    key: "total",
    title: "Total Kode ICD",
    icon: FileCode2,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "icd10_count",
    title: "ICD-10 (Diagnosis)",
    icon: Stethoscope,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    key: "icd9cm_count",
    title: "ICD-9-CM (Prosedur)",
    icon: Scissors,
    gradient: "from-cyan-500 to-cyan-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    key: "bpjs_claimable",
    title: "Claimable BPJS",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function IcdCodesPage() {
  const [icdCodes, setIcdCodes] = useState<IcdCode[]>([]);
  const [stats, setStats] = useState<IcdCodeStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<IcdCodeFilters>({
    search: "",
    type: "all",
    status: "all",
    bpjs: "all",
    page: 1,
    per_page: 10,
  });

  const [isIcdCodeModalOpen, setIsIcdCodeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedIcdCode, setSelectedIcdCode] = useState<IcdCode | null>(null);

  const fetchIcdCodes = useCallback(async () => {
    try {
      const response = await icdCodeService.getIcdCodes(filters);
      setIcdCodes(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching ICD codes:", error);
      toast.error("Gagal memuat data kode ICD");
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await icdCodeService.getIcdCodeStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchIcdCodes(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchIcdCodes, fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchIcdCodes(), fetchStats()]);
    setIsRefreshing(false);
    toast.success("Data berhasil diperbarui");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFilterChange = (key: keyof IcdCodeFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleView = (icdCode: IcdCode) => {
    setSelectedIcdCode(icdCode);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (icdCode: IcdCode) => {
    setSelectedIcdCode(icdCode);
    setIsIcdCodeModalOpen(true);
  };

  const handleDelete = (icdCode: IcdCode) => {
    setSelectedIcdCode(icdCode);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (icdCode: IcdCode) => {
    try {
      await icdCodeService.toggleIcdCodeStatus(icdCode.id);
      toast.success(
        icdCode.is_active
          ? "Kode ICD berhasil dinonaktifkan"
          : "Kode ICD berhasil diaktifkan"
      );
      await Promise.all([fetchIcdCodes(), fetchStats()]);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status kode ICD");
    }
  };

  const handleAddIcdCode = () => {
    setSelectedIcdCode(null);
    setIsIcdCodeModalOpen(true);
  };

  const handleIcdCodeModalSuccess = async () => {
    toast.success(
      selectedIcdCode
        ? "Kode ICD berhasil diperbarui"
        : "Kode ICD berhasil dibuat"
    );
    await Promise.all([fetchIcdCodes(), fetchStats()]);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIcdCode) return;
    try {
      await icdCodeService.deleteIcdCode(selectedIcdCode.id);
      toast.success("Kode ICD berhasil dihapus");
      await Promise.all([fetchIcdCodes(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting ICD code:", error);
      toast.error("Gagal menghapus kode ICD");
      throw error;
    }
  };

  const handleImportSuccess = async () => {
    await Promise.all([fetchIcdCodes(), fetchStats()]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getStatsValue = (key: string): number => {
    if (!stats) return 0;
    return (stats[key as keyof IcdCodeStats] as number) || 0;
  };

  const typeOptions = icdCodeService.getTypeOptions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Master Kode ICD</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data kode ICD-10 dan ICD-9-CM untuk diagnosis dan prosedur
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button size="sm" onClick={handleAddIcdCode}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Kode ICD
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCardConfig.map((stat) => (
          <motion.div key={stat.key} variants={itemVariants}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bgLight}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">
                  {isLoading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  ) : (
                    getStatsValue(stat.key).toLocaleString("id-ID")
                  )}
                </div>
              </CardContent>
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kode atau nama ICD..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.type as string}
                  onValueChange={(value) => handleFilterChange("type", value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipe ICD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {typeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* BPJS Filter */}
              <Select
                value={filters.bpjs}
                onValueChange={(value) => handleFilterChange("bpjs", value)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status BPJS" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua BPJS</SelectItem>
                  <SelectItem value="claimable">Claimable</SelectItem>
                  <SelectItem value="non-claimable">Non-Claimable</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ICD Code Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <IcdCodeTable
          icdCodes={icdCodes}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      </motion.div>

      {/* Modals */}
      <IcdCodeModal
        open={isIcdCodeModalOpen}
        onOpenChange={setIsIcdCodeModalOpen}
        icdCode={selectedIcdCode}
        onSuccess={handleIcdCodeModalSuccess}
      />

      <IcdCodeDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        icdCode={selectedIcdCode}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsIcdCodeModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedIcdCode) {
            handleToggleStatus(selectedIcdCode);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        icdCode={selectedIcdCode}
        onConfirm={handleDeleteConfirm}
      />

      <ImportModal
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
