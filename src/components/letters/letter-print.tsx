import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { MedicalLetter } from "@/types/medical-letter";
import { LETTER_TYPE_LABELS } from "@/types/medical-letter";
import { toast } from "sonner";

interface ClinicInfo {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logo_url?: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: localeId });
  } catch {
    return dateStr;
  }
}

function getLetterBody(letter: MedicalLetter): string {
  const patientName = letter.patient?.name || "-";
  const patientBirthDate = letter.patient?.birth_date
    ? formatDate(letter.patient.birth_date)
    : "-";
  const patientGender =
    letter.patient?.gender === "male" ? "Laki-laki" : "Perempuan";
  const patientAddress = letter.patient?.address || "-";
  const patientMrn = letter.patient?.medical_record_number || "-";
  const patientNik = letter.patient?.nik || "-";

  const patientInfo = `
    <table class="patient-info">
      <tr><td class="label-col">Nama</td><td>: ${patientName}</td></tr>
      <tr><td class="label-col">NIK</td><td>: ${patientNik}</td></tr>
      <tr><td class="label-col">Tanggal Lahir</td><td>: ${patientBirthDate}</td></tr>
      <tr><td class="label-col">Jenis Kelamin</td><td>: ${patientGender}</td></tr>
      <tr><td class="label-col">Alamat</td><td>: ${patientAddress}</td></tr>
      <tr><td class="label-col">No. Rekam Medis</td><td>: ${patientMrn}</td></tr>
    </table>
  `;

  switch (letter.letter_type) {
    case "surat_sehat":
      return `
        <p>Yang bertanda tangan di bawah ini, dokter yang memeriksa pada ${letter.doctor?.name || "-"}, menerangkan bahwa:</p>
        ${patientInfo}
        <p>Setelah dilakukan pemeriksaan kesehatan${letter.examination_result ? ":" : ", yang bersangkutan dinyatakan dalam keadaan <strong>SEHAT</strong>."}</p>
        ${letter.examination_result ? `<p class="indent">${letter.examination_result}</p><p>Berdasarkan hasil pemeriksaan di atas, yang bersangkutan dinyatakan dalam keadaan <strong>SEHAT</strong>.</p>` : ""}
        ${letter.health_purpose ? `<p>Surat keterangan ini dibuat untuk keperluan <strong>${letter.health_purpose}</strong>.</p>` : ""}
      `;

    case "surat_sakit":
      return `
        <p>Yang bertanda tangan di bawah ini, dokter yang memeriksa pada ${letter.doctor?.name || "-"}, menerangkan bahwa:</p>
        ${patientInfo}
        <p>Berdasarkan hasil pemeriksaan, yang bersangkutan perlu istirahat karena sakit selama <strong>${letter.sick_days || "-"} (${numberToWords(letter.sick_days || 0)}) hari</strong>, terhitung mulai tanggal <strong>${formatDate(letter.sick_start_date)}</strong> sampai dengan <strong>${formatDate(letter.sick_end_date)}</strong>.</p>
        ${letter.purpose ? `<p>Keterangan: ${letter.purpose}</p>` : ""}
      `;

    case "surat_rujukan":
      return `
        <p>Yang bertanda tangan di bawah ini, dokter yang memeriksa pada ${letter.doctor?.name || "-"}, dengan ini merujuk pasien:</p>
        ${patientInfo}
        ${letter.referral_destination ? `<p><strong>Dirujuk ke:</strong> ${letter.referral_destination}${letter.referral_specialist ? ` (${letter.referral_specialist})` : ""}</p>` : ""}
        ${letter.diagnosis_summary ? `<p><strong>Diagnosis/Keluhan:</strong><br/>${letter.diagnosis_summary}</p>` : ""}
        ${letter.treatment_summary ? `<p><strong>Tindakan yang telah dilakukan:</strong><br/>${letter.treatment_summary}</p>` : ""}
        ${letter.referral_reason ? `<p><strong>Alasan Rujukan:</strong><br/>${letter.referral_reason}</p>` : ""}
        <p>Mohon pemeriksaan dan penanganan lebih lanjut. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.</p>
      `;

    case "surat_keterangan":
      return `
        <p>Yang bertanda tangan di bawah ini, dokter yang memeriksa pada ${letter.doctor?.name || "-"}, menerangkan bahwa:</p>
        ${patientInfo}
        ${letter.statement_content ? `<p>${letter.statement_content}</p>` : ""}
        ${letter.purpose ? `<p>Surat keterangan ini dibuat untuk keperluan <strong>${letter.purpose}</strong>.</p>` : ""}
      `;

    default:
      return "";
  }
}

