module.exports=[56226,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(56711),e=a.i(55258),f=a.i(22658),g=a.i(60178),h=a.i(93901),i=a.i(75750),j=a.i(87532),k=a.i(81464),l=a.i(24722),m=a.i(57894),n=a.i(96221),o=a.i(41675),p=a.i(83497),q=a.i(53277),r=a.i(73570),s=a.i(77156),t=a.i(71931),u=a.i(23292),v=a.i(99570),w=a.i(66718),x=a.i(70430),y=a.i(86304),z=a.i(91119),A=a.i(6015),B=a.i(14574),C=a.i(80701),D=a.i(82524),E=a.i(33140),F=a.i(75083),G=a.i(85611),H=a.i(82835),I=a.i(91159);function J(){let{settings:a}=(0,H.useClinicSettings)(),[J,K]=(0,c.useState)([]),[L,M]=(0,c.useState)(null),[N,O]=(0,c.useState)(null),[P,Q]=(0,c.useState)([]),[R,S]=(0,c.useState)(!0),[T,U]=(0,c.useState)(!0),[V,W]=(0,c.useState)(!1),[X,Y]=(0,c.useState)(!1),[Z,$]=(0,c.useState)([]),[_,aa]=(0,c.useState)(1),[ab,ac]=(0,c.useState)(1),[ad,ae]=(0,c.useState)(0),[af,ag]=(0,c.useState)({start_date:(0,d.format)((0,e.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,d.format)((0,f.endOfMonth)(new Date),"yyyy-MM-dd"),medicine_id:void 0,reason:void 0,group_by:void 0,page:1,per_page:20}),[ah,ai]=(0,c.useState)(!0),[aj,ak]=(0,c.useState)("detail"),[al,am]=(0,c.useState)("reason"),[an,ao]=(0,c.useState)(!1),[ap,aq]=(0,c.useState)(null),ar=["sales","adjustment_minus","return_supplier","expired","damage","transfer_out"],as=(0,c.useCallback)(async()=>{S(!0);try{let a=await G.stockMovementService.getStockMovements({movement_type:"out",start_date:af.start_date,end_date:af.end_date,medicine_id:af.medicine_id,reason:af.reason,page:_,per_page:af.per_page});K(a.data),ac(a.last_page),ae(a.total)}catch(a){console.error("Error fetching stock movements:",a),u.toast.error("Gagal memuat data laporan")}finally{S(!1)}},[af,_]),at=(0,c.useCallback)(async()=>{try{let a=await G.stockMovementService.getStockMovements({movement_type:"out",start_date:af.start_date,end_date:af.end_date,medicine_id:af.medicine_id,reason:af.reason,page:1,per_page:1e4});$(a.data)}catch(a){console.error("Error fetching all movements:",a)}},[af.start_date,af.end_date,af.medicine_id,af.reason]),au=(0,c.useCallback)(async()=>{U(!0);try{let a=await G.stockMovementService.getStockMovementStats(af.start_date,af.end_date);O(a)}catch(a){console.error("Error fetching stats:",a)}finally{U(!1)}},[af.start_date,af.end_date]),av=(0,c.useCallback)(async()=>{try{let a=await G.stockMovementService.getSummary(af.start_date,af.end_date),b={total_items:a.summary.length,total_quantity:a.summary.reduce((a,b)=>a+(b.total_quantity||0),0),total_value:a.summary.reduce((a,b)=>a+(b.total_value||0),0),by_reason:a.summary.map(a=>({reason:a.reason,reason_label:I.MOVEMENT_REASON_LABELS[a.reason]||a.reason,total_quantity:a.total_quantity||0,total_value:a.total_value||0,transaction_count:a.count||0}))};M(b)}catch(a){console.error("Error fetching summary:",a)}},[af.start_date,af.end_date]),aw=async()=>{try{let a=await G.medicineService.getActiveMedicines({});Q(a.data)}catch(a){console.error("Error fetching medicines:",a)}};(0,c.useEffect)(()=>{aw()},[]),(0,c.useEffect)(()=>{as(),au(),av(),at()},[as,au,av,at]);let ax=(a,b)=>{ag(c=>({...c,[a]:b})),aa(1)},ay=a=>{switch(a){case"sales":return"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";case"expired":return"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";case"damage":return"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";case"return_supplier":return"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";default:return"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"}};return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold tracking-tight",children:"Laporan Stok Keluar"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Laporan obat keluar berdasarkan tanggal, alasan, dan obat"})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(v.Button,{variant:"outline",onClick:()=>{if(0===Z.length)return void u.toast.error("Tidak ada data untuk dicetak");Y(!0);try{let b=a?.name||"Klinik App",c=a?.address||"",e=a?.phone||"",f=a?.logo_url||"",i=window.open("","_blank");if(!i){u.toast.error("Popup diblokir. Izinkan popup untuk mencetak."),Y(!1);return}let j=a=>{switch(a){case"sales":return"background-color: #dbeafe; color: #1e40af;";case"expired":return"background-color: #fee2e2; color: #991b1b;";case"damage":return"background-color: #ffedd5; color: #9a3412;";case"return_supplier":return"background-color: #f3e8ff; color: #6b21a8;";default:return"background-color: #f3f4f6; color: #374151;"}},k=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Stok Keluar - ${b}</title>
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
              border-bottom: 2px solid #dc2626;
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
              color: #dc2626;
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
            .summary-card .value.red { color: #dc2626; }
            .summary-card .value.blue { color: #2563eb; }
            .summary-card .value.orange { color: #ea580c; }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 13px;
              font-weight: bold;
              color: #dc2626;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #e5e7eb;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 9px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 5px 6px;
              text-align: left;
            }
            th {
              background-color: #fef2f2;
              font-weight: 600;
              color: #991b1b;
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
            .font-bold { font-weight: bold; }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 8px;
              font-weight: 500;
            }
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
              @page { margin: 10mm; size: landscape; }
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
                ${e?"Telp: "+e:""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN STOK KELUAR</h1>
            <p>Periode: ${(0,d.format)((0,g.parseISO)(af.start_date),"dd MMMM yyyy",{locale:h.id})} - ${(0,d.format)((0,g.parseISO)(af.end_date),"dd MMMM yyyy",{locale:h.id})}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Stok Keluar</div>
              <div class="value red">-${N?.total_out||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Penjualan/Penyerahan</div>
              <div class="value blue">${N?.by_reason?.find(a=>"sales"===a.reason)?.total_quantity||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Kadaluarsa</div>
              <div class="value red">${N?.by_reason?.find(a=>"expired"===a.reason)?.total_quantity||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Transaksi</div>
              <div class="value orange">${ad}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ringkasan Per Alasan</div>
            <table>
              <thead>
                <tr>
                  <th>Alasan</th>
                  <th class="text-center">Jumlah Transaksi</th>
                  <th class="text-right">Total Qty</th>
                </tr>
              </thead>
              <tbody>
                ${L?.by_reason?.filter(a=>ar.includes(a.reason)).map(a=>`
                        <tr>
                          <td><span class="badge" style="${j(a.reason)}">${a.reason_label}</span></td>
                          <td class="text-center">${a.transaction_count}</td>
                          <td class="text-right text-red font-bold">-${a.total_quantity}</td>
                        </tr>
                      `).join("")||'<tr><td colspan="3" class="text-center">Tidak ada data</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Detail Transaksi Stok Keluar</div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>No. Mutasi</th>
                  <th>Nama Obat</th>
                  <th>Batch</th>
                  <th>Alasan</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Stok Akhir</th>
                  <th>Catatan</th>
                </tr>
              </thead>
              <tbody>
                ${Z.map(a=>`
                        <tr>
                          <td>${(0,d.format)(new Date(a.movement_date),"dd/MM/yyyy")}</td>
                          <td>${a.movement_number}</td>
                          <td>${a.medicine?.name||"-"}</td>
                          <td>${a.medicine_batch?.batch_number||"-"}</td>
                          <td><span class="badge" style="${j(a.reason)}">${I.MOVEMENT_REASON_LABELS[a.reason]||a.reason}</span></td>
                          <td class="text-right text-red font-bold">-${a.quantity}</td>
                          <td class="text-right">${a.stock_after}</td>
                          <td>${a.notes||"-"}</td>
                        </tr>
                      `).join("")||'<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>Dicetak pada: ${(0,d.format)(new Date,"dd MMMM yyyy HH:mm",{locale:h.id})}</div>
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
      `;i.document.write(k),i.document.close(),u.toast.success("Menyiapkan halaman cetak...")}catch(a){console.error("Error printing:",a),u.toast.error("Gagal mencetak")}finally{Y(!1)}},disabled:X||R,children:[X?(0,b.jsx)(n.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(t.Printer,{className:"mr-2 h-4 w-4"}),"Print"]}),(0,b.jsxs)(v.Button,{onClick:()=>{if(0===Z.length)return void u.toast.error("Tidak ada data untuk di-export");W(!0);try{let a=i.utils.book_new(),b=[["LAPORAN STOK KELUAR"],[`Periode: ${(0,d.format)((0,g.parseISO)(af.start_date),"dd MMMM yyyy",{locale:h.id})} - ${(0,d.format)((0,g.parseISO)(af.end_date),"dd MMMM yyyy",{locale:h.id})}`],[],["RINGKASAN"],["Total Stok Keluar",N?.total_out||0],["Total Transaksi",ad],[],["RINGKASAN PER ALASAN"],["Alasan","Jumlah Transaksi","Total Qty"],...L?.by_reason?.filter(a=>ar.includes(a.reason)).map(a=>[a.reason_label,a.transaction_count,a.total_quantity])||[]],c=i.utils.aoa_to_sheet(b);i.utils.book_append_sheet(a,c,"Ringkasan");let e=[["DETAIL STOK KELUAR"],[`Periode: ${(0,d.format)((0,g.parseISO)(af.start_date),"dd MMMM yyyy",{locale:h.id})} - ${(0,d.format)((0,g.parseISO)(af.end_date),"dd MMMM yyyy",{locale:h.id})}`],[],["Tanggal","No. Mutasi","Kode Obat","Nama Obat","Batch","Exp Date","Alasan","Qty","Satuan","Stok Sebelum","Stok Sesudah","Catatan","Dibuat Oleh"],...Z.map(a=>[(0,d.format)(new Date(a.movement_date),"dd/MM/yyyy HH:mm"),a.movement_number,a.medicine?.code||"-",a.medicine?.name||"-",a.medicine_batch?.batch_number||"-",a.medicine_batch?.expiry_date?(0,d.format)(new Date(a.medicine_batch.expiry_date),"dd/MM/yyyy"):"-",I.MOVEMENT_REASON_LABELS[a.reason]||a.reason,-a.quantity,a.unit,a.stock_before,a.stock_after,a.notes||"-",a.creator?.name||"-"])],f=i.utils.aoa_to_sheet(e);i.utils.book_append_sheet(a,f,"Detail Transaksi");let j=`Laporan_Stok_Keluar_${(0,d.format)((0,g.parseISO)(af.start_date),"yyyyMMdd")}_${(0,d.format)((0,g.parseISO)(af.end_date),"yyyyMMdd")}.xlsx`;i.writeFile(a,j),u.toast.success("Export Excel berhasil!")}catch(a){console.error("Error exporting to Excel:",a),u.toast.error("Gagal export Excel")}finally{W(!1)}},disabled:V||R,children:[V?(0,b.jsx)(n.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(l.FileSpreadsheet,{className:"mr-2 h-4 w-4"}),"Export Excel"]})]})]}),(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,b.jsxs)(z.Card,{children:[(0,b.jsxs)(z.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(z.CardTitle,{className:"text-sm font-medium",children:"Total Stok Keluar"}),(0,b.jsx)(q.TrendingDown,{className:"h-4 w-4 text-red-500"})]}),(0,b.jsxs)(z.CardContent,{children:[T?(0,b.jsx)(E.Skeleton,{className:"h-8 w-20"}):(0,b.jsxs)("div",{className:"text-2xl font-bold text-red-600",children:["-",N?.total_out||0]}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground",children:[(0,d.format)(new Date(af.start_date),"dd MMM",{locale:h.id})," ","-"," ",(0,d.format)(new Date(af.end_date),"dd MMM yyyy",{locale:h.id})]})]})]}),(0,b.jsxs)(z.Card,{children:[(0,b.jsxs)(z.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(z.CardTitle,{className:"text-sm font-medium",children:"Penjualan/Penyerahan"}),(0,b.jsx)(p.Package,{className:"h-4 w-4 text-blue-500"})]}),(0,b.jsxs)(z.CardContent,{children:[T?(0,b.jsx)(E.Skeleton,{className:"h-8 w-20"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:N?.by_reason?.find(a=>"sales"===a.reason)?.total_quantity||0}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Unit terjual"})]})]}),(0,b.jsxs)(z.Card,{children:[(0,b.jsxs)(z.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(z.CardTitle,{className:"text-sm font-medium",children:"Kadaluarsa"}),(0,b.jsx)(r.AlertTriangle,{className:"h-4 w-4 text-red-500"})]}),(0,b.jsxs)(z.CardContent,{children:[T?(0,b.jsx)(E.Skeleton,{className:"h-8 w-20"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-red-600",children:N?.by_reason?.find(a=>"expired"===a.reason)?.total_quantity||0}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Unit kadaluarsa"})]})]}),(0,b.jsxs)(z.Card,{children:[(0,b.jsxs)(z.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(z.CardTitle,{className:"text-sm font-medium",children:"Total Item"}),(0,b.jsx)(o.Calendar,{className:"h-4 w-4 text-orange-500"})]}),(0,b.jsxs)(z.CardContent,{children:[R?(0,b.jsx)(E.Skeleton,{className:"h-8 w-20"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-orange-600",children:ad}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Data ditemukan"})]})]})]}),(0,b.jsxs)(z.Card,{children:[(0,b.jsx)(z.CardHeader,{className:"pb-3",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)(z.CardTitle,{className:"text-base",children:"Filter Laporan"}),(0,b.jsxs)(v.Button,{variant:"ghost",size:"sm",onClick:()=>ai(!ah),children:[(0,b.jsx)(k.Filter,{className:"mr-2 h-4 w-4"}),ah?"Sembunyikan":"Tampilkan"]})]})}),ah&&(0,b.jsxs)(z.CardContent,{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(x.Label,{children:"Tanggal Mulai"}),(0,b.jsx)(w.Input,{type:"date",value:af.start_date,onChange:a=>ax("start_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(x.Label,{children:"Tanggal Akhir"}),(0,b.jsx)(w.Input,{type:"date",value:af.end_date,onChange:a=>ax("end_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(x.Label,{children:"Alasan Keluar"}),(0,b.jsxs)(C.Select,{value:af.reason||"all",onValueChange:a=>ax("reason","all"===a?void 0:a),children:[(0,b.jsx)(C.SelectTrigger,{children:(0,b.jsx)(C.SelectValue,{placeholder:"Semua Alasan"})}),(0,b.jsxs)(C.SelectContent,{children:[(0,b.jsx)(C.SelectItem,{value:"all",children:"Semua Alasan"}),ar.map(a=>(0,b.jsx)(C.SelectItem,{value:a,children:I.MOVEMENT_REASON_LABELS[a]},a))]})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(x.Label,{children:"Obat"}),(0,b.jsxs)(C.Select,{value:af.medicine_id?.toString()||"all",onValueChange:a=>ax("medicine_id","all"===a?void 0:parseInt(a)),children:[(0,b.jsx)(C.SelectTrigger,{children:(0,b.jsx)(C.SelectValue,{placeholder:"Semua Obat"})}),(0,b.jsxs)(C.SelectContent,{children:[(0,b.jsx)(C.SelectItem,{value:"all",children:"Semua Obat"}),P.map(a=>(0,b.jsx)(C.SelectItem,{value:a.id.toString(),children:a.name},a.id))]})]})]})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(v.Button,{onClick:()=>{as(),au(),av(),at()},children:[(0,b.jsx)(j.Search,{className:"mr-2 h-4 w-4"}),"Terapkan Filter"]}),(0,b.jsx)(v.Button,{variant:"outline",onClick:()=>{ag({start_date:(0,d.format)((0,e.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,d.format)((0,f.endOfMonth)(new Date),"yyyy-MM-dd"),medicine_id:void 0,reason:void 0,group_by:void 0,page:1,per_page:20}),aa(1)},children:"Reset"})]})]})]}),(0,b.jsxs)(F.Tabs,{value:aj,onValueChange:a=>ak(a),children:[(0,b.jsxs)(F.TabsList,{children:[(0,b.jsx)(F.TabsTrigger,{value:"detail",children:"Detail Transaksi"}),(0,b.jsx)(F.TabsTrigger,{value:"summary",children:"Ringkasan"})]}),(0,b.jsx)(F.TabsContent,{value:"detail",className:"mt-4",children:(0,b.jsxs)(z.Card,{children:[(0,b.jsx)(z.CardContent,{className:"p-0",children:(0,b.jsxs)(A.Table,{children:[(0,b.jsx)(A.TableHeader,{children:(0,b.jsxs)(A.TableRow,{children:[(0,b.jsx)(A.TableHead,{children:"Tanggal"}),(0,b.jsx)(A.TableHead,{children:"No. Mutasi"}),(0,b.jsx)(A.TableHead,{children:"Obat"}),(0,b.jsx)(A.TableHead,{children:"Batch"}),(0,b.jsx)(A.TableHead,{children:"Alasan"}),(0,b.jsx)(A.TableHead,{className:"text-right",children:"Qty"}),(0,b.jsx)(A.TableHead,{className:"text-right",children:"Stok Akhir"}),(0,b.jsx)(A.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,b.jsx)(A.TableBody,{children:R?[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(A.TableRow,{children:(0,b.jsx)(A.TableCell,{colSpan:8,children:(0,b.jsx)(E.Skeleton,{className:"h-12 w-full"})})},c)):0===J.length?(0,b.jsx)(A.TableRow,{children:(0,b.jsx)(A.TableCell,{colSpan:8,className:"text-center py-8",children:(0,b.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,b.jsx)(m.ArrowDownCircle,{className:"h-8 w-8 text-muted-foreground"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Tidak ada data stok keluar pada periode ini"})]})})}):J.map(a=>(0,b.jsxs)(A.TableRow,{children:[(0,b.jsx)(A.TableCell,{children:(0,d.format)(new Date(a.movement_date),"dd MMM yyyy",{locale:h.id})}),(0,b.jsx)(A.TableCell,{className:"font-medium",children:a.movement_number}),(0,b.jsx)(A.TableCell,{children:a.medicine?.name||"-"}),(0,b.jsx)(A.TableCell,{children:a.medicine_batch?.batch_number||"-"}),(0,b.jsx)(A.TableCell,{children:(0,b.jsx)(y.Badge,{className:ay(a.reason),children:I.MOVEMENT_REASON_LABELS[a.reason]||a.reason})}),(0,b.jsxs)(A.TableCell,{className:"text-right text-red-600 font-medium",children:["-",a.quantity," ",a.unit]}),(0,b.jsx)(A.TableCell,{className:"text-right font-medium",children:a.stock_after}),(0,b.jsx)(A.TableCell,{className:"text-right",children:(0,b.jsx)(v.Button,{variant:"ghost",size:"icon",onClick:()=>{aq(a),ao(!0)},children:(0,b.jsx)(s.Eye,{className:"h-4 w-4"})})})]},a.id))})]})}),ab>1&&(0,b.jsxs)("div",{className:"flex items-center justify-between px-4 py-4 border-t",children:[(0,b.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Menampilkan ",J.length," dari ",ad," data"]}),(0,b.jsx)(D.Pagination,{currentPage:_,totalPages:ab,onPageChange:aa})]})]})}),(0,b.jsx)(F.TabsContent,{value:"summary",className:"mt-4",children:(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsx)(z.Card,{children:(0,b.jsx)(z.CardHeader,{className:"pb-3",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)(z.CardTitle,{className:"text-base",children:"Kelompokkan Berdasarkan"}),(0,b.jsxs)(C.Select,{value:al,onValueChange:a=>am(a),children:[(0,b.jsx)(C.SelectTrigger,{className:"w-48",children:(0,b.jsx)(C.SelectValue,{})}),(0,b.jsxs)(C.SelectContent,{children:[(0,b.jsx)(C.SelectItem,{value:"date",children:"Tanggal"}),(0,b.jsx)(C.SelectItem,{value:"reason",children:"Alasan"}),(0,b.jsx)(C.SelectItem,{value:"medicine",children:"Obat"})]})]})]})})}),(0,b.jsxs)(z.Card,{children:[(0,b.jsx)(z.CardHeader,{children:(0,b.jsx)(z.CardTitle,{className:"text-base",children:"Ringkasan Berdasarkan Alasan"})}),(0,b.jsx)(z.CardContent,{children:(0,b.jsxs)(A.Table,{children:[(0,b.jsx)(A.TableHeader,{children:(0,b.jsxs)(A.TableRow,{children:[(0,b.jsx)(A.TableHead,{children:"Alasan"}),(0,b.jsx)(A.TableHead,{className:"text-right",children:"Jumlah Transaksi"}),(0,b.jsx)(A.TableHead,{className:"text-right",children:"Total Qty"})]})}),(0,b.jsxs)(A.TableBody,{children:[L?.by_reason?.filter(a=>ar.includes(a.reason)).map((a,c)=>(0,b.jsxs)(A.TableRow,{children:[(0,b.jsx)(A.TableCell,{children:(0,b.jsx)(y.Badge,{className:ay(a.reason),children:a.reason_label})}),(0,b.jsx)(A.TableCell,{className:"text-right",children:a.transaction_count}),(0,b.jsxs)(A.TableCell,{className:"text-right font-medium text-red-600",children:["-",a.total_quantity]})]},c)),(!L?.by_reason||0===L.by_reason.filter(a=>ar.includes(a.reason)).length)&&(0,b.jsx)(A.TableRow,{children:(0,b.jsx)(A.TableCell,{colSpan:3,className:"text-center py-4 text-muted-foreground",children:"Tidak ada data"})})]})]})})]}),(0,b.jsxs)(z.Card,{children:[(0,b.jsx)(z.CardHeader,{children:(0,b.jsx)(z.CardTitle,{className:"text-base",children:"Total Keseluruhan"})}),(0,b.jsx)(z.CardContent,{children:(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,b.jsxs)("div",{className:"p-4 bg-red-50 dark:bg-red-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Qty Keluar"}),(0,b.jsxs)("p",{className:"text-2xl font-bold text-red-600",children:["-",L?.by_reason?.filter(a=>ar.includes(a.reason)).reduce((a,b)=>a+b.total_quantity,0)||0]})]}),(0,b.jsxs)("div",{className:"p-4 bg-blue-50 dark:bg-blue-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Transaksi"}),(0,b.jsx)("p",{className:"text-2xl font-bold text-blue-600",children:L?.by_reason?.filter(a=>ar.includes(a.reason)).reduce((a,b)=>a+b.transaction_count,0)||0})]}),(0,b.jsxs)("div",{className:"p-4 bg-purple-50 dark:bg-purple-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Kategori Alasan"}),(0,b.jsx)("p",{className:"text-2xl font-bold text-purple-600",children:L?.by_reason?.filter(a=>ar.includes(a.reason)).length||0})]})]})})]})]})})]}),(0,b.jsx)(B.Dialog,{open:an,onOpenChange:ao,children:(0,b.jsxs)(B.DialogContent,{className:"max-w-lg",children:[(0,b.jsxs)(B.DialogHeader,{children:[(0,b.jsx)(B.DialogTitle,{children:"Detail Stok Keluar"}),(0,b.jsx)(B.DialogDescription,{children:ap?.movement_number})]}),ap&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Obat"}),(0,b.jsx)("p",{className:"font-medium",children:ap.medicine?.name})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Batch"}),(0,b.jsx)("p",{className:"font-medium",children:ap.medicine_batch?.batch_number||"-"})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Tanggal"}),(0,b.jsx)("p",{className:"font-medium",children:(0,d.format)(new Date(ap.movement_date),"dd MMMM yyyy HH:mm",{locale:h.id})})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Tipe"}),(0,b.jsxs)(y.Badge,{className:"bg-red-100 text-red-800",children:[(0,b.jsx)(m.ArrowDownCircle,{className:"mr-1 h-3 w-3"}),"Keluar"]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Alasan"}),(0,b.jsx)(y.Badge,{className:ay(ap.reason),children:I.MOVEMENT_REASON_LABELS[ap.reason]||ap.reason})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Jumlah"}),(0,b.jsxs)("p",{className:"font-medium text-red-600",children:["-",ap.quantity," ",ap.unit]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Stok Sebelum"}),(0,b.jsx)("p",{className:"font-medium",children:ap.stock_before})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Stok Sesudah"}),(0,b.jsx)("p",{className:"font-medium",children:ap.stock_after})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Dibuat Oleh"}),(0,b.jsx)("p",{className:"font-medium",children:ap.creator?.name||"-"})]}),ap.reference_type&&(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Referensi"}),(0,b.jsxs)("p",{className:"font-medium",children:[ap.reference_type," #",ap.reference_id]})]})]}),ap.notes&&(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Catatan"}),(0,b.jsx)("p",{className:"font-medium",children:ap.notes})]})]})]})})]})}a.s(["default",()=>J])}];

//# sourceMappingURL=src_app_%28dashboard%29_pharmacy_reports_stock-out_page_tsx_1f52cd4c._.js.map