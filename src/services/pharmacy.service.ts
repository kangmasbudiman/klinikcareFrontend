import api from "@/lib/axios";
import type {
  Supplier,
  SupplierPayload,
  SupplierFilters,
  SupplierListResponse,
  SupplierResponse,
  SupplierStats,
  MedicineCategory,
  MedicineCategoryPayload,
  MedicineCategoryListResponse,
  Medicine,
  MedicinePayload,
  MedicineFilters,
  MedicineListResponse,
  MedicineResponse,
  MedicineStats,
  MedicineBatch,
  MedicineBatchListResponse,
  StockCardResponse,
  StockMovementFilters,
  PurchaseOrder,
  PurchaseOrderPayload,
  PurchaseOrderFilters,
  PurchaseOrderStats,
  GoodsReceipt,
  GoodsReceiptPayload,
  GoodsReceiptFilters,
  GoodsReceiptStats,
  StockMovement,
  StockAdjustmentPayload,
  StockMovementStats,
  StockMovementReason_Info,
  CalculatePricePayload,
  CalculatePriceResponse,
} from "@/types/pharmacy";

// =====================
// SUPPLIER SERVICE
// =====================

export const supplierService = {
  async getSuppliers(
    filters: SupplierFilters = {},
  ): Promise<SupplierListResponse> {
    const response = await api.get<SupplierListResponse>("/api/suppliers", {
      params: {
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        city: filters.city || undefined,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  async getActiveSuppliers(): Promise<{ success: boolean; data: Supplier[] }> {
    const response = await api.get<{ success: boolean; data: Supplier[] }>(
      "/api/suppliers/active",
    );
    return response.data;
  },

  async getSupplierStats(): Promise<{ success: boolean; data: SupplierStats }> {
    const response = await api.get<{ success: boolean; data: SupplierStats }>(
      "/api/suppliers/stats",
    );
    return response.data;
  },

  async getSupplierById(id: number): Promise<SupplierResponse> {
    const response = await api.get<SupplierResponse>(`/api/suppliers/${id}`);
    return response.data;
  },

  async createSupplier(payload: SupplierPayload): Promise<SupplierResponse> {
    const response = await api.post<SupplierResponse>(
      "/api/suppliers",
      payload,
    );
    return response.data;
  },

  async updateSupplier(
    id: number,
    payload: SupplierPayload,
  ): Promise<SupplierResponse> {
    const response = await api.put<SupplierResponse>(
      `/api/suppliers/${id}`,
      payload,
    );
    return response.data;
  },

  async deleteSupplier(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/suppliers/${id}`,
    );
    return response.data;
  },

  async toggleSupplierStatus(id: number): Promise<SupplierResponse> {
    const response = await api.patch<SupplierResponse>(
      `/api/suppliers/${id}/toggle-status`,
    );
    return response.data;
  },
};

// =====================
// MEDICINE CATEGORY SERVICE
// =====================

export const medicineCategoryService = {
  async getCategories(params?: {
    search?: string;
    per_page?: number;
  }): Promise<MedicineCategoryListResponse> {
    const response = await api.get<MedicineCategoryListResponse>(
      "/api/medicine-categories",
      {
        params,
      },
    );
    return response.data;
  },

  async getCategoryById(
    id: number,
  ): Promise<{ success: boolean; data: MedicineCategory }> {
    const response = await api.get<{
      success: boolean;
      data: MedicineCategory;
    }>(`/api/medicine-categories/${id}`);
    return response.data;
  },

  async createCategory(
    payload: MedicineCategoryPayload,
  ): Promise<{ success: boolean; message: string; data: MedicineCategory }> {
    const response = await api.post<{
      success: boolean;
      message: string;
      data: MedicineCategory;
    }>("/api/medicine-categories", payload);
    return response.data;
  },

  async updateCategory(
    id: number,
    payload: MedicineCategoryPayload,
  ): Promise<{ success: boolean; message: string; data: MedicineCategory }> {
    const response = await api.put<{
      success: boolean;
      message: string;
      data: MedicineCategory;
    }>(`/api/medicine-categories/${id}`, payload);
    return response.data;
  },

  async deleteCategory(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/medicine-categories/${id}`,
    );
    return response.data;
  },
};

// =====================
// MEDICINE SERVICE
// =====================

export const medicineService = {
  async getMedicines(
    filters: MedicineFilters = {},
  ): Promise<MedicineListResponse> {
    const response = await api.get<MedicineListResponse>("/api/medicines", {
      params: {
        search: filters.search || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        category_id: filters.category_id || undefined,
        stock_status: filters.stock_status || undefined,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
      },
    });
    return response.data;
  },

  async getActiveMedicines(params?: {
    search?: string;
    category_id?: number;
  }): Promise<{ success: boolean; data: Medicine[] }> {
    const response = await api.get<{ success: boolean; data: Medicine[] }>(
      "/api/medicines/active",
      { params },
    );
    return response.data;
  },

  async getLowStockMedicines(): Promise<{
    success: boolean;
    data: Medicine[];
  }> {
    const response = await api.get<{ success: boolean; data: Medicine[] }>(
      "/api/medicines/low-stock",
    );
    return response.data;
  },

  async getExpiringMedicines(
    months?: number,
  ): Promise<{ success: boolean; data: MedicineBatch[] }> {
    const response = await api.get<{ success: boolean; data: MedicineBatch[] }>(
      "/api/medicines/expiring",
      { params: { months } },
    );
    return response.data;
  },

  async getMedicineStats(): Promise<{ success: boolean; data: MedicineStats }> {
    const response = await api.get<{ success: boolean; data: MedicineStats }>(
      "/api/medicines/stats",
    );
    return response.data;
  },

  async getMedicineById(id: number): Promise<MedicineResponse> {
    const response = await api.get<MedicineResponse>(`/api/medicines/${id}`);
    return response.data;
  },

  async createMedicine(payload: MedicinePayload): Promise<MedicineResponse> {
    const response = await api.post<MedicineResponse>(
      "/api/medicines",
      payload,
    );
    return response.data;
  },

  async updateMedicine(
    id: number,
    payload: MedicinePayload,
  ): Promise<MedicineResponse> {
    const response = await api.put<MedicineResponse>(
      `/api/medicines/${id}`,
      payload,
    );
    return response.data;
  },

  async deleteMedicine(
    id: number,
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/medicines/${id}`,
    );
    return response.data;
  },

  async toggleMedicineStatus(id: number): Promise<MedicineResponse> {
    const response = await api.patch<MedicineResponse>(
      `/api/medicines/${id}/toggle-status`,
    );
    return response.data;
  },

  async getMedicineBatches(
    medicineId: number,
  ): Promise<MedicineBatchListResponse> {
    const response = await api.get<MedicineBatchListResponse>(
      `/api/medicines/${medicineId}/batches`,
    );
    return response.data;
  },

  async getStockCard(
    medicineId: number,
    filters?: StockMovementFilters,
  ): Promise<StockCardResponse> {
    const response = await api.get<StockCardResponse>(
      `/api/medicines/${medicineId}/stock-card`,
      { params: filters },
    );
    return response.data;
  },

  async getUnits(): Promise<{ success: boolean; data: string[] }> {
    const response = await api.get<{ success: boolean; data: string[] }>(
      "/api/medicines/units",
    );
    return response.data;
  },

  async calculatePrice(
    payload: CalculatePricePayload,
  ): Promise<{ success: boolean; data: CalculatePriceResponse }> {
    const response = await api.post<{
      success: boolean;
      data: CalculatePriceResponse;
    }>("/api/medicines/calculate-price", payload);
    return response.data;
  },

  // Helper: Format currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  },

  // Helper: Get stock status color class
  getStockStatusClass(status: Medicine["stock_status"]): string {
    const colors: Record<Medicine["stock_status"], string> = {
      out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      normal:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      overstock:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    };
    return colors[status] || colors.normal;
  },

  // Helper: Get stock status label
  getStockStatusLabel(status: Medicine["stock_status"]): string {
    const labels: Record<Medicine["stock_status"], string> = {
      out_of_stock: "Habis",
      low: "Menipis",
      normal: "Normal",
      overstock: "Berlebih",
    };
    return labels[status] || "Unknown";
  },
};

// =====================
// PURCHASE ORDER SERVICE
// =====================

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const purchaseOrderService = {
  async getPurchaseOrders(
    filters: PurchaseOrderFilters = {},
  ): Promise<PaginatedResponse<PurchaseOrder>> {
    const response = await api.get<PaginatedResponse<PurchaseOrder>>(
      "/api/purchase-orders",
      {
        params: {
          search: filters.search || undefined,
          status: filters.status === "all" ? undefined : filters.status,
          supplier_id: filters.supplier_id || undefined,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          page: filters.page || 1,
          per_page: filters.per_page || 10,
        },
      },
    );
    return response.data;
  },

  async getPurchaseOrderStats(): Promise<PurchaseOrderStats> {
    const response = await api.get<PurchaseOrderStats>(
      "/api/purchase-orders/stats",
    );
    return response.data;
  },

  async getPendingApproval(): Promise<PurchaseOrder[]> {
    const response = await api.get<PurchaseOrder[]>(
      "/api/purchase-orders/pending-approval",
    );
    return response.data;
  },

  async getNeedsReceiving(): Promise<PurchaseOrder[]> {
    const response = await api.get<PurchaseOrder[]>(
      "/api/purchase-orders/needs-receiving",
    );
    return response.data;
  },

  async getPurchaseOrderById(id: number): Promise<PurchaseOrder> {
    const response = await api.get<PurchaseOrder>(`/api/purchase-orders/${id}`);
    return response.data;
  },

  async createPurchaseOrder(
    payload: PurchaseOrderPayload,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.post<{ message: string; data: PurchaseOrder }>(
      "/api/purchase-orders",
      payload,
    );
    return response.data;
  },

  async updatePurchaseOrder(
    id: number,
    payload: PurchaseOrderPayload,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.put<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}`,
      payload,
    );
    return response.data;
  },

  async deletePurchaseOrder(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/api/purchase-orders/${id}`,
    );
    return response.data;
  },

  async submitForApproval(
    id: number,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.patch<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}/submit`,
    );
    return response.data;
  },

  async approve(
    id: number,
    notes?: string,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.patch<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}/approve`,
      { notes },
    );
    return response.data;
  },

  async reject(
    id: number,
    reason: string,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.patch<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}/reject`,
      { reason },
    );
    return response.data;
  },

  async markAsOrdered(
    id: number,
  ): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.patch<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}/mark-ordered`,
    );
    return response.data;
  },

  async cancel(id: number): Promise<{ message: string; data: PurchaseOrder }> {
    const response = await api.patch<{ message: string; data: PurchaseOrder }>(
      `/api/purchase-orders/${id}/cancel`,
    );
    return response.data;
  },
};

// =====================
// GOODS RECEIPT SERVICE
// =====================

export const goodsReceiptService = {
  async getGoodsReceipts(
    filters: GoodsReceiptFilters = {},
  ): Promise<PaginatedResponse<GoodsReceipt>> {
    const response = await api.get<PaginatedResponse<GoodsReceipt>>(
      "/api/goods-receipts",
      {
        params: {
          search: filters.search || undefined,
          status: filters.status === "all" ? undefined : filters.status,
          supplier_id: filters.supplier_id || undefined,
          purchase_order_id: filters.purchase_order_id || undefined,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          page: filters.page || 1,
          per_page: filters.per_page || 10,
        },
      },
    );
    return response.data;
  },

  async getGoodsReceiptStats(): Promise<GoodsReceiptStats> {
    const response = await api.get<GoodsReceiptStats>(
      "/api/goods-receipts/stats",
    );
    return response.data;
  },

  async getGoodsReceiptById(id: number): Promise<GoodsReceipt> {
    const response = await api.get<GoodsReceipt>(`/api/goods-receipts/${id}`);
    return response.data;
  },

  async createFromPo(
    poId: number,
  ): Promise<{ purchase_order: PurchaseOrder; items: any[] }> {
    const response = await api.get<{
      purchase_order: PurchaseOrder;
      items: any[];
    }>(`/api/goods-receipts/from-po/${poId}`);
    return response.data;
  },

  async createGoodsReceipt(
    payload: GoodsReceiptPayload,
  ): Promise<{ message: string; data: GoodsReceipt }> {
    const response = await api.post<{ message: string; data: GoodsReceipt }>(
      "/api/goods-receipts",
      payload,
    );
    return response.data;
  },

  async updateGoodsReceipt(
    id: number,
    payload: GoodsReceiptPayload,
  ): Promise<{ message: string; data: GoodsReceipt }> {
    const response = await api.put<{ message: string; data: GoodsReceipt }>(
      `/api/goods-receipts/${id}`,
      payload,
    );
    return response.data;
  },

  async deleteGoodsReceipt(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(
      `/api/goods-receipts/${id}`,
    );
    return response.data;
  },

  async complete(id: number): Promise<{ message: string; data: GoodsReceipt }> {
    const response = await api.patch<{ message: string; data: GoodsReceipt }>(
      `/api/goods-receipts/${id}/complete`,
    );
    return response.data;
  },

  async cancel(id: number): Promise<{ message: string; data: GoodsReceipt }> {
    const response = await api.patch<{ message: string; data: GoodsReceipt }>(
      `/api/goods-receipts/${id}/cancel`,
    );
    return response.data;
  },
};

// =====================
// STOCK MOVEMENT SERVICE
// =====================

export const stockMovementService = {
  async getStockMovements(
    filters: StockMovementFilters = {},
  ): Promise<PaginatedResponse<StockMovement>> {
    const response = await api.get<PaginatedResponse<StockMovement>>(
      "/api/stock-movements",
      {
        params: {
          search: filters.search || undefined,
          medicine_id: filters.medicine_id || undefined,
          batch_id: filters.batch_id || undefined,
          movement_type: filters.movement_type || undefined,
          reason: filters.reason || undefined,
          start_date: filters.start_date || undefined,
          end_date: filters.end_date || undefined,
          page: filters.page || 1,
          per_page: filters.per_page || 10,
        },
      },
    );
    return response.data;
  },

  async getStockMovementStats(
    startDate?: string,
    endDate?: string,
  ): Promise<StockMovementStats> {
    const response = await api.get<StockMovementStats>(
      "/api/stock-movements/stats",
      {
        params: { start_date: startDate, end_date: endDate },
      },
    );
    return response.data;
  },

  async getStockMovementById(id: number): Promise<StockMovement> {
    const response = await api.get<StockMovement>(`/api/stock-movements/${id}`);
    return response.data;
  },

  async getStockCard(
    medicineId: number,
    startDate?: string,
    endDate?: string,
  ): Promise<StockCardResponse> {
    const response = await api.get<StockCardResponse>(
      `/api/stock-movements/stock-card/${medicineId}`,
      {
        params: { start_date: startDate, end_date: endDate },
      },
    );
    return response.data;
  },

  async getReasons(): Promise<StockMovementReason_Info[]> {
    const response = await api.get<StockMovementReason_Info[]>(
      "/api/stock-movements/reasons",
    );
    return response.data;
  },

  async createAdjustment(
    payload: StockAdjustmentPayload,
  ): Promise<{ message: string; data: StockMovement }> {
    const response = await api.post<{ message: string; data: StockMovement }>(
      "/api/stock-movements/adjustment",
      payload,
    );
    return response.data;
  },

  async getSummary(
    startDate?: string,
    endDate?: string,
  ): Promise<{
    period: { start_date: string; end_date: string };
    summary: any[];
  }> {
    const response = await api.get<{
      period: { start_date: string; end_date: string };
      summary: any[];
    }>("/api/stock-movements/summary", {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  },
};

// =====================
// PHARMACY REPORT SERVICE
// =====================

import type {
  PharmacyReportFilters,
  StockInReportResponse,
  StockOutReportResponse,
  StockReportSummary,
} from "@/types/pharmacy";

export const pharmacyReportService = {
  // Laporan Stok Masuk
  async getStockInReport(
    filters: PharmacyReportFilters,
  ): Promise<StockInReportResponse> {
    const response = await api.get<StockInReportResponse>(
      "/api/pharmacy/reports/stock-in",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          supplier_id: filters.supplier_id || undefined,
          medicine_id: filters.medicine_id || undefined,
          group_by: filters.group_by || undefined,
          page: filters.page || 1,
          per_page: filters.per_page || 20,
        },
      },
    );
    return response.data;
  },

  // Laporan Stok Keluar
  async getStockOutReport(
    filters: PharmacyReportFilters,
  ): Promise<StockOutReportResponse> {
    const response = await api.get<StockOutReportResponse>(
      "/api/pharmacy/reports/stock-out",
      {
        params: {
          start_date: filters.start_date,
          end_date: filters.end_date,
          medicine_id: filters.medicine_id || undefined,
          reason: filters.reason || undefined,
          group_by: filters.group_by || undefined,
          page: filters.page || 1,
          per_page: filters.per_page || 20,
        },
      },
    );
    return response.data;
  },

  // Ringkasan Stok Masuk
  async getStockInSummary(
    startDate: string,
    endDate: string,
    groupBy?: "date" | "supplier" | "medicine",
  ): Promise<{ success: boolean; data: StockReportSummary }> {
    const response = await api.get<{
      success: boolean;
      data: StockReportSummary;
    }>("/api/pharmacy/reports/stock-in/summary", {
      params: {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      },
    });
    return response.data;
  },

  // Ringkasan Stok Keluar
  async getStockOutSummary(
    startDate: string,
    endDate: string,
    groupBy?: "date" | "medicine" | "reason",
  ): Promise<{ success: boolean; data: StockReportSummary }> {
    const response = await api.get<{
      success: boolean;
      data: StockReportSummary;
    }>("/api/pharmacy/reports/stock-out/summary", {
      params: {
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      },
    });
    return response.data;
  },

  // Export ke Excel
  async exportStockInToExcel(filters: PharmacyReportFilters): Promise<Blob> {
    const response = await api.get("/api/pharmacy/reports/stock-in/export", {
      params: {
        start_date: filters.start_date,
        end_date: filters.end_date,
        supplier_id: filters.supplier_id || undefined,
        medicine_id: filters.medicine_id || undefined,
      },
      responseType: "blob",
    });
    return response.data;
  },

  async exportStockOutToExcel(filters: PharmacyReportFilters): Promise<Blob> {
    const response = await api.get("/api/pharmacy/reports/stock-out/export", {
      params: {
        start_date: filters.start_date,
        end_date: filters.end_date,
        medicine_id: filters.medicine_id || undefined,
        reason: filters.reason || undefined,
      },
      responseType: "blob",
    });
    return response.data;
  },

  // Helper: Format currency
  formatCurrency(value: number): string {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  },

  // Helper: Download file
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};

export default {
  supplier: supplierService,
  category: medicineCategoryService,
  medicine: medicineService,
  purchaseOrder: purchaseOrderService,
  goodsReceipt: goodsReceiptService,
  stockMovement: stockMovementService,
  pharmacyReport: pharmacyReportService,
};
