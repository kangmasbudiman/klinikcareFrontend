"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  RefreshCw,
  Clock,
  CheckCircle,
  Receipt,
  TrendingUp,
  Search,
  Stethoscope,
  History,
  Pill,
  Package,
  User,
  X,
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
import { PaymentModal, ReceiptModal } from "@/components/cashier";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type {
  Invoice,
  InvoiceStats,
  PaymentStatus,
  MedicalRecord,
  Prescription,
  PrescriptionItem,
} from "@/types/medical-record";
import medicalRecordService from "@/services/medical-record.service";

// Extended type to include prescription count and prescriptions data
interface MedicalRecordWithPrescriptions extends MedicalRecord {
  prescription_items_count?: number;
  prescriptions_data?: Prescription[];
}

export default function CashierPage() {
  // State
  const [completedExaminations, setCompletedExaminations] = useState<
    MedicalRecordWithPrescriptions[]
  >([]);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Prescription Detail Modal
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<
    Prescription[]
  >([]);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");

  // Fetch completed examinations (unpaid only - for cashier queue)
  const fetchCompletedExaminations = useCallback(async () => {
    try {
      // Fetch completed examinations
      const response = await medicalRecordService.getCompletedExaminations(
        undefined,
        undefined,
        true, // unpaid_only
      );

      // Fetch prescriptions for today to get prescription counts
      const prescriptionsResponse = await medicalRecordService.getPrescriptions(
        {
          date: medicalRecordService.getTodayDateString(),
        },
      );

      // Create maps for prescription data
      const prescriptionCountMap = new Map<number, number>();
      const prescriptionDataMap = new Map<number, Prescription[]>();

      prescriptionsResponse.data.forEach((prescription: Prescription) => {
        if (prescription.medical_record_id) {
          // Count items
          const currentCount =
            prescriptionCountMap.get(prescription.medical_record_id) || 0;
          const itemsCount = prescription.items?.length || 0;
          prescriptionCountMap.set(
            prescription.medical_record_id,
            currentCount + itemsCount,
          );

          // Store prescription data
          const existingPrescriptions =
            prescriptionDataMap.get(prescription.medical_record_id) || [];
          prescriptionDataMap.set(prescription.medical_record_id, [
            ...existingPrescriptions,
            prescription,
          ]);
        }
      });

      // Merge prescription counts and data into examinations
      const examinationsWithPrescriptions = response.data.map(
        (record: MedicalRecord) => ({
          ...record,
          prescription_items_count: prescriptionCountMap.get(record.id) || 0,
          prescriptions_data: prescriptionDataMap.get(record.id) || [],
        }),
      );

      setCompletedExaminations(examinationsWithPrescriptions);
    } catch (error) {
      console.error("Error fetching completed examinations:", error);
    }
  }, []);

  // Fetch paid invoices (history)
  const fetchPaidInvoices = useCallback(async () => {
    try {
      const response = await medicalRecordService.getInvoices({
        date: medicalRecordService.getTodayDateString(),
        payment_status: "paid",
      });
      setPaidInvoices(response.data);
    } catch (error) {
      console.error("Error fetching paid invoices:", error);
    }
  }, []);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await medicalRecordService.getInvoiceStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchCompletedExaminations(),
        fetchPaidInvoices(),
        fetchStats(),
      ]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCompletedExaminations, fetchPaidInvoices, fetchStats]);

  // Auto refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCompletedExaminations();
      fetchStats();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchCompletedExaminations, fetchStats]);

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchCompletedExaminations(),
      fetchPaidInvoices(),
      fetchStats(),
    ]);
    setIsRefreshing(false);
  };

  // Handle payment from examination record
  const handlePaymentFromRecord = (record: MedicalRecord) => {
    if (record.invoice) {
      setSelectedInvoice(record.invoice);
      setIsPaymentModalOpen(true);
    }
  };

  // Handle payment from invoice
  const handlePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  // Handle view receipt
  const handleViewReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsReceiptModalOpen(true);
  };

  // Handle view prescription detail
  const handleViewPrescription = (record: MedicalRecordWithPrescriptions) => {
    if (record.prescriptions_data && record.prescriptions_data.length > 0) {
      setSelectedPrescriptions(record.prescriptions_data);
      setSelectedPatientName(record.patient?.name || "Pasien");
      setIsPrescriptionModalOpen(true);
    }
  };

  // Payment success callback
  const handlePaymentSuccess = (paidInvoice?: Invoice) => {
    setIsPaymentModalOpen(false);
    handleRefresh();

    // Tampilkan struk setelah pembayaran berhasil
    if (paidInvoice) {
      setSelectedInvoice(paidInvoice);
      setIsReceiptModalOpen(true);
    }
  };

  // Filter examinations by search
  const filteredExaminations = completedExaminations.filter(
    (record) =>
      record.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.patient?.medical_record_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      record.queue?.queue_code
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Filter paid invoices by search
  const filteredPaidInvoices = paidInvoices.filter(
    (inv) =>
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.patient?.medical_record_number
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get payment status badge
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Lunas</Badge>;
      case "partial":
        return <Badge variant="warning">Sebagian</Badge>;
      case "unpaid":
        return <Badge variant="error">Belum Bayar</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Stats cards
  const statsCards = [
    {
      title: "Menunggu Pembayaran",
      value: completedExaminations.length,
      icon: Stethoscope,
      color: "yellow",
    },
    {
      title: "Belum Bayar",
      value: stats?.unpaid || 0,
      subValue: stats?.total_unpaid ? formatCurrency(stats.total_unpaid) : "-",
      icon: Clock,
      color: "red",
    },
    {
      title: "Sudah Bayar",
      value: stats?.paid || 0,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Total Pendapatan",
      value: stats?.total_revenue ? formatCurrency(stats.total_revenue) : "-",
      icon: TrendingUp,
      color: "purple",
      isLarge: true,
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
          <h1 className="text-2xl font-bold tracking-tight">Kasir</h1>
          <p className="text-muted-foreground">Kelola pembayaran pasien</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari invoice atau pasien..."
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
                    <p
                      className={`${stat.isLarge ? "text-2xl" : "text-3xl"} font-bold mt-2`}
                    >
                      {isLoading ? "-" : stat.value}
                    </p>
                    {stat.subValue && (
                      <p className="text-sm text-muted-foreground">
                        {stat.subValue}
                      </p>
                    )}
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

      {/* Cashier Tables */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending" className="gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Menunggu Pembayaran ({completedExaminations.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <History className="h-4 w-4" />
                  Riwayat Hari Ini ({paidInvoices.length})
                </TabsTrigger>
              </TabsList>

              {/* Pending Payment - From Completed Examinations */}
              <TabsContent value="pending" className="mt-4">
                {filteredExaminations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Tidak ada pasien menunggu pembayaran</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Antrian</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Poli</TableHead>
                        <TableHead>Dokter</TableHead>
                        <TableHead className="text-center">Resep</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExaminations.map((record) => {
                        // Use pre-fetched prescription items count
                        const totalMedicines =
                          record.prescription_items_count || 0;

                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              {record.queue?.queue_code || "-"}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {record.patient?.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {record.patient?.medical_record_number}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {record.department?.name || "-"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {record.doctor?.name || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              {totalMedicines > 0 ? (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                                  onClick={() => handleViewPrescription(record)}
                                >
                                  <Pill className="h-3 w-3" />
                                  {totalMedicines} obat
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  -
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {record.invoice
                                ? formatCurrency(record.invoice.total_amount)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {record.invoice ? (
                                getStatusBadge(record.invoice.payment_status)
                              ) : (
                                <Badge variant="outline">
                                  Belum Ada Invoice
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {record.invoice ? (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handlePaymentFromRecord(record)
                                  }
                                >
                                  <Banknote className="h-4 w-4 mr-1" />
                                  Bayar
                                </Button>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  -
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>

              {/* History - Paid Invoices */}
              <TabsContent value="history" className="mt-4">
                {filteredPaidInvoices.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada transaksi hari ini</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No. Invoice</TableHead>
                        <TableHead>Pasien</TableHead>
                        <TableHead>Poli</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Metode</TableHead>
                        <TableHead>Waktu Bayar</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPaidInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">
                            {invoice.invoice_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {invoice.patient?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {invoice.patient?.medical_record_number}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {invoice.medical_record?.department?.name || "-"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(invoice.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {invoice.payment_method_label ||
                                invoice.payment_method}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {invoice.payment_date
                              ? new Date(
                                  invoice.payment_date,
                                ).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReceipt(invoice)}
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              Struk
                            </Button>
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

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        invoice={selectedInvoice}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        open={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
        invoice={selectedInvoice}
      />

      {/* Prescription Detail Modal */}
      <Dialog
        open={isPrescriptionModalOpen}
        onOpenChange={setIsPrescriptionModalOpen}
      >
        <DialogContent className="sm:max-w-[550px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-green-600" />
              Detail Resep Obat
            </DialogTitle>
            <DialogDescription>
              Resep untuk pasien: {selectedPatientName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedPrescriptions.map((prescription, pIndex) => (
              <div key={prescription.id} className="space-y-3">
                {pIndex > 0 && <Separator />}

                {/* Prescription Header */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {prescription.prescription_number || `Resep #${pIndex + 1}`}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {prescription.items?.length || 0} item
                  </Badge>
                </div>

                {/* Prescription Items */}
                <div className="space-y-2">
                  {prescription.items?.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">{item.medicine_name}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.dosage && (
                                <Badge variant="outline" className="text-xs">
                                  {item.dosage}
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
                              <p className="text-xs text-muted-foreground mt-1">
                                Aturan: {item.instructions}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 flex-shrink-0">
                          {item.quantity} pcs
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Prescription Notes */}
                {prescription.notes && (
                  <div className="p-2 bg-yellow-50 dark:bg-yellow-950/30 rounded text-sm text-yellow-800 dark:text-yellow-200">
                    <span className="font-medium">Catatan:</span>{" "}
                    {prescription.notes}
                  </div>
                )}
              </div>
            ))}

            {selectedPrescriptions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Tidak ada data resep</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
