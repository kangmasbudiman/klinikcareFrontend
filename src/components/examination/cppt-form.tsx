"use client";

import { useState, useCallback } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SoapTextareaField } from "./soap-textarea-field";

interface CpptFormProps {
  values: {
    soap_subjective: string;
    soap_objective: string;
    soap_assessment: string;
    soap_plan: string;
  };
  onChange: (field: string, value: string) => void;
}

type SoapField =
  | "soap_subjective"
  | "soap_objective"
  | "soap_assessment"
  | "soap_plan";

export function CpptForm({ values, onChange }: CpptFormProps) {
  const [activeRecording, setActiveRecording] = useState<SoapField | null>(
    null,
  );

  const handleRecordingStart = useCallback((field: SoapField) => {
    setActiveRecording(field);
  }, []);

  const handleRecordingStop = useCallback(() => {
    setActiveRecording(null);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          CPPT - Catatan Perkembangan Pasien Terintegrasi
        </CardTitle>
        <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            CPPT merupakan catatan perkembangan terintegrasi dalam format SOAP
            yang digunakan untuk mendokumentasikan perkembangan kondisi pasien.
            Anda dapat mengetik langsung atau menggunakan tombol mikrofon untuk
            input suara.
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <SoapTextareaField
          badgeLetter="S"
          badgeColor="bg-blue-500"
          label="Subjective"
          description="Keluhan dan gejala yang disampaikan pasien, riwayat perjalanan penyakit"
          placeholder="Keluhan pasien, gejala yang dirasakan, riwayat yang disampaikan pasien..."
          value={values.soap_subjective}
          onChange={(val) => onChange("soap_subjective", val)}
          rows={4}
          isRecordingActive={activeRecording === "soap_subjective"}
          onRecordingStart={() => handleRecordingStart("soap_subjective")}
          onRecordingStop={handleRecordingStop}
        />

        <SoapTextareaField
          badgeLetter="O"
          badgeColor="bg-green-500"
          label="Objective"
          description="Hasil pemeriksaan fisik, tanda vital, hasil laboratorium dan penunjang"
          placeholder="Hasil pemeriksaan fisik, tanda vital, hasil laboratorium, hasil penunjang..."
          value={values.soap_objective}
          onChange={(val) => onChange("soap_objective", val)}
          rows={4}
          isRecordingActive={activeRecording === "soap_objective"}
          onRecordingStart={() => handleRecordingStart("soap_objective")}
          onRecordingStop={handleRecordingStop}
        />

        <SoapTextareaField
          badgeLetter="A"
          badgeColor="bg-orange-500"
          label="Assessment"
          description="Diagnosis, diagnosis banding, dan penilaian klinis"
          placeholder="Diagnosis, diagnosis banding, penilaian klinis..."
          value={values.soap_assessment}
          onChange={(val) => onChange("soap_assessment", val)}
          rows={3}
          isRecordingActive={activeRecording === "soap_assessment"}
          onRecordingStart={() => handleRecordingStart("soap_assessment")}
          onRecordingStop={handleRecordingStop}
        />

        <SoapTextareaField
          badgeLetter="P"
          badgeColor="bg-purple-500"
          label="Plan"
          description="Rencana terapi, tindakan medis, edukasi pasien, dan rencana kontrol"
          placeholder="Rencana terapi, tindakan, edukasi, rencana kontrol..."
          value={values.soap_plan}
          onChange={(val) => onChange("soap_plan", val)}
          rows={3}
          isRecordingActive={activeRecording === "soap_plan"}
          onRecordingStart={() => handleRecordingStart("soap_plan")}
          onRecordingStop={handleRecordingStop}
        />
      </CardContent>
    </Card>
  );
}
