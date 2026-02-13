"use client";

import { Users, Clock, Stethoscope, PlayCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Queue } from "@/types/queue";
import type { MedicalRecord } from "@/types/medical-record";

interface ExaminationPatientListProps {
  waitingQueues: Queue[];
  inProgressRecords: MedicalRecord[];
  onStartExamination: (queue: Queue) => void;
  onContinueExamination: (record: MedicalRecord) => void;
}

export function ExaminationPatientList({
  waitingQueues,
  inProgressRecords,
  onStartExamination,
  onContinueExamination,
}: ExaminationPatientListProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* In Progress */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Sedang Diperiksa ({inProgressRecords.length})
        </h3>
        {inProgressRecords.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada pemeriksaan aktif</p>
        ) : (
          inProgressRecords.map((record) => (
            <div
              key={record.id}
              className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/30 cursor-pointer hover:border-blue-300"
              onClick={() => onContinueExamination(record)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{record.patient?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {record.queue?.queue_code} - {record.patient?.medical_record_number}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <PlayCircle className="h-4 w-4 mr-1" />
                  Lanjutkan
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Waiting */}
      <div className="space-y-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Menunggu ({waitingQueues.length})
        </h3>
        {waitingQueues.length === 0 ? (
          <p className="text-sm text-muted-foreground">Tidak ada pasien menunggu</p>
        ) : (
          waitingQueues.map((queue) => (
            <div key={queue.id} className="p-4 rounded-lg border hover:border-primary">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">{queue.patient?.name || "Pasien"}</p>
                    <p className="text-sm text-muted-foreground">
                      {queue.queue_code} - Tunggu {queue.wait_time} menit
                    </p>
                  </div>
                </div>
                <Button size="sm" onClick={() => onStartExamination(queue)}>
                  <Stethoscope className="h-4 w-4 mr-1" />
                  Periksa
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
