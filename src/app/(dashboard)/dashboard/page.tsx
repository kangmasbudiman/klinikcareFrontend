"use client";

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
} from "recharts";

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

// Announcements data (dummy data)
const announcements = [
  {
    id: 1,
    type: "info" as const,
    message:
      "Rapat koordinasi bulanan akan dilaksanakan pada hari Jumat, 24 Januari 2025 pukul 14:00 WIB di Ruang Meeting Lt. 2",
  },
  {
    id: 2,
    type: "warning" as const,
    message:
      "Stok obat Paracetamol 500mg hampir habis. Mohon segera lakukan pemesanan ulang.",
  },
  {
    id: 3,
    type: "success" as const,
    message:
      "Selamat! Klinik kita telah berhasil meraih akreditasi paripurna. Terima kasih atas kerja keras seluruh tim.",
  },
  {
    id: 4,
    type: "info" as const,
    message:
      "Jadwal piket dokter untuk bulan Februari sudah tersedia. Silakan cek di menu Jadwal Dokter.",
  },
  {
    id: 5,
    type: "warning" as const,
    message:
      "Sistem akan mengalami maintenance pada Minggu, 26 Januari 2025 pukul 00:00 - 04:00 WIB.",
  },
];

// Get icon and color based on announcement type
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

// Stats cards data
const statsCards = [
  {
    title: "Total Pasien",
    value: "1,234",
    change: "+12%",
    changeType: "positive" as "positive" | "negative" | "neutral",
    description: "dari bulan lalu",
    icon: Users,
    gradient: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Kunjungan Hari Ini",
    value: "48",
    change: "+8%",
    changeType: "positive" as "positive" | "negative" | "neutral",
    description: "dari kemarin",
    icon: UserCheck,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Jadwal Dokter",
    value: "12",
    change: "Aktif",
    changeType: "neutral" as "positive" | "negative" | "neutral",
    description: "dokter bertugas",
    icon: Calendar,
    gradient: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/50",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Pendapatan",
    value: "Rp 15.5M",
    change: "+23%",
    changeType: "positive" as "positive" | "negative" | "neutral",
    description: "dari bulan lalu",
    icon: CreditCard,
    gradient: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
];

// Recent activities
const recentActivities = [
  {
    id: 1,
    action: "Pasien baru terdaftar",
    name: "John Doe",
    time: "5 menit lalu",
    icon: Users,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
  },
  {
    id: 2,
    action: "Pembayaran diterima",
    name: "Rp 500.000 - Jane Smith",
    time: "15 menit lalu",
    icon: CreditCard,
    color:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
  },
  {
    id: 3,
    action: "Resep obat dibuat",
    name: "Dr. Ahmad Sudirman",
    time: "30 menit lalu",
    icon: Pill,
    color:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-400",
  },
  {
    id: 4,
    action: "Jadwal dokter diperbarui",
    name: "Admin Klinik",
    time: "1 jam lalu",
    icon: Calendar,
    color:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
  },
];

// Queue data
const queueData = [
  {
    id: 1,
    name: "Ahmad Sudirman",
    poli: "Umum",
    number: "A-001",
    status: "Menunggu",
    time: "08:30",
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    poli: "Gigi",
    number: "B-003",
    status: "Dipanggil",
    time: "09:00",
  },
  {
    id: 3,
    name: "Budi Santoso",
    poli: "Umum",
    number: "A-002",
    status: "Menunggu",
    time: "09:15",
  },
  {
    id: 4,
    name: "Dewi Lestari",
    poli: "Anak",
    number: "C-001",
    status: "Menunggu",
    time: "09:30",
  },
  {
    id: 5,
    name: "Rudi Hartono",
    poli: "Umum",
    number: "A-003",
    status: "Menunggu",
    time: "09:45",
  },
];

// Top doctors
const topDoctors = [
  { name: "Dr. Ahmad Sudirman", specialty: "Umum", patients: 45 },
  { name: "Dr. Siti Rahayu", specialty: "Gigi", patients: 38 },
  { name: "Dr. Budi Santoso", specialty: "Anak", patients: 32 },
];

// Monthly visit data (dummy data)
const monthlyVisitData = [
  { month: "Jan", kunjungan: 856, pasienBaru: 124 },
  { month: "Feb", kunjungan: 932, pasienBaru: 98 },
  { month: "Mar", kunjungan: 1021, pasienBaru: 156 },
  { month: "Apr", kunjungan: 878, pasienBaru: 112 },
  { month: "Mei", kunjungan: 1156, pasienBaru: 189 },
  { month: "Jun", kunjungan: 1089, pasienBaru: 134 },
  { month: "Jul", kunjungan: 1234, pasienBaru: 201 },
  { month: "Agu", kunjungan: 1145, pasienBaru: 167 },
  { month: "Sep", kunjungan: 1312, pasienBaru: 223 },
  { month: "Okt", kunjungan: 1198, pasienBaru: 178 },
  { month: "Nov", kunjungan: 1367, pasienBaru: 245 },
  { month: "Des", kunjungan: 1423, pasienBaru: 267 },
];

// Visit by poli data (dummy data)
const visitByPoliData = [
  { poli: "Umum", kunjungan: 456, fill: "var(--color-primary)" },
  { poli: "Gigi", kunjungan: 234, fill: "oklch(0.65 0.2 145)" },
  { poli: "Anak", kunjungan: 189, fill: "oklch(0.75 0.15 65)" },
  { poli: "Mata", kunjungan: 145, fill: "oklch(0.6 0.2 280)" },
  { poli: "THT", kunjungan: 98, fill: "oklch(0.6 0.15 30)" },
];

// Custom tooltip component
const CustomTooltip = ({
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
            {entry.dataKey === "kunjungan" ? "Kunjungan" : "Pasien Baru"}:{" "}
            {entry.value.toLocaleString("id-ID")}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Custom tooltip for bar chart
const BarTooltip = ({
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
        <p className="font-medium text-sm">Poli {label}</p>
        <p className="text-sm text-muted-foreground">
          Kunjungan: {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuth();

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
            Selamat Datang, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role ? ROLE_LABELS[user.role as UserRole] : ""} • Berikut
            ringkasan aktivitas klinik hari ini
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
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20"
      >
        <div className="flex items-center">
          {/* Label */}
          <div className="flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground shrink-0 z-10">
            <Megaphone className="h-4 w-4" />
            <span className="font-semibold text-sm hidden sm:inline">
              Pengumuman
            </span>
          </div>

          {/* Running text container */}
          <div className="flex-1 overflow-hidden py-3">
            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Double the announcements for seamless loop */}
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
                      <span className="text-muted-foreground mx-4">•</span>
                    </div>
                  );
                },
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {statsCards.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl ${stat.bgLight}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-1">
                  {stat.changeType === "positive" && (
                    <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                      <TrendingUp className="h-3 w-3 mr-0.5" />
                      {stat.change}
                    </span>
                  )}
                  {stat.changeType === "negative" && (
                    <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                      {stat.change}
                    </span>
                  )}
                  {stat.changeType === "neutral" && (
                    <span className="text-muted-foreground font-medium">
                      {stat.change}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
              {/* Gradient accent */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient}`}
              />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Visit Chart - Takes 2 columns */}
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
                    Statistik Kunjungan Bulanan
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Grafik kunjungan dan pasien baru per bulan
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyVisitData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                        id="colorPasienBaru"
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
                      dataKey="month"
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
                      tickFormatter={(value) => value.toLocaleString("id-ID")}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="kunjungan"
                      stroke="var(--color-primary)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorKunjungan)"
                    />
                    <Area
                      type="monotone"
                      dataKey="pasienBaru"
                      stroke="oklch(0.65 0.2 145)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorPasienBaru)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Visit by Poli Chart */}
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
              <CardDescription>Distribusi kunjungan hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={visitByPoliData}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={true}
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
                      dataKey="poli"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      width={50}
                      className="text-muted-foreground fill-muted-foreground"
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Bar
                      dataKey="kunjungan"
                      radius={[0, 4, 4, 0]}
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Queue - Takes 2 columns */}
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
                    Daftar pasien yang sedang menunggu
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    {queueData.length} pasien
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {queueData.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                        {patient.number}
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Poli {patient.poli} • {patient.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        patient.status === "Dipanggil"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                Lihat Semua Antrian
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  Aktivitas Terbaru
                </CardTitle>
                <CardDescription>Update terbaru dari sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}
                      >
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Doctors */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  Dokter Terbaik
                </CardTitle>
                <CardDescription>
                  Berdasarkan jumlah pasien bulan ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topDoctors.map((doctor, index) => (
                    <div
                      key={doctor.name}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                        {index + 1}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(doctor.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {doctor.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.specialty}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          {doctor.patients}
                        </p>
                        <p className="text-xs text-muted-foreground">pasien</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
