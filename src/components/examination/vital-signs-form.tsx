"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Thermometer, Scale, Ruler, Wind, Droplets } from "lucide-react";

interface VitalSignsFormProps {
  values: {
    blood_pressure_systolic?: number | null;
    blood_pressure_diastolic?: number | null;
    heart_rate?: number | null;
    respiratory_rate?: number | null;
    temperature?: number | null;
    weight?: number | null;
    height?: number | null;
    oxygen_saturation?: number | null;
  };
  onChange: (field: string, value: number | null) => void;
  disabled?: boolean;
}

export function VitalSignsForm({ values, onChange, disabled }: VitalSignsFormProps) {
  const handleChange = (field: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    onChange(field, numValue);
  };

  // Calculate BMI
  const bmi =
    values.weight && values.height
      ? (values.weight / Math.pow(values.height / 100, 2)).toFixed(1)
      : null;

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return { label: "Kurus", color: "text-yellow-600" };
    if (bmiValue < 25) return { label: "Normal", color: "text-green-600" };
    if (bmiValue < 30) return { label: "Gemuk", color: "text-orange-600" };
    return { label: "Obesitas", color: "text-red-600" };
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Tanda Vital (Vital Signs)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Blood Pressure */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-red-500" />
              Tekanan Darah
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="Sistolik"
                value={values.blood_pressure_systolic ?? ""}
                onChange={(e) => handleChange("blood_pressure_systolic", e.target.value)}
                disabled={disabled}
                className="w-20"
              />
              <span>/</span>
              <Input
                type="number"
                placeholder="Diastolik"
                value={values.blood_pressure_diastolic ?? ""}
                onChange={(e) => handleChange("blood_pressure_diastolic", e.target.value)}
                disabled={disabled}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">mmHg</span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              Denyut Nadi
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="60-100"
                value={values.heart_rate ?? ""}
                onChange={(e) => handleChange("heart_rate", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">bpm</span>
            </div>
          </div>

          {/* Respiratory Rate */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-blue-500" />
              Frekuensi Napas
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="12-20"
                value={values.respiratory_rate ?? ""}
                onChange={(e) => handleChange("respiratory_rate", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">x/mnt</span>
            </div>
          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-orange-500" />
              Suhu Tubuh
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                step="0.1"
                placeholder="36.5"
                value={values.temperature ?? ""}
                onChange={(e) => handleChange("temperature", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">°C</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Droplets className="h-4 w-4 text-blue-500" />
              Saturasi O2
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                placeholder="95-100"
                value={values.oxygen_saturation ?? ""}
                onChange={(e) => handleChange("oxygen_saturation", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Scale className="h-4 w-4 text-green-500" />
              Berat Badan
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                step="0.1"
                placeholder="60"
                value={values.weight ?? ""}
                onChange={(e) => handleChange("weight", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Ruler className="h-4 w-4 text-purple-500" />
              Tinggi Badan
            </Label>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                step="0.1"
                placeholder="170"
                value={values.height ?? ""}
                onChange={(e) => handleChange("height", e.target.value)}
                disabled={disabled}
              />
              <span className="text-sm text-muted-foreground">cm</span>
            </div>
          </div>

          {/* BMI (Calculated) */}
          <div className="space-y-2">
            <Label>BMI (Indeks Massa Tubuh)</Label>
            <div className="flex items-center gap-2 h-10 px-3 border rounded-md bg-muted">
              {bmi ? (
                <>
                  <span className="font-semibold">{bmi}</span>
                  <span className={`text-sm ${getBMICategory(parseFloat(bmi)).color}`}>
                    ({getBMICategory(parseFloat(bmi)).label})
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
