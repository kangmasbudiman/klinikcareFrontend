"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  parseISO,
  eachDayOfInterval,
} from "date-fns";
import * as XLSX from "xlsx";
import { id as localeId } from "date-fns/locale";
import {
  Search,
  Filter,
  FileSpreadsheet,
  Loader2,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Receipt,
  Percent,
  Eye,
  ChevronDown,
  ChevronUp,
  Printer,
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
  supplierService,
  goodsReceiptService,
} from "@/services/pharmacy.service";
import { useClinicSettings } from "@/providers/clinic-settings-provider";
import type {
  GoodsReceipt,
  GoodsReceiptItem,
  Supplier,
} from "@/types/pharmacy";
import { GR_STATUS_LABELS, GR_STATUS_COLORS } from "@/types/pharmacy";

// Interface untuk data harian
interface DailyReceiptData {
  date: string;
  receipt_count: number;
  item_count: number;
  total_qty: number;
  total_purchase_value: number; // Nilai beli (HPP)
  total_selling_value: number; // Nilai jual
  potential_profit: number; // Potensi laba
  profit_margin: number; // Margin laba (%)
  receipts: GoodsReceipt[];
}

// Interface untuk ringkasan
// Interface untuk detail obat per supplier
interface SupplierMedicineDetail {
  medicine_id: number;
  medicine_name: string;
  medicine_code: string;
  total_qty: number;
  unit: string;
  total_purchase_value: number;
  total_selling_value: number;
  potential_profit: number;
  profit_margin: number;
}

interface SupplierSummary {
  supplier_id: number;
  supplier_name: string;
  receipt_count: number;
  total_purchase_value: number;
  total_selling_value: number;
  potential_profit: number;
  medicines: SupplierMedicineDetail[];
}

interface ReceiptSummary {
  total_receipts: number;
  total_items: number;
  total_qty: number;
  total_purchase_value: number;
  total_selling_value: number;
  potential_profit: number;
  avg_profit_margin: number;
  avg_receipts_per_day: number;
  by_supplier: SupplierSummary[];
}

