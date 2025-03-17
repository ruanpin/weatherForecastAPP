import React from 'react';
import { Sun, Cloudy, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning, Minus, OctagonAlert} from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import MyInput from '@/components/MyInput';

import { useLazySearchCityQuery } from '@/redux/services/cityApi';

import { setErrorMsg } from '@/redux/slices/weatherSlice';

import debounce from '@/utils/debounce';
import { validateEnglishCommaSpaceEmpty } from '@/utils/formatValidate'

import Dropdown from './Dropdown'
import Weather_Current from './Weather_Current'
import Weather_forecast from './Weather_forecast'

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

function Search() {
  const dispatch = useDispatch();
  const [cityName, setCityName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownList, setDropList] = useState([])
  const [searchCity, { isError, isFetching }] = useLazySearchCityQuery(); // 輸入框提示區塊搜尋城市API
  const [isInputFormatValid, setIsInputFormatValid] = useState(true)

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
        const result = await searchCity(query).unwrap()
        setDropList(() => result?.results || [])
      } catch (err) {
        console.error('Error fetching data', err);
        dispatch(setErrorMsg({isError: true, errorMsg: err.error}))
      }
    }, 200),
    [searchCity, dispatch]
  );

  // user在input輸入後進行開啟Dropdown並取得關鍵字關聯地區（如Google search打字時提示框）
  const handleSearch = useCallback((value) => {
    setCityName(value);
    // 檢查input格式
    if (validateEnglishCommaSpaceEmpty(value)) {
      setIsInputFormatValid(true)
    } else {
      setIsInputFormatValid(false)
      setIsDropdownOpen(false);
      return
    }
    
    if (value) {
      setIsDropdownOpen(true);
      debouncedSearch(value)
    } else {
      setIsDropdownOpen(false);
      setDropList(() => []) 
    }
  }, [debouncedSearch]);

  // user點擊非Dropdown位置時，Dropdown會關閉功能
  const searchRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="px-4 flex justify-center items-center relative" ref={searchRef}>
      <MyInput
        className="
          w-full p-3 bg-white border border-2 border-gray-400 rounded placeholder:text-gray-700
          focus:outline-none focus:border-black transition-colors duration-300 max-w-[800px]
          rounded-[24px] border-solid
        "
        placeholder="Search for places..."
        type="text"
        value={cityName}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {
        !isInputFormatValid
        && (<div className="absolute top-full w-full z-50 px-4 flex justify-center">
              <div className="max-w-[800px] w-full text-[#AF241B] flex items-center gap-1.5 pl-3">
                <div className="flex items-start h-[100%]"><OctagonAlert size={20} className="p-1"/></div>
                <div className="text-[14px]">Only English letters, commas, and spaces are allowed.</div>
              </div>
          </div>)
      }
      
      {
        isDropdownOpen
        && cityName.length >= 2
        && (
          <Dropdown
            isFetching={isFetching}
            isError={isError}
            dropdownList={dropdownList}
            setCityName={setCityName}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        )
      }
    </div>
  )
}

Weather.Search = Search;
Weather.Weather_Current = Weather_Current
Weather.Weather_forecast = Weather_forecast

export default Weather;
