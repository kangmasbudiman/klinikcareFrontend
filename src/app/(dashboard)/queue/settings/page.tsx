"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, RefreshCw, Building2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { QueueSetting } from "@/types/queue";
import type { Department } from "@/types/department";
import queueService from "@/services/queue.service";
import departmentService from "@/services/department.service";
import { toast } from "sonner";

export default function QueueSettingsPage() {
  const [settings, setSettings] = useState<QueueSetting[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [settingsRes, deptsRes] = await Promise.all([
        queueService.getQueueSettings(),
        departmentService.getActiveDepartments(),
      ]);
      setSettings(settingsRes.data);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get setting for department
  const getSettingForDept = (deptId: number): QueueSetting => {
    const existing = settings.find((s) => s.department_id === deptId);
    if (existing) return existing;

    // Default setting
    const dept = departments.find((d) => d.id === deptId);
    return {
      id: null,
      department_id: deptId,
      prefix: dept?.code || "A",
      daily_quota: 100,
      start_number: 1,
      is_active: true,
      department: dept,
      created_at: null,
      updated_at: null,
    };
  };

  // Update local setting
  const updateLocalSetting = (deptId: number, field: string, value: any) => {
    setSettings((prev) => {
      const existing = prev.find((s) => s.department_id === deptId);
      if (existing) {
        return prev.map((s) =>
          s.department_id === deptId ? { ...s, [field]: value } : s,
        );
      } else {
        const newSetting = getSettingForDept(deptId);
        return [...prev, { ...newSetting, [field]: value }];
      }
    });
  };

  // Save setting
  const handleSave = async (deptId: number) => {
    const setting = getSettingForDept(deptId);
    setSavingId(deptId);
    try {
      await queueService.updateQueueSetting(deptId, {
        prefix: setting.prefix,
        daily_quota: setting.daily_quota,
        start_number: setting.start_number,
        is_active: setting.is_active,
      });
      toast.success("Pengaturan berhasil disimpan", {
        description: `Pengaturan antrian untuk ${setting.department?.name || "poli"} telah diperbarui`,
      });
      fetchData();
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan pengaturan", {
        description:
          error.response?.data?.message || "Terjadi kesalahan saat menyimpan",
      });
    } finally {
      setSavingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Pengaturan Antrian
          </h1>
          <p className="text-muted-foreground">
            Konfigurasi pengaturan antrian untuk setiap poli/departemen
          </p>
        </div>
        <Button variant="outline" onClick={fetchData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Settings Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {departments.map((dept) => {
          const setting = getSettingForDept(dept.id);
          const isSaving = savingId === dept.id;

          return (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${dept.color}20` }}
                      >
                        <Building2
                          className="h-5 w-5"
                          style={{ color: dept.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{dept.name}</CardTitle>
                        <CardDescription>Kode: {dept.code}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant={setting.is_active ? "success" : "secondary"}
                    >
                      {setting.is_active ? "Aktif" : "Nonaktif"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Prefix */}
                  <div className="grid gap-2">
                    <Label htmlFor={`prefix-${dept.id}`}>Prefix Antrian</Label>
                    <Input
                      id={`prefix-${dept.id}`}
                      value={setting.prefix}
                      onChange={(e) =>
                        updateLocalSetting(
                          dept.id,
                          "prefix",
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="A"
                      maxLength={3}
                      className="w-24"
                    />
                    <p className="text-xs text-muted-foreground">
                      Contoh hasil: {setting.prefix}-001
                    </p>
                  </div>

                  {/* Daily Quota */}
                  <div className="grid gap-2">
                    <Label htmlFor={`quota-${dept.id}`}>Kuota Harian</Label>
                    <Input
                      id={`quota-${dept.id}`}
                      type="number"
                      value={setting.daily_quota}
                      onChange={(e) =>
                        updateLocalSetting(
                          dept.id,
                          "daily_quota",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      placeholder="100"
                      min={1}
                      className="w-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Maksimal antrian per hari
                    </p>
                  </div>

                  {/* Start Number */}
                  <div className="grid gap-2">
                    <Label htmlFor={`start-${dept.id}`}>Nomor Awal</Label>
                    <Input
                      id={`start-${dept.id}`}
                      type="number"
                      value={setting.start_number}
                      onChange={(e) =>
                        updateLocalSetting(
                          dept.id,
                          "start_number",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      placeholder="1"
                      min={1}
                      className="w-32"
                    />
                    <p className="text-xs text-muted-foreground">
                      Nomor antrian pertama setiap hari
                    </p>
                  </div>

                  {/* Is Active */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Status Antrian</Label>
                      <p className="text-xs text-muted-foreground">
                        Aktifkan/nonaktifkan antrian untuk poli ini
                      </p>
                    </div>
                    <Switch
                      checked={setting.is_active}
                      onCheckedChange={(checked) =>
                        updateLocalSetting(dept.id, "is_active", checked)
                      }
                    />
                  </div>

                  {/* Save Button */}
                  <Button
                    className="w-full"
                    onClick={() => handleSave(dept.id)}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Simpan Pengaturan
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {departments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Belum ada departemen/poli yang aktif</p>
            <p className="text-sm">
              Tambahkan poli di menu Master Data → Departemen
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
