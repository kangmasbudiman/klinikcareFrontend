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
  Send,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Package,
  FileText,
  Loader2,
  X,
  Calendar,
  Building2,
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
  purchaseOrderService,
  supplierService,
  medicineService,
} from "@/services/pharmacy.service";
import type {
  PurchaseOrder,
  PurchaseOrderPayload,
  PurchaseOrderFilters,
  PurchaseOrderStats,
  PurchaseOrderStatus,
  Supplier,
  Medicine,
} from "@/types/pharmacy";
import { PO_STATUS_COLORS, PO_STATUS_LABELS } from "@/types/pharmacy";

// Validation schema
const poItemSchema = z.object({
  medicine_id: z.number().min(1, "Pilih obat"),
  quantity: z.number().min(1, "Jumlah minimal 1"),
  unit: z.string().min(1, "Unit harus diisi"),
  unit_price: z.number().min(0, "Harga tidak boleh negatif"),
  discount_percent: z.number().min(0).max(100).optional(),
  tax_percent: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

const poSchema = z.object({
  supplier_id: z.number().min(1, "Pilih supplier"),
  order_date: z.string().min(1, "Tanggal order harus diisi"),
  expected_delivery_date: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, "Minimal 1 item"),
});

type POFormData = z.infer<typeof poSchema>;

export default function PurchaseOrdersPage() {
  // State
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stats, setStats] = useState<PurchaseOrderStats | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<PurchaseOrderFilters>({
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
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  // Form
  const form = useForm<POFormData>({
    resolver: zodResolver(poSchema),
    defaultValues: {
      supplier_id: 0,
      order_date: format(new Date(), "yyyy-MM-dd"),
      expected_delivery_date: "",
      notes: "",
      items: [
        {
          medicine_id: 0,
          quantity: 1,
          unit: "",
          unit_price: 0,
          discount_percent: 0,
          tax_percent: 0,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Fetch data
  const fetchPurchaseOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await purchaseOrderService.getPurchaseOrders({
        ...filters,
        page: currentPage,
      });
      setPurchaseOrders(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
      toast.error("Gagal memuat data purchase order");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await purchaseOrderService.getPurchaseOrderStats();
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
      // Gunakan getMedicines dengan filter active untuk mendapatkan purchase_price
      const response = await medicineService.getMedicines({
        status: "active",
        per_page: 1000,
      });
      console.log("Medicines data:", response.data);
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
    fetchStats();
    fetchSuppliers();
    fetchMedicines();
  }, [fetchPurchaseOrders]);

  // Handlers
  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value as PurchaseOrderStatus | "all",
    }));
    setCurrentPage(1);
  };

  const handleSupplierFilter = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      supplier_id: value && value !== "all" ? parseInt(value) : undefined,
    }));
    setCurrentPage(1);
  };

  const handleOpenModal = async (po?: PurchaseOrder) => {
    if (po) {
      try {
        // Fetch detail PO untuk mendapatkan items dengan harga
        const detail = await purchaseOrderService.getPurchaseOrderById(po.id);
        setSelectedPO(detail);
        form.reset({
          supplier_id: detail.supplier_id,
          order_date: detail.order_date,
          expected_delivery_date: detail.expected_delivery_date || "",
          notes: detail.notes || "",
          items:
            detail.items?.map((item) => ({
              medicine_id: item.medicine_id,
              quantity: item.quantity,
              unit: item.unit,
              unit_price: item.unit_price,
              discount_percent: item.discount_percent,
              tax_percent: item.tax_percent,
              notes: item.notes || "",
            })) || [],
        });
        setModalOpen(true);
      } catch (error) {
        toast.error("Gagal memuat detail PO");
      }
    } else {
      setSelectedPO(null);
      form.reset({
        supplier_id: 0,
        order_date: format(new Date(), "yyyy-MM-dd"),
        expected_delivery_date: "",
        notes: "",
        items: [
          {
            medicine_id: 0,
            quantity: 1,
            unit: "",
            unit_price: 0,
            discount_percent: 0,
            tax_percent: 0,
            notes: "",
          },
        ],
      });
      setModalOpen(true);
    }
  };

  const handleViewDetail = async (po: PurchaseOrder) => {
    try {
      const detail = await purchaseOrderService.getPurchaseOrderById(po.id);
      setSelectedPO(detail);
      setDetailModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat detail PO");
    }
  };

  const handleSubmit = async (data: POFormData) => {
    setIsSubmitting(true);
    try {
      const payload: PurchaseOrderPayload = {
        supplier_id: data.supplier_id,
        order_date: data.order_date,
        expected_delivery_date: data.expected_delivery_date || undefined,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          medicine_id: item.medicine_id,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          discount_percent: item.discount_percent,
          tax_percent: item.tax_percent,
          notes: item.notes,
        })),
      };

      if (selectedPO) {
        await purchaseOrderService.updatePurchaseOrder(selectedPO.id, payload);
        toast.success("Purchase order berhasil diupdate");
      } else {
        await purchaseOrderService.createPurchaseOrder(payload);
        toast.success("Purchase order berhasil dibuat");
      }

      setModalOpen(false);
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Gagal menyimpan purchase order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPO) return;
    setIsSubmitting(true);
    try {
      await purchaseOrderService.deletePurchaseOrder(selectedPO.id);
      toast.success("Purchase order berhasil dihapus");
      setDeleteDialogOpen(false);
      setSelectedPO(null);
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus purchase order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForApproval = async (po: PurchaseOrder) => {
    try {
      await purchaseOrderService.submitForApproval(po.id);
      toast.success("PO berhasil diajukan untuk persetujuan");
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal mengajukan PO");
    }
  };

  const handleApprove = async () => {
    if (!selectedPO) return;
    setIsSubmitting(true);
    try {
      await purchaseOrderService.approve(
        selectedPO.id,
        approvalNotes || undefined,
      );
      toast.success("PO berhasil disetujui");
      setApproveDialogOpen(false);
      setSelectedPO(null);
      setApprovalNotes("");
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menyetujui PO");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPO || !rejectReason) return;
    setIsSubmitting(true);
    try {
      await purchaseOrderService.reject(selectedPO.id, rejectReason);
      toast.success("PO berhasil ditolak");
      setRejectDialogOpen(false);
      setSelectedPO(null);
      setRejectReason("");
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal menolak PO");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsOrdered = async (po: PurchaseOrder) => {
    try {
      await purchaseOrderService.markAsOrdered(po.id);
      toast.success("Status PO berhasil diubah menjadi dipesan");
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal mengubah status PO");
    }
  };

  const handleCancel = async (po: PurchaseOrder) => {
    try {
      await purchaseOrderService.cancel(po.id);
      toast.success("PO berhasil dibatalkan");
      fetchPurchaseOrders();
      fetchStats();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal membatalkan PO");
    }
  };

  // Calculate item total
  const calculateItemTotal = (index: number) => {
    const item = form.watch(`items.${index}`);
    if (!item) return 0;
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const discountPercent = Number(item.discount_percent) || 0;
    const taxPercent = Number(item.tax_percent) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (taxPercent / 100);
    return afterDiscount + taxAmount;
  };

  // Calculate grand total
  const calculateGrandTotal = () => {
    const items = form.watch("items");
    if (!items || items.length === 0) return 0;
    return items.reduce(
      (total, _, index) => total + calculateItemTotal(index),
      0,
    );
  };

  // Format currency
  const formatCurrency = (value: number) => {
    const safeValue = Number(value) || 0;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(safeValue);
  };

  // Render status badge
  const renderStatusBadge = (status: PurchaseOrderStatus) => {
    return (
      <Badge className={PO_STATUS_COLORS[status]}>
        {PO_STATUS_LABELS[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Purchase Order</h1>
          <p className="text-muted-foreground">
            Kelola pesanan pembelian obat ke supplier
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Buat PO Baru
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PO</CardTitle>
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
            <CardTitle className="text-sm font-medium">
              Menunggu Approval
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.pending_approval || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perlu Diterima
            </CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {(stats?.ordered || 0) + (stats?.partial_received || 0)}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Nilai Bulan Ini
            </CardTitle>
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
                  placeholder="Cari no. PO..."
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
                  value={filters.status || "all"}
                  onValueChange={handleStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending_approval">
                      Menunggu Approval
                    </SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                    <SelectItem value="ordered">Dipesan</SelectItem>
                    <SelectItem value="partial_received">
                      Diterima Sebagian
                    </SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Supplier</Label>
                <Select
                  value={filters.supplier_id?.toString() || "all"}
                  onValueChange={handleSupplierFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Supplier</SelectItem>
                    {suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.id.toString()}
                      >
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      search: "",
                      status: "all",
                      supplier_id: undefined,
                      page: 1,
                      per_page: 10,
                    });
                    setCurrentPage(1);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Reset Filter
                </Button>
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
                <TableHead>No. PO</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dibuat Oleh</TableHead>
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
              ) : purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Belum ada purchase order
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">
                      {po.po_number}
                    </TableCell>
                    <TableCell>
                      {format(new Date(po.order_date), "dd MMM yyyy", {
                        locale: localeId,
                      })}
                    </TableCell>
                    <TableCell>{po.supplier?.name || "-"}</TableCell>
                    <TableCell>{formatCurrency(po.total_amount)}</TableCell>
                    <TableCell>{renderStatusBadge(po.status)}</TableCell>
                    <TableCell>{po.creator?.name || "-"}</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => handleViewDetail(po)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          {po.status === "draft" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleOpenModal(po)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSubmitForApproval(po)}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Ajukan Approval
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedPO(po);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                          {po.status === "pending_approval" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPO(po);
                                  setApproveDialogOpen(true);
                                }}
                              >
                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPO(po);
                                  setRejectDialogOpen(true);
                                }}
                              >
                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                Tolak
                              </DropdownMenuItem>
                            </>
                          )}
                          {po.status === "approved" && (
                            <DropdownMenuItem
                              onClick={() => handleMarkAsOrdered(po)}
                            >
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Tandai Sudah Dipesan
                            </DropdownMenuItem>
                          )}
                          {["draft", "pending_approval", "approved"].includes(
                            po.status,
                          ) && (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleCancel(po)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Batalkan
                            </DropdownMenuItem>
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
              Menampilkan {purchaseOrders.length} dari {totalItems} data
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPO ? "Edit Purchase Order" : "Buat Purchase Order Baru"}
            </DialogTitle>
            <DialogDescription>
              {selectedPO
                ? "Ubah data purchase order"
                : "Buat pesanan pembelian obat ke supplier"}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
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
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem
                        key={supplier.id}
                        value={supplier.id.toString()}
                      >
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
                <Label htmlFor="order_date">
                  Tanggal Order <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...form.register("order_date")} />
                {form.formState.errors.order_date && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.order_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_delivery_date">
                  Estimasi Pengiriman
                </Label>
                <Input
                  type="date"
                  {...form.register("expected_delivery_date")}
                />
              </div>

              <div className="space-y-2">
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
                <Label>Item Pesanan</Label>
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
                      discount_percent: 0,
                      tax_percent: 0,
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
                  const selectedMedicine = medicines.find(
                    (m) => m.id === form.watch(`items.${index}.medicine_id`),
                  );
                  return (
                    <Card key={field.id} className="p-4">
                      <div className="grid gap-4 md:grid-cols-6">
                        <div className="md:col-span-2 space-y-2">
                          <Label>Obat</Label>
                          <Select
                            value={
                              form
                                .watch(`items.${index}.medicine_id`)
                                ?.toString() || ""
                            }
                            onValueChange={(value) => {
                              const med = medicines.find(
                                (m) => m.id === parseInt(value),
                              );
                              console.log("Selected medicine:", med);
                              console.log(
                                "Purchase price:",
                                med?.purchase_price,
                              );
                              form.setValue(
                                `items.${index}.medicine_id`,
                                parseInt(value),
                              );
                              if (med) {
                                form.setValue(
                                  `items.${index}.unit`,
                                  med.unit || "",
                                );
                                form.setValue(
                                  `items.${index}.unit_price`,
                                  Number(med.purchase_price) || 0,
                                );
                              }
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih Obat" />
                            </SelectTrigger>
                            <SelectContent>
                              {medicines.map((med) => (
                                <SelectItem
                                  key={med.id}
                                  value={med.id.toString()}
                                >
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
                          <Label>Unit</Label>
                          <Input
                            {...form.register(`items.${index}.unit`)}
                            placeholder="Unit"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Harga Satuan</Label>
                          <Input
                            type="number"
                            min="0"
                            value={form.watch(`items.${index}.unit_price`) || 0}
                            onChange={(e) => {
                              form.setValue(
                                `items.${index}.unit_price`,
                                Number(e.target.value) || 0,
                              );
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Total</Label>
                          <div className="h-10 px-3 py-2 border rounded-md bg-muted text-sm">
                            {formatCurrency(calculateItemTotal(index))}
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
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {selectedPO ? "Simpan Perubahan" : "Buat PO"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Purchase Order</DialogTitle>
            <DialogDescription>{selectedPO?.po_number}</DialogDescription>
          </DialogHeader>

          {selectedPO && (
            <div className="space-y-6">
              {/* Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{selectedPO.supplier?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {renderStatusBadge(selectedPO.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Order</p>
                  <p className="font-medium">
                    {format(new Date(selectedPO.order_date), "dd MMMM yyyy", {
                      locale: localeId,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dibuat Oleh</p>
                  <p className="font-medium">{selectedPO.creator?.name}</p>
                </div>
                {selectedPO.approved_by && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Disetujui Oleh
                    </p>
                    <p className="font-medium">{selectedPO.approver?.name}</p>
                  </div>
                )}
                {selectedPO.rejection_reason && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Alasan Penolakan
                    </p>
                    <p className="font-medium text-red-600">
                      {selectedPO.rejection_reason}
                    </p>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <p className="font-medium mb-2">Item Pesanan</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obat</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-right">Diterima</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedPO.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.medicine?.name}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.received_quantity} / {item.quantity}
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
                    {formatCurrency(selectedPO.total_amount)}
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
            <AlertDialogTitle>Hapus Purchase Order?</AlertDialogTitle>
            <AlertDialogDescription>
              PO {selectedPO?.po_number} akan dihapus permanen. Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Setujui Purchase Order?</AlertDialogTitle>
            <AlertDialogDescription>
              PO {selectedPO?.po_number} dengan total{" "}
              {formatCurrency(selectedPO?.total_amount || 0)} akan disetujui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="approval_notes">Catatan (Opsional)</Label>
            <Textarea
              id="approval_notes"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Catatan persetujuan..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              className="bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Setujui
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tolak Purchase Order?</AlertDialogTitle>
            <AlertDialogDescription>
              PO {selectedPO?.po_number} akan ditolak. Mohon berikan alasan
              penolakan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject_reason">
              Alasan Penolakan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject_reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Alasan penolakan..."
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting || !rejectReason}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Tolak
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
