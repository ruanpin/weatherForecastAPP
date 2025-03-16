# 專案描述
Project Name:  
Weather Forecast App  

Tech Stack: React + JavaScript + Vite ，並整合 Redux + RTK query、Tailwind CSS、React-router-dom、Lucide、Jest、Git、Vercel  

API整合:  
1.Weather Forecast API  
2.Geocoding API  
3.nominatim openstreetmap API



# 已實作的功能
1.搜尋功能:  
使用者能在搜尋欄中搜尋特定的城市，系統將會自動搜尋相關城市，待使用者點選特定城市後，系統將會自動帶出相關資料，如: 現在該城市天氣狀況, 該城市未來五天天氣狀況等資訊  

2.城市當前天氣狀況:  
此區塊呈現當前天氣狀況，包含: 城市名稱, 當前溫度, 天氣狀況（如晴天、多雲、下雨）, 風速, 濕度等資訊  

3.天氣預報:  
此區塊呈現未來五天天氣狀況，包含: 日期, 預測溫度（最低溫／最高溫）, 天氣狀況 （如晴天、多雲、下雨）等資訊  

4.儲存常用城市（收藏城市功能）（加分項目）:  
在城市當前天氣狀況區塊中，右下愛心按鈕為「加入/移除」常用城市清單，紅色愛心為已經加入，空心則為尚未加入收藏; 右上按鈕為點選開啟常用城市清單，並可進行「查看常用城市清單」、「快速選擇城市」、「移除」等功能  

5.攝氏/華氏溫度切換功能（加分項目）:  
在城市當前天氣狀況區塊中，左上°C／°F按鈕為切換為攝氏/華氏溫度功能，符號代表著當前為攝氏問度或者是華氏溫度



# 如何在本地端運行專案
在開始之前，請確保你的開發環境已安裝以下工具：  
Node.js 18+  
npm  
Git  

在終端機中執行  
1.git clone https://github.com/ruanpin/weatherForecastAPP.git  
2.cd weatherForecastAPP  
3.npm install  
4.npm run dev  
預設情況下，伺服器將運行在： http://localhost:5173  
若5173端口被佔用，請選擇終端機中顯示的新網址



# 線上應用程式連結
https://weather-forecast-app-sage-six.vercel.app/