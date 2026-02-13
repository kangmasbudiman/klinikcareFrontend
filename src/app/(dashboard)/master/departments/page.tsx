"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Building2,
  CheckCircle,
  XCircle,
  Users,
  Search,
  Plus,
  RefreshCw,
  Filter,
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
  DepartmentTable,
  DepartmentModal,
  DepartmentDetailModal,
  DeleteConfirmModal,
} from "@/components/departments";
import departmentService from "@/services/department.service";
import type { Department, DepartmentStats, DepartmentFilters } from "@/types/department";

// Stats card data
const statsCardConfig = [
  {
    key: "total",
    title: "Total Departemen",
    icon: Building2,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "active",
    title: "Departemen Aktif",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "inactive",
    title: "Departemen Nonaktif",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
    bgLight: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "total_quota",
    title: "Total Kuota/Hari",
    icon: Users,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function DepartmentsPage() {
  // State for departments data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState<DepartmentFilters>({
    search: "",
    status: "all",
    page: 1,
    per_page: 10,
  });

  // Modal state
  const [isDepartmentModalOpen, setIsDepartmentModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments(filters);
      setDepartments(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Gagal memuat data departemen");
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await departmentService.getDepartmentStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchDepartments(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchDepartments, fetchStats]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDepartments(), fetchStats()]);
    setIsRefreshing(false);
    toast.success("Data berhasil diperbarui");
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle filter change
  const handleFilterChange = (key: keyof DepartmentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle view department
  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setIsDetailModalOpen(true);
  };

  // Handle edit department
  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsDepartmentModalOpen(true);
  };

  // Handle delete department
  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = async (department: Department) => {
    try {
      await departmentService.toggleDepartmentStatus(department.id);
      toast.success(
        department.is_active
          ? "Departemen berhasil dinonaktifkan"
          : "Departemen berhasil diaktifkan"
      );
      await Promise.all([fetchDepartments(), fetchStats()]);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status departemen");
    }
  };

  // Handle add new department
  const handleAddDepartment = () => {
    setSelectedDepartment(null);
    setIsDepartmentModalOpen(true);
  };

  // Handle department modal success
  const handleDepartmentModalSuccess = async () => {
    toast.success(
      selectedDepartment
        ? "Departemen berhasil diperbarui"
        : "Departemen berhasil dibuat"
    );
    await Promise.all([fetchDepartments(), fetchStats()]);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;
    try {
      await departmentService.deleteDepartment(selectedDepartment.id);
      toast.success("Departemen berhasil dihapus");
      await Promise.all([fetchDepartments(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error("Gagal menghapus departemen");
      throw error;
    }
  };

  // Animation variants
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

  // Get stats value
  const getStatsValue = (key: string): number => {
    if (!stats) return 0;
    return stats[key as keyof DepartmentStats] as number;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Master Departemen</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data departemen dan poliklinik
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
          <Button size="sm" onClick={handleAddDepartment}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Departemen
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
                    getStatsValue(stat.key)
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
                  placeholder="Cari kode atau nama departemen..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Department Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DepartmentTable
          departments={departments}
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
      <DepartmentModal
        open={isDepartmentModalOpen}
        onOpenChange={setIsDepartmentModalOpen}
        department={selectedDepartment}
        onSuccess={handleDepartmentModalSuccess}
      />

      <DepartmentDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        department={selectedDepartment}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsDepartmentModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedDepartment) {
            handleToggleStatus(selectedDepartment);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        department={selectedDepartment}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
