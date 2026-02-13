"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
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
  UserTable,
  UserModal,
  UserDetailModal,
  DeleteConfirmModal,
  AssignDepartmentModal,
} from "@/components/users";
import userService from "@/services/user.service";
import type { User, UserRole } from "@/types/auth";
import type { UserStats, UserFilters } from "@/types/user";
import { ROLE_LABELS } from "@/types/auth";

// Stats card data
const statsCardConfig = [
  {
    key: "total",
    title: "Total Pengguna",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "active",
    title: "Pengguna Aktif",
    icon: UserCheck,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "inactive",
    title: "Pengguna Nonaktif",
    icon: UserX,
    gradient: "from-red-500 to-red-600",
    bgLight: "bg-red-50 dark:bg-red-950/50",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    key: "roles",
    title: "Total Role",
    icon: Shield,
    gradient: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
];

export default function UsersPage() {
  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: "all",
    status: "all",
    page: 1,
    per_page: 10,
  });

  // Modal state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAssignDepartmentModalOpen, setIsAssignDepartmentModalOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      const response = await userService.getUsers(filters);
      setUsers(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await userService.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUsers(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchUsers, fetchStats]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchUsers(), fetchStats()]);
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
  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle view user
  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  // Handle edit user
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  // Handle delete user
  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = async (user: User) => {
    try {
      await userService.toggleUserStatus(user.id);
      toast.success(
        user.is_active
          ? "Pengguna berhasil dinonaktifkan"
          : "Pengguna berhasil diaktifkan",
      );
      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Gagal mengubah status pengguna");
    }
  };

  // Handle add new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  // Handle user modal success
  const handleUserModalSuccess = async () => {
    toast.success(
      selectedUser
        ? "Pengguna berhasil diperbarui"
        : "Pengguna berhasil dibuat",
    );
    await Promise.all([fetchUsers(), fetchStats()]);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await userService.deleteUser(selectedUser.id);
      toast.success("Pengguna berhasil dihapus");
      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Gagal menghapus pengguna");
      throw error;
    }
  };

  // Handle assign departments
  const handleAssignDepartments = (user: User) => {
    setSelectedUser(user);
    setIsAssignDepartmentModalOpen(true);
  };

  // Handle assign departments success
  const handleAssignDepartmentsSuccess = async () => {
    toast.success("Poli berhasil di-assign ke pengguna");
    await fetchUsers();
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
    if (key === "roles") {
      return Object.values(stats.by_role).filter((v) => v > 0).length;
    }
    return stats[key as keyof Omit<UserStats, "by_role">] as number;
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
          <h1 className="text-2xl md:text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pengguna dan hak akses sistem
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
          <Button size="sm" onClick={handleAddUser}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Pengguna
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
                  placeholder="Cari nama atau email..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={filters.role}
                  onValueChange={(value) => handleFilterChange("role", value)}
                >
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Semua Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Role</SelectItem>
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Semua Status" />
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

      {/* User Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <UserTable
          users={users}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
          onAssignDepartments={handleAssignDepartments}
        />
      </motion.div>

      {/* Modals */}
      <UserModal
        open={isUserModalOpen}
        onOpenChange={setIsUserModalOpen}
        user={selectedUser}
        onSuccess={handleUserModalSuccess}
      />

      <UserDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        user={selectedUser}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsUserModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedUser) {
            handleToggleStatus(selectedUser);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        user={selectedUser}
        onConfirm={handleDeleteConfirm}
      />

      <AssignDepartmentModal
        open={isAssignDepartmentModalOpen}
        onOpenChange={setIsAssignDepartmentModalOpen}
        user={selectedUser}
        onSuccess={handleAssignDepartmentsSuccess}
      />
    </div>
  );
}
