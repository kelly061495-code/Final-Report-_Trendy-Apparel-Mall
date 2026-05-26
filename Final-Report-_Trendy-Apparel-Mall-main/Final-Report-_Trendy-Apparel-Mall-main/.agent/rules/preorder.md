# Rule — 預購商品規則

為了處理尚未正式到貨的商品，系統建立了預購機制，並在結帳時自動拆分訂單類別。

## 商品標記
- 預購屬性直接定義於 `PRODUCTS` 數據中：
  - `is_preorder: true` (標記為預購品)。
  - `available_date: "YYYY-MM-DD"` (預計到貨日)。

## UI 呈現
- **列表頁**: 商品卡片上方顯示 `預購中 PREORDER` 標籤。
- **詳情頁**: 彈窗內顯示 `預購商品項目` 標記。
- **結帳頁**: 訂單摘要中，預購品會額外顯示「預計到貨 [日期]」。

## 邏輯實作
- **渲染**: `renderCard()` 與 `openModal()` 直接檢查 `p.is_preorder`。
- **結帳摘要**: `renderCheckout()` 遍歷購物車，若偵測到預購屬性則在品項下方插入提示文字。

## 程式碼位置
- 數據定義：`index.html` 中的 `PRODUCTS` 陣列。
- UI 實現：`renderCard()`, `openModal()`, `renderCheckout()`。
