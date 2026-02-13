"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  Search,
  HeartPulse,
  Thermometer,
  Forward,
  FileText,
  X,
} from "lucide-react";
import { toast } from "sonner";
import medicalLetterService from "@/services/medical-letter.service";
import patientService from "@/services/patient.service";
import userService from "@/services/user.service";
import type {
  MedicalLetter,
  LetterType,
  CreateMedicalLetterPayload,
} from "@/types/medical-letter";
import { LETTER_TYPE_LABELS } from "@/types/medical-letter";
import type { Patient } from "@/types/patient";
import type { User } from "@/types/auth";

interface LetterFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  letter?: MedicalLetter | null;
  onSuccess: () => void;
}

const LETTER_TYPE_OPTIONS: {
  value: LetterType;
  label: string;
  icon: React.ElementType;
  theme: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  iconBgClass: string;
}[] = [
  {
    value: "surat_sehat",
    label: LETTER_TYPE_LABELS.surat_sehat,
    icon: HeartPulse,
    theme: "green",
    bgClass: "bg-green-50 dark:bg-green-950",
    borderClass: "border-green-300 dark:border-green-700",
    textClass: "text-green-700 dark:text-green-300",
    iconBgClass: "bg-green-100 dark:bg-green-900",
  },
  {
    value: "surat_sakit",
    label: LETTER_TYPE_LABELS.surat_sakit,
    icon: Thermometer,
    theme: "red",
    bgClass: "bg-red-50 dark:bg-red-950",
    borderClass: "border-red-300 dark:border-red-700",
    textClass: "text-red-700 dark:text-red-300",
    iconBgClass: "bg-red-100 dark:bg-red-900",
  },
  {
    value: "surat_rujukan",
    label: LETTER_TYPE_LABELS.surat_rujukan,
    icon: Forward,
    theme: "blue",
    bgClass: "bg-blue-50 dark:bg-blue-950",
    borderClass: "border-blue-300 dark:border-blue-700",
    textClass: "text-blue-700 dark:text-blue-300",
    iconBgClass: "bg-blue-100 dark:bg-blue-900",
  },
  {
    value: "surat_keterangan",
    label: LETTER_TYPE_LABELS.surat_keterangan,
    icon: FileText,
    theme: "purple",
    bgClass: "bg-purple-50 dark:bg-purple-950",
    borderClass: "border-purple-300 dark:border-purple-700",
    textClass: "text-purple-700 dark:text-purple-300",
    iconBgClass: "bg-purple-100 dark:bg-purple-900",
  },
];

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function calculateSickDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays > 0 ? diffDays : 0;
}

