"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  RefreshCw,
  Clock,
  CheckCircle,
  Users,
  Timer,
  Building2,
  ClipboardList,
  PlayCircle,
  UserCheck,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  ExaminationPatientList,
  ExaminationForm,
  PatientHistoryModal,
} from "@/components/examination";
import type { Queue } from "@/types/queue";
import type { MedicalRecord, MedicalRecordStats } from "@/types/medical-record";
import type { Department } from "@/types/department";
import type { Patient } from "@/types/patient";
import medicalRecordService from "@/services/medical-record.service";
import departmentService from "@/services/department.service";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-provider";

export default function ExaminationPage() {
  const { user } = useAuth();

  // State
  const [waitingQueues, setWaitingQueues] = useState<Queue[]>([]);
  const [inProgressRecords, setInProgressRecords] = useState<MedicalRecord[]>(
    [],
  );
  const [completedRecords, setCompletedRecords] = useState<MedicalRecord[]>([]);
  const [stats, setStats] = useState<MedicalRecordStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  // Selected patient for examination
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(
    null,
  );
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);

  // Patient history modal
  const [historyPatient, setHistoryPatient] = useState<Patient | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleShowHistory = (patient: Patient | null | undefined) => {
    if (!patient) return;
    setHistoryPatient(patient);
    setHistoryOpen(true);
  };

  // Check if user is a doctor with assigned departments
  const isDoctor = user?.role === "dokter";
  const userDepartments = user?.departments || [];
  const hasDepartments = userDepartments.length > 0;

  // Fetch pending examinations
  const fetchPendingExaminations = useCallback(async () => {
    try {
      const deptId =
        selectedDepartment !== "all" ? parseInt(selectedDepartment) : undefined;
      const response =
        await medicalRecordService.getPendingExaminations(deptId);
      setWaitingQueues(response.data.waiting);
      setInProgressRecords(response.data.in_progress);
    } catch (error) {
      console.error("Error fetching pending examinations:", error);
    }
  }, [selectedDepartment]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const deptId =
        selectedDepartment !== "all" ? parseInt(selectedDepartment) : undefined;
      const response = await medicalRecordService.getExaminationStats(
        undefined,
        deptId,
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [selectedDepartment]);

  // Fetch completed examinations
  const fetchCompletedExaminations = useCallback(async () => {
    try {
      const deptId =
        selectedDepartment !== "all" ? parseInt(selectedDepartment) : undefined;
      const response =
        await medicalRecordService.getCompletedExaminations(deptId);
      setCompletedRecords(response.data);
    } catch (error) {
      console.error("Error fetching completed examinations:", error);
    }
  }, [selectedDepartment]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getActiveDepartments();

      // If user is a doctor, filter only their assigned departments
      if (isDoctor && hasDepartments) {
        const userDeptIds = userDepartments.map((d) => d.id);
        const filteredDepts = response.data.filter((d) =>
          userDeptIds.includes(d.id),
        );
        setDepartments(filteredDepts);

        // Auto-select primary department or first department
        const primaryDept = userDepartments.find((d) => d.is_primary);
        if (primaryDept) {
          setSelectedDepartment(primaryDept.id.toString());
        } else if (filteredDepts.length > 0) {
          setSelectedDepartment(filteredDepts[0].id.toString());
        }
      } else {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, [isDoctor, hasDepartments, userDepartments]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchPendingExaminations(),
        fetchStats(),
        fetchDepartments(),
        fetchCompletedExaminations(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [
    fetchPendingExaminations,
    fetchStats,
    fetchDepartments,
    fetchCompletedExaminations,
  ]);

  // Auto refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPendingExaminations();
      fetchStats();
      fetchCompletedExaminations();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPendingExaminations, fetchStats, fetchCompletedExaminations]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchPendingExaminations(),
      fetchStats(),
      fetchCompletedExaminations(),
    ]);
    setIsRefreshing(false);
  };

  // Handle start examination from queue
  const handleStartExamination = async (queue: Queue) => {
    try {
      const response = await medicalRecordService.startExamination({
        queue_id: queue.id,
      });
      setSelectedRecord(response.data);
      setSelectedQueue(queue);
      toast.success("Pemeriksaan dimulai", {
        description: `Pasien ${queue.patient?.name || queue.queue_code}`,
      });
      handleRefresh();
    } catch (error: any) {
      console.error("Error starting examination:", error);
      toast.error("Gagal memulai pemeriksaan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  // Handle continue examination (from in_progress)
  const handleContinueExamination = async (record: MedicalRecord) => {
    try {
      const response = await medicalRecordService.getMedicalRecordById(
        record.id,
      );
      setSelectedRecord(response.data);
      setSelectedQueue(record.queue || null);
    } catch (error: any) {
      console.error("Error loading examination:", error);
      toast.error("Gagal memuat data pemeriksaan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  // Handle close examination form
  const handleCloseExamination = () => {
    setSelectedRecord(null);
    setSelectedQueue(null);
    handleRefresh();
  };

  // Stats cards
  const statsCards = [
    {
      title: "Menunggu Diperiksa",
      value: stats?.waiting || 0,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Sedang Diperiksa",
      value: stats?.in_progress || 0,
      icon: Stethoscope,
      color: "blue",
    },
    {
      title: "Selesai Hari Ini",
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Rata-rata Waktu",
      value: stats?.avg_exam_time ? `${stats.avg_exam_time} mnt` : "-",
      icon: Timer,
      color: "purple",
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

  // If examination form is open
  if (selectedRecord) {
    return (
      <ExaminationForm
        medicalRecord={selectedRecord}
        queue={selectedQueue}
        onClose={handleCloseExamination}
        onUpdate={(updated) => setSelectedRecord(updated)}
      />
    );
  }

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
            Pemeriksaan Pasien
          </h1>
          <p className="text-muted-foreground">
            {isDoctor && hasDepartments
              ? `Poli: ${userDepartments.map((d) => d.name).join(", ")}`
              : "Layanan pemeriksaan pasien hari ini"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-[200px]">
              <Building2 className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Semua Poli" />
            </SelectTrigger>
            <SelectContent>
              {/* Only show "Semua Poli" for non-doctors or doctors with multiple departments */}
              {(!isDoctor || departments.length > 1) && (
                <SelectItem value="all">Semua Poli</SelectItem>
              )}
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2">
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

      {/* Patient Lists with Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "active" | "completed")}
      >
        <TabsList>
          <TabsTrigger value="active">
            Aktif ({waitingQueues.length + inProgressRecords.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Selesai Hari Ini ({completedRecords.length})
          </TabsTrigger>
        </TabsList>

        {/* Active Tab - Waiting & In Progress */}
        <TabsContent value="active" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* In Progress Examinations */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                      <Stethoscope className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    Sedang Diperiksa
                    {inProgressRecords.length > 0 && (
                      <Badge variant="secondary">
                        {inProgressRecords.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {inProgressRecords.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Belum ada pemeriksaan aktif</p>
                    </div>
                  ) : (
                    inProgressRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30 hover:border-blue-300 transition-colors cursor-pointer"
                        onClick={() => handleContinueExamination(record)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                              <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {record.patient?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {record.queue?.queue_code} -{" "}
                                {record.patient?.medical_record_number}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="info">
                              {record.department?.name}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {record.patient?.age} tahun,{" "}
                              {record.patient?.gender_label}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Mulai:{" "}
                            {new Date(record.created_at).toLocaleTimeString(
                              "id-ID",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowHistory(record.patient);
                              }}
                            >
                              <History className="h-4 w-4 mr-1" />
                              Riwayat
                            </Button>
                            <Button size="sm" variant="outline">
                              <PlayCircle className="h-4 w-4 mr-1" />
                              Lanjutkan
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Waiting Queue */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-950">
                      <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    Antrian Menunggu Diperiksa
                    {waitingQueues.length > 0 && (
                      <Badge variant="secondary">{waitingQueues.length}</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                  {waitingQueues.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Tidak ada pasien menunggu</p>
                    </div>
                  ) : (
                    waitingQueues.map((queue) => (
                      <div
                        key={queue.id}
                        className="p-4 rounded-lg border hover:border-primary transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900">
                              <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <p className="font-semibold">
                                {queue.patient?.name || "Pasien"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {queue.queue_code} -{" "}
                                {queue.patient?.medical_record_number || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge>{queue.department?.name}</Badge>
                            {queue.patient && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {queue.patient.age} tahun,{" "}
                                {queue.patient.gender_label}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Tunggu: {queue.wait_time} menit
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleShowHistory(queue.patient)}
                            >
                              <History className="h-4 w-4 mr-1" />
                              Riwayat
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleStartExamination(queue)}
                            >
                              <Stethoscope className="h-4 w-4 mr-1" />
                              Periksa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Completed Tab */}
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Pasien Selesai Diperiksa Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {completedRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada pasien selesai diperiksa hari ini</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {completedRecords.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-green-100 dark:bg-green-900">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold">
                              {record.patient?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {record.queue?.queue_code} -{" "}
                              {record.patient?.medical_record_number}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="success">
                            {record.department?.name}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {record.patient?.age} tahun,{" "}
                            {record.patient?.gender_label}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          <span>
                            Selesai:{" "}
                            {record.completed_at
                              ? new Date(
                                  record.completed_at,
                                ).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                          <span className="mx-2">|</span>
                          <span>Dokter: {record.doctor?.name || "-"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleShowHistory(record.patient)}
                          >
                            <History className="h-4 w-4 mr-1" />
                            Riwayat
                          </Button>
                          {record.invoice ? (
                            <Badge
                              variant={
                                record.invoice.payment_status === "paid"
                                  ? "success"
                                  : "warning"
                              }
                            >
                              {record.invoice.payment_status === "paid"
                                ? "Sudah Bayar"
                                : "Belum Bayar"}
                            </Badge>
                          ) : (
                            <Badge variant="outline">Belum Ada Invoice</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Patient History Modal */}
      <PatientHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        patient={historyPatient}
      />
    </div>
  );
}
