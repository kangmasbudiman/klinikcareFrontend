"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Pill,
  MoreHorizontal,
  Pencil,
  Trash2,
  Power,
  Loader2,
  Package,
  AlertTriangle,
  Calendar,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  medicineService,
  medicineCategoryService,
} from "@/services/pharmacy.service";
import type {
  Medicine,
  MedicinePayload,
  MedicineStats,
  MedicineCategory,
  MedicineBatch,
} from "@/types/pharmacy";

export default function MedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<MedicineCategory[]>([]);
  const [stats, setStats] = useState<MedicineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [selectedBatches, setSelectedBatches] = useState<MedicineBatch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [units, setUnits] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<MedicinePayload>({
    name: "",
    generic_name: "",
    category_id: null,
    unit: "Tablet",
    purchase_price: 0,
    margin_percentage: 0,
    ppn_percentage: 11,
    is_ppn_included: false,
    selling_price: 0,
    min_stock: 10,
    max_stock: 100,
    manufacturer: "",
    description: "",
    requires_prescription: false,
    is_active: true,
  });

  // Calculated prices state
  const [calculatedPrices, setCalculatedPrices] = useState({
    price_before_ppn: 0,
    selling_price: 0,
    margin_amount: 0,
    ppn_amount: 0,
  });

  const fetchMedicines = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await medicineService.getMedicines({
        search,
        status: statusFilter,
        category_id:
          categoryFilter !== "all" ? parseInt(categoryFilter) : undefined,
        stock_status:
          stockFilter !== "all"
            ? (stockFilter as "low" | "out_of_stock")
            : undefined,
        page: currentPage,
        per_page: 10,
      });
      setMedicines(response.data);
      setTotalPages(response.meta.last_page);
      setTotal(response.meta.total);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast.error("Gagal memuat data obat");
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, categoryFilter, stockFilter, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await medicineCategoryService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await medicineService.getMedicineStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await medicineService.getUnits();
      setUnits(response.data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  useEffect(() => {
    fetchCategories();
    fetchStats();
    fetchUnits();
  }, []);

  const handleOpenModal = (medicine?: Medicine) => {
    if (medicine) {
      setSelectedMedicine(medicine);
      setFormData({
        name: medicine.name,
        generic_name: medicine.generic_name || "",
        category_id: medicine.category_id,
        unit: medicine.unit,
        purchase_price: medicine.purchase_price,
        margin_percentage: medicine.margin_percentage || 0,
        ppn_percentage: medicine.ppn_percentage || 11,
        is_ppn_included: medicine.is_ppn_included || false,
        selling_price: medicine.selling_price,
        min_stock: medicine.min_stock,
        max_stock: medicine.max_stock,
        manufacturer: medicine.manufacturer || "",
        description: medicine.description || "",
        requires_prescription: medicine.requires_prescription,
        is_active: medicine.is_active,
      });
      setCalculatedPrices({
        price_before_ppn: medicine.price_before_ppn || 0,
        selling_price: medicine.selling_price,
        margin_amount:
          (medicine.purchase_price * (medicine.margin_percentage || 0)) / 100,
        ppn_amount:
          ((medicine.price_before_ppn || 0) * (medicine.ppn_percentage || 11)) /
          100,
      });
    } else {
      setSelectedMedicine(null);
      setFormData({
        name: "",
        generic_name: "",
        category_id: null,
        unit: "Tablet",
        purchase_price: 0,
        margin_percentage: 0,
        ppn_percentage: 11,
        is_ppn_included: false,
        selling_price: 0,
        min_stock: 10,
        max_stock: 100,
        manufacturer: "",
        description: "",
        requires_prescription: false,
        is_active: true,
      });
      setCalculatedPrices({
        price_before_ppn: 0,
        selling_price: 0,
        margin_amount: 0,
        ppn_amount: 0,
      });
    }
    setIsModalOpen(true);
  };

  // Calculate selling price when purchase price, margin, or PPN changes
  const handleCalculatePrice = async (
    purchasePrice: number,
    marginPercentage: number,
    ppnPercentage: number,
  ) => {
    if (purchasePrice > 0) {
      try {
        const response = await medicineService.calculatePrice({
          purchase_price: purchasePrice,
          margin_percentage: marginPercentage,
          ppn_percentage: ppnPercentage,
        });
        setCalculatedPrices(response.data);
        setFormData((prev) => ({
          ...prev,
          selling_price: response.data.selling_price,
        }));
      } catch (error) {
        // Fallback calculation if API fails
        const priceBeforePpn = purchasePrice * (1 + marginPercentage / 100);
        const sellingPrice = priceBeforePpn * (1 + ppnPercentage / 100);
        setCalculatedPrices({
          price_before_ppn: priceBeforePpn,
          selling_price: sellingPrice,
          margin_amount: (purchasePrice * marginPercentage) / 100,
          ppn_amount: (priceBeforePpn * ppnPercentage) / 100,
        });
        setFormData((prev) => ({
          ...prev,
          selling_price: sellingPrice,
        }));
      }
    }
  };

  const handleViewBatches = async (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    try {
      const response = await medicineService.getMedicineBatches(medicine.id);
      setSelectedBatches(response.data);
      setIsBatchModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat data batch");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Nama obat wajib diisi");
      return;
    }
    if (!formData.unit.trim()) {
      toast.error("Satuan wajib diisi");
      return;
    }
    if ((formData.selling_price || 0) <= 0) {
      toast.error("Harga jual harus lebih dari 0");
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedMedicine) {
        await medicineService.updateMedicine(selectedMedicine.id, formData);
        toast.success("Obat berhasil diperbarui");
      } else {
        await medicineService.createMedicine(formData);
        toast.success("Obat berhasil ditambahkan");
      }
      setIsModalOpen(false);
      fetchMedicines();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menyimpan obat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMedicine) return;

    setIsSubmitting(true);
    try {
      await medicineService.deleteMedicine(selectedMedicine.id);
      toast.success("Obat berhasil dihapus");
      setIsDeleteModalOpen(false);
      setSelectedMedicine(null);
      fetchMedicines();
      fetchStats();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menghapus obat");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (medicine: Medicine) => {
    try {
      await medicineService.toggleMedicineStatus(medicine.id);
      toast.success(
        medicine.is_active
          ? "Obat berhasil dinonaktifkan"
          : "Obat berhasil diaktifkan",
      );
      fetchMedicines();
      fetchStats();
    } catch (error) {
      toast.error("Gagal mengubah status obat");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStockStatusBadge = (status: Medicine["stock_status"]) => {
    const variants: Record<
      Medicine["stock_status"],
      "destructive" | "warning" | "success" | "secondary"
    > = {
      out_of_stock: "destructive",
      low: "warning",
      normal: "success",
      overstock: "secondary",
    };
    const labels: Record<Medicine["stock_status"], string> = {
      out_of_stock: "Habis",
      low: "Menipis",
      normal: "Normal",
      overstock: "Berlebih",
    };
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Master Obat</h1>
          <p className="text-muted-foreground">Kelola data obat dan stok</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Obat
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Obat
                </CardTitle>
                <Pill className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.active} aktif
                </p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stok Menipis
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.low_stock}
                </div>
                <p className="text-xs text-muted-foreground">Perlu restock</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stok Habis
                </CardTitle>
                <Package className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {stats.out_of_stock}
                </div>
                <p className="text-xs text-muted-foreground">Segera order</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Kadaluarsa
                </CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {stats.expiring_soon}
                </div>
                <p className="text-xs text-muted-foreground">Dalam 3 bulan</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Filters & Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Obat</CardTitle>
          <CardDescription>Total {total} obat terdaftar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama obat atau kode..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Select
              value={categoryFilter}
              onValueChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={stockFilter}
              onValueChange={(value) => {
                setStockFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Status Stok" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Stok</SelectItem>
                <SelectItem value="low">Stok Menipis</SelectItem>
                <SelectItem value="out_of_stock">Stok Habis</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value: "all" | "active" | "inactive") => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Obat</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead className="text-right">Harga Beli</TableHead>
                  <TableHead className="text-right">Harga Jual</TableHead>
                  <TableHead className="text-center">Stok</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : medicines.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-10 text-muted-foreground"
                    >
                      Tidak ada data obat
                    </TableCell>
                  </TableRow>
                ) : (
                  medicines.map((medicine) => (
                    <TableRow key={medicine.id}>
                      <TableCell className="font-mono text-sm">
                        {medicine.code}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{medicine.name}</div>
                          {medicine.generic_name && (
                            <div className="text-sm text-muted-foreground">
                              {medicine.generic_name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{medicine.category?.name || "-"}</TableCell>
                      <TableCell>{medicine.unit}</TableCell>
                      <TableCell className="text-right">
                        {formatPrice(medicine.purchase_price)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(medicine.selling_price)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium">
                            {medicine.current_stock}
                          </span>
                          {getStockStatusBadge(medicine.stock_status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={medicine.is_active ? "success" : "secondary"}
                        >
                          {medicine.is_active ? "Aktif" : "Tidak Aktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewBatches(medicine)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Lihat Batch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenModal(medicine)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(medicine)}
                            >
                              <Power className="h-4 w-4 mr-2" />
                              {medicine.is_active ? "Nonaktifkan" : "Aktifkan"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => {
                                setSelectedMedicine(medicine);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMedicine ? "Edit Obat" : "Tambah Obat"}
            </DialogTitle>
            <DialogDescription>
              {selectedMedicine
                ? "Perbarui informasi obat"
                : "Tambahkan obat baru ke sistem"}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
              <TabsTrigger value="stock">Harga & Stok</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Obat *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Paracetamol 500mg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="generic_name">Nama Generik</Label>
                <Input
                  id="generic_name"
                  value={formData.generic_name}
                  onChange={(e) =>
                    setFormData({ ...formData, generic_name: e.target.value })
                  }
                  placeholder="Acetaminophen"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category_id">Kategori</Label>
                  <Select
                    value={formData.category_id?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category_id: value ? parseInt(value) : null,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="unit">Satuan *</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value) =>
                      setFormData({ ...formData, unit: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih satuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="manufacturer">Produsen/Pabrik</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) =>
                    setFormData({ ...formData, manufacturer: e.target.value })
                  }
                  placeholder="PT. Farmasi Indonesia"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi obat (opsional)"
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Memerlukan Resep</Label>
                  <p className="text-sm text-muted-foreground">
                    Obat ini memerlukan resep dokter
                  </p>
                </div>
                <Switch
                  checked={formData.requires_prescription}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, requires_prescription: checked })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="stock" className="space-y-4 mt-4">
              {/* Harga Beli */}
              <div className="grid gap-2">
                <Label htmlFor="purchase_price">Harga Beli (HPP)</Label>
                <Input
                  id="purchase_price"
                  type="number"
                  value={formData.purchase_price}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    setFormData({ ...formData, purchase_price: value });
                    handleCalculatePrice(
                      value,
                      formData.margin_percentage || 0,
                      formData.ppn_percentage || 11,
                    );
                  }}
                  placeholder="0"
                />
              </div>

              {/* Margin & PPN */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="margin_percentage">Margin (%)</Label>
                  <Input
                    id="margin_percentage"
                    type="number"
                    step="0.1"
                    value={formData.margin_percentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, margin_percentage: value });
                      handleCalculatePrice(
                        formData.purchase_price || 0,
                        value,
                        formData.ppn_percentage || 11,
                      );
                    }}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Margin: {formatPrice(calculatedPrices.margin_amount)}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ppn_percentage">PPN (%)</Label>
                  <Input
                    id="ppn_percentage"
                    type="number"
                    step="0.1"
                    value={formData.ppn_percentage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      setFormData({ ...formData, ppn_percentage: value });
                      handleCalculatePrice(
                        formData.purchase_price || 0,
                        formData.margin_percentage || 0,
                        value,
                      );
                    }}
                    placeholder="11"
                  />
                  <p className="text-xs text-muted-foreground">
                    PPN: {formatPrice(calculatedPrices.ppn_amount)}
                  </p>
                </div>
              </div>

              {/* Ringkasan Harga */}
              {(formData.purchase_price || 0) > 0 && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <h4 className="font-medium text-sm">Ringkasan Harga</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Harga Beli (HPP):
                    </span>
                    <span className="text-right">
                      {formatPrice(formData.purchase_price || 0)}
                    </span>

                    <span className="text-muted-foreground">
                      + Margin ({formData.margin_percentage}%):
                    </span>
                    <span className="text-right">
                      {formatPrice(calculatedPrices.margin_amount)}
                    </span>

                    <span className="text-muted-foreground">
                      = Harga Sebelum PPN:
                    </span>
                    <span className="text-right">
                      {formatPrice(calculatedPrices.price_before_ppn)}
                    </span>

                    <span className="text-muted-foreground">
                      + PPN ({formData.ppn_percentage}%):
                    </span>
                    <span className="text-right">
                      {formatPrice(calculatedPrices.ppn_amount)}
                    </span>

                    <span className="font-medium border-t pt-2">
                      Harga Jual:
                    </span>
                    <span className="text-right font-bold text-primary border-t pt-2">
                      {formatPrice(calculatedPrices.selling_price)}
                    </span>
                  </div>
                </div>
              )}

              {/* Manual Override Harga Jual */}
              <div className="grid gap-2">
                <Label htmlFor="selling_price">
                  Harga Jual (Manual Override)
                </Label>
                <Input
                  id="selling_price"
                  type="number"
                  value={formData.selling_price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      selling_price: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Ubah untuk override harga kalkulasi otomatis
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="min_stock">Stok Minimum</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    value={formData.min_stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_stock: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Notifikasi saat stok di bawah nilai ini
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_stock">Stok Maksimum</Label>
                  <Input
                    id="max_stock"
                    type="number"
                    value={formData.max_stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_stock: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="100"
                  />
                  <p className="text-xs text-muted-foreground">
                    Kapasitas penyimpanan maksimum
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Status Aktif</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_active
                      ? "Obat tersedia untuk transaksi"
                      : "Obat tidak aktif"}
                  </p>
                </div>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {selectedMedicine ? "Simpan Perubahan" : "Tambah Obat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Modal */}
      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Batch - {selectedMedicine?.name}</DialogTitle>
            <DialogDescription>
              Daftar batch obat yang tersedia
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. Batch</TableHead>
                  <TableHead>Kadaluarsa</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedBatches.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Belum ada batch
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-mono">
                        {batch.batch_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {new Date(batch.expiry_date).toLocaleDateString(
                            "id-ID",
                          )}
                          {batch.is_expiring_soon && !batch.is_expired && (
                            <Badge variant="warning">Segera Exp</Badge>
                          )}
                          {batch.is_expired && (
                            <Badge variant="destructive">Expired</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {batch.current_qty}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            batch.status === "available"
                              ? "success"
                              : batch.status === "low"
                                ? "warning"
                                : batch.status === "expired"
                                  ? "destructive"
                                  : "secondary"
                          }
                        >
                          {batch.status === "available"
                            ? "Tersedia"
                            : batch.status === "low"
                              ? "Menipis"
                              : batch.status === "expired"
                                ? "Kadaluarsa"
                                : "Habis"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBatchModalOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Obat</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus obat "{selectedMedicine?.name}"?
              {(selectedMedicine?.current_stock || 0) > 0 && (
                <span className="block mt-2 text-destructive">
                  Obat ini masih memiliki stok {selectedMedicine?.current_stock}
                  !
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
