"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Users,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ScheduleTable, ScheduleModal } from "@/components/schedules";
import type { DoctorSchedule, ScheduleFilters, DayOfWeek, AvailableDoctor } from "@/types/schedule";
import type { User } from "@/types/auth";
import type { Department } from "@/types/department";
import scheduleService from "@/services/schedule.service";
import userService from "@/services/user.service";
import departmentService from "@/services/department.service";
import { useAuth } from "@/providers/auth-provider";

export default function SchedulesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "super_admin" || user?.role === "admin_klinik";
  const isDoctor = user?.role === "dokter";

  // State
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters
  const [filters, setFilters] = useState<ScheduleFilters>({
    doctor_id: "",
    department_id: "",
    day_of_week: "",
    page: 1,
    per_page: 15,
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);

  // Fetch schedules
  const fetchSchedules = useCallback(async () => {
    try {
      // If doctor, only show their schedules
      const fetchFilters = isDoctor && user?.id
        ? { ...filters, doctor_id: user.id as number }
        : filters;

      const response = await scheduleService.getSchedules(fetchFilters);
      setSchedules(response.data);
      if (response.meta) {
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
      }
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  }, [filters, isDoctor, user?.id]);

  // Fetch available doctors today
  const fetchAvailableDoctors = useCallback(async () => {
    try {
      const response = await scheduleService.getAvailableDoctors();
      setAvailableDoctors(response.data);
    } catch (error) {
      console.error("Error fetching available doctors:", error);
    }
  }, []);

  // Fetch doctors and departments for filters
  const fetchFilterData = useCallback(async () => {
    try {
      const [doctorsRes, departmentsRes] = await Promise.all([
        userService.getDoctorsByDepartment(),
        departmentService.getActiveDepartments(),
      ]);
      setDoctors(doctorsRes.data);
      setDepartments(departmentsRes.data);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchSchedules(),
        fetchAvailableDoctors(),
        fetchFilterData(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchSchedules, fetchAvailableDoctors, fetchFilterData]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchSchedules(), fetchAvailableDoctors()]);
    setIsRefreshing(false);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof ScheduleFilters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle add schedule
  const handleAddSchedule = () => {
    setSelectedSchedule(null);
    setIsModalOpen(true);
  };

  // Handle edit schedule
  const handleEditSchedule = (schedule: DoctorSchedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    handleRefresh();
  };

  // Get current day name
  const currentDay = scheduleService.getDayLabel(scheduleService.getCurrentDay());

  // Stats cards
  const statsCards = [
    {
      title: "Total Jadwal",
      value: schedules.length,
      icon: Calendar,
      color: "blue",
    },
    {
      title: "Dokter Praktek Hari Ini",
      value: availableDoctors.length,
      icon: Stethoscope,
      color: "green",
    },
    {
      title: "Hari Ini",
      value: currentDay,
      icon: Clock,
      color: "purple",
      isText: true,
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
          <h1 className="text-2xl font-bold tracking-tight">
            {isDoctor ? "Jadwal Saya" : "Jadwal Dokter"}
          </h1>
          <p className="text-muted-foreground">
            {isDoctor
              ? "Lihat jadwal praktek Anda"
              : "Kelola jadwal praktek dokter"}
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
          {isAdmin && (
            <Button onClick={handleAddSchedule}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Jadwal
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`${stat.isText ? "text-2xl" : "text-3xl"} font-bold mt-2`}>
                      {isLoading ? "-" : stat.value}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Calendar className="h-4 w-4" />
            Semua Jadwal
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            <Clock className="h-4 w-4" />
            Praktek Hari Ini
          </TabsTrigger>
        </TabsList>

        {/* All Schedules Tab */}
        <TabsContent value="all" className="mt-4 space-y-4">
          {/* Filters */}
          {isAdmin && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select
                    value={filters.doctor_id?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("doctor_id", value === "all" ? "" : parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Semua Dokter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Dokter</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.department_id?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("department_id", value === "all" ? "" : parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Semua Poli" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Poli</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.day_of_week?.toString() || "all"}
                    onValueChange={(value) =>
                      handleFilterChange("day_of_week", value === "all" ? "" : parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Semua Hari" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Hari</SelectItem>
                      {scheduleService.getDayOptionsStatic().map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Schedule Table */}
          <ScheduleTable
            schedules={schedules}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onEdit={handleEditSchedule}
            onRefresh={handleRefresh}
          />
        </TabsContent>

        {/* Today Tab */}
        <TabsContent value="today" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Dokter Praktek Hari Ini ({currentDay})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : availableDoctors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Tidak ada dokter yang praktek hari ini</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableDoctors.map((item) => (
                    <motion.div
                      key={item.doctor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                              {item.doctor.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{item.doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.doctor.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.schedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                          >
                            <Badge variant="outline">
                              {schedule.department.name}
                            </Badge>
                            <span className="text-sm font-medium">
                              {schedule.time_range}
                            </span>
                            {schedule.is_currently_available && (
                              <Badge variant="success" className="text-xs">
                                Sedang Praktek
                              </Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Schedule Modal */}
      <ScheduleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        schedule={selectedSchedule}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
