module.exports=[4405,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(46271),e=a.i(56711),f=a.i(55258),g=a.i(22658),h=a.i(60178),i=a.i(93901),j=a.i(75750),k=a.i(87532),l=a.i(81464),m=a.i(24722),n=a.i(96221),o=a.i(1199),p=a.i(24669),q=a.i(11156),r=a.i(69520),s=a.i(71931),t=a.i(41675);let u=(0,a.i(70106).default)("Wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);var v=a.i(23292),w=a.i(99570),x=a.i(66718),y=a.i(70430),z=a.i(86304),A=a.i(91119),B=a.i(6015),C=a.i(80701),D=a.i(82524),E=a.i(33140);a.i(90285);var F=a.i(13328),G=a.i(82835),H=a.i(41572),I=a.i(75438);function J(){let{settings:a}=(0,G.useClinicSettings)(),[J,K]=(0,c.useState)([]),[L,M]=(0,c.useState)(null),[N,O]=(0,c.useState)(!0),[P,Q]=(0,c.useState)(!1),[R,S]=(0,c.useState)(!1),[T,U]=(0,c.useState)(1),[V,W]=(0,c.useState)(1),[X,Y]=(0,c.useState)(0),[Z,$]=(0,c.useState)({start_date:(0,e.format)((0,f.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,e.format)((0,g.endOfMonth)(new Date),"yyyy-MM-dd"),payment_status:"",payment_method:"",search:"",page:1,per_page:15}),[_,aa]=(0,c.useState)(!0),[ab,ac]=(0,c.useState)(null),[ad,ae]=(0,c.useState)(!1),af=(0,c.useCallback)(async()=>{O(!0);try{let a=await H.default.getInvoices({start_date:Z.start_date,end_date:Z.end_date,payment_status:Z.payment_status||void 0,payment_method:Z.payment_method||void 0,search:Z.search||void 0,page:Z.page,per_page:Z.per_page});K(a.data),a.meta&&(W(a.meta.last_page),Y(a.meta.total),U(a.meta.current_page))}catch(a){console.error("Error fetching invoices:",a),v.toast.error("Gagal memuat data transaksi")}finally{O(!1)}},[Z]),ag=(0,c.useCallback)(async()=>{try{let a=await H.default.getInvoiceStats({start_date:Z.start_date,end_date:Z.end_date});M(a.data)}catch(a){console.error("Error fetching stats:",a)}},[Z.start_date,Z.end_date]);(0,c.useEffect)(()=>{af(),ag()},[af,ag]);let ah=(a,b)=>{$(c=>({...c,[a]:b,page:1}))},ai=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),aj=async()=>{if(0===J.length)return void v.toast.error("Tidak ada data untuk di-export");Q(!0);try{let a=(await H.default.getInvoices({date:Z.start_date,payment_status:Z.payment_status||void 0,search:Z.search||void 0,page:1,per_page:1e4})).data,b=j.utils.book_new(),c=[["LAPORAN RIWAYAT TRANSAKSI"],[`Periode: ${(0,e.format)((0,h.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:i.id})} - ${(0,e.format)((0,h.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:i.id})}`],[],["RINGKASAN"],["Total Transaksi",L?.total||0],["Sudah Bayar",L?.paid||0],["Belum Bayar",L?.unpaid||0],["Total Pendapatan",L?.total_revenue||0],["Total Belum Dibayar",L?.total_unpaid||0],[],["BREAKDOWN PER METODE PEMBAYARAN"],["Metode","Jumlah Transaksi","Total Nilai"],...L?.payment_by_method.map(a=>[I.PAYMENT_METHOD_LABELS[a.payment_method]||a.payment_method,a.count,a.total])||[]],d=j.utils.aoa_to_sheet(c);j.utils.book_append_sheet(b,d,"Ringkasan");let f=[["DETAIL TRANSAKSI"],[`Periode: ${(0,e.format)((0,h.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:i.id})} - ${(0,e.format)((0,h.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:i.id})}`],[],["No. Invoice","Tanggal","Nama Pasien","No. RM","Poli","Total","Dibayar","Kembalian","Metode","Status","Kasir"],...a.map(a=>[a.invoice_number,a.payment_date?(0,e.format)(new Date(a.payment_date),"dd/MM/yyyy HH:mm"):(0,e.format)(new Date(a.created_at),"dd/MM/yyyy HH:mm"),a.patient?.name||"-",a.patient?.medical_record_number||"-",a.medical_record?.department?.name||"-",a.total_amount,a.paid_amount,a.change_amount,I.PAYMENT_METHOD_LABELS[a.payment_method]||a.payment_method,I.PAYMENT_STATUS_LABELS[a.payment_status]||a.payment_status,a.cashier?.name||"-"])],g=j.utils.aoa_to_sheet(f);j.utils.book_append_sheet(b,g,"Detail Transaksi");let k=`Riwayat_Transaksi_${(0,e.format)((0,h.parseISO)(Z.start_date),"yyyyMMdd")}_${(0,e.format)((0,h.parseISO)(Z.end_date),"yyyyMMdd")}.xlsx`;j.writeFile(b,k),v.toast.success("Export Excel berhasil!")}catch(a){console.error("Error exporting to Excel:",a),v.toast.error("Gagal export Excel")}finally{Q(!1)}},ak=[{title:"Total Transaksi",value:L?.total||0,icon:o.Receipt,color:"blue"},{title:"Sudah Bayar",value:L?.paid||0,icon:q.CreditCard,color:"green"},{title:"Belum Bayar",value:L?.unpaid||0,subValue:L?.total_unpaid?ai(L.total_unpaid):"-",icon:u,color:"red"},{title:"Total Pendapatan",value:L?.total_revenue?ai(L.total_revenue):"-",icon:p.TrendingUp,color:"green",isLarge:!0}],al={hidden:{opacity:0,y:20},show:{opacity:1,y:0}};return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)(d.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold tracking-tight",children:"Riwayat Transaksi"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Lihat dan kelola riwayat pembayaran pasien"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)(w.Button,{variant:"outline",onClick:()=>{if(0===J.length)return void v.toast.error("Tidak ada data untuk dicetak");S(!0);try{let b=a?.name||"Klinik App",c=a?.address||"",d=a?.phone||"",f=a?.logo_url||"",g=window.open("","_blank");if(!g){v.toast.error("Popup diblokir. Izinkan popup untuk mencetak."),S(!1);return}let j=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Riwayat Transaksi - ${b}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
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
            .clinic-info { flex: 1; }
            .clinic-name {
              font-size: 20px;
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 3px;
            }
            .clinic-address { font-size: 11px; color: #666; }
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
            .report-title p { font-size: 11px; color: #666; }
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
            .summary-card .value { font-size: 14px; font-weight: bold; }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.green { color: #16a34a; }
            .summary-card .value.red { color: #dc2626; }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 10px;
              margin-top: 15px;
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
            tr:nth-child(even) { background-color: #f9fafb; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .badge {
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: 500;
            }
            .badge-success { background: #dcfce7; color: #166534; }
            .badge-warning { background: #fef3c7; color: #92400e; }
            .badge-error { background: #fee2e2; color: #991b1b; }
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
              @page { margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            ${f?`<img src="${f}" alt="${b}" class="logo" />`:'<div class="logo-placeholder">+</div>'}
            <div class="clinic-info">
              <div class="clinic-name">${b}</div>
              <div class="clinic-address">
                ${c?c+"<br/>":""}
                ${d?"Telp: "+d:""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN RIWAYAT TRANSAKSI</h1>
            <p>Periode: ${(0,e.format)((0,h.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:i.id})} - ${(0,e.format)((0,h.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:i.id})}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Transaksi</div>
              <div class="value blue">${L?.total||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Sudah Bayar</div>
              <div class="value green">${L?.paid||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Belum Bayar</div>
              <div class="value red">${L?.unpaid||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pendapatan</div>
              <div class="value green">${ai(L?.total_revenue||0)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No. Invoice</th>
                <th>Tanggal</th>
                <th>Pasien</th>
                <th>Poli</th>
                <th class="text-right">Total</th>
                <th class="text-right">Dibayar</th>
                <th class="text-center">Metode</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              ${J.map(a=>`
                <tr>
                  <td>${a.invoice_number}</td>
                  <td>${a.payment_date?(0,e.format)(new Date(a.payment_date),"dd/MM/yyyy HH:mm"):(0,e.format)(new Date(a.created_at),"dd/MM/yyyy HH:mm")}</td>
                  <td>
                    ${a.patient?.name||"-"}<br/>
                    <small style="color: #666;">${a.patient?.medical_record_number||""}</small>
                  </td>
                  <td>${a.medical_record?.department?.name||"-"}</td>
                  <td class="text-right">${ai(a.total_amount)}</td>
                  <td class="text-right">${ai(a.paid_amount)}</td>
                  <td class="text-center">${I.PAYMENT_METHOD_LABELS[a.payment_method]||a.payment_method}</td>
                  <td class="text-center">
                    <span class="badge ${"paid"===a.payment_status?"badge-success":"partial"===a.payment_status?"badge-warning":"badge-error"}">
                      ${I.PAYMENT_STATUS_LABELS[a.payment_status]||a.payment_status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>Dicetak pada: ${(0,e.format)(new Date,"dd MMMM yyyy HH:mm",{locale:i.id})}</div>
            <div>${b}</div>
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
      `;g.document.write(j),g.document.close(),v.toast.success("Menyiapkan halaman cetak...")}catch(a){console.error("Error printing:",a),v.toast.error("Gagal mencetak")}finally{S(!1)}},disabled:R||N,children:[R?(0,b.jsx)(n.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(s.Printer,{className:"mr-2 h-4 w-4"}),"Print"]}),(0,b.jsxs)(w.Button,{onClick:aj,disabled:P||N,children:[P?(0,b.jsx)(n.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(m.FileSpreadsheet,{className:"mr-2 h-4 w-4"}),"Export Excel"]})]})]}),(0,b.jsx)(d.motion.div,{variants:{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},initial:"hidden",animate:"show",className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:ak.map(a=>(0,b.jsx)(d.motion.div,{variants:al,children:(0,b.jsx)(A.Card,{children:(0,b.jsx)(A.CardContent,{className:"p-6",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:a.title}),(0,b.jsx)("p",{className:`${a.isLarge?"text-2xl":"text-3xl"} font-bold mt-2`,children:N?"-":a.value}),a.subValue&&(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:a.subValue})]}),(0,b.jsx)("div",{className:`p-3 rounded-xl bg-${a.color}-100 dark:bg-${a.color}-950`,children:(0,b.jsx)(a.icon,{className:`h-6 w-6 text-${a.color}-600 dark:text-${a.color}-400`})})]})})})},a.title))}),(0,b.jsxs)(A.Card,{children:[(0,b.jsx)(A.CardHeader,{className:"pb-3",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)(A.CardTitle,{className:"text-base",children:"Filter"}),(0,b.jsxs)(w.Button,{variant:"ghost",size:"sm",onClick:()=>aa(!_),children:[(0,b.jsx)(l.Filter,{className:"mr-2 h-4 w-4"}),_?"Sembunyikan":"Tampilkan"]})]})}),_&&(0,b.jsx)(A.CardContent,{className:"space-y-4",children:(0,b.jsxs)("form",{onSubmit:a=>{a.preventDefault(),af()},children:[(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-5",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(y.Label,{children:"Tanggal Mulai"}),(0,b.jsx)(x.Input,{type:"date",value:Z.start_date,onChange:a=>ah("start_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(y.Label,{children:"Tanggal Akhir"}),(0,b.jsx)(x.Input,{type:"date",value:Z.end_date,onChange:a=>ah("end_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(y.Label,{children:"Status Pembayaran"}),(0,b.jsxs)(C.Select,{value:Z.payment_status,onValueChange:a=>ah("payment_status","all"===a?"":a),children:[(0,b.jsx)(C.SelectTrigger,{children:(0,b.jsx)(C.SelectValue,{placeholder:"Semua Status"})}),(0,b.jsxs)(C.SelectContent,{children:[(0,b.jsx)(C.SelectItem,{value:"all",children:"Semua Status"}),(0,b.jsx)(C.SelectItem,{value:"paid",children:"Lunas"}),(0,b.jsx)(C.SelectItem,{value:"partial",children:"Sebagian"}),(0,b.jsx)(C.SelectItem,{value:"unpaid",children:"Belum Bayar"})]})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(y.Label,{children:"Metode Pembayaran"}),(0,b.jsxs)(C.Select,{value:Z.payment_method,onValueChange:a=>ah("payment_method","all"===a?"":a),children:[(0,b.jsx)(C.SelectTrigger,{children:(0,b.jsx)(C.SelectValue,{placeholder:"Semua Metode"})}),(0,b.jsxs)(C.SelectContent,{children:[(0,b.jsx)(C.SelectItem,{value:"all",children:"Semua Metode"}),(0,b.jsx)(C.SelectItem,{value:"cash",children:"Tunai"}),(0,b.jsx)(C.SelectItem,{value:"card",children:"Kartu"}),(0,b.jsx)(C.SelectItem,{value:"transfer",children:"Transfer"}),(0,b.jsx)(C.SelectItem,{value:"bpjs",children:"BPJS"}),(0,b.jsx)(C.SelectItem,{value:"insurance",children:"Asuransi"})]})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(y.Label,{children:"Pencarian"}),(0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(k.Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),(0,b.jsx)(x.Input,{placeholder:"No. Invoice / Nama Pasien",value:Z.search,onChange:a=>ah("search",a.target.value),className:"pl-9"})]})]})]}),(0,b.jsxs)("div",{className:"flex gap-2 mt-4",children:[(0,b.jsxs)(w.Button,{type:"submit",children:[(0,b.jsx)(k.Search,{className:"mr-2 h-4 w-4"}),"Terapkan Filter"]}),(0,b.jsx)(w.Button,{type:"button",variant:"outline",onClick:()=>{$({start_date:(0,e.format)((0,f.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,e.format)((0,g.endOfMonth)(new Date),"yyyy-MM-dd"),payment_status:"",payment_method:"",search:"",page:1,per_page:15})},children:"Reset"})]})]})})]}),(0,b.jsx)(d.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},children:(0,b.jsxs)(A.Card,{children:[(0,b.jsx)(A.CardHeader,{children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)(A.CardTitle,{children:"Daftar Transaksi"}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsxs)("span",{className:"text-sm text-muted-foreground",children:[X," transaksi ditemukan"]}),(0,b.jsx)(w.Button,{variant:"outline",size:"icon",onClick:()=>{af(),ag()},disabled:N,children:(0,b.jsx)(r.RefreshCw,{className:`h-4 w-4 ${N?"animate-spin":""}`})})]})]})}),(0,b.jsx)(A.CardContent,{children:N?(0,b.jsx)("div",{className:"space-y-3",children:[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(E.Skeleton,{className:"h-16 w-full"},c))}):0===J.length?(0,b.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,b.jsx)(t.Calendar,{className:"h-12 w-12 mx-auto mb-3 opacity-50"}),(0,b.jsx)("p",{children:"Tidak ada transaksi ditemukan"}),(0,b.jsx)("p",{className:"text-sm",children:"Coba ubah filter pencarian"})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(B.Table,{children:[(0,b.jsx)(B.TableHeader,{children:(0,b.jsxs)(B.TableRow,{children:[(0,b.jsx)(B.TableHead,{children:"No. Invoice"}),(0,b.jsx)(B.TableHead,{children:"Tanggal"}),(0,b.jsx)(B.TableHead,{children:"Pasien"}),(0,b.jsx)(B.TableHead,{children:"Poli"}),(0,b.jsx)(B.TableHead,{className:"text-right",children:"Total"}),(0,b.jsx)(B.TableHead,{className:"text-right",children:"Dibayar"}),(0,b.jsx)(B.TableHead,{children:"Metode"}),(0,b.jsx)(B.TableHead,{children:"Status"}),(0,b.jsx)(B.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,b.jsx)(B.TableBody,{children:J.map(a=>{var c;return(0,b.jsxs)(B.TableRow,{children:[(0,b.jsx)(B.TableCell,{className:"font-medium",children:a.invoice_number}),(0,b.jsx)(B.TableCell,{className:"text-sm",children:a.payment_date?(0,e.format)(new Date(a.payment_date),"dd/MM/yyyy HH:mm"):(0,e.format)(new Date(a.created_at),"dd/MM/yyyy HH:mm")}),(0,b.jsx)(B.TableCell,{children:(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium",children:a.patient?.name||"-"}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:a.patient?.medical_record_number||"-"})]})}),(0,b.jsx)(B.TableCell,{children:(0,b.jsx)(z.Badge,{variant:"outline",children:a.medical_record?.department?.name||"-"})}),(0,b.jsx)(B.TableCell,{className:"text-right font-semibold",children:ai(a.total_amount)}),(0,b.jsx)(B.TableCell,{className:"text-right",children:ai(a.paid_amount)}),(0,b.jsx)(B.TableCell,{children:(c=a.payment_method,(0,b.jsx)(z.Badge,{className:{cash:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",card:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",transfer:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",bpjs:"bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",insurance:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"}[c],children:I.PAYMENT_METHOD_LABELS[c]||c}))}),(0,b.jsx)(B.TableCell,{children:(a=>{switch(a){case"paid":return(0,b.jsx)(z.Badge,{variant:"success",children:"Lunas"});case"partial":return(0,b.jsx)(z.Badge,{variant:"warning",children:"Sebagian"});case"unpaid":return(0,b.jsx)(z.Badge,{variant:"error",children:"Belum Bayar"});default:return(0,b.jsx)(z.Badge,{children:a})}})(a.payment_status)}),(0,b.jsx)(B.TableCell,{className:"text-right",children:(0,b.jsxs)(w.Button,{size:"sm",variant:"outline",onClick:()=>{ac(a),ae(!0)},children:[(0,b.jsx)(o.Receipt,{className:"h-4 w-4 mr-1"}),"Struk"]})})]},a.id)})})]}),V>1&&(0,b.jsxs)("div",{className:"flex items-center justify-between mt-4",children:[(0,b.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Halaman ",T," dari ",V]}),(0,b.jsx)(D.Pagination,{currentPage:T,totalPages:V,onPageChange:a=>{$(b=>({...b,page:a}))}})]})]})})]})}),(0,b.jsx)(F.ReceiptModal,{open:ad,onOpenChange:ae,invoice:ab})]})}a.s(["default",()=>J],4405)}];

//# sourceMappingURL=src_app_%28dashboard%29_payments_history_page_tsx_f43b841e._.js.map