export default function ReceiptsReportPage() {
  // Clinic settings for logo and name
  const { settings: clinicSettings } = useClinicSettings();

  // State
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([]);
  const [dailyData, setDailyData] = useState<DailyReceiptData[]>([]);
  const [summary, setSummary] = useState<ReceiptSummary | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
    end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
    supplier_id: undefined as number | undefined,
    view_mode: "daily" as "daily" | "detail",
  });
  const [showFilters, setShowFilters] = useState(true);
  const [activeTab, setActiveTab] = useState<"summary" | "daily" | "detail">(
    "summary",
  );

  // Expanded rows for daily view
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

  // Detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(
    null,
  );

  // Supplier detail modal
  const [supplierDetailModalOpen, setSupplierDetailModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierSummary | null>(null);

  // Fetch all receipts for the period
  const fetchAllReceipts = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all completed receipts in date range
      const response = await goodsReceiptService.getGoodsReceipts({
        status: "completed",
        start_date: filters.start_date,
        end_date: filters.end_date,
        supplier_id: filters.supplier_id,
        page: 1,
        per_page: 1000, // Get all data for calculations
      });

      setReceipts(response.data);
      setTotalItems(response.total);

      // Process data
      processReceiptData(response.data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  }, [filters.start_date, filters.end_date, filters.supplier_id]);

  // Process receipt data into daily summaries and overall summary
  const processReceiptData = (data: GoodsReceipt[]) => {
    // Group by date
    const dateMap = new Map<string, DailyReceiptData>();

    // Initialize all dates in range
    const startDate = parseISO(filters.start_date);
    const endDate = parseISO(filters.end_date);
    const allDates = eachDayOfInterval({ start: startDate, end: endDate });

    allDates.forEach((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      dateMap.set(dateStr, {
        date: dateStr,
        receipt_count: 0,
        item_count: 0,
        total_qty: 0,
        total_purchase_value: 0,
        total_selling_value: 0,
        potential_profit: 0,
        profit_margin: 0,
        receipts: [],
      });
    });

    // Summary totals
    let totalReceipts = 0;
    let totalItems = 0;
    let totalQty = 0;
    let totalPurchaseValue = 0;
    let totalSellingValue = 0;

    // Supplier summary map with medicine details
    const supplierMap = new Map<number, SupplierSummary>();

    // Medicine map per supplier
    const supplierMedicineMap = new Map<string, SupplierMedicineDetail>();

    // Process each receipt
    data.forEach((receipt) => {
      const dateStr = receipt.receipt_date.split("T")[0];
      const dayData = dateMap.get(dateStr);

      if (dayData) {
        dayData.receipt_count += 1;
        dayData.receipts.push(receipt);

        // Safely parse total_amount as number
        const receiptTotalAmount = Number(receipt.total_amount) || 0;
        dayData.total_purchase_value += receiptTotalAmount;

        // Calculate selling value from items
        let receiptSellingValue = 0;
        receipt.items?.forEach((item) => {
          dayData.item_count += 1;
          const itemQty = Number(item.quantity) || 0;
          dayData.total_qty += itemQty;

          // Selling value = quantity * medicine selling price
          const sellingPrice = Number(item.medicine?.selling_price) || 0;
          receiptSellingValue += itemQty * sellingPrice;
        });
        dayData.total_selling_value += receiptSellingValue;

        // Update totals
        totalReceipts += 1;
        totalItems += receipt.items?.length || 0;
        totalQty +=
          receipt.items?.reduce(
            (sum, item) => sum + (Number(item.quantity) || 0),
            0,
          ) || 0;
        totalPurchaseValue += receiptTotalAmount;
        totalSellingValue += receiptSellingValue;

        // Update supplier summary
        if (!supplierMap.has(receipt.supplier_id)) {
          supplierMap.set(receipt.supplier_id, {
            supplier_id: receipt.supplier_id,
            supplier_name: receipt.supplier?.name || "-",
            receipt_count: 0,
            total_purchase_value: 0,
            total_selling_value: 0,
            potential_profit: 0,
            medicines: [],
          });
        }
        const supplierData = supplierMap.get(receipt.supplier_id)!;
        supplierData.receipt_count += 1;
        supplierData.total_purchase_value += receiptTotalAmount;
        supplierData.total_selling_value += receiptSellingValue;
        supplierData.potential_profit =
          supplierData.total_selling_value - supplierData.total_purchase_value;

        // Update medicine details per supplier
        receipt.items?.forEach((item) => {
          const key = `${receipt.supplier_id}-${item.medicine_id}`;
          const itemQty = Number(item.quantity) || 0;
          const itemPrice = Number(item.unit_price) || 0;
          const sellingPrice = Number(item.medicine?.selling_price) || 0;
          const itemTotalPurchase = itemQty * itemPrice;
          const itemTotalSelling = itemQty * sellingPrice;

          if (!supplierMedicineMap.has(key)) {
            supplierMedicineMap.set(key, {
              medicine_id: item.medicine_id,
              medicine_name: item.medicine?.name || "-",
              medicine_code: item.medicine?.code || "-",
              total_qty: 0,
              unit: item.unit,
              total_purchase_value: 0,
              total_selling_value: 0,
              potential_profit: 0,
              profit_margin: 0,
            });
          }
          const medicineData = supplierMedicineMap.get(key)!;
          medicineData.total_qty += itemQty;
          medicineData.total_purchase_value += itemTotalPurchase;
          medicineData.total_selling_value += itemTotalSelling;
          medicineData.potential_profit =
            medicineData.total_selling_value -
            medicineData.total_purchase_value;
          medicineData.profit_margin =
            medicineData.total_purchase_value > 0
              ? (medicineData.potential_profit /
                  medicineData.total_purchase_value) *
                100
              : 0;
        });
      }
    });

    // Attach medicines to suppliers
    supplierMedicineMap.forEach((medicine, key) => {
      const supplierId = parseInt(key.split("-")[0]);
      const supplierData = supplierMap.get(supplierId);
      if (supplierData) {
        supplierData.medicines.push(medicine);
      }
    });

    // Sort medicines by total_purchase_value descending
    supplierMap.forEach((supplier) => {
      supplier.medicines.sort(
        (a, b) => b.total_purchase_value - a.total_purchase_value,
      );
    });

    // Calculate profit and margin for each day
    dateMap.forEach((dayData) => {
      dayData.potential_profit =
        dayData.total_selling_value - dayData.total_purchase_value;
      dayData.profit_margin =
        dayData.total_purchase_value > 0
          ? (dayData.potential_profit / dayData.total_purchase_value) * 100
          : 0;
    });

    // Convert to array and sort by date descending
    const dailyArray = Array.from(dateMap.values())
      .filter((d) => d.receipt_count > 0) // Only show days with receipts
      .sort((a, b) => b.date.localeCompare(a.date));

    setDailyData(dailyArray);

    // Calculate overall summary
    const potentialProfit = totalSellingValue - totalPurchaseValue;
    const avgProfitMargin =
      totalPurchaseValue > 0 ? (potentialProfit / totalPurchaseValue) * 100 : 0;
    const daysWithReceipts = dailyArray.length;
    const avgReceiptsPerDay =
      daysWithReceipts > 0 ? totalReceipts / daysWithReceipts : 0;

    setSummary({
      total_receipts: totalReceipts,
      total_items: totalItems,
      total_qty: totalQty,
      total_purchase_value: totalPurchaseValue,
      total_selling_value: totalSellingValue,
      potential_profit: potentialProfit,
      avg_profit_margin: avgProfitMargin,
      avg_receipts_per_day: avgReceiptsPerDay,
      by_supplier: Array.from(supplierMap.values()).sort(
        (a, b) => b.total_purchase_value - a.total_purchase_value,
      ),
    });
  };

  const fetchSuppliers = async () => {
    try {
      const response = await supplierService.getActiveSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    fetchAllReceipts();
  }, [fetchAllReceipts]);

  // Handlers
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchAllReceipts();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: format(startOfMonth(new Date()), "yyyy-MM-dd"),
      end_date: format(endOfMonth(new Date()), "yyyy-MM-dd"),
      supplier_id: undefined,
      view_mode: "daily",
    });
  };

  const toggleDateExpand = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
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

  const handleViewSupplierDetail = (supplier: SupplierSummary) => {
    setSelectedSupplier(supplier);
    setSupplierDetailModalOpen(true);
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (receipts.length === 0) {
      toast.error("Tidak ada data untuk di-export");
      return;
    }

    setExporting(true);

    try {
      const workbook = XLSX.utils.book_new();

      // Sheet 1: Ringkasan
      const summaryData = [
        ["LAPORAN PENERIMAAN BARANG"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        ["RINGKASAN"],
        ["Total Penerimaan", summary?.total_receipts || 0],
        ["Total Item", summary?.total_items || 0],
        ["Total Quantity", summary?.total_qty || 0],
        ["Total Pembelian (HPP)", summary?.total_purchase_value || 0],
        ["Potensi Penjualan", summary?.total_selling_value || 0],
        ["Potensi Laba", summary?.potential_profit || 0],
        ["Rata-rata Margin (%)", summary?.avg_profit_margin?.toFixed(2) || 0],
        [],
        ["RINGKASAN PER SUPPLIER"],
        [
          "Supplier",
          "Jumlah Penerimaan",
          "Jenis Obat",
          "Nilai Beli (HPP)",
          "Nilai Jual",
          "Potensi Laba",
          "Margin (%)",
        ],
        ...(summary?.by_supplier.map((s) => [
          s.supplier_name,
          s.receipt_count,
          s.medicines.length,
          s.total_purchase_value,
          s.total_selling_value,
          s.potential_profit,
          s.total_purchase_value > 0
            ? ((s.potential_profit / s.total_purchase_value) * 100).toFixed(2)
            : "0",
        ]) || []),
      ];

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan");

      // Sheet 2: Data Per Hari
      const dailySheetData = [
        ["LAPORAN PENERIMAAN PER HARI"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        [
          "Tanggal",
          "Jumlah Penerimaan",
          "Jumlah Item",
          "Total Qty",
          "Nilai Beli (HPP)",
          "Nilai Jual",
          "Potensi Laba",
          "Margin (%)",
        ],
        ...dailyData.map((day) => [
          format(parseISO(day.date), "dd MMMM yyyy", { locale: localeId }),
          day.receipt_count,
          day.item_count,
          day.total_qty,
          day.total_purchase_value,
          day.total_selling_value,
          day.potential_profit,
          day.profit_margin.toFixed(2),
        ]),
      ];

      const dailySheet = XLSX.utils.aoa_to_sheet(dailySheetData);
      XLSX.utils.book_append_sheet(workbook, dailySheet, "Per Hari");

      // Sheet 3: Detail Penerimaan
      const detailSheetData = [
        ["DETAIL PENERIMAAN BARANG"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        [
          "Tanggal",
          "No. Penerimaan",
          "No. Faktur Supplier",
          "Supplier",
          "Jumlah Item",
          "Nilai Beli (HPP)",
          "Nilai Jual",
          "Potensi Laba",
        ],
        ...receipts.map((receipt) => {
          const sellingValue =
            receipt.items?.reduce((sum, item) => {
              return sum + item.quantity * (item.medicine?.selling_price || 0);
            }, 0) || 0;
          const profit = sellingValue - Number(receipt.total_amount);

          return [
            format(new Date(receipt.receipt_date), "dd MMMM yyyy", {
              locale: localeId,
            }),
            receipt.receipt_number,
            receipt.supplier_invoice_number || "-",
            receipt.supplier?.name || "-",
            receipt.items?.length || 0,
            Number(receipt.total_amount) || 0,
            sellingValue,
            profit,
          ];
        }),
      ];

      const detailSheet = XLSX.utils.aoa_to_sheet(detailSheetData);
      XLSX.utils.book_append_sheet(workbook, detailSheet, "Detail Penerimaan");

      // Sheet 4: Detail Item per Penerimaan
      const itemsSheetData: (string | number)[][] = [
        ["DETAIL ITEM PENERIMAAN"],
        [
          `Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}`,
        ],
        [],
        [
          "No. Penerimaan",
          "Tanggal",
          "Supplier",
          "Kode Obat",
          "Nama Obat",
          "Batch",
          "Exp Date",
          "Qty",
          "Satuan",
          "Harga Beli",
          "Harga Jual",
          "Total Beli",
          "Potensi Jual",
          "Laba",
        ],
      ];

      receipts.forEach((receipt) => {
        receipt.items?.forEach((item) => {
          const sellingPrice = item.medicine?.selling_price || 0;
          const totalSelling = item.quantity * sellingPrice;
          const profit = totalSelling - item.total_price;

          itemsSheetData.push([
            receipt.receipt_number,
            format(new Date(receipt.receipt_date), "dd/MM/yyyy"),
            receipt.supplier?.name || "-",
            item.medicine?.code || "-",
            item.medicine?.name || "-",
            item.batch_number,
            format(new Date(item.expiry_date), "dd/MM/yyyy"),
            item.quantity,
            item.unit,
            item.unit_price,
            sellingPrice,
            item.total_price,
            totalSelling,
            profit,
          ]);
        });
      });

      const itemsSheet = XLSX.utils.aoa_to_sheet(itemsSheetData);
      XLSX.utils.book_append_sheet(workbook, itemsSheet, "Detail Item");

      // Generate filename
      const fileName = `Laporan_Penerimaan_${format(parseISO(filters.start_date), "yyyyMMdd")}_${format(parseISO(filters.end_date), "yyyyMMdd")}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      toast.success("Export Excel berhasil!");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Gagal export Excel");
    } finally {
      setExporting(false);
    }
  };

  // Print function
  const handlePrint = () => {
    if (receipts.length === 0) {
      toast.error("Tidak ada data untuk dicetak");
      return;
    }

    setPrinting(true);

    try {
      const clinicName = clinicSettings?.name || "Klinik App";
      const clinicAddress = clinicSettings?.address || "";
      const clinicPhone = clinicSettings?.phone || "";
      const clinicLogo = clinicSettings?.logo_url || "";

      const printWindow = window.open("", "_blank");
      if (!printWindow) {
        toast.error("Popup diblokir. Izinkan popup untuk mencetak.");
        setPrinting(false);
        return;
      }

      const formatCurrencyPrint = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      };

      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Penerimaan - ${clinicName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #333;
              padding: 15px;
            }
            .header {
              display: flex;
              align-items: center;
              gap: 15px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .logo {
              width: 70px;
              height: 70px;
              object-fit: contain;
            }
            .logo-placeholder {
              width: 70px;
              height: 70px;
              background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
              font-weight: bold;
            }
            .clinic-info {
              flex: 1;
            }
            .clinic-name {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .clinic-address {
              font-size: 11px;
              color: #666;
            }
            .report-title {
              text-align: center;
              margin-bottom: 20px;
            }
            .report-title h1 {
              font-size: 16px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .report-title p {
              font-size: 11px;
              color: #666;
            }
            .summary-cards {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 10px;
              margin-bottom: 20px;
            }
            .summary-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 12px;
              text-align: center;
            }
            .summary-card .label {
              font-size: 10px;
              color: #666;
              margin-bottom: 5px;
            }
            .summary-card .value {
              font-size: 14px;
              font-weight: bold;
            }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.red { color: #dc2626; }
            .summary-card .value.green { color: #16a34a; }
            .summary-card .value.purple { color: #9333ea; }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 13px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 6px 8px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: 600;
              color: #374151;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .text-right {
              text-align: right;
            }
            .text-center {
              text-align: center;
            }
            .text-red { color: #dc2626; }
            .text-green { color: #16a34a; }
            .text-blue { color: #2563eb; }
            .font-bold { font-weight: bold; }
            .footer {
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              font-size: 10px;
              color: #666;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${
              clinicLogo
                ? `<img src="${clinicLogo}" alt="${clinicName}" class="logo" />`
                : `<div class="logo-placeholder">+</div>`
            }
            <div class="clinic-info">
              <div class="clinic-name">${clinicName}</div>
              <div class="clinic-address">
                ${clinicAddress ? clinicAddress + "<br/>" : ""}
                ${clinicPhone ? "Telp: " + clinicPhone : ""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN PENERIMAAN BARANG</h1>
            <p>Periode: ${format(parseISO(filters.start_date), "dd MMMM yyyy", { locale: localeId })} - ${format(parseISO(filters.end_date), "dd MMMM yyyy", { locale: localeId })}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Penerimaan</div>
              <div class="value blue">${summary?.total_receipts || 0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pembelian (HPP)</div>
              <div class="value red">${formatCurrencyPrint(summary?.total_purchase_value || 0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Penjualan</div>
              <div class="value green">${formatCurrencyPrint(summary?.total_selling_value || 0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Laba (${(summary?.avg_profit_margin || 0).toFixed(1)}%)</div>
              <div class="value purple">${formatCurrencyPrint(summary?.potential_profit || 0)}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ringkasan Per Supplier</div>
            <table>
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th class="text-center">Penerimaan</th>
                  <th class="text-center">Jenis Obat</th>
                  <th class="text-right">Nilai Beli (HPP)</th>
                  <th class="text-right">Nilai Jual</th>
                  <th class="text-right">Potensi Laba</th>
                  <th class="text-center">Margin</th>
                </tr>
              </thead>
              <tbody>
                ${
                  summary?.by_supplier
                    .map((s) => {
                      const margin =
                        s.total_purchase_value > 0
                          ? (
                              (s.potential_profit / s.total_purchase_value) *
                              100
                            ).toFixed(1)
                          : "0";
                      return `
                        <tr>
                          <td>${s.supplier_name}</td>
                          <td class="text-center">${s.receipt_count}</td>
                          <td class="text-center">${s.medicines.length}</td>
                          <td class="text-right text-red">${formatCurrencyPrint(s.total_purchase_value)}</td>
                          <td class="text-right text-green">${formatCurrencyPrint(s.total_selling_value)}</td>
                          <td class="text-right text-blue font-bold">${formatCurrencyPrint(s.potential_profit)}</td>
                          <td class="text-center">${margin}%</td>
                        </tr>
                      `;
                    })
                    .join("") ||
                  '<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Detail Penerimaan</div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Penerimaan</th>
                  <th>No. Faktur</th>
                  <th>Supplier</th>
                  <th class="text-center">Item</th>
                  <th class="text-right">Nilai Beli</th>
                  <th class="text-right">Nilai Jual</th>
                  <th class="text-right">Laba</th>
                </tr>
              </thead>
              <tbody>
                ${
                  receipts
                    .map((receipt) => {
                      const sellingValue =
                        receipt.items?.reduce((sum, item) => {
                          return (
                            sum +
                            item.quantity * (item.medicine?.selling_price || 0)
                          );
                        }, 0) || 0;
                      const profit =
                        sellingValue - Number(receipt.total_amount);
                      return `
                        <tr>
                          <td>${format(new Date(receipt.receipt_date), "dd/MM/yyyy")}</td>
                          <td>${receipt.receipt_number}</td>
                          <td>${receipt.supplier_invoice_number || "-"}</td>
                          <td>${receipt.supplier?.name || "-"}</td>
                          <td class="text-center">${receipt.items?.length || 0}</td>
                          <td class="text-right text-red">${formatCurrencyPrint(Number(receipt.total_amount) || 0)}</td>
                          <td class="text-right text-green">${formatCurrencyPrint(sellingValue)}</td>
                          <td class="text-right text-blue font-bold">${formatCurrencyPrint(profit)}</td>
                        </tr>
                      `;
                    })
                    .join("") ||
                  '<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>'
                }
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>Dicetak pada: ${format(new Date(), "dd MMMM yyyy HH:mm", { locale: localeId })}</div>
            <div>${clinicName}</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(printContent);
      printWindow.document.close();

      toast.success("Menyiapkan halaman cetak...");
    } catch (error) {
      console.error("Error printing:", error);
      toast.error("Gagal mencetak");
    } finally {
      setPrinting(false);
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

  // Format percentage
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Laporan Penerimaan
          </h1>
          <p className="text-muted-foreground">
            Analisis penerimaan barang dan potensi laba rugi
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={printing || loading}
          >
            {printing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Printer className="mr-2 h-4 w-4" />
            )}
            Print
          </Button>
          <Button onClick={handleExportExcel} disabled={exporting || loading}>
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Export Excel
          </Button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Penerimaan
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {summary?.total_receipts || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Rata-rata {summary?.avg_receipts_per_day.toFixed(1) || 0}/hari
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pembelian (HPP)
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(summary?.total_purchase_value || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Harga beli dari supplier
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Potensi Penjualan
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(summary?.total_selling_value || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Jika terjual semua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potensi Laba</CardTitle>
            <Percent className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div
                className={`text-2xl font-bold ${(summary?.potential_profit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {formatCurrency(summary?.potential_profit || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Margin {formatPercent(summary?.avg_profit_margin || 0)}
            </p>
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
            <div className="grid gap-4 md:grid-cols-3">
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

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "summary" | "daily" | "detail")}
      >
        <TabsList>
          <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          <TabsTrigger value="daily">Per Hari</TabsTrigger>
          <TabsTrigger value="detail">Detail</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-4 space-y-4">
          {/* Profit Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analisis Laba Rugi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Pembelian (HPP)
                      </p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(summary?.total_purchase_value || 0)}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-400" />
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Potensi Penjualan
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(summary?.total_selling_value || 0)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                  <div
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      (summary?.potential_profit || 0) >= 0
                        ? "bg-blue-50 dark:bg-blue-950"
                        : "bg-orange-50 dark:bg-orange-950"
                    }`}
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Potensi Laba
                      </p>
                      <p
                        className={`text-xl font-bold ${
                          (summary?.potential_profit || 0) >= 0
                            ? "text-blue-600"
                            : "text-orange-600"
                        }`}
                      >
                        {formatCurrency(summary?.potential_profit || 0)}
                      </p>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        (summary?.potential_profit || 0) >= 0
                          ? "text-blue-400"
                          : "text-orange-400"
                      }`}
                    >
                      {formatPercent(summary?.avg_profit_margin || 0)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Penerimaan
                    </p>
                    <p className="text-xl font-bold">
                      {summary?.total_receipts || 0} transaksi
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Item</p>
                    <p className="text-xl font-bold">
                      {summary?.total_items || 0} item
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Total Quantity
                    </p>
                    <p className="text-xl font-bold">
                      {summary?.total_qty || 0} unit
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* By Supplier */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Ringkasan Per Supplier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Penerimaan</TableHead>
                    <TableHead className="text-right">Jenis Obat</TableHead>
                    <TableHead className="text-right">
                      Nilai Beli (HPP)
                    </TableHead>
                    <TableHead className="text-right">Nilai Jual</TableHead>
                    <TableHead className="text-right">Potensi Laba</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-10 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : summary?.by_supplier.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    summary?.by_supplier.map((item) => {
                      const margin =
                        item.total_purchase_value > 0
                          ? (item.potential_profit /
                              item.total_purchase_value) *
                            100
                          : 0;
                      return (
                        <TableRow key={item.supplier_id}>
                          <TableCell className="font-medium">
                            {item.supplier_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.receipt_count}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.medicines.length}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(item.total_purchase_value)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(item.total_selling_value)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${item.potential_profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                          >
                            {formatCurrency(item.potential_profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                margin >= 20
                                  ? "default"
                                  : margin >= 10
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {formatPercent(margin)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewSupplierDetail(item)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Tab */}
        <TabsContent value="daily" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="text-right">Penerimaan</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Nilai Beli</TableHead>
                    <TableHead className="text-right">Nilai Jual</TableHead>
                    <TableHead className="text-right">Laba</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={8}>
                          <Skeleton className="h-12 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : dailyData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Calendar className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Tidak ada penerimaan pada periode ini
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    dailyData.map((day) => (
                      <React.Fragment key={day.date}>
                        <TableRow
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => toggleDateExpand(day.date)}
                        >
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                            >
                              {expandedDates.has(day.date) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-medium">
                            {format(parseISO(day.date), "EEEE, dd MMMM yyyy", {
                              locale: localeId,
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.receipt_count}
                          </TableCell>
                          <TableCell className="text-right">
                            {day.total_qty}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(day.total_purchase_value)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(day.total_selling_value)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${day.potential_profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                          >
                            {formatCurrency(day.potential_profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                day.profit_margin >= 20
                                  ? "default"
                                  : day.profit_margin >= 10
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {formatPercent(day.profit_margin)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        {expandedDates.has(day.date) && (
                          <TableRow className="bg-muted/30">
                            <TableCell colSpan={8} className="p-0">
                              <div className="p-4">
                                <p className="text-sm font-medium mb-2">
                                  Detail Penerimaan:
                                </p>
                                <div className="space-y-2">
                                  {day.receipts.map((receipt) => (
                                    <div
                                      key={receipt.id}
                                      className="flex items-center justify-between p-2 bg-background rounded border cursor-pointer hover:bg-muted/50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDetail(receipt.id);
                                      }}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Receipt className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                          <p className="font-medium">
                                            {receipt.receipt_number}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {receipt.supplier?.name} •{" "}
                                            {receipt.items?.length || 0} item
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">
                                          {formatCurrency(
                                            Number(receipt.total_amount) || 0,
                                          )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {receipt.supplier_invoice_number ||
                                            "-"}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detail Tab */}
        <TabsContent value="detail" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>No. Penerimaan</TableHead>
                    <TableHead>No. Faktur</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead className="text-right">Item</TableHead>
                    <TableHead className="text-right">Nilai Beli</TableHead>
                    <TableHead className="text-right">Nilai Jual</TableHead>
                    <TableHead className="text-right">Laba</TableHead>
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
                  ) : receipts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Receipt className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Tidak ada penerimaan pada periode ini
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    receipts.map((receipt) => {
                      const sellingValue =
                        receipt.items?.reduce((sum, item) => {
                          return (
                            sum +
                            item.quantity * (item.medicine?.selling_price || 0)
                          );
                        }, 0) || 0;
                      const profit = sellingValue - receipt.total_amount;

                      return (
                        <TableRow key={receipt.id}>
                          <TableCell>
                            {format(
                              new Date(receipt.receipt_date),
                              "dd MMM yyyy",
                              { locale: localeId },
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {receipt.receipt_number}
                          </TableCell>
                          <TableCell>
                            {receipt.supplier_invoice_number || "-"}
                          </TableCell>
                          <TableCell>{receipt.supplier?.name}</TableCell>
                          <TableCell className="text-right">
                            {receipt.items?.length || 0}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(receipt.total_amount)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(sellingValue)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                          >
                            {formatCurrency(profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetail(receipt.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Penerimaan Barang</DialogTitle>
            <DialogDescription>
              {selectedReceipt?.receipt_number}
            </DialogDescription>
          </DialogHeader>

          {selectedReceipt && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                      { locale: localeId },
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">
                    {selectedReceipt.supplier?.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">No. Faktur</p>
                  <p className="font-medium">
                    {selectedReceipt.supplier_invoice_number || "-"}
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
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Harga Beli</TableHead>
                      <TableHead className="text-right">Harga Jual</TableHead>
                      <TableHead className="text-right">Total Beli</TableHead>
                      <TableHead className="text-right">Potensi Jual</TableHead>
                      <TableHead className="text-right">Laba</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReceipt.items?.map((item) => {
                      const sellingPrice = item.medicine?.selling_price || 0;
                      const totalSelling = item.quantity * sellingPrice;
                      const profit = totalSelling - item.total_price;

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {item.medicine?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.medicine?.code}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{item.batch_number}</p>
                              <p className="text-xs text-muted-foreground">
                                Exp:{" "}
                                {format(
                                  new Date(item.expiry_date),
                                  "dd/MM/yyyy",
                                )}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity} {item.unit}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.unit_price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(sellingPrice)}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(item.total_price)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(totalSelling)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                          >
                            {formatCurrency(profit)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Pembelian
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {formatCurrency(selectedReceipt.total_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Potensi Penjualan
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(
                      selectedReceipt.items?.reduce((sum, item) => {
                        return (
                          sum +
                          item.quantity * (item.medicine?.selling_price || 0)
                        );
                      }, 0) || 0,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Potensi Laba</p>
                  {(() => {
                    const totalSelling =
                      selectedReceipt.items?.reduce((sum, item) => {
                        return (
                          sum +
                          item.quantity * (item.medicine?.selling_price || 0)
                        );
                      }, 0) || 0;
                    const profit = totalSelling - selectedReceipt.total_amount;
                    return (
                      <p
                        className={`text-lg font-bold ${profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                      >
                        {formatCurrency(profit)}
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Supplier Detail Modal */}
      <Dialog
        open={supplierDetailModalOpen}
        onOpenChange={setSupplierDetailModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Obat Per Supplier</DialogTitle>
            <DialogDescription>
              {selectedSupplier?.supplier_name}
            </DialogDescription>
          </DialogHeader>

          {selectedSupplier && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Total Penerimaan
                  </p>
                  <p className="text-xl font-bold">
                    {selectedSupplier.receipt_count}
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nilai Beli</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(selectedSupplier.total_purchase_value)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Nilai Jual</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedSupplier.total_selling_value)}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-muted-foreground">Potensi Laba</p>
                  <p
                    className={`text-xl font-bold ${selectedSupplier.potential_profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                  >
                    {formatCurrency(selectedSupplier.potential_profit)}
                  </p>
                </div>
              </div>

              {/* Medicine Details Table */}
              <div>
                <p className="text-sm font-medium mb-2">
                  Daftar Obat ({selectedSupplier.medicines.length} jenis)
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Kode</TableHead>
                      <TableHead>Nama Obat</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Satuan</TableHead>
                      <TableHead className="text-right">Nilai Beli</TableHead>
                      <TableHead className="text-right">Nilai Jual</TableHead>
                      <TableHead className="text-right">Laba</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSupplier.medicines.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Tidak ada data obat
                        </TableCell>
                      </TableRow>
                    ) : (
                      selectedSupplier.medicines.map((medicine) => (
                        <TableRow key={medicine.medicine_id}>
                          <TableCell className="font-mono text-sm">
                            {medicine.medicine_code}
                          </TableCell>
                          <TableCell className="font-medium">
                            {medicine.medicine_name}
                          </TableCell>
                          <TableCell className="text-right">
                            {medicine.total_qty}
                          </TableCell>
                          <TableCell className="text-right">
                            {medicine.unit}
                          </TableCell>
                          <TableCell className="text-right text-red-600">
                            {formatCurrency(medicine.total_purchase_value)}
                          </TableCell>
                          <TableCell className="text-right text-green-600">
                            {formatCurrency(medicine.total_selling_value)}
                          </TableCell>
                          <TableCell
                            className={`text-right font-medium ${medicine.potential_profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                          >
                            {formatCurrency(medicine.potential_profit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={
                                medicine.profit_margin >= 20
                                  ? "default"
                                  : medicine.profit_margin >= 10
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {formatPercent(medicine.profit_margin)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Total Summary Row */}
              {selectedSupplier.medicines.length > 0 && (
                <div className="flex justify-end">
                  <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg w-fit">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Total Qty</p>
                      <p className="font-bold">
                        {selectedSupplier.medicines.reduce(
                          (sum, m) => sum + m.total_qty,
                          0,
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Total Beli
                      </p>
                      <p className="font-bold text-red-600">
                        {formatCurrency(selectedSupplier.total_purchase_value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Total Jual
                      </p>
                      <p className="font-bold text-green-600">
                        {formatCurrency(selectedSupplier.total_selling_value)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Total Laba
                      </p>
                      <p
                        className={`font-bold ${selectedSupplier.potential_profit >= 0 ? "text-blue-600" : "text-orange-600"}`}
                      >
                        {formatCurrency(selectedSupplier.potential_profit)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