function numberToWords(num: number): string {
  const words = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
    "dua belas",
    "tiga belas",
    "empat belas",
    "lima belas",
  ];
  if (num <= 15) return words[num];
  if (num < 20) return words[num - 10] + " belas";
  if (num < 100)
    return (
      words[Math.floor(num / 10)] +
      " puluh" +
      (num % 10 ? " " + words[num % 10] : "")
    );
  return num.toString();
}

export function printLetter(
  letter: MedicalLetter,
  clinicSettings: ClinicInfo | null,
): void {
  const clinicName = clinicSettings?.name || "Klinik";
  const clinicAddress = clinicSettings?.address || "";
  const clinicPhone = clinicSettings?.phone || "";
  const clinicEmail = clinicSettings?.email || "";
  const clinicLogo = clinicSettings?.logo_url || "";
  const letterTitle = LETTER_TYPE_LABELS[letter.letter_type] || "Surat";

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Popup diblokir. Izinkan popup untuk mencetak.");
    return;
  }

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${letterTitle} - ${letter.letter_number}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.6;
          color: #333;
          padding: 20mm 25mm;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 15px;
          border-bottom: 3px double #333;
          padding-bottom: 10px;
          margin-bottom: 25px;
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
        .clinic-info { flex: 1; text-align: center; }
        .clinic-name {
          font-size: 18pt;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .clinic-address { font-size: 10pt; color: #555; }
        .title {
          text-align: center;
          margin: 20px 0;
        }
        .title h1 {
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          text-decoration: underline;
          letter-spacing: 1px;
        }
        .title p {
          font-size: 10pt;
          color: #666;
          margin-top: 3px;
        }
        .body {
          margin: 20px 0;
        }
        .body p {
          text-align: justify;
          margin-bottom: 10px;
          text-indent: 40px;
        }
        .body p:first-child { text-indent: 0; }
        .body p.indent { text-indent: 40px; }
        .patient-info {
          margin: 15px 0 15px 40px;
          border-collapse: collapse;
        }
        .patient-info td {
          padding: 2px 8px 2px 0;
          vertical-align: top;
          font-size: 12pt;
        }
        .patient-info .label-col {
          width: 140px;
          font-weight: normal;
        }
        .closing {
          margin-top: 30px;
          text-align: justify;
        }
        .closing p {
          text-indent: 40px;
          margin-bottom: 10px;
        }
        .signature {
          margin-top: 30px;
          text-align: right;
          padding-right: 30px;
        }
        .signature .date { margin-bottom: 5px; }
        .signature .role { margin-bottom: 60px; }
        .signature .name {
          font-weight: bold;
          text-decoration: underline;
        }
        .notes {
          margin-top: 30px;
          font-size: 9pt;
          color: #888;
          border-top: 1px solid #ddd;
          padding-top: 8px;
        }
        @media print {
          body { padding: 15mm 20mm; }
          @page { margin: 0; size: A4; }
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
            ${clinicPhone ? "Telp: " + clinicPhone : ""}${clinicEmail ? " | Email: " + clinicEmail : ""}
          </div>
        </div>
      </div>

      <div class="title">
        <h1>${letterTitle.toUpperCase()}</h1>
        <p>No: ${letter.letter_number}</p>
      </div>

      <div class="body">
        ${getLetterBody(letter)}
      </div>

      <div class="closing">
        <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
      </div>

      <div class="signature">
        <div class="date">${formatDate(letter.letter_date)}</div>
        <div class="role">Dokter Pemeriksa,</div>
        <div class="name">${letter.doctor?.name || "-"}</div>
      </div>

      ${letter.notes ? `<div class="notes">Catatan: ${letter.notes}</div>` : ""}

      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() { window.close(); };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  toast.success("Menyiapkan halaman cetak...");
}
