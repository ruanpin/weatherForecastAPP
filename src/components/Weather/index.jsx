import React from 'react';
import { Sun, Cloudy, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning, Minus } from 'lucide-react';

import Search from './Search'
import Weather_Current from './Weather_Current'
import Weather_forecast from './Weather_forecast'

// 實作概念：
// 搜尋欄元件輸入城市 >> fetch城市名 >> 下拉選單元件選擇城市 >> fetch經緯度 >>  存入Redux
// >> 「現在天氣」、「未來天氣」元件偵測Redux中經緯度變化 >> fetch天氣資訊 >> 取得天氣概況 

export const weatherCodeToIcon = {
  0: Sun,
  1: CloudSun,
  2: CloudSun,
  3: Cloudy,
  45: CloudFog,
  48: CloudFog,
  51: CloudDrizzle,
  53: CloudDrizzle,
  55: CloudDrizzle,
  56: CloudDrizzle,
  57: CloudDrizzle,
  61: CloudRain,
  63: CloudRain,
  65: CloudRainWind,
  66: CloudRain,
  67: CloudRainWind,
  71: CloudSnow,
  73: CloudSnow,
  75: CloudSnow,
  77: CloudSnow,
  80: CloudRain,
  81: CloudRain,
  82: CloudRainWind,
  85: CloudSnow,
  86: CloudSnow,
  95: CloudLightning,
  96: CloudLightning,
  99: CloudLightning,
};

export const WeatherCodeToIconComponent = React.memo(({ code }) => {
  const IconComponent = weatherCodeToIcon[code] || Minus;
  return <IconComponent className="w-8 h-8 text-gray-500"/>
});

function Weather({ children }) {
  return children;
}

Weather.Search = Search;
Weather.Weather_Current = Weather_Current
Weather.Weather_forecast = Weather_forecast

export default Weather;
