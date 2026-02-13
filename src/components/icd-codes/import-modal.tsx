"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileUp,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileJson,
  FileSpreadsheet,
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { icdCodeImportSchema, type IcdCodeImportFormData } from "@/lib/validations/icd-code";
import icdCodeService from "@/services/icd-code.service";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  errors: string[];
}

export function ImportModal({
  open,
  onOpenChange,
  onSuccess,
}: ImportModalProps) {
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IcdCodeImportFormData>({
    resolver: zodResolver(icdCodeImportSchema),
    defaultValues: {
      type: "icd10",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onSubmit = async (data: IcdCodeImportFormData) => {
    setIsImporting(true);
    setImportResult(null);
    try {
      const response = await icdCodeService.importIcdCodes(data.file, data.type);
      setImportResult({
        success: true,
        imported: response.data.imported,
        skipped: response.data.skipped,
        errors: response.data.errors,
      });
      if (response.data.imported > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error importing ICD codes:", error);
      setImportResult({
        success: false,
        imported: 0,
        skipped: 0,
        errors: ["Terjadi kesalahan saat mengimpor data"],
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedFile(null);
    setImportResult(null);
    onOpenChange(false);
  };

  const typeOptions = icdCodeService.getTypeOptions();

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-10 w-10 text-muted-foreground" />;
    if (selectedFile.name.endsWith(".json")) {
      return <FileJson className="h-10 w-10 text-blue-500" />;
    }
    return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import Kode ICD
          </DialogTitle>
          <DialogDescription>
            Upload file CSV atau JSON untuk mengimpor data kode ICD secara massal.
          </DialogDescription>
        </DialogHeader>

        {importResult ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-6"
          >
            <div className="flex flex-col items-center text-center">
              {importResult.success && importResult.imported > 0 ? (
                <>
                  <div className="p-4 rounded-full bg-green-100 dark:bg-green-950 mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Import Berhasil</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {importResult.imported} kode berhasil diimpor
                    {importResult.skipped > 0 && `, ${importResult.skipped} dilewati`}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-full bg-red-100 dark:bg-red-950 mb-4">
                    <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="font-semibold text-lg">Import Gagal</h3>
                  {importResult.errors.length > 0 && (
                    <div className="mt-4 text-left w-full max-h-40 overflow-y-auto">
                      <p className="text-sm font-medium mb-2">Errors:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {importResult.errors.slice(0, 10).map((error, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                            <span>{error}</span>
                          </li>
                        ))}
                        {importResult.errors.length > 10 && (
                          <li className="text-muted-foreground">
                            ... dan {importResult.errors.length - 10} error lainnya
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={handleClose}>Tutup</Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
            {/* ICD Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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

            {/* File Upload */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <Label className="text-sm font-medium">
                File <span className="text-destructive">*</span>
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors"
              >
                {getFileIcon()}
                {selectedFile ? (
                  <div className="mt-3 text-center">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 text-center">
                    <p className="font-medium">Klik atau drop file di sini</p>
                    <p className="text-sm text-muted-foreground">
                      Format: CSV atau JSON (maks 10MB)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <AnimatePresence>
                {errors.file && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.file.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Format Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-muted/50 text-sm"
            >
              <p className="font-medium mb-2">Format file yang didukung:</p>
              <ul className="text-muted-foreground space-y-1">
                <li>
                  <strong>CSV:</strong> code, name_id, name_en, chapter, block (header required)
                </li>
                <li>
                  <strong>JSON:</strong> Array of objects dengan field yang sama
                </li>
              </ul>
            </motion.div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isImporting}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isImporting || !selectedFile}
                className="min-w-[100px]"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengimpor...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
