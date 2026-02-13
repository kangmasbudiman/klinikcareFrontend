"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  ArrowRightLeft,
  FileText,
  Loader2,
  Plus,
  Eye,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  stockMovementService,
  medicineService,
} from "@/services/pharmacy.service";
import type {
  StockMovement,
  StockMovementFilters,
  StockMovementStats,
  StockMovementType,
  StockMovementReason,
  StockAdjustmentPayload,
  StockCardResponse,
  Medicine,
  MedicineBatch,
} from "@/types/pharmacy";
import { MOVEMENT_REASON_LABELS } from "@/types/pharmacy";

// Validation schema for adjustment
const adjustmentSchema = z.object({
  medicine_id: z.number().min(1, "Pilih obat"),
  medicine_batch_id: z.number().optional(),
  adjustment_type: z.enum(["plus", "minus"]),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  reason: z.string().min(1, "Pilih alasan"),
  notes: z.string().optional(),
});

type AdjustmentFormData = z.infer<typeof adjustmentSchema>;

export default function StockMovementsPage() {
  // State
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [stats, setStats] = useState<StockMovementStats | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicineBatches, setSelectedMedicineBatches] = useState<MedicineBatch[]>([]);
  const [stockCard, setStockCard] = useState<StockCardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<StockMovementFilters>({
    search: "",
    movement_type: undefined,
    reason: undefined,
    medicine_id: undefined,
    page: 1,
    per_page: 15,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [adjustmentModalOpen, setAdjustmentModalOpen] = useState(false);
  const [stockCardModalOpen, setStockCardModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const form = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      medicine_id: 0,
      medicine_batch_id: undefined,
      adjustment_type: "plus",
      quantity: 1,
      reason: "adjustment_plus",
      notes: "",
    },
  });

  const adjustmentType = form.watch("adjustment_type");
  const selectedMedicineId = form.watch("medicine_id");

  // Fetch data
  const fetchMovements = useCallback(async () => {
    setLoading(true);
    try {
      const response = await stockMovementService.getStockMovements({
        ...filters,
        page: currentPage,
      });
      setMovements(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      toast.error("Gagal memuat data mutasi stok");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await stockMovementService.getStockMovementStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const response = await medicineService.getActiveMedicines({});
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  const fetchMedicineBatches = async (medicineId: number) => {
    try {
      const response = await medicineService.getMedicineBatches(medicineId);
      setSelectedMedicineBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setSelectedMedicineBatches([]);
    }
  };

  const fetchStockCard = async (medicineId: number) => {
    try {
      const data = await stockMovementService.getStockCard(medicineId);
      setStockCard(data);
      setStockCardModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat kartu stok");
    }
  };

  useEffect(() => {
    fetchMovements();
    fetchStats();
    fetchMedicines();
  }, [fetchMovements]);

  // Watch for medicine changes to load batches
  useEffect(() => {
    if (selectedMedicineId && selectedMedicineId > 0) {
      fetchMedicineBatches(selectedMedicineId);
    } else {
      setSelectedMedicineBatches([]);
    }
  }, [selectedMedicineId]);

  // Update reason when adjustment type changes
  useEffect(() => {
    if (adjustmentType === "plus") {
      form.setValue("reason", "adjustment_plus");
    } else {
      form.setValue("reason", "adjustment_minus");
    }
  }, [adjustmentType, form]);

  // Handlers
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleMovementTypeFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      movement_type: value === "all" ? undefined : (value as StockMovementType),
    }));
    setCurrentPage(1);
  };

  const handleReasonFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      reason: value === "all" ? undefined : (value as StockMovementReason),
    }));
    setCurrentPage(1);
  };

  const handleMedicineFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      medicine_id: value ? parseInt(value) : undefined,
    }));
    setCurrentPage(1);
  };

  const handleOpenAdjustmentModal = () => {
    form.reset({
      medicine_id: 0,
      medicine_batch_id: undefined,
      adjustment_type: "plus",
      quantity: 1,
      reason: "adjustment_plus",
      notes: "",
    });
    setAdjustmentModalOpen(true);
  };

  const handleSubmitAdjustment = async (data: AdjustmentFormData) => {
    setIsSubmitting(true);
    try {
      const payload: StockAdjustmentPayload = {
        medicine_id: data.medicine_id,
        medicine_batch_id: data.medicine_batch_id,
        adjustment_type: data.adjustment_type,
        quantity: data.quantity,
        reason: data.reason as StockMovementReason,
        notes: data.notes,
      };

      await stockMovementService.createAdjustment(payload);
      toast.success("Penyesuaian stok berhasil");
      setAdjustmentModalOpen(false);
      fetchMovements();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal melakukan penyesuaian stok");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = (movement: StockMovement) => {
    setSelectedMovement(movement);
    setDetailModalOpen(true);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Render movement type badge
  const renderMovementTypeBadge = (type: StockMovementType) => {
    if (type === "in") {
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
          <ArrowUpCircle className="mr-1 h-3 w-3" />
          Masuk
        </Badge>
      );
    }
    return (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
        <ArrowDownCircle className="mr-1 h-3 w-3" />
        Keluar
      </Badge>
    );
  };

  // Get available reasons based on adjustment type
  const getReasonOptions = () => {
    if (adjustmentType === "plus") {
      return [
        { value: "adjustment_plus", label: "Penyesuaian (+)" },
        { value: "return_patient", label: "Retur dari Pasien" },
        { value: "initial_stock", label: "Stok Awal" },
        { value: "other", label: "Lainnya" },
      ];
    }
    return [
      { value: "adjustment_minus", label: "Penyesuaian (-)" },
      { value: "expired", label: "Kadaluarsa" },
      { value: "damage", label: "Rusak/Pecah" },
      { value: "return_supplier", label: "Retur ke Supplier" },
      { value: "other", label: "Lainnya" },
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mutasi Stok</h1>
          <p className="text-muted-foreground">
            Catatan keluar masuk stok obat
          </p>
        </div>
        <Button onClick={handleOpenAdjustmentModal}>
          <Plus className="mr-2 h-4 w-4" />
          Penyesuaian Stok
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Masuk</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                +{stats?.total_in || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Keluar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                -{stats?.total_out || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mutasi Hari Ini</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats?.movements_today || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Transaksi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Change</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className={`text-2xl font-bold ${
                (stats?.total_in || 0) - (stats?.total_out || 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}>
                {(stats?.total_in || 0) - (stats?.total_out || 0) >= 0 ? "+" : ""}
                {(stats?.total_in || 0) - (stats?.total_out || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 md:max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari no. mutasi..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <Label>Tipe</Label>
                <Select
                  value={filters.movement_type || "all"}
                  onValueChange={handleMovementTypeFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="in">Masuk</SelectItem>
                    <SelectItem value="out">Keluar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Alasan</Label>
                <Select
                  value={filters.reason || "all"}
                  onValueChange={handleReasonFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Alasan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Alasan</SelectItem>
                    {Object.entries(MOVEMENT_REASON_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Obat</Label>
                <Select
                  value={filters.medicine_id?.toString() || ""}
                  onValueChange={handleMedicineFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Obat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Obat</SelectItem>
                    {medicines.map((medicine) => (
                      <SelectItem key={medicine.id} value={medicine.id.toString()}>
                        {medicine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Mutasi</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Obat</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Stok Akhir</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : movements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Belum ada mutasi stok
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell className="font-medium">
                      {movement.movement_number}
                    </TableCell>
                    <TableCell>
                      {format(new Date(movement.movement_date), "dd MMM yyyy HH:mm", {
                        locale: localeId,
                      })}
                    </TableCell>
                    <TableCell>{movement.medicine?.name || "-"}</TableCell>
                    <TableCell>
                      {movement.medicine_batch?.batch_number || "-"}
                    </TableCell>
                    <TableCell>
                      {renderMovementTypeBadge(movement.movement_type)}
                    </TableCell>
                    <TableCell>
                      {MOVEMENT_REASON_LABELS[movement.reason] || movement.reason}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={movement.movement_type === "in" ? "text-green-600" : "text-red-600"}>
                        {movement.movement_type === "in" ? "+" : "-"}{movement.quantity} {movement.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {movement.stock_after}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetail(movement)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => fetchStockCard(movement.medicine_id)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Menampilkan {movements.length} dari {totalItems} data
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Adjustment Modal */}
      <Dialog open={adjustmentModalOpen} onOpenChange={setAdjustmentModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Penyesuaian Stok</DialogTitle>
            <DialogDescription>
              Lakukan penyesuaian stok secara manual
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmitAdjustment)} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipe Penyesuaian</Label>
              <Tabs
                value={adjustmentType}
                onValueChange={(value) => form.setValue("adjustment_type", value as "plus" | "minus")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="plus" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Tambah Stok
                  </TabsTrigger>
                  <TabsTrigger value="minus" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-800">
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                    Kurangi Stok
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label>
                Obat <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch("medicine_id")?.toString() || ""}
                onValueChange={(value) => {
                  form.setValue("medicine_id", parseInt(value));
                  form.setValue("medicine_batch_id", undefined);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Obat" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.id.toString()}>
                      <div className="flex justify-between w-full">
                        <span>{medicine.name}</span>
                        <span className="text-muted-foreground ml-2">
                          Stok: {medicine.current_stock}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.medicine_id && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.medicine_id.message}
                </p>
              )}
            </div>

            {selectedMedicineBatches.length > 0 && adjustmentType === "minus" && (
              <div className="space-y-2">
                <Label>Batch (Opsional)</Label>
                <Select
                  value={form.watch("medicine_batch_id")?.toString() || ""}
                  onValueChange={(value) => form.setValue("medicine_batch_id", value ? parseInt(value) : undefined)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Batch (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Batch</SelectItem>
                    {selectedMedicineBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id.toString()}>
                        {batch.batch_number} - Stok: {batch.current_qty} (Exp: {format(new Date(batch.expiry_date), "dd/MM/yyyy")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Jumlah <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                {...form.register("quantity", { valueAsNumber: true })}
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Alasan <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch("reason")}
                onValueChange={(value) => form.setValue("reason", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Alasan" />
                </SelectTrigger>
                <SelectContent>
                  {getReasonOptions().map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.reason && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Catatan</Label>
              <Textarea
                {...form.register("notes")}
                placeholder="Catatan tambahan..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAdjustmentModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Card Modal */}
      <Dialog open={stockCardModalOpen} onOpenChange={setStockCardModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kartu Stok</DialogTitle>
            <DialogDescription>
              {stockCard?.medicine?.name}
            </DialogDescription>
          </DialogHeader>

          {stockCard && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Stok Saat Ini</p>
                  <p className="text-2xl font-bold">{stockCard.current_stock} {stockCard.medicine.unit}</p>
                </div>
                <Badge className={
                  stockCard.medicine.stock_status === "out_of_stock"
                    ? "bg-red-100 text-red-800"
                    : stockCard.medicine.stock_status === "low"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }>
                  {stockCard.medicine.stock_status === "out_of_stock"
                    ? "Habis"
                    : stockCard.medicine.stock_status === "low"
                    ? "Menipis"
                    : "Normal"}
                </Badge>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Mutasi</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Alasan</TableHead>
                    <TableHead className="text-right">Masuk</TableHead>
                    <TableHead className="text-right">Keluar</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockCard.movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Belum ada mutasi
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockCard.movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {format(new Date(movement.movement_date), "dd/MM/yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{movement.movement_number}</TableCell>
                        <TableCell>
                          {movement.medicine_batch?.batch_number || "-"}
                        </TableCell>
                        <TableCell>
                          {MOVEMENT_REASON_LABELS[movement.reason] || movement.reason}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {movement.movement_type === "in" ? `+${movement.quantity}` : "-"}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {movement.movement_type === "out" ? `-${movement.quantity}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {movement.stock_after}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Mutasi Stok</DialogTitle>
            <DialogDescription>
              {selectedMovement?.movement_number}
            </DialogDescription>
          </DialogHeader>

          {selectedMovement && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Obat</p>
                  <p className="font-medium">{selectedMovement.medicine?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Batch</p>
                  <p className="font-medium">
                    {selectedMovement.medicine_batch?.batch_number || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {format(new Date(selectedMovement.movement_date), "dd MMMM yyyy HH:mm", {
                      locale: localeId,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipe</p>
                  {renderMovementTypeBadge(selectedMovement.movement_type)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alasan</p>
                  <p className="font-medium">
                    {MOVEMENT_REASON_LABELS[selectedMovement.reason] || selectedMovement.reason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah</p>
                  <p className={`font-medium ${
                    selectedMovement.movement_type === "in" ? "text-green-600" : "text-red-600"
                  }`}>
                    {selectedMovement.movement_type === "in" ? "+" : "-"}
                    {selectedMovement.quantity} {selectedMovement.unit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok Sebelum</p>
                  <p className="font-medium">{selectedMovement.stock_before}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stok Sesudah</p>
                  <p className="font-medium">{selectedMovement.stock_after}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                  <p className="font-medium">{selectedMovement.creator?.name || "-"}</p>
                </div>
                {selectedMovement.reference_type && (
                  <div>
                    <p className="text-sm text-muted-foreground">Referensi</p>
                    <p className="font-medium">
                      {selectedMovement.reference_type} #{selectedMovement.reference_id}
                    </p>
                  </div>
                )}
              </div>
              {selectedMovement.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium">{selectedMovement.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
