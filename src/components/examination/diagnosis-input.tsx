"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus, X, FileText, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { DiagnosisType } from "@/types/medical-record";
import type { IcdCode } from "@/types/icd-code";
import icdCodeService from "@/services/icd-code.service";

export interface DiagnosisData {
  icd_code: string;
  icd_name: string;
  diagnosis_type: DiagnosisType;
  notes: string;
}

interface DiagnosisInputProps {
  diagnoses: DiagnosisData[];
  onChange: (diagnoses: DiagnosisData[]) => void;
}

export function DiagnosisInput({ diagnoses, onChange }: DiagnosisInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IcdCode[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Search ICD codes with debounce
  useEffect(() => {
    const searchIcd = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await icdCodeService.searchIcdCodes({
          query: searchQuery,
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching ICD codes:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(searchIcd, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Add diagnosis from search
  const handleAddDiagnosis = (icd: IcdCode) => {
    // Check if already added
    if (diagnoses.some((d) => d.icd_code === icd.code)) {
      return;
    }

    // Determine type (first is primary, rest are secondary)
    const diagnosisType: DiagnosisType =
      diagnoses.length === 0 ? "primary" : "secondary";

    const newDiagnosis: DiagnosisData = {
      icd_code: icd.code,
      icd_name: icd.name_id || icd.name_en || "",
      diagnosis_type: diagnosisType,
      notes: "",
    };

    onChange([...diagnoses, newDiagnosis]);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearch(false);
  };

  // Remove diagnosis
  const handleRemoveDiagnosis = (index: number) => {
    const newDiagnoses = diagnoses.filter((_, i) => i !== index);

    // If we removed the primary, make the first remaining one primary
    if (
      newDiagnoses.length > 0 &&
      !newDiagnoses.some((d) => d.diagnosis_type === "primary")
    ) {
      newDiagnoses[0].diagnosis_type = "primary";
    }

    onChange(newDiagnoses);
  };

  // Update diagnosis type
  const handleTypeChange = (index: number, type: DiagnosisType) => {
    const newDiagnoses = [...diagnoses];

    // If setting as primary, make others secondary
    if (type === "primary") {
      newDiagnoses.forEach((d, i) => {
        d.diagnosis_type = i === index ? "primary" : "secondary";
      });
    } else {
      newDiagnoses[index].diagnosis_type = type;
    }

    onChange(newDiagnoses);
  };

  // Update diagnosis notes
  const handleNotesChange = (index: number, notes: string) => {
    const newDiagnoses = [...diagnoses];
    newDiagnoses[index].notes = notes;
    onChange(newDiagnoses);
  };

  // Add manual diagnosis (without ICD code)
  const handleAddManual = () => {
    const diagnosisType: DiagnosisType =
      diagnoses.length === 0 ? "primary" : "secondary";

    const newDiagnosis: DiagnosisData = {
      icd_code: "",
      icd_name: "",
      diagnosis_type: diagnosisType,
      notes: "",
    };

    onChange([...diagnoses, newDiagnosis]);
  };

  // Update manual diagnosis name
  const handleNameChange = (index: number, name: string) => {
    const newDiagnoses = [...diagnoses];
    newDiagnoses[index].icd_name = name;
    onChange(newDiagnoses);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Diagnosis (ICD-10)
          </CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddManual}
            >
              <Plus className="h-4 w-4 mr-1" />
              Manual
            </Button>
            <Button
              type="button"
              size="sm"
              variant={showSearch ? "secondary" : "default"}
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4 mr-1" />
              Cari ICD
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Box */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari kode ICD atau nama penyakit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="border rounded-lg max-h-[200px] overflow-y-auto">
                  {searchResults.map((icd) => {
                    const isAdded = diagnoses.some(
                      (d) => d.icd_code === icd.code,
                    );
                    return (
                      <div
                        key={icd.id}
                        className={`p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                          isAdded ? "bg-muted/30 opacity-60" : ""
                        }`}
                        onClick={() => !isAdded && handleAddDiagnosis(icd)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">
                                {icd.code}
                              </Badge>
                              {isAdded && (
                                <Badge variant="secondary" className="text-xs">
                                  Sudah ditambahkan
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm mt-1">
                              {icd.name_id || icd.name_en}
                            </p>
                            {icd.name_id && icd.name_en && (
                              <p className="text-xs text-muted-foreground">
                                {icd.name_en}
                              </p>
                            )}
                          </div>
                          {!isAdded && (
                            <Button size="sm" variant="ghost">
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!isSearching &&
                searchQuery.length >= 2 &&
                searchResults.length === 0 && (
                  <p className="text-center py-4 text-sm text-muted-foreground">
                    Tidak ditemukan kode ICD dengan kata kunci "{searchQuery}"
                  </p>
                )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Diagnosis List */}
        {diagnoses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada diagnosis</p>
            <p className="text-sm">
              Cari kode ICD atau tambahkan secara manual
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {diagnoses.map((diagnosis, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border ${
                  diagnosis.diagnosis_type === "primary"
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {diagnosis.icd_code && (
                        <Badge variant="outline" className="font-mono">
                          {diagnosis.icd_code}
                        </Badge>
                      )}
                      <Select
                        value={diagnosis.diagnosis_type}
                        onValueChange={(v) =>
                          handleTypeChange(index, v as DiagnosisType)
                        }
                      >
                        <SelectTrigger className="w-[120px] h-7">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">Primer</SelectItem>
                          <SelectItem value="secondary">Sekunder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {diagnosis.icd_code ? (
                      <p className="font-medium">{diagnosis.icd_name}</p>
                    ) : (
                      <Input
                        placeholder="Nama diagnosis..."
                        value={diagnosis.icd_name}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                      />
                    )}

                    <Textarea
                      placeholder="Catatan diagnosis (opsional)..."
                      value={diagnosis.notes}
                      onChange={(e) => handleNotesChange(index, e.target.value)}
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemoveDiagnosis(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
