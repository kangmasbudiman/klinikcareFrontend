"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Play,
  CheckCircle,
  SkipForward,
  XCircle,
  Clock,
  User,
  Volume2,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Queue } from "@/types/queue";
import queueService from "@/services/queue.service";
import patientService from "@/services/patient.service";

interface QueueCardProps {
  queue: Queue;
  onCall?: () => void;
  onRecall?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  onCancel?: () => void;
  onAssignPatient?: () => void;
  showActions?: boolean;
}

export function QueueCard({
  queue,
  onCall,
  onRecall,
  onStart,
  onComplete,
  onSkip,
  onCancel,
  onAssignPatient,
  showActions = true,
}: QueueCardProps) {
  const getActionButton = () => {
    switch (queue.status) {
      case "waiting":
        return (
          <Button size="sm" onClick={onCall}>
            <Phone className="mr-1 h-3 w-3" />
            Panggil
          </Button>
        );
      case "called":
        return (
          <div className="flex items-center gap-1">
            <Button size="sm" onClick={onStart}>
              <Play className="mr-1 h-3 w-3" />
              Mulai Layani
            </Button>
            {onRecall && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRecall}
                title="Panggil Ulang"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      case "in_service":
        return (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              onClick={onComplete}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Selesai
            </Button>
            {onRecall && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRecall}
                title="Panggil Ulang"
              >
                <Volume2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg border ${
        queue.status === "called" || queue.status === "in_service"
          ? "border-primary bg-primary/5"
          : "bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Queue Number & Patient Info */}
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${queueService.getStatusSolidColorClass(queue.status)}`}
          >
            {queue.queue_code.split("-")[1]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{queue.queue_code}</span>
              <Badge className={queueService.getStatusColorClass(queue.status)}>
                {queue.status_label}
              </Badge>
            </div>
            {queue.patient ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <User className="h-3 w-3" />
                <span>{queue.patient.name}</span>
                <Badge
                  variant="outline"
                  className={patientService.getPatientTypeColorClass(
                    queue.patient.patient_type,
                  )}
                >
                  {queue.patient.patient_type_label}
                </Badge>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Pasien belum terdaftar
              </p>
            )}
            {queue.wait_time !== null && queue.status === "waiting" && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>
                  Menunggu {queueService.formatWaitTime(queue.wait_time)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2">
            {getActionButton()}

            {(queue.status === "waiting" ||
              queue.status === "called" ||
              queue.status === "in_service") && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="12" cy="5" r="1" />
                      <circle cx="12" cy="19" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onAssignPatient && (
                    <>
                      <DropdownMenuItem onClick={onAssignPatient}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {queue.patient ? "Ganti Pasien" : "Assign Pasien"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {(queue.status === "waiting" ||
                    queue.status === "called") && (
                    <>
                      <DropdownMenuItem onClick={onSkip}>
                        <SkipForward className="mr-2 h-4 w-4" />
                        Lewati
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={onCancel}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Batalkan
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>

      {/* Counter info */}
      {queue.counter_number &&
        (queue.status === "called" || queue.status === "in_service") && (
          <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
            Loket/Ruangan:{" "}
            <span className="font-medium">{queue.counter_number}</span>
          </div>
        )}
    </motion.div>
  );
}
