"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Shield,
  CheckCircle,
  XCircle,
  Lock,
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
  RoleTable,
  RoleModal,
  RoleDetailModal,
  DeleteConfirmModal,
} from "@/components/roles";
import roleService from "@/services/role.service";
import type { Role, RoleStats, RoleFilters } from "@/types/role";

const statsCardConfig = [
  {
    key: "total",
    title: "Total Role",
    icon: Shield,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "active",
    title: "Role Aktif",
    icon: CheckCircle,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "inactive",
    title: "Role Nonaktif",
    icon: XCircle,
    gradient: "from-red-500 to-red-600",
    bgLight: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "system",
    title: "System Role",
    icon: Lock,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [stats, setStats] = useState<RoleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<RoleFilters>({
    search: "",
    status: "all",
    page: 1,
    per_page: 10,
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await roleService.getRoles(filters);
      setRoles(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Gagal memuat data role");
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await roleService.getRoleStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchRoles(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchRoles, fetchStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchRoles(), fetchStats()]);
    setIsRefreshing(false);
    toast.success("Data berhasil diperbarui");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search]);

  const handleFilterChange = (key: keyof RoleFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleView = async (role: Role) => {
    try {
      // Fetch full role details with permissions
      const response = await roleService.getRoleById(role.id);
      setSelectedRole(response.data);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching role details:", error);
      toast.error("Gagal memuat detail role");
    }
  };

  const handleEdit = async (role: Role) => {
    try {
      // Fetch full role details with permissions
      const response = await roleService.getRoleById(role.id);
      setSelectedRole(response.data);
      setIsRoleModalOpen(true);
    } catch (error) {
      console.error("Error fetching role details:", error);
      toast.error("Gagal memuat detail role");
    }
  };

  const handleDelete = (role: Role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = async (role: Role) => {
    try {
      await roleService.toggleRoleStatus(role.id);
      toast.success(
        role.is_active
          ? "Role berhasil dinonaktifkan"
          : "Role berhasil diaktifkan"
      );
      await Promise.all([fetchRoles(), fetchStats()]);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status role");
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setIsRoleModalOpen(true);
  };

  const handleRoleModalSuccess = async () => {
    toast.success(
      selectedRole
        ? "Role berhasil diperbarui"
        : "Role berhasil dibuat"
    );
    await Promise.all([fetchRoles(), fetchStats()]);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRole) return;
    try {
      await roleService.deleteRole(selectedRole.id);
      toast.success("Role berhasil dihapus");
      await Promise.all([fetchRoles(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Gagal menghapus role");
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

  const getStatsValue = (key: string): number => {
    if (!stats) return 0;
    return (stats[key as keyof RoleStats] as number) || 0;
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
          <h1 className="text-2xl md:text-3xl font-bold">Hak Akses</h1>
          <p className="text-muted-foreground mt-1">
            Kelola role dan permission pengguna
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
          <Button size="sm" onClick={handleAddRole}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Role
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
                  placeholder="Cari nama role..."
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
                    <SelectValue placeholder="Status" />
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

      {/* Role Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <RoleTable
          roles={roles}
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
      <RoleModal
        open={isRoleModalOpen}
        onOpenChange={setIsRoleModalOpen}
        role={selectedRole}
        onSuccess={handleRoleModalSuccess}
      />

      <RoleDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        role={selectedRole}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsRoleModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedRole) {
            handleToggleStatus(selectedRole);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        role={selectedRole}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
