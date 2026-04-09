import { useState } from "react";

const field = (label, value, onChange, placeholder, unit) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}>
    <label style={{fontSize:"14px",color:"#666"}}>{label}</label>
    <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
      <span style={{fontSize:"14px",color:"#aaa"}}>{unit || "¥"}</span>
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

const row = (label, value, border) => (
  <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:border?"1px solid #f0f0f0":"none"}}>
    <span style={{fontSize:"14px",color:"#888"}}>{label}</span>
    <span style={{fontSize:"14px"}}>{value}</span>
  </div>
);

export default function App() {
  const [cost, setCost] = useState("");
  const [shipping, setShipping] = useState("2500");
  const [salePrice, setSalePrice] = useState("");
  const [rate, setRate] = useState("150");

  const c = Number(cost) || 0;
  const s = Number(shipping) || 0;
  const sale = Number(salePrice) || 0;
  const r = Number(rate) || 150;
  const saleUsd = (sale / r).toFixed(2);
  const duty = Math.round(sale * 0.1);
  const ebayFee = Math.round(sale * 0.2);
  const refund = Math.round(c * 10 / 110);
  const totalCost = c + s + duty + ebayFee;
  const profitNoRefund = sale - totalCost;
  const profitWithRefund = profitNoRefund + refund;
  const marginNo = sale > 0 ? ((profitNoRefund / sale) * 100).toFixed(1) : "—";
  const marginWith = sale > 0 ? ((profitWithRefund / sale) * 100).toFixed(1) : "—";
  const breakEvenSaleJpy = Math.round((c - refund + s) / 0.7);
  const breakEvenSaleUsd = (breakEvenSaleJpy / r).toFixed(2);
  const maxCostNoRefund = sale - s - duty - ebayFee;
  const maxCostWithRefund = Math.round((sale - s - duty - ebayFee) * 110 / 100);

  return (
    <div style={{minHeight:"100vh",background:"#f5f5f5",display:"flex",justifyContent:"center",padding:"32px 16px"}}>
      <div style={{width:"100%",maxWidth:"380px"}}>
        <h1 style={{fontSize:"20px",fontWeight:"bold",margin:"0 0 4px"}}>eBay 粗利計算</h1>
        <p style={{fontSize:"12px",color:"#aaa",margin:"0 0 16px"}}>eBay手数料 20% / 関税 10% / DDP前提</p>
        <div style={{background:"#fff",borderRadius:"12px",padding:"0 16px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          {field("仕入れ金額", cost, setCost, "0")}
          {field("送料", shipping, setShipping, "2500")}
          {field("販売金額（JPY）", salePrice, setSalePrice, "0")}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}>
            <span style={{fontSize:"14px",color:"#666"}}>販売金額（USD）</span>
            <span style={{fontSize:"18px",fontWeight:500}}>${saleUsd}</span>
          </div>
          {field("為替レート", rate, setRate, "150", "¥/$")}
        </div>
        <div style={{background:"#fff",borderRadius:"12px",padding:"0 16px",marginTop:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          {row("eBay手数料 (20%)", "¥" + ebayFee.toLocaleString(), true)}
          {row("関税 (10%)", "¥" + duty.toLocaleString(), true)}
          {row("還付金（消費税）", "¥" + refund.toLocaleString(), true)}
          {row("総コスト", "¥" + totalCost.toLocaleString(), false)}
        </div>
        <div style={{display:"flex",gap:"8px",marginTop:"12px"}}>
          <div style={{flex:1,borderRadius:"12px",padding:"14px 8px",textAlign:"center",background:profitNoRefund>=0?"#ecfdf5":"#fef2f2",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
            <p style={{fontSize:"11px",color:"#888",margin:"0 0 4px"}}>粗利（還付なし）</p>
            <p style={{fontSize:"24px",fontWeight:"bold",margin:0,color:profitNoRefund>=0?"#059669":"#ef4444"}}>¥{profitNoRefund.toLocaleString()}</p>
            <p style={{fontSize:"12px",color:"#aaa",margin:"4px 0 0"}}>{marginNo}%</p>
          </div>
          <div style={{flex:1,borderRadius:"12px",padding:"14px 8px",textAlign:"center",background:profitWithRefund>=0?"#ecfdf5":"#fef2f2",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
            <p style={{fontSize:"11px",color:"#888",margin:"0 0 4px"}}>粗利（還付込み）</p>
            <p style={{fontSize:"24px",fontWeight:"bold",margin:0,color:profitWithRefund>=0?"#059669":"#ef4444"}}>¥{profitWithRefund.toLocaleString()}</p>
            <p style={{fontSize:"12px",color:"#aaa",margin:"4px 0 0"}}>{marginWith}%</p>
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:"12px",padding:"0 16px",marginTop:"12px",boxShadow:"0 1px 3px rgba(0,0,0,0.08)"}}>
          <p style={{fontSize:"13px",color:"#666",padding:"12px 0 0",margin:0}}>損益分岐点</p>
          {row("販売（これ以上で売る）", "$" + breakEvenSaleUsd + "（¥" + breakEvenSaleJpy.toLocaleString() + "）", true)}
          {row("仕入れ上限（還付なし）", "¥" + maxCostNoRefund.toLocaleString(), true)}
          {row("仕入れ上限（還付込み）", "¥" + maxCostWithRefund.toLocaleString(), false)}
        </div>
        <button onClick={() => { setCost(""); setShipping("2500"); setSalePrice(""); setRate("150"); }} style={{width:"100%",marginTop:"16px",padding:"8px",fontSize:"14px",color:"#aaa",background:"none",border:"none",cursor:"pointer"}}>リセット</button>
      </div>
    </div>
  );
}
