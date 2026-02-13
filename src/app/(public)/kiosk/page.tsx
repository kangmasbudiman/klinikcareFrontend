"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Printer,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Building2,
  Clock,
  RefreshCw,
  User,
  CalendarClock,
  Users,
} from "lucide-react";
/* eslint-disable @next/next/no-img-element */
import type { Department } from "@/types/department";
import type { Queue } from "@/types/queue";
import type { KioskDoctorSchedule } from "@/types/schedule";
import kioskService from "@/services/kiosk.service";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

type Step = "welcome" | "select-poli" | "select-doctor" | "success";

export default function KioskPage() {
  // Clinic settings
  const { settings: clinicSettings } = useClinicSettings();

  const [step, setStep] = useState<Step>("welcome");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [schedules, setSchedules] = useState<KioskDoctorSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = useState(true);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<KioskDoctorSchedule | null>(null);
  const [createdQueue, setCreatedQueue] = useState<Queue | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const [dayLabel, setDayLabel] = useState<string>("");
  const autoResetTimer = useRef<NodeJS.Timeout | null>(null);

  // Clinic info
  const clinicName = clinicSettings?.name || "Klinik App";
  const clinicTagline = clinicSettings?.tagline || "Sistem Antrian Pasien";
  const clinicLogo = clinicSettings?.logo_url;

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await kioskService.getDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoadingDepts(false);
      }
    };
    fetchDepartments();
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto reset after success (30 seconds)
  useEffect(() => {
    if (step === "success") {
      autoResetTimer.current = setTimeout(() => {
        handleReset();
      }, 30000);
    }
    return () => {
      if (autoResetTimer.current) {
        clearTimeout(autoResetTimer.current);
      }
    };
  }, [step]);

  const handleSelectDept = async (dept: Department) => {
    setSelectedDept(dept);
    setIsLoadingSchedules(true);
    setError(null);
    setStep("select-doctor");

    try {
      const response = await kioskService.getSchedulesByDepartment(dept.id);
      setSchedules(response.data);
      setDayLabel(response.day_label);
    } catch (err: any) {
      console.error("Error fetching schedules:", err);
      setError(
        err.response?.data?.message ||
          "Gagal memuat jadwal dokter. Silakan coba lagi.",
      );
      setSchedules([]);
    } finally {
      setIsLoadingSchedules(false);
    }
  };

  const handleSelectDoctor = async (schedule: KioskDoctorSchedule) => {
    setSelectedSchedule(schedule);
    setIsLoading(true);
    setError(null);

    try {
      const response = await kioskService.takeQueue(
        selectedDept!.id,
        schedule.doctor.id,
      );
      setCreatedQueue(response.data);
      setStep("success");
    } catch (err: any) {
      console.error("Error taking queue:", err);
      setError(
        err.response?.data?.message ||
          "Gagal mengambil nomor antrian. Silakan coba lagi.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPoli = () => {
    setStep("select-poli");
    setSelectedDept(null);
    setSchedules([]);
    setSelectedSchedule(null);
    setError(null);
  };

  const handleReset = () => {
    setStep("welcome");
    setSelectedDept(null);
    setSchedules([]);
    setSelectedSchedule(null);
    setCreatedQueue(null);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatScheduleTime = (time: string) => {
    // Handle both "HH:mm:ss" and "HH:mm" formats
    return time.substring(0, 5);
  };

  // Get color class
  const getColorClass = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        blue: {
          bg: "bg-blue-500",
          text: "text-blue-600",
          border: "border-blue-500",
        },
        green: {
          bg: "bg-green-500",
          text: "text-green-600",
          border: "border-green-500",
        },
        red: {
          bg: "bg-red-500",
          text: "text-red-600",
          border: "border-red-500",
        },
        yellow: {
          bg: "bg-yellow-500",
          text: "text-yellow-600",
          border: "border-yellow-500",
        },
        purple: {
          bg: "bg-purple-500",
          text: "text-purple-600",
          border: "border-purple-500",
        },
        pink: {
          bg: "bg-pink-500",
          text: "text-pink-600",
          border: "border-pink-500",
        },
        indigo: {
          bg: "bg-indigo-500",
          text: "text-indigo-600",
          border: "border-indigo-500",
        },
        cyan: {
          bg: "bg-cyan-500",
          text: "text-cyan-600",
          border: "border-cyan-500",
        },
        orange: {
          bg: "bg-orange-500",
          text: "text-orange-600",
          border: "border-orange-500",
        },
        teal: {
          bg: "bg-teal-500",
          text: "text-teal-600",
          border: "border-teal-500",
        },
      };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      {/* Header */}
      <header className="p-6 text-white text-center">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            {clinicLogo ? (
              <img
                src={clinicLogo}
                alt={clinicName}
                className="w-14 h-14 rounded-xl object-contain bg-white/10 p-1"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <Ticket className="w-7 h-7 text-white" />
              </div>
            )}
            <div className="text-left">
              <h1 className="text-2xl font-bold">{clinicName}</h1>
              <p className="text-blue-200 text-sm">{clinicTagline}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-mono font-bold">
              {formatTime(currentTime)}
            </p>
            <p className="text-blue-200 text-sm">{formatDate(currentTime)}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* Welcome Screen */}
          {step === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {clinicLogo ? (
                  <div className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 p-4 shadow-lg">
                    <img
                      src={clinicLogo}
                      alt={clinicName}
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Ticket className="w-16 h-16 text-white" />
                  </div>
                )}
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Selamat Datang
                </h2>
                <p className="text-xl text-blue-100 mb-12">
                  Silakan ambil nomor antrian Anda
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setStep("select-poli")}
                className="px-16 py-6 bg-white text-blue-600 rounded-2xl text-2xl font-bold shadow-2xl hover:bg-blue-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Ticket className="w-8 h-8" />
                  AMBIL ANTRIAN
                </span>
              </motion.button>
            </motion.div>
          )}

          {/* Select Poli Screen */}
          {step === "select-poli" && (
            <motion.div
              key="select-poli"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full max-w-4xl"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                {/* Back Button */}
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Kembali</span>
                </button>

                <div className="text-center mb-8">
                  <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h2 className="text-3xl font-bold text-gray-800">
                    Pilih Poli Tujuan
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Sentuh poli yang ingin Anda kunjungi
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Loading Departments */}
                {isLoadingDepts ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                  </div>
                ) : (
                  /* Department Grid */
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {departments.map((dept) => {
                      const colors = getColorClass(dept.color);
                      return (
                        <motion.button
                          key={dept.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleSelectDept(dept)}
                          disabled={isLoadingSchedules}
                          className={`p-6 rounded-2xl border-2 ${colors.border} bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div
                            className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
                          >
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                          <h3 className={`text-lg font-bold ${colors.text}`}>
                            {dept.name}
                          </h3>
                          {isLoadingSchedules &&
                            selectedDept?.id === dept.id && (
                              <Loader2 className="w-5 h-5 animate-spin mx-auto mt-2 text-gray-400" />
                            )}
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {departments.length === 0 && !isLoadingDepts && (
                  <div className="text-center py-12 text-gray-500">
                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Tidak ada poli tersedia saat ini</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Select Doctor Screen */}
          {step === "select-doctor" && selectedDept && (
            <motion.div
              key="select-doctor"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full max-w-4xl"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8">
                {/* Back Button */}
                <button
                  onClick={handleBackToPoli}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Kembali ke Pilih Poli</span>
                </button>

                <div className="text-center mb-8">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h2 className="text-3xl font-bold text-gray-800">
                    Pilih Dokter
                  </h2>
                  <p className="text-gray-500 mt-2">
                    Jadwal dokter{" "}
                    <span className="font-semibold text-gray-700">
                      {selectedDept.name}
                    </span>{" "}
                    hari{" "}
                    <span className="font-semibold text-gray-700">
                      {dayLabel}
                    </span>
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Loading Schedules */}
                {isLoadingSchedules ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-500">Memuat jadwal dokter...</p>
                  </div>
                ) : schedules.length > 0 ? (
                  /* Doctor Schedule Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schedules.map((schedule) => {
                      const deptColors = getColorClass(selectedDept.color);
                      return (
                        <motion.button
                          key={schedule.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectDoctor(schedule)}
                          disabled={isLoading}
                          className={`p-6 rounded-2xl border-2 ${deptColors.border} bg-white hover:bg-gray-50 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Doctor Avatar */}
                            <div
                              className={`w-14 h-14 ${deptColors.bg} rounded-xl flex items-center justify-center shrink-0`}
                            >
                              <User className="w-7 h-7 text-white" />
                            </div>

                            {/* Doctor Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 truncate">
                                {schedule.doctor.name}
                              </h3>

                              {/* Time Range */}
                              <div className="flex items-center gap-2 mt-2 text-gray-600">
                                <CalendarClock className="w-4 h-4 shrink-0" />
                                <span className="text-sm font-medium">
                                  {formatScheduleTime(schedule.start_time)} -{" "}
                                  {formatScheduleTime(schedule.end_time)}
                                </span>
                              </div>

                              {/* Remaining Quota */}
                              <div className="mt-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                    schedule.remaining_quota > 5
                                      ? "bg-green-100 text-green-700"
                                      : schedule.remaining_quota > 2
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  <Users className="w-3 h-3" />
                                  Sisa {schedule.remaining_quota} kuota
                                </span>
                              </div>
                            </div>

                            {/* Loading Indicator */}
                            {isLoading &&
                              selectedSchedule?.id === schedule.id && (
                                <Loader2 className="w-5 h-5 animate-spin text-gray-400 shrink-0" />
                              )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                ) : (
                  /* No Schedule Available */
                  <div className="text-center py-12 text-gray-500">
                    <CalendarClock className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">
                      Tidak ada jadwal dokter tersedia
                    </p>
                    <p className="text-sm mt-1">
                      Tidak ada dokter yang bertugas di poli ini hari ini, atau
                      kuota sudah habis
                    </p>
                    <button
                      onClick={handleBackToPoli}
                      className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                    >
                      Pilih Poli Lain
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Success Screen */}
          {step === "success" && createdQueue && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-full max-w-lg"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Success Header */}
                <div className="bg-green-500 p-6 text-center text-white">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <CheckCircle className="w-16 h-16 mx-auto mb-3" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Nomor Antrian Anda</h2>
                </div>

                {/* Ticket Content */}
                <div className="p-8 text-center" id="print-ticket">
                  {/* Clinic Header for Print */}
                  <div className="mb-4 pb-4 border-b border-dashed border-gray-300">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      {clinicLogo && (
                        <img
                          src={clinicLogo}
                          alt={clinicName}
                          className="w-10 h-10 object-contain"
                        />
                      )}
                      <div>
                        <p className="text-lg font-bold text-gray-800">
                          {clinicName}
                        </p>
                        {clinicTagline && (
                          <p className="text-xs text-gray-500">
                            {clinicTagline}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Queue Number */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="mb-6"
                  >
                    <p className="text-gray-500 text-sm mb-2">NOMOR ANTRIAN</p>
                    <p className="text-8xl font-black text-blue-600 tracking-wider">
                      {createdQueue.queue_code}
                    </p>
                  </motion.div>

                  {/* Department & Doctor */}
                  <div className="mb-6 py-4 border-t border-b border-dashed border-gray-300 space-y-3">
                    <div>
                      <p className="text-gray-500 text-sm">POLI TUJUAN</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {createdQueue.department?.name}
                      </p>
                    </div>
                    {createdQueue.doctor && (
                      <div>
                        <p className="text-gray-500 text-sm">DOKTER</p>
                        <p className="text-lg font-semibold text-gray-700">
                          {createdQueue.doctor.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Date & Time */}
                  <div className="flex justify-center gap-8 text-sm text-gray-500">
                    <div>
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatTime(currentTime)}
                    </div>
                    <div>{formatDate(currentTime)}</div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">
                    <p className="font-medium">
                      Harap menunggu di ruang tunggu
                    </p>
                    <p>Nomor antrian Anda akan dipanggil melalui speaker</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 bg-gray-50 flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrint}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Printer className="w-5 h-5" />
                    CETAK TIKET
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="flex-1 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    SELESAI
                  </motion.button>
                </div>

                {/* Auto Reset Notice */}
                <div className="px-6 pb-4 text-center text-xs text-gray-400">
                  Layar akan kembali otomatis dalam 30 detik
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-blue-200 text-sm">
        <p>Sentuh layar untuk memulai</p>
      </footer>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-ticket,
          #print-ticket * {
            visibility: visible;
          }
          #print-ticket {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 80mm;
            padding: 10mm;
            background: white;
          }
        }
      `}</style>
    </div>
  );
}
