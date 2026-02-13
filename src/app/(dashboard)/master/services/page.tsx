"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Layers,
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
  ServiceTable,
  ServiceModal,
  ServiceDetailModal,
  DeleteConfirmModal,
} from "@/components/services";
import serviceService from "@/services/service.service";
import departmentService from "@/services/department.service";
import type { Service, ServiceStats, ServiceFilters, ServiceCategory } from "@/types/service";
import type { Department } from "@/types/department";

const statsCardConfig = [
  {
    key: "total",
    title: "Total Layanan",
    icon: ClipboardList,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "active",
    title: "Layanan Aktif",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "inactive",
    title: "Layanan Nonaktif",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
    bgLight: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "categories",
    title: "Kategori",
    icon: Layers,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<ServiceFilters>({
    search: "",
    status: "all",
    category: "all",
    department_id: "all",
    page: 1,
    per_page: 10,
  });

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const response = await serviceService.getServices(filters);
      setServices(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching services:", error);
      toast.error("Gagal memuat data layanan");
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await serviceService.getServiceStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getActiveDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchServices(), fetchStats(), fetchDepartments()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchServices, fetchStats, fetchDepartments]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchServices(), fetchStats()]);
    setIsRefreshing(false);
    toast.success("Data berhasil diperbarui");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFilterChange = (key: keyof ServiceFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleView = (service: Service) => {
    setSelectedService(service);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (service: Service) => {
    try {
      await serviceService.toggleServiceStatus(service.id);
      toast.success(
        service.is_active
          ? "Layanan berhasil dinonaktifkan"
          : "Layanan berhasil diaktifkan"
      );
      await Promise.all([fetchServices(), fetchStats()]);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status layanan");
    }
  };

  const handleAddService = () => {
    setSelectedService(null);
    setIsServiceModalOpen(true);
  };

  const handleServiceModalSuccess = async () => {
    toast.success(
      selectedService
        ? "Layanan berhasil diperbarui"
        : "Layanan berhasil dibuat"
    );
    await Promise.all([fetchServices(), fetchStats()]);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    try {
      await serviceService.deleteService(selectedService.id);
      toast.success("Layanan berhasil dihapus");
      await Promise.all([fetchServices(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting service:", error);
      toast.error("Gagal menghapus layanan");
      throw error;
    }
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

  const getStatsValue = (key: string): number | string => {
    if (!stats) return 0;
    if (key === "categories") {
      return Object.keys(stats.by_category || {}).length;
    }
    return stats[key as keyof ServiceStats] as number;
  };

  const categoryOptions = serviceService.getCategoryOptions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Master Layanan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data layanan dan tarif klinik
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
          <Button size="sm" onClick={handleAddService}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Layanan
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
                  placeholder="Cari kode atau nama layanan..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.category as string}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Filter */}
              <Select
                value={filters.department_id?.toString() || "all"}
                onValueChange={(value) =>
                  handleFilterChange("department_id", value === "all" ? "all" : Number(value))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Departemen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Departemen</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
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

      {/* Service Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ServiceTable
          services={services}
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
      <ServiceModal
        open={isServiceModalOpen}
        onOpenChange={setIsServiceModalOpen}
        service={selectedService}
        onSuccess={handleServiceModalSuccess}
      />

      <ServiceDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        service={selectedService}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsServiceModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedService) {
            handleToggleStatus(selectedService);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        service={selectedService}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
