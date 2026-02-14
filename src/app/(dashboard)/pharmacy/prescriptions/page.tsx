"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Pill,
  RefreshCw,
  Clock,
  CheckCircle,
  Search,
  Package,
  User,
  Calendar,
  Eye,
  PlayCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Prescription, PrescriptionStatus } from "@/types/medical-record";
import medicalRecordService from "@/services/medical-record.service";
import { toast } from "sonner";

export default function PharmacyPrescriptionsPage() {
  // State
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<PrescriptionStatus | "all">(
    "pending",
  );

  // Detail Modal
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch prescriptions
  const fetchPrescriptions = useCallback(async () => {
    try {
      const response = await medicalRecordService.getPrescriptions({
        date: medicalRecordService.getTodayDateString(),
        status: activeTab !== "all" ? activeTab : undefined,
      });
      setPrescriptions(response.data);
    } catch (error) {
      console.error("Error fetching prescriptions:", error);
      toast.error("Gagal memuat data resep");
    }
  }, [activeTab]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPrescriptions();
      setIsLoading(false);
    };
    loadData();
  }, [fetchPrescriptions]);

  // Auto refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrescriptions();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchPrescriptions]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPrescriptions();
    setIsRefreshing(false);
  };

  // View prescription detail
  const handleViewDetail = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailModalOpen(true);
  };

  // Update prescription status
  const handleUpdateStatus = async (id: number, status: PrescriptionStatus) => {
    setIsProcessing(true);
    try {
      await medicalRecordService.updatePrescriptionStatus(id, status);

      const statusLabels: Record<PrescriptionStatus, string> = {
        pending: "Menunggu",
        processed: "Diproses",
        completed: "Selesai",
        cancelled: "Dibatalkan",
      };

      toast.success(`Status resep diubah menjadi "${statusLabels[status]}"`);
      await fetchPrescriptions();
      setIsDetailModalOpen(false);
    } catch (error: any) {
      console.error("Error updating prescription status:", error);
      toast.error("Gagal mengubah status resep", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter prescriptions by search
  const filteredPrescriptions = prescriptions.filter(
    (p) =>
      p.prescription_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.medical_record?.patient?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      p.medical_record?.patient?.medical_record_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Get status badge
  const getStatusBadge = (status: PrescriptionStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" /> Menunggu
          </Badge>
        );
      case "processed":
        return (
          <Badge variant="info" className="gap-1">
            <PlayCircle className="h-3 w-3" /> Diproses
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" /> Selesai
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="error" className="gap-1">
            <XCircle className="h-3 w-3" /> Dibatalkan
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Stats counts
  const pendingCount = prescriptions.filter(
    (p) => p.status === "pending",
  ).length;
  const processedCount = prescriptions.filter(
    (p) => p.status === "processed",
  ).length;
  const completedCount = prescriptions.filter(
    (p) => p.status === "completed",
  ).length;

  // Stats cards
  const statsCards = [
    {
      title: "Menunggu",
      value: pendingCount,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Sedang Diproses",
      value: processedCount,
      icon: PlayCircle,
      color: "blue",
    },
    {
      title: "Selesai Hari Ini",
      value: completedCount,
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
            Dispensing Resep
          </h1>
          <p className="text-muted-foreground">
            Kelola dan proses resep obat dari dokter
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari resep atau pasien..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[250px]"
            />
          </div>
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

      {/* Prescriptions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Daftar Resep
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(v) =>
                setActiveTab(v as PrescriptionStatus | "all")
              }
            >
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Menunggu ({pendingCount})
                </TabsTrigger>
                <TabsTrigger value="processed" className="gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Diproses ({processedCount})
                </TabsTrigger>
                <TabsTrigger value="completed" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Selesai ({completedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-3" />
                    <p>Memuat data...</p>
                  </div>
                ) : filteredPrescriptions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>
                      Tidak ada resep{" "}
                      {activeTab === "pending"
                        ? "menunggu"
                        : activeTab === "processed"
                          ? "diproses"
                          : "selesai"}
                    </p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Resep</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead>Jumlah Item</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPrescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell className="font-medium">
                            {prescription.prescription_number || `-`}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {prescription.medical_record?.patient?.name ||
                                  "-"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {prescription.medical_record?.patient
                                  ?.medical_record_number || "-"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {prescription.medical_record?.doctor?.name || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {prescription.items?.length || 0} obat
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(prescription.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(
                              prescription.created_at,
                            ).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetail(prescription)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Detail
                              </Button>
                              {prescription.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      prescription.id,
                                      "processed",
                                    )
                                  }
                                >
                                  <PlayCircle className="h-4 w-4 mr-1" />
                                  Proses
                                </Button>
                              )}
                              {prescription.status === "processed" && (
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                                  onClick={() =>
                                    handleUpdateStatus(
                                      prescription.id,
                                      "completed",
                                    )
                                  }
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Selesai
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Detail Resep
            </DialogTitle>
            <DialogDescription>
              {selectedPrescription?.prescription_number || "Resep Obat"}
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-4">
              {/* Patient & Doctor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Pasien
                  </div>
                  <p className="font-semibold">
                    {selectedPrescription.medical_record?.patient?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {
                      selectedPrescription.medical_record?.patient
                        ?.medical_record_number
                    }
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Tanggal & Dokter
                  </div>
                  <p className="font-semibold">
                    {new Date(
                      selectedPrescription.created_at,
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPrescription.medical_record?.doctor?.name}
                  </p>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge(selectedPrescription.status)}
              </div>

              <Separator />

              {/* Prescription Items */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Daftar Obat ({selectedPrescription.items?.length || 0} item)
                </h4>
                <div className="space-y-3">
                  {selectedPrescription.items?.map((item, index) => (
                    <div key={item.id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{item.medicine_name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.dosage && (
                              <Badge variant="outline" className="text-xs">
                                Dosis: {item.dosage}
                              </Badge>
                            )}
                            {item.frequency && (
                              <Badge variant="outline" className="text-xs">
                                {item.frequency}
                              </Badge>
                            )}
                            {item.duration && (
                              <Badge variant="outline" className="text-xs">
                                {item.duration}
                              </Badge>
                            )}
                          </div>
                          {item.instructions && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Aturan: {item.instructions}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                            {item.quantity} pcs
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {selectedPrescription.notes && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Catatan Dokter
                    </h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {selectedPrescription.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
              disabled={isProcessing}
            >
              Tutup
            </Button>

            {selectedPrescription?.status === "pending" && (
              <Button
                onClick={() =>
                  handleUpdateStatus(selectedPrescription.id, "processed")
                }
                disabled={isProcessing}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Mulai Proses
              </Button>
            )}

            {selectedPrescription?.status === "processed" && (
              <Button
                className="bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                onClick={() =>
                  handleUpdateStatus(selectedPrescription.id, "completed")
                }
                disabled={isProcessing}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Tandai Selesai
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
