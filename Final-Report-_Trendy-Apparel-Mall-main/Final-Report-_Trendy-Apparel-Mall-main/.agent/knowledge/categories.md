# Knowledge — 商品分類 (Categories)

本商城將商品劃分為多個核心導航分類，協助使用者快速篩選特定類型的單品。

## 分類清單

| ID | 顯示名稱 (zh) | 說明 |
|:---|:---|:---|
| `all` | 全部商品 | 顯示數據庫中所有的 24 件單品。 |
| `shirts` | 上衣 | 包含短袖 T-Shirt、長袖 T-Shirt 與 Polo 衫。 |
| `pants` | 褲子 | 包含工裝褲、牛仔褲與休閒長褲。 |
| `hoodies` | 連帽衫 | 各式重磅與柔棉連帽衛衣。 |
| `jackets` | 外套 | 包含機能風衣、飛行外套與皮衣。 |
| `bags` | 包包 | 包含工作包、斜跨包與戰術後背包。 |
| `jewelry` | 配飾 | 包含帽子、純銀銀飾與項鍊。 |

## 應用邏輯
- **導覽列**: Header 點擊對應按鈕後觸發 `navigateTo('shop', 'category_id')`。
- **渲染**: `renderShop()` 依據傳入的 `cat` 篩選 `PRODUCTS` 清單。
- **店鋪統計**: 分類標題下方會顯示該分類下的件數 (如 "8 件精選潮流單品")。

## 程式碼位置
- 常數定義：`index.html` 中的 `CATEGORIES` 物件。
- 導航邏輯：`index.html` 中的 `navigateTo()` 函式。
