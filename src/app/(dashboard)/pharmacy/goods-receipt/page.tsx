"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  PackageCheck,
  Package,
  FileText,
  Loader2,
  X,
  AlertTriangle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

import {
  goodsReceiptService,
  purchaseOrderService,
  supplierService,
  medicineService,
} from "@/services/pharmacy.service";
import type {
  GoodsReceipt,
  GoodsReceiptPayload,
  GoodsReceiptFilters,
  GoodsReceiptStats,
  GoodsReceiptStatus,
  PurchaseOrder,
  Supplier,
  Medicine,
} from "@/types/pharmacy";
import { GR_STATUS_COLORS, GR_STATUS_LABELS } from "@/types/pharmacy";

// Validation schema
const grItemSchema = z.object({
  purchase_order_item_id: z.number().optional(),
  medicine_id: z.number().min(1, "Pilih obat"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  unit: z.string().min(1, "Unit harus diisi"),
  unit_price: z.number().min(0, "Harga tidak boleh negatif"),
  batch_number: z.string().min(1, "No. batch harus diisi"),
  expiry_date: z.string().min(1, "Tanggal kadaluarsa harus diisi"),
  notes: z.string().optional(),
});

const grSchema = z.object({
  purchase_order_id: z.number().optional(),
  supplier_id: z.number().min(1, "Pilih supplier"),
  receipt_date: z.string().min(1, "Tanggal penerimaan harus diisi"),
  supplier_invoice_number: z.string().optional(),
  supplier_invoice_date: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(grItemSchema).min(1, "Minimal 1 item"),
});

type GRFormData = z.infer<typeof grSchema>;

export default function GoodsReceiptPage() {
  // State
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [stats, setStats] = useState<GoodsReceiptStats | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pendingPOs, setPendingPOs] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<GoodsReceiptFilters>({
    search: "",
    status: "all",
    supplier_id: undefined,
    page: 1,
    per_page: 10,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectPOModalOpen, setSelectPOModalOpen] = useState(false);
  const [selectedGR, setSelectedGR] = useState<GoodsReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form
  const form = useForm<GRFormData>({
    resolver: zodResolver(grSchema),
    defaultValues: {
      purchase_order_id: undefined,
      supplier_id: 0,
      receipt_date: format(new Date(), "yyyy-MM-dd"),
      supplier_invoice_number: "",
      supplier_invoice_date: "",
      notes: "",
      items: [
        {
          medicine_id: 0,
          quantity: 1,
          unit: "",
          unit_price: 0,
          batch_number: "",
          expiry_date: "",
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch data
  const fetchGoodsReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await goodsReceiptService.getGoodsReceipts({
        ...filters,
        page: currentPage,
      });
      setGoodsReceipts(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Error fetching goods receipts:", error);
      toast.error("Gagal memuat data penerimaan barang");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await goodsReceiptService.getGoodsReceiptStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getActiveSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
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

  const fetchPendingPOs = async () => {
    try {
      const data = await purchaseOrderService.getNeedsReceiving();
      setPendingPOs(data);
    } catch (error) {
      console.error("Error fetching pending POs:", error);
    }
  };

  useEffect(() => {
    fetchGoodsReceipts();
    fetchStats();
    fetchSuppliers();
    fetchMedicines();
    fetchPendingPOs();
  }, [fetchGoodsReceipts]);

  // Handlers
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as GoodsReceiptStatus | "all",
    }));
    setCurrentPage(1);
  };

  const handleSupplierFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      supplier_id: value ? parseInt(value) : undefined,
    }));
    setCurrentPage(1);
  };

  const handleOpenModal = (gr?: GoodsReceipt) => {
    if (gr) {
      setSelectedGR(gr);
      form.reset({
        purchase_order_id: gr.purchase_order_id || undefined,
        supplier_id: gr.supplier_id,
        receipt_date: gr.receipt_date,
        supplier_invoice_number: gr.supplier_invoice_number || "",
        supplier_invoice_date: gr.supplier_invoice_date || "",
        notes: gr.notes || "",
        items:
          gr.items?.map((item) => ({
            purchase_order_item_id: item.purchase_order_item_id || undefined,
            medicine_id: item.medicine_id,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            batch_number: item.batch_number,
            expiry_date: item.expiry_date,
            notes: item.notes || "",
          })) || [],
      });
    } else {
      setSelectedGR(null);
      form.reset({
        purchase_order_id: undefined,
        supplier_id: 0,
        receipt_date: format(new Date(), "yyyy-MM-dd"),
        supplier_invoice_number: "",
        supplier_invoice_date: "",
        notes: "",
        items: [
          {
            medicine_id: 0,
            quantity: 1,
            unit: "",
            unit_price: 0,
            batch_number: "",
            expiry_date: "",
            notes: "",
          },
        ],
      });
    }
    setModalOpen(true);
  };

  const handleCreateFromPO = async (po: PurchaseOrder) => {
    try {
      const data = await goodsReceiptService.createFromPo(po.id);

      form.reset({
        purchase_order_id: po.id,
        supplier_id: po.supplier_id,
        receipt_date: format(new Date(), "yyyy-MM-dd"),
        supplier_invoice_number: "",
        supplier_invoice_date: "",
        notes: "",
        items: data.items.map((item: any) => ({
          purchase_order_item_id: item.purchase_order_item_id,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          batch_number: "",
          expiry_date: "",
          notes: "",
        })),
      });

      setSelectPOModalOpen(false);
      setModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat data dari PO");
    }
  };

  const handleViewDetail = async (gr: GoodsReceipt) => {
    try {
      const detail = await goodsReceiptService.getGoodsReceiptById(gr.id);
      setSelectedGR(detail);
      setDetailModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat detail penerimaan");
    }
  };

  const handleSubmit = async (data: GRFormData) => {
    setIsSubmitting(true);
    try {
      const payload: GoodsReceiptPayload = {
        purchase_order_id: data.purchase_order_id,
        supplier_id: data.supplier_id,
        receipt_date: data.receipt_date,
        supplier_invoice_number: data.supplier_invoice_number || undefined,
        supplier_invoice_date: data.supplier_invoice_date || undefined,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          purchase_order_item_id: item.purchase_order_item_id,
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          batch_number: item.batch_number,
          expiry_date: item.expiry_date,
          notes: item.notes,
        })),
      };

      if (selectedGR) {
        await goodsReceiptService.updateGoodsReceipt(selectedGR.id, payload);
        toast.success("Penerimaan barang berhasil diupdate");
      } else {
        await goodsReceiptService.createGoodsReceipt(payload);
        toast.success("Penerimaan barang berhasil dibuat");
      }

      setModalOpen(false);
      fetchGoodsReceipts();
      fetchStats();
      fetchPendingPOs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menyimpan penerimaan barang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedGR) return;
    setIsSubmitting(true);
    try {
      await goodsReceiptService.deleteGoodsReceipt(selectedGR.id);
      toast.success("Penerimaan barang berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedGR(null);
      fetchGoodsReceipts();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menghapus penerimaan barang");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    if (!selectedGR) return;
    setIsSubmitting(true);
    try {
      await goodsReceiptService.complete(selectedGR.id);
      toast.success("Penerimaan barang selesai. Stok telah diupdate.");
      setCompleteDialogOpen(false);
      setSelectedGR(null);
      fetchGoodsReceipts();
      fetchStats();
      fetchPendingPOs();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menyelesaikan penerimaan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (gr: GoodsReceipt) => {
    try {
      await goodsReceiptService.cancel(gr.id);
      toast.success("Penerimaan barang berhasil dibatalkan");
      fetchGoodsReceipts();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal membatalkan penerimaan");
    }
  };

  // Calculate item total
  const calculateItemTotal = (index: number) => {
    const item = form.watch(`items.${index}`);
    if (!item) return 0;
    return item.quantity * item.unit_price;
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    const items = form.watch("items");
    return items.reduce((total, _, index) => total + calculateItemTotal(index), 0);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Render status badge
  const renderStatusBadge = (status: GoodsReceiptStatus) => {
    return (
      <Badge className={GR_STATUS_COLORS[status]}>
        {GR_STATUS_LABELS[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Penerimaan Barang</h1>
          <p className="text-muted-foreground">
            Kelola penerimaan barang dari supplier
          </p>
        </div>
        <div className="flex gap-2">
          {pendingPOs.length > 0 && (
            <Button variant="outline" onClick={() => setSelectPOModalOpen(true)}>
              <Package className="mr-2 h-4 w-4" />
              Dari PO ({pendingPOs.length})
            </Button>
          )}
          <Button onClick={() => handleOpenModal()}>
            <Plus className="mr-2 h-4 w-4" />
            Penerimaan Baru
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penerimaan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats?.total || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <PackageCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.draft || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats?.total_today || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Bulan Ini</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.total_value_this_month || 0)}
              </div>
            )}
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
                  placeholder="Cari no. penerimaan..."
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
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Supplier</Label>
                <Select
                  value={filters.supplier_id?.toString() || ""}
                  onValueChange={handleSupplierFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Supplier</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
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
                <TableHead>No. Penerimaan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>No. PO</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : goodsReceipts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <PackageCheck className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Belum ada penerimaan barang
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                goodsReceipts.map((gr) => (
                  <TableRow key={gr.id}>
                    <TableCell className="font-medium">{gr.receipt_number}</TableCell>
                    <TableCell>
                      {format(new Date(gr.receipt_date), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </TableCell>
                    <TableCell>{gr.supplier?.name || "-"}</TableCell>
                    <TableCell>
                      {gr.purchase_order?.po_number || "-"}
                    </TableCell>
                    <TableCell>{formatCurrency(gr.total_amount)}</TableCell>
                    <TableCell>{renderStatusBadge(gr.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetail(gr)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          {gr.status === "draft" && (
                            <>
                              <DropdownMenuItem onClick={() => handleOpenModal(gr)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedGR(gr);
                                  setCompleteDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Selesaikan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleCancel(gr)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Batalkan
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedGR(gr);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Menampilkan {goodsReceipts.length} dari {totalItems} data
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Select PO Modal */}
      <Dialog open={selectPOModalOpen} onOpenChange={setSelectPOModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pilih Purchase Order</DialogTitle>
            <DialogDescription>
              Pilih PO yang akan diterima barangnya
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No. PO</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPOs.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.po_number}</TableCell>
                    <TableCell>{po.supplier?.name}</TableCell>
                    <TableCell>
                      {format(new Date(po.order_date), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleCreateFromPO(po)}
                      >
                        Pilih
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedGR ? "Edit Penerimaan Barang" : "Penerimaan Barang Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedGR
                ? "Ubah data penerimaan barang"
                : "Input penerimaan barang dari supplier"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Header Info */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="supplier_id">
                  Supplier <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch("supplier_id")?.toString() || ""}
                  onValueChange={(value) =>
                    form.setValue("supplier_id", parseInt(value))
                  }
                  disabled={!!form.watch("purchase_order_id")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.supplier_id && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.supplier_id.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt_date">
                  Tanggal Penerimaan <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  {...form.register("receipt_date")}
                />
                {form.formState.errors.receipt_date && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.receipt_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_invoice_number">No. Faktur Supplier</Label>
                <Input
                  {...form.register("supplier_invoice_number")}
                  placeholder="Nomor faktur dari supplier"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier_invoice_date">Tanggal Faktur</Label>
                <Input
                  type="date"
                  {...form.register("supplier_invoice_date")}
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="notes">Catatan</Label>
                <Textarea
                  {...form.register("notes")}
                  placeholder="Catatan tambahan..."
                  rows={2}
                />
              </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Item Penerimaan</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      medicine_id: 0,
                      quantity: 1,
                      unit: "",
                      unit_price: 0,
                      batch_number: "",
                      expiry_date: "",
                      notes: "",
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Item
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => {
                  const expiryDate = form.watch(`items.${index}.expiry_date`);
                  const isExpiringSoon = expiryDate && new Date(expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

                  return (
                    <Card key={field.id} className="p-4">
                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Obat</Label>
                          <Select
                            value={
                              form.watch(`items.${index}.medicine_id`)?.toString() ||
                              ""
                            }
                            onValueChange={(value) => {
                              const med = medicines.find(
                                (m) => m.id === parseInt(value)
                              );
                              form.setValue(
                                `items.${index}.medicine_id`,
                                parseInt(value)
                              );
                              if (med) {
                                form.setValue(`items.${index}.unit`, med.unit);
                                form.setValue(
                                  `items.${index}.unit_price`,
                                  med.purchase_price
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Obat" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicines.map((med) => (
                                <SelectItem key={med.id} value={med.id.toString()}>
                                  {med.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Jumlah</Label>
                          <Input
                            type="number"
                            min="1"
                            {...form.register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Harga Satuan</Label>
                          <Input
                            type="number"
                            min="0"
                            {...form.register(`items.${index}.unit_price`, {
                              valueAsNumber: true,
                            })}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>No. Batch <span className="text-red-500">*</span></Label>
                          <Input
                            {...form.register(`items.${index}.batch_number`)}
                            placeholder="No. Batch"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Kadaluarsa <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Input
                              type="date"
                              {...form.register(`items.${index}.expiry_date`)}
                              className={isExpiringSoon ? "border-yellow-500" : ""}
                            />
                            {isExpiringSoon && (
                              <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </div>

                        {fields.length > 1 && (
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 flex justify-end">
                        <span className="text-sm text-muted-foreground">
                          Subtotal: {formatCurrency(calculateItemTotal(index))}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {form.formState.errors.items && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.items.message}
                </p>
              )}

              {/* Grand Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Grand Total</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(calculateGrandTotal())}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedGR ? "Simpan Perubahan" : "Simpan Draft"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Penerimaan Barang</DialogTitle>
            <DialogDescription>
              {selectedGR?.receipt_number}
            </DialogDescription>
          </DialogHeader>

          {selectedGR && (
            <div className="space-y-6">
              {/* Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedGR.supplier?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {renderStatusBadge(selectedGR.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Penerimaan</p>
                  <p className="font-medium">
                    {format(new Date(selectedGR.receipt_date), "dd MMMM yyyy", {
                      locale: localeId,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. PO</p>
                  <p className="font-medium">
                    {selectedGR.purchase_order?.po_number || "-"}
                  </p>
                </div>
                {selectedGR.supplier_invoice_number && (
                  <div>
                    <p className="text-sm text-muted-foreground">No. Faktur Supplier</p>
                    <p className="font-medium">{selectedGR.supplier_invoice_number}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Diterima Oleh</p>
                  <p className="font-medium">{selectedGR.receiver?.name}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-medium mb-2">Item Penerimaan</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obat</TableHead>
                      <TableHead>No. Batch</TableHead>
                      <TableHead>Kadaluarsa</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedGR.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.medicine?.name}</TableCell>
                        <TableCell>{item.batch_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {format(new Date(item.expiry_date), "dd MMM yyyy", {
                              locale: localeId,
                            })}
                            {item.is_expiring_soon && (
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(selectedGR.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Penerimaan Barang?</AlertDialogTitle>
            <AlertDialogDescription>
              Penerimaan {selectedGR?.receipt_number} akan dihapus permanen. Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Selesaikan Penerimaan Barang?</AlertDialogTitle>
            <AlertDialogDescription>
              Penerimaan {selectedGR?.receipt_number} akan diselesaikan. Stok obat akan
              bertambah sesuai item yang diterima dan batch baru akan dibuat.
              <br /><br />
              <strong>Tindakan ini tidak dapat dibatalkan.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Selesaikan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
