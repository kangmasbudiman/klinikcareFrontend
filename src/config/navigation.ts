import {
  LayoutDashboard,
  Users,
  Settings,
  UserCog,
  Stethoscope,
  ClipboardList,
  Calendar,
  ListOrdered,
  Pill,
  CreditCard,
  FileText,
  Building2,
  Shield,
  Monitor,
  Ticket,
  Banknote,
  Truck,
  FolderTree,
  Package,
  ShoppingCart,
  PackageCheck,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  children?: NavItem[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Navigation items per role
const dashboardItem: NavItem = {
  title: "Dashboard",
  href: "/dashboard",
  icon: LayoutDashboard,
  description: "Ringkasan dan statistik",
};

const masterDataSection: NavSection = {
  title: "Master Data",
  items: [
    {
      title: "Pengaturan Klinik",
      href: "/master/clinic",
      icon: Building2,
      description: "Informasi dan pengaturan klinik",
    },
    {
      title: "Departemen/Poli",
      href: "/master/departments",
      icon: Building2,
      description: "Kelola departemen dan poli",
    },
    {
      title: "Layanan",
      href: "/master/services",
      icon: ClipboardList,
      description: "Kelola layanan dan tarif",
    },
    {
      title: "Kode ICD",
      href: "/master/icd-codes",
      icon: FileText,
      description: "Kelola kode diagnosis ICD",
    },
  ],
};

const userManagementSection: NavSection = {
  title: "Manajemen User",
  items: [
    {
      title: "Daftar User",
      href: "/users",
      icon: Users,
      description: "Kelola pengguna sistem",
    },
    {
      title: "Hak Akses",
      href: "/settings/roles",
      icon: Shield,
      description: "Kelola role dan permission",
    },
  ],
};

const patientSection: NavSection = {
  title: "Pasien",
  items: [
    {
      title: "Daftar Pasien",
      href: "/patients",
      icon: Users,
      description: "Data pasien",
    },
    {
      title: "Rekam Medis",
      href: "/medical-records",
      icon: ClipboardList,
      description: "Riwayat rekam medis",
    },
  ],
};

const operationalSection: NavSection = {
  title: "Operasional",
  items: [
    {
      title: "Jadwal Dokter",
      href: "/schedules",
      icon: Calendar,
      description: "Kelola jadwal praktek",
    },
    {
      title: "Antrian",
      href: "/queue",
      icon: ListOrdered,
      description: "Sistem antrian pasien",
    },
    {
      title: "Pengaturan Antrian",
      href: "/queue/settings",
      icon: Settings,
      description: "Konfigurasi antrian per poli",
    },
    {
      title: "Pemeriksaan",
      href: "/examination",
      icon: Stethoscope,
      description: "Pemeriksaan pasien",
    },
    {
      title: "Kasir",
      href: "/cashier",
      icon: Banknote,
      description: "Pembayaran pasien",
    },
    {
      title: "Display Antrian",
      href: "/queue/display",
      icon: Monitor,
      description: "Tampilan antrian untuk monitor",
    },
    {
      title: "Anjungan Pasien",
      href: "/kiosk",
      icon: Ticket,
      description: "Mesin ambil antrian pasien",
    },
  ],
};

const pharmacySection: NavSection = {
  title: "Farmasi",
  items: [
    {
      title: "Supplier",
      href: "/pharmacy/suppliers",
      icon: Truck,
      description: "Kelola data supplier/distributor",
    },
    {
      title: "Kategori Obat",
      href: "/pharmacy/categories",
      icon: FolderTree,
      description: "Kelola kategori obat",
    },
    {
      title: "Master Obat",
      href: "/pharmacy/medicines",
      icon: Pill,
      description: "Kelola data obat",
    },
    {
      title: "Purchase Order",
      href: "/pharmacy/purchase-orders",
      icon: ShoppingCart,
      description: "Kelola pesanan ke supplier",
    },
    {
      title: "Penerimaan Barang",
      href: "/pharmacy/goods-receipt",
      icon: PackageCheck,
      description: "Penerimaan barang dari supplier",
    },
    {
      title: "Mutasi Stok",
      href: "/pharmacy/stock-movements",
      icon: ArrowRightLeft,
      description: "Catatan keluar masuk barang",
    },
    {
      title: "Dispensing Resep",
      href: "/pharmacy/prescriptions",
      icon: Package,
      description: "Proses resep obat dari dokter",
    },
  ],
};

const pharmacyReportSection: NavSection = {
  title: "Laporan Farmasi",
  items: [
    {
      title: "Laporan Penerimaan",
      href: "/pharmacy/reports/receipts",
      icon: BarChart3,
      description: "Analisis penerimaan & laba rugi",
    },
    {
      title: "Laporan Stok Masuk",
      href: "/pharmacy/reports/stock-in",
      icon: TrendingUp,
      description: "Laporan obat masuk",
    },
    {
      title: "Laporan Stok Keluar",
      href: "/pharmacy/reports/stock-out",
      icon: TrendingDown,
      description: "Laporan obat keluar",
    },
  ],
};

const paymentSection: NavSection = {
  title: "Pembayaran",
  items: [
    {
      title: "Kasir",
      href: "/cashier",
      icon: CreditCard,
      description: "Transaksi pembayaran",
    },
    {
      title: "Riwayat Transaksi",
      href: "/payments/history",
      icon: FileText,
      description: "Riwayat pembayaran",
    },
  ],
};

const reportSection: NavSection = {
  title: "Laporan",
  items: [
    {
      title: "Laporan Klinik",
      href: "/reports",
      icon: BarChart3,
      description: "Laporan kunjungan, pendapatan, dan kinerja",
    },
    {
      title: "Surat Medis",
      href: "/letters",
      icon: ScrollText,
      description: "Buat dan cetak surat-surat medis",
    },
  ],
};

const settingsItem: NavItem = {
  title: "Pengaturan",
  href: "/settings",
  icon: Settings,
  description: "Pengaturan akun",
};

// Role-based navigation configuration
export const roleNavigation: Record<UserRole, NavSection[]> = {
  super_admin: [
    { title: "Menu Utama", items: [dashboardItem] },
    masterDataSection,
    userManagementSection,
    patientSection,
    operationalSection,
    pharmacySection,
    pharmacyReportSection,
    paymentSection,
    reportSection,
    { title: "Lainnya", items: [settingsItem] },
  ],
  admin_klinik: [
    { title: "Menu Utama", items: [dashboardItem] },
    masterDataSection,
    userManagementSection,
    patientSection,
    operationalSection,
    pharmacySection,
    pharmacyReportSection,
    paymentSection,
    reportSection,
    { title: "Lainnya", items: [settingsItem] },
  ],
  dokter: [
    { title: "Menu Utama", items: [dashboardItem] },
    {
      title: "Praktek",
      items: [
        {
          title: "Jadwal Saya",
          href: "/schedules",
          icon: Calendar,
          description: "Jadwal praktek saya",
        },
        {
          title: "Antrian Pasien",
          href: "/queue",
          icon: ListOrdered,
          description: "Pasien dalam antrian",
        },
        {
          title: "Pemeriksaan",
          href: "/examination",
          icon: Stethoscope,
          description: "Pemeriksaan pasien",
        },
      ],
    },
    patientSection,
    {
      title: "Resep",
      items: [
        {
          title: "Buat Resep",
          href: "/pharmacy/prescriptions/create",
          icon: Stethoscope,
          description: "Buat resep obat",
        },
        {
          title: "Riwayat Resep",
          href: "/pharmacy/prescriptions",
          icon: ClipboardList,
          description: "Riwayat resep",
        },
      ],
    },
    {
      title: "Surat Medis",
      items: [
        {
          title: "Surat Medis",
          href: "/letters",
          icon: ScrollText,
          description: "Buat dan cetak surat medis",
        },
      ],
    },
    { title: "Lainnya", items: [settingsItem] },
  ],
  perawat: [
    { title: "Menu Utama", items: [dashboardItem] },
    {
      title: "Pendaftaran",
      items: [
        {
          title: "Daftar Pasien Baru",
          href: "/patients/register",
          icon: Users,
          description: "Daftarkan pasien baru",
        },
        {
          title: "Daftar Pasien",
          href: "/patients",
          icon: Users,
          description: "Data pasien",
        },
      ],
    },
    {
      title: "Antrian",
      items: [
        {
          title: "Kelola Antrian",
          href: "/queue",
          icon: ListOrdered,
          description: "Kelola antrian pasien",
        },
      ],
    },
    { title: "Lainnya", items: [settingsItem] },
  ],
  kasir: [
    { title: "Menu Utama", items: [dashboardItem] },
    {
      title: "Pembayaran",
      items: [
        {
          title: "Kasir",
          href: "/cashier",
          icon: Banknote,
          description: "Pembayaran pasien",
        },
        {
          title: "Riwayat Transaksi",
          href: "/payments/history",
          icon: FileText,
          description: "Riwayat pembayaran",
        },
      ],
    },
    { title: "Lainnya", items: [settingsItem] },
  ],
  pasien: [
    { title: "Menu Utama", items: [dashboardItem] },
    {
      title: "Layanan",
      items: [
        {
          title: "Booking",
          href: "/booking",
          icon: Calendar,
          description: "Booking jadwal periksa",
        },
        {
          title: "Riwayat Kunjungan",
          href: "/visits",
          icon: ClipboardList,
          description: "Riwayat kunjungan",
        },
        {
          title: "Rekam Medis",
          href: "/my-records",
          icon: FileText,
          description: "Rekam medis saya",
        },
      ],
    },
    { title: "Lainnya", items: [settingsItem] },
  ],
  apoteker: [
    { title: "Menu Utama", items: [dashboardItem] },
    pharmacySection,
    pharmacyReportSection,
    {
      title: "Pasien",
      items: [
        {
          title: "Daftar Pasien",
          href: "/patients",
          icon: Users,
          description: "Lihat data pasien",
        },
      ],
    },
    reportSection,
    { title: "Lainnya", items: [settingsItem] },
  ],
};

export function getNavigationForRole(role: UserRole): NavSection[] {
  return roleNavigation[role] || [];
}
