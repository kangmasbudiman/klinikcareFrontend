"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Heart,
  FileText,
  Users,
  Stethoscope,
  Clock,
  Building2,
  Pill,
  Receipt,
  Activity,
  RefreshCw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { Patient } from "@/types/patient";
import type { MedicalRecord } from "@/types/medical-record";
import patientService from "@/services/patient.service";
import medicalRecordService from "@/services/medical-record.service";
import { formatDate } from "@/lib/utils";

export default function PatientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = Number(params.id);

  // State
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  // Pagination for medical history
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch patient data
  const fetchPatient = useCallback(async () => {
    try {
      const response = await patientService.getPatientById(patientId);
      setPatient(response.data);
    } catch (error) {
      console.error("Error fetching patient:", error);
      toast.error("Gagal memuat data pasien");
    }
  }, [patientId]);

  // Fetch medical history
  const fetchMedicalHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await medicalRecordService.getPatientMedicalHistory(
        patientId,
        currentPage,
        10
      );
      setMedicalRecords(response.data);
      if (response.meta) {
        setTotalPages(response.meta.last_page);
        setTotalRecords(response.meta.total);
      }
    } catch (error) {
      console.error("Error fetching medical history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [patientId, currentPage]);

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPatient();
      setIsLoading(false);
    };
    loadData();
  }, [fetchPatient]);

  // Load medical history when page changes
  useEffect(() => {
    if (patientId) {
      fetchMedicalHistory();
    }
  }, [fetchMedicalHistory, patientId]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status badge for medical record
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Selesai</Badge>;
      case "in_progress":
        return <Badge variant="warning">Dalam Pemeriksaan</Badge>;
      case "cancelled":
        return <Badge variant="error">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get payment status badge
  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success">Lunas</Badge>;
      case "partial":
        return <Badge variant="warning">Sebagian</Badge>;
      case "unpaid":
        return <Badge variant="error">Belum Bayar</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-[400px] lg:col-span-1" />
          <Skeleton className="h-[400px] lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Pasien tidak ditemukan</h2>
        <p className="text-muted-foreground mb-4">
          Data pasien dengan ID {patientId} tidak ada
        </p>
        <Button onClick={() => router.push("/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Daftar Pasien
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/patients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Detail Pasien</h1>
            <p className="text-muted-foreground">
              {patient.medical_record_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              fetchPatient();
              fetchMedicalHistory();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => router.push(`/patients?edit=${patient.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Pasien
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative">
                  <div
                    className={`h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold ${
                      patient.gender === "male" ? "bg-blue-500" : "bg-pink-500"
                    }`}
                  >
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-background flex items-center justify-center ${
                      patient.is_active ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  >
                    {patient.is_active ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-semibold">{patient.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {patient.medical_record_number}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={patientService.getPatientTypeColorClass(
                      patient.patient_type
                    )}
                  >
                    {patient.patient_type_label}
                  </Badge>
                  <Badge variant={patient.is_active ? "success" : "error"}>
                    {patient.is_active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
              </div>

              <Separator className="mb-4" />

              {/* Patient Details */}
              <div className="space-y-3">
                {/* Basic Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tanggal Lahir
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(patient.birth_date)} (
                      {patientService.formatAge(patient.birth_date)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Jenis Kelamin
                    </p>
                    <p className="text-sm font-medium">{patient.gender_label}</p>
                  </div>
                </div>

                {/* ID Numbers */}
                {patient.nik && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">NIK</p>
                      <p className="text-sm font-mono">{patient.nik}</p>
                    </div>
                  </div>
                )}

                {patient.bpjs_number && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                    <Shield className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-muted-foreground">No. BPJS</p>
                      <p className="text-sm font-mono">{patient.bpjs_number}</p>
                    </div>
                  </div>
                )}

                {/* Contact */}
                {patient.phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telepon</p>
                      <p className="text-sm">
                        {patientService.formatPhone(patient.phone)}
                      </p>
                    </div>
                  </div>
                )}

                {patient.email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{patient.email}</p>
                    </div>
                  </div>
                )}

                {/* Address */}
                {patient.full_address && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alamat</p>
                      <p className="text-sm">{patient.full_address}</p>
                    </div>
                  </div>
                )}

                {/* Allergies */}
                {patient.allergies && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950">
                    <Heart className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Alergi</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {patient.allergies}
                      </p>
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {patient.emergency_contact_name && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                    <Users className="h-4 w-4 text-orange-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Kontak Darurat
                      </p>
                      <p className="text-sm font-medium">
                        {patient.emergency_contact_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.emergency_contact_relation}
                        {patient.emergency_contact_phone &&
                          ` - ${patientService.formatPhone(patient.emergency_contact_phone)}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {patient.blood_type && (
                    <div className="p-2 rounded bg-muted/50 text-center">
                      <span className="text-muted-foreground text-xs block">
                        Gol. Darah
                      </span>
                      <span className="font-bold text-lg">
                        {patient.blood_type}
                      </span>
                    </div>
                  )}
                  {patient.religion_label && (
                    <div className="p-2 rounded bg-muted/50">
                      <span className="text-muted-foreground text-xs block">
                        Agama
                      </span>
                      <span className="font-medium">
                        {patient.religion_label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Medical History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Riwayat Pengobatan
                </CardTitle>
                <Badge variant="secondary">{totalRecords} kunjungan</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : medicalRecords.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Belum ada riwayat pengobatan</p>
                </div>
              ) : (
                <>
                  <Accordion type="single" collapsible className="space-y-3">
                    {medicalRecords.map((record, index) => (
                      <AccordionItem
                        key={record.id}
                        value={`record-${record.id}`}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              <div className="flex flex-col items-center justify-center w-14 h-14 rounded-lg bg-primary/10">
                                <span className="text-lg font-bold text-primary">
                                  {format(
                                    new Date(record.visit_date),
                                    "dd"
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {format(
                                    new Date(record.visit_date),
                                    "MMM yy",
                                    { locale: localeId }
                                  )}
                                </span>
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">
                                    {record.department?.name || "Poli Umum"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Stethoscope className="h-3 w-3" />
                                  <span>
                                    {record.doctor?.name || "Dokter"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(record.status)}
                              {record.invoice &&
                                getPaymentBadge(record.invoice.payment_status)}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="space-y-4 pt-2">
                            {/* Keluhan */}
                            {record.chief_complaint && (
                              <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Keluhan Utama
                                </p>
                                <p className="text-sm">
                                  {record.chief_complaint}
                                </p>
                              </div>
                            )}

                            {/* Vital Signs */}
                            {(record.blood_pressure ||
                              record.temperature ||
                              record.heart_rate) && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {record.blood_pressure && (
                                  <div className="p-2 rounded bg-blue-50 dark:bg-blue-950 text-center">
                                    <p className="text-xs text-muted-foreground">
                                      Tekanan Darah
                                    </p>
                                    <p className="font-medium text-blue-700 dark:text-blue-300">
                                      {record.blood_pressure}
                                    </p>
                                  </div>
                                )}
                                {record.heart_rate && (
                                  <div className="p-2 rounded bg-red-50 dark:bg-red-950 text-center">
                                    <p className="text-xs text-muted-foreground">
                                      Nadi
                                    </p>
                                    <p className="font-medium text-red-700 dark:text-red-300">
                                      {record.heart_rate} bpm
                                    </p>
                                  </div>
                                )}
                                {record.temperature && (
                                  <div className="p-2 rounded bg-orange-50 dark:bg-orange-950 text-center">
                                    <p className="text-xs text-muted-foreground">
                                      Suhu
                                    </p>
                                    <p className="font-medium text-orange-700 dark:text-orange-300">
                                      {record.temperature}°C
                                    </p>
                                  </div>
                                )}
                                {record.weight && (
                                  <div className="p-2 rounded bg-green-50 dark:bg-green-950 text-center">
                                    <p className="text-xs text-muted-foreground">
                                      Berat Badan
                                    </p>
                                    <p className="font-medium text-green-700 dark:text-green-300">
                                      {record.weight} kg
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Diagnosis */}
                            {record.diagnosis && (
                              <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Diagnosis
                                </p>
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                  {record.diagnosis}
                                </p>
                                {record.diagnosis_notes && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {record.diagnosis_notes}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Treatment */}
                            {record.treatment && (
                              <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground mb-1">
                                  Tindakan
                                </p>
                                <p className="text-sm">{record.treatment}</p>
                              </div>
                            )}

                            {/* Prescriptions */}
                            {record.prescriptions &&
                              record.prescriptions.length > 0 && (
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Pill className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-medium text-green-700 dark:text-green-300">
                                      Resep Obat
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    {record.prescriptions.map((prescription) =>
                                      prescription.items?.map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center justify-between text-sm"
                                        >
                                          <span>{item.medicine_name}</span>
                                          <span className="text-muted-foreground">
                                            {item.quantity}x - {item.dosage}{" "}
                                            {item.frequency}
                                          </span>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              )}

                            {/* Invoice */}
                            {record.invoice && (
                              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Receipt className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                      {record.invoice.invoice_number}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-blue-700 dark:text-blue-300">
                                      {formatCurrency(
                                        record.invoice.total_amount
                                      )}
                                    </p>
                                    {record.invoice.payment_method && (
                                      <p className="text-xs text-muted-foreground">
                                        {record.invoice.payment_method_label}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Follow Up */}
                            {record.follow_up_date && (
                              <div className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950 text-sm">
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-yellow-700 dark:text-yellow-300">
                                  Kontrol:{" "}
                                  {format(
                                    new Date(record.follow_up_date),
                                    "dd MMMM yyyy",
                                    { locale: localeId }
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
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
      </div>
    </div>
  );
}
