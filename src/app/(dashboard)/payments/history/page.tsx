"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import * as XLSX from "xlsx";
import {
  Search,
  Filter,
  FileSpreadsheet,
  Loader2,
  Receipt,
  TrendingUp,
  CreditCard,
  Banknote,
  RefreshCw,
  Printer,
  Calendar,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ReceiptModal, PaymentModal } from "@/components/cashier";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

import medicalRecordService from "@/services/medical-record.service";
import type {
  Invoice,
  InvoiceStats,
  PaymentMethod,
  PaymentStatus,
} from "@/types/medical-record";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/types/medical-record";

interface Filters {
  start_date: string;
  end_date: string;
  payment_status: PaymentStatus | "";
  payment_method: PaymentMethod | "";
  search: string;
  page: number;
  per_page: number;
}

export default function PaymentsHistoryPage() {
  // Clinic settings for print
  const { settings: clinicSettings } = useClinicSettings();

  // State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    payment_status: "",
    payment_method: "",
    search: "",
    page: 1,
    per_page: 15,
  });
  const [showFilters, setShowFilters] = useState(true);

  // Receipt Modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await medicalRecordService.getInvoices({
        start_date: filters.start_date,
        end_date: filters.end_date,
        payment_status: filters.payment_status || undefined,
        payment_method: filters.payment_method || undefined,
        search: filters.search || undefined,
        page: filters.page,
        per_page: filters.per_page,
      });

      setInvoices(response.data);
      if (response.meta) {
        setTotalPages(response.meta.last_page);
        setTotalItems(response.meta.total);
        setCurrentPage(response.meta.current_page);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await medicalRecordService.getInvoiceStats({
        start_date: filters.start_date,
        end_date: filters.end_date,
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, [filters.start_date, filters.end_date]);

  // Initial load
  useEffect(() => {
    fetchInvoices();
    fetchStats();
  }, [fetchInvoices, fetchStats]);

  // Handle filter change
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices();
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
      payment_status: "",
      payment_method: "",
      search: "",
      page: 1,
      per_page: 15,
    });
  };

  // View receipt
  const handleViewReceipt = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsReceiptModalOpen(true);
  };

  // Handle payment
  const handlePayment = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  // Payment success callback
  const handlePaymentSuccess = (paidInvoice?: Invoice) => {
    setIsPaymentModalOpen(false);
    fetchInvoices();
    fetchStats();

    if (paidInvoice) {
      setSelectedInvoice(paidInvoice);
      setIsReceiptModalOpen(true);
    }
  };

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

  // Get payment method badge
  const getMethodBadge = (method: PaymentMethod) => {
    const colors: Record<PaymentMethod, string> = {
      cash: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      card: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      transfer:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      bpjs: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
      insurance:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };

    return (
      <Badge className={colors[method]}>
        {PAYMENT_METHOD_LABELS[method] || method}
      </Badge>
    );
  };

  // Export to Excel
  const handleExportExcel = async () => {
    if (invoices.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    setExporting(true);

    try {
      // Fetch all data for export (without pagination)
      const response = await medicalRecordService.getInvoices({
        date: filters.start_date,
        payment_status: filters.payment_status || undefined,
        search: filters.search || undefined,
        page: 1,
        per_page: 10000, // Get all data
      });

      const allInvoices = response.data;

      const workbook = XLSX.utils.book_new();

      // Sheet 1: Ringkasan
      const summaryData = [
        ["LAPORAN RIWAYAT TRANSAKSI"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        ["RINGKASAN"],
        ["Total Transaksi", stats?.total || 0],
        ["Sudah Bayar", stats?.paid || 0],
        ["Belum Bayar", stats?.unpaid || 0],
        ["Total Pendapatan", stats?.total_revenue || 0],
        ["Total Belum Dibayar", stats?.total_unpaid || 0],
        [],
        ["BREAKDOWN PER METODE PEMBAYARAN"],
        ["Metode", "Jumlah Transaksi", "Total Nilai"],
        ...(stats?.payment_by_method.map((m) => [
          PAYMENT_METHOD_LABELS[m.payment_method] || m.payment_method,
          m.count,
          m.total,
        ]) || []),
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

      // Sheet 2: Detail Transaksi
      const detailData = [
        ["DETAIL TRANSAKSI"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        [
          "No. Invoice",
          "Tanggal",
          "Nama Pasien",
          "No. RM",
          "Poli",
          "Total",
          "Dibayar",
          "Kembalian",
          "Metode",
          "Status",
          "Kasir",
        ],
        ...allInvoices.map((inv) => [
          inv.invoice_number,
          inv.payment_date
            ? format(new Date(inv.payment_date), "dd/MM/yyyy HH:mm")
            : format(new Date(inv.created_at), "dd/MM/yyyy HH:mm"),
          inv.patient?.name || "-",
          inv.patient?.medical_record_number || "-",
          inv.medical_record?.department?.name || "-",
          inv.total_amount,
          inv.paid_amount,
          inv.change_amount,
          PAYMENT_METHOD_LABELS[inv.payment_method] || inv.payment_method,
          PAYMENT_STATUS_LABELS[inv.payment_status] || inv.payment_status,
          inv.cashier?.name || "-",
        ]),
      ];

      const detailSheet = XLSX.utils.aoa_to_sheet(detailData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, "Detail Transaksi");

      // Generate filename
      const fileName = `Riwayat_Transaksi_${format(parseISO(filters.start_date), "yyyyMMdd")}_${format(parseISO(filters.end_date), "yyyyMMdd")}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export Excel berhasil!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Gagal export Excel");
    } finally {
      setExporting(false);
    }
  };

  // Print function
  const handlePrint = () => {
    if (invoices.length === 0) {
      toast.error("Tidak ada data untuk dicetak");
      return;
    }

    setPrinting(true);

    try {
      const clinicName = clinicSettings?.name || "Klinik App";
      const clinicAddress = clinicSettings?.address || "";
      const clinicPhone = clinicSettings?.phone || "";
      const clinicLogo = clinicSettings?.logo_url || "";

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup diblokir. Izinkan popup untuk mencetak.");
        setPrinting(false);
        return;
      }

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Riwayat Transaksi - ${clinicName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #333;
              padding: 15px;
            }
            .header {
              display: flex;
              align-items: center;
              gap: 15px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
            }
            .logo-placeholder {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .clinic-info { flex: 1; }
            .clinic-name {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .clinic-address { font-size: 11px; color: #666; }
            .report-title {
              text-align: center;
              margin-bottom: 20px;
            }
            .report-title h1 {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .report-title p { font-size: 11px; color: #666; }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 20px;
            }
            .summary-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
              text-align: center;
            }
            .summary-card .label {
              font-size: 10px;
              color: #666;
              margin-bottom: 5px;
            }
            .summary-card .value { font-size: 14px; font-weight: bold; }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.green { color: #16a34a; }
            .summary-card .value.red { color: #dc2626; }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 15px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #374151;
            }
            tr:nth-child(even) { background-color: #f9fafb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .badge {
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: 500;
            }
            .badge-success { background: #dcfce7; color: #166534; }
            .badge-warning { background: #fef3c7; color: #92400e; }
            .badge-error { background: #fee2e2; color: #991b1b; }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { padding: 0; }
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              clinicLogo
                ? `<img src="${clinicLogo}" alt="${clinicName}" class="logo" />`
                : `<div class="logo-placeholder">+</div>`
            }
            <div class="clinic-info">
              <div class="clinic-name">${clinicName}</div>
              <div class="clinic-address">
                ${clinicAddress ? clinicAddress + "<br/>" : ""}
                ${clinicPhone ? "Telp: " + clinicPhone : ""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN RIWAYAT TRANSAKSI</h1>
            <p>Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Transaksi</div>
              <div class="value blue">${stats?.total || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Sudah Bayar</div>
              <div class="value green">${stats?.paid || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Belum Bayar</div>
              <div class="value red">${stats?.unpaid || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pendapatan</div>
              <div class="value green">${formatCurrency(stats?.total_revenue || 0)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Tanggal</th>
                <th>Pasien</th>
                <th>Poli</th>
                <th class="text-right">Total</th>
                <th class="text-right">Dibayar</th>
                <th class="text-center">Metode</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${invoices
                .map(
                  (inv) => `
                <tr>
                  <td>${inv.invoice_number}</td>
                  <td>${inv.payment_date ? format(new Date(inv.payment_date), "dd/MM/yyyy HH:mm") : format(new Date(inv.created_at), "dd/MM/yyyy HH:mm")}</td>
                  <td>
                    ${inv.patient?.name || "-"}<br/>
                    <small style="color: #666;">${inv.patient?.medical_record_number || ""}</small>
                  </td>
                  <td>${inv.medical_record?.department?.name || "-"}</td>
                  <td class="text-right">${formatCurrency(inv.total_amount)}</td>
                  <td class="text-right">${formatCurrency(inv.paid_amount)}</td>
                  <td class="text-center">${PAYMENT_METHOD_LABELS[inv.payment_method] || inv.payment_method}</td>
                  <td class="text-center">
                    <span class="badge ${inv.payment_status === "paid" ? "badge-success" : inv.payment_status === "partial" ? "badge-warning" : "badge-error"}">
                      ${PAYMENT_STATUS_LABELS[inv.payment_status] || inv.payment_status}
                    </span>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: localeId })}</div>
            <div>${clinicName}</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      toast.success("Menyiapkan halaman cetak...");
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Gagal mencetak");
    } finally {
      setPrinting(false);
    }
  };

  // Stats cards
  const statsCards = [
    {
      title: "Total Transaksi",
      value: stats?.total || 0,
      icon: Receipt,
      color: "blue",
    },
    {
      title: "Sudah Bayar",
      value: stats?.paid || 0,
      icon: CreditCard,
      color: "green",
    },
    {
      title: "Belum Bayar",
      value: stats?.unpaid || 0,
      subValue: stats?.total_unpaid ? formatCurrency(stats.total_unpaid) : "-",
      icon: Wallet,
      color: "red",
    },
    {
      title: "Total Pendapatan",
      value: stats?.total_revenue ? formatCurrency(stats.total_revenue) : "-",
      icon: TrendingUp,
      color: "green",
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
          <h1 className="text-2xl font-bold tracking-tight">
            Riwayat Transaksi
          </h1>
          <p className="text-muted-foreground">
            Lihat dan kelola riwayat pembayaran pasien
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={printing || loading}
          >
            {printing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            Print
          </Button>
          <Button onClick={handleExportExcel} disabled={exporting || loading}>
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Export Excel
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
                      {loading ? "-" : stat.value}
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

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filter</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Sembunyikan" : "Tampilkan"}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <form onSubmit={handleSearch}>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>Tanggal Mulai</Label>
                  <Input
                    type="date"
                    value={filters.start_date}
                    onChange={(e) =>
                      handleFilterChange("start_date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal Akhir</Label>
                  <Input
                    type="date"
                    value={filters.end_date}
                    onChange={(e) =>
                      handleFilterChange("end_date", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status Pembayaran</Label>
                  <Select
                    value={filters.payment_status}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "payment_status",
                        value === "all" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="paid">Lunas</SelectItem>
                      <SelectItem value="partial">Sebagian</SelectItem>
                      <SelectItem value="unpaid">Belum Bayar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Metode Pembayaran</Label>
                  <Select
                    value={filters.payment_method}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "payment_method",
                        value === "all" ? "" : value,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Metode</SelectItem>
                      <SelectItem value="cash">Tunai</SelectItem>
                      <SelectItem value="card">Kartu</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="bpjs">BPJS</SelectItem>
                      <SelectItem value="insurance">Asuransi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pencarian</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="No. Invoice / Nama Pasien"
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Terapkan Filter
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Transaction Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Daftar Transaksi</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {totalItems} transaksi ditemukan
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    fetchInvoices();
                    fetchStats();
                  }}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Tidak ada transaksi ditemukan</p>
                <p className="text-sm">Coba ubah filter pencarian</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Invoice</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Poli</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Dibayar</TableHead>
                      <TableHead>Metode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoice_number}
                        </TableCell>
                        <TableCell className="text-sm">
                          {invoice.payment_date
                            ? format(
                                new Date(invoice.payment_date),
                                "dd/MM/yyyy HH:mm",
                              )
                            : format(
                                new Date(invoice.created_at),
                                "dd/MM/yyyy HH:mm",
                              )}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {invoice.patient?.name || "-"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {invoice.patient?.medical_record_number || "-"}
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
                        <TableCell className="text-right">
                          {formatCurrency(invoice.paid_amount)}
                        </TableCell>
                        <TableCell>
                          {getMethodBadge(invoice.payment_method)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(invoice.payment_status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {invoice.payment_status !== "paid" && (
                              <Button
                                size="sm"
                                onClick={() => handlePayment(invoice)}
                              >
                                <Banknote className="h-4 w-4 mr-1" />
                                Bayar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewReceipt(invoice)}
                            >
                              <Receipt className="h-4 w-4 mr-1" />
                              Struk
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      Halaman {currentPage} dari {totalPages}
                    </p>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        invoice={paymentInvoice}
        onSuccess={handlePaymentSuccess}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        open={isReceiptModalOpen}
        onOpenChange={setIsReceiptModalOpen}
        invoice={selectedInvoice}
      />
    </div>
  );
}
