# Workflow — 會員註冊與登入

商城採用純前端模擬的會員系統，確保使用者能體驗完整的電商會員功能。

## 註冊流程
1. 使用者填寫姓名、Email 與密碼。
2. 系統檢查 Email 是否已被註冊過。
3. 驗證通過後，將帳號資訊存入 `localStorage` 的 `trendy_users` 陣列。
4. 自動登入並顯示歡迎 Toast。

## 登入流程
1. 使用者輸入 Email 與密碼。
2. 系統在 `trendy_users` 內匹配。
3. 比對成功後，將使用者物件存入 `AppState.user`。
4. 保存狀態至 `localStorage` 並刷新 UI。

## 註冊與登入介面 (UI Management)
- **Modal 切換**: 使用 `toggleAuth()` 開啟或關閉會員視窗。
- **模式切換**: 透過 `switchToLogin()` 與 `switchToRegister()` 在同一彈窗內切換表單顯示。
- **即時回饋**: 若驗證失敗，會顯示 `login-error` 或 `register-error` 提示文字。

## 程式碼實作
- **後端邏輯**: `index.html` 中的 `handleLogin()` 與 `handleRegister()`。
- **UI 控制**: `toggleAuth()`, `switchToLogin()`, `switchToRegister()`, `handleAccountClick()`。
