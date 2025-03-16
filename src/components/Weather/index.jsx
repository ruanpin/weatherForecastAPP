import { Sun, Cloudy, CloudSun, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudSnow, CloudLightning, Wind, Droplets, Minus, OctagonAlert, Heart, AlignLeft, X } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import MyInput from '@/components/MyInput';
import MyCard from '@/components/MyCard'
import MyBox from '@/components/MyBox'
import Loading from '@/components/Loading'
import MyPopup from '@/components/MyPopup'

import { useLazySearchCityQuery } from '@/redux/services/cityApi';
import { useLazyGetCityWeatherCurrentQuery } from '@/redux/services/weatherApi'

import { useLazyGetLatitudeLongitudeQuery } from '@/redux/services/latitudeAndLongitudeApi';
import { setLatitudeLongitude, setSelectedCity, setIsSearchProcessing_current, setIsSearchProcessing_forecast, setErrorMsg, setTemperature_unit } from '@/redux/slices/weatherSlice';

import debounce from '@/utils/debounce';
import { formatWeatherData_daily } from '@/utils/formatWeatherData'
import { validateEnglishCommaSpaceEmpty } from '@/utils/formatValidate'

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

const WeatherCodeToIconComponent = (code) => {
  const IconComponent = weatherCodeToIcon[code.code] || Minus;
  return <IconComponent className="w-8 h-8 text-gray-500"/>
}

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

  const debouncedSearch = debounce(async (query) => {
      try {
      const result = await searchCity(query).unwrap()
      setDropList(() => result?.results || [])
      } catch (err) {
        console.error('Error fetching data', err);
        dispatch(setErrorMsg({isError: true, errorMsg: err.error}))
      }
    }, 200);

  // user在input輸入後進行開啟Dropdown並取得關鍵字關聯地區（如Google search打字時提示框）
  const handleSearch = (value) => {
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
  const selectedCity = useSelector((state) => state.weather.selectedCity)
  const [getLatitudeLongitude] = useLazyGetLatitudeLongitudeQuery();

  // 查詢經緯度後儲存至Redux
  const fetchLatLong = async (city) => {
    if (selectedCity === city) return

    try {
      dispatch(setIsSearchProcessing_current(true));
      dispatch(setIsSearchProcessing_forecast(true));
      const result = await getLatitudeLongitude(city).unwrap();
      dispatch(setLatitudeLongitude({
        latitude: result?.[0]?.lat,
        longitude: result?.[0]?.lon,
      }));
      dispatch(setSelectedCity(city));

      if (!result?.[0]?.lat || !result?.[0]?.lon) {
        dispatch(setIsSearchProcessing_current(false));
        dispatch(setIsSearchProcessing_forecast(false));
        dispatch(setLatitudeLongitude({
          latitude: null,
          longitude: null,
        }));
        dispatch(setSelectedCity('City not found'));
      }
    } catch (err) {
      dispatch(setIsSearchProcessing_current(false));
      dispatch(setIsSearchProcessing_forecast(false));
      console.error('Error fetching latitude and longitude:', err);
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}))
    }
  };

  // User在Dropdown區塊選擇特定地區後執行查詢經緯度
  const handleDropdownSelect = (city) => {
    setCityName(city);
    setIsDropdownOpen(false);
    
    if (city) {
      fetchLatLong(city);
    }
  };
  return (
    <div className="absolute top-full w-full max-h-[300px] z-50 px-4 flex justify-center">
      <ul className="
        max-w-[800px] w-full
        bg-white border border-gray-300 shadow-lg rounded-md
        max-h-[300px] z-50 border-solid
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
  const temperature_unit = useSelector((state) => state.weather.temperature_unit);

  // 我的收藏城市功能
  const [showPopup, setShowPopup] = useState(false);
  const [favoriteCitiesList, setFavoriteCitiesList] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const setFavoriteCities = (newFavorites) => {
    // 設置最新收藏城市清單進localStorage & 當前組件變數
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    setFavoriteCitiesList(newFavorites);
  }

  useEffect(() => {
    // 收藏城市彈窗中資料初始化和更新收藏城市list
    const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    setFavoriteCitiesList(favorites);
    // 當前城市是否已收藏（愛心變紅或空白處理）
    setIsFavorite(favorites.some(city => city.cityName === citysName));
  }, [citysName]);

  const handleFavorite = () => {
    // 當前城市天氣右下愛心，點選處理收藏or移除
    if (!citysName || citysName === "City not found") return;

    const existingCity = favoriteCitiesList.find(city => city.cityName === citysName);

    if (!existingCity) {
      // 尚未收藏，因此收藏
      if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
        const newCity = {
          cityName: citysName,
          lat: citysLatitudeLongitude.latitude,
          lon: citysLatitudeLongitude.longitude
        };
        const newFavorites = [...favoriteCitiesList, newCity];
        setFavoriteCities(newFavorites)
        setIsFavorite(true);
      }
    } else {
      // 已經收藏，因此移除
      const newFavorites = favoriteCitiesList.filter(city => city.cityName !== citysName);
      setFavoriteCities(newFavorites)
      setIsFavorite(false);
    }
  };

  // 從收藏彈窗中選擇特定城市
  const handleSelectFavorite = (city) => {
    dispatch(setSelectedCity(city.cityName));
    dispatch(setLatitudeLongitude({
      latitude: city.lat,
      longitude: city.lon
    }));
    setShowPopup(false);
  };

  // 從收藏彈窗中移除特定城市
  const handleDeleteFavorite = (city) => {
    const newFavorites = favoriteCitiesList.filter(item => item.cityName !== city.cityName);
    setFavoriteCities(newFavorites)
    if (city.cityName === citysName) {
      setIsFavorite(false);
    }
  }

  const fetchWeather = useCallback(async (latitudeLongitude, temperature_unit) => {
    try {
      const result = await getCityWeatherCurrent({
        ...latitudeLongitude,
        params: `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code${temperature_unit === '°C' ? '' : '&temperature_unit=fahrenheit'}`
      }).unwrap();
      // console.log(result, 'weatherCurrently')

      setWeatherData(() => ({
        weatherCode: result?.current?.weather_code,
        temperature_2m: result?.current?.temperature_2m,
        temperature_2m_unit: result?.current_units?.temperature_2m,
        wind_speed_10m: result?.current?.wind_speed_10m,
        wind_speed_10m_unit: result?.current_units?.wind_speed_10m,
        relative_humidity_2m: result?.current?.relative_humidity_2m,
        relative_humidity_2m_unit: result?.current_units?.relative_humidity_2m
      }))
    } catch (err) {
      console.error('Error fetching weather data:', err);
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}))
    } finally {
      dispatch(setIsSearchProcessing_current(false));
    }
  }, [getCityWeatherCurrent, dispatch]);
  
  useEffect(() => {
    if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
      dispatch(setIsSearchProcessing_current(true));
      fetchWeather(citysLatitudeLongitude, temperature_unit)
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
  }, [citysLatitudeLongitude.latitude, citysLatitudeLongitude.longitude, dispatch, fetchWeather, citysLatitudeLongitude, temperature_unit])

  const WeatherIcon = weatherCodeToIcon[weatherData?.weatherCode] || Minus;

  return (
    <div className="flex justify-center items-center px-4 my-10">
      <MyCard>
        <div className="flex-1 flex justify-center items-center mb-6 md:mb-0">
          {
            isFetching
            ? <Loading />
            : <WeatherIcon className="w-32 h-32 text-gray-500"/>
          }
        </div>
        <div className="flex flex-col text-center md:text-left flex-1 max-w-[300px] md:max-x-[350px]">
          <div className="text-[1.8em] break-words">{ citysName || '-'}</div>
          <div className="text-[3em] break-words">{weatherData.temperature_2m || '-'} {weatherData.temperature_2m_unit || '-'}</div>
        </div>
        <div className="flex flex-col gap-2 justify-center md:justify-start flex-1">
          <div className="flex items-center gap-3 justify-center justify-start">
            <Wind className="w-9 h-9 text-black" />
            <span className="text-[1.5em] break-words">{weatherData.wind_speed_10m || '-'} {weatherData.wind_speed_10m_unit || '-'}</span>
          </div>
          <div className="flex items-center gap-3 justify-center justify-start">
            <Droplets className="w-9 h-9 text-black" />
            <span className="text-[1.5em] break-words">{weatherData.relative_humidity_2m || '-'} {weatherData.relative_humidity_2m_unit || '-'}</span>
          </div>
        </div>
        <div
          className="absolute top-4 left-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center bg-white text-gray-600 rounded-lg z-10 border-2 border-solid border-gray-400"
          onClick={() => dispatch(setTemperature_unit())}
        >
          <div className="">{temperature_unit}</div>
        </div>
        <div
          className="absolute top-4 right-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center bg-white text-gray-600 rounded-lg z-10 border-2 border-solid border-gray-400"
          onClick={() => {setShowPopup(true)}}
        >
          <AlignLeft />
        </div>
        {
          citysName && citysName !== 'City not found' && (
            <div
              className="absolute bottom-4 right-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center bg-white rounded-lg z-10 border-2 border-solid border-gray-400"
              onClick={handleFavorite}
            >
              <Heart className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-500'} />
            </div>
          )
        }
      </MyCard>
      <MyPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        title="My Favorites"
        showConfirmButton={false}
      >
        <div className="text-gray-600">Favorite Cities</div>
        {
          favoriteCitiesList.length === 0 ? (
            <p className="text-gray-500 mt-2">No favorite cities yet</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {
                favoriteCitiesList.map((city) => (
                  <li 
                    key={city.cityName} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectFavorite(city)}
                  >
                    <span className="flex-1 h-[100%]">
                      {city.cityName}
                    </span>
                    <X 
                      className="w-5 h-5 text-gray-500 hover:text-red-500 transition duration-200 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFavorite(city)
                      }}
                    />
                  </li>
                ))
              }
            </ul>
          )
        }
      </MyPopup>
    </div>
  )
}

