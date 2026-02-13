"use client";

import { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import type { Invoice } from "@/types/medical-record";
import { useClinicSettings } from "@/providers/clinic-settings-provider";

interface ReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: Invoice | null;
}

export function ReceiptModal({
  open,
  onOpenChange,
  invoice,
}: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { settings } = useClinicSettings();

  if (!invoice) return null;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle print
  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "", "width=900,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${invoice.invoice_number}</title>
          <style>
            @page {
              size: A4;
              margin: 15mm;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #333;
              background: white;
            }
            .invoice-container {
              max-width: 210mm;
              margin: 0 auto;
              padding: 20px;
            }
            /* Header */
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 20px;
              border-bottom: 3px solid #2563eb;
              margin-bottom: 25px;
            }
            .clinic-info {
              flex: 1;
            }
            .clinic-name {
              font-size: 24pt;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 5px;
            }
            .clinic-details {
              font-size: 10pt;
              color: #666;
            }
            .clinic-details p {
              margin: 2px 0;
            }
            .invoice-title-box {
              text-align: right;
            }
            .invoice-title {
              font-size: 28pt;
              font-weight: bold;
              color: #1e40af;
              letter-spacing: 2px;
            }
            .invoice-number {
              font-size: 12pt;
              color: #666;
              margin-top: 5px;
            }
            .invoice-status {
              display: inline-block;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 10pt;
              font-weight: bold;
              margin-top: 10px;
            }
            .status-paid {
              background: #dcfce7;
              color: #166534;
            }
            .status-unpaid {
              background: #fef2f2;
              color: #991b1b;
            }
            /* Info Boxes */
            .info-row {
              display: flex;
              justify-content: space-between;
              gap: 30px;
              margin-bottom: 25px;
            }
            .info-box {
              flex: 1;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 15px;
            }
            .info-box-title {
              font-size: 9pt;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 600;
              margin-bottom: 10px;
              letter-spacing: 1px;
            }
            .info-box-content p {
              margin: 3px 0;
              font-size: 10pt;
            }
            .info-box-content .primary {
              font-size: 12pt;
              font-weight: 600;
              color: #1e293b;
            }
            /* Table */
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            .items-table thead {
              background: #1e40af;
              color: white;
            }
            .items-table th {
              padding: 12px 15px;
              text-align: left;
              font-size: 10pt;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .items-table th:last-child,
            .items-table th:nth-child(3),
            .items-table th:nth-child(4) {
              text-align: right;
            }
            .items-table tbody tr {
              border-bottom: 1px solid #e2e8f0;
            }
            .items-table tbody tr:nth-child(even) {
              background: #f8fafc;
            }
            .items-table td {
              padding: 12px 15px;
              font-size: 10pt;
            }
            .items-table td:last-child,
            .items-table td:nth-child(3),
            .items-table td:nth-child(4) {
              text-align: right;
            }
            .item-type {
              font-size: 8pt;
              color: #64748b;
              text-transform: capitalize;
            }
            /* Summary */
            .summary-section {
              display: flex;
              justify-content: flex-end;
            }
            .summary-box {
              width: 320px;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 10pt;
            }
            .summary-row.subtotal {
              border-bottom: 1px solid #e2e8f0;
            }
            .summary-row.discount {
              color: #dc2626;
            }
            .summary-row.total {
              font-size: 14pt;
              font-weight: bold;
              color: #1e40af;
              border-top: 2px solid #1e40af;
              margin-top: 10px;
              padding-top: 15px;
            }
            .summary-row.payment {
              background: #f0fdf4;
              padding: 8px 12px;
              border-radius: 5px;
              margin-top: 5px;
            }
            .summary-row.change {
              background: #eff6ff;
              padding: 8px 12px;
              border-radius: 5px;
            }
            /* Payment Info */
            .payment-info {
              margin-top: 30px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
              border: 1px solid #e2e8f0;
            }
            .payment-info-title {
              font-size: 10pt;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 10px;
            }
            .payment-info-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
            }
            .payment-info-item label {
              font-size: 8pt;
              color: #64748b;
              text-transform: uppercase;
            }
            .payment-info-item p {
              font-size: 10pt;
              font-weight: 500;
              color: #1e293b;
            }
            /* Footer */
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
            }
            .footer-left {
              font-size: 9pt;
              color: #64748b;
            }
            .footer-left p {
              margin: 3px 0;
            }
            .footer-right {
              text-align: center;
            }
            .signature-line {
              width: 180px;
              border-bottom: 1px solid #333;
              margin: 60px auto 5px;
            }
            .signature-name {
              font-size: 10pt;
              font-weight: 500;
            }
            .signature-title {
              font-size: 9pt;
              color: #64748b;
            }
            /* Thank You */
            .thank-you {
              text-align: center;
              margin-top: 30px;
              padding: 15px;
              background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
              border-radius: 8px;
            }
            .thank-you p {
              font-size: 11pt;
              color: #1e40af;
              font-weight: 500;
            }
            .thank-you .subtitle {
              font-size: 9pt;
              color: #64748b;
              font-weight: normal;
              margin-top: 3px;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const isPaid = invoice.payment_status === "paid";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-xl">Preview Invoice</DialogTitle>
          <Button onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Cetak Invoice
          </Button>
        </DialogHeader>

        {/* Invoice Content - A4 Preview */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <div
            ref={receiptRef}
            className="bg-white shadow-lg mx-auto"
            style={{
              width: "210mm",
              minHeight: "297mm",
              padding: "15mm",
              transform: "scale(0.7)",
              transformOrigin: "top center",
              marginBottom: "-30%",
            }}
          >
            <div className="invoice-container">
              {/* Header */}
              <div
                className="header"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: "20px",
                  borderBottom: "3px solid #2563eb",
                  marginBottom: "25px",
                }}
              >
                <div className="clinic-info" style={{ flex: 1 }}>
                  <div
                    className="clinic-name"
                    style={{
                      fontSize: "24pt",
                      fontWeight: "bold",
                      color: "#1e40af",
                      marginBottom: "5px",
                    }}
                  >
                    {settings?.name || "KLINIK"}
                  </div>
                  <div
                    className="clinic-details"
                    style={{ fontSize: "10pt", color: "#666" }}
                  >
                    <p>{settings?.address || "-"}</p>
                    <p>
                      Telp: {settings?.phone || "-"} | Email:{" "}
                      {settings?.email || "-"}
                    </p>
                  </div>
                </div>
                <div
                  className="invoice-title-box"
                  style={{ textAlign: "right" }}
                >
                  <div
                    className="invoice-title"
                    style={{
                      fontSize: "28pt",
                      fontWeight: "bold",
                      color: "#1e40af",
                      letterSpacing: "2px",
                    }}
                  >
                    INVOICE
                  </div>
                  <div
                    className="invoice-number"
                    style={{
                      fontSize: "12pt",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    {invoice.invoice_number}
                  </div>
                  <div
                    className={`invoice-status ${isPaid ? "status-paid" : "status-unpaid"}`}
                    style={{
                      display: "inline-block",
                      padding: "5px 15px",
                      borderRadius: "20px",
                      fontSize: "10pt",
                      fontWeight: "bold",
                      marginTop: "10px",
                      background: isPaid ? "#dcfce7" : "#fef2f2",
                      color: isPaid ? "#166534" : "#991b1b",
                    }}
                  >
                    {isPaid ? "LUNAS" : "BELUM LUNAS"}
                  </div>
                </div>
              </div>

              {/* Info Boxes */}
              <div
                className="info-row"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "30px",
                  marginBottom: "25px",
                }}
              >
                <div
                  className="info-box"
                  style={{
                    flex: 1,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "15px",
                  }}
                >
                  <div
                    className="info-box-title"
                    style={{
                      fontSize: "9pt",
                      textTransform: "uppercase",
                      color: "#64748b",
                      fontWeight: 600,
                      marginBottom: "10px",
                      letterSpacing: "1px",
                    }}
                  >
                    Data Pasien
                  </div>
                  <div className="info-box-content">
                    <p
                      className="primary"
                      style={{
                        fontSize: "12pt",
                        fontWeight: 600,
                        color: "#1e293b",
                      }}
                    >
                      {invoice.patient?.name || "-"}
                    </p>
                    <p style={{ margin: "3px 0", fontSize: "10pt" }}>
                      No. RM: {invoice.patient?.medical_record_number || "-"}
                    </p>
                    <p style={{ margin: "3px 0", fontSize: "10pt" }}>
                      Alamat: {invoice.patient?.address || "-"}
                    </p>
                  </div>
                </div>
                <div
                  className="info-box"
                  style={{
                    flex: 1,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "15px",
                  }}
                >
                  <div
                    className="info-box-title"
                    style={{
                      fontSize: "9pt",
                      textTransform: "uppercase",
                      color: "#64748b",
                      fontWeight: 600,
                      marginBottom: "10px",
                      letterSpacing: "1px",
                    }}
                  >
                    Detail Invoice
                  </div>
                  <div className="info-box-content">
                    <p style={{ margin: "3px 0", fontSize: "10pt" }}>
                      Tanggal: {formatDate(invoice.created_at)}
                    </p>
                    <p style={{ margin: "3px 0", fontSize: "10pt" }}>
                      Poli: {invoice.medical_record?.department?.name || "-"}
                    </p>
                    <p style={{ margin: "3px 0", fontSize: "10pt" }}>
                      Dokter: {invoice.medical_record?.doctor?.name || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table
                className="items-table"
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginBottom: "25px",
                }}
              >
                <thead>
                  <tr style={{ background: "#1e40af", color: "white" }}>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "left",
                        fontSize: "10pt",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      No
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "left",
                        fontSize: "10pt",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Deskripsi Layanan
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "right",
                        fontSize: "10pt",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Qty
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "right",
                        fontSize: "10pt",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Harga Satuan
                    </th>
                    <th
                      style={{
                        padding: "12px 15px",
                        textAlign: "right",
                        fontSize: "10pt",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items?.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: "1px solid #e2e8f0",
                        background: index % 2 === 1 ? "#f8fafc" : "white",
                      }}
                    >
                      <td style={{ padding: "12px 15px", fontSize: "10pt" }}>
                        {index + 1}
                      </td>
                      <td style={{ padding: "12px 15px", fontSize: "10pt" }}>
                        <div>{item.item_name}</div>
                        <div
                          className="item-type"
                          style={{
                            fontSize: "8pt",
                            color: "#64748b",
                            textTransform: "capitalize",
                          }}
                        >
                          {item.item_type}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "10pt",
                          textAlign: "right",
                        }}
                      >
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "10pt",
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: "10pt",
                          textAlign: "right",
                        }}
                      >
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                  {/* Empty rows for minimum height */}
                  {(invoice.items?.length || 0) < 5 &&
                    Array.from({
                      length: 5 - (invoice.items?.length || 0),
                    }).map((_, i) => (
                      <tr
                        key={`empty-${i}`}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td style={{ padding: "12px 15px", fontSize: "10pt" }}>
                          &nbsp;
                        </td>
                        <td
                          style={{ padding: "12px 15px", fontSize: "10pt" }}
                        ></td>
                        <td
                          style={{ padding: "12px 15px", fontSize: "10pt" }}
                        ></td>
                        <td
                          style={{ padding: "12px 15px", fontSize: "10pt" }}
                        ></td>
                        <td
                          style={{ padding: "12px 15px", fontSize: "10pt" }}
                        ></td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {/* Summary Section */}
              <div
                className="summary-section"
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <div className="summary-box" style={{ width: "320px" }}>
                  <div
                    className="summary-row subtotal"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      fontSize: "10pt",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <span>Subtotal</span>
                    <span>{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discount_amount > 0 && (
                    <div
                      className="summary-row discount"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        fontSize: "10pt",
                        color: "#dc2626",
                      }}
                    >
                      <span>
                        Diskon{" "}
                        {invoice.discount_percent > 0
                          ? `(${invoice.discount_percent}%)`
                          : ""}
                      </span>
                      <span>- {formatCurrency(invoice.discount_amount)}</span>
                    </div>
                  )}
                  <div
                    className="summary-row total"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "14pt",
                      fontWeight: "bold",
                      color: "#1e40af",
                      borderTop: "2px solid #1e40af",
                      marginTop: "10px",
                      paddingTop: "15px",
                    }}
                  >
                    <span>TOTAL</span>
                    <span>{formatCurrency(invoice.total_amount)}</span>
                  </div>
                  {isPaid && (
                    <>
                      <div
                        className="summary-row payment"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          fontSize: "10pt",
                          background: "#f0fdf4",
                          borderRadius: "5px",
                          marginTop: "5px",
                        }}
                      >
                        <span>Bayar ({invoice.payment_method_label})</span>
                        <span>{formatCurrency(invoice.paid_amount)}</span>
                      </div>
                      <div
                        className="summary-row change"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 12px",
                          fontSize: "10pt",
                          background: "#eff6ff",
                          borderRadius: "5px",
                        }}
                      >
                        <span>Kembali</span>
                        <span>{formatCurrency(invoice.change_amount)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              {isPaid && (
                <div
                  className="payment-info"
                  style={{
                    marginTop: "30px",
                    padding: "20px",
                    background: "#f8fafc",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <div
                    className="payment-info-title"
                    style={{
                      fontSize: "10pt",
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: "10px",
                    }}
                  >
                    Informasi Pembayaran
                  </div>
                  <div
                    className="payment-info-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "20px",
                    }}
                  >
                    <div className="payment-info-item">
                      <label
                        style={{
                          fontSize: "8pt",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Metode Pembayaran
                      </label>
                      <p
                        style={{
                          fontSize: "10pt",
                          fontWeight: 500,
                          color: "#1e293b",
                        }}
                      >
                        {invoice.payment_method_label}
                      </p>
                    </div>
                    <div className="payment-info-item">
                      <label
                        style={{
                          fontSize: "8pt",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Tanggal Bayar
                      </label>
                      <p
                        style={{
                          fontSize: "10pt",
                          fontWeight: 500,
                          color: "#1e293b",
                        }}
                      >
                        {invoice.payment_date
                          ? formatDate(invoice.payment_date)
                          : "-"}
                      </p>
                    </div>
                    <div className="payment-info-item">
                      <label
                        style={{
                          fontSize: "8pt",
                          color: "#64748b",
                          textTransform: "uppercase",
                        }}
                      >
                        Kasir
                      </label>
                      <p
                        style={{
                          fontSize: "10pt",
                          fontWeight: 500,
                          color: "#1e293b",
                        }}
                      >
                        {invoice.cashier?.name || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                className="footer"
                style={{
                  marginTop: "40px",
                  paddingTop: "20px",
                  borderTop: "1px solid #e2e8f0",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div
                  className="footer-left"
                  style={{ fontSize: "9pt", color: "#64748b" }}
                >
                  <p>
                    Dicetak pada: {formatDate(new Date().toISOString())}{" "}
                    {formatTime(new Date().toISOString())}
                  </p>
                  <p>Invoice ini sah tanpa tanda tangan basah</p>
                </div>
                <div className="footer-right" style={{ textAlign: "center" }}>
                  <div
                    className="signature-line"
                    style={{
                      width: "180px",
                      borderBottom: "1px solid #333",
                      margin: "60px auto 5px",
                    }}
                  ></div>
                  <div
                    className="signature-name"
                    style={{ fontSize: "10pt", fontWeight: 500 }}
                  >
                    {invoice.cashier?.name || "_______________"}
                  </div>
                  <div
                    className="signature-title"
                    style={{ fontSize: "9pt", color: "#64748b" }}
                  >
                    Petugas Kasir
                  </div>
                </div>
              </div>

              {/* Thank You */}
              <div
                className="thank-you"
                style={{
                  textAlign: "center",
                  marginTop: "30px",
                  padding: "15px",
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  borderRadius: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "11pt",
                    color: "#1e40af",
                    fontWeight: 500,
                  }}
                >
                  Terima kasih atas kepercayaan Anda
                </p>
                <p
                  className="subtitle"
                  style={{
                    fontSize: "9pt",
                    color: "#64748b",
                    fontWeight: "normal",
                    marginTop: "3px",
                  }}
                >
                  Semoga lekas sembuh - {settings?.name || "Klinik"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
