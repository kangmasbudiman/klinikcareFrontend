"use client";

import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  User,
  Stethoscope,
  Calendar,
  FileText,
  MapPin,
  HeartPulse,
  Thermometer,
  Forward,
} from "lucide-react";
import type { MedicalLetter } from "@/types/medical-letter";
import { LETTER_TYPE_LABELS, LETTER_TYPE_COLORS } from "@/types/medical-letter";
import { printLetter } from "./letter-print";

interface LetterDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  letter: MedicalLetter | null;
  clinicSettings?: {
    name?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    logo_url?: string | null;
  } | null;
}

export function LetterDetailModal({
  open,
  onOpenChange,
  letter,
  clinicSettings,
}: LetterDetailModalProps) {
  if (!letter) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    try {
      return format(new Date(dateStr), "dd MMMM yyyy", { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  const getLetterIcon = () => {
    switch (letter.letter_type) {
      case "surat_sehat":
        return <HeartPulse className="h-5 w-5 text-green-600" />;
      case "surat_sakit":
        return <Thermometer className="h-5 w-5 text-red-600" />;
      case "surat_rujukan":
        return <Forward className="h-5 w-5 text-blue-600" />;
      case "surat_keterangan":
        return <FileText className="h-5 w-5 text-purple-600" />;
    }
  };

  const handlePrint = () => {
    printLetter(letter, clinicSettings || null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getLetterIcon()}
            Detail Surat
          </DialogTitle>
          <DialogDescription>{letter.letter_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Letter Info */}
          <div className="flex items-center justify-between">
            <Badge className={LETTER_TYPE_COLORS[letter.letter_type]}>
              {LETTER_TYPE_LABELS[letter.letter_type]}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(letter.letter_date)}
            </div>
          </div>

          <Separator />

          {/* Patient Info */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <User className="h-4 w-4" /> Pasien
            </p>
            <div className="p-3 rounded-lg bg-muted">
              <p className="font-semibold">{letter.patient?.name || "-"}</p>
              <p className="text-sm text-muted-foreground">
                {letter.patient?.medical_record_number || "-"}
              </p>
              {letter.patient?.birth_date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(letter.patient.birth_date)}
                </p>
              )}
              {letter.patient?.address && (
                <p className="text-sm text-muted-foreground">
                  {letter.patient.address}
                </p>
              )}
            </div>
          </div>

          {/* Doctor Info */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
              <Stethoscope className="h-4 w-4" /> Dokter
            </p>
            <p className="text-sm">{letter.doctor?.name || "-"}</p>
          </div>

          <Separator />

          {/* Type-specific content */}
          {letter.letter_type === "surat_sehat" && (
            <div className="space-y-3">
              <InfoRow label="Keperluan" value={letter.health_purpose} />
              <InfoRow
                label="Hasil Pemeriksaan"
                value={letter.examination_result}
              />
            </div>
          )}

          {letter.letter_type === "surat_sakit" && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InfoRow
                  label="Mulai Sakit"
                  value={formatDate(letter.sick_start_date)}
                />
                <InfoRow
                  label="Selesai Sakit"
                  value={formatDate(letter.sick_end_date)}
                />
              </div>
              <InfoRow
                label="Jumlah Hari"
                value={letter.sick_days ? `${letter.sick_days} hari` : null}
              />
              <InfoRow label="Keperluan" value={letter.purpose} />
            </div>
          )}

          {letter.letter_type === "surat_rujukan" && (
            <div className="space-y-3">
              <InfoRow
                label="Tujuan Rujukan"
                value={letter.referral_destination}
                icon={<MapPin className="h-3.5 w-3.5" />}
              />
              <InfoRow
                label="Spesialis Tujuan"
                value={letter.referral_specialist}
              />
              <InfoRow label="Alasan Rujukan" value={letter.referral_reason} />
              <InfoRow
                label="Ringkasan Diagnosa"
                value={letter.diagnosis_summary}
              />
              <InfoRow
                label="Tindakan yang Dilakukan"
                value={letter.treatment_summary}
              />
            </div>
          )}

          {letter.letter_type === "surat_keterangan" && (
            <div className="space-y-3">
              <InfoRow label="Keperluan" value={letter.purpose} />
              <InfoRow
                label="Isi Keterangan"
                value={letter.statement_content}
              />
            </div>
          )}

          {/* Notes */}
          {letter.notes && (
            <>
              <Separator />
              <InfoRow label="Catatan" value={letter.notes} />
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-1">
        {icon}
        {label}
      </p>
      <p className="text-sm whitespace-pre-wrap">{value || "-"}</p>
    </div>
  );
}
