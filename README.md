# 佳思教育 Joy n Think · 幫你實現夢想

香港中小學課外輔導機構一站式後台管理系統。

## 技術棧

- **前端**：純靜態 HTML + CSS + JavaScript（GitHub Pages 部署）
- **後端**：Supabase（PostgreSQL + REST API + Edge Functions）
- **認證**：Supabase Auth + 自訂 `login_account` RPC

## 功能模組

### 前台
- 機構介紹、師資展示、課程查詢
- 報名諮詢表單（`form.html`）→ 觸發 Supabase Edge Function 發送 Email 通知

### 後台管理（`admin.html`）
- 教師／學生／課程／報名 CRUD
- 課表管理（`schedules` 表）
- 點名系統（支援 .xlsx 匯入）
- 回訪記錄
- **教學資源**：上傳檔案至 GitHub 倉庫，元數據存入 Supabase

### 獨立子系統
- **財務系統**（`finance.html`）：收支管理、分類統計、月度報表、Chart.js 圖表
- **審批流程**（`workflow.html`）：多步驟審批鏈、時間軸記錄
- **教育新聞**（`news.html`）：GitHub Actions 定時抓取教育局 RSS（每 6 小時）

### 系統功能
- 角色權限登入（`login_account` RPC）
- 操作審計日誌（`audit_log` 表 + IP 查詢）
- Email 通知（QQ SMTP 465 · Supabase Edge Functions）

## 架構

```
.github/workflows/fetch-news.yml     # 新聞 RSS 定時抓取（每 6h）
.github/workflows/deploy-functions.yml # Edge Function 自動部署
supabase/
└─ functions/send-confirmation/       # 報名確認郵件 Edge Function
supabase-setup.sql                    # 完整資料表 DDL
```

## 資料庫主要表格

| 表 | 用途 |
|---|---|
| `teachers` / `students` / `courses` / `registrations` | 核心業務 |
| `schedules` | 課表時間 |
| `accounts` | 後台登入帳號 |
| `attendance` | 點名紀錄 |
| `finance_categories` / `finance_transactions` | 財務 |
| `workflow_requests` / `workflow_approvals` | 審批 |
| `resources` | 教學資源元數據 |
| `audit_log` | 審計日誌 |

## 部署

- 網站：<https://bennyhwang.github.io/MyChance/>
- 後台登入：`admin.html`（需 Supabase Auth 帳號）
- 財務系統：`finance.html`
- 審批流程：`workflow.html`
- 教育新聞：`news.html`

> 系統依賴 Supabase 後端，靜態頁面需配合 Supabase 項目方可正常運作。
