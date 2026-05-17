# 潮流服飾商城 (Trendy Apparel Mall)

本專案為「行動 App 開發期末專題」，根據老師公告之規範進行開發，採用 Vanilla JS/CSS 打造具備質感與互動性的單頁式網頁應用(SPA)，並完整落實「天下茶屋」課程所學之元件化與 Agent 架構思維。

## 專案資訊
- **主題**：潮流服飾商城 (Apparel Fashion Store)
- **組別**：2人組
- **組員**：邱渝璇、洪駿宥
- **Github Repo**：[https://github.com/kelly061495-code/Final-Report-_Trendy-Apparel-Mall.git](https://github.com/kelly061495-code/Final-Report-_Trendy-Apparel-Mall.git)

## 核心功能完成度
- ✅ **產品模組**：展示潮流服飾型錄，並具備詳細資料頁面。包含輸入數量的完整防呆檢測（例如無法輸入英文字母，不可超過庫存）。
- ✅ **採購模組**：購物車管理、總金額計算與結帳產出訂單功能。

## 加分項目完成清單 (共 4 項)
1. **[功能面] 會員模組**：實作註冊、登入、登出及個人資料修改。
2. **[功能面] 歷史訂單查詢**：實作過往採購紀錄的瀏覽與查詢功能。
3. **[功能面] 可同時採購多品項及數量**：實作可同時將多項不同的服飾加入購物車，並計算總金額結帳。
4. **[架構面] 採用 Agent 架構**：落實將 Skill, Workflows, Rules, Knowledge 分離至 `.agent` 資料夾下的 `.md` 檔案中進行管理。

## 專案目錄結構
```text
期末報告_2人組/
├── README.md
├── index.html          (主頁面結構)
├── css/
│   └── style.css       (共用樣式與主題)
├── js/
│   ├── app.js          (主程式進入點與路由切換)
│   ├── data.js         (模擬資料與本地儲存存取)
│   ├── auth.js         (會員模組邏輯)
│   ├── products.js     (產品展示與詳細頁邏輯)
│   └── cart.js         (購物車與訂單邏輯)
└── .agent/             (Agent 架構規範文件)
    ├── knowledge/
    ├── rules/
    ├── skills/
    └── workflows/
```

## 執行與測試方式
無需安裝額外依賴套件，請直接以任何現代瀏覽器開啟 `index.html` 即可運行本專案。
專案利用 `localStorage` 儲存會員與訂單資料，因此可完整體驗註冊、登入、加購物車至結帳產生歷史訂單之完整流程。
