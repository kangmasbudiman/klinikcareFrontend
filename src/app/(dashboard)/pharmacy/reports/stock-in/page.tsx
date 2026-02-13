"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  Filter,
  FileSpreadsheet,
  ArrowUpCircle,
  Loader2,
  Calendar,
  Package,
  TrendingUp,
  Building2,
  Eye,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  pharmacyReportService,
  supplierService,
  medicineService,
  goodsReceiptService,
} from "@/services/pharmacy.service";
import type {
  PharmacyReportFilters,
  GoodsReceipt,
  GoodsReceiptItem,
  GoodsReceiptStats,
  Supplier,
  Medicine,
} from "@/types/pharmacy";
import { GR_STATUS_LABELS, GR_STATUS_COLORS } from "@/types/pharmacy";

// Flattened item for display
interface StockInDisplayItem {
  id: string;
  receipt_id: number;
  receipt_number: string;
  receipt_date: string;
  supplier_name: string;
  supplier_id: number;
  supplier_invoice_number: string | null;
  medicine_id: number;
  medicine_name: string;
  medicine_code: string;
  batch_number: string;
  expiry_date: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
}

export default function StockInReportPage() {
  // State
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [displayItems, setDisplayItems] = useState<StockInDisplayItem[]>([]);
  const [stats, setStats] = useState<GoodsReceiptStats | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState<PharmacyReportFilters>({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    supplier_id: undefined,
    medicine_id: undefined,
    group_by: undefined,
    page: 1,
    per_page: 20,
  });
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<"detail" | "summary">("detail");

  // Detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(
    null,
  );

  // Summary data
  const [summaryBySupplier, setSummaryBySupplier] = useState<
    Array<{
      supplier_id: number;
      supplier_name: string;
      total_quantity: number;
      total_value: number;
      receipt_count: number;
    }>
  >([]);
  const [summaryByMedicine, setSummaryByMedicine] = useState<
    Array<{
      medicine_id: number;
      medicine_name: string;
      medicine_code: string;
      total_quantity: number;
      total_value: number;
      receipt_count: number;
    }>
  >([]);

  // Fetch data
  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await goodsReceiptService.getGoodsReceipts({
        status: "completed",
        start_date: filters.start_date,
        end_date: filters.end_date,
        supplier_id: filters.supplier_id,
        page: currentPage,
        per_page: filters.per_page,
      });

      setReceipts(response.data);
      setTotalPages(response.last_page);
      setTotalItems(response.total);

      // Flatten items for display and filter by medicine if needed
      const items: StockInDisplayItem[] = [];
      response.data.forEach((receipt) => {
        receipt.items?.forEach((item) => {
          // Filter by medicine_id if specified
          if (filters.medicine_id && item.medicine_id !== filters.medicine_id) {
            return;
          }
          items.push({
            id: `${receipt.id}-${item.id}`,
            receipt_id: receipt.id,
            receipt_number: receipt.receipt_number,
            receipt_date: receipt.receipt_date,
            supplier_name: receipt.supplier?.name || "-",
            supplier_id: receipt.supplier_id,
            supplier_invoice_number: receipt.supplier_invoice_number,
            medicine_id: item.medicine_id,
            medicine_name: item.medicine?.name || "-",
            medicine_code: item.medicine?.code || "-",
            batch_number: item.batch_number,
            expiry_date: item.expiry_date,
            quantity: item.quantity,
            unit: item.unit,
            unit_price: item.unit_price,
            total_price: item.total_price,
          });
        });
      });
      setDisplayItems(items);

      // Calculate summaries
      calculateSummaries(response.data);
    } catch (error) {
      console.error("Error fetching goods receipts:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  const calculateSummaries = (data: GoodsReceipt[]) => {
    // Summary by Supplier
    const supplierMap = new Map<
      number,
      {
        supplier_id: number;
        supplier_name: string;
        total_quantity: number;
        total_value: number;
        receipt_count: number;
      }
    >();

    // Summary by Medicine
    const medicineMap = new Map<
      number,
      {
        medicine_id: number;
        medicine_name: string;
        medicine_code: string;
        total_quantity: number;
        total_value: number;
        receipt_count: number;
      }
    >();

    data.forEach((receipt) => {
      // Supplier summary
      if (!supplierMap.has(receipt.supplier_id)) {
        supplierMap.set(receipt.supplier_id, {
          supplier_id: receipt.supplier_id,
          supplier_name: receipt.supplier?.name || "-",
          total_quantity: 0,
          total_value: 0,
          receipt_count: 0,
        });
      }
      const supplierData = supplierMap.get(receipt.supplier_id)!;
      supplierData.receipt_count += 1;
      supplierData.total_value += receipt.total_amount;

      // Medicine summary from items
      receipt.items?.forEach((item) => {
        // Filter by medicine_id if specified
        if (filters.medicine_id && item.medicine_id !== filters.medicine_id) {
          return;
        }

        supplierData.total_quantity += item.quantity;

        if (!medicineMap.has(item.medicine_id)) {
          medicineMap.set(item.medicine_id, {
            medicine_id: item.medicine_id,
            medicine_name: item.medicine?.name || "-",
            medicine_code: item.medicine?.code || "-",
            total_quantity: 0,
            total_value: 0,
            receipt_count: 0,
          });
        }
        const medicineData = medicineMap.get(item.medicine_id)!;
        medicineData.total_quantity += item.quantity;
        medicineData.total_value += item.total_price;
        medicineData.receipt_count += 1;
      });
    });

    setSummaryBySupplier(Array.from(supplierMap.values()));
    setSummaryByMedicine(Array.from(medicineMap.values()));
  };

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await goodsReceiptService.getGoodsReceiptStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setStatsLoading(false);
    }
  }, []);

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

  useEffect(() => {
    fetchSuppliers();
    fetchMedicines();
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  // Handlers
  const handleFilterChange = (key: keyof PharmacyReportFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchReceipts();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
      supplier_id: undefined,
      medicine_id: undefined,
      group_by: undefined,
      page: 1,
      per_page: 20,
    });
    setCurrentPage(1);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const blob = await pharmacyReportService.exportStockInToExcel(filters);
      const filename = `Laporan_Stok_Masuk_${format(new Date(filters.start_date), "ddMMyyyy")}_${format(new Date(filters.end_date), "ddMMyyyy")}.xlsx`;
      pharmacyReportService.downloadFile(blob, filename);
      toast.success("Laporan berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh laporan");
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetail = async (receiptId: number) => {
    try {
      const receipt = await goodsReceiptService.getGoodsReceiptById(receiptId);
      setSelectedReceipt(receipt);
      setDetailModalOpen(true);
    } catch (error) {
      toast.error("Gagal memuat detail");
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate totals
  const totalQuantity = displayItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const totalValue = displayItems.reduce(
    (acc, item) => acc + item.total_price,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Laporan Stok Masuk
          </h1>
          <p className="text-muted-foreground">
            Laporan penerimaan obat berdasarkan tanggal, supplier, dan obat
          </p>
        </div>
        <Button onClick={handleExportExcel} disabled={exporting}>
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Penerimaan Bulan Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(stats?.total_value_this_month || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Total nilai penerimaan
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {stats?.total_today || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Penerimaan hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Item</CardTitle>
            <Package className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-purple-600">
                {displayItems.length}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Item dalam periode</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Qty Masuk
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">
                +{totalQuantity}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Unit diterima</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Filter Laporan</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? "Sembunyikan" : "Tampilkan"}
            </Button>
          </div>
        </CardHeader>
        {showFilters && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Tanggal Mulai</Label>
                <Input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) =>
                    handleFilterChange("start_date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tanggal Akhir</Label>
                <Input
                  type="date"
                  value={filters.end_date}
                  onChange={(e) =>
                    handleFilterChange("end_date", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select
                  value={filters.supplier_id?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "supplier_id",
                      value === "all" ? undefined : parseInt(value),
                    )
                  }
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
              <div className="space-y-2">
                <Label>Obat</Label>
                <Select
                  value={filters.medicine_id?.toString() || "all"}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "medicine_id",
                      value === "all" ? undefined : parseInt(value),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Obat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Obat</SelectItem>
                    {medicines.map((medicine) => (
                      <SelectItem
                        key={medicine.id}
                        value={medicine.id.toString()}
                      >
                        {medicine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilters}>
                <Search className="mr-2 h-4 w-4" />
                Terapkan Filter
              </Button>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Tabs: Detail / Summary */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "detail" | "summary")}
      >
        <TabsList>
          <TabsTrigger value="detail">Detail Transaksi</TabsTrigger>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="mt-4">
          {/* Detail Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Penerimaan</TableHead>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Obat</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Exp. Date</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={11}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : displayItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <ArrowUpCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Tidak ada data penerimaan pada periode ini
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {format(new Date(item.receipt_date), "dd MMM yyyy", {
                            locale: localeId,
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.receipt_number}
                        </TableCell>
                        <TableCell>
                          {item.supplier_invoice_number || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Truck className="h-3 w-3 text-muted-foreground" />
                            {item.supplier_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.medicine_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.medicine_code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{item.batch_number}</TableCell>
                        <TableCell>
                          {format(new Date(item.expiry_date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right text-green-600 font-medium">
                          +{item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total_price)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetail(item.receipt_id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {displayItems.length > 0 && (
                  <TableBody>
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={7} className="text-right">
                        Total:
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        +{totalQuantity}
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalValue)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </CardContent>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {displayItems.length} item dari {totalItems}{" "}
                  penerimaan
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-4">
          {/* Summary View */}
          <div className="space-y-4">
            {/* Summary by Supplier */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Ringkasan Berdasarkan Supplier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">
                        Jumlah Penerimaan
                      </TableHead>
                      <TableHead className="text-right">Total Qty</TableHead>
                      <TableHead className="text-right">Total Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryBySupplier.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-4 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      summaryBySupplier.map((item) => (
                        <TableRow key={item.supplier_id}>
                          <TableCell className="font-medium">
                            {item.supplier_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.receipt_count}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            +{item.total_quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total_value)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Summary by Medicine */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Ringkasan Berdasarkan Obat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Obat</TableHead>
                      <TableHead className="text-right">
                        Jumlah Penerimaan
                      </TableHead>
                      <TableHead className="text-right">Total Qty</TableHead>
                      <TableHead className="text-right">Total Nilai</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryByMedicine.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-muted-foreground"
                        >
                          Tidak ada data
                        </TableCell>
                      </TableRow>
                    ) : (
                      summaryByMedicine.map((item) => (
                        <TableRow key={item.medicine_id}>
                          <TableCell className="text-muted-foreground">
                            {item.medicine_code}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.medicine_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.receipt_count}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            +{item.total_quantity}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.total_value)}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Total Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Total Keseluruhan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Qty Masuk
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      +{totalQuantity}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Nilai</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Jumlah Supplier
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {summaryBySupplier.length}
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <p className="text-sm text-muted-foreground">Jenis Obat</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {summaryByMedicine.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Penerimaan Barang</DialogTitle>
            <DialogDescription>
              {selectedReceipt?.receipt_number}
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    No. Penerimaan
                  </p>
                  <p className="font-medium">
                    {selectedReceipt.receipt_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedReceipt.receipt_date),
                      "dd MMMM yyyy",
                      {
                        locale: localeId,
                      },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className={GR_STATUS_COLORS[selectedReceipt.status]}>
                    {GR_STATUS_LABELS[selectedReceipt.status]}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">
                    {selectedReceipt.supplier?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    No. Faktur Supplier
                  </p>
                  <p className="font-medium">
                    {selectedReceipt.supplier_invoice_number || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diterima Oleh</p>
                  <p className="font-medium">
                    {selectedReceipt.receiver?.name || "-"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Item Penerimaan</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obat</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Exp. Date</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReceipt.items?.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.medicine?.name}</TableCell>
                        <TableCell>{item.batch_number}</TableCell>
                        <TableCell>
                          {format(new Date(item.expiry_date), "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unit_price)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total_price)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-medium">
                      <TableCell colSpan={5} className="text-right">
                        Total:
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(selectedReceipt.total_amount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {selectedReceipt.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Catatan</p>
                  <p className="font-medium">{selectedReceipt.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
