"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Search, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Service } from "@/types/service";
import serviceService from "@/services/service.service";

export interface ServiceItemData {
  service_id?: number;
  service_name: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

interface ServiceInputProps {
  items: ServiceItemData[];
  onChange: (items: ServiceItemData[]) => void;
  departmentId?: number;
}

export function ServiceInput({
  items,
  onChange,
  departmentId,
}: ServiceInputProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const response = await serviceService.getActiveServices({
          department_id: departmentId,
        });
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [departmentId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenIndex(null);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add new item
  const handleAdd = () => {
    onChange([...items, { service_name: "", quantity: 1, unit_price: 0 }]);
  };

  // Remove item
  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  // Update item
  const handleUpdate = (
    index: number,
    field: keyof ServiceItemData,
    value: any,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  // Select service from dropdown
  const handleSelectService = (index: number, service: Service) => {
    const newItems = [...items];
    newItems[index] = {
      service_id: service.id,
      service_name: service.name,
      quantity: 1,
      unit_price: service.total_price,
    };
    onChange(newItems);
    setOpenIndex(null);
    setSearchQuery("");
  };

  // Filter services by search
  const filteredServices = services.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Layanan / Tindakan
          </CardTitle>
          <Button type="button" size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" />
            Tambah Layanan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada layanan ditambahkan</p>
            <p className="text-sm">
              Klik tombol "Tambah Layanan" untuk menambahkan
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border bg-muted/30 space-y-3"
              >
                <div className="flex items-start gap-3">
                  {/* Service Selection */}
                  <div
                    className="flex-1 relative"
                    ref={openIndex === index ? dropdownRef : null}
                  >
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Nama Layanan
                    </Label>
                    <div className="relative">
                      <Input
                        placeholder="Cari atau ketik nama layanan..."
                        value={
                          openIndex === index ? searchQuery : item.service_name
                        }
                        onChange={(e) => {
                          if (openIndex === index) {
                            setSearchQuery(e.target.value);
                          } else {
                            handleUpdate(index, "service_name", e.target.value);
                            handleUpdate(index, "service_id", undefined);
                          }
                        }}
                        onFocus={() => {
                          setOpenIndex(index);
                          setSearchQuery(item.service_name);
                        }}
                        className="h-10 pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* Dropdown */}
                    {openIndex === index && (
                      <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-6">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : filteredServices.length === 0 ? (
                          <div className="py-4 px-3 text-center text-sm text-muted-foreground">
                            <p>Layanan tidak ditemukan</p>
                            <p className="text-xs mt-1">
                              Tekan Enter untuk gunakan input manual
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/50">
                              Pilih dari daftar layanan
                            </div>
                            {filteredServices.map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                className="w-full px-3 py-2 text-left hover:bg-muted/50 flex items-center justify-between border-b last:border-b-0 transition-colors"
                                onClick={() =>
                                  handleSelectService(index, service)
                                }
                              >
                                <div>
                                  <p className="font-medium text-sm">
                                    {service.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {service.code} - {service.category_label}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="ml-2">
                                  {formatCurrency(service.total_price)}
                                </Badge>
                              </button>
                            ))}
                          </>
                        )}
                        {/* Manual input option */}
                        {searchQuery && (
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-primary/10 flex items-center gap-2 border-t bg-muted/30"
                            onClick={() => {
                              handleUpdate(index, "service_name", searchQuery);
                              handleUpdate(index, "service_id", undefined);
                              setOpenIndex(null);
                              setSearchQuery("");
                            }}
                          >
                            <Plus className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              Gunakan: <strong>"{searchQuery}"</strong>
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="w-24">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Jumlah
                    </Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdate(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                      className="h-10"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="w-36">
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      Harga Satuan
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      value={item.unit_price}
                      onChange={(e) =>
                        handleUpdate(
                          index,
                          "unit_price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      className="h-10"
                    />
                  </div>

                  {/* Delete Button */}
                  <div className="pt-6">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="flex justify-end pt-2 border-t">
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground mr-2">
                      Subtotal:
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            {items.length > 0 && (
              <div className="flex justify-end p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-right">
                  <span className="text-muted-foreground mr-3">
                    Total Layanan:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
