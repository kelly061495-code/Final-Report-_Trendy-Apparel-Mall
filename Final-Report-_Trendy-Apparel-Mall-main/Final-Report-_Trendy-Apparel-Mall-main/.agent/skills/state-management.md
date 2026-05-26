# Skill — 狀態持久化管理

本系統採用 `localStorage` 技術，確保使用者在重新整理頁面或再次訪問時，資料不會遺失。

## 管理內容
1. **使用者身分 (`user`)**: 記錄當前登入的使用者姓名與 Email。
2. **購物車 (`cart`)**: 保存商品 ID、選定尺寸及數量。
3. **願望清單 (`wishlist`)**: 記錄收藏的商品 ID。
4. **訂單記錄 (`orders`)**: 持久化保存所有已成立的訂單歷史。

## 運作機制
- **讀取 (`load`)**: 頁面載入時從 `localStorage` 讀取 JSON 字串並轉回 JS 物件。
- **儲存 (`save`)**: 任何增刪改操作 (如加入購物車) 後, 立即同步回 `localStorage`。

## 程式碼位置
- 實作函式：`index.html` 中的 `save()` 與 `load()`。
- Key 名稱：`trendy_v2_state`。
