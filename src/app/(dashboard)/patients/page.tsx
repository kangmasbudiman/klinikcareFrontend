"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  RefreshCw,
  Search,
  Shield,
  UserCheck,
  UserX,
  CalendarPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PatientTable,
  PatientModal,
  PatientDetailModal,
  DeleteConfirmModal,
} from "@/components/patients";
import type { Patient, PatientFilters, PatientStats } from "@/types/patient";
import patientService from "@/services/patient.service";

export default function PatientsPage() {
  // State
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<PatientStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState<PatientFilters>({
    search: "",
    status: "all",
    patient_type: "",
    page: 1,
    per_page: 10,
  });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Fetch patients
  const fetchPatients = useCallback(async () => {
    try {
      const response = await patientService.getPatients(filters);
      setPatients(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await patientService.getPatientStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchPatients(), fetchStats()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchPatients, fetchStats]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPatients(), fetchStats()]);
    setIsRefreshing(false);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, page: 1 }));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle view patient
  const handleView = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  // Handle edit patient
  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  // Handle delete patient
  const handleDelete = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDeleteModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = async (patient: Patient) => {
    try {
      await patientService.togglePatientStatus(patient.id);
      handleRefresh();
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  // Handle add patient
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    handleRefresh();
  };

  // Stats cards config
  const statsCards = [
    {
      title: "Total Pasien",
      value: stats?.total || 0,
      icon: Users,
      color: "blue",
      bgGradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      title: "Pasien Aktif",
      value: stats?.active || 0,
      icon: UserCheck,
      color: "green",
      bgGradient: "from-green-500/20 to-green-600/20",
    },
    {
      title: "Pasien BPJS",
      value: stats?.by_type?.bpjs || 0,
      icon: Shield,
      color: "emerald",
      bgGradient: "from-emerald-500/20 to-emerald-600/20",
    },
    {
      title: "Pendaftaran Bulan Ini",
      value: stats?.this_month || 0,
      icon: CalendarPlus,
      color: "purple",
      bgGradient: "from-purple-500/20 to-purple-600/20",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Pasien</h1>
          <p className="text-muted-foreground">
            Kelola data pasien klinik
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
          <Button onClick={handleAddPatient}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tambah Pasien
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="relative overflow-hidden">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
              />
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">
                      {isLoading ? "-" : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-950`}
                  >
                    <stat.icon
                      className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                    />
                  </div>
                </div>
              </CardContent>
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
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama, NIK, No. RM, atau No. BPJS..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                />
              </div>
              <Select
                value={filters.patient_type || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    patient_type: value === "all" ? "" : (value as any),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Jenis Pasien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="umum">Umum</SelectItem>
                  <SelectItem value="bpjs">BPJS</SelectItem>
                  <SelectItem value="asuransi">Asuransi</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: value as any,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-full sm:w-[150px]">
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <PatientTable
          patients={patients}
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
      <PatientModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        patient={selectedPatient}
        onSuccess={handleModalSuccess}
      />

      <PatientDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        patient={selectedPatient}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsModalOpen(true);
        }}
        onToggleStatus={() => {
          if (selectedPatient) {
            handleToggleStatus(selectedPatient);
          }
        }}
      />

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        patient={selectedPatient}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
