"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  FileText,
  Loader2,
  AlertCircle,
  FileCode2,
  BookOpen,
  Globe,
  Link2,
  ShieldCheck,
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { icdCodeSchema, type IcdCodeFormData } from "@/lib/validations/icd-code";
import type { IcdCode } from "@/types/icd-code";
import icdCodeService from "@/services/icd-code.service";

interface IcdCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icdCode?: IcdCode | null;
  onSuccess: () => void;
}

export function IcdCodeModal({
  open,
  onOpenChange,
  icdCode,
  onSuccess,
}: IcdCodeModalProps) {
  const isEdit = !!icdCode;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<IcdCodeFormData>({
    resolver: zodResolver(icdCodeSchema),
    defaultValues: {
      code: "",
      type: "icd10",
      name_id: "",
      name_en: "",
      chapter: "",
      chapter_name: "",
      block: "",
      block_name: "",
      parent_code: "",
      dtd_code: "",
      is_bpjs_claimable: true,
      is_active: true,
      notes: "",
    },
  });

  const watchedType = watch("type");
  const watchedIsActive = watch("is_active");
  const watchedIsBpjsClaimable = watch("is_bpjs_claimable");

  useEffect(() => {
    if (open) {
      if (icdCode) {
        reset({
          code: icdCode.code,
          type: icdCode.type,
          name_id: icdCode.name_id,
          name_en: icdCode.name_en || "",
          chapter: icdCode.chapter || "",
          chapter_name: icdCode.chapter_name || "",
          block: icdCode.block || "",
          block_name: icdCode.block_name || "",
          parent_code: icdCode.parent_code || "",
          dtd_code: icdCode.dtd_code || "",
          is_bpjs_claimable: icdCode.is_bpjs_claimable,
          is_active: icdCode.is_active,
          notes: icdCode.notes || "",
        });
      } else {
        reset({
          code: "",
          type: "icd10",
          name_id: "",
          name_en: "",
          chapter: "",
          chapter_name: "",
          block: "",
          block_name: "",
          parent_code: "",
          dtd_code: "",
          is_bpjs_claimable: true,
          is_active: true,
          notes: "",
        });
      }
    }
  }, [open, icdCode, reset]);

  const onSubmit = async (data: IcdCodeFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        name_en: data.name_en || null,
        chapter: data.chapter || null,
        chapter_name: data.chapter_name || null,
        block: data.block || null,
        block_name: data.block_name || null,
        parent_code: data.parent_code || null,
        dtd_code: data.dtd_code || null,
        notes: data.notes || null,
      };

      if (isEdit && icdCode) {
        await icdCodeService.updateIcdCode(icdCode.id, payload);
      } else {
        await icdCodeService.createIcdCode(payload);
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving ICD code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = icdCodeService.getTypeOptions();
  const chapterOptions = icdCodeService.getChapterOptions();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEdit ? "Edit Kode ICD" : "Tambah Kode ICD Baru"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Perbarui informasi kode ICD di bawah ini."
              : "Isi informasi kode ICD baru di bawah ini."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-4 p-4 rounded-lg bg-muted/50"
          >
            <div className={`p-3 rounded-xl ${icdCodeService.getTypeColorClass(watchedType)}`}>
              <FileCode2 className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="font-semibold">
                {watchedType === "icd10" ? "ICD-10 (Diagnosis)" : "ICD-9-CM (Prosedur)"}
              </p>
              <p className="text-xs text-muted-foreground">
                {watchedType === "icd10"
                  ? "Kode diagnosis penyakit"
                  : "Kode tindakan/prosedur medis"}
              </p>
            </div>
          </motion.div>

          {/* Type & Code Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                Tipe ICD <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <AnimatePresence>
                {errors.type && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.type.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <Label htmlFor="code" className="text-sm font-medium">
                Kode ICD <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="code"
                  placeholder="A09, J06.9, 23.01"
                  className="pl-10 uppercase font-mono"
                  {...register("code")}
                  onChange={(e) => setValue("code", e.target.value.toUpperCase())}
                />
              </div>
              <AnimatePresence>
                {errors.code && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.code.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Name Indonesian */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="name_id" className="text-sm font-medium">
              Nama (Indonesia) <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name_id"
                placeholder="Diare dan gastroenteritis"
                className="pl-10"
                {...register("name_id")}
              />
            </div>
            <AnimatePresence>
              {errors.name_id && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-destructive flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.name_id.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Name English */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-2"
          >
            <Label htmlFor="name_en" className="text-sm font-medium">
              Nama (English)
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name_en"
                placeholder="Infectious gastroenteritis and colitis"
                className="pl-10"
                {...register("name_en")}
              />
            </div>
          </motion.div>

          {/* Chapter Section - Only for ICD-10 */}
          {watchedType === "icd10" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 p-4 rounded-lg border bg-muted/30"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-medium">Informasi Chapter</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="chapter" className="text-xs">
                    Chapter
                  </Label>
                  <Controller
                    name="chapter"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "none"}
                        onValueChange={(val) => {
                          field.onChange(val === "none" ? "" : val);
                          // Auto-fill chapter name
                          const selectedChapter = chapterOptions.find((c) => c.value === val);
                          if (selectedChapter) {
                            setValue("chapter_name", selectedChapter.label.split(" - ")[1] || "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tidak ada</SelectItem>
                          {chapterOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chapter_name" className="text-xs">
                    Nama Chapter
                  </Label>
                  <Input
                    id="chapter_name"
                    placeholder="Nama chapter"
                    {...register("chapter_name")}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="block" className="text-xs">
                    Block
                  </Label>
                  <Input
                    id="block"
                    placeholder="A00-A09"
                    {...register("block")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="block_name" className="text-xs">
                    Nama Block
                  </Label>
                  <Input
                    id="block_name"
                    placeholder="Intestinal infectious diseases"
                    {...register("block_name")}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Parent & DTD Code Row */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-2"
            >
              <Label htmlFor="parent_code" className="text-sm font-medium">
                Parent Code
              </Label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="parent_code"
                  placeholder="A00"
                  className="pl-10 uppercase font-mono"
                  {...register("parent_code")}
                  onChange={(e) => setValue("parent_code", e.target.value.toUpperCase())}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Kode induk untuk hierarki
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="dtd_code" className="text-sm font-medium">
                DTD Code
              </Label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dtd_code"
                  placeholder="Kode DTD"
                  className="pl-10 font-mono"
                  {...register("dtd_code")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Kode untuk SatuSehat (opsional)
              </p>
            </motion.div>
          </div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="space-y-2"
          >
            <Label htmlFor="notes" className="text-sm font-medium">
              Catatan
            </Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="notes"
                placeholder="Catatan tambahan..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                {...register("notes")}
              />
            </div>
          </motion.div>

          {/* Status Switches */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm font-medium">
                  Status Aktif
                </Label>
                <p className="text-xs text-muted-foreground">
                  {watchedIsActive ? "Kode dapat digunakan" : "Kode tidak aktif"}
                </p>
              </div>
              <Switch
                id="is_active"
                checked={watchedIsActive}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="space-y-0.5">
                <Label htmlFor="is_bpjs_claimable" className="text-sm font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Claimable BPJS
                </Label>
                <p className="text-xs text-muted-foreground">
                  {watchedIsBpjsClaimable ? "Dapat diklaim BPJS" : "Tidak dapat diklaim"}
                </p>
              </div>
              <Switch
                id="is_bpjs_claimable"
                checked={watchedIsBpjsClaimable}
                onCheckedChange={(checked) => setValue("is_bpjs_claimable", checked)}
              />
            </motion.div>
          </div>
        </form>

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
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : isEdit ? (
              "Simpan Perubahan"
            ) : (
              "Tambah Kode ICD"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
