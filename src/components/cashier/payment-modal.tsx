"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Banknote,
  CreditCard,
  Building2,
  Heart,
  Shield,
  Pill,
} from "lucide-react";
import type {
  Invoice,
  PaymentMethod,
  PayInvoicePayload,
} from "@/types/medical-record";
import medicalRecordService from "@/services/medical-record.service";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
  onSuccess: (paidInvoice?: Invoice) => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: any }[] = [
  { value: "cash", label: "Tunai", icon: Banknote },
  { value: "card", label: "Kartu Debit/Kredit", icon: CreditCard },
  { value: "transfer", label: "Transfer Bank", icon: Building2 },
  { value: "bpjs", label: "BPJS", icon: Heart },
  { value: "insurance", label: "Asuransi", icon: Shield },
];

// Quick amount buttons
const QUICK_AMOUNTS = [50000, 100000, 150000, 200000, 250000, 300000, 500000];

export function PaymentModal({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [notes, setNotes] = useState("");

  // Fetch full invoice details when modal opens
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (open && invoice?.id) {
        setIsFetchingDetails(true);
        try {
          const response = await medicalRecordService.getInvoiceById(
            invoice.id,
          );
          setInvoiceDetails(response.data);
        } catch (error) {
          console.error("Error fetching invoice details:", error);
          // Fallback to passed invoice
          setInvoiceDetails(invoice);
        } finally {
          setIsFetchingDetails(false);
        }
      }
    };

    fetchInvoiceDetails();
  }, [open, invoice?.id]);

  // Reset form when invoice changes
  useEffect(() => {
    if (invoice) {
      setPaidAmount(invoice.total_amount.toString());
      setPaymentMethod("cash");
      setNotes("");
    }
  }, [invoice]);

  if (!invoice) return null;

  // Use detailed invoice if available, otherwise use passed invoice
  const displayInvoice = invoiceDetails || invoice;

  // Calculate change
  const paid = parseFloat(paidAmount) || 0;
  const change = paid - invoice.total_amount;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (paid < invoice.total_amount) {
      toast.warning("Jumlah pembayaran kurang dari total tagihan", {
        description: `Total tagihan: ${formatCurrency(invoice.total_amount)}`,
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload: PayInvoicePayload = {
        paid_amount: paid,
        payment_method: paymentMethod,
        notes: notes || undefined,
      };

      const response = await medicalRecordService.payInvoice(
        invoice.id,
        payload,
      );
      toast.success("Pembayaran berhasil diproses", {
        description: `Invoice ${invoice.invoice_number} telah lunas`,
      });
      onSuccess(response.data);
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast.error("Gagal memproses pembayaran", {
        description: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pembayaran</DialogTitle>
          <DialogDescription>
            Invoice: {invoice.invoice_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Info */}
          <div className="p-3 rounded-lg bg-muted">
            <p className="font-semibold">{displayInvoice.patient?.name}</p>
            <p className="text-sm text-muted-foreground">
              {displayInvoice.patient?.medical_record_number} -{" "}
              {displayInvoice.medical_record?.department?.name}
            </p>
          </div>

          {/* Invoice Items */}
          <div className="space-y-2">
            <Label>Rincian Tagihan</Label>
            <div className="border rounded-lg p-3 space-y-3 max-h-[200px] overflow-y-auto">
              {isFetchingDetails ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Memuat rincian...
                  </span>
                </div>
              ) : (
                <>
                  {/* Services */}
                  {displayInvoice.items?.filter(
                    (item) => item.item_type === "service",
                  ).length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Layanan
                      </p>
                      {displayInvoice.items
                        .filter((item) => item.item_type === "service")
                        .map((item, index) => (
                          <div
                            key={`service-${index}`}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.item_name} x{item.quantity}
                            </span>
                            <span>{formatCurrency(item.total_price)}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Medicines */}
                  {displayInvoice.items?.filter(
                    (item) => item.item_type === "medicine",
                  ).length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1">
                        <Pill className="h-3 w-3" />
                        Obat
                      </p>
                      {displayInvoice.items
                        .filter((item) => item.item_type === "medicine")
                        .map((item, index) => (
                          <div
                            key={`medicine-${index}`}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.item_name} x{item.quantity}
                            </span>
                            <span>{formatCurrency(item.total_price)}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Other */}
                  {displayInvoice.items?.filter(
                    (item) => item.item_type === "other",
                  ).length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase">
                        Lainnya
                      </p>
                      {displayInvoice.items
                        .filter((item) => item.item_type === "other")
                        .map((item, index) => (
                          <div
                            key={`other-${index}`}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {item.item_name} x{item.quantity}
                            </span>
                            <span>{formatCurrency(item.total_price)}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {(!displayInvoice.items ||
                    displayInvoice.items.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Tidak ada item
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Diskon</span>
                <span>-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(invoice.total_amount)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih metode" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center gap-2">
                      <method.icon className="h-4 w-4" />
                      {method.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label>Jumlah Bayar</Label>
            <Input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              placeholder="Masukkan jumlah"
            />
            {/* Quick amounts */}
            <div className="flex flex-wrap gap-2">
              {QUICK_AMOUNTS.filter((a) => a >= invoice.total_amount).map(
                (amount) => (
                  <Button
                    key={amount}
                    type="button"
                    size="sm"
                    variant={paid === amount ? "default" : "outline"}
                    onClick={() => setPaidAmount(amount.toString())}
                  >
                    {formatCurrency(amount)}
                  </Button>
                ),
              )}
              <Button
                type="button"
                size="sm"
                variant={paid === invoice.total_amount ? "default" : "outline"}
                onClick={() => setPaidAmount(invoice.total_amount.toString())}
              >
                Uang Pas
              </Button>
            </div>
          </div>

          {/* Change */}
          {change >= 0 && paid > 0 && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Kembalian</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(change)}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Catatan (Opsional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || paid < invoice.total_amount}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Proses Pembayaran
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
