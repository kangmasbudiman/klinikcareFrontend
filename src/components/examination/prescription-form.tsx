"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Plus, Trash2, Pill, Search, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { medicineService } from "@/services/pharmacy.service";
import type { Medicine } from "@/types/pharmacy";

export interface PrescriptionItemData {
  medicine_id?: number;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
  stock?: number;
  unit?: string;
}

interface PrescriptionFormProps {
  items: PrescriptionItemData[];
  onChange: (items: PrescriptionItemData[]) => void;
  disabled?: boolean;
}

const defaultItem: PrescriptionItemData = {
  medicine_id: undefined,
  medicine_name: "",
  dosage: "",
  frequency: "",
  duration: "",
  quantity: 1,
  instructions: "",
};

// Common frequencies
const FREQUENCIES = [
  "1x1",
  "2x1",
  "3x1",
  "4x1",
  "1x2",
  "2x2",
  "3x2",
  "Jika perlu",
];

// Common durations
const DURATIONS = [
  "3 hari",
  "5 hari",
  "7 hari",
  "10 hari",
  "14 hari",
  "1 bulan",
];

export function PrescriptionForm({
  items,
  onChange,
  disabled,
}: PrescriptionFormProps) {
  const addItem = () => {
    onChange([...items, { ...defaultItem }]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (
    index: number,
    updates: Partial<PrescriptionItemData>,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updates };
    onChange(newItems);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-green-500" />
            Resep Obat
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addItem}
            disabled={disabled}
          >
            <Plus className="h-4 w-4 mr-1" />
            Tambah Obat
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Pill className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada obat ditambahkan</p>
            <Button
              type="button"
              variant="link"
              onClick={addItem}
              disabled={disabled}
            >
              + Tambah Obat
            </Button>
          </div>
        ) : (
          items.map((item, index) => (
            <PrescriptionItemRow
              key={index}
              item={item}
              index={index}
              disabled={disabled}
              onUpdate={updateItem}
              onRemove={removeItem}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

// Separate component for each prescription item row
interface PrescriptionItemRowProps {
  item: PrescriptionItemData;
  index: number;
  disabled?: boolean;
  onUpdate: (index: number, updates: Partial<PrescriptionItemData>) => void;
  onRemove: (index: number) => void;
}

function PrescriptionItemRow({
  item,
  index,
  disabled,
  onUpdate,
  onRemove,
}: PrescriptionItemRowProps) {
  const [inputValue, setInputValue] = useState(item.medicine_name);
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync inputValue with item.medicine_name when it changes externally
  useEffect(() => {
    setInputValue(item.medicine_name);
  }, [item.medicine_name]);

  // Search medicines with debounce
  useEffect(() => {
    if (inputValue.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await medicineService.getActiveMedicines({
          search: inputValue,
        });
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Error searching medicines:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setShowDropdown(true);
    // Update parent with new value and clear medicine_id since it's manual input
    onUpdate(index, {
      medicine_name: value,
      medicine_id: undefined,
      stock: undefined,
      unit: undefined,
    });
  };

  const handleSelectMedicine = (medicine: Medicine) => {
    setInputValue(medicine.name);
    setShowDropdown(false);
    setSearchResults([]);
    onUpdate(index, {
      medicine_id: medicine.id,
      medicine_name: medicine.name,
      dosage: medicine.unit || "",
      stock: medicine.current_stock,
      unit: medicine.unit,
    });
  };

  const handleFieldChange = (
    field: keyof PrescriptionItemData,
    value: string | number,
  ) => {
    onUpdate(index, { [field]: value });
  };

  return (
    <div className="p-4 border rounded-lg space-y-3 relative">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700"
        onClick={() => onRemove(index)}
        disabled={disabled}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="pr-10">
        <Label>Nama Obat *</Label>
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              type="text"
              placeholder="Ketik untuk mencari obat..."
              className="pl-10"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              disabled={disabled}
              autoComplete="off"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Results Dropdown */}
          {showDropdown && inputValue.length >= 2 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Mencari obat...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="px-3 py-2 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectMedicine(medicine)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm">{medicine.name}</p>
                          {medicine.generic_name && (
                            <p className="text-xs text-muted-foreground">
                              {medicine.generic_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={
                            medicine.current_stock > medicine.min_stock
                              ? "text-green-600 border-green-600"
                              : medicine.current_stock > 0
                                ? "text-yellow-600 border-yellow-600"
                                : "text-red-600 border-red-600"
                          }
                        >
                          Stok: {medicine.current_stock} {medicine.unit}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Tidak ditemukan obat dengan kata kunci &quot;{inputValue}
                  &quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Show selected medicine info */}
        {item.medicine_id && item.stock !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Package className="h-3 w-3 mr-1" />
              Stok tersedia: {item.stock} {item.unit}
            </Badge>
          </div>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div>
          <Label>Dosis</Label>
          <Input
            type="text"
            placeholder="500mg"
            value={item.dosage}
            onChange={(e) => handleFieldChange("dosage", e.target.value)}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Frekuensi</Label>
          <Input
            type="text"
            placeholder="3x1"
            value={item.frequency}
            onChange={(e) => handleFieldChange("frequency", e.target.value)}
            disabled={disabled}
            list={`freq-${index}`}
          />
          <datalist id={`freq-${index}`}>
            {FREQUENCIES.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Durasi</Label>
          <Input
            type="text"
            placeholder="5 hari"
            value={item.duration}
            onChange={(e) => handleFieldChange("duration", e.target.value)}
            disabled={disabled}
            list={`dur-${index}`}
          />
          <datalist id={`dur-${index}`}>
            {DURATIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </div>
        <div>
          <Label>Jumlah</Label>
          <Input
            type="number"
            min="1"
            placeholder="10"
            value={item.quantity}
            onChange={(e) =>
              handleFieldChange("quantity", parseInt(e.target.value) || 1)
            }
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <Label>Aturan Pakai / Instruksi</Label>
        <Input
          type="text"
          placeholder="Contoh: Setelah makan"
          value={item.instructions}
          onChange={(e) => handleFieldChange("instructions", e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
