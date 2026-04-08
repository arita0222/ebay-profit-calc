import { useState } from "react";

const field = (label, value, onChange, placeholder) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}>
    <label style={{fontSize:"14px",color:"#666"}}>{label}</label>
    <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
      <span style={{fontSize:"14px",color:"#aaa"}}>¥</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "0"}
        style={{width:"120px",textAlign:"right",fontSize:"18px",fontWeight:500,background:"transparent",outline:"none",border:"none"}}
      />
    </div>
  </div>
);

export default function App() {
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("2500");
  const [salePrice, setSalePrice] = useState("");

  const c = Number(cost) || 0;
  const s = Number(shipping) || 0;
  const sale = Number(salePrice) || 0;
  const duty = Math.round(sale * 0.1);
  const ebayFee = Math.round(sale * 0.2);
  const totalCost = c + s + duty + ebayFee;
  const profit = sale - totalCost;
  const margin = sale > 0 ? ((profit / sale) * 100).toFixed(1) : "—";

  return (
    <div style={{minHeight:"100vh",background:"#f5f5f5",display:"flex",justifyContent:"center",padding:"32px 16px"}}>
      <div style={{width:"100%",maxWidth:"380px"}}>
        <h1 style={{fontSize:"20px",fontWeight:"bold",margin:"0 0 4px"}}>eBay 粗利計算</h1>
        <p style={{fontSize:"12px",color:"#aaa",margin:"0 0 16px"}}>eBay手数料 20% / 関税 10% / DDP前提</p>
        <div style={{background:"#fff",borderRadius:"12px",padding:"0 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          {field("仕入れ金額", cost, setCost, "0")}
          {field("送料", shipping, setShipping, "2500")}
          {field("販売金額（JPY）", salePrice, setSalePrice, "0")}
        </div>
        <div style={{background:"#fff",borderRadius:"12px",padding:"0 16px",marginTop:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}>
            <span style={{fontSize:"14px",color:"#888"}}>eBay手数料 (20%)</span>
            <span style={{fontSize:"14px"}}>¥{ebayFee.toLocaleString()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}>
            <span style={{fontSize:"14px",color:"#888"}}>関税 (10%)</span>
            <span style={{fontSize:"14px"}}>¥{duty.toLocaleString()}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0"}}>
            <span style={{fontSize:"14px",color:"#888"}}>総コスト</span>
            <span style={{fontSize:"14px"}}>¥{totalCost.toLocaleString()}</span>
          </div>
        </div>
        <div style={{borderRadius:"12px",padding:"16px",marginTop:"12px",textAlign:"center",background:profit>=0?"#ecfdf5":"#fef2f2",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <p style={{fontSize:"12px",color:"#888",margin:"0 0 4px"}}>粗利</p>
          <p style={{fontSize:"32px",fontWeight:"bold",margin:0,color:profit>=0?"#059669":"#ef4444"}}>¥{profit.toLocaleString()}</p>
          <p style={{fontSize:"14px",color:"#aaa",margin:"4px 0 0"}}>利益率 {margin}%</p>
        </div>
        <button onClick={() => { setCost(""); setShipping("2500"); setSalePrice(""); }} style={{width:"100%",marginTop:"16px",padding:"8px",fontSize:"14px",color:"#aaa",background:"none",border:"none",cursor:"pointer"}}>リセット</button>
      </div>
    </div>
  );
}
