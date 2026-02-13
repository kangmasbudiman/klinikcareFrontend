// =====================
// SUPPLIER
// =====================

export interface Supplier {
  id: number;
  code: string;
  name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  npwp: string | null;
  payment_terms: number;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplierPayload {
  code?: string;
  name: string;
  contact_person?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  npwp?: string;
  payment_terms?: number;
  is_active?: boolean;
  notes?: string;
}

export interface SupplierFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  city?: string;
  page?: number;
  per_page?: number;
}

// =====================
// MEDICINE CATEGORY
// =====================

export interface MedicineCategory {
  id: number;
  name: string;
  description: string | null;
  medicines_count?: number;
  created_at: string;
  updated_at: string;
}

export interface MedicineCategoryPayload {
  name: string;
  description?: string;
}

// =====================
// MEDICINE
// =====================

export interface Medicine {
  id: number;
  code: string;
  name: string;
  generic_name: string | null;
  category_id: number | null;
  category?: MedicineCategory | null;
  unit: string;
  unit_conversion: number;
  purchase_price: number;
  margin_percentage: number;
  ppn_percentage: number;
  is_ppn_included: boolean;
  price_before_ppn: number;
  selling_price: number;
  min_stock: number;
  max_stock: number;
  manufacturer: string | null;
  description: string | null;
  requires_prescription: boolean;
  is_active: boolean;
  current_stock: number;
  stock_status: "out_of_stock" | "low" | "normal" | "overstock";
  stock_status_label?: string;
  formatted_purchase_price?: string;
  formatted_selling_price?: string;
  formatted_price_before_ppn?: string;
  margin_amount?: number;
  ppn_amount?: number;
  created_at: string;
  updated_at: string;
}

export interface MedicinePayload {
  code?: string;
  name: string;
  generic_name?: string;
  category_id?: number | null;
  unit: string;
  unit_conversion?: number;
  purchase_price?: number;
  margin_percentage?: number;
  ppn_percentage?: number;
  is_ppn_included?: boolean;
  selling_price?: number;
  min_stock?: number;
  max_stock?: number;
  manufacturer?: string;
  description?: string;
  requires_prescription?: boolean;
  is_active?: boolean;
}

export interface CalculatePricePayload {
  purchase_price: number;
  margin_percentage: number;
  ppn_percentage: number;
}

export interface CalculatePriceResponse {
  price_before_ppn: number;
  selling_price: number;
  margin_amount: number;
  ppn_amount: number;
}

export interface MedicineFilters {
  search?: string;
  status?: "all" | "active" | "inactive";
  category_id?: number;
  stock_status?: "low" | "out_of_stock";
  page?: number;
  per_page?: number;
}

// =====================
// MEDICINE BATCH
// =====================

export interface MedicineBatch {
  id: number;
  medicine_id: number;
  medicine?: Medicine;
  batch_number: string;
  expiry_date: string;
  initial_qty: number;
  current_qty: number;
  purchase_price: number | null;
  purchase_receipt_item_id: number | null;
  status: "available" | "low" | "expired" | "empty";
  is_expired: boolean;
  is_expiring_soon: boolean;
  days_until_expiry: number;
  formatted_expiry_date?: string;
  created_at: string;
  updated_at: string;
}

// =====================
// PURCHASE ORDER
// =====================

export type PurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "ordered"
  | "partial_received"
  | "completed"
  | "cancelled";

export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id: number;
  supplier?: Supplier;
  order_date: string;
  expected_delivery_date: string | null;
  status: PurchaseOrderStatus;
  status_label: string;
  status_color: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  created_by: number;
  creator?: { id: number; name: string };
  approved_by: number | null;
  approver?: { id: number; name: string } | null;
  approved_at: string | null;
  approval_notes: string | null;
  rejected_by: number | null;
  rejector?: { id: number; name: string } | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  notes: string | null;
  items?: PurchaseOrderItem[];
  goods_receipts?: GoodsReceipt[];
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  medicine_id: number;
  medicine?: Medicine;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  total_price: number;
  received_quantity: number;
  remaining_quantity: number;
  is_fully_received: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItemPayload {
  id?: number;
  medicine_id: number;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_percent?: number;
  tax_percent?: number;
  notes?: string;
}

export interface PurchaseOrderPayload {
  supplier_id: number;
  order_date: string;
  expected_delivery_date?: string;
  notes?: string;
  items: PurchaseOrderItemPayload[];
}

