(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,91314,e=>{"use strict";var t=e.i(43476),a=e.i(71645),l=e.i(1851),s=e.i(8199),i=e.i(39978),r=e.i(26514),d=e.i(45110),n=e.i(77241),c=e.i(70016),o=e.i(42956),x=e.i(55436),m=e.i(97548),h=e.i(94918),p=e.i(31278),u=e.i(87316),g=e.i(25652),b=e.i(35408),j=e.i(75254);let _=(0,j.default)("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);var f=e.i(17923),N=e.i(50627);let v=(0,j.default)("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);var y=e.i(86536),T=e.i(64659),C=e.i(55900),w=e.i(3281),M=e.i(46696),P=e.i(19455),S=e.i(93479),H=e.i(10204),k=e.i(87486),$=e.i(15288),R=e.i(84774),D=e.i(76639),I=e.i(67489),E=e.i(2747),B=e.i(77572),A=e.i(45983),O=e.i(72064);function L(){let e,{settings:j}=(0,O.useClinicSettings)(),[L,q]=(0,a.useState)([]),[F,J]=(0,a.useState)([]),[z,G]=(0,a.useState)(null),[Q,K]=(0,a.useState)([]),[U,V]=(0,a.useState)(!0),[Y,W]=(0,a.useState)(!1),[X,Z]=(0,a.useState)(!1),[ee,et]=(0,a.useState)(1),[ea,el]=(0,a.useState)(1),[es,ei]=(0,a.useState)(0),[er,ed]=(0,a.useState)({start_date:(0,l.format)((0,s.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,l.format)((0,i.endOfMonth)(new Date),"yyyy-MM-dd"),supplier_id:void 0,view_mode:"daily"}),[en,ec]=(0,a.useState)(!0),[eo,ex]=(0,a.useState)("summary"),[em,eh]=(0,a.useState)(new Set),[ep,eu]=(0,a.useState)(!1),[eg,eb]=(0,a.useState)(null),[ej,e_]=(0,a.useState)(!1),[ef,eN]=(0,a.useState)(null),ev=(0,a.useCallback)(async()=>{V(!0);try{let e=await A.goodsReceiptService.getGoodsReceipts({status:"completed",start_date:er.start_date,end_date:er.end_date,supplier_id:er.supplier_id,page:1,per_page:1e3});q(e.data),ei(e.total),ey(e.data)}catch(e){console.error("Error fetching receipts:",e),M.toast.error("Gagal memuat data laporan")}finally{V(!1)}},[er.start_date,er.end_date,er.supplier_id]),ey=e=>{let t=new Map;(function(e,t){let{start:a,end:l}=function(e,t){let[a,l]=(0,d.normalizeDates)(e,t.start,t.end);return{start:a,end:l}}(void 0,e),s=+a>+l,i=s?+a:+l,r=s?l:a;r.setHours(0,0,0,0);let c=(void 0)??1;if(!c)return[];c<0&&(c=-c,s=!s);let o=[];for(;+r<=i;)o.push((0,n.constructFrom)(a,r)),r.setDate(r.getDate()+c),r.setHours(0,0,0,0);return s?o.reverse():o})({start:(0,r.parseISO)(er.start_date),end:(0,r.parseISO)(er.end_date)}).forEach(e=>{let a=(0,l.format)(e,"yyyy-MM-dd");t.set(a,{date:a,receipt_count:0,item_count:0,total_qty:0,total_purchase_value:0,total_selling_value:0,potential_profit:0,profit_margin:0,receipts:[]})});let a=0,s=0,i=0,c=0,o=0,x=new Map,m=new Map;e.forEach(e=>{let l=e.receipt_date.split("T")[0],r=t.get(l);if(r){r.receipt_count+=1,r.receipts.push(e);let t=Number(e.total_amount)||0;r.total_purchase_value+=t;let l=0;e.items?.forEach(e=>{r.item_count+=1;let t=Number(e.quantity)||0;r.total_qty+=t;let a=Number(e.medicine?.selling_price)||0;l+=t*a}),r.total_selling_value+=l,a+=1,s+=e.items?.length||0,i+=e.items?.reduce((e,t)=>e+(Number(t.quantity)||0),0)||0,c+=t,o+=l,x.has(e.supplier_id)||x.set(e.supplier_id,{supplier_id:e.supplier_id,supplier_name:e.supplier?.name||"-",receipt_count:0,total_purchase_value:0,total_selling_value:0,potential_profit:0,medicines:[]});let d=x.get(e.supplier_id);d.receipt_count+=1,d.total_purchase_value+=t,d.total_selling_value+=l,d.potential_profit=d.total_selling_value-d.total_purchase_value,e.items?.forEach(t=>{let a=`${e.supplier_id}-${t.medicine_id}`,l=Number(t.quantity)||0,s=Number(t.unit_price)||0,i=Number(t.medicine?.selling_price)||0;m.has(a)||m.set(a,{medicine_id:t.medicine_id,medicine_name:t.medicine?.name||"-",medicine_code:t.medicine?.code||"-",total_qty:0,unit:t.unit,total_purchase_value:0,total_selling_value:0,potential_profit:0,profit_margin:0});let r=m.get(a);r.total_qty+=l,r.total_purchase_value+=l*s,r.total_selling_value+=l*i,r.potential_profit=r.total_selling_value-r.total_purchase_value,r.profit_margin=r.total_purchase_value>0?r.potential_profit/r.total_purchase_value*100:0})}}),m.forEach((e,t)=>{let a=parseInt(t.split("-")[0]),l=x.get(a);l&&l.medicines.push(e)}),x.forEach(e=>{e.medicines.sort((e,t)=>t.total_purchase_value-e.total_purchase_value)}),t.forEach(e=>{e.potential_profit=e.total_selling_value-e.total_purchase_value,e.profit_margin=e.total_purchase_value>0?e.potential_profit/e.total_purchase_value*100:0});let h=Array.from(t.values()).filter(e=>e.receipt_count>0).sort((e,t)=>t.date.localeCompare(e.date));J(h);let p=o-c,u=c>0?p/c*100:0,g=h.length,b=g>0?a/g:0;G({total_receipts:a,total_items:s,total_qty:i,total_purchase_value:c,total_selling_value:o,potential_profit:p,avg_profit_margin:u,avg_receipts_per_day:b,by_supplier:Array.from(x.values()).sort((e,t)=>t.total_purchase_value-e.total_purchase_value)})},eT=async()=>{try{let e=await A.supplierService.getActiveSuppliers();K(e.data)}catch(e){console.error("Error fetching suppliers:",e)}};(0,a.useEffect)(()=>{eT()},[]),(0,a.useEffect)(()=>{ev()},[ev]);let eC=(e,t)=>{ed(a=>({...a,[e]:t}))},ew=async e=>{try{let t=await A.goodsReceiptService.getGoodsReceiptById(e);eb(t),eu(!0)}catch(e){M.toast.error("Gagal memuat detail")}},eM=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),eP=e=>`${e.toFixed(1)}%`;return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold tracking-tight",children:"Laporan Penerimaan"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Analisis penerimaan barang dan potensi laba rugi"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(P.Button,{variant:"outline",onClick:()=>{if(0===L.length)return void M.toast.error("Tidak ada data untuk dicetak");Z(!0);try{let e=j?.name||"Klinik App",t=j?.address||"",a=j?.phone||"",s=j?.logo_url||"",i=window.open("","_blank");if(!i){M.toast.error("Popup diblokir. Izinkan popup untuk mencetak."),Z(!1);return}let d=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),n=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Penerimaan - ${e}</title>
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
            ${s?`<img src="${s}" alt="${e}" class="logo" />`:'<div class="logo-placeholder">+</div>'}
            <div class="clinic-info">
              <div class="clinic-name">${e}</div>
              <div class="clinic-address">
                ${t?t+"<br/>":""}
                ${a?"Telp: "+a:""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN PENERIMAAN BARANG</h1>
            <p>Periode: ${(0,l.format)((0,r.parseISO)(er.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,l.format)((0,r.parseISO)(er.end_date),"dd MMMM yyyy",{locale:o.id})}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Penerimaan</div>
              <div class="value blue">${z?.total_receipts||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pembelian (HPP)</div>
              <div class="value red">${d(z?.total_purchase_value||0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Penjualan</div>
              <div class="value green">${d(z?.total_selling_value||0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Laba (${(z?.avg_profit_margin||0).toFixed(1)}%)</div>
              <div class="value purple">${d(z?.potential_profit||0)}</div>
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
                ${z?.by_supplier.map(e=>{let t=e.total_purchase_value>0?(e.potential_profit/e.total_purchase_value*100).toFixed(1):"0";return`
                        <tr>
                          <td>${e.supplier_name}</td>
                          <td class="text-center">${e.receipt_count}</td>
                          <td class="text-center">${e.medicines.length}</td>
                          <td class="text-right text-red">${d(e.total_purchase_value)}</td>
                          <td class="text-right text-green">${d(e.total_selling_value)}</td>
                          <td class="text-right text-blue font-bold">${d(e.potential_profit)}</td>
                          <td class="text-center">${t}%</td>
                        </tr>
                      `}).join("")||'<tr><td colspan="7" class="text-center">Tidak ada data</td></tr>'}
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
                ${L.map(e=>{let t=e.items?.reduce((e,t)=>e+t.quantity*(t.medicine?.selling_price||0),0)||0,a=t-Number(e.total_amount);return`
                        <tr>
                          <td>${(0,l.format)(new Date(e.receipt_date),"dd/MM/yyyy")}</td>
                          <td>${e.receipt_number}</td>
                          <td>${e.supplier_invoice_number||"-"}</td>
                          <td>${e.supplier?.name||"-"}</td>
                          <td class="text-center">${e.items?.length||0}</td>
                          <td class="text-right text-red">${d(Number(e.total_amount)||0)}</td>
                          <td class="text-right text-green">${d(t)}</td>
                          <td class="text-right text-blue font-bold">${d(a)}</td>
                        </tr>
                      `}).join("")||'<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>Dicetak pada: ${(0,l.format)(new Date,"dd MMMM yyyy HH:mm",{locale:o.id})}</div>
            <div>${e}</div>
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
      `;i.document.write(n),i.document.close(),M.toast.success("Menyiapkan halaman cetak...")}catch(e){console.error("Error printing:",e),M.toast.error("Gagal mencetak")}finally{Z(!1)}},disabled:X||U,children:[X?(0,t.jsx)(p.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,t.jsx)(w.Printer,{className:"mr-2 h-4 w-4"}),"Print"]}),(0,t.jsxs)(P.Button,{onClick:()=>{if(0===L.length)return void M.toast.error("Tidak ada data untuk di-export");W(!0);try{let e=c.utils.book_new(),t=[["LAPORAN PENERIMAAN BARANG"],[`Periode: ${(0,l.format)((0,r.parseISO)(er.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,l.format)((0,r.parseISO)(er.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["RINGKASAN"],["Total Penerimaan",z?.total_receipts||0],["Total Item",z?.total_items||0],["Total Quantity",z?.total_qty||0],["Total Pembelian (HPP)",z?.total_purchase_value||0],["Potensi Penjualan",z?.total_selling_value||0],["Potensi Laba",z?.potential_profit||0],["Rata-rata Margin (%)",z?.avg_profit_margin?.toFixed(2)||0],[],["RINGKASAN PER SUPPLIER"],["Supplier","Jumlah Penerimaan","Jenis Obat","Nilai Beli (HPP)","Nilai Jual","Potensi Laba","Margin (%)"],...z?.by_supplier.map(e=>[e.supplier_name,e.receipt_count,e.medicines.length,e.total_purchase_value,e.total_selling_value,e.potential_profit,e.total_purchase_value>0?(e.potential_profit/e.total_purchase_value*100).toFixed(2):"0"])||[]],a=c.utils.aoa_to_sheet(t);c.utils.book_append_sheet(e,a,"Ringkasan");let s=[["LAPORAN PENERIMAAN PER HARI"],[`Periode: ${(0,l.format)((0,r.parseISO)(er.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,l.format)((0,r.parseISO)(er.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["Tanggal","Jumlah Penerimaan","Jumlah Item","Total Qty","Nilai Beli (HPP)","Nilai Jual","Potensi Laba","Margin (%)"],...F.map(e=>[(0,l.format)((0,r.parseISO)(e.date),"dd MMMM yyyy",{locale:o.id}),e.receipt_count,e.item_count,e.total_qty,e.total_purchase_value,e.total_selling_value,e.potential_profit,e.profit_margin.toFixed(2)])],i=c.utils.aoa_to_sheet(s);c.utils.book_append_sheet(e,i,"Per Hari");let d=[["DETAIL PENERIMAAN BARANG"],[`Periode: ${(0,l.format)((0,r.parseISO)(er.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,l.format)((0,r.parseISO)(er.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["Tanggal","No. Penerimaan","No. Faktur Supplier","Supplier","Jumlah Item","Nilai Beli (HPP)","Nilai Jual","Potensi Laba"],...L.map(e=>{let t=e.items?.reduce((e,t)=>e+t.quantity*(t.medicine?.selling_price||0),0)||0,a=t-Number(e.total_amount);return[(0,l.format)(new Date(e.receipt_date),"dd MMMM yyyy",{locale:o.id}),e.receipt_number,e.supplier_invoice_number||"-",e.supplier?.name||"-",e.items?.length||0,Number(e.total_amount)||0,t,a]})],n=c.utils.aoa_to_sheet(d);c.utils.book_append_sheet(e,n,"Detail Penerimaan");let x=[["DETAIL ITEM PENERIMAAN"],[`Periode: ${(0,l.format)((0,r.parseISO)(er.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,l.format)((0,r.parseISO)(er.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["No. Penerimaan","Tanggal","Supplier","Kode Obat","Nama Obat","Batch","Exp Date","Qty","Satuan","Harga Beli","Harga Jual","Total Beli","Potensi Jual","Laba"]];L.forEach(e=>{e.items?.forEach(t=>{let a=t.medicine?.selling_price||0,s=t.quantity*a,i=s-t.total_price;x.push([e.receipt_number,(0,l.format)(new Date(e.receipt_date),"dd/MM/yyyy"),e.supplier?.name||"-",t.medicine?.code||"-",t.medicine?.name||"-",t.batch_number,(0,l.format)(new Date(t.expiry_date),"dd/MM/yyyy"),t.quantity,t.unit,t.unit_price,a,t.total_price,s,i])})});let m=c.utils.aoa_to_sheet(x);c.utils.book_append_sheet(e,m,"Detail Item");let h=`Laporan_Penerimaan_${(0,l.format)((0,r.parseISO)(er.start_date),"yyyyMMdd")}_${(0,l.format)((0,r.parseISO)(er.end_date),"yyyyMMdd")}.xlsx`;c.writeFile(e,h),M.toast.success("Export Excel berhasil!")}catch(e){console.error("Error exporting to Excel:",e),M.toast.error("Gagal export Excel")}finally{W(!1)}},disabled:Y||U,children:[Y?(0,t.jsx)(p.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,t.jsx)(h.FileSpreadsheet,{className:"mr-2 h-4 w-4"}),"Export Excel"]})]})]}),(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,t.jsxs)($.Card,{children:[(0,t.jsxs)($.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)($.CardTitle,{className:"text-sm font-medium",children:"Total Penerimaan"}),(0,t.jsx)(N.Receipt,{className:"h-4 w-4 text-blue-500"})]}),(0,t.jsxs)($.CardContent,{children:[U?(0,t.jsx)(E.Skeleton,{className:"h-8 w-20"}):(0,t.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:z?.total_receipts||0}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Rata-rata ",z?.avg_receipts_per_day.toFixed(1)||0,"/hari"]})]})]}),(0,t.jsxs)($.Card,{children:[(0,t.jsxs)($.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)($.CardTitle,{className:"text-sm font-medium",children:"Total Pembelian (HPP)"}),(0,t.jsx)(_,{className:"h-4 w-4 text-red-500"})]}),(0,t.jsxs)($.CardContent,{children:[U?(0,t.jsx)(E.Skeleton,{className:"h-8 w-24"}):(0,t.jsx)("div",{className:"text-2xl font-bold text-red-600",children:eM(z?.total_purchase_value||0)}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Harga beli dari supplier"})]})]}),(0,t.jsxs)($.Card,{children:[(0,t.jsxs)($.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)($.CardTitle,{className:"text-sm font-medium",children:"Potensi Penjualan"}),(0,t.jsx)(g.TrendingUp,{className:"h-4 w-4 text-green-500"})]}),(0,t.jsxs)($.CardContent,{children:[U?(0,t.jsx)(E.Skeleton,{className:"h-8 w-24"}):(0,t.jsx)("div",{className:"text-2xl font-bold text-green-600",children:eM(z?.total_selling_value||0)}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Jika terjual semua"})]})]}),(0,t.jsxs)($.Card,{children:[(0,t.jsxs)($.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,t.jsx)($.CardTitle,{className:"text-sm font-medium",children:"Potensi Laba"}),(0,t.jsx)(v,{className:"h-4 w-4 text-purple-500"})]}),(0,t.jsxs)($.CardContent,{children:[U?(0,t.jsx)(E.Skeleton,{className:"h-8 w-24"}):(0,t.jsx)("div",{className:`text-2xl font-bold ${(z?.potential_profit||0)>=0?"text-green-600":"text-red-600"}`,children:eM(z?.potential_profit||0)}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Margin ",eP(z?.avg_profit_margin||0)]})]})]})]}),(0,t.jsxs)($.Card,{children:[(0,t.jsx)($.CardHeader,{className:"pb-3",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)($.CardTitle,{className:"text-base",children:"Filter Laporan"}),(0,t.jsxs)(P.Button,{variant:"ghost",size:"sm",onClick:()=>ec(!en),children:[(0,t.jsx)(m.Filter,{className:"mr-2 h-4 w-4"}),en?"Sembunyikan":"Tampilkan"]})]})}),en&&(0,t.jsxs)($.CardContent,{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(H.Label,{children:"Tanggal Mulai"}),(0,t.jsx)(S.Input,{type:"date",value:er.start_date,onChange:e=>eC("start_date",e.target.value)})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(H.Label,{children:"Tanggal Akhir"}),(0,t.jsx)(S.Input,{type:"date",value:er.end_date,onChange:e=>eC("end_date",e.target.value)})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(H.Label,{children:"Supplier"}),(0,t.jsxs)(I.Select,{value:er.supplier_id?.toString()||"all",onValueChange:e=>eC("supplier_id","all"===e?void 0:parseInt(e)),children:[(0,t.jsx)(I.SelectTrigger,{children:(0,t.jsx)(I.SelectValue,{placeholder:"Semua Supplier"})}),(0,t.jsxs)(I.SelectContent,{children:[(0,t.jsx)(I.SelectItem,{value:"all",children:"Semua Supplier"}),Q.map(e=>(0,t.jsx)(I.SelectItem,{value:e.id.toString(),children:e.name},e.id))]})]})]})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsxs)(P.Button,{onClick:()=>{ev()},children:[(0,t.jsx)(x.Search,{className:"mr-2 h-4 w-4"}),"Terapkan Filter"]}),(0,t.jsx)(P.Button,{variant:"outline",onClick:()=>{ed({start_date:(0,l.format)((0,s.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,l.format)((0,i.endOfMonth)(new Date),"yyyy-MM-dd"),supplier_id:void 0,view_mode:"daily"})},children:"Reset"})]})]})]}),(0,t.jsxs)(B.Tabs,{value:eo,onValueChange:e=>ex(e),children:[(0,t.jsxs)(B.TabsList,{children:[(0,t.jsx)(B.TabsTrigger,{value:"summary",children:"Ringkasan"}),(0,t.jsx)(B.TabsTrigger,{value:"daily",children:"Per Hari"}),(0,t.jsx)(B.TabsTrigger,{value:"detail",children:"Detail"})]}),(0,t.jsxs)(B.TabsContent,{value:"summary",className:"mt-4 space-y-4",children:[(0,t.jsxs)($.Card,{children:[(0,t.jsx)($.CardHeader,{children:(0,t.jsxs)($.CardTitle,{className:"text-base flex items-center gap-2",children:[(0,t.jsx)(f.BarChart3,{className:"h-4 w-4"}),"Analisis Laba Rugi"]})}),(0,t.jsx)($.CardContent,{children:(0,t.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Pembelian (HPP)"}),(0,t.jsx)("p",{className:"text-xl font-bold text-red-600",children:eM(z?.total_purchase_value||0)})]}),(0,t.jsx)(b.TrendingDown,{className:"h-8 w-8 text-red-400"})]}),(0,t.jsxs)("div",{className:"flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Penjualan"}),(0,t.jsx)("p",{className:"text-xl font-bold text-green-600",children:eM(z?.total_selling_value||0)})]}),(0,t.jsx)(g.TrendingUp,{className:"h-8 w-8 text-green-400"})]}),(0,t.jsxs)("div",{className:`flex justify-between items-center p-3 rounded-lg ${(z?.potential_profit||0)>=0?"bg-blue-50 dark:bg-blue-950":"bg-orange-50 dark:bg-orange-950"}`,children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(0,t.jsx)("p",{className:`text-xl font-bold ${(z?.potential_profit||0)>=0?"text-blue-600":"text-orange-600"}`,children:eM(z?.potential_profit||0)})]}),(0,t.jsx)("div",{className:`text-2xl font-bold ${(z?.potential_profit||0)>=0?"text-blue-400":"text-orange-400"}`,children:eP(z?.avg_profit_margin||0)})]})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Penerimaan"}),(0,t.jsxs)("p",{className:"text-xl font-bold",children:[z?.total_receipts||0," transaksi"]})]}),(0,t.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Item"}),(0,t.jsxs)("p",{className:"text-xl font-bold",children:[z?.total_items||0," item"]})]}),(0,t.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Quantity"}),(0,t.jsxs)("p",{className:"text-xl font-bold",children:[z?.total_qty||0," unit"]})]})]})]})})]}),(0,t.jsxs)($.Card,{children:[(0,t.jsx)($.CardHeader,{children:(0,t.jsx)($.CardTitle,{className:"text-base",children:"Ringkasan Per Supplier"})}),(0,t.jsx)($.CardContent,{children:(0,t.jsxs)(R.Table,{children:[(0,t.jsx)(R.TableHeader,{children:(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableHead,{children:"Supplier"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Penerimaan"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Jenis Obat"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Beli (HPP)"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Potensi Laba"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Margin"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,t.jsx)(R.TableBody,{children:U?[void 0,void 0,void 0].map((e,a)=>(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:8,children:(0,t.jsx)(E.Skeleton,{className:"h-10 w-full"})})},a)):z?.by_supplier.length===0?(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:8,className:"text-center py-8 text-muted-foreground",children:"Tidak ada data"})}):z?.by_supplier.map(e=>{let a=e.total_purchase_value>0?e.potential_profit/e.total_purchase_value*100:0;return(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableCell,{className:"font-medium",children:e.supplier_name}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.receipt_count}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.medicines.length}),(0,t.jsx)(R.TableCell,{className:"text-right text-red-600",children:eM(e.total_purchase_value)}),(0,t.jsx)(R.TableCell,{className:"text-right text-green-600",children:eM(e.total_selling_value)}),(0,t.jsx)(R.TableCell,{className:`text-right font-medium ${e.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:eM(e.potential_profit)}),(0,t.jsx)(R.TableCell,{className:"text-right",children:(0,t.jsx)(k.Badge,{variant:a>=20?"default":a>=10?"secondary":"destructive",children:eP(a)})}),(0,t.jsx)(R.TableCell,{className:"text-right",children:(0,t.jsx)(P.Button,{variant:"ghost",size:"icon",onClick:()=>{eN(e),e_(!0)},children:(0,t.jsx)(y.Eye,{className:"h-4 w-4"})})})]},e.supplier_id)})})]})})]})]}),(0,t.jsx)(B.TabsContent,{value:"daily",className:"mt-4",children:(0,t.jsx)($.Card,{children:(0,t.jsx)($.CardContent,{className:"p-0",children:(0,t.jsxs)(R.Table,{children:[(0,t.jsx)(R.TableHeader,{children:(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableHead,{className:"w-10"}),(0,t.jsx)(R.TableHead,{children:"Tanggal"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Penerimaan"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Qty"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Laba"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Margin"})]})}),(0,t.jsx)(R.TableBody,{children:U?[void 0,void 0,void 0,void 0,void 0].map((e,a)=>(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:8,children:(0,t.jsx)(E.Skeleton,{className:"h-12 w-full"})})},a)):0===F.length?(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:8,className:"text-center py-8",children:(0,t.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,t.jsx)(u.Calendar,{className:"h-8 w-8 text-muted-foreground"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Tidak ada penerimaan pada periode ini"})]})})}):F.map(e=>(0,t.jsxs)(a.default.Fragment,{children:[(0,t.jsxs)(R.TableRow,{className:"cursor-pointer hover:bg-muted/50",onClick:()=>{var t;let a;return t=e.date,void((a=new Set(em)).has(t)?a.delete(t):a.add(t),eh(a))},children:[(0,t.jsx)(R.TableCell,{children:(0,t.jsx)(P.Button,{variant:"ghost",size:"icon",className:"h-6 w-6",children:em.has(e.date)?(0,t.jsx)(C.ChevronUp,{className:"h-4 w-4"}):(0,t.jsx)(T.ChevronDown,{className:"h-4 w-4"})})}),(0,t.jsx)(R.TableCell,{className:"font-medium",children:(0,l.format)((0,r.parseISO)(e.date),"EEEE, dd MMMM yyyy",{locale:o.id})}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.receipt_count}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.total_qty}),(0,t.jsx)(R.TableCell,{className:"text-right text-red-600",children:eM(e.total_purchase_value)}),(0,t.jsx)(R.TableCell,{className:"text-right text-green-600",children:eM(e.total_selling_value)}),(0,t.jsx)(R.TableCell,{className:`text-right font-medium ${e.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:eM(e.potential_profit)}),(0,t.jsx)(R.TableCell,{className:"text-right",children:(0,t.jsx)(k.Badge,{variant:e.profit_margin>=20?"default":e.profit_margin>=10?"secondary":"destructive",children:eP(e.profit_margin)})})]}),em.has(e.date)&&(0,t.jsx)(R.TableRow,{className:"bg-muted/30",children:(0,t.jsx)(R.TableCell,{colSpan:8,className:"p-0",children:(0,t.jsxs)("div",{className:"p-4",children:[(0,t.jsx)("p",{className:"text-sm font-medium mb-2",children:"Detail Penerimaan:"}),(0,t.jsx)("div",{className:"space-y-2",children:e.receipts.map(e=>(0,t.jsxs)("div",{className:"flex items-center justify-between p-2 bg-background rounded border cursor-pointer hover:bg-muted/50",onClick:t=>{t.stopPropagation(),ew(e.id)},children:[(0,t.jsxs)("div",{className:"flex items-center gap-3",children:[(0,t.jsx)(N.Receipt,{className:"h-4 w-4 text-muted-foreground"}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.receipt_number}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:[e.supplier?.name," •"," ",e.items?.length||0," item"]})]})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"font-medium",children:eM(Number(e.total_amount)||0)}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.supplier_invoice_number||"-"})]})]},e.id))})]})})})]},e.date))})]})})})}),(0,t.jsx)(B.TabsContent,{value:"detail",className:"mt-4",children:(0,t.jsx)($.Card,{children:(0,t.jsx)($.CardContent,{className:"p-0",children:(0,t.jsxs)(R.Table,{children:[(0,t.jsx)(R.TableHeader,{children:(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableHead,{children:"Tanggal"}),(0,t.jsx)(R.TableHead,{children:"No. Penerimaan"}),(0,t.jsx)(R.TableHead,{children:"No. Faktur"}),(0,t.jsx)(R.TableHead,{children:"Supplier"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Item"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Laba"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,t.jsx)(R.TableBody,{children:U?[void 0,void 0,void 0,void 0,void 0].map((e,a)=>(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:9,children:(0,t.jsx)(E.Skeleton,{className:"h-12 w-full"})})},a)):0===L.length?(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:9,className:"text-center py-8",children:(0,t.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,t.jsx)(N.Receipt,{className:"h-8 w-8 text-muted-foreground"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Tidak ada penerimaan pada periode ini"})]})})}):L.map(e=>{let a=e.items?.reduce((e,t)=>e+t.quantity*(t.medicine?.selling_price||0),0)||0,s=a-e.total_amount;return(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableCell,{children:(0,l.format)(new Date(e.receipt_date),"dd MMM yyyy",{locale:o.id})}),(0,t.jsx)(R.TableCell,{className:"font-medium",children:e.receipt_number}),(0,t.jsx)(R.TableCell,{children:e.supplier_invoice_number||"-"}),(0,t.jsx)(R.TableCell,{children:e.supplier?.name}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.items?.length||0}),(0,t.jsx)(R.TableCell,{className:"text-right text-red-600",children:eM(e.total_amount)}),(0,t.jsx)(R.TableCell,{className:"text-right text-green-600",children:eM(a)}),(0,t.jsx)(R.TableCell,{className:`text-right font-medium ${s>=0?"text-blue-600":"text-orange-600"}`,children:eM(s)}),(0,t.jsx)(R.TableCell,{className:"text-right",children:(0,t.jsx)(P.Button,{variant:"ghost",size:"icon",onClick:()=>ew(e.id),children:(0,t.jsx)(y.Eye,{className:"h-4 w-4"})})})]},e.id)})})]})})})})]}),(0,t.jsx)(D.Dialog,{open:ep,onOpenChange:eu,children:(0,t.jsxs)(D.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(D.DialogHeader,{children:[(0,t.jsx)(D.DialogTitle,{children:"Detail Penerimaan Barang"}),(0,t.jsx)(D.DialogDescription,{children:eg?.receipt_number})]}),eg&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"No. Penerimaan"}),(0,t.jsx)("p",{className:"font-medium",children:eg.receipt_number})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Tanggal"}),(0,t.jsx)("p",{className:"font-medium",children:(0,l.format)(new Date(eg.receipt_date),"dd MMMM yyyy",{locale:o.id})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Supplier"}),(0,t.jsx)("p",{className:"font-medium",children:eg.supplier?.name})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"No. Faktur"}),(0,t.jsx)("p",{className:"font-medium",children:eg.supplier_invoice_number||"-"})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium mb-2",children:"Item Penerimaan"}),(0,t.jsxs)(R.Table,{children:[(0,t.jsx)(R.TableHeader,{children:(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableHead,{children:"Obat"}),(0,t.jsx)(R.TableHead,{children:"Batch"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Qty"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Harga Beli"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Harga Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Total Beli"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Potensi Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Laba"})]})}),(0,t.jsx)(R.TableBody,{children:eg.items?.map(e=>{let a=e.medicine?.selling_price||0,s=e.quantity*a,i=s-e.total_price;return(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableCell,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.medicine?.name}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:e.medicine?.code})]})}),(0,t.jsx)(R.TableCell,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{children:e.batch_number}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Exp:"," ",(0,l.format)(new Date(e.expiry_date),"dd/MM/yyyy")]})]})}),(0,t.jsxs)(R.TableCell,{className:"text-right",children:[e.quantity," ",e.unit]}),(0,t.jsx)(R.TableCell,{className:"text-right",children:eM(e.unit_price)}),(0,t.jsx)(R.TableCell,{className:"text-right",children:eM(a)}),(0,t.jsx)(R.TableCell,{className:"text-right text-red-600",children:eM(e.total_price)}),(0,t.jsx)(R.TableCell,{className:"text-right text-green-600",children:eM(s)}),(0,t.jsx)(R.TableCell,{className:`text-right font-medium ${i>=0?"text-blue-600":"text-orange-600"}`,children:eM(i)})]},e.id)})})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Pembelian"}),(0,t.jsx)("p",{className:"text-lg font-bold text-red-600",children:eM(eg.total_amount)})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Penjualan"}),(0,t.jsx)("p",{className:"text-lg font-bold text-green-600",children:eM(eg.items?.reduce((e,t)=>e+t.quantity*(t.medicine?.selling_price||0),0)||0)})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(e=(eg.items?.reduce((e,t)=>e+t.quantity*(t.medicine?.selling_price||0),0)||0)-eg.total_amount,(0,t.jsx)("p",{className:`text-lg font-bold ${e>=0?"text-blue-600":"text-orange-600"}`,children:eM(e)}))]})]})]})]})}),(0,t.jsx)(D.Dialog,{open:ej,onOpenChange:e_,children:(0,t.jsxs)(D.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(D.DialogHeader,{children:[(0,t.jsx)(D.DialogTitle,{children:"Detail Obat Per Supplier"}),(0,t.jsx)(D.DialogDescription,{children:ef?.supplier_name})]}),ef&&(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,t.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Penerimaan"}),(0,t.jsx)("p",{className:"text-xl font-bold",children:ef.receipt_count})]}),(0,t.jsxs)("div",{className:"p-3 bg-red-50 dark:bg-red-950 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Nilai Beli"}),(0,t.jsx)("p",{className:"text-xl font-bold text-red-600",children:eM(ef.total_purchase_value)})]}),(0,t.jsxs)("div",{className:"p-3 bg-green-50 dark:bg-green-950 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Nilai Jual"}),(0,t.jsx)("p",{className:"text-xl font-bold text-green-600",children:eM(ef.total_selling_value)})]}),(0,t.jsxs)("div",{className:"p-3 bg-blue-50 dark:bg-blue-950 rounded-lg",children:[(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(0,t.jsx)("p",{className:`text-xl font-bold ${ef.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:eM(ef.potential_profit)})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsxs)("p",{className:"text-sm font-medium mb-2",children:["Daftar Obat (",ef.medicines.length," jenis)"]}),(0,t.jsxs)(R.Table,{children:[(0,t.jsx)(R.TableHeader,{children:(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableHead,{children:"Kode"}),(0,t.jsx)(R.TableHead,{children:"Nama Obat"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Qty"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Satuan"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Laba"}),(0,t.jsx)(R.TableHead,{className:"text-right",children:"Margin"})]})}),(0,t.jsx)(R.TableBody,{children:0===ef.medicines.length?(0,t.jsx)(R.TableRow,{children:(0,t.jsx)(R.TableCell,{colSpan:8,className:"text-center py-8 text-muted-foreground",children:"Tidak ada data obat"})}):ef.medicines.map(e=>(0,t.jsxs)(R.TableRow,{children:[(0,t.jsx)(R.TableCell,{className:"font-mono text-sm",children:e.medicine_code}),(0,t.jsx)(R.TableCell,{className:"font-medium",children:e.medicine_name}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.total_qty}),(0,t.jsx)(R.TableCell,{className:"text-right",children:e.unit}),(0,t.jsx)(R.TableCell,{className:"text-right text-red-600",children:eM(e.total_purchase_value)}),(0,t.jsx)(R.TableCell,{className:"text-right text-green-600",children:eM(e.total_selling_value)}),(0,t.jsx)(R.TableCell,{className:`text-right font-medium ${e.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:eM(e.potential_profit)}),(0,t.jsx)(R.TableCell,{className:"text-right",children:(0,t.jsx)(k.Badge,{variant:e.profit_margin>=20?"default":e.profit_margin>=10?"secondary":"destructive",children:eP(e.profit_margin)})})]},e.medicine_id))})]})]}),ef.medicines.length>0&&(0,t.jsx)("div",{className:"flex justify-end",children:(0,t.jsxs)("div",{className:"grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg w-fit",children:[(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Qty"}),(0,t.jsx)("p",{className:"font-bold",children:ef.medicines.reduce((e,t)=>e+t.total_qty,0)})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Beli"}),(0,t.jsx)("p",{className:"font-bold text-red-600",children:eM(ef.total_purchase_value)})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Jual"}),(0,t.jsx)("p",{className:"font-bold text-green-600",children:eM(ef.total_selling_value)})]}),(0,t.jsxs)("div",{className:"text-right",children:[(0,t.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Laba"}),(0,t.jsx)("p",{className:`font-bold ${ef.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:eM(ef.potential_profit)})]})]})})]})]})})]})}e.s(["default",()=>L],91314)}]);