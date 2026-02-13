"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  User,
  Calendar,
  Building2,
  FileText,
  Stethoscope,
  ClipboardList,
  Pill,
  MessageSquare,
  History,
  Loader2,
  NotebookPen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { VitalSignsForm } from "./vital-signs-form";
import {
  PrescriptionForm,
  type PrescriptionItemData,
} from "./prescription-form";
import { ServiceInput, type ServiceItemData } from "./service-input";
import { CpptForm } from "./cppt-form";
import { PatientHistoryModal } from "./patient-history-modal";
import type {
  MedicalRecord,
  UpdateMedicalRecordPayload,
} from "@/types/medical-record";
import type { Queue } from "@/types/queue";
import medicalRecordService from "@/services/medical-record.service";
import { toast } from "sonner";

interface ExaminationFormProps {
  medicalRecord: MedicalRecord;
  queue: Queue | null;
  onClose: () => void;
  onUpdate: (record: MedicalRecord) => void;
}

export function ExaminationForm({
  medicalRecord,
  queue,
  onClose,
  onUpdate,
}: ExaminationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("anamnesis");
  const [historyOpen, setHistoryOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UpdateMedicalRecordPayload>({
    // Anamnesis
    chief_complaint: medicalRecord.chief_complaint || "",
    present_illness: medicalRecord.present_illness || "",
    past_medical_history: medicalRecord.past_medical_history || "",
    family_history: medicalRecord.family_history || "",
    allergy_notes: medicalRecord.allergy_notes || "",
    // Vital Signs
    blood_pressure_systolic: medicalRecord.blood_pressure_systolic,
    blood_pressure_diastolic: medicalRecord.blood_pressure_diastolic,
    heart_rate: medicalRecord.heart_rate,
    respiratory_rate: medicalRecord.respiratory_rate,
    temperature: medicalRecord.temperature,
    weight: medicalRecord.weight,
    height: medicalRecord.height,
    oxygen_saturation: medicalRecord.oxygen_saturation,
    physical_examination: medicalRecord.physical_examination || "",
    // Diagnosis
    diagnosis: medicalRecord.diagnosis || "",
    diagnosis_notes: medicalRecord.diagnosis_notes || "",
    // Treatment
    treatment: medicalRecord.treatment || "",
    treatment_notes: medicalRecord.treatment_notes || "",
    // Recommendations
    recommendations: medicalRecord.recommendations || "",
    follow_up_date: medicalRecord.follow_up_date || "",
    // CPPT / SOAP
    soap_subjective: medicalRecord.soap_subjective || "",
    soap_objective: medicalRecord.soap_objective || "",
    soap_assessment: medicalRecord.soap_assessment || "",
    soap_plan: medicalRecord.soap_plan || "",
  });

  // Prescription items
  const [prescriptionItems, setPrescriptionItems] = useState<
    PrescriptionItemData[]
  >([]);

  // Services/Tindakan
  const [services, setServices] = useState<ServiceItemData[]>([]);

  // Load existing prescriptions
  useEffect(() => {
    if (medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0) {
      const existingItems = medicalRecord.prescriptions.flatMap((p) =>
        (p.items || []).map((item) => ({
          medicine_name: item.medicine_name,
          dosage: item.dosage || "",
          frequency: item.frequency || "",
          duration: item.duration || "",
          quantity: item.quantity,
          instructions: item.instructions || "",
        })),
      );
      setPrescriptionItems(existingItems);
    }
  }, [medicalRecord.prescriptions]);

  // Load existing services
  useEffect(() => {
    if (medicalRecord.services && medicalRecord.services.length > 0) {
      setServices(
        medicalRecord.services.map((s) => ({
          service_id: s.service_id ?? undefined,
          service_name: s.service_name,
          quantity: s.quantity,
          unit_price: s.unit_price,
        })),
      );
    }
  }, [medicalRecord.services]);

  // Handle form field change
  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle vital signs change
  const handleVitalChange = (field: string, value: number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Save form
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: UpdateMedicalRecordPayload = {
        ...formData,
        services: services.map((s) => ({
          service_name: s.service_name,
          quantity: s.quantity,
          unit_price: s.unit_price,
        })),
      };

      const response = await medicalRecordService.updateMedicalRecord(
        medicalRecord.id,
        payload,
      );
      onUpdate(response.data);

      // Save prescription if there are items
      if (
        prescriptionItems.length > 0 &&
        prescriptionItems.some((i) => i.medicine_name)
      ) {
        await medicalRecordService.addPrescription(medicalRecord.id, {
          items: prescriptionItems.filter((i) => i.medicine_name),
        });
      }

      toast.success("Data berhasil disimpan", {
        description: "Data pemeriksaan telah tersimpan",
      });
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan data", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Complete examination
  const handleComplete = async () => {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan pemeriksaan ini?"))
      return;

    setIsLoading(true);
    try {
      // Save first
      await handleSave();

      // Then complete
      const response = await medicalRecordService.completeExamination(
        medicalRecord.id,
        true,
      );
      toast.success("Pemeriksaan selesai", {
        description:
          "Invoice telah dibuat dan pasien dapat melanjutkan ke kasir",
      });
      onClose();
    } catch (error: any) {
      console.error("Error completing:", error);
      toast.error("Gagal menyelesaikan pemeriksaan", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const patient = medicalRecord.patient;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Form Pemeriksaan
            </h1>
            <p className="text-muted-foreground">
              {medicalRecord.record_number} - {queue?.queue_code}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan
          </Button>
          <Button onClick={handleComplete} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            Selesai Periksa
          </Button>
        </div>
      </motion.div>

      {/* Patient Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 grid gap-2 sm:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama Pasien</p>
                  <p className="font-semibold">{patient?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. RM</p>
                  <p className="font-medium">
                    {patient?.medical_record_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Umur / Jenis Kelamin
                  </p>
                  <p className="font-medium">
                    {patient?.age} tahun / {patient?.gender_label}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipe Pasien</p>
                  <Badge
                    variant={
                      patient?.patient_type === "bpjs" ? "success" : "secondary"
                    }
                  >
                    {patient?.patient_type_label}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryOpen(true)}
                >
                  <History className="h-4 w-4 mr-1" />
                  Riwayat
                </Button>
                <Badge variant="outline">
                  <Building2 className="h-3 w-3 mr-1" />
                  {medicalRecord.department?.name}
                </Badge>
                <Badge variant="outline">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(medicalRecord.visit_date).toLocaleDateString(
                    "id-ID",
                  )}
                </Badge>
              </div>
            </div>
            {patient?.allergies && (
              <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
                <strong>Alergi:</strong> {patient.allergies}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Form Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="anamnesis" className="gap-1">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">Anamnesis</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="gap-1">
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">Vital Signs</span>
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Diagnosis</span>
            </TabsTrigger>
            <TabsTrigger value="prescription" className="gap-1">
              <Pill className="h-4 w-4" />
              <span className="hidden sm:inline">Resep</span>
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Anjuran</span>
            </TabsTrigger>
            <TabsTrigger value="cppt" className="gap-1">
              <NotebookPen className="h-4 w-4" />
              <span className="hidden sm:inline">CPPT</span>
            </TabsTrigger>
          </TabsList>

          {/* Anamnesis Tab */}
          <TabsContent value="anamnesis" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anamnesis (Keluhan)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Keluhan Utama *</Label>
                  <Textarea
                    placeholder="Masukkan keluhan utama pasien..."
                    value={formData.chief_complaint || ""}
                    onChange={(e) =>
                      handleFieldChange("chief_complaint", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Riwayat Penyakit Sekarang</Label>
                  <Textarea
                    placeholder="Ceritakan perjalanan penyakit..."
                    value={formData.present_illness || ""}
                    onChange={(e) =>
                      handleFieldChange("present_illness", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Riwayat Penyakit Dahulu</Label>
                    <Textarea
                      placeholder="Penyakit yang pernah diderita..."
                      value={formData.past_medical_history || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          "past_medical_history",
                          e.target.value,
                        )
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Riwayat Penyakit Keluarga</Label>
                    <Textarea
                      placeholder="Riwayat penyakit dalam keluarga..."
                      value={formData.family_history || ""}
                      onChange={(e) =>
                        handleFieldChange("family_history", e.target.value)
                      }
                      rows={2}
                    />
                  </div>
                </div>
                <div>
                  <Label>Catatan Alergi</Label>
                  <Textarea
                    placeholder="Alergi obat, makanan, dll..."
                    value={formData.allergy_notes || ""}
                    onChange={(e) =>
                      handleFieldChange("allergy_notes", e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vital Signs Tab */}
          <TabsContent value="vitals" className="space-y-4 mt-4">
            <VitalSignsForm
              values={{
                blood_pressure_systolic: formData.blood_pressure_systolic,
                blood_pressure_diastolic: formData.blood_pressure_diastolic,
                heart_rate: formData.heart_rate,
                respiratory_rate: formData.respiratory_rate,
                temperature: formData.temperature,
                weight: formData.weight,
                height: formData.height,
                oxygen_saturation: formData.oxygen_saturation,
              }}
              onChange={handleVitalChange}
            />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pemeriksaan Fisik</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Hasil pemeriksaan fisik..."
                  value={formData.physical_examination || ""}
                  onChange={(e) =>
                    handleFieldChange("physical_examination", e.target.value)
                  }
                  rows={4}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diagnosis Tab */}
          <TabsContent value="diagnosis" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Diagnosis & Tindakan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Diagnosis *</Label>
                  <Textarea
                    placeholder="Masukkan diagnosis..."
                    value={formData.diagnosis || ""}
                    onChange={(e) =>
                      handleFieldChange("diagnosis", e.target.value)
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Catatan Diagnosis</Label>
                  <Textarea
                    placeholder="Catatan tambahan untuk diagnosis..."
                    value={formData.diagnosis_notes || ""}
                    onChange={(e) =>
                      handleFieldChange("diagnosis_notes", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <Separator />
                <div>
                  <Label>Tindakan / Treatment</Label>
                  <Textarea
                    placeholder="Tindakan yang dilakukan..."
                    value={formData.treatment || ""}
                    onChange={(e) =>
                      handleFieldChange("treatment", e.target.value)
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services/Layanan dengan komponen baru */}
            <ServiceInput
              items={services}
              onChange={setServices}
              departmentId={medicalRecord.department_id}
            />
          </TabsContent>

          {/* Prescription Tab */}
          <TabsContent value="prescription" className="mt-4">
            <PrescriptionForm
              items={prescriptionItems}
              onChange={setPrescriptionItems}
            />
          </TabsContent>

          {/* Recommendation Tab */}
          <TabsContent value="recommendation" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anjuran & Kontrol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Anjuran untuk Pasien</Label>
                  <Textarea
                    placeholder="Anjuran, saran, dan edukasi untuk pasien..."
                    value={formData.recommendations || ""}
                    onChange={(e) =>
                      handleFieldChange("recommendations", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div>
                  <Label>Tanggal Kontrol</Label>
                  <Input
                    type="date"
                    value={formData.follow_up_date || ""}
                    onChange={(e) =>
                      handleFieldChange("follow_up_date", e.target.value)
                    }
                    className="w-48"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CPPT Tab */}
          <TabsContent value="cppt" className="space-y-4 mt-4">
            <CpptForm
              values={{
                soap_subjective: formData.soap_subjective || "",
                soap_objective: formData.soap_objective || "",
                soap_assessment: formData.soap_assessment || "",
                soap_plan: formData.soap_plan || "",
              }}
              onChange={(field, value) => handleFieldChange(field, value)}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Patient History Modal */}
      <PatientHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        patient={medicalRecord.patient || null}
      />
    </div>
  );
}
