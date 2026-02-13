"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Power,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Shield,
  Heart,
  FileText,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Patient } from "@/types/patient";
import { formatDate } from "@/lib/utils";
import patientService from "@/services/patient.service";

interface PatientDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onEdit: () => void;
  onToggleStatus: () => void;
}

export function PatientDetailModal({
  open,
  onOpenChange,
  patient,
  onEdit,
  onToggleStatus,
}: PatientDetailModalProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Pasien</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
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
              <Badge className={patientService.getPatientTypeColorClass(patient.patient_type)}>
                {patient.patient_type_label}
              </Badge>
              <Badge variant={patient.is_active ? "success" : "error"}>
                {patient.is_active ? "Aktif" : "Nonaktif"}
              </Badge>
            </div>
          </motion.div>

          <Separator />

          {/* Patient Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Lahir</p>
                  <p className="text-sm font-medium">
                    {formatDate(patient.birth_date)} ({patientService.formatAge(patient.birth_date)})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-950">
                  <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jenis Kelamin</p>
                  <p className="text-sm font-medium">{patient.gender_label}</p>
                </div>
              </div>
            </div>

            {/* ID Numbers */}
            {(patient.nik || patient.bpjs_number) && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                {patient.nik && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">NIK</p>
                      <p className="text-sm font-mono">{patient.nik}</p>
                    </div>
                  </div>
                )}
                {patient.bpjs_number && (
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-xs text-muted-foreground">No. BPJS</p>
                      <p className="text-sm font-mono">{patient.bpjs_number}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Contact */}
            {(patient.phone || patient.email) && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                {patient.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telepon</p>
                      <p className="text-sm">{patientService.formatPhone(patient.phone)}</p>
                    </div>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm">{patient.email}</p>
                    </div>
                  </div>
                )}
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

            {/* Insurance */}
            {patient.patient_type === "asuransi" && patient.insurance_name && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Asuransi</p>
                  <p className="text-sm font-medium">{patient.insurance_name}</p>
                  {patient.insurance_number && (
                    <p className="text-xs text-muted-foreground">
                      No. Polis: {patient.insurance_number}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {patient.emergency_contact_name && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950">
                <Users className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Kontak Darurat</p>
                  <p className="text-sm font-medium">{patient.emergency_contact_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {patient.emergency_contact_relation}
                    {patient.emergency_contact_phone && ` - ${patientService.formatPhone(patient.emergency_contact_phone)}`}
                  </p>
                </div>
              </div>
            )}

            {/* Allergies */}
            {patient.allergies && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950">
                <Heart className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Alergi</p>
                  <p className="text-sm">{patient.allergies}</p>
                </div>
              </div>
            )}

            {/* Medical Notes */}
            {patient.medical_notes && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Catatan Medis</p>
                  <p className="text-sm">{patient.medical_notes}</p>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {patient.blood_type && (
                <div className="p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Gol. Darah:</span>{" "}
                  <span className="font-medium">{patient.blood_type}</span>
                </div>
              )}
              {patient.religion_label && (
                <div className="p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Agama:</span>{" "}
                  <span className="font-medium">{patient.religion_label}</span>
                </div>
              )}
              {patient.marital_status_label && (
                <div className="p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className="font-medium">{patient.marital_status_label}</span>
                </div>
              )}
              {patient.occupation && (
                <div className="p-2 rounded bg-muted/50">
                  <span className="text-muted-foreground">Pekerjaan:</span>{" "}
                  <span className="font-medium">{patient.occupation}</span>
                </div>
              )}
            </div>

            {/* Created At */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Terdaftar Pada</p>
                <p className="text-sm font-medium">{formatDate(patient.created_at)}</p>
              </div>
            </div>
          </motion.div>

          <Separator />

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2"
          >
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant={patient.is_active ? "destructive" : "default"}
              className="flex-1"
              onClick={() => {
                onOpenChange(false);
                onToggleStatus();
              }}
            >
              <Power className="mr-2 h-4 w-4" />
              {patient.is_active ? "Nonaktifkan" : "Aktifkan"}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
