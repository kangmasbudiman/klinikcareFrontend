"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  RefreshCw,
  Clock,
  CheckCircle,
  Users,
  Timer,
  Building2,
  Phone,
  Play,
  SkipForward,
  XCircle,
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
  QueueTakeModal,
  QueueCallModal,
  QueueStartModal,
  QueueAssignPatientModal,
  QueueCard,
} from "@/components/queue";
import { PatientModal } from "@/components/patients";
import type { Queue, QueueStats } from "@/types/queue";
import type { Department } from "@/types/department";
import queueService from "@/services/queue.service";
import departmentService from "@/services/department.service";
import queueAudio from "@/lib/queue-audio";
import { toast } from "sonner";

export default function QueueManagementPage() {
  // State
  const [queues, setQueues] = useState<{
    waiting: Queue[];
    called: Queue[];
    in_service: Queue[];
    completed: Queue[];
    skipped: Queue[];
    cancelled: Queue[];
  }>({
    waiting: [],
    called: [],
    in_service: [],
    completed: [],
    skipped: [],
    cancelled: [],
  });
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isTakeModalOpen, setIsTakeModalOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isAssignPatientModalOpen, setIsAssignPatientModalOpen] =
    useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);

  // Fetch queues
  const fetchQueues = useCallback(async () => {
    try {
      const deptId =
        selectedDepartment !== "all" ? parseInt(selectedDepartment) : undefined;
      const response = await queueService.getTodayQueues(deptId);
      setQueues(response.data);
    } catch (error) {
      console.error("Error fetching queues:", error);
    }
  }, [selectedDepartment]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const deptId =
        selectedDepartment !== "all" ? parseInt(selectedDepartment) : undefined;
      const response = await queueService.getQueueStats(undefined, deptId);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [selectedDepartment]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getActiveDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchQueues(), fetchStats(), fetchDepartments()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchQueues, fetchStats, fetchDepartments]);

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQueues();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchQueues, fetchStats]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchQueues(), fetchStats()]);
    setIsRefreshing(false);
  };

  // Handle call queue
  const handleCall = (queue: Queue) => {
    setSelectedQueue(queue);
    setIsCallModalOpen(true);
  };

  // Handle recall queue (panggil ulang)
  const handleRecall = (queue: Queue) => {
    if (queueAudio.isSupported()) {
      queueAudio.announce(
        {
          queueCode: queue.queue_code,
          counterNumber: queue.counter_number,
          departmentName: queue.department?.name,
        },
        2,
      );
    }
  };

  // Handle start service
  const handleStart = (queue: Queue) => {
    setSelectedQueue(queue);
    setIsStartModalOpen(true);
  };

  // Handle assign patient
  const handleAssignPatient = (queue: Queue) => {
    setSelectedQueue(queue);
    setIsAssignPatientModalOpen(true);
  };

  // Handle complete service
  const handleComplete = async (queue: Queue) => {
    try {
      await queueService.completeQueue(queue.id);
      toast.success("Layanan selesai", {
        description: `Antrian ${queue.queue_code} telah selesai dilayani`,
      });
      handleRefresh();
    } catch (error: any) {
      console.error("Error completing service:", error);
      toast.error("Gagal menyelesaikan layanan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  // Handle skip queue
  const handleSkip = async (queue: Queue) => {
    try {
      await queueService.skipQueue(queue.id, "Pasien tidak hadir");
      toast.info("Antrian dilewati", {
        description: `${queue.queue_code} telah dilewati`,
      });
      handleRefresh();
    } catch (error: any) {
      console.error("Error skipping queue:", error);
      toast.error("Gagal melewati antrian", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  // Handle cancel queue
  const handleCancel = async (queue: Queue) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan antrian ini?")) return;

    try {
      await queueService.cancelQueue(queue.id, "Dibatalkan oleh petugas");
      toast.warning("Antrian dibatalkan", {
        description: `${queue.queue_code} telah dibatalkan`,
      });
      handleRefresh();
    } catch (error: any) {
      console.error("Error cancelling queue:", error);
      toast.error("Gagal membatalkan antrian", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    }
  };

  // Stats cards
  const statsCards = [
    {
      title: "Total Antrian",
      value: stats?.total || 0,
      icon: Ticket,
      color: "blue",
    },
    {
      title: "Menunggu",
      value: stats?.waiting || 0,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Sedang Dilayani",
      value: (stats?.called || 0) + (stats?.in_service || 0),
      icon: Users,
      color: "purple",
    },
    {
      title: "Selesai",
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: "green",
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

  // Active queues (called + in_service)
  const activeQueues = [...queues.called, ...queues.in_service];

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
            Manajemen Antrian
          </h1>
          <p className="text-muted-foreground">
            Kelola antrian pasien hari ini
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
              <SelectItem value="all">Semua Poli</SelectItem>
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
          <Button onClick={() => setIsTakeModalOpen(true)}>
            <Ticket className="mr-2 h-4 w-4" />
            Ambil Antrian
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

      {/* Average Times */}
      {stats && (stats.avg_wait_time > 0 || stats.avg_service_time > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-6 text-sm text-muted-foreground"
        >
          {stats.avg_wait_time > 0 && (
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span>
                Rata-rata tunggu:{" "}
                {queueService.formatWaitTime(stats.avg_wait_time)}
              </span>
            </div>
          )}
          {stats.avg_service_time > 0 && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                Rata-rata layanan:{" "}
                {queueService.formatWaitTime(stats.avg_service_time)}
              </span>
            </div>
          )}
        </motion.div>
      )}

      {/* Queue Panels */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
                  <Phone className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                Sedang Dilayani
                {activeQueues.length > 0 && (
                  <Badge variant="secondary">{activeQueues.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeQueues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada antrian yang sedang dilayani</p>
                </div>
              ) : (
                activeQueues.map((queue) => (
                  <QueueCard
                    key={queue.id}
                    queue={queue}
                    onRecall={() => handleRecall(queue)}
                    onStart={() => handleStart(queue)}
                    onComplete={() => handleComplete(queue)}
                    onSkip={() => handleSkip(queue)}
                    onCancel={() => handleCancel(queue)}
                    onAssignPatient={() => handleAssignPatient(queue)}
                  />
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
                Antrian Menunggu
                {queues.waiting.length > 0 && (
                  <Badge variant="secondary">{queues.waiting.length}</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
              {queues.waiting.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Tidak ada antrian menunggu</p>
                </div>
              ) : (
                queues.waiting.map((queue) => (
                  <QueueCard
                    key={queue.id}
                    queue={queue}
                    onCall={() => handleCall(queue)}
                    onSkip={() => handleSkip(queue)}
                    onCancel={() => handleCancel(queue)}
                    onAssignPatient={() => handleAssignPatient(queue)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Completed / Skipped Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Riwayat Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="completed">
              <TabsList>
                <TabsTrigger value="completed">
                  Selesai ({queues.completed.length})
                </TabsTrigger>
                <TabsTrigger value="skipped">
                  Dilewati ({queues.skipped.length})
                </TabsTrigger>
                <TabsTrigger value="cancelled">
                  Dibatalkan ({queues.cancelled.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="completed" className="mt-4 space-y-2">
                {queues.completed.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    Belum ada antrian selesai
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {queues.completed.slice(0, 12).map((queue) => (
                      <div
                        key={queue.id}
                        className="p-3 rounded-lg border bg-green-50 dark:bg-green-950/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {queue.queue_code}
                          </span>
                          <Badge variant="success">Selesai</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {queue.patient?.name || "Tidak ada data pasien"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="skipped" className="mt-4 space-y-2">
                {queues.skipped.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    Tidak ada antrian dilewati
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {queues.skipped.map((queue) => (
                      <div
                        key={queue.id}
                        className="p-3 rounded-lg border bg-orange-50 dark:bg-orange-950/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {queue.queue_code}
                          </span>
                          <Badge variant="warning">Dilewati</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {queue.notes || "Pasien tidak hadir"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="cancelled" className="mt-4 space-y-2">
                {queues.cancelled.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">
                    Tidak ada antrian dibatalkan
                  </p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {queues.cancelled.map((queue) => (
                      <div
                        key={queue.id}
                        className="p-3 rounded-lg border bg-red-50 dark:bg-red-950/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {queue.queue_code}
                          </span>
                          <Badge variant="error">Dibatalkan</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {queue.notes || "Dibatalkan"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Modals */}
      <QueueTakeModal
        open={isTakeModalOpen}
        onOpenChange={setIsTakeModalOpen}
        onSuccess={() => handleRefresh()}
      />

      <QueueCallModal
        open={isCallModalOpen}
        onOpenChange={setIsCallModalOpen}
        queue={selectedQueue}
        onSuccess={() => handleRefresh()}
        onRegisterPatient={() => setIsPatientModalOpen(true)}
      />

      <QueueStartModal
        open={isStartModalOpen}
        onOpenChange={setIsStartModalOpen}
        queue={selectedQueue}
        onSuccess={() => handleRefresh()}
        onRegisterPatient={() => setIsPatientModalOpen(true)}
      />

      <QueueAssignPatientModal
        open={isAssignPatientModalOpen}
        onOpenChange={setIsAssignPatientModalOpen}
        queue={selectedQueue}
        onSuccess={() => handleRefresh()}
        onRegisterPatient={() => setIsPatientModalOpen(true)}
      />

      <PatientModal
        open={isPatientModalOpen}
        onOpenChange={setIsPatientModalOpen}
        onSuccess={() => {
          setIsPatientModalOpen(false);
          // Reopen the appropriate modal if there was a selected queue
          if (selectedQueue) {
            if (isAssignPatientModalOpen) {
              setIsAssignPatientModalOpen(true);
            } else if (selectedQueue.status === "called") {
              setIsStartModalOpen(true);
            } else {
              setIsCallModalOpen(true);
            }
          }
        }}
      />
    </div>
  );
}
