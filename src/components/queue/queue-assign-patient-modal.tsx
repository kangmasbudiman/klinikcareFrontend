"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  Loader2,
  Search,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Queue } from "@/types/queue";
import type { Patient } from "@/types/patient";
import queueService from "@/services/queue.service";
import patientService from "@/services/patient.service";
import { toast } from "sonner";

interface QueueAssignPatientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queue: Queue | null;
  onSuccess: () => void;
  onRegisterPatient: () => void;
}

export function QueueAssignPatientModal({
  open,
  onOpenChange,
  queue,
  onSuccess,
  onRegisterPatient,
}: QueueAssignPatientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  // Patient search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("search");
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPatient(queue?.patient || null);
    }
  }, [open, queue]);

  // Search patients
  useEffect(() => {
    const searchPatients = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await patientService.searchPatients(searchQuery);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching patients:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchPatients, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAssign = async () => {
    if (!queue || !selectedPatient) {
      toast.error("Pilih pasien terlebih dahulu");
      return;
    }

    // Check if already assigned to the same patient
    if (selectedPatient.id === queue.patient_id) {
      toast.info("Pasien sudah terdaftar pada antrian ini");
      onOpenChange(false);
      return;
    }

    setIsSubmitting(true);
    try {
      await queueService.assignPatient(queue.id, selectedPatient.id);

      toast.success("Pasien berhasil di-assign", {
        description: `${selectedPatient.name} ditambahkan ke antrian ${queue.queue_code}`,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error assigning patient:", error);
      toast.error("Gagal assign pasien", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchQuery("");
    setSearchResults([]);
  };

  if (!queue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Pasien
          </DialogTitle>
          <DialogDescription>
            Cari dan assign data pasien ke antrian
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Queue Info */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-blue-500/10">
            <div>
              <p className="text-sm text-muted-foreground">Nomor Antrian</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {queue.queue_code}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Poli Tujuan</p>
              <p className="font-medium">{queue.department?.name}</p>
              <Badge className={queueService.getStatusColorClass(queue.status)}>
                {queue.status_label}
              </Badge>
            </div>
          </div>

          {/* Patient Selection */}
          <div className="space-y-2">
            <Label>Data Pasien</Label>

            {/* Show selected patient */}
            <AnimatePresence mode="wait">
              {selectedPatient ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-lg border bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedPatient.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{selectedPatient.medical_record_number}</span>
                          <Badge
                            className={patientService.getPatientTypeColorClass(
                              selectedPatient.patient_type,
                            )}
                          >
                            {selectedPatient.patient_type_label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPatient(null)}
                    >
                      Ganti
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="search">Cari Pasien</TabsTrigger>
                      <TabsTrigger value="new">Pasien Baru</TabsTrigger>
                    </TabsList>

                    <TabsContent value="search" className="mt-4 space-y-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Cari nama, NIK, No. RM, atau No. BPJS..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      {/* Search Results */}
                      <div className="max-h-[250px] overflow-y-auto space-y-2">
                        {isSearching && (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        )}

                        {!isSearching &&
                          searchResults.length === 0 &&
                          searchQuery.length >= 2 && (
                            <p className="text-center py-4 text-sm text-muted-foreground">
                              Tidak ditemukan pasien dengan kata kunci tersebut
                            </p>
                          )}

                        {searchResults.map((patient) => (
                          <motion.div
                            key={patient.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleSelectPatient(patient)}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                  patient.gender === "male"
                                    ? "bg-blue-500"
                                    : "bg-pink-500"
                                }`}
                              >
                                {patient.name.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">
                                  {patient.name}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{patient.medical_record_number}</span>
                                  {patient.nik && (
                                    <>
                                      <span>|</span>
                                      <span>NIK: {patient.nik}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                              <Badge
                                className={patientService.getPatientTypeColorClass(
                                  patient.patient_type,
                                )}
                              >
                                {patient.patient_type_label}
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="new" className="mt-4">
                      <div className="text-center py-6">
                        <UserPlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">
                          Pasien belum terdaftar? Daftarkan pasien baru terlebih
                          dahulu.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            onOpenChange(false);
                            onRegisterPatient();
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Daftarkan Pasien Baru
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
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
            onClick={handleAssign}
            disabled={isSubmitting || !selectedPatient}
            className="min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Assign Pasien
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
