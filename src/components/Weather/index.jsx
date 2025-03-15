import { Sun, Cloudy, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudHail, CloudLightning, Wind, Droplets, Minus } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MyInput from '@/components/MyInput';
import MyCard from '@/components/MyCard'
import MyBox from '@/components/MyBox'
import Loading from '@/components/Loading'
import debounce from '@/utils/debounce';

import { useLazySearchCityQuery } from '@/redux/services/cityApi';
import { useLazyGetCityWeatherCurrentQuery } from '@/redux/services/weatherApi'

import { useLazyGetLatitudeLongitudeQuery } from '@/redux/services/latitudeAndLongitudeApi';
import { setLatitudeLongitude, setSelectedCity, setIsSearchProcessing } from '@/redux/slices/weatherSlice';

const weatherCodeToIcon = {
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

function Weather({ children }) {
  return children;
}

function Search() {
  const [cityName, setCityName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownList, setDropList] = useState([])
  const [searchCity, { isError, isFetching }] = useLazySearchCityQuery(); // 輸入框提示區塊搜尋城市API

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
      const result = await searchCity(query).unwrap()
      setDropList(() => result?.results || [])
      } catch (err) {
        console.error('Error fetching data', err);
      }
    }, 200)
  , []);

  // user在input輸入後進行開啟Dropdown並取得關鍵字關聯地區（如Google search打字時提示框）
  const handleSearch = (value) => {
    setCityName(value);
    if (value) {
      setIsDropdownOpen(true);
      debouncedSearch(value)
    } else {
      setIsDropdownOpen(false);
      setDropList(() => []) 
    }
  };

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
          rounded-[24px] 
        "
        placeholder="Search for places..."
        type="text"
        value={cityName}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />
      {
        isDropdownOpen
        && cityName.length >= 2
        &&  <Dropdown
              isFetching={isFetching}
              isError={isError}
              dropdownList={dropdownList}
              setCityName={setCityName}
              setIsDropdownOpen={setIsDropdownOpen}
            />
      }
    </div>
  )
}

function Dropdown({ isFetching, isError, dropdownList, setCityName, setIsDropdownOpen }) {
  const dispatch = useDispatch();
  const [getLatitudeLongitude] = useLazyGetLatitudeLongitudeQuery();

  // 查詢經緯度後儲存至Redux
  const fetchLatLong = async (city) => {
    try {
      dispatch(setIsSearchProcessing(true));
      const result = await getLatitudeLongitude(city).unwrap();
      dispatch(setLatitudeLongitude({
        latitude: result?.[0]?.lat,
        longitude: result?.[0]?.lon,
      }));
      if (!result?.[0]?.lat || !result?.[0]?.lon) {
        dispatch(setIsSearchProcessing(false));
        dispatch(setLatitudeLongitude({
          latitude: null,
          longitude: null,
        }));
      }
    } catch (error) {
      dispatch(setIsSearchProcessing(false));
      console.error('Error fetching latitude and longitude:', error);
    }
  };

  // User在Dropdown區塊選擇特定地區後執行查詢經緯度
  const handleDropdownSelect = (city) => {
    setCityName(city);
    setIsDropdownOpen(false);
    
    if (city) {
      dispatch(setSelectedCity(city));
      fetchLatLong(city);
    }
  };
  return (
    <div className="absolute top-full w-full left-1/2 -translate-x-1/2 max-h-[300px] z-50 px-4 flex justify-center">
      <ul className="
        max-w-[800px] w-full
        bg-white border border-gray-300 shadow-lg rounded-md
        max-h-[300px] z-50
      ">
        {
          isFetching ? (
            <Loading />
          ) : isError ? (
            <li className="p-2 text-red-500 text-center">Error loading cities</li>
          ) : !(dropdownList?.length) ? (
            <li className="p-2 text-gray-500 text-center">No results</li>
          ) : (
            dropdownList?.map((city) => (
              <li
                key={city.id}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleDropdownSelect(`${city.name}, ${city.country}`)}
              >
                {city.name}, {city.country}
              </li>
            ))
          )
        }
      </ul>
    </div>
  )
}

// function CloudSun({ className }) {
//   return (
//     <div className={`relative ${className}`}>
//         {/* <Sun className={`text-yellow-500 absolute -top-1 left-2 ${className}`}/>
//         <Cloud className={`text-gray-500 absolute top-2 ${className}`} fill="white"/> */}
//         <Sun className={`text-yellow-500 absolute ${className} transform translate-x-2 translate-y-[-0.25rem]`} />
//         <Cloud className={`text-gray-500 absolute ${className} transform translate-x-2 translate-y-[0.5rem]`} fill="white" />
//     </div>
//   )
// }

