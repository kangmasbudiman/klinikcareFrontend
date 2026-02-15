"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Pill,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
  BarChart3,
  Megaphone,
  Info,
  AlertTriangle,
  CheckCircle,
  Stethoscope,
  Package,
  AlertCircle,
  Banknote,
  FileText,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { ROLE_LABELS, type UserRole } from "@/types";
import { getInitials } from "@/lib/utils";

import reportService from "@/services/report.service";
import patientService from "@/services/patient.service";
import queueService from "@/services/queue.service";
import medicalRecordService from "@/services/medical-record.service";
import { medicineService } from "@/services/pharmacy.service";

import type {
  ReportSummary,
  VisitReportData,
  DepartmentReportItem,
  DoctorReportItem,
} from "@/types/report";
import type { PatientStats } from "@/types/patient";
import type { QueueStats, Queue } from "@/types/queue";
import type { MedicalRecordStats, InvoiceStats } from "@/types/medical-record";
import type { MedicineStats, Medicine, MedicineBatch } from "@/types/pharmacy";

// =====================
// Helper Components
// =====================

const getAnnouncementStyle = (type: "info" | "warning" | "success") => {
  switch (type) {
    case "warning":
      return {
        icon: AlertTriangle,
        bgColor: "bg-amber-500",
        textColor: "text-amber-950",
      };
    case "success":
      return {
        icon: CheckCircle,
        bgColor: "bg-emerald-500",
        textColor: "text-emerald-950",
      };
    default:
      return {
        icon: Info,
        bgColor: "bg-primary",
        textColor: "text-primary-foreground",
      };
  }
};

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000_000)
    return `Rp ${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}K`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function formatFullCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function getTodayRange() {
  const today = new Date().toISOString().split("T")[0];
  return { start_date: today, end_date: today };
}

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const end = now.toISOString().split("T")[0];
  return { start_date: start, end_date: end };
}

function getYearRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
  const end = now.toISOString().split("T")[0];
  return { start_date: start, end_date: end };
}

