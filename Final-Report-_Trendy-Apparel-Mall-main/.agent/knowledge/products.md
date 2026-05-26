# Knowledge — 商品型錄

記錄商城內 24 件核心商品的詳細元數據。

## 分類定義
- **shirts (上衣)**: 含 Oversized T、印花 T、Polo 衫。
- **pants (褲子)**: 工作長褲、牛仔褲、休閒褲。
- **hoodies (連帽衫)**: 重磅衛衣、拉鍊外套。
- **jackets (外套)**: 機能風衣、飛行外套、皮衣。
- **bags (包包)**: 托特包、斜背包、戰術後背包。
- **jewelry (配飾)**: 平簷帽、純銀項鍊、針織毛帽。

## 數據模型
- `id`: 唯一識別碼 (如 p1, p2)。
- `price`: 售價。
- `style_tags`: 風格標籤 (用於智慧推薦篩選)。
- `material`: 材質說明。
- `is_preorder`: 是否為預購商品。

## 數據源
- 所有商品對象均存儲於 `index.html` 的 `PRODUCTS` 陣列中。