export function LetterFormModal({
  open,
  onOpenChange,
  letter,
  onSuccess,
}: LetterFormModalProps) {
  const isEdit = !!letter;

  // Form state
  const [letterType, setLetterType] = useState<LetterType>("surat_sehat");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [doctorId, setDoctorId] = useState<string>("");
  const [letterDate, setLetterDate] = useState<string>(getTodayString());
  const [notes, setNotes] = useState<string>("");

  // Surat Sehat fields
  const [healthPurpose, setHealthPurpose] = useState<string>("");
  const [examinationResult, setExaminationResult] = useState<string>("");

  // Surat Sakit fields
  const [sickStartDate, setSickStartDate] = useState<string>("");
  const [sickEndDate, setSickEndDate] = useState<string>("");
  const [sickDays, setSickDays] = useState<number>(0);
  const [sickPurpose, setSickPurpose] = useState<string>("");

  // Surat Rujukan fields
  const [referralDestination, setReferralDestination] = useState<string>("");
  const [referralSpecialist, setReferralSpecialist] = useState<string>("");
  const [referralReason, setReferralReason] = useState<string>("");
  const [diagnosisSummary, setDiagnosisSummary] = useState<string>("");
  const [treatmentSummary, setTreatmentSummary] = useState<string>("");

  // Surat Keterangan fields
  const [keteranganPurpose, setKeteranganPurpose] = useState<string>("");
  const [statementContent, setStatementContent] = useState<string>("");

  // Patient search state
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>("");
  const [patientSearchResults, setPatientSearchResults] = useState<Patient[]>(
    [],
  );
  const [isSearchingPatients, setIsSearchingPatients] =
    useState<boolean>(false);
  const [showPatientDropdown, setShowPatientDropdown] =
    useState<boolean>(false);

  // Doctor list state
  const [doctors, setDoctors] = useState<User[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState<boolean>(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Debounce ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const patientDropdownRef = useRef<HTMLDivElement>(null);

  // Load doctors on mount
  useEffect(() => {
    if (open) {
      const loadDoctors = async () => {
        setIsLoadingDoctors(true);
        try {
          const response = await userService.getDoctorsByDepartment();
          if (response.success) {
            setDoctors(response.data);
          }
        } catch (error) {
          console.error("Error loading doctors:", error);
        } finally {
          setIsLoadingDoctors(false);
        }
      };
      loadDoctors();
    }
  }, [open]);

  // Auto-calculate sick days
  useEffect(() => {
    if (sickStartDate && sickEndDate) {
      const days = calculateSickDays(sickStartDate, sickEndDate);
      setSickDays(days);
    }
  }, [sickStartDate, sickEndDate]);

  // Debounced patient search
  const handlePatientSearch = useCallback((query: string) => {
    setPatientSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length < 2) {
      setPatientSearchResults([]);
      setShowPatientDropdown(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingPatients(true);
      try {
        const response = await patientService.searchPatients(query, 10);
        if (response.success) {
          setPatientSearchResults(response.data);
          setShowPatientDropdown(true);
        }
      } catch (error) {
        console.error("Error searching patients:", error);
      } finally {
        setIsSearchingPatients(false);
      }
    }, 300);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Click outside to close patient dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPatientDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setLetterType("surat_sehat");
    setSelectedPatient(null);
    setDoctorId("");
    setLetterDate(getTodayString());
    setNotes("");
    setHealthPurpose("");
    setExaminationResult("");
    setSickStartDate("");
    setSickEndDate("");
    setSickDays(0);
    setSickPurpose("");
    setReferralDestination("");
    setReferralSpecialist("");
    setReferralReason("");
    setDiagnosisSummary("");
    setTreatmentSummary("");
    setKeteranganPurpose("");
    setStatementContent("");
    setPatientSearchQuery("");
    setPatientSearchResults([]);
    setShowPatientDropdown(false);
  }, []);

  // Populate form for edit mode
  useEffect(() => {
    if (open && letter) {
      setLetterType(letter.letter_type);
      setDoctorId(letter.doctor_id.toString());
      setLetterDate(letter.letter_date);
      setNotes(letter.notes || "");

      if (letter.patient) {
        setSelectedPatient(letter.patient);
      }

      // Surat Sehat
      setHealthPurpose(letter.health_purpose || "");
      setExaminationResult(letter.examination_result || "");

      // Surat Sakit
      setSickStartDate(letter.sick_start_date || "");
      setSickEndDate(letter.sick_end_date || "");
      setSickDays(letter.sick_days || 0);
      setSickPurpose(letter.purpose || "");

      // Surat Rujukan
      setReferralDestination(letter.referral_destination || "");
      setReferralSpecialist(letter.referral_specialist || "");
      setReferralReason(letter.referral_reason || "");
      setDiagnosisSummary(letter.diagnosis_summary || "");
      setTreatmentSummary(letter.treatment_summary || "");

      // Surat Keterangan
      setKeteranganPurpose(letter.purpose || "");
      setStatementContent(letter.statement_content || "");
    } else if (open && !letter) {
      resetForm();
    }
  }, [open, letter, resetForm]);

  // Handle patient selection
  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchQuery("");
    setPatientSearchResults([]);
    setShowPatientDropdown(false);
  };

  // Handle clear patient
  const handleClearPatient = () => {
    setSelectedPatient(null);
    setPatientSearchQuery("");
    setPatientSearchResults([]);
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!selectedPatient) {
      toast.error("Silakan pilih pasien terlebih dahulu");
      return;
    }
    if (!doctorId) {
      toast.error("Silakan pilih dokter terlebih dahulu");
      return;
    }
    if (!letterDate) {
      toast.error("Silakan isi tanggal surat");
      return;
    }

    const payload: CreateMedicalLetterPayload = {
      letter_type: letterType,
      patient_id: selectedPatient.id,
      doctor_id: parseInt(doctorId, 10),
      letter_date: letterDate,
      notes: notes || undefined,
    };

    // Add type-specific fields
    switch (letterType) {
      case "surat_sehat":
        payload.health_purpose = healthPurpose || undefined;
        payload.examination_result = examinationResult || undefined;
        break;
      case "surat_sakit":
        payload.sick_start_date = sickStartDate || undefined;
        payload.sick_end_date = sickEndDate || undefined;
        payload.sick_days = sickDays || undefined;
        payload.purpose = sickPurpose || undefined;
        break;
      case "surat_rujukan":
        payload.referral_destination = referralDestination || undefined;
        payload.referral_specialist = referralSpecialist || undefined;
        payload.referral_reason = referralReason || undefined;
        payload.diagnosis_summary = diagnosisSummary || undefined;
        payload.treatment_summary = treatmentSummary || undefined;
        break;
      case "surat_keterangan":
        payload.purpose = keteranganPurpose || undefined;
        payload.statement_content = statementContent || undefined;
        break;
    }

    setIsSubmitting(true);
    try {
      if (isEdit && letter) {
        await medicalLetterService.updateLetter(letter.id, payload);
        toast.success("Surat berhasil diperbarui");
      } else {
        await medicalLetterService.createLetter(payload);
        toast.success("Surat berhasil dibuat");
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Terjadi kesalahan saat menyimpan surat";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Surat Medis" : "Buat Surat Medis Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi surat medis di bawah ini."
              : "Pilih jenis surat dan isi informasi yang diperlukan."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Letter Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Jenis Surat <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {LETTER_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = letterType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isEdit}
                    onClick={() => setLetterType(option.value)}
                    className={`relative flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                      isSelected
                        ? `${option.bgClass} ${option.borderClass}`
                        : "border-border bg-background hover:bg-muted/50"
                    } ${isEdit ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isSelected
                          ? option.iconBgClass
                          : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isSelected
                            ? option.textClass
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium leading-tight ${
                        isSelected
                          ? option.textClass
                          : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Patient Search */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Pasien <span className="text-destructive">*</span>
            </Label>

            {selectedPatient ? (
              <div className="flex items-start justify-between rounded-lg border bg-muted/30 p-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{selectedPatient.name}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>MRN: {selectedPatient.medical_record_number}</span>
                    {selectedPatient.birth_date && (
                      <span>Tgl Lahir: {selectedPatient.birth_date}</span>
                    )}
                    {selectedPatient.gender && (
                      <span>
                        {selectedPatient.gender === "male"
                          ? "Laki-laki"
                          : "Perempuan"}
                      </span>
                    )}
                  </div>
                  {selectedPatient.address && (
                    <p className="text-xs text-muted-foreground">
                      {selectedPatient.address}
                    </p>
                  )}
                  {selectedPatient.nik && (
                    <p className="text-xs text-muted-foreground">
                      NIK: {selectedPatient.nik}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={handleClearPatient}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative" ref={patientDropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari pasien (nama, No. RM, NIK)..."
                    className="pl-10 pr-10"
                    value={patientSearchQuery}
                    onChange={(e) => handlePatientSearch(e.target.value)}
                    onFocus={() => {
                      if (patientSearchResults.length > 0) {
                        setShowPatientDropdown(true);
                      }
                    }}
                  />
                  {isSearchingPatients && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
                </div>

                {showPatientDropdown && patientSearchResults.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                    <div className="max-h-[200px] overflow-y-auto p-1">
                      {patientSearchResults.map((patient) => (
                        <button
                          key={patient.id}
                          type="button"
                          className="flex w-full flex-col gap-0.5 rounded-sm px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground"
                          onClick={() => handleSelectPatient(patient)}
                        >
                          <span className="text-sm font-medium">
                            {patient.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            MRN: {patient.medical_record_number}
                            {patient.nik ? ` | NIK: ${patient.nik}` : ""}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {showPatientDropdown &&
                  patientSearchResults.length === 0 &&
                  patientSearchQuery.trim().length >= 2 &&
                  !isSearchingPatients && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-3 shadow-md">
                      <p className="text-center text-sm text-muted-foreground">
                        Pasien tidak ditemukan
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Doctor Select */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Dokter <span className="text-destructive">*</span>
            </Label>
            <Select
              value={doctorId}
              onValueChange={setDoctorId}
              disabled={isLoadingDoctors}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingDoctors ? "Memuat daftar dokter..." : "Pilih dokter"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id.toString()}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Letter Date */}
          <div className="space-y-2">
            <Label htmlFor="letter_date" className="text-sm font-medium">
              Tanggal Surat <span className="text-destructive">*</span>
            </Label>
            <Input
              id="letter_date"
              type="date"
              value={letterDate}
              onChange={(e) => setLetterDate(e.target.value)}
            />
          </div>

          <Separator />

          {/* Dynamic Fields Based on Letter Type */}
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              Detail {LETTER_TYPE_LABELS[letterType]}
            </Label>

            {/* Surat Sehat Fields */}
            {letterType === "surat_sehat" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="health_purpose" className="text-sm font-medium">
                    Keperluan
                  </Label>
                  <Input
                    id="health_purpose"
                    placeholder="Melamar kerja, sekolah, dll"
                    value={healthPurpose}
                    onChange={(e) => setHealthPurpose(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="examination_result"
                    className="text-sm font-medium"
                  >
                    Hasil Pemeriksaan
                  </Label>
                  <Textarea
                    id="examination_result"
                    placeholder="Tuliskan hasil pemeriksaan..."
                    value={examinationResult}
                    onChange={(e) => setExaminationResult(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Surat Sakit Fields */}
            {letterType === "surat_sakit" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sick_start_date"
                      className="text-sm font-medium"
                    >
                      Tanggal Mulai Sakit
                    </Label>
                    <Input
                      id="sick_start_date"
                      type="date"
                      value={sickStartDate}
                      onChange={(e) => setSickStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="sick_end_date"
                      className="text-sm font-medium"
                    >
                      Tanggal Selesai Sakit
                    </Label>
                    <Input
                      id="sick_end_date"
                      type="date"
                      value={sickEndDate}
                      onChange={(e) => setSickEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sick_days" className="text-sm font-medium">
                    Jumlah Hari Sakit
                  </Label>
                  <Input
                    id="sick_days"
                    type="number"
                    min={0}
                    value={sickDays}
                    onChange={(e) =>
                      setSickDays(parseInt(e.target.value, 10) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sick_purpose" className="text-sm font-medium">
                    Keperluan/Keterangan
                  </Label>
                  <Input
                    id="sick_purpose"
                    placeholder="Keperluan surat keterangan sakit..."
                    value={sickPurpose}
                    onChange={(e) => setSickPurpose(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Surat Rujukan Fields */}
            {letterType === "surat_rujukan" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="referral_destination"
                    className="text-sm font-medium"
                  >
                    Tujuan Rujukan
                  </Label>
                  <Input
                    id="referral_destination"
                    placeholder="Nama rumah sakit atau fasilitas kesehatan tujuan..."
                    value={referralDestination}
                    onChange={(e) => setReferralDestination(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="referral_specialist"
                    className="text-sm font-medium"
                  >
                    Spesialis Tujuan
                  </Label>
                  <Input
                    id="referral_specialist"
                    placeholder="Spesialis yang dituju..."
                    value={referralSpecialist}
                    onChange={(e) => setReferralSpecialist(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="referral_reason"
                    className="text-sm font-medium"
                  >
                    Alasan Rujukan
                  </Label>
                  <Textarea
                    id="referral_reason"
                    placeholder="Alasan merujuk pasien..."
                    value={referralReason}
                    onChange={(e) => setReferralReason(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="diagnosis_summary"
                    className="text-sm font-medium"
                  >
                    Ringkasan Diagnosa
                  </Label>
                  <Textarea
                    id="diagnosis_summary"
                    placeholder="Ringkasan diagnosa pasien..."
                    value={diagnosisSummary}
                    onChange={(e) => setDiagnosisSummary(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="treatment_summary"
                    className="text-sm font-medium"
                  >
                    Tindakan yang Sudah Dilakukan
                  </Label>
                  <Textarea
                    id="treatment_summary"
                    placeholder="Tindakan medis yang telah dilakukan..."
                    value={treatmentSummary}
                    onChange={(e) => setTreatmentSummary(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Surat Keterangan Fields */}
            {letterType === "surat_keterangan" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="keterangan_purpose"
                    className="text-sm font-medium"
                  >
                    Keperluan
                  </Label>
                  <Input
                    id="keterangan_purpose"
                    placeholder="Keperluan surat keterangan..."
                    value={keteranganPurpose}
                    onChange={(e) => setKeteranganPurpose(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="statement_content"
                    className="text-sm font-medium"
                  >
                    Isi Keterangan
                  </Label>
                  <Textarea
                    id="statement_content"
                    placeholder="Tuliskan isi keterangan dokter..."
                    value={statementContent}
                    onChange={(e) => setStatementContent(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Catatan
            </Label>
            <Textarea
              id="notes"
              placeholder="Catatan tambahan (opsional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Buat Surat"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