// Recharts tooltip components
const VisitTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey === "total"
              ? "Total Kunjungan"
              : entry.dataKey === "new_patients"
                ? "Pasien Baru"
                : "Pasien Lama"}
            : {entry.value.toLocaleString("id-ID")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DeptTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-sm">{label}</p>
        <p className="text-sm text-muted-foreground">
          Kunjungan: {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

// Department colors for charts
const DEPT_COLORS = [
  "var(--color-primary)",
  "oklch(0.65 0.2 145)",
  "oklch(0.75 0.15 65)",
  "oklch(0.6 0.2 280)",
  "oklch(0.6 0.15 30)",
  "oklch(0.55 0.2 200)",
  "oklch(0.7 0.18 320)",
  "oklch(0.6 0.15 100)",
];

const PIE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
];

// Queue status helpers
const QUEUE_STATUS_BADGE: Record<string, string> = {
  waiting:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400",
  called: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400",
  in_service:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400",
  completed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400",
  skipped:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
};

const QUEUE_STATUS_LABEL: Record<string, string> = {
  waiting: "Menunggu",
  called: "Dipanggil",
  in_service: "Dilayani",
  completed: "Selesai",
  skipped: "Dilewati",
  cancelled: "Dibatalkan",
};

// =====================
// Main Component
// =====================

export default function DashboardPage() {
  const { user } = useAuth();

  // Data states
  const [loading, setLoading] = useState(true);
  const [patientStats, setPatientStats] = useState<PatientStats | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null);
  const [todayQueues, setTodayQueues] = useState<{
    waiting: Queue[];
    called: Queue[];
    in_service: Queue[];
  }>({ waiting: [], called: [], in_service: [] });
  const [examStats, setExamStats] = useState<MedicalRecordStats | null>(null);
  const [invoiceStats, setInvoiceStats] = useState<InvoiceStats | null>(null);
  const [reportSummary, setReportSummary] = useState<ReportSummary | null>(
    null,
  );
  const [visitData, setVisitData] = useState<VisitReportData | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentReportItem[]>(
    [],
  );
  const [doctorData, setDoctorData] = useState<DoctorReportItem[]>([]);
  const [medicineStats, setMedicineStats] = useState<MedicineStats | null>(
    null,
  );
  const [lowStockMedicines, setLowStockMedicines] = useState<Medicine[]>([]);
  const [expiringMedicines, setExpiringMedicines] = useState<MedicineBatch[]>(
    [],
  );

  // Announcements built from real data
  const [announcements, setAnnouncements] = useState<
    { id: number; type: "info" | "warning" | "success"; message: string }[]
  >([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];
    const monthRange = getMonthRange();
    const yearRange = getYearRange();

    // Fetch all data in parallel with error handling per request
    const results = await Promise.allSettled([
      patientService.getPatientStats(), // 0
      queueService.getQueueStats(today), // 1
      queueService.getTodayQueues(), // 2
      medicalRecordService.getExaminationStats(today), // 3
      medicalRecordService.getInvoiceStats({ date: today }), // 4
      reportService.getSummary(monthRange), // 5
      reportService.getVisitReport({ ...yearRange, group_by: "monthly" }), // 6
      reportService.getDepartmentReport(monthRange), // 7
      reportService.getDoctorReport(monthRange), // 8
      medicineService.getMedicineStats(), // 9
      medicineService.getLowStockMedicines(), // 10
      medicineService.getExpiringMedicines(3), // 11
    ]);

    // Extract data safely
    if (results[0].status === "fulfilled")
      setPatientStats(results[0].value.data);
    if (results[1].status === "fulfilled") setQueueStats(results[1].value.data);
    if (results[2].status === "fulfilled") {
      const qData = results[2].value.data;
      setTodayQueues({
        waiting: qData.waiting || [],
        called: qData.called || [],
        in_service: qData.in_service || [],
      });
    }
    if (results[3].status === "fulfilled") setExamStats(results[3].value.data);
    if (results[4].status === "fulfilled")
      setInvoiceStats(results[4].value.data);
    if (results[5].status === "fulfilled")
      setReportSummary(results[5].value.data);
    if (results[6].status === "fulfilled") setVisitData(results[6].value.data);
    if (results[7].status === "fulfilled")
      setDepartmentData(results[7].value.data);
    if (results[8].status === "fulfilled") setDoctorData(results[8].value.data);
    if (results[9].status === "fulfilled")
      setMedicineStats(results[9].value.data);
    if (results[10].status === "fulfilled")
      setLowStockMedicines(results[10].value.data);
    if (results[11].status === "fulfilled")
      setExpiringMedicines(results[11].value.data);

    // Build dynamic announcements
    const dynAnnouncements: {
      id: number;
      type: "info" | "warning" | "success";
      message: string;
    }[] = [];
    let announcementId = 1;

    if (results[9].status === "fulfilled") {
      const ms = results[9].value.data;
      if (ms.out_of_stock > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "warning",
          message: `${ms.out_of_stock} obat dalam kondisi stok habis. Segera lakukan pemesanan ulang.`,
        });
      }
      if (ms.low_stock > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "warning",
          message: `${ms.low_stock} obat dalam kondisi stok menipis. Periksa dan lakukan pemesanan.`,
        });
      }
      if (ms.expiring_soon > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "warning",
          message: `${ms.expiring_soon} obat mendekati tanggal kedaluwarsa dalam 3 bulan ke depan.`,
        });
      }
    }
    if (results[1].status === "fulfilled") {
      const qs = results[1].value.data;
      if (qs.waiting > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "info",
          message: `${qs.waiting} pasien sedang menunggu di antrian hari ini.`,
        });
      }
    }
    if (results[4].status === "fulfilled") {
      const is = results[4].value.data;
      if (is.unpaid > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "info",
          message: `${is.unpaid} invoice belum dibayar dengan total ${formatFullCurrency(is.total_unpaid)}.`,
        });
      }
    }
    if (results[0].status === "fulfilled") {
      const ps = results[0].value.data;
      if (ps.this_month > 0) {
        dynAnnouncements.push({
          id: announcementId++,
          type: "success",
          message: `${ps.this_month} pasien baru terdaftar bulan ini. Total pasien aktif: ${ps.active.toLocaleString("id-ID")}.`,
        });
      }
    }

    if (dynAnnouncements.length === 0) {
      dynAnnouncements.push({
        id: 1,
        type: "info",
        message:
          "Selamat datang di sistem manajemen klinik. Semua operasional berjalan normal.",
      });
    }

    setAnnouncements(dynAnnouncements);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Prepare chart data
  const visitChartData =
    visitData?.by_date?.map((item) => ({
      date: new Date(item.date).toLocaleDateString("id-ID", {
        month: "short",
        year: undefined,
      }),
      total: item.total,
      new_patients: item.new_patients,
      returning_patients: item.returning_patients,
    })) || [];

  const deptChartData = departmentData.map((d, i) => ({
    name: d.department_name,
    kunjungan: d.total_visits,
    fill: DEPT_COLORS[i % DEPT_COLORS.length],
  }));

  const patientTypePieData = patientStats
    ? [
        { name: "Umum", value: patientStats.by_type.umum },
        { name: "BPJS", value: patientStats.by_type.bpjs },
        { name: "Asuransi", value: patientStats.by_type.asuransi },
      ].filter((d) => d.value > 0)
    : [];

  const PAYMENT_METHOD_NAMES: Record<string, string> = {
    cash: "Tunai",
    card: "Kartu",
    transfer: "Transfer",
    bpjs: "BPJS",
    insurance: "Asuransi",
  };

  const paymentMethodPieData =
    invoiceStats?.payment_by_method
      ?.map((m) => ({
        name: PAYMENT_METHOD_NAMES[m.payment_method] || m.payment_method,
        value: m.total,
        count: m.count,
      }))
      .filter((d) => d.value > 0) || [];

  // Active queue list (waiting + called + in_service, max 6)
  const activeQueues = [
    ...todayQueues.in_service,
    ...todayQueues.called,
    ...todayQueues.waiting,
  ].slice(0, 6);

  // Top doctors (sorted by patients, max 5)
  const topDoctors = [...doctorData]
    .sort((a, b) => b.total_patients - a.total_patients)
    .slice(0, 5);

  // Stats cards config
  const statsCards = [
    {
      title: "Total Pasien",
      value: patientStats ? patientStats.total.toLocaleString("id-ID") : "-",
      change:
        patientStats && patientStats.this_month > 0
          ? `+${patientStats.this_month} bulan ini`
          : "",
      changeType: "positive" as const,
      description: `${patientStats?.active.toLocaleString("id-ID") || 0} aktif`,
      icon: Users,
      cardBg:
        "bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Antrian Hari Ini",
      value: queueStats ? queueStats.total.toLocaleString("id-ID") : "-",
      change: queueStats ? `${queueStats.waiting} menunggu` : "",
      changeType: "neutral" as const,
      description: queueStats ? `${queueStats.completed} selesai` : "",
      icon: Clock,
      cardBg:
        "bg-gradient-to-br from-emerald-500 to-teal-700 dark:from-emerald-600 dark:to-teal-900",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Pemeriksaan",
      value: examStats ? examStats.total.toLocaleString("id-ID") : "-",
      change: examStats ? `${examStats.in_progress} berlangsung` : "",
      changeType: "neutral" as const,
      description: examStats ? `${examStats.completed} selesai` : "",
      icon: Stethoscope,
      cardBg:
        "bg-gradient-to-br from-violet-500 to-purple-700 dark:from-violet-600 dark:to-purple-900",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
    {
      title: "Pendapatan Hari Ini",
      value: invoiceStats ? formatCurrency(invoiceStats.total_revenue) : "-",
      change:
        invoiceStats && invoiceStats.unpaid > 0
          ? `${invoiceStats.unpaid} belum bayar`
          : "Lunas semua",
      changeType: (invoiceStats && invoiceStats.unpaid > 0
        ? "negative"
        : "positive") as "positive" | "negative" | "neutral",
      description: invoiceStats ? `${invoiceStats.paid} transaksi` : "",
      icon: Banknote,
      cardBg:
        "bg-gradient-to-br from-amber-500 to-orange-700 dark:from-amber-600 dark:to-orange-900",
      iconBg: "bg-white/20",
      iconColor: "text-white",
    },
  ];

  // Summary cards (monthly overview)
  const summaryCards = reportSummary
    ? [
        {
          title: "Kunjungan Bulan Ini",
          value: reportSummary.total_visits.toLocaleString("id-ID"),
          change: formatPercent(reportSummary.visits_change_percent),
          changeType:
            reportSummary.visits_change_percent >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: UserCheck,
          iconColor: "text-blue-600 dark:text-blue-400",
          iconBg: "bg-blue-100 dark:bg-blue-900/50",
          borderColor: "border-l-blue-500",
        },
        {
          title: "Pendapatan Bulan Ini",
          value: formatCurrency(reportSummary.total_revenue),
          change: formatPercent(reportSummary.revenue_change_percent),
          changeType:
            reportSummary.revenue_change_percent >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: CreditCard,
          iconColor: "text-emerald-600 dark:text-emerald-400",
          iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
          borderColor: "border-l-emerald-500",
        },
        {
          title: "Pasien Baru",
          value: reportSummary.total_new_patients.toLocaleString("id-ID"),
          change: formatPercent(reportSummary.new_patients_change_percent),
          changeType:
            reportSummary.new_patients_change_percent >= 0
              ? ("positive" as const)
              : ("negative" as const),
          icon: Users,
          iconColor: "text-violet-600 dark:text-violet-400",
          iconBg: "bg-violet-100 dark:bg-violet-900/50",
          borderColor: "border-l-violet-500",
        },
        {
          title: "Rata-rata per Kunjungan",
          value: formatCurrency(reportSummary.avg_revenue_per_visit),
          change: "",
          changeType: "neutral" as const,
          icon: BarChart3,
          iconColor: "text-amber-600 dark:text-amber-400",
          iconBg: "bg-amber-100 dark:bg-amber-900/50",
          borderColor: "border-l-amber-500",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">
            Memuat data dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Selamat Datang, {user?.name?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role ? ROLE_LABELS[user.role as UserRole] : ""} &bull;
            Berikut ringkasan aktivitas klinik hari ini
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Button>
        </div>
      </motion.div>

      {/* Running Text / Announcements */}
      {announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20"
        >
          <div className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground shrink-0 z-10">
              <Megaphone className="h-4 w-4" />
              <span className="font-semibold text-sm hidden sm:inline">
                Pengumuman
              </span>
            </div>
            <div className="flex-1 overflow-hidden py-3">
              <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: Math.max(20, announcements.length * 8),
                    ease: "linear",
                  },
                }}
              >
                {[...announcements, ...announcements].map(
                  (announcement, index) => {
                    const style = getAnnouncementStyle(announcement.type);
                    const IconComponent = style.icon;
                    return (
                      <div
                        key={`${announcement.id}-${index}`}
                        className="flex items-center gap-2 text-sm"
                      >
                        <span className={`p-1 rounded-full ${style.bgColor}`}>
                          <IconComponent
                            className={`h-3 w-3 ${style.textColor}`}
                          />
                        </span>
                        <span className="text-foreground">
                          {announcement.message}
                        </span>
                        <span className="text-muted-foreground mx-4">
                          &bull;
                        </span>
                      </div>
                    );
                  },
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Today Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card
              className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 ${stat.cardBg} text-white`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/80">
                  {stat.title}
                </CardTitle>
                <div
                  className={`p-2.5 rounded-xl ${stat.iconBg} backdrop-blur-sm`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-1">
                  {stat.changeType === "positive" && stat.change && (
                    <span className="flex items-center text-white font-medium bg-white/15 rounded-full px-2 py-0.5">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {stat.change}
                    </span>
                  )}
                  {stat.changeType === "negative" && stat.change && (
                    <span className="flex items-center text-white font-medium bg-white/15 rounded-full px-2 py-0.5">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      {stat.change}
                    </span>
                  )}
                  {stat.changeType === "neutral" && stat.change && (
                    <span className="text-white/80 font-medium">
                      {stat.change}
                    </span>
                  )}
                  {stat.description && (
                    <span className="text-white/70">
                      &bull; {stat.description}
                    </span>
                  )}
                </div>
              </CardContent>
              {/* Decorative circles */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/5" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Monthly Summary Cards */}
      {summaryCards.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {summaryCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Card
                className={`hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 border-l-4 ${card.borderColor}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-xl font-bold mt-1">{card.value}</p>
                      {card.change && (
                        <div className="flex items-center gap-1 mt-1">
                          {card.changeType === "positive" ? (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center bg-emerald-50 dark:bg-emerald-950/50 rounded-full px-2 py-0.5">
                              <TrendingUp className="h-3 w-3 mr-0.5" />
                              {card.change}
                            </span>
                          ) : card.changeType === "negative" ? (
                            <span className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center bg-red-50 dark:bg-red-950/50 rounded-full px-2 py-0.5">
                              <TrendingDown className="h-3 w-3 mr-0.5" />
                              {card.change}
                            </span>
                          ) : null}
                          <span className="text-xs text-muted-foreground">
                            vs bulan lalu
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-xl ${card.iconBg}`}>
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Charts Row 1: Visit Trend + Department Distribution */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Visit Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    Statistik Kunjungan
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Tren kunjungan dan pasien baru tahun ini
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Kunjungan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "oklch(0.65 0.2 145)" }}
                    />
                    <span className="text-muted-foreground">Pasien Baru</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {visitChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={visitChartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--color-primary)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorNew"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="oklch(0.65 0.2 145)"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="oklch(0.65 0.2 145)"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground fill-muted-foreground"
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground fill-muted-foreground"
                        tickFormatter={(v) => v.toLocaleString("id-ID")}
                      />
                      <Tooltip content={<VisitTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                      />
                      <Area
                        type="monotone"
                        dataKey="new_patients"
                        stroke="oklch(0.65 0.2 145)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorNew)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Belum ada data kunjungan
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Department Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Kunjungan per Poli
              </CardTitle>
              <CardDescription>Distribusi bulan ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {deptChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deptChartData}
                      layout="vertical"
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal
                        vertical={false}
                        className="stroke-border"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground fill-muted-foreground"
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11 }}
                        width={80}
                        className="text-muted-foreground fill-muted-foreground"
                      />
                      <Tooltip content={<DeptTooltip />} />
                      <Bar
                        dataKey="kunjungan"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    Belum ada data departemen
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 2: Queue + Patient Type Pie + Payment Method Pie */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    Antrian Hari Ini
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Pasien yang sedang dilayani dan menunggu
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {queueStats && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 font-medium text-xs">
                        {queueStats.waiting} menunggu
                      </span>
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400 font-medium text-xs">
                        {queueStats.in_service} dilayani
                      </span>
                      <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 font-medium text-xs">
                        {queueStats.completed} selesai
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {activeQueues.length > 0 ? (
                <div className="space-y-3">
                  {activeQueues.map((queue, index) => (
                    <motion.div
                      key={queue.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                          {queue.queue_code}
                        </div>
                        <div>
                          <p className="font-medium">
                            {queue.patient?.name || "Pasien Walk-in"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {queue.department?.name || "-"}{" "}
                            {queue.doctor?.name
                              ? `\u2022 ${queue.doctor.name}`
                              : ""}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${QUEUE_STATUS_BADGE[queue.status] || ""}`}
                      >
                        {QUEUE_STATUS_LABEL[queue.status] || queue.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Clock className="h-10 w-10 mb-2 opacity-30" />
                  <p className="text-sm">Belum ada antrian aktif hari ini</p>
                </div>
              )}
              <Link href="/queues">
                <Button variant="outline" className="w-full mt-4">
                  Lihat Semua Antrian
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column: Pie Charts */}
        <div className="space-y-6">
          {/* Patient Type Distribution */}
          {patientTypePieData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    Tipe Pasien
                  </CardTitle>
                  <CardDescription>Distribusi berdasarkan tipe</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={patientTypePieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                          label={(props) =>
                            `${props.name ?? ""} ${(((props.percent as number) ?? 0) * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {patientTypePieData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) =>
                            Number(value).toLocaleString("id-ID")
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Payment Method Distribution */}
          {paymentMethodPieData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    Metode Pembayaran
                  </CardTitle>
                  <CardDescription>Hari ini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {paymentMethodPieData.map((method, i) => (
                      <div
                        key={method.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor:
                                PIE_COLORS[i % PIE_COLORS.length],
                            }}
                          />
                          <span>{method.name}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-medium">
                            {formatFullCurrency(method.value)}
                          </span>
                          <span className="text-muted-foreground ml-1">
                            ({method.count}x)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Row 3: Top Doctors + Pharmacy Alerts + Queue Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Doctors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                Dokter Teratas
              </CardTitle>
              <CardDescription>
                Berdasarkan jumlah pasien bulan ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topDoctors.length > 0 ? (
                <div className="space-y-3">
                  {topDoctors.map((doctor, index) => (
                    <div
                      key={doctor.doctor_id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(doctor.doctor_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doctor.doctor_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.department_name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {doctor.total_patients}
                        </p>
                        <p className="text-xs text-muted-foreground">pasien</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Stethoscope className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">Belum ada data dokter</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Pharmacy Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Pill className="h-5 w-5 text-primary" />
                </div>
                Status Farmasi
              </CardTitle>
              <CardDescription>Peringatan stok obat</CardDescription>
            </CardHeader>
            <CardContent>
              {medicineStats ? (
                <div className="space-y-4">
                  {/* Medicine stats overview */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-2xl font-bold">
                        {medicineStats.total}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Obat
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {medicineStats.active}
                      </p>
                      <p className="text-xs text-muted-foreground">Aktif</p>
                    </div>
                  </div>

                  {/* Alert items */}
                  <div className="space-y-2">
                    {medicineStats.out_of_stock > 0 && (
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-700 dark:text-red-400">
                            Stok Habis
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-500">
                            {medicineStats.out_of_stock} item obat
                          </p>
                        </div>
                      </div>
                    )}
                    {medicineStats.low_stock > 0 && (
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                            Stok Menipis
                          </p>
                          <p className="text-xs text-amber-600 dark:text-amber-500">
                            {medicineStats.low_stock} item obat
                          </p>
                        </div>
                      </div>
                    )}
                    {medicineStats.expiring_soon > 0 && (
                      <div className="flex items-center gap-3 p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                        <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400 shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                            Mendekati Kedaluwarsa
                          </p>
                          <p className="text-xs text-orange-600 dark:text-orange-500">
                            {medicineStats.expiring_soon} item (3 bulan)
                          </p>
                        </div>
                      </div>
                    )}
                    {medicineStats.out_of_stock === 0 &&
                      medicineStats.low_stock === 0 &&
                      medicineStats.expiring_soon === 0 && (
                        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <p className="text-sm text-emerald-700 dark:text-emerald-400">
                            Semua stok obat dalam kondisi normal
                          </p>
                        </div>
                      )}
                  </div>

                  {/* Low stock medicine list */}
                  {lowStockMedicines.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Obat Stok Menipis:
                      </p>
                      <div className="space-y-1.5 max-h-[120px] overflow-y-auto">
                        {lowStockMedicines.slice(0, 5).map((med) => (
                          <div
                            key={med.id}
                            className="flex items-center justify-between text-xs p-1.5 rounded bg-muted/30"
                          >
                            <span className="truncate flex-1">{med.name}</span>
                            <span className="font-medium text-amber-600 dark:text-amber-400 ml-2">
                              {med.current_stock} {med.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href="/pharmacy/medicines">
                    <Button variant="outline" size="sm" className="w-full">
                      <Package className="h-4 w-4 mr-2" />
                      Kelola Farmasi
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Pill className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">Data farmasi tidak tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Queue Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                Performa Antrian
              </CardTitle>
              <CardDescription>Statistik layanan hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              {queueStats ? (
                <div className="space-y-4">
                  {/* Wait & service time */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {queueStats.avg_wait_time > 0
                          ? `${Math.round(queueStats.avg_wait_time)}`
                          : "0"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rata-rata tunggu (mnt)
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-center">
                      <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                        {queueStats.avg_service_time > 0
                          ? `${Math.round(queueStats.avg_service_time)}`
                          : "0"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Rata-rata layanan (mnt)
                      </p>
                    </div>
                  </div>

                  {/* Queue status breakdown */}
                  <div className="space-y-2.5">
                    {[
                      {
                        label: "Menunggu",
                        value: queueStats.waiting,
                        total: queueStats.total,
                        color: "bg-amber-500",
                      },
                      {
                        label: "Dipanggil",
                        value: queueStats.called,
                        total: queueStats.total,
                        color: "bg-blue-500",
                      },
                      {
                        label: "Dilayani",
                        value: queueStats.in_service,
                        total: queueStats.total,
                        color: "bg-purple-500",
                      },
                      {
                        label: "Selesai",
                        value: queueStats.completed,
                        total: queueStats.total,
                        color: "bg-emerald-500",
                      },
                      {
                        label: "Dilewati",
                        value: queueStats.skipped,
                        total: queueStats.total,
                        color: "bg-orange-500",
                      },
                    ]
                      .filter((s) => s.value > 0)
                      .map((s) => (
                        <div key={s.label}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">
                              {s.label}
                            </span>
                            <span className="font-medium">{s.value}</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.color} transition-all`}
                              style={{
                                width: `${s.total > 0 ? (s.value / s.total) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>

                  <Link href="/queues">
                    <Button variant="outline" size="sm" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Kelola Antrian
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Activity className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">Data antrian tidak tersedia</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Row 4: Department Revenue Table */}
      {departmentData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    Performa Departemen
                  </CardTitle>
                  <CardDescription>
                    Ringkasan kunjungan dan pendapatan per departemen bulan ini
                  </CardDescription>
                </div>
                <Link href="/reports">
                  <Button variant="outline" size="sm">
                    Lihat Laporan
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                        Departemen
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                        Kunjungan
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                        Pasien
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                        Pendapatan
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                        Rata-rata
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentData.map((dept) => (
                      <tr
                        key={dept.department_id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full shrink-0"
                              style={{
                                backgroundColor:
                                  dept.department_color ||
                                  "var(--color-primary)",
                              }}
                            />
                            <span className="font-medium">
                              {dept.department_name}
                            </span>
                          </div>
                        </td>
                        <td className="text-right py-3 px-2">
                          {dept.total_visits.toLocaleString("id-ID")}
                        </td>
                        <td className="text-right py-3 px-2">
                          {dept.total_patients.toLocaleString("id-ID")}
                        </td>
                        <td className="text-right py-3 px-2 font-medium">
                          {formatFullCurrency(dept.total_revenue)}
                        </td>
                        <td className="text-right py-3 px-2 text-muted-foreground">
                          {formatFullCurrency(dept.avg_revenue_per_visit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-semibold">
                      <td className="py-3 px-2">Total</td>
                      <td className="text-right py-3 px-2">
                        {departmentData
                          .reduce((s, d) => s + d.total_visits, 0)
                          .toLocaleString("id-ID")}
                      </td>
                      <td className="text-right py-3 px-2">
                        {departmentData
                          .reduce((s, d) => s + d.total_patients, 0)
                          .toLocaleString("id-ID")}
                      </td>
                      <td className="text-right py-3 px-2">
                        {formatFullCurrency(
                          departmentData.reduce(
                            (s, d) => s + d.total_revenue,
                            0,
                          ),
                        )}
                      </td>
                      <td className="text-right py-3 px-2 text-muted-foreground">
                        -
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
