"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { format, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import * as XLSX from "xlsx";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Search,
  Filter,
  FileSpreadsheet,
  Loader2,
  Printer,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Stethoscope,
  Building2,
  BarChart3,
  RefreshCw,
  DollarSign,
  UserCheck,
  Banknote,
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import reportService from "@/services/report.service";
import departmentService from "@/services/department.service";
import { useClinicSettings } from "@/providers/clinic-settings-provider";
import type {
  ReportFilters,
  ReportSummary,
  VisitReportData,
  RevenueReportData,
  DiagnosisReportItem,
  DoctorReportItem,
  DepartmentReportItem,
} from "@/types/report";
import type { Department } from "@/types/department";

// Chart colors
const CHART_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}:{" "}
            {typeof entry.value === "number" && entry.value > 10000
              ? formatCurrency(entry.value)
              : entry.value?.toLocaleString("id-ID")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function ReportsPage() {
  const { settings: clinicSettings } = useClinicSettings();

  // State
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [visitData, setVisitData] = useState<VisitReportData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueReportData | null>(
    null
  );
  const [diagnosisData, setDiagnosisData] = useState<DiagnosisReportItem[]>([]);
  const [doctorData, setDoctorData] = useState<DoctorReportItem[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentReportItem[]>(
    []
  );
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("kunjungan");
  const [filters, setFilters] = useState<ReportFilters>({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    department_id: "",
  });
  const [showFilters, setShowFilters] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Fetch all report data
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [
        summaryRes,
        visitRes,
        revenueRes,
        diagnosisRes,
        doctorRes,
        departmentRes,
      ] = await Promise.all([
        reportService.getSummary(filters),
        reportService.getVisitReport(filters),
        reportService.getRevenueReport(filters),
        reportService.getDiagnosisReport(filters),
        reportService.getDoctorReport(filters),
        reportService.getDepartmentReport(filters),
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (visitRes.success) setVisitData(visitRes.data);
      if (revenueRes.success) setRevenueData(revenueRes.data);
      if (diagnosisRes.success) setDiagnosisData(diagnosisRes.data);
      if (doctorRes.success) setDoctorData(doctorRes.data);
      if (departmentRes.success) setDepartmentData(departmentRes.data);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch departments for filter dropdown
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getActiveDepartments();
      if (response.success) {
        setDepartments(response.data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Filter handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchAll();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
      department_id: "",
    });
  };

  // Export Excel
  const handleExportExcel = () => {
    if (!summary) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    setExporting(true);

    try {
      const workbook = XLSX.utils.book_new();
      const periodLabel = `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`;

      // Sheet 1: Ringkasan
      const summarySheetData = [
        ["LAPORAN KLINIK"],
        [periodLabel],
        [],
        ["RINGKASAN"],
        ["Total Kunjungan", summary.total_visits],
        ["Total Pendapatan", summary.total_revenue],
        ["Pasien Baru", summary.total_new_patients],
        ["Pasien Unik", summary.total_unique_patients],
        ["Rata-rata Pendapatan/Kunjungan", summary.avg_revenue_per_visit],
        ["Perubahan Kunjungan (%)", summary.visits_change_percent],
        ["Perubahan Pendapatan (%)", summary.revenue_change_percent],
        ["Perubahan Pasien Baru (%)", summary.new_patients_change_percent],
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summarySheetData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

      // Sheet 2: Kunjungan
      const visitSheetData = [
        ["LAPORAN KUNJUNGAN"],
        [periodLabel],
        [],
        ["Tanggal", "Total Kunjungan", "Pasien Baru", "Pasien Lama"],
        ...(visitData?.by_date.map((item) => [
          format(parseISO(item.date), "dd MMMM yyyy", { locale: localeId }),
          item.total,
          item.new_patients,
          item.returning_patients,
        ]) || []),
        [],
        ["KUNJUNGAN PER POLI"],
        ["Poli", "Jumlah Kunjungan"],
        ...(visitData?.by_department.map((item) => [
          item.department_name,
          item.total,
        ]) || []),
        [],
        ["KUNJUNGAN PER DOKTER"],
        ["Dokter", "Jumlah Kunjungan"],
        ...(visitData?.by_doctor.map((item) => [
          item.doctor_name,
          item.total,
        ]) || []),
      ];

      const visitSheet = XLSX.utils.aoa_to_sheet(visitSheetData);
      XLSX.utils.book_append_sheet(workbook, visitSheet, "Kunjungan");

      // Sheet 3: Pendapatan
      const revenueSheetData = [
        ["LAPORAN PENDAPATAN"],
        [periodLabel],
        [],
        ["Tanggal", "Total Pendapatan", "Terbayar", "Jumlah Transaksi"],
        ...(revenueData?.by_date.map((item) => [
          format(parseISO(item.date), "dd MMMM yyyy", { locale: localeId }),
          item.total_amount,
          item.paid_amount,
          item.count,
        ]) || []),
        [],
        ["PENDAPATAN PER METODE PEMBAYARAN"],
        ["Metode", "Jumlah Transaksi", "Total Pendapatan"],
        ...(revenueData?.by_payment_method.map((item) => [
          item.label,
          item.count,
          item.total_amount,
        ]) || []),
        [],
        ["PENDAPATAN PER POLI"],
        ["Poli", "Jumlah Transaksi", "Total Pendapatan"],
        ...(revenueData?.by_department.map((item) => [
          item.department_name,
          item.count,
          item.total_amount,
        ]) || []),
      ];

      const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData);
      XLSX.utils.book_append_sheet(workbook, revenueSheet, "Pendapatan");

      // Sheet 4: Diagnosa
      const diagnosisSheetData = [
        ["LAPORAN DIAGNOSA"],
        [periodLabel],
        [],
        ["Kode ICD", "Nama Diagnosa", "Jumlah", "Persentase (%)"],
        ...diagnosisData.map((item) => [
          item.icd_code,
          item.icd_name,
          item.count,
          item.percentage.toFixed(1),
        ]),
      ];

      const diagnosisSheet = XLSX.utils.aoa_to_sheet(diagnosisSheetData);
      XLSX.utils.book_append_sheet(workbook, diagnosisSheet, "Diagnosa");

      // Sheet 5: Per Dokter
      const doctorSheetData = [
        ["LAPORAN PER DOKTER"],
        [periodLabel],
        [],
        [
          "Dokter",
          "Poli",
          "Total Pasien",
          "Total Pendapatan",
          "Rata-rata/Kunjungan",
          "Selesai",
          "Batal",
        ],
        ...doctorData.map((item) => [
          item.doctor_name,
          item.department_name,
          item.total_patients,
          item.total_revenue,
          item.avg_revenue_per_visit,
          item.completed_records,
          item.cancelled_records,
        ]),
      ];

      const doctorSheet = XLSX.utils.aoa_to_sheet(doctorSheetData);
      XLSX.utils.book_append_sheet(workbook, doctorSheet, "Per Dokter");

      // Generate filename
      const fileName = `Laporan_Klinik_${format(parseISO(filters.start_date), "yyyyMMdd")}_${format(parseISO(filters.end_date), "yyyyMMdd")}.xlsx`;

      XLSX.writeFile(workbook, fileName);
      toast.success("Export Excel berhasil!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Gagal export Excel");
    } finally {
      setExporting(false);
    }
  };

  // Print
  const handlePrint = () => {
    if (!summary) {
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
          <title>Laporan Klinik - ${clinicName}</title>
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
            .summary-card .value {
              font-size: 14px;
              font-weight: bold;
            }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.green { color: #16a34a; }
            .summary-card .value.purple { color: #9333ea; }
            .summary-card .value.orange { color: #ea580c; }
            .section { margin-bottom: 20px; }
            .section-title {
              font-size: 13px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
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
            .text-green { color: #16a34a; }
            .text-blue { color: #2563eb; }
            .font-bold { font-weight: bold; }
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
            <h1>LAPORAN KLINIK</h1>
            <p>Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Kunjungan</div>
              <div class="value blue">${summary.total_visits.toLocaleString("id-ID")}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pendapatan</div>
              <div class="value green">${formatCurrency(summary.total_revenue)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Pasien Baru</div>
              <div class="value purple">${summary.total_new_patients.toLocaleString("id-ID")}</div>
            </div>
            <div class="summary-card">
              <div class="label">Rata-rata/Kunjungan</div>
              <div class="value orange">${formatCurrency(summary.avg_revenue_per_visit)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Kunjungan Harian</div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th class="text-right">Kunjungan</th>
                  <th class="text-right">Pasien Baru</th>
                  <th class="text-right">Pasien Lama</th>
                </tr>
              </thead>
              <tbody>
                ${
                  visitData?.by_date
                    .map(
                      (item) => `
                    <tr>
                      <td>${format(parseISO(item.date), "dd MMM yyyy", { locale: localeId })}</td>
                      <td class="text-right">${item.total}</td>
                      <td class="text-right">${item.new_patients}</td>
                      <td class="text-right">${item.returning_patients}</td>
                    </tr>
                  `
                    )
                    .join("") ||
                  '<tr><td colspan="4" class="text-center">Tidak ada data</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Pendapatan Per Metode Pembayaran</div>
            <table>
              <thead>
                <tr>
                  <th>Metode</th>
                  <th class="text-right">Jumlah Transaksi</th>
                  <th class="text-right">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                ${
                  revenueData?.by_payment_method
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.label}</td>
                      <td class="text-right">${item.count}</td>
                      <td class="text-right text-green font-bold">${formatCurrency(item.total_amount)}</td>
                    </tr>
                  `
                    )
                    .join("") ||
                  '<tr><td colspan="3" class="text-center">Tidak ada data</td></tr>'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Laporan Klinik</h1>
          <p className="text-muted-foreground">
            Analisis kunjungan, pendapatan, dan kinerja klinik
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
      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Kunjungan */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Kunjungan
              </CardTitle>
              <div className="rounded-md bg-blue-100 p-2 dark:bg-blue-900">
                <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {summary?.total_visits.toLocaleString("id-ID") || 0}
                  </div>
                  {summary && (
                    <div className="flex items-center gap-1 mt-1">
                      {summary.visits_change_percent >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          summary.visits_change_percent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {summary.visits_change_percent >= 0 ? "+" : ""}
                        {summary.visits_change_percent.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        dari periode lalu
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Pendapatan */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Pendapatan
              </CardTitle>
              <div className="rounded-md bg-green-100 p-2 dark:bg-green-900">
                <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatCurrency(summary?.total_revenue || 0)}
                  </div>
                  {summary && (
                    <div className="flex items-center gap-1 mt-1">
                      {summary.revenue_change_percent >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          summary.revenue_change_percent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {summary.revenue_change_percent >= 0 ? "+" : ""}
                        {summary.revenue_change_percent.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        dari periode lalu
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pasien Baru */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pasien Baru
              </CardTitle>
              <div className="rounded-md bg-purple-100 p-2 dark:bg-purple-900">
                <UserCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {summary?.total_new_patients.toLocaleString("id-ID") || 0}
                  </div>
                  {summary && (
                    <div className="flex items-center gap-1 mt-1">
                      {summary.new_patients_change_percent >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          summary.new_patients_change_percent >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {summary.new_patients_change_percent >= 0 ? "+" : ""}
                        {summary.new_patients_change_percent.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        dari periode lalu
                      </span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Rata-rata/Kunjungan */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata/Kunjungan
              </CardTitle>
              <div className="rounded-md bg-orange-100 p-2 dark:bg-orange-900">
                <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-28" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatCurrency(summary?.avg_revenue_per_visit || 0)}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

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
            <div className="grid gap-4 md:grid-cols-3">
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
                <Label>Poli</Label>
                <Select
                  value={
                    filters.department_id
                      ? filters.department_id.toString()
                      : "all"
                  }
                  onValueChange={(value) =>
                    handleFilterChange(
                      "department_id",
                      value === "all" ? "" : parseInt(value)
                    )
                  }
                >
                  <SelectTrigger>
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
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilters}>
                <Search className="mr-2 h-4 w-4" />
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="kunjungan">
            <Activity className="mr-2 h-4 w-4" />
            Kunjungan
          </TabsTrigger>
          <TabsTrigger value="pendapatan">
            <Banknote className="mr-2 h-4 w-4" />
            Pendapatan
          </TabsTrigger>
          <TabsTrigger value="diagnosa">
            <Stethoscope className="mr-2 h-4 w-4" />
            Diagnosa
          </TabsTrigger>
          <TabsTrigger value="dokter">
            <Users className="mr-2 h-4 w-4" />
            Per Dokter
          </TabsTrigger>
          <TabsTrigger value="poli">
            <Building2 className="mr-2 h-4 w-4" />
            Per Poli
          </TabsTrigger>
        </TabsList>

        {/* Tab: Kunjungan */}
        <TabsContent value="kunjungan" className="mt-4 space-y-4">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Tren Kunjungan Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : visitData && visitData.by_date.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                      data={visitData.by_date.map((item) => ({
                        date: format(parseISO(item.date), "dd MMM", {
                          locale: localeId,
                        }),
                        Kunjungan: item.total,
                        "Pasien Baru": item.new_patients,
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorKunjungan"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPasienBaru"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Kunjungan"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorKunjungan)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Pasien Baru"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPasienBaru)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                    <Activity className="h-12 w-12 mb-4 opacity-30" />
                    <p>Tidak ada data kunjungan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Kunjungan Per Poli */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Kunjungan Per Poli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poli</TableHead>
                      <TableHead className="text-right">
                        Jumlah Kunjungan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={2}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : visitData &&
                      visitData.by_department.length > 0 ? (
                      visitData.by_department.map((item) => (
                        <TableRow key={item.department_id}>
                          <TableCell className="font-medium">
                            {item.department_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.total.toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Kunjungan Per Dokter */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Kunjungan Per Dokter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dokter</TableHead>
                      <TableHead className="text-right">
                        Jumlah Kunjungan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={2}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : visitData && visitData.by_doctor.length > 0 ? (
                      visitData.by_doctor.map((item) => (
                        <TableRow key={item.doctor_id}>
                          <TableCell className="font-medium">
                            {item.doctor_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.total.toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab: Pendapatan */}
        <TabsContent value="pendapatan" className="mt-4 space-y-4">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Tren Pendapatan Harian
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[350px] w-full" />
                ) : revenueData && revenueData.by_date.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                      data={revenueData.by_date.map((item) => ({
                        date: format(parseISO(item.date), "dd MMM", {
                          locale: localeId,
                        }),
                        Pendapatan: item.total_amount,
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorPendapatan"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        tickFormatter={(value) =>
                          `${(value / 1000000).toFixed(1)}jt`
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="Pendapatan"
                        stroke="#10B981"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorPendapatan)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[350px] text-muted-foreground">
                    <DollarSign className="h-12 w-12 mb-4 opacity-30" />
                    <p>Tidak ada data pendapatan</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Pendapatan Per Metode Pembayaran */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Pendapatan Per Metode Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metode</TableHead>
                      <TableHead className="text-right">
                        Jumlah Transaksi
                      </TableHead>
                      <TableHead className="text-right">
                        Total Pendapatan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={3}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : revenueData &&
                      revenueData.by_payment_method.length > 0 ? (
                      revenueData.by_payment_method.map((item) => (
                        <TableRow key={item.payment_method}>
                          <TableCell>
                            <Badge variant="secondary">{item.label}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.count.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(item.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pendapatan Per Poli */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Pendapatan Per Poli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poli</TableHead>
                      <TableHead className="text-right">
                        Jumlah Transaksi
                      </TableHead>
                      <TableHead className="text-right">
                        Total Pendapatan
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={3}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : revenueData &&
                      revenueData.by_department.length > 0 ? (
                      revenueData.by_department.map((item) => (
                        <TableRow key={item.department_id}>
                          <TableCell className="font-medium">
                            {item.department_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.count.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(item.total_amount)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab: Diagnosa */}
        <TabsContent value="diagnosa" className="mt-4 space-y-4">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Top 10 Diagnosa
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : diagnosisData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={diagnosisData.slice(0, 10).map((item) => ({
                        name:
                          item.icd_name.length > 30
                            ? item.icd_name.substring(0, 30) + "..."
                            : item.icd_name,
                        Jumlah: item.count,
                      }))}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={200}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Jumlah" radius={[0, 4, 4, 0]}>
                        {diagnosisData.slice(0, 10).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <Stethoscope className="h-12 w-12 mb-4 opacity-30" />
                    <p>Tidak ada data diagnosa</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Diagnosa Table */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Daftar Diagnosa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode ICD</TableHead>
                      <TableHead>Nama Diagnosa</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Persentase</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={4}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : diagnosisData.length > 0 ? (
                      diagnosisData.map((item, index) => (
                        <TableRow key={`${item.icd_code}-${index}`}>
                          <TableCell>
                            <Badge variant="outline">{item.icd_code}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.icd_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.count.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${Math.min(item.percentage, 100)}%`,
                                    backgroundColor:
                                      CHART_COLORS[
                                        index % CHART_COLORS.length
                                      ],
                                  }}
                                />
                              </div>
                              <Badge variant="secondary">
                                {item.percentage.toFixed(1)}%
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab: Per Dokter */}
        <TabsContent value="dokter" className="mt-4 space-y-4">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Kinerja Per Dokter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dokter</TableHead>
                      <TableHead>Poli</TableHead>
                      <TableHead className="text-right">Pasien</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                      <TableHead className="text-right">
                        Rata-rata/Kunjungan
                      </TableHead>
                      <TableHead className="text-right">Selesai</TableHead>
                      <TableHead className="text-right">Batal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={7}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : doctorData.length > 0 ? (
                      doctorData.map((item) => (
                        <TableRow key={item.doctor_id}>
                          <TableCell className="font-medium">
                            {item.doctor_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">
                              {item.department_name}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.total_patients.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(item.total_revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.avg_revenue_per_visit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              {item.completed_records}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant="destructive"
                              className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            >
                              {item.cancelled_records}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Tab: Per Poli */}
        <TabsContent value="poli" className="mt-4 space-y-4">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Kunjungan Per Poli
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : departmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={departmentData.map((item) => ({
                        name: item.department_name,
                        Kunjungan: item.total_visits,
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis tick={{ fontSize: 12 }} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="Kunjungan" radius={[4, 4, 0, 0]}>
                        {departmentData.map((_, index) => (
                          <Cell
                            key={`cell-dept-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <Building2 className="h-12 w-12 mb-4 opacity-30" />
                    <p>Tidak ada data poli</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Table */}
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Detail Per Poli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Poli</TableHead>
                      <TableHead className="text-right">Kunjungan</TableHead>
                      <TableHead className="text-right">Pasien Unik</TableHead>
                      <TableHead className="text-right">Pendapatan</TableHead>
                      <TableHead className="text-right">
                        Rata-rata/Kunjungan
                      </TableHead>
                      <TableHead>Top Diagnosa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell colSpan={6}>
                            <Skeleton className="h-10 w-full" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : departmentData.length > 0 ? (
                      departmentData.map((item) => (
                        <TableRow key={item.department_id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    CHART_COLORS[
                                      departmentData.indexOf(item) %
                                        CHART_COLORS.length
                                    ],
                                }}
                              />
                              {item.department_name}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.total_visits.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.total_patients.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {formatCurrency(item.total_revenue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.avg_revenue_per_visit)}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.top_diagnoses.slice(0, 3).map((diag, idx) => (
                                <Badge
                                  key={`${item.department_id}-diag-${idx}`}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {diag.icd_code} ({diag.count})
                                </Badge>
                              ))}
                              {item.top_diagnoses.length === 0 && (
                                <span className="text-xs text-muted-foreground">
                                  -
                                </span>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