function Weather_forecast() {
  const dispatch = useDispatch();
  const citysLatitudeLongitude = useSelector((state) => state.weather.citysLatitudeLongitude);
  const [getCityWeatherCurrent] = useLazyGetCityWeatherCurrentQuery();
  const [weatherData, setWeatherData] = useState([])
  const temperature_unit = useSelector((state) => state.weather.temperature_unit);

  const fetchWeather = useCallback(async (latitudeLongitude, temperature_unit) => {
    try {
      const result = await getCityWeatherCurrent({
        ...latitudeLongitude,
        params: `&daily=temperature_2m_max,temperature_2m_min,weather_code${temperature_unit === '°C' ? '' : '&temperature_unit=fahrenheit'}`
      }).unwrap();
      // console.log(result, 'weatherCurrently')

      setWeatherData(() => formatWeatherData_daily(result, 5))
    } catch (err) {
      console.error('Error fetching weather data:', err);
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}))
    } finally {
      dispatch(setIsSearchProcessing_forecast(false))
    }
  }, [getCityWeatherCurrent, dispatch]);
  
  useEffect(() => {
    if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
      dispatch(setIsSearchProcessing_forecast(true));
      fetchWeather(citysLatitudeLongitude, temperature_unit)
    }
    if (citysLatitudeLongitude.latitude === null && citysLatitudeLongitude.longitude === null) {
      setWeatherData(() => ([]))
    }
  }, [citysLatitudeLongitude.latitude, citysLatitudeLongitude.longitude, dispatch, fetchWeather, citysLatitudeLongitude, temperature_unit])

  if (weatherData.length === 0) return (
    <div className="text-center font-semibold mt-[2.5em]">
      <div className="text-[1.7rem]">Welcome!</div>
      <div className="text-[1.3rem]">Please enter the city name<span className="whitespace-nowrap">{' : )~'}</span></div>
    </div>
  )

  return (
    <div className={`${weatherData.length ? 'flex' : 'hidden'} px-4 justify-center items-center pb-6 `}>
      <div
        className="
          relative flex flex-col items-center py-4 md:py-6 px-4 md:px-8 bg-[#F7F6F9] w-full max-w-[800px] rounded-[24px] gap-2 md:gap-3
        "
      >
        {
          weatherData.map((item) => (
            <MyBox key={item.time}>
              <div>{item.time || '-'}</div>
              <div>{item.temperature_2m_min || '-'}{item.temperature_2m_min_unit || '-'} / {item.temperature_2m_max || '-'}{item.temperature_2m_max_unit || '-'}</div>
              <div>
                <WeatherCodeToIconComponent code={item.weatherCode}/>
              </div>
            </MyBox>
          ))
        }
      </div>
    </div>
  )
}

Weather.Search = Search;
Weather.Weather_Current = Weather_Current
Weather.Weather_forecast = Weather_forecast

export default Weather;
