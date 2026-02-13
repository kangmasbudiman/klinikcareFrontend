module.exports=[90285,8033,13328,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(14574),e=a.i(99570),f=a.i(66718),g=a.i(70430),h=a.i(80701),i=a.i(29246),j=a.i(5084),k=a.i(96221),l=a.i(66322),m=a.i(11156),n=a.i(67900),o=a.i(76472),p=a.i(3314),q=a.i(3858),r=a.i(41572),s=a.i(23292);let t=[{value:"cash",label:"Tunai",icon:l.Banknote},{value:"card",label:"Kartu Debit/Kredit",icon:m.CreditCard},{value:"transfer",label:"Transfer Bank",icon:n.Building2},{value:"bpjs",label:"BPJS",icon:o.Heart},{value:"insurance",label:"Asuransi",icon:p.Shield}],u=[5e4,1e5,15e4,2e5,25e4,3e5,5e5];function v({open:a,onOpenChange:l,invoice:m,onSuccess:n}){let[o,p]=(0,c.useState)(!1),[v,w]=(0,c.useState)(!1),[x,y]=(0,c.useState)(null),[z,A]=(0,c.useState)("cash"),[B,C]=(0,c.useState)(""),[D,E]=(0,c.useState)("");if((0,c.useEffect)(()=>{(async()=>{if(a&&m?.id){w(!0);try{let a=await r.default.getInvoiceById(m.id);y(a.data)}catch(a){console.error("Error fetching invoice details:",a),y(m)}finally{w(!1)}}})()},[a,m?.id]),(0,c.useEffect)(()=>{m&&(C(m.total_amount.toString()),A("cash"),E(""))},[m]),!m)return null;let F=x||m,G=parseFloat(B)||0,H=G-m.total_amount,I=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),J=async()=>{if(G<m.total_amount)return void s.toast.warning("Jumlah pembayaran kurang dari total tagihan",{description:`Total tagihan: ${I(m.total_amount)}`});p(!0);try{let a=await r.default.payInvoice(m.id,{paid_amount:G,payment_method:z,notes:D||void 0});s.toast.success("Pembayaran berhasil diproses",{description:`Invoice ${m.invoice_number} telah lunas`}),n(a.data)}catch(a){console.error("Error processing payment:",a),s.toast.error("Gagal memproses pembayaran",{description:a.response?.data?.message||"Terjadi kesalahan"})}finally{p(!1)}};return(0,b.jsx)(d.Dialog,{open:a,onOpenChange:l,children:(0,b.jsxs)(d.DialogContent,{className:"sm:max-w-[500px]",children:[(0,b.jsxs)(d.DialogHeader,{children:[(0,b.jsx)(d.DialogTitle,{children:"Pembayaran"}),(0,b.jsxs)(d.DialogDescription,{children:["Invoice: ",m.invoice_number]})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"p-3 rounded-lg bg-muted",children:[(0,b.jsx)("p",{className:"font-semibold",children:F.patient?.name}),(0,b.jsxs)("p",{className:"text-sm text-muted-foreground",children:[F.patient?.medical_record_number," -"," ",F.medical_record?.department?.name]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(g.Label,{children:"Rincian Tagihan"}),(0,b.jsx)("div",{className:"border rounded-lg p-3 space-y-3 max-h-[200px] overflow-y-auto",children:v?(0,b.jsxs)("div",{className:"flex items-center justify-center py-4",children:[(0,b.jsx)(k.Loader2,{className:"h-5 w-5 animate-spin text-muted-foreground"}),(0,b.jsx)("span",{className:"ml-2 text-sm text-muted-foreground",children:"Memuat rincian..."})]}):(0,b.jsxs)(b.Fragment,{children:[F.items?.filter(a=>"service"===a.item_type).length>0&&(0,b.jsxs)("div",{className:"space-y-1",children:[(0,b.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase",children:"Layanan"}),F.items.filter(a=>"service"===a.item_type).map((a,c)=>(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsxs)("span",{children:[a.item_name," x",a.quantity]}),(0,b.jsx)("span",{children:I(a.total_price)})]},`service-${c}`))]}),F.items?.filter(a=>"medicine"===a.item_type).length>0&&(0,b.jsxs)("div",{className:"space-y-1",children:[(0,b.jsxs)("p",{className:"text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1",children:[(0,b.jsx)(q.Pill,{className:"h-3 w-3"}),"Obat"]}),F.items.filter(a=>"medicine"===a.item_type).map((a,c)=>(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsxs)("span",{children:[a.item_name," x",a.quantity]}),(0,b.jsx)("span",{children:I(a.total_price)})]},`medicine-${c}`))]}),F.items?.filter(a=>"other"===a.item_type).length>0&&(0,b.jsxs)("div",{className:"space-y-1",children:[(0,b.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase",children:"Lainnya"}),F.items.filter(a=>"other"===a.item_type).map((a,c)=>(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsxs)("span",{children:[a.item_name," x",a.quantity]}),(0,b.jsx)("span",{children:I(a.total_price)})]},`other-${c}`))]}),(!F.items||0===F.items.length)&&(0,b.jsx)("p",{className:"text-sm text-muted-foreground text-center py-2",children:"Tidak ada item"})]})})]}),(0,b.jsxs)("div",{className:"space-y-1",children:[(0,b.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,b.jsx)("span",{children:"Subtotal"}),(0,b.jsx)("span",{children:I(m.subtotal)})]}),m.discount_amount>0&&(0,b.jsxs)("div",{className:"flex justify-between text-sm text-green-600",children:[(0,b.jsx)("span",{children:"Diskon"}),(0,b.jsxs)("span",{children:["-",I(m.discount_amount)]})]}),(0,b.jsx)(j.Separator,{}),(0,b.jsxs)("div",{className:"flex justify-between font-bold text-lg",children:[(0,b.jsx)("span",{children:"Total"}),(0,b.jsx)("span",{children:I(m.total_amount)})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(g.Label,{children:"Metode Pembayaran"}),(0,b.jsxs)(h.Select,{value:z,onValueChange:a=>A(a),children:[(0,b.jsx)(h.SelectTrigger,{children:(0,b.jsx)(h.SelectValue,{placeholder:"Pilih metode"})}),(0,b.jsx)(h.SelectContent,{children:t.map(a=>(0,b.jsx)(h.SelectItem,{value:a.value,children:(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(a.icon,{className:"h-4 w-4"}),a.label]})},a.value))})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(g.Label,{children:"Jumlah Bayar"}),(0,b.jsx)(f.Input,{type:"number",value:B,onChange:a=>C(a.target.value),placeholder:"Masukkan jumlah"}),(0,b.jsxs)("div",{className:"flex flex-wrap gap-2",children:[u.filter(a=>a>=m.total_amount).map(a=>(0,b.jsx)(e.Button,{type:"button",size:"sm",variant:G===a?"default":"outline",onClick:()=>C(a.toString()),children:I(a)},a)),(0,b.jsx)(e.Button,{type:"button",size:"sm",variant:G===m.total_amount?"default":"outline",onClick:()=>C(m.total_amount.toString()),children:"Uang Pas"})]})]}),H>=0&&G>0&&(0,b.jsx)("div",{className:"p-3 rounded-lg bg-green-50 dark:bg-green-950/30",children:(0,b.jsxs)("div",{className:"flex justify-between items-center",children:[(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"Kembalian"}),(0,b.jsx)("span",{className:"text-xl font-bold text-green-600",children:I(H)})]})}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(g.Label,{children:"Catatan (Opsional)"}),(0,b.jsx)(i.Textarea,{value:D,onChange:a=>E(a.target.value),placeholder:"Catatan tambahan...",rows:2})]})]}),(0,b.jsxs)(d.DialogFooter,{children:[(0,b.jsx)(e.Button,{variant:"outline",onClick:()=>l(!1),disabled:o,children:"Batal"}),(0,b.jsxs)(e.Button,{onClick:J,disabled:o||G<m.total_amount,children:[o&&(0,b.jsx)(k.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),"Proses Pembayaran"]})]})]})})}a.s(["PaymentModal",()=>v],8033);var w=a.i(71931),x=a.i(82835);function y({open:a,onOpenChange:f,invoice:g}){let h=(0,c.useRef)(null),{settings:i}=(0,x.useClinicSettings)();if(!g)return null;let j=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),k=a=>new Date(a).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"}),l="paid"===g.payment_status;return(0,b.jsx)(d.Dialog,{open:a,onOpenChange:f,children:(0,b.jsxs)(d.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)(d.DialogHeader,{className:"flex flex-row items-center justify-between border-b pb-4",children:[(0,b.jsx)(d.DialogTitle,{className:"text-xl",children:"Preview Invoice"}),(0,b.jsxs)(e.Button,{onClick:()=>{let a=h.current;if(!a)return;let b=window.open("","","width=900,height=700");b&&(b.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${g.invoice_number}</title>
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
          ${a.innerHTML}
        </body>
      </html>
    `),b.document.close(),b.focus(),setTimeout(()=>{b.print(),b.close()},250))},className:"gap-2",children:[(0,b.jsx)(w.Printer,{className:"h-4 w-4"}),"Cetak Invoice"]})]}),(0,b.jsx)("div",{className:"bg-gray-100 p-4 rounded-lg",children:(0,b.jsx)("div",{ref:h,className:"bg-white shadow-lg mx-auto",style:{width:"210mm",minHeight:"297mm",padding:"15mm",transform:"scale(0.7)",transformOrigin:"top center",marginBottom:"-30%"},children:(0,b.jsxs)("div",{className:"invoice-container",children:[(0,b.jsxs)("div",{className:"header",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:"20px",borderBottom:"3px solid #2563eb",marginBottom:"25px"},children:[(0,b.jsxs)("div",{className:"clinic-info",style:{flex:1},children:[(0,b.jsx)("div",{className:"clinic-name",style:{fontSize:"24pt",fontWeight:"bold",color:"#1e40af",marginBottom:"5px"},children:i?.name||"KLINIK"}),(0,b.jsxs)("div",{className:"clinic-details",style:{fontSize:"10pt",color:"#666"},children:[(0,b.jsx)("p",{children:i?.address||"-"}),(0,b.jsxs)("p",{children:["Telp: ",i?.phone||"-"," | Email:"," ",i?.email||"-"]})]})]}),(0,b.jsxs)("div",{className:"invoice-title-box",style:{textAlign:"right"},children:[(0,b.jsx)("div",{className:"invoice-title",style:{fontSize:"28pt",fontWeight:"bold",color:"#1e40af",letterSpacing:"2px"},children:"INVOICE"}),(0,b.jsx)("div",{className:"invoice-number",style:{fontSize:"12pt",color:"#666",marginTop:"5px"},children:g.invoice_number}),(0,b.jsx)("div",{className:`invoice-status ${l?"status-paid":"status-unpaid"}`,style:{display:"inline-block",padding:"5px 15px",borderRadius:"20px",fontSize:"10pt",fontWeight:"bold",marginTop:"10px",background:l?"#dcfce7":"#fef2f2",color:l?"#166534":"#991b1b"},children:l?"LUNAS":"BELUM LUNAS"})]})]}),(0,b.jsxs)("div",{className:"info-row",style:{display:"flex",justifyContent:"space-between",gap:"30px",marginBottom:"25px"},children:[(0,b.jsxs)("div",{className:"info-box",style:{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"15px"},children:[(0,b.jsx)("div",{className:"info-box-title",style:{fontSize:"9pt",textTransform:"uppercase",color:"#64748b",fontWeight:600,marginBottom:"10px",letterSpacing:"1px"},children:"Data Pasien"}),(0,b.jsxs)("div",{className:"info-box-content",children:[(0,b.jsx)("p",{className:"primary",style:{fontSize:"12pt",fontWeight:600,color:"#1e293b"},children:g.patient?.name||"-"}),(0,b.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["No. RM: ",g.patient?.medical_record_number||"-"]}),(0,b.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Alamat: ",g.patient?.address||"-"]})]})]}),(0,b.jsxs)("div",{className:"info-box",style:{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"15px"},children:[(0,b.jsx)("div",{className:"info-box-title",style:{fontSize:"9pt",textTransform:"uppercase",color:"#64748b",fontWeight:600,marginBottom:"10px",letterSpacing:"1px"},children:"Detail Invoice"}),(0,b.jsxs)("div",{className:"info-box-content",children:[(0,b.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Tanggal: ",k(g.created_at)]}),(0,b.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Poli: ",g.medical_record?.department?.name||"-"]}),(0,b.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Dokter: ",g.medical_record?.doctor?.name||"-"]})]})]})]}),(0,b.jsxs)("table",{className:"items-table",style:{width:"100%",borderCollapse:"collapse",marginBottom:"25px"},children:[(0,b.jsx)("thead",{children:(0,b.jsxs)("tr",{style:{background:"#1e40af",color:"white"},children:[(0,b.jsx)("th",{style:{padding:"12px 15px",textAlign:"left",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"No"}),(0,b.jsx)("th",{style:{padding:"12px 15px",textAlign:"left",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Deskripsi Layanan"}),(0,b.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Qty"}),(0,b.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Harga Satuan"}),(0,b.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Jumlah"})]})}),(0,b.jsxs)("tbody",{children:[g.items?.map((a,c)=>(0,b.jsxs)("tr",{style:{borderBottom:"1px solid #e2e8f0",background:c%2==1?"#f8fafc":"white"},children:[(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:c+1}),(0,b.jsxs)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:[(0,b.jsx)("div",{children:a.item_name}),(0,b.jsx)("div",{className:"item-type",style:{fontSize:"8pt",color:"#64748b",textTransform:"capitalize"},children:a.item_type})]}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:a.quantity}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:j(a.unit_price)}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:j(a.total_price)})]},c)),5>(g.items?.length||0)&&Array.from({length:5-(g.items?.length||0)}).map((a,c)=>(0,b.jsxs)("tr",{style:{borderBottom:"1px solid #e2e8f0"},children:[(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:" "}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,b.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}})]},`empty-${c}`))]})]}),(0,b.jsx)("div",{className:"summary-section",style:{display:"flex",justifyContent:"flex-end"},children:(0,b.jsxs)("div",{className:"summary-box",style:{width:"320px"},children:[(0,b.jsxs)("div",{className:"summary-row subtotal",style:{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"10pt",borderBottom:"1px solid #e2e8f0"},children:[(0,b.jsx)("span",{children:"Subtotal"}),(0,b.jsx)("span",{children:j(g.subtotal)})]}),g.discount_amount>0&&(0,b.jsxs)("div",{className:"summary-row discount",style:{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"10pt",color:"#dc2626"},children:[(0,b.jsxs)("span",{children:["Diskon"," ",g.discount_percent>0?`(${g.discount_percent}%)`:""]}),(0,b.jsxs)("span",{children:["- ",j(g.discount_amount)]})]}),(0,b.jsxs)("div",{className:"summary-row total",style:{display:"flex",justifyContent:"space-between",fontSize:"14pt",fontWeight:"bold",color:"#1e40af",borderTop:"2px solid #1e40af",marginTop:"10px",paddingTop:"15px"},children:[(0,b.jsx)("span",{children:"TOTAL"}),(0,b.jsx)("span",{children:j(g.total_amount)})]}),l&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)("div",{className:"summary-row payment",style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",fontSize:"10pt",background:"#f0fdf4",borderRadius:"5px",marginTop:"5px"},children:[(0,b.jsxs)("span",{children:["Bayar (",g.payment_method_label,")"]}),(0,b.jsx)("span",{children:j(g.paid_amount)})]}),(0,b.jsxs)("div",{className:"summary-row change",style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",fontSize:"10pt",background:"#eff6ff",borderRadius:"5px"},children:[(0,b.jsx)("span",{children:"Kembali"}),(0,b.jsx)("span",{children:j(g.change_amount)})]})]})]})}),l&&(0,b.jsxs)("div",{className:"payment-info",style:{marginTop:"30px",padding:"20px",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[(0,b.jsx)("div",{className:"payment-info-title",style:{fontSize:"10pt",fontWeight:600,color:"#1e293b",marginBottom:"10px"},children:"Informasi Pembayaran"}),(0,b.jsxs)("div",{className:"payment-info-grid",style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"20px"},children:[(0,b.jsxs)("div",{className:"payment-info-item",children:[(0,b.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Metode Pembayaran"}),(0,b.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:g.payment_method_label})]}),(0,b.jsxs)("div",{className:"payment-info-item",children:[(0,b.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Tanggal Bayar"}),(0,b.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:g.payment_date?k(g.payment_date):"-"})]}),(0,b.jsxs)("div",{className:"payment-info-item",children:[(0,b.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Kasir"}),(0,b.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:g.cashier?.name||"-"})]})]})]}),(0,b.jsxs)("div",{className:"footer",style:{marginTop:"40px",paddingTop:"20px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between"},children:[(0,b.jsxs)("div",{className:"footer-left",style:{fontSize:"9pt",color:"#64748b"},children:[(0,b.jsxs)("p",{children:["Dicetak pada: ",k(new Date().toISOString())," ",new Date(new Date().toISOString()).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})]}),(0,b.jsx)("p",{children:"Invoice ini sah tanpa tanda tangan basah"})]}),(0,b.jsxs)("div",{className:"footer-right",style:{textAlign:"center"},children:[(0,b.jsx)("div",{className:"signature-line",style:{width:"180px",borderBottom:"1px solid #333",margin:"60px auto 5px"}}),(0,b.jsx)("div",{className:"signature-name",style:{fontSize:"10pt",fontWeight:500},children:g.cashier?.name||"_______________"}),(0,b.jsx)("div",{className:"signature-title",style:{fontSize:"9pt",color:"#64748b"},children:"Petugas Kasir"})]})]}),(0,b.jsxs)("div",{className:"thank-you",style:{textAlign:"center",marginTop:"30px",padding:"15px",background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",borderRadius:"8px"},children:[(0,b.jsx)("p",{style:{fontSize:"11pt",color:"#1e40af",fontWeight:500},children:"Terima kasih atas kepercayaan Anda"}),(0,b.jsxs)("p",{className:"subtitle",style:{fontSize:"9pt",color:"#64748b",fontWeight:"normal",marginTop:"3px"},children:["Semoga lekas sembuh - ",i?.name||"Klinik"]})]})]})})})]})})}a.s(["ReceiptModal",()=>y],13328),a.s([],90285)}];

//# sourceMappingURL=src_components_cashier_index_ts_27f660b5._.js.map