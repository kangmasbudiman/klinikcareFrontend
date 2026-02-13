module.exports=[81927,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(56711),e=a.i(55258),f=a.i(22658),g=a.i(60178),h=a.i(57270),i=a.i(42724),j=a.i(75750),k=a.i(93901),l=a.i(87532),m=a.i(81464),n=a.i(24722),o=a.i(96221),p=a.i(41675),q=a.i(24669),r=a.i(53277),s=a.i(70106);let t=(0,s.default)("DollarSign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);var u=a.i(39761),v=a.i(1199);let w=(0,s.default)("Percent",[["line",{x1:"19",x2:"5",y1:"5",y2:"19",key:"1x9vlm"}],["circle",{cx:"6.5",cy:"6.5",r:"2.5",key:"4mh3h7"}],["circle",{cx:"17.5",cy:"17.5",r:"2.5",key:"1mdrzq"}]]);var x=a.i(77156),y=a.i(5784),z=a.i(67552),A=a.i(71931),B=a.i(23292),C=a.i(99570),D=a.i(66718),E=a.i(70430),F=a.i(86304),G=a.i(91119),H=a.i(6015),I=a.i(14574),J=a.i(80701),K=a.i(33140),L=a.i(75083),M=a.i(85611),N=a.i(82835);function O(){let a,{settings:s}=(0,N.useClinicSettings)(),[O,P]=(0,c.useState)([]),[Q,R]=(0,c.useState)([]),[S,T]=(0,c.useState)(null),[U,V]=(0,c.useState)([]),[W,X]=(0,c.useState)(!0),[Y,Z]=(0,c.useState)(!1),[$,_]=(0,c.useState)(!1),[aa,ab]=(0,c.useState)(1),[ac,ad]=(0,c.useState)(1),[ae,af]=(0,c.useState)(0),[ag,ah]=(0,c.useState)({start_date:(0,d.format)((0,e.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,d.format)((0,f.endOfMonth)(new Date),"yyyy-MM-dd"),supplier_id:void 0,view_mode:"daily"}),[ai,aj]=(0,c.useState)(!0),[ak,al]=(0,c.useState)("summary"),[am,an]=(0,c.useState)(new Set),[ao,ap]=(0,c.useState)(!1),[aq,ar]=(0,c.useState)(null),[as,at]=(0,c.useState)(!1),[au,av]=(0,c.useState)(null),aw=(0,c.useCallback)(async()=>{X(!0);try{let a=await M.goodsReceiptService.getGoodsReceipts({status:"completed",start_date:ag.start_date,end_date:ag.end_date,supplier_id:ag.supplier_id,page:1,per_page:1e3});P(a.data),af(a.total),ax(a.data)}catch(a){console.error("Error fetching receipts:",a),B.toast.error("Gagal memuat data laporan")}finally{X(!1)}},[ag.start_date,ag.end_date,ag.supplier_id]),ax=a=>{let b=new Map;(function(a,b){let{start:c,end:d}=function(a,b){let[c,d]=(0,h.normalizeDates)(a,b.start,b.end);return{start:c,end:d}}(void 0,a),e=+c>+d,f=e?+c:+d,g=e?d:c;g.setHours(0,0,0,0);let j=(void 0)??1;if(!j)return[];j<0&&(j=-j,e=!e);let k=[];for(;+g<=f;)k.push((0,i.constructFrom)(c,g)),g.setDate(g.getDate()+j),g.setHours(0,0,0,0);return e?k.reverse():k})({start:(0,g.parseISO)(ag.start_date),end:(0,g.parseISO)(ag.end_date)}).forEach(a=>{let c=(0,d.format)(a,"yyyy-MM-dd");b.set(c,{date:c,receipt_count:0,item_count:0,total_qty:0,total_purchase_value:0,total_selling_value:0,potential_profit:0,profit_margin:0,receipts:[]})});let c=0,e=0,f=0,j=0,k=0,l=new Map,m=new Map;a.forEach(a=>{let d=a.receipt_date.split("T")[0],g=b.get(d);if(g){g.receipt_count+=1,g.receipts.push(a);let b=Number(a.total_amount)||0;g.total_purchase_value+=b;let d=0;a.items?.forEach(a=>{g.item_count+=1;let b=Number(a.quantity)||0;g.total_qty+=b;let c=Number(a.medicine?.selling_price)||0;d+=b*c}),g.total_selling_value+=d,c+=1,e+=a.items?.length||0,f+=a.items?.reduce((a,b)=>a+(Number(b.quantity)||0),0)||0,j+=b,k+=d,l.has(a.supplier_id)||l.set(a.supplier_id,{supplier_id:a.supplier_id,supplier_name:a.supplier?.name||"-",receipt_count:0,total_purchase_value:0,total_selling_value:0,potential_profit:0,medicines:[]});let h=l.get(a.supplier_id);h.receipt_count+=1,h.total_purchase_value+=b,h.total_selling_value+=d,h.potential_profit=h.total_selling_value-h.total_purchase_value,a.items?.forEach(b=>{let c=`${a.supplier_id}-${b.medicine_id}`,d=Number(b.quantity)||0,e=Number(b.unit_price)||0,f=Number(b.medicine?.selling_price)||0;m.has(c)||m.set(c,{medicine_id:b.medicine_id,medicine_name:b.medicine?.name||"-",medicine_code:b.medicine?.code||"-",total_qty:0,unit:b.unit,total_purchase_value:0,total_selling_value:0,potential_profit:0,profit_margin:0});let g=m.get(c);g.total_qty+=d,g.total_purchase_value+=d*e,g.total_selling_value+=d*f,g.potential_profit=g.total_selling_value-g.total_purchase_value,g.profit_margin=g.total_purchase_value>0?g.potential_profit/g.total_purchase_value*100:0})}}),m.forEach((a,b)=>{let c=parseInt(b.split("-")[0]),d=l.get(c);d&&d.medicines.push(a)}),l.forEach(a=>{a.medicines.sort((a,b)=>b.total_purchase_value-a.total_purchase_value)}),b.forEach(a=>{a.potential_profit=a.total_selling_value-a.total_purchase_value,a.profit_margin=a.total_purchase_value>0?a.potential_profit/a.total_purchase_value*100:0});let n=Array.from(b.values()).filter(a=>a.receipt_count>0).sort((a,b)=>b.date.localeCompare(a.date));R(n);let o=k-j,p=j>0?o/j*100:0,q=n.length,r=q>0?c/q:0;T({total_receipts:c,total_items:e,total_qty:f,total_purchase_value:j,total_selling_value:k,potential_profit:o,avg_profit_margin:p,avg_receipts_per_day:r,by_supplier:Array.from(l.values()).sort((a,b)=>b.total_purchase_value-a.total_purchase_value)})},ay=async()=>{try{let a=await M.supplierService.getActiveSuppliers();V(a.data)}catch(a){console.error("Error fetching suppliers:",a)}};(0,c.useEffect)(()=>{ay()},[]),(0,c.useEffect)(()=>{aw()},[aw]);let az=(a,b)=>{ah(c=>({...c,[a]:b}))},aA=async a=>{try{let b=await M.goodsReceiptService.getGoodsReceiptById(a);ar(b),ap(!0)}catch(a){B.toast.error("Gagal memuat detail")}},aB=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),aC=a=>`${a.toFixed(1)}%`;return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-2xl font-bold tracking-tight",children:"Laporan Penerimaan"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Analisis penerimaan barang dan potensi laba rugi"})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(C.Button,{variant:"outline",onClick:()=>{if(0===O.length)return void B.toast.error("Tidak ada data untuk dicetak");_(!0);try{let a=s?.name||"Klinik App",b=s?.address||"",c=s?.phone||"",e=s?.logo_url||"",f=window.open("","_blank");if(!f){B.toast.error("Popup diblokir. Izinkan popup untuk mencetak."),_(!1);return}let h=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),i=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Laporan Penerimaan - ${a}</title>
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
            ${e?`<img src="${e}" alt="${a}" class="logo" />`:'<div class="logo-placeholder">+</div>'}
            <div class="clinic-info">
              <div class="clinic-name">${a}</div>
              <div class="clinic-address">
                ${b?b+"<br/>":""}
                ${c?"Telp: "+c:""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN PENERIMAAN BARANG</h1>
            <p>Periode: ${(0,d.format)((0,g.parseISO)(ag.start_date),"dd MMMM yyyy",{locale:k.id})} - ${(0,d.format)((0,g.parseISO)(ag.end_date),"dd MMMM yyyy",{locale:k.id})}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Penerimaan</div>
              <div class="value blue">${S?.total_receipts||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pembelian (HPP)</div>
              <div class="value red">${h(S?.total_purchase_value||0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Penjualan</div>
              <div class="value green">${h(S?.total_selling_value||0)}</div>
            </div>
            <div class="summary-card">
              <div class="label">Potensi Laba (${(S?.avg_profit_margin||0).toFixed(1)}%)</div>
              <div class="value purple">${h(S?.potential_profit||0)}</div>
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
                ${S?.by_supplier.map(a=>{let b=a.total_purchase_value>0?(a.potential_profit/a.total_purchase_value*100).toFixed(1):"0";return`
                        <tr>
                          <td>${a.supplier_name}</td>
                          <td class="text-center">${a.receipt_count}</td>
                          <td class="text-center">${a.medicines.length}</td>
                          <td class="text-right text-red">${h(a.total_purchase_value)}</td>
                          <td class="text-right text-green">${h(a.total_selling_value)}</td>
                          <td class="text-right text-blue font-bold">${h(a.potential_profit)}</td>
                          <td class="text-center">${b}%</td>
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
                ${O.map(a=>{let b=a.items?.reduce((a,b)=>a+b.quantity*(b.medicine?.selling_price||0),0)||0,c=b-Number(a.total_amount);return`
                        <tr>
                          <td>${(0,d.format)(new Date(a.receipt_date),"dd/MM/yyyy")}</td>
                          <td>${a.receipt_number}</td>
                          <td>${a.supplier_invoice_number||"-"}</td>
                          <td>${a.supplier?.name||"-"}</td>
                          <td class="text-center">${a.items?.length||0}</td>
                          <td class="text-right text-red">${h(Number(a.total_amount)||0)}</td>
                          <td class="text-right text-green">${h(b)}</td>
                          <td class="text-right text-blue font-bold">${h(c)}</td>
                        </tr>
                      `}).join("")||'<tr><td colspan="8" class="text-center">Tidak ada data</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="footer">
            <div>Dicetak pada: ${(0,d.format)(new Date,"dd MMMM yyyy HH:mm",{locale:k.id})}</div>
            <div>${a}</div>
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
      `;f.document.write(i),f.document.close(),B.toast.success("Menyiapkan halaman cetak...")}catch(a){console.error("Error printing:",a),B.toast.error("Gagal mencetak")}finally{_(!1)}},disabled:$||W,children:[$?(0,b.jsx)(o.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(A.Printer,{className:"mr-2 h-4 w-4"}),"Print"]}),(0,b.jsxs)(C.Button,{onClick:()=>{if(0===O.length)return void B.toast.error("Tidak ada data untuk di-export");Z(!0);try{let a=j.utils.book_new(),b=[["LAPORAN PENERIMAAN BARANG"],[`Periode: ${(0,d.format)((0,g.parseISO)(ag.start_date),"dd MMMM yyyy",{locale:k.id})} - ${(0,d.format)((0,g.parseISO)(ag.end_date),"dd MMMM yyyy",{locale:k.id})}`],[],["RINGKASAN"],["Total Penerimaan",S?.total_receipts||0],["Total Item",S?.total_items||0],["Total Quantity",S?.total_qty||0],["Total Pembelian (HPP)",S?.total_purchase_value||0],["Potensi Penjualan",S?.total_selling_value||0],["Potensi Laba",S?.potential_profit||0],["Rata-rata Margin (%)",S?.avg_profit_margin?.toFixed(2)||0],[],["RINGKASAN PER SUPPLIER"],["Supplier","Jumlah Penerimaan","Jenis Obat","Nilai Beli (HPP)","Nilai Jual","Potensi Laba","Margin (%)"],...S?.by_supplier.map(a=>[a.supplier_name,a.receipt_count,a.medicines.length,a.total_purchase_value,a.total_selling_value,a.potential_profit,a.total_purchase_value>0?(a.potential_profit/a.total_purchase_value*100).toFixed(2):"0"])||[]],c=j.utils.aoa_to_sheet(b);j.utils.book_append_sheet(a,c,"Ringkasan");let e=[["LAPORAN PENERIMAAN PER HARI"],[`Periode: ${(0,d.format)((0,g.parseISO)(ag.start_date),"dd MMMM yyyy",{locale:k.id})} - ${(0,d.format)((0,g.parseISO)(ag.end_date),"dd MMMM yyyy",{locale:k.id})}`],[],["Tanggal","Jumlah Penerimaan","Jumlah Item","Total Qty","Nilai Beli (HPP)","Nilai Jual","Potensi Laba","Margin (%)"],...Q.map(a=>[(0,d.format)((0,g.parseISO)(a.date),"dd MMMM yyyy",{locale:k.id}),a.receipt_count,a.item_count,a.total_qty,a.total_purchase_value,a.total_selling_value,a.potential_profit,a.profit_margin.toFixed(2)])],f=j.utils.aoa_to_sheet(e);j.utils.book_append_sheet(a,f,"Per Hari");let h=[["DETAIL PENERIMAAN BARANG"],[`Periode: ${(0,d.format)((0,g.parseISO)(ag.start_date),"dd MMMM yyyy",{locale:k.id})} - ${(0,d.format)((0,g.parseISO)(ag.end_date),"dd MMMM yyyy",{locale:k.id})}`],[],["Tanggal","No. Penerimaan","No. Faktur Supplier","Supplier","Jumlah Item","Nilai Beli (HPP)","Nilai Jual","Potensi Laba"],...O.map(a=>{let b=a.items?.reduce((a,b)=>a+b.quantity*(b.medicine?.selling_price||0),0)||0,c=b-Number(a.total_amount);return[(0,d.format)(new Date(a.receipt_date),"dd MMMM yyyy",{locale:k.id}),a.receipt_number,a.supplier_invoice_number||"-",a.supplier?.name||"-",a.items?.length||0,Number(a.total_amount)||0,b,c]})],i=j.utils.aoa_to_sheet(h);j.utils.book_append_sheet(a,i,"Detail Penerimaan");let l=[["DETAIL ITEM PENERIMAAN"],[`Periode: ${(0,d.format)((0,g.parseISO)(ag.start_date),"dd MMMM yyyy",{locale:k.id})} - ${(0,d.format)((0,g.parseISO)(ag.end_date),"dd MMMM yyyy",{locale:k.id})}`],[],["No. Penerimaan","Tanggal","Supplier","Kode Obat","Nama Obat","Batch","Exp Date","Qty","Satuan","Harga Beli","Harga Jual","Total Beli","Potensi Jual","Laba"]];O.forEach(a=>{a.items?.forEach(b=>{let c=b.medicine?.selling_price||0,e=b.quantity*c,f=e-b.total_price;l.push([a.receipt_number,(0,d.format)(new Date(a.receipt_date),"dd/MM/yyyy"),a.supplier?.name||"-",b.medicine?.code||"-",b.medicine?.name||"-",b.batch_number,(0,d.format)(new Date(b.expiry_date),"dd/MM/yyyy"),b.quantity,b.unit,b.unit_price,c,b.total_price,e,f])})});let m=j.utils.aoa_to_sheet(l);j.utils.book_append_sheet(a,m,"Detail Item");let n=`Laporan_Penerimaan_${(0,d.format)((0,g.parseISO)(ag.start_date),"yyyyMMdd")}_${(0,d.format)((0,g.parseISO)(ag.end_date),"yyyyMMdd")}.xlsx`;j.writeFile(a,n),B.toast.success("Export Excel berhasil!")}catch(a){console.error("Error exporting to Excel:",a),B.toast.error("Gagal export Excel")}finally{Z(!1)}},disabled:Y||W,children:[Y?(0,b.jsx)(o.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,b.jsx)(n.FileSpreadsheet,{className:"mr-2 h-4 w-4"}),"Export Excel"]})]})]}),(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-4",children:[(0,b.jsxs)(G.Card,{children:[(0,b.jsxs)(G.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(G.CardTitle,{className:"text-sm font-medium",children:"Total Penerimaan"}),(0,b.jsx)(v.Receipt,{className:"h-4 w-4 text-blue-500"})]}),(0,b.jsxs)(G.CardContent,{children:[W?(0,b.jsx)(K.Skeleton,{className:"h-8 w-20"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-blue-600",children:S?.total_receipts||0}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Rata-rata ",S?.avg_receipts_per_day.toFixed(1)||0,"/hari"]})]})]}),(0,b.jsxs)(G.Card,{children:[(0,b.jsxs)(G.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(G.CardTitle,{className:"text-sm font-medium",children:"Total Pembelian (HPP)"}),(0,b.jsx)(t,{className:"h-4 w-4 text-red-500"})]}),(0,b.jsxs)(G.CardContent,{children:[W?(0,b.jsx)(K.Skeleton,{className:"h-8 w-24"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-red-600",children:aB(S?.total_purchase_value||0)}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Harga beli dari supplier"})]})]}),(0,b.jsxs)(G.Card,{children:[(0,b.jsxs)(G.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(G.CardTitle,{className:"text-sm font-medium",children:"Potensi Penjualan"}),(0,b.jsx)(q.TrendingUp,{className:"h-4 w-4 text-green-500"})]}),(0,b.jsxs)(G.CardContent,{children:[W?(0,b.jsx)(K.Skeleton,{className:"h-8 w-24"}):(0,b.jsx)("div",{className:"text-2xl font-bold text-green-600",children:aB(S?.total_selling_value||0)}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Jika terjual semua"})]})]}),(0,b.jsxs)(G.Card,{children:[(0,b.jsxs)(G.CardHeader,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[(0,b.jsx)(G.CardTitle,{className:"text-sm font-medium",children:"Potensi Laba"}),(0,b.jsx)(w,{className:"h-4 w-4 text-purple-500"})]}),(0,b.jsxs)(G.CardContent,{children:[W?(0,b.jsx)(K.Skeleton,{className:"h-8 w-24"}):(0,b.jsx)("div",{className:`text-2xl font-bold ${(S?.potential_profit||0)>=0?"text-green-600":"text-red-600"}`,children:aB(S?.potential_profit||0)}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Margin ",aC(S?.avg_profit_margin||0)]})]})]})]}),(0,b.jsxs)(G.Card,{children:[(0,b.jsx)(G.CardHeader,{className:"pb-3",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsx)(G.CardTitle,{className:"text-base",children:"Filter Laporan"}),(0,b.jsxs)(C.Button,{variant:"ghost",size:"sm",onClick:()=>aj(!ai),children:[(0,b.jsx)(m.Filter,{className:"mr-2 h-4 w-4"}),ai?"Sembunyikan":"Tampilkan"]})]})}),ai&&(0,b.jsxs)(G.CardContent,{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid gap-4 md:grid-cols-3",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(E.Label,{children:"Tanggal Mulai"}),(0,b.jsx)(D.Input,{type:"date",value:ag.start_date,onChange:a=>az("start_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(E.Label,{children:"Tanggal Akhir"}),(0,b.jsx)(D.Input,{type:"date",value:ag.end_date,onChange:a=>az("end_date",a.target.value)})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)(E.Label,{children:"Supplier"}),(0,b.jsxs)(J.Select,{value:ag.supplier_id?.toString()||"all",onValueChange:a=>az("supplier_id","all"===a?void 0:parseInt(a)),children:[(0,b.jsx)(J.SelectTrigger,{children:(0,b.jsx)(J.SelectValue,{placeholder:"Semua Supplier"})}),(0,b.jsxs)(J.SelectContent,{children:[(0,b.jsx)(J.SelectItem,{value:"all",children:"Semua Supplier"}),U.map(a=>(0,b.jsx)(J.SelectItem,{value:a.id.toString(),children:a.name},a.id))]})]})]})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(C.Button,{onClick:()=>{aw()},children:[(0,b.jsx)(l.Search,{className:"mr-2 h-4 w-4"}),"Terapkan Filter"]}),(0,b.jsx)(C.Button,{variant:"outline",onClick:()=>{ah({start_date:(0,d.format)((0,e.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,d.format)((0,f.endOfMonth)(new Date),"yyyy-MM-dd"),supplier_id:void 0,view_mode:"daily"})},children:"Reset"})]})]})]}),(0,b.jsxs)(L.Tabs,{value:ak,onValueChange:a=>al(a),children:[(0,b.jsxs)(L.TabsList,{children:[(0,b.jsx)(L.TabsTrigger,{value:"summary",children:"Ringkasan"}),(0,b.jsx)(L.TabsTrigger,{value:"daily",children:"Per Hari"}),(0,b.jsx)(L.TabsTrigger,{value:"detail",children:"Detail"})]}),(0,b.jsxs)(L.TabsContent,{value:"summary",className:"mt-4 space-y-4",children:[(0,b.jsxs)(G.Card,{children:[(0,b.jsx)(G.CardHeader,{children:(0,b.jsxs)(G.CardTitle,{className:"text-base flex items-center gap-2",children:[(0,b.jsx)(u.BarChart3,{className:"h-4 w-4"}),"Analisis Laba Rugi"]})}),(0,b.jsx)(G.CardContent,{children:(0,b.jsxs)("div",{className:"grid gap-6 md:grid-cols-2",children:[(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"flex justify-between items-center p-3 bg-red-50 dark:bg-red-950 rounded-lg",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Pembelian (HPP)"}),(0,b.jsx)("p",{className:"text-xl font-bold text-red-600",children:aB(S?.total_purchase_value||0)})]}),(0,b.jsx)(r.TrendingDown,{className:"h-8 w-8 text-red-400"})]}),(0,b.jsxs)("div",{className:"flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Penjualan"}),(0,b.jsx)("p",{className:"text-xl font-bold text-green-600",children:aB(S?.total_selling_value||0)})]}),(0,b.jsx)(q.TrendingUp,{className:"h-8 w-8 text-green-400"})]}),(0,b.jsxs)("div",{className:`flex justify-between items-center p-3 rounded-lg ${(S?.potential_profit||0)>=0?"bg-blue-50 dark:bg-blue-950":"bg-orange-50 dark:bg-orange-950"}`,children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(0,b.jsx)("p",{className:`text-xl font-bold ${(S?.potential_profit||0)>=0?"text-blue-600":"text-orange-600"}`,children:aB(S?.potential_profit||0)})]}),(0,b.jsx)("div",{className:`text-2xl font-bold ${(S?.potential_profit||0)>=0?"text-blue-400":"text-orange-400"}`,children:aC(S?.avg_profit_margin||0)})]})]}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Penerimaan"}),(0,b.jsxs)("p",{className:"text-xl font-bold",children:[S?.total_receipts||0," transaksi"]})]}),(0,b.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Item"}),(0,b.jsxs)("p",{className:"text-xl font-bold",children:[S?.total_items||0," item"]})]}),(0,b.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Quantity"}),(0,b.jsxs)("p",{className:"text-xl font-bold",children:[S?.total_qty||0," unit"]})]})]})]})})]}),(0,b.jsxs)(G.Card,{children:[(0,b.jsx)(G.CardHeader,{children:(0,b.jsx)(G.CardTitle,{className:"text-base",children:"Ringkasan Per Supplier"})}),(0,b.jsx)(G.CardContent,{children:(0,b.jsxs)(H.Table,{children:[(0,b.jsx)(H.TableHeader,{children:(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableHead,{children:"Supplier"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Penerimaan"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Jenis Obat"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Beli (HPP)"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Potensi Laba"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Margin"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,b.jsx)(H.TableBody,{children:W?[void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:8,children:(0,b.jsx)(K.Skeleton,{className:"h-10 w-full"})})},c)):S?.by_supplier.length===0?(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:8,className:"text-center py-8 text-muted-foreground",children:"Tidak ada data"})}):S?.by_supplier.map(a=>{let c=a.total_purchase_value>0?a.potential_profit/a.total_purchase_value*100:0;return(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableCell,{className:"font-medium",children:a.supplier_name}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.receipt_count}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.medicines.length}),(0,b.jsx)(H.TableCell,{className:"text-right text-red-600",children:aB(a.total_purchase_value)}),(0,b.jsx)(H.TableCell,{className:"text-right text-green-600",children:aB(a.total_selling_value)}),(0,b.jsx)(H.TableCell,{className:`text-right font-medium ${a.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:aB(a.potential_profit)}),(0,b.jsx)(H.TableCell,{className:"text-right",children:(0,b.jsx)(F.Badge,{variant:c>=20?"default":c>=10?"secondary":"destructive",children:aC(c)})}),(0,b.jsx)(H.TableCell,{className:"text-right",children:(0,b.jsx)(C.Button,{variant:"ghost",size:"icon",onClick:()=>{av(a),at(!0)},children:(0,b.jsx)(x.Eye,{className:"h-4 w-4"})})})]},a.supplier_id)})})]})})]})]}),(0,b.jsx)(L.TabsContent,{value:"daily",className:"mt-4",children:(0,b.jsx)(G.Card,{children:(0,b.jsx)(G.CardContent,{className:"p-0",children:(0,b.jsxs)(H.Table,{children:[(0,b.jsx)(H.TableHeader,{children:(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableHead,{className:"w-10"}),(0,b.jsx)(H.TableHead,{children:"Tanggal"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Penerimaan"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Qty"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Laba"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Margin"})]})}),(0,b.jsx)(H.TableBody,{children:W?[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:8,children:(0,b.jsx)(K.Skeleton,{className:"h-12 w-full"})})},c)):0===Q.length?(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:8,className:"text-center py-8",children:(0,b.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,b.jsx)(p.Calendar,{className:"h-8 w-8 text-muted-foreground"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Tidak ada penerimaan pada periode ini"})]})})}):Q.map(a=>(0,b.jsxs)(c.default.Fragment,{children:[(0,b.jsxs)(H.TableRow,{className:"cursor-pointer hover:bg-muted/50",onClick:()=>{var b;let c;return b=a.date,void((c=new Set(am)).has(b)?c.delete(b):c.add(b),an(c))},children:[(0,b.jsx)(H.TableCell,{children:(0,b.jsx)(C.Button,{variant:"ghost",size:"icon",className:"h-6 w-6",children:am.has(a.date)?(0,b.jsx)(z.ChevronUp,{className:"h-4 w-4"}):(0,b.jsx)(y.ChevronDown,{className:"h-4 w-4"})})}),(0,b.jsx)(H.TableCell,{className:"font-medium",children:(0,d.format)((0,g.parseISO)(a.date),"EEEE, dd MMMM yyyy",{locale:k.id})}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.receipt_count}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.total_qty}),(0,b.jsx)(H.TableCell,{className:"text-right text-red-600",children:aB(a.total_purchase_value)}),(0,b.jsx)(H.TableCell,{className:"text-right text-green-600",children:aB(a.total_selling_value)}),(0,b.jsx)(H.TableCell,{className:`text-right font-medium ${a.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:aB(a.potential_profit)}),(0,b.jsx)(H.TableCell,{className:"text-right",children:(0,b.jsx)(F.Badge,{variant:a.profit_margin>=20?"default":a.profit_margin>=10?"secondary":"destructive",children:aC(a.profit_margin)})})]}),am.has(a.date)&&(0,b.jsx)(H.TableRow,{className:"bg-muted/30",children:(0,b.jsx)(H.TableCell,{colSpan:8,className:"p-0",children:(0,b.jsxs)("div",{className:"p-4",children:[(0,b.jsx)("p",{className:"text-sm font-medium mb-2",children:"Detail Penerimaan:"}),(0,b.jsx)("div",{className:"space-y-2",children:a.receipts.map(a=>(0,b.jsxs)("div",{className:"flex items-center justify-between p-2 bg-background rounded border cursor-pointer hover:bg-muted/50",onClick:b=>{b.stopPropagation(),aA(a.id)},children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(v.Receipt,{className:"h-4 w-4 text-muted-foreground"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium",children:a.receipt_number}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground",children:[a.supplier?.name," •"," ",a.items?.length||0," item"]})]})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("p",{className:"font-medium",children:aB(Number(a.total_amount)||0)}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:a.supplier_invoice_number||"-"})]})]},a.id))})]})})})]},a.date))})]})})})}),(0,b.jsx)(L.TabsContent,{value:"detail",className:"mt-4",children:(0,b.jsx)(G.Card,{children:(0,b.jsx)(G.CardContent,{className:"p-0",children:(0,b.jsxs)(H.Table,{children:[(0,b.jsx)(H.TableHeader,{children:(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableHead,{children:"Tanggal"}),(0,b.jsx)(H.TableHead,{children:"No. Penerimaan"}),(0,b.jsx)(H.TableHead,{children:"No. Faktur"}),(0,b.jsx)(H.TableHead,{children:"Supplier"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Item"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Laba"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,b.jsx)(H.TableBody,{children:W?[void 0,void 0,void 0,void 0,void 0].map((a,c)=>(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:9,children:(0,b.jsx)(K.Skeleton,{className:"h-12 w-full"})})},c)):0===O.length?(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:9,className:"text-center py-8",children:(0,b.jsxs)("div",{className:"flex flex-col items-center gap-2",children:[(0,b.jsx)(v.Receipt,{className:"h-8 w-8 text-muted-foreground"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Tidak ada penerimaan pada periode ini"})]})})}):O.map(a=>{let c=a.items?.reduce((a,b)=>a+b.quantity*(b.medicine?.selling_price||0),0)||0,e=c-a.total_amount;return(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableCell,{children:(0,d.format)(new Date(a.receipt_date),"dd MMM yyyy",{locale:k.id})}),(0,b.jsx)(H.TableCell,{className:"font-medium",children:a.receipt_number}),(0,b.jsx)(H.TableCell,{children:a.supplier_invoice_number||"-"}),(0,b.jsx)(H.TableCell,{children:a.supplier?.name}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.items?.length||0}),(0,b.jsx)(H.TableCell,{className:"text-right text-red-600",children:aB(a.total_amount)}),(0,b.jsx)(H.TableCell,{className:"text-right text-green-600",children:aB(c)}),(0,b.jsx)(H.TableCell,{className:`text-right font-medium ${e>=0?"text-blue-600":"text-orange-600"}`,children:aB(e)}),(0,b.jsx)(H.TableCell,{className:"text-right",children:(0,b.jsx)(C.Button,{variant:"ghost",size:"icon",onClick:()=>aA(a.id),children:(0,b.jsx)(x.Eye,{className:"h-4 w-4"})})})]},a.id)})})]})})})})]}),(0,b.jsx)(I.Dialog,{open:ao,onOpenChange:ap,children:(0,b.jsxs)(I.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)(I.DialogHeader,{children:[(0,b.jsx)(I.DialogTitle,{children:"Detail Penerimaan Barang"}),(0,b.jsx)(I.DialogDescription,{children:aq?.receipt_number})]}),aq&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"No. Penerimaan"}),(0,b.jsx)("p",{className:"font-medium",children:aq.receipt_number})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Tanggal"}),(0,b.jsx)("p",{className:"font-medium",children:(0,d.format)(new Date(aq.receipt_date),"dd MMMM yyyy",{locale:k.id})})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Supplier"}),(0,b.jsx)("p",{className:"font-medium",children:aq.supplier?.name})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"No. Faktur"}),(0,b.jsx)("p",{className:"font-medium",children:aq.supplier_invoice_number||"-"})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium mb-2",children:"Item Penerimaan"}),(0,b.jsxs)(H.Table,{children:[(0,b.jsx)(H.TableHeader,{children:(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableHead,{children:"Obat"}),(0,b.jsx)(H.TableHead,{children:"Batch"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Qty"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Harga Beli"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Harga Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Total Beli"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Potensi Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Laba"})]})}),(0,b.jsx)(H.TableBody,{children:aq.items?.map(a=>{let c=a.medicine?.selling_price||0,e=a.quantity*c,f=e-a.total_price;return(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableCell,{children:(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium",children:a.medicine?.name}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:a.medicine?.code})]})}),(0,b.jsx)(H.TableCell,{children:(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{children:a.batch_number}),(0,b.jsxs)("p",{className:"text-xs text-muted-foreground",children:["Exp:"," ",(0,d.format)(new Date(a.expiry_date),"dd/MM/yyyy")]})]})}),(0,b.jsxs)(H.TableCell,{className:"text-right",children:[a.quantity," ",a.unit]}),(0,b.jsx)(H.TableCell,{className:"text-right",children:aB(a.unit_price)}),(0,b.jsx)(H.TableCell,{className:"text-right",children:aB(c)}),(0,b.jsx)(H.TableCell,{className:"text-right text-red-600",children:aB(a.total_price)}),(0,b.jsx)(H.TableCell,{className:"text-right text-green-600",children:aB(e)}),(0,b.jsx)(H.TableCell,{className:`text-right font-medium ${f>=0?"text-blue-600":"text-orange-600"}`,children:aB(f)})]},a.id)})})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Pembelian"}),(0,b.jsx)("p",{className:"text-lg font-bold text-red-600",children:aB(aq.total_amount)})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Penjualan"}),(0,b.jsx)("p",{className:"text-lg font-bold text-green-600",children:aB(aq.items?.reduce((a,b)=>a+b.quantity*(b.medicine?.selling_price||0),0)||0)})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(a=(aq.items?.reduce((a,b)=>a+b.quantity*(b.medicine?.selling_price||0),0)||0)-aq.total_amount,(0,b.jsx)("p",{className:`text-lg font-bold ${a>=0?"text-blue-600":"text-orange-600"}`,children:aB(a)}))]})]})]})]})}),(0,b.jsx)(I.Dialog,{open:as,onOpenChange:at,children:(0,b.jsxs)(I.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)(I.DialogHeader,{children:[(0,b.jsx)(I.DialogTitle,{children:"Detail Obat Per Supplier"}),(0,b.jsx)(I.DialogDescription,{children:au?.supplier_name})]}),au&&(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-4",children:[(0,b.jsxs)("div",{className:"p-3 bg-muted rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Total Penerimaan"}),(0,b.jsx)("p",{className:"text-xl font-bold",children:au.receipt_count})]}),(0,b.jsxs)("div",{className:"p-3 bg-red-50 dark:bg-red-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Nilai Beli"}),(0,b.jsx)("p",{className:"text-xl font-bold text-red-600",children:aB(au.total_purchase_value)})]}),(0,b.jsxs)("div",{className:"p-3 bg-green-50 dark:bg-green-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Nilai Jual"}),(0,b.jsx)("p",{className:"text-xl font-bold text-green-600",children:aB(au.total_selling_value)})]}),(0,b.jsxs)("div",{className:"p-3 bg-blue-50 dark:bg-blue-950 rounded-lg",children:[(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:"Potensi Laba"}),(0,b.jsx)("p",{className:`text-xl font-bold ${au.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:aB(au.potential_profit)})]})]}),(0,b.jsxs)("div",{children:[(0,b.jsxs)("p",{className:"text-sm font-medium mb-2",children:["Daftar Obat (",au.medicines.length," jenis)"]}),(0,b.jsxs)(H.Table,{children:[(0,b.jsx)(H.TableHeader,{children:(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableHead,{children:"Kode"}),(0,b.jsx)(H.TableHead,{children:"Nama Obat"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Qty"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Satuan"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Beli"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Nilai Jual"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Laba"}),(0,b.jsx)(H.TableHead,{className:"text-right",children:"Margin"})]})}),(0,b.jsx)(H.TableBody,{children:0===au.medicines.length?(0,b.jsx)(H.TableRow,{children:(0,b.jsx)(H.TableCell,{colSpan:8,className:"text-center py-8 text-muted-foreground",children:"Tidak ada data obat"})}):au.medicines.map(a=>(0,b.jsxs)(H.TableRow,{children:[(0,b.jsx)(H.TableCell,{className:"font-mono text-sm",children:a.medicine_code}),(0,b.jsx)(H.TableCell,{className:"font-medium",children:a.medicine_name}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.total_qty}),(0,b.jsx)(H.TableCell,{className:"text-right",children:a.unit}),(0,b.jsx)(H.TableCell,{className:"text-right text-red-600",children:aB(a.total_purchase_value)}),(0,b.jsx)(H.TableCell,{className:"text-right text-green-600",children:aB(a.total_selling_value)}),(0,b.jsx)(H.TableCell,{className:`text-right font-medium ${a.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:aB(a.potential_profit)}),(0,b.jsx)(H.TableCell,{className:"text-right",children:(0,b.jsx)(F.Badge,{variant:a.profit_margin>=20?"default":a.profit_margin>=10?"secondary":"destructive",children:aC(a.profit_margin)})})]},a.medicine_id))})]})]}),au.medicines.length>0&&(0,b.jsx)("div",{className:"flex justify-end",children:(0,b.jsxs)("div",{className:"grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg w-fit",children:[(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Qty"}),(0,b.jsx)("p",{className:"font-bold",children:au.medicines.reduce((a,b)=>a+b.total_qty,0)})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Beli"}),(0,b.jsx)("p",{className:"font-bold text-red-600",children:aB(au.total_purchase_value)})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Jual"}),(0,b.jsx)("p",{className:"font-bold text-green-600",children:aB(au.total_selling_value)})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Total Laba"}),(0,b.jsx)("p",{className:`font-bold ${au.potential_profit>=0?"text-blue-600":"text-orange-600"}`,children:aB(au.potential_profit)})]})]})})]})]})})]})}a.s(["default",()=>O],81927)}];

//# sourceMappingURL=src_app_%28dashboard%29_pharmacy_reports_receipts_page_tsx_2db99c05._.js.map