"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import * as XLSX from "xlsx";
import {
  Search,
  Filter,
  FileSpreadsheet,
  ArrowDownCircle,
  Loader2,
  Calendar,
  Package,
  TrendingDown,
  AlertTriangle,
  Eye,
  Printer,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  medicineService,
  stockMovementService,
} from "@/services/pharmacy.service";
import { useClinicSettings } from "@/providers/clinic-settings-provider";
import type {
  PharmacyReportFilters,
  StockMovement,
  StockMovementStats,
  StockMovementReason,
  Medicine,
  StockReportSummary,
} from "@/types/pharmacy";
import { MOVEMENT_REASON_LABELS } from "@/types/pharmacy";

export default function StockOutReportPage() {
  // Clinic settings for logo and name
  const { settings: clinicSettings } = useClinicSettings();

  // State
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [summary, setSummary] = useState<StockReportSummary | null>(null);
  const [stats, setStats] = useState<StockMovementStats | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [allMovements, setAllMovements] = useState<StockMovement[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<PharmacyReportFilters>({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    medicine_id: undefined,
    reason: undefined,
    group_by: undefined,
    page: 1,
    per_page: 20,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<"detail" | "summary">("detail");
  const [summaryGroupBy, setSummaryGroupBy] = useState<
    "date" | "medicine" | "reason"
  >("reason");

  // Detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] =
    useState<StockMovement | null>(null);

  // Get movement reasons that are stock OUT
  const stockOutReasons: StockMovementReason[] = [
    "sales",
    "adjustment_minus",
    "return_supplier",
    "expired",
    "damage",
    "transfer_out",
  ];

  // Fetch data
  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockMovementService.getStockMovements({
        movement_type: "out",
        start_date: filters.start_date,
        end_date: filters.end_date,
        medicine_id: filters.medicine_id,
        reason: filters.reason,
        page: currentPage,
        per_page: filters.per_page,
      });
      setMovements(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  // Fetch all movements for export/print
  const fetchAllMovements = useCallback(async () => {
    try {
      const response = await stockMovementService.getStockMovements({
        movement_type: "out",
        start_date: filters.start_date,
        end_date: filters.end_date,
        medicine_id: filters.medicine_id,
        reason: filters.reason,
        page: 1,
        per_page: 10000,
      });
      setAllMovements(response.data);
    } catch (error) {
      console.error("Error fetching all movements:", error);
    }
  }, [
    filters.start_date,
    filters.end_date,
    filters.medicine_id,
    filters.reason,
  ]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await stockMovementService.getStockMovementStats(
        filters.start_date,
        filters.end_date,
      );
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, [filters.start_date, filters.end_date]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await stockMovementService.getSummary(
        filters.start_date,
        filters.end_date,
      );
      // Transform summary data
      const summaryData: StockReportSummary = {
        total_items: response.summary.length,
        total_quantity: response.summary.reduce(
          (acc, item) => acc + (item.total_quantity || 0),
          0,
        ),
        total_value: response.summary.reduce(
          (acc, item) => acc + (item.total_value || 0),
          0,
        ),
        by_reason: response.summary.map((item) => ({
          reason: item.reason,
          reason_label:
            MOVEMENT_REASON_LABELS[
              item.reason as keyof typeof MOVEMENT_REASON_LABELS
            ] || item.reason,
          total_quantity: item.total_quantity || 0,
          total_value: item.total_value || 0,
          transaction_count: item.count || 0,
        })),
      };
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [filters.start_date, filters.end_date]);

  const fetchMedicines = async () => {
    try {
      const response = await medicineService.getActiveMedicines({});
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    fetchMovements();
    fetchStats();
    fetchSummary();
    fetchAllMovements();
  }, [fetchMovements, fetchStats, fetchSummary, fetchAllMovements]);

  // Handlers
  const handleFilterChange = (key: keyof PharmacyReportFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    fetchMovements();
    fetchStats();
    fetchSummary();
    fetchAllMovements();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
      medicine_id: undefined,
      reason: undefined,
      group_by: undefined,
      page: 1,
      per_page: 20,
    });
    setCurrentPage(1);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (allMovements.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    setExporting(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Ringkasan
      const summaryData = [
        ["LAPORAN STOK KELUAR"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        ["RINGKASAN"],
        ["Total Stok Keluar", stats?.total_out || 0],
        ["Total Transaksi", totalItems],
        [],
        ["RINGKASAN PER ALASAN"],
        ["Alasan", "Jumlah Transaksi", "Total Qty"],
        ...(summary?.by_reason
          ?.filter((r) =>
            stockOutReasons.includes(r.reason as StockMovementReason),
          )
          .map((r) => [
            r.reason_label,
            r.transaction_count,
            r.total_quantity,
          ]) || []),
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

      // Sheet 2: Detail Transaksi
      const detailSheetData = [
        ["DETAIL STOK KELUAR"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        [
          "Tanggal",
          "No. Mutasi",
          "Kode Obat",
          "Nama Obat",
          "Batch",
          "Exp Date",
          "Alasan",
          "Qty",
          "Satuan",
          "Stok Sebelum",
          "Stok Sesudah",
          "Catatan",
          "Dibuat Oleh",
        ],
        ...allMovements.map((m) => [
          format(new Date(m.movement_date), "dd/MM/yyyy HH:mm"),
          m.movement_number,
          m.medicine?.code || "-",
          m.medicine?.name || "-",
          m.medicine_batch?.batch_number || "-",
          m.medicine_batch?.expiry_date
            ? format(new Date(m.medicine_batch.expiry_date), "dd/MM/yyyy")
            : "-",
          MOVEMENT_REASON_LABELS[m.reason] || m.reason,
          -m.quantity,
          m.unit,
          m.stock_before,
          m.stock_after,
          m.notes || "-",
          m.creator?.name || "-",
        ]),
      ];

      const detailSheet = XLSX.utils.aoa_to_sheet(detailSheetData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, "Detail Transaksi");

      // Generate filename
      const fileName = `Laporan_Stok_Keluar_${format(parseISO(filters.start_date), "yyyyMMdd")}_${format(parseISO(filters.end_date), "yyyyMMdd")}.xlsx`;

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
    if (allMovements.length === 0) {
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

      const getReasonBadgeStyle = (reason: string) => {
        switch (reason) {
          case "sales":
            return "background-color: #dbeafe; color: #1e40af;";
          case "expired":
            return "background-color: #fee2e2; color: #991b1b;";
          case "damage":
            return "background-color: #ffedd5; color: #9a3412;";
          case "return_supplier":
            return "background-color: #f3e8ff; color: #6b21a8;";
          default:
            return "background-color: #f3f4f6; color: #374151;";
        }
      };

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Stok Keluar - ${clinicName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
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
              border-bottom: 2px solid #dc2626;
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
            .clinic-info {
              flex: 1;
            }
            .clinic-name {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .clinic-address {
              font-size: 11px;
              color: #666;
            }
            .report-title {
              text-align: center;
              margin-bottom: 20px;
            }
            .report-title h1 {
              font-size: 16px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 5px;
            }
            .report-title p {
              font-size: 11px;
              color: #666;
            }
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
            .summary-card .value {
              font-size: 14px;
              font-weight: bold;
            }
            .summary-card .value.red { color: #dc2626; }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.orange { color: #ea580c; }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 13px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 5px 6px;
              text-align: left;
            }
            th {
              background-color: #fef2f2;
              font-weight: 600;
              color: #991b1b;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .text-red { color: #dc2626; }
            .font-bold { font-weight: bold; }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8px;
              font-weight: 500;
            }
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
              .no-print { display: none; }
              @page { margin: 10mm; size: landscape; }
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
            <h1>LAPORAN STOK KELUAR</h1>
            <p>Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Stok Keluar</div>
              <div class="value red">-${stats?.total_out || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Penjualan/Penyerahan</div>
              <div class="value blue">${stats?.by_reason?.find((r) => r.reason === "sales")?.total_quantity || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Kadaluarsa</div>
              <div class="value red">${stats?.by_reason?.find((r) => r.reason === "expired")?.total_quantity || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Transaksi</div>
              <div class="value orange">${totalItems}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ringkasan Per Alasan</div>
            <table>
              <thead>
                <tr>
                  <th>Alasan</th>
                  <th class="text-center">Jumlah Transaksi</th>
                  <th class="text-right">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                ${
                  summary?.by_reason
                    ?.filter((r) =>
                      stockOutReasons.includes(r.reason as StockMovementReason),
                    )
                    .map(
                      (r) => `
                        <tr>
                          <td><span class="badge" style="${getReasonBadgeStyle(r.reason)}">${r.reason_label}</span></td>
                          <td class="text-center">${r.transaction_count}</td>
                          <td class="text-right text-red font-bold">-${r.total_quantity}</td>
                        </tr>
                      `,
                    )
                    .join("") ||
                  '<tr><td colspan="3" class="text-center">Tidak ada data</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Detail Transaksi Stok Keluar</div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Mutasi</th>
                  <th>Nama Obat</th>
                  <th>Batch</th>
                  <th>Alasan</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Stok Akhir</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${
                  allMovements
                    .map(
                      (m) => `
                        <tr>
                          <td>${format(new Date(m.movement_date), "dd/MM/yyyy")}</td>
                          <td>${m.movement_number}</td>
                          <td>${m.medicine?.name || "-"}</td>
                          <td>${m.medicine_batch?.batch_number || "-"}</td>
                          <td><span class="badge" style="${getReasonBadgeStyle(m.reason)}">${MOVEMENT_REASON_LABELS[m.reason] || m.reason}</span></td>
                          <td class="text-right text-red font-bold">-${m.quantity}</td>
                          <td class="text-right">${m.stock_after}</td>
                          <td>${m.notes || "-"}</td>
                        </tr>
                      `,
                    )
                    .join("") ||
                  '<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>'
                }
              </tbody>
            </table>
          </div>

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

  const handleViewDetail = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setDetailModalOpen(true);
  };

  // Get reason badge color
  const getReasonBadgeClass = (reason: StockMovementReason) => {
    switch (reason) {
      case "sales":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "damage":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "return_supplier":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Laporan Stok Keluar
          </h1>
          <p className="text-muted-foreground">
            Laporan obat keluar berdasarkan tanggal, alasan, dan obat
          </p>
        </div>
        <div className="flex gap-2">
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
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Stok Keluar
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                -{stats?.total_out || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {format(new Date(filters.start_date), "dd MMM", {
                locale: localeId,
              })}{" "}
              -{" "}
              {format(new Date(filters.end_date), "dd MMM yyyy", {
                locale: localeId,
              })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Penjualan/Penyerahan
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats?.by_reason?.find((r) => r.reason === "sales")
                  ?.total_quantity || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Unit terjual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kadaluarsa</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {stats?.by_reason?.find((r) => r.reason === "expired")
                  ?.total_quantity || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Unit kadaluarsa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item</CardTitle>
            <Calendar className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">
                {totalItems}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Data ditemukan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filter Laporan</CardTitle>
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
            <div className="grid gap-4 md:grid-cols-4">
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
                <Label>Alasan Keluar</Label>
                <Select
                  value={filters.reason || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "reason",
                      value === "all"
                        ? undefined
                        : (value as StockMovementReason),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Alasan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Alasan</SelectItem>
                    {stockOutReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {MOVEMENT_REASON_LABELS[reason]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Obat</Label>
                <Select
                  value={filters.medicine_id?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "medicine_id",
                      value === "all" ? undefined : parseInt(value),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Obat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Obat</SelectItem>
                    {medicines.map((medicine) => (
                      <SelectItem
                        key={medicine.id}
                        value={medicine.id.toString()}
                      >
                        {medicine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilters}>
                <Search className="mr-2 h-4 w-4" />
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabs: Detail / Summary */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "detail" | "summary")}
      >
        <TabsList>
          <TabsTrigger value="detail">Detail Transaksi</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="mt-4">
          {/* Detail Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Mutasi</TableHead>
                    <TableHead>Obat</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Stok Akhir</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <ArrowDownCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Tidak ada data stok keluar pada periode ini
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {format(
                            new Date(movement.movement_date),
                            "dd MMM yyyy",
                            {
                              locale: localeId,
                            },
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {movement.movement_number}
                        </TableCell>
                        <TableCell>{movement.medicine?.name || "-"}</TableCell>
                        <TableCell>
                          {movement.medicine_batch?.batch_number || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getReasonBadgeClass(movement.reason)}
                          >
                            {MOVEMENT_REASON_LABELS[movement.reason] ||
                              movement.reason}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-medium">
                          -{movement.quantity} {movement.unit}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {movement.stock_after}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(movement)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {movements.length} dari {totalItems} data
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          {/* Summary View */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Kelompokkan Berdasarkan
                  </CardTitle>
                  <Select
                    value={summaryGroupBy}
                    onValueChange={(v) =>
                      setSummaryGroupBy(v as "date" | "medicine" | "reason")
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Tanggal</SelectItem>
                      <SelectItem value="reason">Alasan</SelectItem>
                      <SelectItem value="medicine">Obat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
            </Card>

            {/* Summary by Reason */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Ringkasan Berdasarkan Alasan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alasan</TableHead>
                      <TableHead className="text-right">
                        Jumlah Transaksi
                      </TableHead>
                      <TableHead className="text-right">Total Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summary?.by_reason
                      ?.filter((r) =>
                        stockOutReasons.includes(
                          r.reason as StockMovementReason,
                        ),
                      )
                      .map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Badge
                              className={getReasonBadgeClass(
                                item.reason as StockMovementReason,
                              )}
                            >
                              {item.reason_label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.transaction_count}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            -{item.total_quantity}
                          </TableCell>
                        </TableRow>
                      ))}
                    {(!summary?.by_reason ||
                      summary.by_reason.filter((r) =>
                        stockOutReasons.includes(
                          r.reason as StockMovementReason,
                        ),
                      ).length === 0) && (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-4 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Total Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Keseluruhan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Qty Keluar
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      -
                      {summary?.by_reason
                        ?.filter((r) =>
                          stockOutReasons.includes(
                            r.reason as StockMovementReason,
                          ),
                        )
                        .reduce((acc, r) => acc + r.total_quantity, 0) || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Transaksi
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary?.by_reason
                        ?.filter((r) =>
                          stockOutReasons.includes(
                            r.reason as StockMovementReason,
                          ),
                        )
                        .reduce((acc, r) => acc + r.transaction_count, 0) || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Kategori Alasan
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {summary?.by_reason?.filter((r) =>
                        stockOutReasons.includes(
                          r.reason as StockMovementReason,
                        ),
                      ).length || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Stok Keluar</DialogTitle>
            <DialogDescription>
              {selectedMovement?.movement_number}
            </DialogDescription>
          </DialogHeader>

          {selectedMovement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Obat</p>
                  <p className="font-medium">
                    {selectedMovement.medicine?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">
                    {selectedMovement.medicine_batch?.batch_number || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedMovement.movement_date),
                      "dd MMMM yyyy HH:mm",
                      {
                        locale: localeId,
                      },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipe</p>
                  <Badge className="bg-red-100 text-red-800">
                    <ArrowDownCircle className="mr-1 h-3 w-3" />
                    Keluar
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alasan</p>
                  <Badge
                    className={getReasonBadgeClass(selectedMovement.reason)}
                  >
                    {MOVEMENT_REASON_LABELS[selectedMovement.reason] ||
                      selectedMovement.reason}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah</p>
                  <p className="font-medium text-red-600">
                    -{selectedMovement.quantity} {selectedMovement.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok Sebelum</p>
                  <p className="font-medium">{selectedMovement.stock_before}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok Sesudah</p>
                  <p className="font-medium">{selectedMovement.stock_after}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                  <p className="font-medium">
                    {selectedMovement.creator?.name || "-"}
                  </p>
                </div>
                {selectedMovement.reference_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Referensi</p>
                    <p className="font-medium">
                      {selectedMovement.reference_type} #
                      {selectedMovement.reference_id}
                    </p>
                  </div>
                )}
              </div>
              {selectedMovement.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium">{selectedMovement.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
