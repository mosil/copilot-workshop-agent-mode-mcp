# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App，提供日常待辦事項的建立、整理與狀態管理功能。專案以離線可執行為目標，並保留簡潔、容易理解的使用介面。

## 線上展示

[開啟 GitHub Pages](https://mosil.github.io/copilot-workshop-agent-mode-mcp/)

![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)

## 功能

- 新增待辦事項,空白內容不會被加入。
- 勾選待辦事項並標記為已完成,完成項目會顯示刪除線與淡化效果。
- 逐筆刪除待辦事項。
- 顯示整體未完成事項數量。
- 清單沒有項目時顯示空狀態提示。
- 使用 `localStorage` 保存待辦資料,重新整理後仍可保留。
- 支援淺色與深色模式切換。
- 深色模式會記住使用者偏好,未手動設定時跟隨作業系統主題。
- 支援「全部」、「未完成」與「已完成」篩選。
- 篩選後沒有符合條件的項目時顯示對應提示。
- 提供「清除已完成」功能,刪除前會使用瀏覽器確認對話框。
- 沒有已完成事項時,「清除已完成」按鈕會停用。
- 支援手機螢幕與響應式版面。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用任何框架或套件。
- 不引用外部 CDN,可以離線開啟。
- 使用 CSS 變數集中管理介面色彩。
- 使用原生 DOM API 建立與更新待辦清單。
- 使用 `localStorage` 保存待辦資料與主題偏好。

## 開發方式

這個專案以 GitHub Copilot Agent Mode 協助規劃與實作待辦清單功能,逐步完成基礎功能、深色模式與篩選功能。

透過 MCP 連接 Microsoft Learn 文件工具,查詢 `prefers-color-scheme` 與網頁無障礙色彩對比相關建議；也透過 GitHub MCP 讀取 issue、整理需求,並協助建立修復用的 Pull Request。

專案另外使用 `.github/prompts` 中的 `fix-issue.prompt.md` 定義 agentic workflow,將讀取 issue、提出計畫、建立分支、修改程式、驗證、提交推送與建立 Pull Request 的流程固定下來。

## 我學到什麼

- 如何使用 Agent Mode 將需求拆解成可驗證的前端開發步驟。
- 如何透過 MCP 查詢官方文件與 GitHub issue,讓開發決策有明確依據。
- 如何使用 `localStorage` 保存使用者資料與介面偏好。
- 如何在純原生 JavaScript 中管理篩選、主題切換與動態 DOM 更新。
- 如何以 issue、分支、驗證、commit 與 Pull Request 組織一次完整的修復流程。
