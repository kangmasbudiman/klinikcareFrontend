(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,15288,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75157);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("rounded-xl border bg-card text-card-foreground shadow",e),...a}));i.displayName="Card";let n=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("flex flex-col space-y-1.5 p-6",e),...a}));n.displayName="CardHeader";let s=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("font-semibold leading-none tracking-tight",e),...a}));s.displayName="CardTitle";let l=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("text-sm text-muted-foreground",e),...a}));l.displayName="CardDescription";let o=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("p-6 pt-0",e),...a}));o.displayName="CardContent",a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{ref:i,className:(0,r.cn)("flex items-center p-6 pt-0",e),...a})).displayName="CardFooter",e.s(["Card",()=>i,"CardContent",()=>o,"CardDescription",()=>l,"CardHeader",()=>n,"CardTitle",()=>s])},87486,e=>{"use strict";var t=e.i(43476),a=e.i(25913),r=e.i(75157);let i=(0,a.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",success:"border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",warning:"border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",error:"border-transparent bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",info:"border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",super_admin:"border-transparent bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",admin_klinik:"border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",dokter:"border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",perawat:"border-transparent bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",kasir:"border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",apoteker:"border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",pasien:"border-transparent bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}},defaultVariants:{variant:"default"}});function n({className:e,variant:a,...n}){return(0,t.jsx)("div",{className:(0,r.cn)(i({variant:a}),e),...n})}e.s(["Badge",()=>n])},76639,26999,e=>{"use strict";let t,a;var r,i=e.i(43476),n=e.i(71645),s=e.i(81140),l=e.i(20783),o=e.i(10772),d=e.i(69340),c=e.i(26330),p=e.i(65491),m=e.i(74606),u=e.i(96626);function x(e){var t;let a,r=(t=e,(a=n.forwardRef((e,t)=>{let{children:a,...r}=e;if(n.isValidElement(a)){var i;let e,s,o=(i=a,(s=(e=Object.getOwnPropertyDescriptor(i.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?i.ref:(s=(e=Object.getOwnPropertyDescriptor(i,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?i.props.ref:i.props.ref||i.ref),d=function(e,t){let a={...t};for(let r in t){let i=e[r],n=t[r];/^on[A-Z]/.test(r)?i&&n?a[r]=(...e)=>{let t=n(...e);return i(...e),t}:i&&(a[r]=i):"style"===r?a[r]={...i,...n}:"className"===r&&(a[r]=[i,n].filter(Boolean).join(" "))}return{...e,...a}}(r,a.props);return a.type!==n.Fragment&&(d.ref=t?(0,l.composeRefs)(t,o):o),n.cloneElement(a,d)}return n.Children.count(a)>1?n.Children.only(null):null})).displayName=`${t}.SlotClone`,a),s=n.forwardRef((e,t)=>{let{children:a,...s}=e,l=n.Children.toArray(a),o=l.find(f);if(o){let e=o.props.children,a=l.map(t=>t!==o?t:n.Children.count(e)>1?n.Children.only(null):n.isValidElement(e)?e.props.children:null);return(0,i.jsx)(r,{...s,ref:t,children:n.isValidElement(e)?n.cloneElement(e,void 0,a):null})}return(0,i.jsx)(r,{...s,ref:t,children:a})});return s.displayName=`${e}.Slot`,s}e.i(74080);var g=Symbol("radix.slottable");function f(e){return n.isValidElement(e)&&"function"==typeof e.type&&"__radixId"in e.type&&e.type.__radixId===g}var h=["a","button","div","form","h2","h3","img","input","label","li","nav","ol","p","select","span","svg","ul"].reduce((e,t)=>{let a=x(`Primitive.${t}`),r=n.forwardRef((e,r)=>{let{asChild:n,...s}=e;return"u">typeof window&&(window[Symbol.for("radix-ui")]=!0),(0,i.jsx)(n?a:t,{...s,ref:r})});return r.displayName=`Primitive.${t}`,{...e,[t]:r}},{}),y=e.i(3536),b=e.i(85369),v=e.i(86312),j="Dialog",[w,_]=function(e,t=[]){let a=[],r=()=>{let t=a.map(e=>n.createContext(e));return function(a){let r=a?.[e]||t;return n.useMemo(()=>({[`__scope${e}`]:{...a,[e]:r}}),[a,r])}};return r.scopeName=e,[function(t,r){let s=n.createContext(r),l=a.length;a=[...a,r];let o=t=>{let{scope:a,children:r,...o}=t,d=a?.[e]?.[l]||s,c=n.useMemo(()=>o,Object.values(o));return(0,i.jsx)(d.Provider,{value:c,children:r})};return o.displayName=t+"Provider",[o,function(a,i){let o=i?.[e]?.[l]||s,d=n.useContext(o);if(d)return d;if(void 0!==r)return r;throw Error(`\`${a}\` must be used within \`${t}\``)}]},function(...e){let t=e[0];if(1===e.length)return t;let a=()=>{let a=e.map(e=>({useScope:e(),scopeName:e.scopeName}));return function(e){let r=a.reduce((t,{useScope:a,scopeName:r})=>{let i=a(e)[`__scope${r}`];return{...t,...i}},{});return n.useMemo(()=>({[`__scope${t.scopeName}`]:r}),[r])}};return a.scopeName=t.scopeName,a}(r,...t)]}(j),[N,S]=w(j),k=e=>{let{__scopeDialog:t,children:a,open:r,defaultOpen:s,onOpenChange:l,modal:c=!0}=e,p=n.useRef(null),m=n.useRef(null),[u,x]=(0,d.useControllableState)({prop:r,defaultProp:s??!1,onChange:l,caller:j});return(0,i.jsx)(N,{scope:t,triggerRef:p,contentRef:m,contentId:(0,o.useId)(),titleId:(0,o.useId)(),descriptionId:(0,o.useId)(),open:u,onOpenChange:x,onOpenToggle:n.useCallback(()=>x(e=>!e),[x]),modal:c,children:a})};k.displayName=j;var T="DialogTrigger",C=n.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=S(T,a),o=(0,l.useComposedRefs)(t,n.triggerRef);return(0,i.jsx)(h.button,{type:"button","aria-haspopup":"dialog","aria-expanded":n.open,"aria-controls":n.contentId,"data-state":q(n.open),...r,ref:o,onClick:(0,s.composeEventHandlers)(e.onClick,n.onOpenToggle)})});C.displayName=T;var M="DialogPortal",[D,R]=w(M,{forceMount:void 0}),I=e=>{let{__scopeDialog:t,forceMount:a,children:r,container:s}=e,l=S(M,t);return(0,i.jsx)(D,{scope:t,forceMount:a,children:n.Children.map(r,e=>(0,i.jsx)(u.Presence,{present:a||l.open,children:(0,i.jsx)(m.Portal,{asChild:!0,container:s,children:e})}))})};I.displayName=M;var z="DialogOverlay",P=n.forwardRef((e,t)=>{let a=R(z,e.__scopeDialog),{forceMount:r=a.forceMount,...n}=e,s=S(z,e.__scopeDialog);return s.modal?(0,i.jsx)(u.Presence,{present:r||s.open,children:(0,i.jsx)(B,{...n,ref:t})}):null});P.displayName=z;var $=x("DialogOverlay.RemoveScroll"),B=n.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=S(z,a);return(0,i.jsx)(b.RemoveScroll,{as:$,allowPinchZoom:!0,shards:[n.contentRef],children:(0,i.jsx)(h.div,{"data-state":q(n.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),E="DialogContent",A=n.forwardRef((e,t)=>{let a=R(E,e.__scopeDialog),{forceMount:r=a.forceMount,...n}=e,s=S(E,e.__scopeDialog);return(0,i.jsx)(u.Presence,{present:r||s.open,children:s.modal?(0,i.jsx)(H,{...n,ref:t}):(0,i.jsx)(O,{...n,ref:t})})});A.displayName=E;var H=n.forwardRef((e,t)=>{let a=S(E,e.__scopeDialog),r=n.useRef(null),o=(0,l.useComposedRefs)(t,a.contentRef,r);return n.useEffect(()=>{let e=r.current;if(e)return(0,v.hideOthers)(e)},[]),(0,i.jsx)(L,{...e,ref:o,trapFocus:a.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,s.composeEventHandlers)(e.onCloseAutoFocus,e=>{e.preventDefault(),a.triggerRef.current?.focus()}),onPointerDownOutside:(0,s.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,s.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault())})}),O=n.forwardRef((e,t)=>{let a=S(E,e.__scopeDialog),r=n.useRef(!1),s=n.useRef(!1);return(0,i.jsx)(L,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{e.onCloseAutoFocus?.(t),t.defaultPrevented||(r.current||a.triggerRef.current?.focus(),t.preventDefault()),r.current=!1,s.current=!1},onInteractOutside:t=>{e.onInteractOutside?.(t),t.defaultPrevented||(r.current=!0,"pointerdown"===t.detail.originalEvent.type&&(s.current=!0));let i=t.target;a.triggerRef.current?.contains(i)&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&s.current&&t.preventDefault()}})}),L=n.forwardRef((e,t)=>{let{__scopeDialog:a,trapFocus:r,onOpenAutoFocus:s,onCloseAutoFocus:o,...d}=e,m=S(E,a),u=n.useRef(null),x=(0,l.useComposedRefs)(t,u);return(0,y.useFocusGuards)(),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(p.FocusScope,{asChild:!0,loop:!0,trapped:r,onMountAutoFocus:s,onUnmountAutoFocus:o,children:(0,i.jsx)(c.DismissableLayer,{role:"dialog",id:m.contentId,"aria-describedby":m.descriptionId,"aria-labelledby":m.titleId,"data-state":q(m.open),...d,ref:x,onDismiss:()=>m.onOpenChange(!1)})}),(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(Q,{titleId:m.titleId}),(0,i.jsx)(X,{contentRef:u,descriptionId:m.descriptionId})]})]})}),F="DialogTitle",W=n.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=S(F,a);return(0,i.jsx)(h.h2,{id:n.titleId,...r,ref:t})});W.displayName=F;var K="DialogDescription",V=n.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=S(K,a);return(0,i.jsx)(h.p,{id:n.descriptionId,...r,ref:t})});V.displayName=K;var U="DialogClose",Y=n.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=S(U,a);return(0,i.jsx)(h.button,{type:"button",...r,ref:t,onClick:(0,s.composeEventHandlers)(e.onClick,()=>n.onOpenChange(!1))})});function q(e){return e?"open":"closed"}Y.displayName=U;var G="DialogTitleWarning",[J,Z]=(r={contentName:E,titleName:F,docsSlug:"dialog"},t=n.createContext(r),(a=e=>{let{children:a,...r}=e,s=n.useMemo(()=>r,Object.values(r));return(0,i.jsx)(t.Provider,{value:s,children:a})}).displayName=G+"Provider",[a,function(e){let a=n.useContext(t);if(a)return a;if(void 0!==r)return r;throw Error(`\`${e}\` must be used within \`${G}\``)}]),Q=({titleId:e})=>{let t=Z(G),a=`\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;return n.useEffect(()=>{e&&(document.getElementById(e)||console.error(a))},[a,e]),null},X=({contentRef:e,descriptionId:t})=>{let a=Z("DialogDescriptionWarning"),r=`Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${a.contentName}}.`;return n.useEffect(()=>{let a=e.current?.getAttribute("aria-describedby");t&&a&&(document.getElementById(t)||console.warn(r))},[r,e,t]),null};e.s(["Close",()=>Y,"Content",()=>A,"Description",()=>V,"Overlay",()=>P,"Portal",()=>I,"Root",()=>k,"Title",()=>W,"Trigger",()=>C,"WarningProvider",()=>J,"createDialogScope",()=>_],26999);var ee=e.i(37727),et=e.i(75157);let ea=n.forwardRef(({className:e,...t},a)=>(0,i.jsx)(P,{ref:a,className:(0,et.cn)("fixed inset-0 z-50 bg-black/50 backdrop-blur-sm","data-[state=open]:animate-in data-[state=closed]:animate-out","data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...t}));ea.displayName=P.displayName;let er=n.forwardRef(({className:e,children:t,showNeonBorder:a=!0,...r},n)=>(0,i.jsx)(I,{children:(0,i.jsx)(ea,{className:"flex items-center justify-center p-4",children:(0,i.jsxs)(A,{ref:n,className:(0,et.cn)("relative z-50 w-full max-w-lg","data-[state=open]:animate-in data-[state=closed]:animate-out","data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0","data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",e),...r,children:[a&&(0,i.jsx)("div",{className:"neon-border-glow"}),(0,i.jsxs)("div",{className:(0,et.cn)("relative bg-background border border-border rounded-2xl p-6 shadow-2xl","max-h-[85vh] overflow-y-auto","grid gap-4"),children:[t,(0,i.jsxs)(Y,{className:"absolute right-4 top-4 rounded-full p-1.5 opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",children:[(0,i.jsx)(ee.X,{className:"h-4 w-4"}),(0,i.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})})}));er.displayName=A.displayName;let ei=({className:e,...t})=>(0,i.jsx)("div",{className:(0,et.cn)("flex flex-col space-y-1.5 text-center sm:text-left",e),...t});ei.displayName="DialogHeader";let en=({className:e,...t})=>(0,i.jsx)("div",{className:(0,et.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...t});en.displayName="DialogFooter";let es=n.forwardRef(({className:e,...t},a)=>(0,i.jsx)(W,{ref:a,className:(0,et.cn)("text-lg font-semibold leading-none tracking-tight",e),...t}));es.displayName=W.displayName;let el=n.forwardRef(({className:e,...t},a)=>(0,i.jsx)(V,{ref:a,className:(0,et.cn)("text-sm text-muted-foreground",e),...t}));el.displayName=V.displayName,e.s(["Dialog",()=>k,"DialogContent",()=>er,"DialogDescription",()=>el,"DialogFooter",()=>en,"DialogHeader",()=>ei,"DialogTitle",()=>es],76639)},84774,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75157);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("div",{className:"relative w-full overflow-auto",children:(0,t.jsx)("table",{ref:i,className:(0,r.cn)("w-full caption-bottom text-sm",e),...a})}));i.displayName="Table";let n=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("thead",{ref:i,className:(0,r.cn)("[&_tr]:border-b",e),...a}));n.displayName="TableHeader";let s=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("tbody",{ref:i,className:(0,r.cn)("[&_tr:last-child]:border-0",e),...a}));s.displayName="TableBody",a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("tfoot",{ref:i,className:(0,r.cn)("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",e),...a})).displayName="TableFooter";let l=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("tr",{ref:i,className:(0,r.cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",e),...a}));l.displayName="TableRow";let o=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("th",{ref:i,className:(0,r.cn)("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",e),...a}));o.displayName="TableHead";let d=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("td",{ref:i,className:(0,r.cn)("p-4 align-middle [&:has([role=checkbox])]:pr-0",e),...a}));d.displayName="TableCell",a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("caption",{ref:i,className:(0,r.cn)("mt-4 text-sm text-muted-foreground",e),...a})).displayName="TableCaption",e.s(["Table",()=>i,"TableBody",()=>s,"TableCell",()=>d,"TableHead",()=>o,"TableHeader",()=>n,"TableRow",()=>l])},41071,e=>{"use strict";let t=(0,e.i(75254).default)("Ellipsis",[["circle",{cx:"12",cy:"12",r:"1",key:"41hilf"}],["circle",{cx:"19",cy:"12",r:"1",key:"1wjl8i"}],["circle",{cx:"5",cy:"12",r:"1",key:"1pcz8c"}]]);e.s(["MoreHorizontal",()=>t],41071)},97548,e=>{"use strict";let t=(0,e.i(75254).default)("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);e.s(["Filter",()=>t],97548)},24687,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(75157);let i=a.forwardRef(({className:e,...a},i)=>(0,t.jsx)("textarea",{className:(0,r.cn)("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",e),ref:i,...a}));i.displayName="Textarea",e.s(["Textarea",()=>i])},3281,e=>{"use strict";let t=(0,e.i(75254).default)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);e.s(["Printer",()=>t],3281)},94918,e=>{"use strict";let t=(0,e.i(75254).default)("FileSpreadsheet",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]]);e.s(["FileSpreadsheet",()=>t],94918)},8199,39978,e=>{"use strict";var t=e.i(81092);function a(e,a){let r=(0,t.toDate)(e,a?.in);return r.setDate(1),r.setHours(0,0,0,0),r}function r(e,a){let r=(0,t.toDate)(e,a?.in),i=r.getMonth();return r.setFullYear(r.getFullYear(),i+1,0),r.setHours(23,59,59,999),r}e.s(["startOfMonth",()=>a],8199),e.s(["endOfMonth",()=>r],39978)},50627,e=>{"use strict";let t=(0,e.i(75254).default)("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]]);e.s(["Receipt",()=>t],50627)},16715,e=>{"use strict";let t=(0,e.i(75254).default)("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);e.s(["RefreshCw",()=>t],16715)},72436,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(48425),i="horizontal",n=["horizontal","vertical"],s=a.forwardRef((e,a)=>{var s;let{decorative:l,orientation:o=i,...d}=e,c=(s=o,n.includes(s))?o:i;return(0,t.jsx)(r.Primitive.div,{"data-orientation":c,...l?{role:"none"}:{"aria-orientation":"vertical"===c?c:void 0,role:"separator"},...d,ref:a})});s.displayName="Separator";var l=e.i(75157);let o=a.forwardRef(({className:e,orientation:a="horizontal",decorative:r=!0,...i},n)=>(0,t.jsx)(s,{ref:n,decorative:r,orientation:a,className:(0,l.cn)("shrink-0 bg-border","horizontal"===a?"h-[1px] w-full":"h-full w-[1px]",e),...i}));o.displayName=s.displayName,e.s(["Separator",()=>o],72436)},90597,e=>{"use strict";let t=(0,e.i(75254).default)("Heart",[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]]);e.s(["Heart",()=>t],90597)},29325,e=>{"use strict";var t=e.i(63816);e.s(["default",0,{async getMedicalRecords(e={}){let a=new URLSearchParams;return e.date&&a.append("date",e.date),e.department_id&&a.append("department_id",e.department_id.toString()),e.doctor_id&&a.append("doctor_id",e.doctor_id.toString()),e.status&&a.append("status",e.status),e.search&&a.append("search",e.search),e.page&&a.append("page",e.page.toString()),e.per_page&&a.append("per_page",e.per_page.toString()),(await t.default.get(`/api/medical-records?${a.toString()}`)).data},async getPendingExaminations(e){let a=e?`?department_id=${e}`:"";return(await t.default.get(`/api/medical-records/pending${a}`)).data},async getExaminationStats(e,a,r){let i=new URLSearchParams;return e&&i.append("date",e),a&&i.append("department_id",a.toString()),r&&i.append("doctor_id",r.toString()),(await t.default.get(`/api/medical-records/stats?${i.toString()}`)).data},getMedicalRecordById:async e=>(await t.default.get(`/api/medical-records/${e}`)).data,startExamination:async e=>(await t.default.post("/api/medical-records",e)).data,updateMedicalRecord:async(e,a)=>(await t.default.put(`/api/medical-records/${e}`,a)).data,completeExamination:async(e,a=!0)=>(await t.default.patch(`/api/medical-records/${e}/complete`,{create_invoice:a})).data,cancelExamination:async e=>(await t.default.delete(`/api/medical-records/${e}`)).data,getPatientMedicalHistory:async(e,a=1,r=10)=>(await t.default.get(`/api/patients/${e}/medical-history?page=${a}&per_page=${r}`)).data,async getCompletedExaminations(e,a,r){let i=new URLSearchParams;return e&&i.append("department_id",e.toString()),a&&i.append("date",a),r&&i.append("unpaid_only","1"),i.append("with","prescriptions.items,invoice.items"),(await t.default.get(`/api/medical-records/completed?${i.toString()}`)).data},addPrescription:async(e,a)=>(await t.default.post(`/api/medical-records/${e}/prescription`,a)).data,async getPrescriptions(e={}){let a=new URLSearchParams;return e.date&&a.append("date",e.date),e.status&&a.append("status",e.status),e.search&&a.append("search",e.search),e.page&&a.append("page",e.page.toString()),e.per_page&&a.append("per_page",e.per_page.toString()),(await t.default.get(`/api/prescriptions?${a.toString()}`)).data},getPrescriptionById:async e=>(await t.default.get(`/api/prescriptions/${e}`)).data,createPrescription:async e=>(await t.default.post("/api/prescriptions",e)).data,updatePrescription:async(e,a)=>(await t.default.put(`/api/prescriptions/${e}`,a)).data,updatePrescriptionStatus:async(e,a)=>(await t.default.patch(`/api/prescriptions/${e}/status`,{status:a})).data,async getInvoices(e={}){let a=new URLSearchParams;return e.start_date&&e.end_date?(a.append("start_date",e.start_date),a.append("end_date",e.end_date)):e.date&&a.append("date",e.date),e.payment_status&&a.append("payment_status",e.payment_status),e.payment_method&&a.append("payment_method",e.payment_method),e.search&&a.append("search",e.search),e.page&&a.append("page",e.page.toString()),e.per_page&&a.append("per_page",e.per_page.toString()),(await t.default.get(`/api/invoices?${a.toString()}`)).data},async getUnpaidInvoices(e){let a=e?`?date=${e}`:"";return(await t.default.get(`/api/invoices/unpaid${a}`)).data},async getInvoiceStats(e={}){let a=new URLSearchParams;e.start_date&&e.end_date?(a.append("start_date",e.start_date),a.append("end_date",e.end_date)):e.date&&a.append("date",e.date);let r=a.toString();return(await t.default.get(`/api/invoices/stats${r?`?${r}`:""}`)).data},getInvoiceById:async e=>(await t.default.get(`/api/invoices/${e}?with=items`)).data,payInvoice:async(e,a)=>(await t.default.patch(`/api/invoices/${e}/pay`,a)).data,getInvoicePrint:async e=>(await t.default.get(`/api/invoices/${e}/print`)).data,getStatusColorClass:e=>({in_progress:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",completed:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",cancelled:"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"})[e]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",getPaymentStatusColorClass:e=>({unpaid:"bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",partial:"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",paid:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"})[e]||"bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",formatCurrency:e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0,maximumFractionDigits:0}).format(e),formatBloodPressure:(e,t)=>e&&t?`${e}/${t} mmHg`:"-",formatTemperature:e=>e?`${e}\xb0C`:"-",formatWeight:e=>e?`${e} kg`:"-",formatHeight:e=>e?`${e} cm`:"-",formatBMI(e){if(e){let t="";return t=e<18.5?" (Kurus)":e<25?" (Normal)":e<30?" (Gemuk)":" (Obesitas)",`${e.toFixed(1)}${t}`}return"-"},getTodayDateString:()=>new Date().toISOString().split("T")[0]}])},74416,63384,75651,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(76639),i=e.i(19455),n=e.i(93479),s=e.i(10204),l=e.i(67489),o=e.i(24687),d=e.i(72436),c=e.i(31278),p=e.i(87378),m=e.i(61659),u=e.i(7486),x=e.i(90597),g=e.i(98919),f=e.i(12156),h=e.i(29325),y=e.i(46696);let b=[{value:"cash",label:"Tunai",icon:p.Banknote},{value:"card",label:"Kartu Debit/Kredit",icon:m.CreditCard},{value:"transfer",label:"Transfer Bank",icon:u.Building2},{value:"bpjs",label:"BPJS",icon:x.Heart},{value:"insurance",label:"Asuransi",icon:g.Shield}],v=[5e4,1e5,15e4,2e5,25e4,3e5,5e5];function j({open:e,onOpenChange:p,invoice:m,onSuccess:u}){let[x,g]=(0,a.useState)(!1),[j,w]=(0,a.useState)(!1),[_,N]=(0,a.useState)(null),[S,k]=(0,a.useState)("cash"),[T,C]=(0,a.useState)(""),[M,D]=(0,a.useState)("");if((0,a.useEffect)(()=>{(async()=>{if(e&&m?.id){w(!0);try{let e=await h.default.getInvoiceById(m.id);N(e.data)}catch(e){console.error("Error fetching invoice details:",e),N(m)}finally{w(!1)}}})()},[e,m?.id]),(0,a.useEffect)(()=>{m&&(C(m.total_amount.toString()),k("cash"),D(""))},[m]),!m)return null;let R=_||m,I=parseFloat(T)||0,z=I-m.total_amount,P=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),$=async()=>{if(I<m.total_amount)return void y.toast.warning("Jumlah pembayaran kurang dari total tagihan",{description:`Total tagihan: ${P(m.total_amount)}`});g(!0);try{let e=await h.default.payInvoice(m.id,{paid_amount:I,payment_method:S,notes:M||void 0});y.toast.success("Pembayaran berhasil diproses",{description:`Invoice ${m.invoice_number} telah lunas`}),u(e.data)}catch(e){console.error("Error processing payment:",e),y.toast.error("Gagal memproses pembayaran",{description:e.response?.data?.message||"Terjadi kesalahan"})}finally{g(!1)}};return(0,t.jsx)(r.Dialog,{open:e,onOpenChange:p,children:(0,t.jsxs)(r.DialogContent,{className:"sm:max-w-[500px]",children:[(0,t.jsxs)(r.DialogHeader,{children:[(0,t.jsx)(r.DialogTitle,{children:"Pembayaran"}),(0,t.jsxs)(r.DialogDescription,{children:["Invoice: ",m.invoice_number]})]}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{className:"p-3 rounded-lg bg-muted",children:[(0,t.jsx)("p",{className:"font-semibold",children:R.patient?.name}),(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:[R.patient?.medical_record_number," -"," ",R.medical_record?.department?.name]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(s.Label,{children:"Rincian Tagihan"}),(0,t.jsx)("div",{className:"border rounded-lg p-3 space-y-3 max-h-[200px] overflow-y-auto",children:j?(0,t.jsxs)("div",{className:"flex items-center justify-center py-4",children:[(0,t.jsx)(c.Loader2,{className:"h-5 w-5 animate-spin text-muted-foreground"}),(0,t.jsx)("span",{className:"ml-2 text-sm text-muted-foreground",children:"Memuat rincian..."})]}):(0,t.jsxs)(t.Fragment,{children:[R.items?.filter(e=>"service"===e.item_type).length>0&&(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase",children:"Layanan"}),R.items.filter(e=>"service"===e.item_type).map((e,a)=>(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsxs)("span",{children:[e.item_name," x",e.quantity]}),(0,t.jsx)("span",{children:P(e.total_price)})]},`service-${a}`))]}),R.items?.filter(e=>"medicine"===e.item_type).length>0&&(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("p",{className:"text-xs font-semibold text-muted-foreground uppercase flex items-center gap-1",children:[(0,t.jsx)(f.Pill,{className:"h-3 w-3"}),"Obat"]}),R.items.filter(e=>"medicine"===e.item_type).map((e,a)=>(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsxs)("span",{children:[e.item_name," x",e.quantity]}),(0,t.jsx)("span",{children:P(e.total_price)})]},`medicine-${a}`))]}),R.items?.filter(e=>"other"===e.item_type).length>0&&(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsx)("p",{className:"text-xs font-semibold text-muted-foreground uppercase",children:"Lainnya"}),R.items.filter(e=>"other"===e.item_type).map((e,a)=>(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsxs)("span",{children:[e.item_name," x",e.quantity]}),(0,t.jsx)("span",{children:P(e.total_price)})]},`other-${a}`))]}),(!R.items||0===R.items.length)&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground text-center py-2",children:"Tidak ada item"})]})})]}),(0,t.jsxs)("div",{className:"space-y-1",children:[(0,t.jsxs)("div",{className:"flex justify-between text-sm",children:[(0,t.jsx)("span",{children:"Subtotal"}),(0,t.jsx)("span",{children:P(m.subtotal)})]}),m.discount_amount>0&&(0,t.jsxs)("div",{className:"flex justify-between text-sm text-green-600",children:[(0,t.jsx)("span",{children:"Diskon"}),(0,t.jsxs)("span",{children:["-",P(m.discount_amount)]})]}),(0,t.jsx)(d.Separator,{}),(0,t.jsxs)("div",{className:"flex justify-between font-bold text-lg",children:[(0,t.jsx)("span",{children:"Total"}),(0,t.jsx)("span",{children:P(m.total_amount)})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(s.Label,{children:"Metode Pembayaran"}),(0,t.jsxs)(l.Select,{value:S,onValueChange:e=>k(e),children:[(0,t.jsx)(l.SelectTrigger,{children:(0,t.jsx)(l.SelectValue,{placeholder:"Pilih metode"})}),(0,t.jsx)(l.SelectContent,{children:b.map(e=>(0,t.jsx)(l.SelectItem,{value:e.value,children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(e.icon,{className:"h-4 w-4"}),e.label]})},e.value))})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(s.Label,{children:"Jumlah Bayar"}),(0,t.jsx)(n.Input,{type:"number",value:T,onChange:e=>C(e.target.value),placeholder:"Masukkan jumlah"}),(0,t.jsxs)("div",{className:"flex flex-wrap gap-2",children:[v.filter(e=>e>=m.total_amount).map(e=>(0,t.jsx)(i.Button,{type:"button",size:"sm",variant:I===e?"default":"outline",onClick:()=>C(e.toString()),children:P(e)},e)),(0,t.jsx)(i.Button,{type:"button",size:"sm",variant:I===m.total_amount?"default":"outline",onClick:()=>C(m.total_amount.toString()),children:"Uang Pas"})]})]}),z>=0&&I>0&&(0,t.jsx)("div",{className:"p-3 rounded-lg bg-green-50 dark:bg-green-950/30",children:(0,t.jsxs)("div",{className:"flex justify-between items-center",children:[(0,t.jsx)("span",{className:"text-sm text-muted-foreground",children:"Kembalian"}),(0,t.jsx)("span",{className:"text-xl font-bold text-green-600",children:P(z)})]})}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(s.Label,{children:"Catatan (Opsional)"}),(0,t.jsx)(o.Textarea,{value:M,onChange:e=>D(e.target.value),placeholder:"Catatan tambahan...",rows:2})]})]}),(0,t.jsxs)(r.DialogFooter,{children:[(0,t.jsx)(i.Button,{variant:"outline",onClick:()=>p(!1),disabled:x,children:"Batal"}),(0,t.jsxs)(i.Button,{onClick:$,disabled:x||I<m.total_amount,children:[x&&(0,t.jsx)(c.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}),"Proses Pembayaran"]})]})]})})}e.s(["PaymentModal",()=>j],63384);var w=e.i(3281),_=e.i(72064);function N({open:e,onOpenChange:n,invoice:s}){let l=(0,a.useRef)(null),{settings:o}=(0,_.useClinicSettings)();if(!s)return null;let d=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),c=e=>new Date(e).toLocaleDateString("id-ID",{day:"2-digit",month:"long",year:"numeric"}),p="paid"===s.payment_status;return(0,t.jsx)(r.Dialog,{open:e,onOpenChange:n,children:(0,t.jsxs)(r.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,t.jsxs)(r.DialogHeader,{className:"flex flex-row items-center justify-between border-b pb-4",children:[(0,t.jsx)(r.DialogTitle,{className:"text-xl",children:"Preview Invoice"}),(0,t.jsxs)(i.Button,{onClick:()=>{let e=l.current;if(!e)return;let t=window.open("","","width=900,height=700");t&&(t.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${s.invoice_number}</title>
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
          ${e.innerHTML}
        </body>
      </html>
    `),t.document.close(),t.focus(),setTimeout(()=>{t.print(),t.close()},250))},className:"gap-2",children:[(0,t.jsx)(w.Printer,{className:"h-4 w-4"}),"Cetak Invoice"]})]}),(0,t.jsx)("div",{className:"bg-gray-100 p-4 rounded-lg",children:(0,t.jsx)("div",{ref:l,className:"bg-white shadow-lg mx-auto",style:{width:"210mm",minHeight:"297mm",padding:"15mm",transform:"scale(0.7)",transformOrigin:"top center",marginBottom:"-30%"},children:(0,t.jsxs)("div",{className:"invoice-container",children:[(0,t.jsxs)("div",{className:"header",style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",paddingBottom:"20px",borderBottom:"3px solid #2563eb",marginBottom:"25px"},children:[(0,t.jsxs)("div",{className:"clinic-info",style:{flex:1},children:[(0,t.jsx)("div",{className:"clinic-name",style:{fontSize:"24pt",fontWeight:"bold",color:"#1e40af",marginBottom:"5px"},children:o?.name||"KLINIK"}),(0,t.jsxs)("div",{className:"clinic-details",style:{fontSize:"10pt",color:"#666"},children:[(0,t.jsx)("p",{children:o?.address||"-"}),(0,t.jsxs)("p",{children:["Telp: ",o?.phone||"-"," | Email:"," ",o?.email||"-"]})]})]}),(0,t.jsxs)("div",{className:"invoice-title-box",style:{textAlign:"right"},children:[(0,t.jsx)("div",{className:"invoice-title",style:{fontSize:"28pt",fontWeight:"bold",color:"#1e40af",letterSpacing:"2px"},children:"INVOICE"}),(0,t.jsx)("div",{className:"invoice-number",style:{fontSize:"12pt",color:"#666",marginTop:"5px"},children:s.invoice_number}),(0,t.jsx)("div",{className:`invoice-status ${p?"status-paid":"status-unpaid"}`,style:{display:"inline-block",padding:"5px 15px",borderRadius:"20px",fontSize:"10pt",fontWeight:"bold",marginTop:"10px",background:p?"#dcfce7":"#fef2f2",color:p?"#166534":"#991b1b"},children:p?"LUNAS":"BELUM LUNAS"})]})]}),(0,t.jsxs)("div",{className:"info-row",style:{display:"flex",justifyContent:"space-between",gap:"30px",marginBottom:"25px"},children:[(0,t.jsxs)("div",{className:"info-box",style:{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"15px"},children:[(0,t.jsx)("div",{className:"info-box-title",style:{fontSize:"9pt",textTransform:"uppercase",color:"#64748b",fontWeight:600,marginBottom:"10px",letterSpacing:"1px"},children:"Data Pasien"}),(0,t.jsxs)("div",{className:"info-box-content",children:[(0,t.jsx)("p",{className:"primary",style:{fontSize:"12pt",fontWeight:600,color:"#1e293b"},children:s.patient?.name||"-"}),(0,t.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["No. RM: ",s.patient?.medical_record_number||"-"]}),(0,t.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Alamat: ",s.patient?.address||"-"]})]})]}),(0,t.jsxs)("div",{className:"info-box",style:{flex:1,background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"8px",padding:"15px"},children:[(0,t.jsx)("div",{className:"info-box-title",style:{fontSize:"9pt",textTransform:"uppercase",color:"#64748b",fontWeight:600,marginBottom:"10px",letterSpacing:"1px"},children:"Detail Invoice"}),(0,t.jsxs)("div",{className:"info-box-content",children:[(0,t.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Tanggal: ",c(s.created_at)]}),(0,t.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Poli: ",s.medical_record?.department?.name||"-"]}),(0,t.jsxs)("p",{style:{margin:"3px 0",fontSize:"10pt"},children:["Dokter: ",s.medical_record?.doctor?.name||"-"]})]})]})]}),(0,t.jsxs)("table",{className:"items-table",style:{width:"100%",borderCollapse:"collapse",marginBottom:"25px"},children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{style:{background:"#1e40af",color:"white"},children:[(0,t.jsx)("th",{style:{padding:"12px 15px",textAlign:"left",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"No"}),(0,t.jsx)("th",{style:{padding:"12px 15px",textAlign:"left",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Deskripsi Layanan"}),(0,t.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Qty"}),(0,t.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Harga Satuan"}),(0,t.jsx)("th",{style:{padding:"12px 15px",textAlign:"right",fontSize:"10pt",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px"},children:"Jumlah"})]})}),(0,t.jsxs)("tbody",{children:[s.items?.map((e,a)=>(0,t.jsxs)("tr",{style:{borderBottom:"1px solid #e2e8f0",background:a%2==1?"#f8fafc":"white"},children:[(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:a+1}),(0,t.jsxs)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:[(0,t.jsx)("div",{children:e.item_name}),(0,t.jsx)("div",{className:"item-type",style:{fontSize:"8pt",color:"#64748b",textTransform:"capitalize"},children:e.item_type})]}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:e.quantity}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:d(e.unit_price)}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt",textAlign:"right"},children:d(e.total_price)})]},a)),5>(s.items?.length||0)&&Array.from({length:5-(s.items?.length||0)}).map((e,a)=>(0,t.jsxs)("tr",{style:{borderBottom:"1px solid #e2e8f0"},children:[(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"},children:" "}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}}),(0,t.jsx)("td",{style:{padding:"12px 15px",fontSize:"10pt"}})]},`empty-${a}`))]})]}),(0,t.jsx)("div",{className:"summary-section",style:{display:"flex",justifyContent:"flex-end"},children:(0,t.jsxs)("div",{className:"summary-box",style:{width:"320px"},children:[(0,t.jsxs)("div",{className:"summary-row subtotal",style:{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"10pt",borderBottom:"1px solid #e2e8f0"},children:[(0,t.jsx)("span",{children:"Subtotal"}),(0,t.jsx)("span",{children:d(s.subtotal)})]}),s.discount_amount>0&&(0,t.jsxs)("div",{className:"summary-row discount",style:{display:"flex",justifyContent:"space-between",padding:"8px 0",fontSize:"10pt",color:"#dc2626"},children:[(0,t.jsxs)("span",{children:["Diskon"," ",s.discount_percent>0?`(${s.discount_percent}%)`:""]}),(0,t.jsxs)("span",{children:["- ",d(s.discount_amount)]})]}),(0,t.jsxs)("div",{className:"summary-row total",style:{display:"flex",justifyContent:"space-between",fontSize:"14pt",fontWeight:"bold",color:"#1e40af",borderTop:"2px solid #1e40af",marginTop:"10px",paddingTop:"15px"},children:[(0,t.jsx)("span",{children:"TOTAL"}),(0,t.jsx)("span",{children:d(s.total_amount)})]}),p&&(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)("div",{className:"summary-row payment",style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",fontSize:"10pt",background:"#f0fdf4",borderRadius:"5px",marginTop:"5px"},children:[(0,t.jsxs)("span",{children:["Bayar (",s.payment_method_label,")"]}),(0,t.jsx)("span",{children:d(s.paid_amount)})]}),(0,t.jsxs)("div",{className:"summary-row change",style:{display:"flex",justifyContent:"space-between",padding:"8px 12px",fontSize:"10pt",background:"#eff6ff",borderRadius:"5px"},children:[(0,t.jsx)("span",{children:"Kembali"}),(0,t.jsx)("span",{children:d(s.change_amount)})]})]})]})}),p&&(0,t.jsxs)("div",{className:"payment-info",style:{marginTop:"30px",padding:"20px",background:"#f8fafc",borderRadius:"8px",border:"1px solid #e2e8f0"},children:[(0,t.jsx)("div",{className:"payment-info-title",style:{fontSize:"10pt",fontWeight:600,color:"#1e293b",marginBottom:"10px"},children:"Informasi Pembayaran"}),(0,t.jsxs)("div",{className:"payment-info-grid",style:{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:"20px"},children:[(0,t.jsxs)("div",{className:"payment-info-item",children:[(0,t.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Metode Pembayaran"}),(0,t.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:s.payment_method_label})]}),(0,t.jsxs)("div",{className:"payment-info-item",children:[(0,t.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Tanggal Bayar"}),(0,t.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:s.payment_date?c(s.payment_date):"-"})]}),(0,t.jsxs)("div",{className:"payment-info-item",children:[(0,t.jsx)("label",{style:{fontSize:"8pt",color:"#64748b",textTransform:"uppercase"},children:"Kasir"}),(0,t.jsx)("p",{style:{fontSize:"10pt",fontWeight:500,color:"#1e293b"},children:s.cashier?.name||"-"})]})]})]}),(0,t.jsxs)("div",{className:"footer",style:{marginTop:"40px",paddingTop:"20px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between"},children:[(0,t.jsxs)("div",{className:"footer-left",style:{fontSize:"9pt",color:"#64748b"},children:[(0,t.jsxs)("p",{children:["Dicetak pada: ",c(new Date().toISOString())," ",new Date(new Date().toISOString()).toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})]}),(0,t.jsx)("p",{children:"Invoice ini sah tanpa tanda tangan basah"})]}),(0,t.jsxs)("div",{className:"footer-right",style:{textAlign:"center"},children:[(0,t.jsx)("div",{className:"signature-line",style:{width:"180px",borderBottom:"1px solid #333",margin:"60px auto 5px"}}),(0,t.jsx)("div",{className:"signature-name",style:{fontSize:"10pt",fontWeight:500},children:s.cashier?.name||"_______________"}),(0,t.jsx)("div",{className:"signature-title",style:{fontSize:"9pt",color:"#64748b"},children:"Petugas Kasir"})]})]}),(0,t.jsxs)("div",{className:"thank-you",style:{textAlign:"center",marginTop:"30px",padding:"15px",background:"linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",borderRadius:"8px"},children:[(0,t.jsx)("p",{style:{fontSize:"11pt",color:"#1e40af",fontWeight:500},children:"Terima kasih atas kepercayaan Anda"}),(0,t.jsxs)("p",{className:"subtitle",style:{fontSize:"9pt",color:"#64748b",fontWeight:"normal",marginTop:"3px"},children:["Semoga lekas sembuh - ",o?.name||"Klinik"]})]})]})})})]})})}e.s(["ReceiptModal",()=>N],75651),e.s([],74416)},79593,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(46932),i=e.i(1851),n=e.i(8199),s=e.i(39978),l=e.i(26514),o=e.i(42956),d=e.i(70016),c=e.i(55436),p=e.i(97548),m=e.i(94918),u=e.i(31278),x=e.i(50627),g=e.i(25652),f=e.i(61659),h=e.i(16715),y=e.i(3281),b=e.i(87316);let v=(0,e.i(75254).default)("Wallet",[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]]);var j=e.i(46696),w=e.i(19455),_=e.i(93479),N=e.i(10204),S=e.i(87486),k=e.i(15288),T=e.i(84774),C=e.i(67489),M=e.i(58512),D=e.i(2747);e.i(74416);var R=e.i(75651),I=e.i(72064),z=e.i(29325),P=e.i(45172);function $(){let{settings:e}=(0,I.useClinicSettings)(),[$,B]=(0,a.useState)([]),[E,A]=(0,a.useState)(null),[H,O]=(0,a.useState)(!0),[L,F]=(0,a.useState)(!1),[W,K]=(0,a.useState)(!1),[V,U]=(0,a.useState)(1),[Y,q]=(0,a.useState)(1),[G,J]=(0,a.useState)(0),[Z,Q]=(0,a.useState)({start_date:(0,i.format)((0,n.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,i.format)((0,s.endOfMonth)(new Date),"yyyy-MM-dd"),payment_status:"",payment_method:"",search:"",page:1,per_page:15}),[X,ee]=(0,a.useState)(!0),[et,ea]=(0,a.useState)(null),[er,ei]=(0,a.useState)(!1),en=(0,a.useCallback)(async()=>{O(!0);try{let e=await z.default.getInvoices({start_date:Z.start_date,end_date:Z.end_date,payment_status:Z.payment_status||void 0,payment_method:Z.payment_method||void 0,search:Z.search||void 0,page:Z.page,per_page:Z.per_page});B(e.data),e.meta&&(q(e.meta.last_page),J(e.meta.total),U(e.meta.current_page))}catch(e){console.error("Error fetching invoices:",e),j.toast.error("Gagal memuat data transaksi")}finally{O(!1)}},[Z]),es=(0,a.useCallback)(async()=>{try{let e=await z.default.getInvoiceStats({start_date:Z.start_date,end_date:Z.end_date});A(e.data)}catch(e){console.error("Error fetching stats:",e)}},[Z.start_date,Z.end_date]);(0,a.useEffect)(()=>{en(),es()},[en,es]);let el=(e,t)=>{Q(a=>({...a,[e]:t,page:1}))},eo=e=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e),ed=async()=>{if(0===$.length)return void j.toast.error("Tidak ada data untuk di-export");F(!0);try{let e=(await z.default.getInvoices({date:Z.start_date,payment_status:Z.payment_status||void 0,search:Z.search||void 0,page:1,per_page:1e4})).data,t=d.utils.book_new(),a=[["LAPORAN RIWAYAT TRANSAKSI"],[`Periode: ${(0,i.format)((0,l.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,i.format)((0,l.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["RINGKASAN"],["Total Transaksi",E?.total||0],["Sudah Bayar",E?.paid||0],["Belum Bayar",E?.unpaid||0],["Total Pendapatan",E?.total_revenue||0],["Total Belum Dibayar",E?.total_unpaid||0],[],["BREAKDOWN PER METODE PEMBAYARAN"],["Metode","Jumlah Transaksi","Total Nilai"],...E?.payment_by_method.map(e=>[P.PAYMENT_METHOD_LABELS[e.payment_method]||e.payment_method,e.count,e.total])||[]],r=d.utils.aoa_to_sheet(a);d.utils.book_append_sheet(t,r,"Ringkasan");let n=[["DETAIL TRANSAKSI"],[`Periode: ${(0,i.format)((0,l.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,i.format)((0,l.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:o.id})}`],[],["No. Invoice","Tanggal","Nama Pasien","No. RM","Poli","Total","Dibayar","Kembalian","Metode","Status","Kasir"],...e.map(e=>[e.invoice_number,e.payment_date?(0,i.format)(new Date(e.payment_date),"dd/MM/yyyy HH:mm"):(0,i.format)(new Date(e.created_at),"dd/MM/yyyy HH:mm"),e.patient?.name||"-",e.patient?.medical_record_number||"-",e.medical_record?.department?.name||"-",e.total_amount,e.paid_amount,e.change_amount,P.PAYMENT_METHOD_LABELS[e.payment_method]||e.payment_method,P.PAYMENT_STATUS_LABELS[e.payment_status]||e.payment_status,e.cashier?.name||"-"])],s=d.utils.aoa_to_sheet(n);d.utils.book_append_sheet(t,s,"Detail Transaksi");let c=`Riwayat_Transaksi_${(0,i.format)((0,l.parseISO)(Z.start_date),"yyyyMMdd")}_${(0,i.format)((0,l.parseISO)(Z.end_date),"yyyyMMdd")}.xlsx`;d.writeFile(t,c),j.toast.success("Export Excel berhasil!")}catch(e){console.error("Error exporting to Excel:",e),j.toast.error("Gagal export Excel")}finally{F(!1)}},ec=[{title:"Total Transaksi",value:E?.total||0,icon:x.Receipt,color:"blue"},{title:"Sudah Bayar",value:E?.paid||0,icon:f.CreditCard,color:"green"},{title:"Belum Bayar",value:E?.unpaid||0,subValue:E?.total_unpaid?eo(E.total_unpaid):"-",icon:v,color:"red"},{title:"Total Pendapatan",value:E?.total_revenue?eo(E.total_revenue):"-",icon:g.TrendingUp,color:"green",isLarge:!0}],ep={hidden:{opacity:0,y:20},show:{opacity:1,y:0}};return(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)(r.motion.div,{initial:{opacity:0,y:-10},animate:{opacity:1,y:0},className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold tracking-tight",children:"Riwayat Transaksi"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Lihat dan kelola riwayat pembayaran pasien"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)(w.Button,{variant:"outline",onClick:()=>{if(0===$.length)return void j.toast.error("Tidak ada data untuk dicetak");K(!0);try{let t=e?.name||"Klinik App",a=e?.address||"",r=e?.phone||"",n=e?.logo_url||"",s=window.open("","_blank");if(!s){j.toast.error("Popup diblokir. Izinkan popup untuk mencetak."),K(!1);return}let d=`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Riwayat Transaksi - ${t}</title>
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
            ${n?`<img src="${n}" alt="${t}" class="logo" />`:'<div class="logo-placeholder">+</div>'}
            <div class="clinic-info">
              <div class="clinic-name">${t}</div>
              <div class="clinic-address">
                ${a?a+"<br/>":""}
                ${r?"Telp: "+r:""}
              </div>
            </div>
          </div>

          <div class="report-title">
            <h1>LAPORAN RIWAYAT TRANSAKSI</h1>
            <p>Periode: ${(0,i.format)((0,l.parseISO)(Z.start_date),"dd MMMM yyyy",{locale:o.id})} - ${(0,i.format)((0,l.parseISO)(Z.end_date),"dd MMMM yyyy",{locale:o.id})}</p>
          </div>

          <div class="summary-cards">
            <div class="summary-card">
              <div class="label">Total Transaksi</div>
              <div class="value blue">${E?.total||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Sudah Bayar</div>
              <div class="value green">${E?.paid||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Belum Bayar</div>
              <div class="value red">${E?.unpaid||0}</div>
            </div>
            <div class="summary-card">
              <div class="label">Total Pendapatan</div>
              <div class="value green">${eo(E?.total_revenue||0)}</div>
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
              ${$.map(e=>`
                <tr>
                  <td>${e.invoice_number}</td>
                  <td>${e.payment_date?(0,i.format)(new Date(e.payment_date),"dd/MM/yyyy HH:mm"):(0,i.format)(new Date(e.created_at),"dd/MM/yyyy HH:mm")}</td>
                  <td>
                    ${e.patient?.name||"-"}<br/>
                    <small style="color: #666;">${e.patient?.medical_record_number||""}</small>
                  </td>
                  <td>${e.medical_record?.department?.name||"-"}</td>
                  <td class="text-right">${eo(e.total_amount)}</td>
                  <td class="text-right">${eo(e.paid_amount)}</td>
                  <td class="text-center">${P.PAYMENT_METHOD_LABELS[e.payment_method]||e.payment_method}</td>
                  <td class="text-center">
                    <span class="badge ${"paid"===e.payment_status?"badge-success":"partial"===e.payment_status?"badge-warning":"badge-error"}">
                      ${P.PAYMENT_STATUS_LABELS[e.payment_status]||e.payment_status}
                    </span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="footer">
            <div>Dicetak pada: ${(0,i.format)(new Date,"dd MMMM yyyy HH:mm",{locale:o.id})}</div>
            <div>${t}</div>
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
      `;s.document.write(d),s.document.close(),j.toast.success("Menyiapkan halaman cetak...")}catch(e){console.error("Error printing:",e),j.toast.error("Gagal mencetak")}finally{K(!1)}},disabled:W||H,children:[W?(0,t.jsx)(u.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,t.jsx)(y.Printer,{className:"mr-2 h-4 w-4"}),"Print"]}),(0,t.jsxs)(w.Button,{onClick:ed,disabled:L||H,children:[L?(0,t.jsx)(u.Loader2,{className:"mr-2 h-4 w-4 animate-spin"}):(0,t.jsx)(m.FileSpreadsheet,{className:"mr-2 h-4 w-4"}),"Export Excel"]})]})]}),(0,t.jsx)(r.motion.div,{variants:{hidden:{opacity:0},show:{opacity:1,transition:{staggerChildren:.1}}},initial:"hidden",animate:"show",className:"grid gap-4 md:grid-cols-2 lg:grid-cols-4",children:ec.map(e=>(0,t.jsx)(r.motion.div,{variants:ep,children:(0,t.jsx)(k.Card,{children:(0,t.jsx)(k.CardContent,{className:"p-6",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:e.title}),(0,t.jsx)("p",{className:`${e.isLarge?"text-2xl":"text-3xl"} font-bold mt-2`,children:H?"-":e.value}),e.subValue&&(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:e.subValue})]}),(0,t.jsx)("div",{className:`p-3 rounded-xl bg-${e.color}-100 dark:bg-${e.color}-950`,children:(0,t.jsx)(e.icon,{className:`h-6 w-6 text-${e.color}-600 dark:text-${e.color}-400`})})]})})})},e.title))}),(0,t.jsxs)(k.Card,{children:[(0,t.jsx)(k.CardHeader,{className:"pb-3",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(k.CardTitle,{className:"text-base",children:"Filter"}),(0,t.jsxs)(w.Button,{variant:"ghost",size:"sm",onClick:()=>ee(!X),children:[(0,t.jsx)(p.Filter,{className:"mr-2 h-4 w-4"}),X?"Sembunyikan":"Tampilkan"]})]})}),X&&(0,t.jsx)(k.CardContent,{className:"space-y-4",children:(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault(),en()},children:[(0,t.jsxs)("div",{className:"grid gap-4 md:grid-cols-5",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(N.Label,{children:"Tanggal Mulai"}),(0,t.jsx)(_.Input,{type:"date",value:Z.start_date,onChange:e=>el("start_date",e.target.value)})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(N.Label,{children:"Tanggal Akhir"}),(0,t.jsx)(_.Input,{type:"date",value:Z.end_date,onChange:e=>el("end_date",e.target.value)})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(N.Label,{children:"Status Pembayaran"}),(0,t.jsxs)(C.Select,{value:Z.payment_status,onValueChange:e=>el("payment_status","all"===e?"":e),children:[(0,t.jsx)(C.SelectTrigger,{children:(0,t.jsx)(C.SelectValue,{placeholder:"Semua Status"})}),(0,t.jsxs)(C.SelectContent,{children:[(0,t.jsx)(C.SelectItem,{value:"all",children:"Semua Status"}),(0,t.jsx)(C.SelectItem,{value:"paid",children:"Lunas"}),(0,t.jsx)(C.SelectItem,{value:"partial",children:"Sebagian"}),(0,t.jsx)(C.SelectItem,{value:"unpaid",children:"Belum Bayar"})]})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(N.Label,{children:"Metode Pembayaran"}),(0,t.jsxs)(C.Select,{value:Z.payment_method,onValueChange:e=>el("payment_method","all"===e?"":e),children:[(0,t.jsx)(C.SelectTrigger,{children:(0,t.jsx)(C.SelectValue,{placeholder:"Semua Metode"})}),(0,t.jsxs)(C.SelectContent,{children:[(0,t.jsx)(C.SelectItem,{value:"all",children:"Semua Metode"}),(0,t.jsx)(C.SelectItem,{value:"cash",children:"Tunai"}),(0,t.jsx)(C.SelectItem,{value:"card",children:"Kartu"}),(0,t.jsx)(C.SelectItem,{value:"transfer",children:"Transfer"}),(0,t.jsx)(C.SelectItem,{value:"bpjs",children:"BPJS"}),(0,t.jsx)(C.SelectItem,{value:"insurance",children:"Asuransi"})]})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)(N.Label,{children:"Pencarian"}),(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(c.Search,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),(0,t.jsx)(_.Input,{placeholder:"No. Invoice / Nama Pasien",value:Z.search,onChange:e=>el("search",e.target.value),className:"pl-9"})]})]})]}),(0,t.jsxs)("div",{className:"flex gap-2 mt-4",children:[(0,t.jsxs)(w.Button,{type:"submit",children:[(0,t.jsx)(c.Search,{className:"mr-2 h-4 w-4"}),"Terapkan Filter"]}),(0,t.jsx)(w.Button,{type:"button",variant:"outline",onClick:()=>{Q({start_date:(0,i.format)((0,n.startOfMonth)(new Date),"yyyy-MM-dd"),end_date:(0,i.format)((0,s.endOfMonth)(new Date),"yyyy-MM-dd"),payment_status:"",payment_method:"",search:"",page:1,per_page:15})},children:"Reset"})]})]})})]}),(0,t.jsx)(r.motion.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},children:(0,t.jsxs)(k.Card,{children:[(0,t.jsx)(k.CardHeader,{children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsx)(k.CardTitle,{children:"Daftar Transaksi"}),(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsxs)("span",{className:"text-sm text-muted-foreground",children:[G," transaksi ditemukan"]}),(0,t.jsx)(w.Button,{variant:"outline",size:"icon",onClick:()=>{en(),es()},disabled:H,children:(0,t.jsx)(h.RefreshCw,{className:`h-4 w-4 ${H?"animate-spin":""}`})})]})]})}),(0,t.jsx)(k.CardContent,{children:H?(0,t.jsx)("div",{className:"space-y-3",children:[void 0,void 0,void 0,void 0,void 0].map((e,a)=>(0,t.jsx)(D.Skeleton,{className:"h-16 w-full"},a))}):0===$.length?(0,t.jsxs)("div",{className:"text-center py-12 text-muted-foreground",children:[(0,t.jsx)(b.Calendar,{className:"h-12 w-12 mx-auto mb-3 opacity-50"}),(0,t.jsx)("p",{children:"Tidak ada transaksi ditemukan"}),(0,t.jsx)("p",{className:"text-sm",children:"Coba ubah filter pencarian"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(T.Table,{children:[(0,t.jsx)(T.TableHeader,{children:(0,t.jsxs)(T.TableRow,{children:[(0,t.jsx)(T.TableHead,{children:"No. Invoice"}),(0,t.jsx)(T.TableHead,{children:"Tanggal"}),(0,t.jsx)(T.TableHead,{children:"Pasien"}),(0,t.jsx)(T.TableHead,{children:"Poli"}),(0,t.jsx)(T.TableHead,{className:"text-right",children:"Total"}),(0,t.jsx)(T.TableHead,{className:"text-right",children:"Dibayar"}),(0,t.jsx)(T.TableHead,{children:"Metode"}),(0,t.jsx)(T.TableHead,{children:"Status"}),(0,t.jsx)(T.TableHead,{className:"text-right",children:"Aksi"})]})}),(0,t.jsx)(T.TableBody,{children:$.map(e=>{var a;return(0,t.jsxs)(T.TableRow,{children:[(0,t.jsx)(T.TableCell,{className:"font-medium",children:e.invoice_number}),(0,t.jsx)(T.TableCell,{className:"text-sm",children:e.payment_date?(0,i.format)(new Date(e.payment_date),"dd/MM/yyyy HH:mm"):(0,i.format)(new Date(e.created_at),"dd/MM/yyyy HH:mm")}),(0,t.jsx)(T.TableCell,{children:(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"font-medium",children:e.patient?.name||"-"}),(0,t.jsx)("p",{className:"text-sm text-muted-foreground",children:e.patient?.medical_record_number||"-"})]})}),(0,t.jsx)(T.TableCell,{children:(0,t.jsx)(S.Badge,{variant:"outline",children:e.medical_record?.department?.name||"-"})}),(0,t.jsx)(T.TableCell,{className:"text-right font-semibold",children:eo(e.total_amount)}),(0,t.jsx)(T.TableCell,{className:"text-right",children:eo(e.paid_amount)}),(0,t.jsx)(T.TableCell,{children:(a=e.payment_method,(0,t.jsx)(S.Badge,{className:{cash:"bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",card:"bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",transfer:"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",bpjs:"bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",insurance:"bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"}[a],children:P.PAYMENT_METHOD_LABELS[a]||a}))}),(0,t.jsx)(T.TableCell,{children:(e=>{switch(e){case"paid":return(0,t.jsx)(S.Badge,{variant:"success",children:"Lunas"});case"partial":return(0,t.jsx)(S.Badge,{variant:"warning",children:"Sebagian"});case"unpaid":return(0,t.jsx)(S.Badge,{variant:"error",children:"Belum Bayar"});default:return(0,t.jsx)(S.Badge,{children:e})}})(e.payment_status)}),(0,t.jsx)(T.TableCell,{className:"text-right",children:(0,t.jsxs)(w.Button,{size:"sm",variant:"outline",onClick:()=>{ea(e),ei(!0)},children:[(0,t.jsx)(x.Receipt,{className:"h-4 w-4 mr-1"}),"Struk"]})})]},e.id)})})]}),Y>1&&(0,t.jsxs)("div",{className:"flex items-center justify-between mt-4",children:[(0,t.jsxs)("p",{className:"text-sm text-muted-foreground",children:["Halaman ",V," dari ",Y]}),(0,t.jsx)(M.Pagination,{currentPage:V,totalPages:Y,onPageChange:e=>{Q(t=>({...t,page:e}))}})]})]})})]})}),(0,t.jsx)(R.ReceiptModal,{open:er,onOpenChange:ei,invoice:et})]})}e.s(["default",()=>$],79593)}]);