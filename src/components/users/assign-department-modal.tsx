"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Star } from "lucide-react";
import type { User } from "@/types/auth";
import type { Department } from "@/types/department";
import departmentService from "@/services/department.service";
import userService from "@/services/user.service";
import { toast } from "sonner";

interface AssignDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export function AssignDepartmentModal({
  open,
  onOpenChange,
  user,
  onSuccess,
}: AssignDepartmentModalProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDeptIds, setSelectedDeptIds] = useState<number[]>([]);
  const [primaryDeptId, setPrimaryDeptId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!open) return;

      setIsLoading(true);
      try {
        const response = await departmentService.getActiveDepartments();
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [open]);

  // Set initial values from user's current departments
  useEffect(() => {
    if (user?.departments && user.departments.length > 0) {
      const deptIds = user.departments.map((d) => d.id);
      setSelectedDeptIds(deptIds);

      const primary = user.departments.find((d) => d.is_primary);
      setPrimaryDeptId(primary ? primary.id : deptIds[0]);
    } else {
      setSelectedDeptIds([]);
      setPrimaryDeptId(null);
    }
  }, [user]);

  // Handle department checkbox toggle
  const handleDeptToggle = (deptId: number, checked: boolean) => {
    if (checked) {
      setSelectedDeptIds([...selectedDeptIds, deptId]);
      // If this is the first selection, make it primary
      if (selectedDeptIds.length === 0) {
        setPrimaryDeptId(deptId);
      }
    } else {
      const newIds = selectedDeptIds.filter((id) => id !== deptId);
      setSelectedDeptIds(newIds);
      // If removed was primary, set new primary
      if (primaryDeptId === deptId) {
        setPrimaryDeptId(newIds.length > 0 ? newIds[0] : null);
      }
    }
  };

  // Handle save
  const handleSave = async () => {
    if (!user) return;

    if (selectedDeptIds.length === 0) {
      toast.error("Pilih minimal 1 poli");
      return;
    }

    setIsSaving(true);
    try {
      await userService.assignDepartments(Number(user.id), {
        department_ids: selectedDeptIds,
        primary_department_id: primaryDeptId || selectedDeptIds[0],
      });

      toast.success("Poli berhasil ditugaskan", {
        description: `${user.name} telah ditugaskan ke ${selectedDeptIds.length} poli`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error assigning departments:", error);
      toast.error("Gagal menugaskan poli", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  // Only allow for dokter and perawat
  const allowedRoles = ["dokter", "perawat"];
  if (!allowedRoles.includes(user.role)) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Penugasan Poli</DialogTitle>
            <DialogDescription>
              Penugasan poli hanya tersedia untuk role Dokter dan Perawat.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Penugasan Poli
          </DialogTitle>
          <DialogDescription>
            Pilih poli untuk {user.name} (
            {user.role === "dokter" ? "Dokter" : "Perawat"})
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Department List */}
            <div className="space-y-3">
              <Label>Pilih Poli</Label>
              <div className="border rounded-lg max-h-[300px] overflow-y-auto">
                {departments.map((dept) => {
                  const isSelected = selectedDeptIds.includes(dept.id);
                  const isPrimary = primaryDeptId === dept.id;

                  return (
                    <div
                      key={dept.id}
                      className={`flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50 ${
                        isSelected ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id={`dept-${dept.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleDeptToggle(dept.id, checked === true)
                          }
                        />
                        <div>
                          <label
                            htmlFor={`dept-${dept.id}`}
                            className="font-medium cursor-pointer"
                          >
                            {dept.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Kode: {dept.code}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Button
                          type="button"
                          size="sm"
                          variant={isPrimary ? "default" : "outline"}
                          onClick={() => setPrimaryDeptId(dept.id)}
                          className="gap-1"
                        >
                          <Star
                            className={`h-3 w-3 ${isPrimary ? "fill-current" : ""}`}
                          />
                          {isPrimary ? "Utama" : "Jadikan Utama"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Summary */}
            {selectedDeptIds.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-2">
                  Poli yang dipilih ({selectedDeptIds.length}):
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedDeptIds.map((id) => {
                    const dept = departments.find((d) => d.id === id);
                    if (!dept) return null;
                    return (
                      <Badge
                        key={id}
                        variant={id === primaryDeptId ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {id === primaryDeptId && (
                          <Star className="h-3 w-3 fill-current" />
                        )}
                        {dept.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || selectedDeptIds.length === 0}
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
