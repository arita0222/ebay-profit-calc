"use client"
import { useState } from "react"

export default function ProfitCalc() {
  const [cost, setCost] = useState("")
  const [shipping, setShipping] = useState("2500")
  const [salePriceUsd, setSalePriceUsd] = useState("")
  const [rate, setRate] = useState("150")

  const c = Number(cost) || 0
  const s = Number(shipping) || 0
  const r = Number(rate) || 150
  const saleUsd = Number(salePriceUsd) || 0
  const saleJpy = Math.round(saleUsd * r)
  const ebayFee = Math.round(saleJpy * 0.2)
  const duty = Math.round(saleJpy * 0.1)
  const refund = Math.round(c * 0.1)
  const totalCost = c + s + ebayFee + duty
  const profitNoRefund = saleJpy - totalCost
  const profitWithRefund = profitNoRefund + refund
  const marginNo = saleJpy > 0 ? ((profitNoRefund / saleJpy) * 100).toFixed(1) : "—"
  const marginWith = saleJpy > 0 ? ((profitWithRefund / saleJpy) * 100).toFixed(1) : "—"

  const breakEvenSaleJpy = c + s > 0 ? Math.ceil((c + s) / 0.7) : 0
  const breakEvenSaleUsd = r > 0 ? (breakEvenSaleJpy / r).toFixed(2) : "—"
  const maxCostNoRefund = saleJpy - s - ebayFee - duty
  const maxCostWithRefund = Math.round((saleJpy - s - ebayFee - duty) / 0.9)

  const row = (label: string, value: string, border: boolean) => (
    <div className={`flex justify-between py-2.5 ${border ? "border-b border-gray-100" : ""}`}>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 pt-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-bold mb-1">eBay 粗利計算</h1>
        <p className="text-xs text-gray-400 mb-4">eBay手数料20% / 関税10% / DDP前提</p>

        <div className="bg-white rounded-xl shadow-sm px-4">
          {[
            { label: "仕入れ金額", value: cost, set: setCost, ph: "0", prefix: "¥" },
            { label: "送料", value: shipping, set: setShipping, ph: "2500", prefix: "¥" },
            { label: "販売金額", value: salePriceUsd, set: setSalePriceUsd, ph: "0", prefix: "$" },
            { label: "為替レート", value: rate, set: setRate, ph: "150", prefix: "¥/$" },
          ].map((f, i) => (
            <div key={i} className={`flex items-center justify-between py-3 ${i < 3 ? "border-b border-gray-100" : ""}`}>
              <span className="text-sm text-gray-600">{f.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">{f.prefix}</span>
                <input type="number" inputMode="decimal" value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="w-28 text-right text-lg font-semibold bg-transparent outline-none" />
              </div>
            </div>
          ))}
        </div>

        {saleUsd > 0 && (
          <>
            <div className="bg-white rounded-xl shadow-sm px-4 mt-3">
              {row("売上（円換算）", "¥" + saleJpy.toLocaleString(), true)}
              {row("仕入れ", "-¥" + c.toLocaleString(), true)}
              {row("送料", "-¥" + s.toLocaleString(), true)}
              {row("eBay手数料 (20%)", "-¥" + ebayFee.toLocaleString(), true)}
              {row("関税 (10%)", "-¥" + duty.toLocaleString(), true)}
              {row("還付金（消費税）", "+¥" + refund.toLocaleString(), true)}
              {row("総コスト", "¥" + totalCost.toLocaleString(), false)}
            </div>

            <div className="flex gap-2 mt-3">
              <div className={`flex-1 rounded-xl p-3 text-center shadow-sm ${profitNoRefund >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <p className="text-xs text-gray-500 mb-1">粗利（還付なし）</p>
                <p className={`text-2xl font-bold ${profitNoRefund >= 0 ? "text-green-600" : "text-red-500"}`}>¥{profitNoRefund.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{marginNo}%</p>
              </div>
              <div className={`flex-1 rounded-xl p-3 text-center shadow-sm ${profitWithRefund >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <p className="text-xs text-gray-500 mb-1">粗利（還付込み）</p>
                <p className={`text-2xl font-bold ${profitWithRefund >= 0 ? "text-green-600" : "text-red-500"}`}>¥{profitWithRefund.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{marginWith}%</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm px-4 mt-3">
              <p className="text-sm text-gray-500 pt-3 mb-0">損益分岐点</p>
              {row("販売（これ以上で売る）", "$" + breakEvenSaleUsd + "（¥" + breakEvenSaleJpy.toLocaleString() + "）", true)}
              {row("仕入れ上限（還付なし）", "¥" + maxCostNoRefund.toLocaleString(), true)}
              {row("仕入れ上限（還付込み）", "¥" + maxCostWithRefund.toLocaleString(), false)}
            </div>
          </>
        )}

        <button onClick={() => { setCost(""); setShipping("2500"); setSalePriceUsd(""); setRate("150") }} className="w-full mt-4 py-2 text-sm text-gray-400 bg-transparent border-none cursor-pointer">リセット</button>
      </div>
    </div>
  )
}