// function CloudSun({ className }) {
//   return (
//     <div className={`relative ${className}`}>
//         {/* Sun元素放置在父容器的中心 */}
//         <Sun className={`text-yellow-500 absolute ${className} transform translate-x-2 translate-y-[-0.25rem]`} />
        
//         {/* Cloud元素微調，使其右上角遮住Sun的左下角 */}
//         <Cloud 
//           className={`text-gray-500 absolute ${className} transform translate-x-[30%] translate-y-[-30%]`} 
//           fill="white"
//         />
//     </div>
//   );
// }

function Weather_Current() {
  const dispatch = useDispatch();
  const citysName = useSelector((state) => state.weather.selectedCity);
  const citysLatitudeLongitude = useSelector((state) => state.weather.citysLatitudeLongitude);
  const [getCityWeatherCurrent, { isFetching }] = useLazyGetCityWeatherCurrentQuery();
  const [weatherData, setWeatherData] = useState({
    weatherCode: "",
    temperature_2m: "",
    temperature_2m_unit: "",
    wind_speed_10m: "",
    wind_speed_10m_unit: "",
    relative_humidity_2m: "",
    relative_humidity_2m_unit: ""
  })

  const fetchWeather = async (latitudeLongitude) => {
    try {
      const result = await getCityWeatherCurrent(latitudeLongitude).unwrap();
      console.log(result, 'weatherCurrently')

      setWeatherData(() => ({
        weatherCode: result?.current?.weather_code,
        temperature_2m: result?.current?.temperature_2m,
        temperature_2m_unit: result?.current_units?.temperature_2m,
        wind_speed_10m: result?.current?.wind_speed_10m,
        wind_speed_10m_unit: result?.current_units?.wind_speed_10m,
        relative_humidity_2m: result?.current?.relative_humidity_2m,
        relative_humidity_2m_unit: result?.current_units?.relative_humidity_2m
      }))
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      dispatch(setIsSearchProcessing(false));
    }
  };
  
  useEffect(() => {
    if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
      fetchWeather(citysLatitudeLongitude)
    }
    if (citysLatitudeLongitude.latitude === null && citysLatitudeLongitude.longitude === null) {
      setWeatherData(() => ({
        weatherCode: undefined,
        temperature_2m: 'no data',
        temperature_2m_unit: '',
        wind_speed_10m: 'no data',
        wind_speed_10m_unit: '',
        relative_humidity_2m: 'no data',
        relative_humidity_2m_unit: ''
      }))
    }
  }, [citysLatitudeLongitude.latitude, citysLatitudeLongitude.longitude])

  const WeatherIcon = weatherCodeToIcon[weatherData?.weatherCode] || Minus;
  return (
    <div className="flex justify-center items-center px-4 my-4">
      <MyCard>
        <div className="flex-1 flex justify-center items-center mb-6 md:mb-0">
          {
            isFetching
            ? <Loading />
            : <WeatherIcon className="w-32 h-32 text-gray-500"/>
          }
        </div>
        <div className="flex flex-col text-center md:text-left flex-1 ">
          <div className="text-[1.8em]">{ citysName || '-'}</div>
          <div className="text-[3em]">{weatherData.temperature_2m || '-'} {weatherData.temperature_2m_unit || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 justify-center md:justify-start flex-1">
          <div className="flex items-center gap-3 justify-center justify-start">
            <Wind className="w-9 h-9 text-black" />
            <span className="text-[1.5em]">{weatherData.wind_speed_10m || '-'} {weatherData.wind_speed_10m_unit || '-'}</span>
          </div>
          <div className="flex items-center gap-3 justify-center justify-start">
            <Droplets className="w-9 h-9 text-black" />
            <span className="text-[1.5em]">{weatherData.relative_humidity_2m || '-'} {weatherData.relative_humidity_2m_unit || '-'}</span>
          </div>

        </div>
      </MyCard>
    </div>
  )
}

function Weather_forecast() {
  return (
    <div className="px-4 flex justify-center items-center mb-6">
      <div
        className="
          relative flex flex-col items-center py-4 md:py-6 px-4 md:px-8 bg-[#F7F6F9] w-full max-w-[800px] rounded-[24px] gap-2 md:gap-3
        "
      >
        <MyBox>
          <div>3/15</div>
          <div>28°C</div>
          <div>
            <Sun className="w-8 h-8 text-yellow-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/16</div>
          <div>23°C</div>
          <div>
            <CloudSun className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/17</div>
          <div>18°C</div>
          <div>
            <Cloudy className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/18</div>
          <div>16°C</div>
          <div>
            <CloudDrizzle className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/19</div>
          <div>15°C</div>
          <div>
            <CloudRainWind className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
      </div>
    </div>
  )
}

Weather.Search = Search;
Weather.Weather_Current = Weather_Current
Weather.Weather_forecast = Weather_forecast

export default Weather;
