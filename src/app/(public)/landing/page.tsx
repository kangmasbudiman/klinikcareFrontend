"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Stethoscope,
  Heart,
  Activity,
  ShieldCheck,
  Clock,
  Users,
  Mic,
  Monitor,
  Pill,
  CreditCard,
  BarChart3,
  FileText,
  CheckCircle2,
  ArrowRight,
  Play,
  Star,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Zap,
  Globe,
  Lock,
  CalendarDays,
  ClipboardList,
  UserCheck,
  MonitorSmartphone,
} from "lucide-react";

// ============================================================
// DATA
// ============================================================

const heroImages = [
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?q=80&w=2070&auto=format&fit=crop",
];

const navLinks = [
  { label: "Fitur", href: "#fitur", icon: Sparkles },
  { label: "Keunggulan", href: "#keunggulan", icon: ShieldCheck },
  { label: "Alur Kerja", href: "#workflow", icon: Activity },
  { label: "Testimoni", href: "#testimoni", icon: Star },
  { label: "Harga", href: "#harga", icon: CreditCard },
  { label: "Kontak", href: "#kontak", icon: Phone },
];

const stats = [
  { value: "100+", label: "Klinik Terdaftar" },
  { value: "50K+", label: "Pasien Terkelola" },
  { value: "99.9%", label: "Uptime Server" },
  { value: "24/7", label: "Dukungan Tim" },
];

const mainFeatures = [
  {
    icon: Users,
    title: "Manajemen Pasien",
    desc: "Registrasi pasien lengkap dengan dukungan BPJS, Asuransi, dan pasien umum. Data tersimpan aman dan terstruktur.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: ClipboardList,
    title: "Antrian Otomatis",
    desc: "Sistem antrian real-time dengan display monitor dan kiosk self-service. Tidak ada lagi antrian yang kacau.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Mic,
    title: "Voice Command AI",
    desc: "Dokter bisa mendokumentasikan pemeriksaan hanya dengan suara. Hands-free, lebih cepat, lebih fokus ke pasien.",
    color: "from-violet-500 to-purple-500",
    badge: "AI Powered",
  },
  {
    icon: FileText,
    title: "Rekam Medis SOAP",
    desc: "Dokumentasi medis standar SOAP dengan kode ICD-10/ICD-9-CM terintegrasi dan kompatibel SatuSehat.",
    color: "from-orange-500 to-amber-500",
  },
  {
    icon: Pill,
    title: "Manajemen Farmasi",
    desc: "Stok obat real-time, purchase order, batch tracking, dan alert otomatis untuk obat hampir habis atau kadaluarsa.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: CreditCard,
    title: "Kasir & Billing",
    desc: "Pembayaran multi-metode: tunai, kartu, transfer, BPJS, dan asuransi. Invoice otomatis dari rekam medis.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Laporan & Analitik",
    desc: "Dashboard real-time dengan grafik kunjungan, pendapatan, performa dokter, dan export ke Excel.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: ShieldCheck,
    title: "7 Role Pengguna",
    desc: "Akses terkontrol untuk Super Admin, Admin, Dokter, Perawat, Apoteker, Kasir, dan Pasien.",
    color: "from-teal-500 to-emerald-500",
  },
];

const advantages = [
  {
    icon: Zap,
    title: "Cepat & Responsif",
    desc: "Dibangun dengan teknologi terbaru Next.js & React untuk performa maksimal.",
  },
  {
    icon: Lock,
    title: "Aman & Terenkripsi",
    desc: "Data pasien dilindungi dengan standar keamanan tinggi dan role-based access.",
  },
  {
    icon: Globe,
    title: "Integrasi SatuSehat",
    desc: "Kompatibel dengan standar Kementerian Kesehatan dan BPJS Kesehatan.",
  },
  {
    icon: MonitorSmartphone,
    title: "Multi-Device",
    desc: "Akses dari desktop, tablet, maupun smartphone. Responsive di semua perangkat.",
  },
  {
    icon: Sparkles,
    title: "AI Voice Input",
    desc: "Teknologi speech recognition untuk dokumentasi medis hands-free dalam Bahasa Indonesia.",
  },
  {
    icon: CalendarDays,
    title: "Penjadwalan Dokter",
    desc: "Atur jadwal praktik dokter dengan mudah dan integrasikan dengan sistem antrian.",
  },
];

