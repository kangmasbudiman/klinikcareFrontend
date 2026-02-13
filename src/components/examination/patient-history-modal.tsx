"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  History,
  Loader2,
  Calendar,
  Building2,
  User,
  Stethoscope,
  FileText,
  Pill,
  ChevronDown,
  ChevronUp,
  Heart,
  Thermometer,
  Activity,
  NotebookPen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MedicalRecord } from "@/types/medical-record";
import type { Patient } from "@/types/patient";
import medicalRecordService from "@/services/medical-record.service";

interface PatientHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
}

export function PatientHistoryModal({
  open,
  onOpenChange,
  patient,
}: PatientHistoryModalProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch patient history
  useEffect(() => {
    const fetchHistory = async () => {
      if (!open || !patient) return;

      setIsLoading(true);
      try {
        const response = await medicalRecordService.getPatientMedicalHistory(
          patient.id,
        );
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching patient history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [open, patient]);

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Toggle expand
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Riwayat Medis Pasien
          </DialogTitle>
          <DialogDescription>
            {patient.name} - {patient.medical_record_number}
          </DialogDescription>
        </DialogHeader>

        {/* Patient Summary */}
        <div className="p-4 rounded-lg bg-muted/50">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Umur</p>
              <p className="font-medium">{patient.age} tahun</p>
            </div>
            <div>
              <p className="text-muted-foreground">Jenis Kelamin</p>
              <p className="font-medium">{patient.gender_label}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Golongan Darah</p>
              <p className="font-medium">{patient.blood_type || "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tipe</p>
              <Badge
                variant={
                  patient.patient_type === "bpjs" ? "success" : "secondary"
                }
              >
                {patient.patient_type_label}
              </Badge>
            </div>
          </div>
          {patient.allergies && (
            <div className="mt-3 p-2 rounded bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
              <strong>Alergi:</strong> {patient.allergies}
            </div>
          )}
        </div>

        {/* History List */}
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Belum ada riwayat kunjungan</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className="cursor-pointer"
                    onClick={() => toggleExpand(record.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {formatDate(record.visit_date)}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              <span>{record.department?.name}</span>
                              <span>|</span>
                              <User className="h-3 w-3" />
                              <span>{record.doctor?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              record.status === "completed"
                                ? "success"
                                : record.status === "in_progress"
                                  ? "info"
                                  : "secondary"
                            }
                          >
                            {record.status_label}
                          </Badge>
                          {expandedId === record.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {/* Collapsed Preview */}
                    {expandedId !== record.id && (
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          <strong>Keluhan:</strong>{" "}
                          {record.chief_complaint || "-"}
                        </p>
                        {record.diagnosis && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                            <strong>Diagnosis:</strong> {record.diagnosis}
                          </p>
                        )}
                      </CardContent>
                    )}

                    {/* Expanded Detail */}
                    {expandedId === record.id && (
                      <CardContent className="p-4 pt-0 space-y-4">
                        <Separator />

                        {/* Vital Signs */}
                        {(record.blood_pressure ||
                          record.heart_rate ||
                          record.temperature) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Tanda Vital
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                              {record.blood_pressure && (
                                <div className="p-2 rounded bg-muted">
                                  <p className="text-muted-foreground text-xs">
                                    Tekanan Darah
                                  </p>
                                  <p className="font-medium">
                                    {record.blood_pressure} mmHg
                                  </p>
                                </div>
                              )}
                              {record.heart_rate && (
                                <div className="p-2 rounded bg-muted">
                                  <p className="text-muted-foreground text-xs">
                                    Denyut Nadi
                                  </p>
                                  <p className="font-medium">
                                    {record.heart_rate} bpm
                                  </p>
                                </div>
                              )}
                              {record.temperature && (
                                <div className="p-2 rounded bg-muted">
                                  <p className="text-muted-foreground text-xs">
                                    Suhu
                                  </p>
                                  <p className="font-medium">
                                    {record.temperature}°C
                                  </p>
                                </div>
                              )}
                              {record.oxygen_saturation && (
                                <div className="p-2 rounded bg-muted">
                                  <p className="text-muted-foreground text-xs">
                                    SpO2
                                  </p>
                                  <p className="font-medium">
                                    {record.oxygen_saturation}%
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Anamnesis */}
                        <div>
                          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Anamnesis
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="text-muted-foreground">
                                Keluhan Utama:
                              </span>{" "}
                              {record.chief_complaint || "-"}
                            </p>
                            {record.present_illness && (
                              <p>
                                <span className="text-muted-foreground">
                                  RPS:
                                </span>{" "}
                                {record.present_illness}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Diagnosis */}
                        {record.diagnosis && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Diagnosis
                            </h4>
                            <p className="text-sm">{record.diagnosis}</p>
                            {record.diagnoses &&
                              record.diagnoses.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {record.diagnoses.map((d, i) => (
                                    <Badge
                                      key={i}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {d.icd_code}: {d.icd_name}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                          </div>
                        )}

                        {/* Treatment */}
                        {record.treatment && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Tindakan
                            </h4>
                            <p className="text-sm">{record.treatment}</p>
                          </div>
                        )}

                        {/* Prescriptions */}
                        {record.prescriptions &&
                          record.prescriptions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Pill className="h-4 w-4" />
                                Resep Obat
                              </h4>
                              <div className="space-y-1">
                                {record.prescriptions.map((rx) =>
                                  rx.items?.map((item, i) => (
                                    <div
                                      key={i}
                                      className="text-sm p-2 rounded bg-muted flex justify-between"
                                    >
                                      <span>
                                        {item.medicine_name} {item.dosage}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {item.frequency} x {item.quantity}
                                      </span>
                                    </div>
                                  )),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Recommendations */}
                        {record.recommendations && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">
                              Anjuran
                            </h4>
                            <p className="text-sm">{record.recommendations}</p>
                          </div>
                        )}

                        {/* CPPT / SOAP */}
                        {(record.soap_subjective ||
                          record.soap_objective ||
                          record.soap_assessment ||
                          record.soap_plan) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <NotebookPen className="h-4 w-4" />
                              CPPT (SOAP)
                            </h4>
                            <div className="space-y-2">
                              {record.soap_subjective && (
                                <div className="p-2 rounded bg-muted">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white bg-blue-500">
                                      S
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Subjective
                                    </span>
                                  </div>
                                  <p className="text-sm">
                                    {record.soap_subjective}
                                  </p>
                                </div>
                              )}
                              {record.soap_objective && (
                                <div className="p-2 rounded bg-muted">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white bg-green-500">
                                      O
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Objective
                                    </span>
                                  </div>
                                  <p className="text-sm">
                                    {record.soap_objective}
                                  </p>
                                </div>
                              )}
                              {record.soap_assessment && (
                                <div className="p-2 rounded bg-muted">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white bg-orange-500">
                                      A
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Assessment
                                    </span>
                                  </div>
                                  <p className="text-sm">
                                    {record.soap_assessment}
                                  </p>
                                </div>
                              )}
                              {record.soap_plan && (
                                <div className="p-2 rounded bg-muted">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white bg-purple-500">
                                      P
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Plan
                                    </span>
                                  </div>
                                  <p className="text-sm">{record.soap_plan}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Follow Up */}
                        {record.follow_up_date && (
                          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950/30 text-sm">
                            <strong>Tanggal Kontrol:</strong>{" "}
                            {formatDate(record.follow_up_date)}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