export interface PurchaseOrderFilters {
  search?: string;
  status?: PurchaseOrderStatus | "all";
  supplier_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface PurchaseOrderStats {
  total: number;
  draft: number;
  pending_approval: number;
  approved: number;
  rejected: number;
  ordered: number;
  partial_received: number;
  completed: number;
  total_value_pending: number;
  total_value_this_month: number;
}

// =====================
// GOODS RECEIPT
// =====================

export type GoodsReceiptStatus = "draft" | "completed" | "cancelled";

export interface GoodsReceipt {
  id: number;
  receipt_number: string;
  purchase_order_id: number | null;
  purchase_order?: PurchaseOrder | null;
  supplier_id: number;
  supplier?: Supplier;
  receipt_date: string;
  supplier_invoice_number: string | null;
  supplier_invoice_date: string | null;
  status: GoodsReceiptStatus;
  status_label: string;
  total_amount: number;
  received_by: number;
  receiver?: { id: number; name: string };
  notes: string | null;
  items?: GoodsReceiptItem[];
  created_at: string;
  updated_at: string;
}

export interface GoodsReceiptItem {
  id: number;
  goods_receipt_id: number;
  purchase_order_item_id: number | null;
  purchase_order_item?: PurchaseOrderItem | null;
  medicine_id: number;
  medicine?: Medicine;
  medicine_batch_id: number | null;
  medicine_batch?: MedicineBatch | null;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  batch_number: string;
  expiry_date: string;
  is_expiring_soon: boolean;
  days_until_expiry: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoodsReceiptItemPayload {
  id?: number;
  purchase_order_item_id?: number;
  medicine_id: number;
  quantity: number;
  unit: string;
  unit_price: number;
  batch_number: string;
  expiry_date: string;
  notes?: string;
}

export interface GoodsReceiptPayload {
  purchase_order_id?: number;
  supplier_id: number;
  receipt_date: string;
  supplier_invoice_number?: string;
  supplier_invoice_date?: string;
  notes?: string;
  items: GoodsReceiptItemPayload[];
}

export interface GoodsReceiptFilters {
  search?: string;
  status?: GoodsReceiptStatus | "all";
  supplier_id?: number;
  purchase_order_id?: number;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface GoodsReceiptStats {
  total: number;
  draft: number;
  completed: number;
  total_value_this_month: number;
  total_today: number;
}

// =====================
// STOCK MOVEMENT
// =====================

export type StockMovementType = "in" | "out";

export type StockMovementReason =
  | "purchase"
  | "sales"
  | "adjustment_plus"
  | "adjustment_minus"
  | "return_supplier"
  | "return_patient"
  | "expired"
  | "damage"
  | "transfer_in"
  | "transfer_out"
  | "initial_stock"
  | "other";

export interface StockMovement {
  id: number;
  movement_number: string;
  medicine_id: number;
  medicine?: Medicine;
  medicine_batch_id: number | null;
  medicine_batch?: MedicineBatch | null;
  movement_type: StockMovementType;
  movement_type_label: string;
  reason: StockMovementReason;
  reason_label: string;
  quantity: number;
  unit: string;
  stock_before: number;
  stock_after: number;
  reference_type: string | null;
  reference_id: number | null;
  created_by: number;
  creator?: { id: number; name: string };
  notes: string | null;
  movement_date: string;
  created_at: string;
  updated_at: string;
}

export interface StockMovementFilters {
  search?: string;
  medicine_id?: number;
  batch_id?: number;
  movement_type?: StockMovementType;
  reason?: StockMovementReason;
  start_date?: string;
  end_date?: string;
  page?: number;
  per_page?: number;
}

export interface StockAdjustmentPayload {
  medicine_id: number;
  medicine_batch_id?: number;
  adjustment_type: "plus" | "minus";
  quantity: number;
  reason: StockMovementReason;
  notes?: string;
}

export interface StockMovementStats {
  total_in: number;
  total_out: number;
  movements_today: number;
  by_reason: Array<{
    reason: StockMovementReason;
    total_quantity: number;
    count: number;
  }>;
}

export interface StockCardResponse {
  medicine: Medicine;
  current_stock: number;
  movements: StockMovement[];
}

export interface StockMovementReason_Info {
  value: StockMovementReason;
  label: string;
  type: "in" | "out" | "both";
}

// =====================
// STATISTICS
// =====================

export interface SupplierStats {
  total: number;
  active: number;
  inactive: number;
}

export interface MedicineStats {
  total: number;
  active: number;
  inactive: number;
  low_stock: number;
  out_of_stock: number;
  expiring_soon: number;
}

// =====================
// API RESPONSES
// =====================

export interface SupplierListResponse {
  success: boolean;
  data: Supplier[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface SupplierResponse {
  success: boolean;
  message?: string;
  data: Supplier;
}

export interface MedicineCategoryListResponse {
  success: boolean;
  data: MedicineCategory[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface MedicineListResponse {
  success: boolean;
  data: Medicine[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface MedicineResponse {
  success: boolean;
  message?: string;
  data: Medicine;
}

export interface MedicineBatchListResponse {
  success: boolean;
  data: MedicineBatch[];
}

export interface StockCardResponse {
  success: boolean;
  data: {
    medicine: Medicine;
    movements: StockMovement[];
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Movement reason labels
export const MOVEMENT_REASON_LABELS: Record<StockMovementReason, string> = {
  purchase: "Pembelian",
  sales: "Penjualan/Penyerahan",
  adjustment_plus: "Penyesuaian (+)",
  adjustment_minus: "Penyesuaian (-)",
  return_supplier: "Retur ke Supplier",
  return_patient: "Retur dari Pasien",
  expired: "Kadaluarsa",
  damage: "Rusak/Pecah",
  transfer_in: "Mutasi Masuk",
  transfer_out: "Mutasi Keluar",
  initial_stock: "Stok Awal",
  other: "Lainnya",
};

// PO Status labels
export const PO_STATUS_LABELS: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  pending_approval: "Menunggu Persetujuan",
  approved: "Disetujui",
  rejected: "Ditolak",
  ordered: "Dipesan",
  partial_received: "Diterima Sebagian",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// PO Status colors
export const PO_STATUS_COLORS: Record<PurchaseOrderStatus, string> = {
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  pending_approval:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  ordered:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  partial_received:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

// GR Status labels
export const GR_STATUS_LABELS: Record<GoodsReceiptStatus, string> = {
  draft: "Draft",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// GR Status colors
export const GR_STATUS_COLORS: Record<GoodsReceiptStatus, string> = {
  draft:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

// Stock status colors
export const STOCK_STATUS_COLORS: Record<Medicine["stock_status"], string> = {
  out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  normal: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  overstock: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
};

// Stock status labels
export const STOCK_STATUS_LABELS: Record<Medicine["stock_status"], string> = {
  out_of_stock: "Habis",
  low: "Menipis",
  normal: "Normal",
  overstock: "Berlebih",
};

// Batch status colors
export const BATCH_STATUS_COLORS: Record<MedicineBatch["status"], string> = {
  available:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  low: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  empty: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

// =====================
// PHARMACY REPORTS
// =====================

export interface PharmacyReportFilters {
  start_date: string;
  end_date: string;
  supplier_id?: number;
  medicine_id?: number;
  movement_type?: StockMovementType;
  reason?: StockMovementReason;
  group_by?: "date" | "supplier" | "medicine";
  page?: number;
  per_page?: number;
}

export interface StockInReportItem {
  id: number;
  date: string;
  document_number: string;
  document_type: "goods_receipt" | "adjustment" | "return";
  supplier?: Supplier;
  medicine: Medicine;
  batch_number: string | null;
  expiry_date: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  reason: StockMovementReason;
  notes: string | null;
}

export interface StockOutReportItem {
  id: number;
  date: string;
  document_number: string;
  document_type:
    | "sales"
    | "adjustment"
    | "expired"
    | "damage"
    | "return_supplier";
  patient_name?: string;
  medicine: Medicine;
  batch_number: string | null;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  reason: StockMovementReason;
  notes: string | null;
}

export interface StockReportSummary {
  total_items: number;
  total_quantity: number;
  total_value: number;
  by_supplier?: Array<{
    supplier_id: number;
    supplier_name: string;
    total_quantity: number;
    total_value: number;
    item_count: number;
  }>;
  by_medicine?: Array<{
    medicine_id: number;
    medicine_name: string;
    medicine_code: string;
    total_quantity: number;
    total_value: number;
    transaction_count: number;
  }>;
  by_date?: Array<{
    date: string;
    total_quantity: number;
    total_value: number;
    transaction_count: number;
  }>;
  by_reason?: Array<{
    reason: StockMovementReason;
    reason_label: string;
    total_quantity: number;
    total_value: number;
    transaction_count: number;
  }>;
}

export interface StockInReportResponse {
  success: boolean;
  data: StockInReportItem[];
  summary: StockReportSummary;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    start_date: string;
    end_date: string;
    supplier_id?: number;
    medicine_id?: number;
  };
}

export interface StockOutReportResponse {
  success: boolean;
  data: StockOutReportItem[];
  summary: StockReportSummary;
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    start_date: string;
    end_date: string;
    medicine_id?: number;
    reason?: StockMovementReason;
  };
}