const workflowSteps = [
  {
    step: "01",
    icon: UserCheck,
    title: "Pendaftaran Pasien",
    desc: "Pasien mendaftar melalui kiosk atau petugas pendaftaran. Data otomatis tersimpan.",
  },
  {
    step: "02",
    icon: Clock,
    title: "Antrian Otomatis",
    desc: "Sistem mengatur antrian berdasarkan departemen dan jadwal dokter.",
  },
  {
    step: "03",
    icon: Stethoscope,
    title: "Pemeriksaan Dokter",
    desc: "Dokter melakukan pemeriksaan dengan voice input dan kode ICD otomatis.",
  },
  {
    step: "04",
    icon: Pill,
    title: "Resep & Farmasi",
    desc: "Resep langsung diteruskan ke apotek. Stok obat otomatis berkurang.",
  },
  {
    step: "05",
    icon: CreditCard,
    title: "Pembayaran",
    desc: "Kasir memproses pembayaran dengan invoice yang sudah tergenerate otomatis.",
  },
  {
    step: "06",
    icon: BarChart3,
    title: "Laporan Harian",
    desc: "Manajemen melihat laporan lengkap di dashboard real-time.",
  },
];

const testimonials = [
  {
    name: "dr. Sarah Wijaya",
    role: "Dokter Umum, Klinik Sehat Mandiri",
    content:
      "Voice command sangat membantu praktik saya. Saya bisa fokus memeriksa pasien tanpa harus bolak-balik mengetik di komputer. Efisiensi naik drastis.",
    rating: 5,
  },
  {
    name: "Budi Hartono",
    role: "Owner, Klinik Pratama Harapan",
    content:
      "Sejak pakai Clinexa, laporan keuangan jadi transparan dan real-time. Keputusan bisnis jadi lebih cepat dan tepat. ROI terasa dalam 2 bulan.",
    rating: 5,
  },
  {
    name: "Apt. Dewi Sartika",
    role: "Apoteker, Klinik Medika Utama",
    content:
      "Manajemen stok obat jadi sangat mudah. Alert otomatis untuk obat yang hampir expired sangat membantu. Tidak ada lagi obat terbuang sia-sia.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "500K",
    period: "/bulan",
    desc: "Untuk klinik kecil dengan 1-2 dokter",
    features: [
      "Maks 3 pengguna",
      "Manajemen pasien",
      "Antrian dasar",
      "Rekam medis digital",
      "Laporan standar",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "1JT",
    period: "/bulan",
    desc: "Untuk klinik menengah dengan multi-poli",
    features: [
      "Maks 15 pengguna",
      "Semua fitur Starter",
      "Voice Command AI",
      "Manajemen farmasi lengkap",
      "Multi metode pembayaran",
      "Integrasi BPJS",
      "Laporan analitik lanjutan",
      "Kiosk & display antrian",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Untuk jaringan klinik & rumah sakit",
    features: [
      "Pengguna tak terbatas",
      "Semua fitur Professional",
      "Multi-cabang",
      "Integrasi SatuSehat",
      "Custom branding",
      "Dedicated support",
      "SLA 99.9%",
      "On-premise option",
    ],
    popular: false,
  },
];

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ============================================================
// SECTION WRAPPER
// ============================================================

function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// ============================================================
// FLOATING PARTICLES (client-only to avoid hydration mismatch)
// ============================================================

const particlePositions = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i * 5 + 2) % 100}%`,
  top: `${(i * 7 + 3) % 100}%`,
  duration: 3 + (i % 5),
  delay: (i % 4) * 0.8,
}));

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particlePositions.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary-400/30"
          style={{
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================
// COUNTER ANIMATION
// ============================================================

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div ref={ref} variants={fadeInUp} className="text-center">
      <motion.div
        className="text-3xl md:text-4xl font-bold text-white"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {value}
      </motion.div>
      <p className="text-sm md:text-base text-white/70 mt-1">{label}</p>
    </motion.div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hero slideshow auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ============================================================ */}
      {/* NAVBAR */}
      {/* ============================================================ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-lg border-b border-border"
            : "bg-primary-950/60 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo/clinexa-icon.svg"
                alt="Clinexa"
                width={40}
                height={40}
                className="w-10 h-10 shrink-0"
              />
              <div>
                <span
                  className={`font-bold text-lg transition-colors duration-300 ${scrolled ? "text-foreground" : "text-white"}`}
                >
                  <span className="font-light">clin</span>
                  <span className="font-bold">exa</span>
                </span>
                <span
                  className={`hidden sm:block text-[10px] -mt-1 transition-colors duration-300 tracking-wider uppercase ${scrolled ? "text-muted-foreground" : "text-white/60"}`}
                >
                  Bicara. Catat. Sembuhkan.
                </span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
                    scrolled
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href="#kontak"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Demo Gratis
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "hover:bg-muted" : "hover:bg-white/10 text-white"}`}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden border-b transition-colors duration-300 ${
              scrolled
                ? "bg-background/95 backdrop-blur-xl border-border"
                : "bg-primary-950/90 backdrop-blur-xl border-white/10"
            }`}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
              <div
                className={`pt-2 border-t space-y-2 ${scrolled ? "border-border" : "border-white/10"}`}
              >
                <Link
                  href="/login"
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:bg-muted"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  Masuk
                </Link>
                <a
                  href="#kontak"
                  className="block px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white text-sm font-semibold text-center"
                >
                  Demo Gratis
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0">
          {/* Hero Slideshow — crossfade with Ken Burns */}
          <AnimatePresence>
            <motion.div
              key={currentImage}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url('${heroImages[currentImage]}')`,
              }}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1.12 }}
              exit={{ opacity: 0, scale: 1.15 }}
              transition={{
                opacity: { duration: 1.5, ease: "easeInOut" },
                scale: { duration: 6, ease: "linear" },
              }}
            />
          </AnimatePresence>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/90 via-primary-900/85 to-primary-800/80" />
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="heroGrid"
                  width="60"
                  height="60"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#heroGrid)" />
            </svg>
          </div>
          <FloatingParticles />
          {/* Gradient orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(6,182,212,0.25) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
            }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Clinexa — Bicara. Catat. Sembuhkan.</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Suara Anda Jadi
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300">
              Rekam Medis
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10"
          >
            Satu platform untuk mengelola pasien, antrian, rekam medis, farmasi,
            dan billing. Dilengkapi{" "}
            <span className="text-cyan-300 font-semibold">
              AI Voice Command
            </span>{" "}
            untuk dokumentasi medis hands-free.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#kontak"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-primary-700 font-bold text-lg shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            >
              Mulai Demo Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#fitur"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Lihat Fitur
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
              />
            ))}
          </motion.div>

          {/* Slideshow indicators + Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          >
            {/* Slide dots */}
            <div className="flex items-center gap-2">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`rounded-full transition-all duration-500 ${
                    i === currentImage
                      ? "w-8 h-2 bg-white"
                      : "w-2 h-2 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            {/* Scroll down arrow */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChevronDown className="w-6 h-6 text-white/50" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION */}
      {/* ============================================================ */}
      <Section id="fitur" className="py-20 md:py-32 bg-background relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Fitur Lengkap
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Semua yang Klinik Anda{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Butuhkan
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Dari pendaftaran pasien hingga laporan keuangan, semua
              terintegrasi dalam satu platform yang mudah digunakan.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
              >
                {feature.badge && (
                  <span className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
                    {feature.badge}
                  </span>
                )}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* VOICE COMMAND HIGHLIGHT */}
      {/* ============================================================ */}
      <Section className="py-20 md:py-32 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden">
        <FloatingParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <motion.div variants={fadeInLeft}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cyan-300 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Fitur Unggulan
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Dokumentasi Medis
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Tanpa Mengetik
                </span>
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed">
                Dengan teknologi AI Voice Recognition, dokter cukup berbicara
                untuk mendokumentasikan pemeriksaan. Anamnesis, pemeriksaan
                fisik, diagnosis — semua tercatat otomatis dalam Bahasa
                Indonesia.
              </p>
              <div className="space-y-4">
                {[
                  "Speech-to-text dalam Bahasa Indonesia",
                  "Real-time transcript langsung di form pemeriksaan",
                  "Hands-free — fokus ke pasien, bukan keyboard",
                  "Akurasi tinggi dengan AI recognition",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    variants={fadeInLeft}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span className="text-white/80">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div variants={fadeInRight} className="relative">
              <div className="relative rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 md:p-8">
                {/* Mock UI */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-white/40 text-sm ml-2">
                      Pemeriksaan Pasien
                    </span>
                  </div>

                  {/* SOAP Fields */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-cyan-300 font-semibold mb-1">
                        Subjective
                      </p>
                      <motion.p
                        className="text-white/80 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        Pasien mengeluh demam sejak 3 hari yang lalu, disertai
                        batuk dan pilek...
                      </motion.p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-cyan-300 font-semibold mb-1">
                        Objective
                      </p>
                      <motion.p
                        className="text-white/80 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        TD: 120/80 mmHg, Suhu: 38.5°C, Nadi: 88x/menit...
                      </motion.p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-xs text-cyan-300 font-semibold mb-1">
                        Assessment
                      </p>
                      <motion.p
                        className="text-white/80 text-sm"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        J06.9 — Infeksi Saluran Pernapasan Atas Akut
                      </motion.p>
                    </div>
                  </div>

                  {/* Voice indicator */}
                  <motion.div
                    className="flex items-center justify-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex items-center gap-1">
                      {[8, 20, 14, 26, 10, 22, 16, 28, 12, 18, 24, 10].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full bg-cyan-400"
                            animate={{
                              height: [4, h, 4],
                            }}
                            transition={{
                              duration: 0.5 + (i % 3) * 0.2,
                              repeat: Infinity,
                              delay: i * 0.05,
                            }}
                          />
                        ),
                      )}
                    </div>
                    <span className="text-cyan-300 text-sm font-medium">
                      Merekam...
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* ADVANTAGES */}
      {/* ============================================================ */}
      <Section id="keunggulan" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Mengapa Clinexa?
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Keunggulan yang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Membedakan
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((item, index) => (
              <motion.div
                key={item.title}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* WORKFLOW */}
      {/* ============================================================ */}
      <Section
        id="workflow"
        className="py-20 md:py-32 bg-muted/50 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Alur Kerja
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Dari Pendaftaran hingga{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Laporan
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Alur kerja yang terintegrasi penuh, tanpa celah, tanpa input
              ganda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="relative p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
              >
                <span className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                  {step.step}
                </span>
                <div className="mt-2">
                  <step.icon className="w-8 h-8 text-primary-500 mb-3" />
                  <h3 className="font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* TESTIMONIALS */}
      {/* ============================================================ */}
      <Section id="testimoni" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Testimoni
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Dipercaya oleh{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Profesional Medis
              </span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-lg transition-all duration-300"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* PRICING */}
      {/* ============================================================ */}
      <Section id="harga" className="py-20 md:py-32 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-4 dark:bg-primary-900/30 dark:text-primary-300">
              Harga
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Pilih Paket yang{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">
                Sesuai
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Mulai dari klinik kecil hingga jaringan rumah sakit. Semua paket
              termasuk update gratis dan dukungan teknis.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-b from-primary-50 to-card border-primary-300 shadow-xl dark:from-primary-950/50 dark:border-primary-700"
                    : "bg-card border-border hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 text-white text-xs font-bold">
                    Paling Populer
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.desc}
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Rp {plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#kontak"
                  className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:shadow-lg hover:scale-105"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {plan.price === "Custom" ? "Hubungi Kami" : "Mulai Sekarang"}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* CTA / CONTACT */}
      {/* ============================================================ */}
      <Section
        id="kontak"
        className="py-20 md:py-32 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 relative overflow-hidden"
      >
        <FloatingParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div variants={fadeInLeft}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Tertarik dengan
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Clinexa?
                </span>
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Jadwalkan demo gratis sekarang dan lihat bagaimana Clinexa dapat
                mengubah operasional klinik Anda. Tim kami siap membantu memilih
                solusi terbaik.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">WhatsApp</p>
                    <a
                      href="https://wa.me/6285709947075"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-semibold hover:text-cyan-300 transition-colors"
                    >
                      +62 857-0994-7075
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Email</p>
                    <p className="text-white font-semibold">info@clinexa.id</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-white/50 text-sm">Lokasi</p>
                    <p className="text-white font-semibold">Jambi, Indonesia</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div variants={fadeInRight}>
              <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">
                  Jadwalkan Demo Gratis
                </h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get("name");
                    const clinic = formData.get("clinic");
                    const phone = formData.get("phone");
                    const message = formData.get("message");
                    const waText = encodeURIComponent(
                      `Halo, saya ${name} dari ${clinic}. ${message || "Saya tertarik untuk demo  Clinexa. "} Hubungi saya di ${phone}.`,
                    );
                    window.open(
                      `https://wa.me/6285709947075?text=${waText}`,
                      "_blank",
                    );
                  }}
                >
                  <div>
                    <input
                      name="name"
                      type="text"
                      placeholder="Nama Lengkap"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      name="clinic"
                      type="text"
                      placeholder="Nama Klinik"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="Nomor WhatsApp"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Saya tertarik untuk demo Clinexa"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] transition-all duration-300"
                  >
                    Kirim & Jadwalkan Demo
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="bg-primary-950 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/logo/clinexa-icon.svg"
                  alt="Clinexa"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <span className="font-bold text-lg text-white">
                  <span className="font-light">clin</span>exa
                </span>
              </div>
              <p className="text-white/50 text-sm max-w-md leading-relaxed">
                Clinexa adalah sistem manajemen klinik berbasis AI yang
                dirancang untuk mendigitalisasi seluruh operasional klinik Anda.
                Satu aplikasi, seluruh kebutuhan klinik.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Produk</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li>
                  <a
                    href="#fitur"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#harga"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Harga
                  </a>
                </li>
                <li>
                  <a
                    href="#testimoni"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                    Testimoni
                  </a>
                </li>
                <li>
                  <a
                    href="#kontak"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Demo Gratis
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-white mb-4">Kontak</h4>
              <ul className="space-y-3 text-sm text-white/50">
                <li>
                  <a
                    href="https://wa.me/6285709947075"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    +62 857-0994-7075
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@clinexa.id"
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    info@clinexa.id
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Jambi, Indonesia
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              &copy; 2026 Clinexa. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
