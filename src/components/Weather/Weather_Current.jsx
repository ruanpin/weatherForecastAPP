import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Wind, Droplets, Heart, AlignLeft, X, Minus } from 'lucide-react';
import MyCard from '@/components/MyCard';
import Loading from '@/components/Loading';
import MyLoading from '@/components/MyLoading'
// import MyPopup from '@/components/MyPopup';
import { useLazyGetCityWeatherQuery } from '@/redux/services/weatherApi';
import { setLatitudeLongitude, setSelectedCity, setIsSearchProcessing_current, setTemperature_unit, setErrorMsg } from '@/redux/slices/weatherSlice';
import { weatherCodeToIcon } from './index';

const MyPopup = lazy(() => import('@/components/MyPopup'))
// 收藏城市清單組件
const FavoritesList = ({ favoriteCitiesList, handleSelectFavorite, handleDeleteFavorite }) => (
  <ul className="mt-2">
    {
      favoriteCitiesList.map((city) => (
        <li 
          key={city.cityName} 
          className="flex items-center justify-between p-2 rounded cursor-pointer spacialLi"
          style={{
            backgroundColor: '#f9fafb',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
          onClick={() => handleSelectFavorite(city)}
        >
          <span className="flex-1 h-[100%]">
            {city.cityName}
          </span>
          <X 
            className="w-5 h-5 text-gray-500 hover:text-red-500 transition duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteFavorite(city);
            }}
          />
        </li>
      ))
    }
  </ul>
);

function Weather_Current() {
  const dispatch = useDispatch();
  const citysName = useSelector((state) => state.weather.selectedCity);
  const citysLatitudeLongitude = useSelector((state) => state.weather.citysLatitudeLongitude);
  const [getCityWeather, { isFetching }] = useLazyGetCityWeatherQuery();
  const [weatherData, setWeatherData] = useState({
    weatherCode: "",
    temperature_2m: "",
    temperature_2m_unit: "",
    wind_speed_10m: "",
    wind_speed_10m_unit: "",
    relative_humidity_2m: "",
    relative_humidity_2m_unit: ""
  });
  const temperature_unit = useSelector((state) => state.weather.temperature_unit);

  // 我的收藏城市功能
  const [showPopup, setShowPopup] = useState(false);
  const [favoriteCitiesList, setFavoriteCitiesList] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const setFavoriteCities = useCallback((newFavorites) => {
    // 設置最新收藏城市清單進localStorage & 當前組件變數
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
    setFavoriteCitiesList(newFavorites);
  }, []);

  useEffect(() => {
    // 收藏城市彈窗中資料初始化和更新收藏城市list
    const favorites = JSON.parse(localStorage.getItem('favoriteCities') || '[]');
    setFavoriteCitiesList(favorites);
    // 當前城市是否已收藏（愛心變紅或空白處理）
    setIsFavorite(favorites.some(city => city.cityName === citysName));
  }, [citysName]);

  const handleFavorite = useCallback(() => {
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
        setFavoriteCities(newFavorites);
        setIsFavorite(true);
      }
    } else {
      // 已經收藏，因此移除
      const newFavorites = favoriteCitiesList.filter(city => city.cityName !== citysName);
      setFavoriteCities(newFavorites);
      setIsFavorite(false);
    }
  }, [citysName, citysLatitudeLongitude, favoriteCitiesList, setFavoriteCities]);

  // 從收藏彈窗中選擇特定城市
  const handleSelectFavorite = useCallback((city) => {
    dispatch(setSelectedCity(city.cityName));
    dispatch(setLatitudeLongitude({
      latitude: city.lat,
      longitude: city.lon
    }));
    setShowPopup(false);
  }, [dispatch]);

  // 從收藏彈窗中移除特定城市
  const handleDeleteFavorite = useCallback((city) => {
    const newFavorites = favoriteCitiesList.filter(item => item.cityName !== city.cityName);
    setFavoriteCities(newFavorites);
    if (city.cityName === citysName) {
      setIsFavorite(false);
    }
  }, [citysName, favoriteCitiesList, setFavoriteCities]);

  // 取得城市當前天氣狀況fetch
  const fetchWeather = useCallback(async (latitudeLongitude, temperature_unit) => {
    try {
      const result = await getCityWeather({
        ...latitudeLongitude,
        params: `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code${temperature_unit === '°C' ? '' : '&temperature_unit=fahrenheit'}`
      }).unwrap();

      setWeatherData(() => ({
        weatherCode: result?.current?.weather_code,
        temperature_2m: result?.current?.temperature_2m,
        temperature_2m_unit: result?.current_units?.temperature_2m,
        wind_speed_10m: result?.current?.wind_speed_10m,
        wind_speed_10m_unit: result?.current_units?.wind_speed_10m,
        relative_humidity_2m: result?.current?.relative_humidity_2m,
        relative_humidity_2m_unit: result?.current_units?.relative_humidity_2m
      }));
    } catch (err) {
      console.error('Error fetching weather data:', err);
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}));
    } finally {
      dispatch(setIsSearchProcessing_current(false));
    }
  }, [getCityWeather, dispatch]);
  
  // 城市座標變動時(from Redux)副作用處理
  useEffect(() => {
    if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
      dispatch(setIsSearchProcessing_current(true));
      fetchWeather(citysLatitudeLongitude, temperature_unit);
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
      }));
    }
  }, [citysLatitudeLongitude.latitude, citysLatitudeLongitude.longitude, dispatch, fetchWeather, citysLatitudeLongitude, temperature_unit]);

  const WeatherIcon = weatherCodeToIcon[weatherData?.weatherCode] || Minus;

  return (
    <div className="flex justify-center items-center px-4 my-10">
      <MyCard>
        <div className="flex-1 flex justify-center items-center mb-6 md:mb-0">
          <MyLoading isFetching={isFetching}>
            <WeatherIcon className="w-32 h-32 text-gray-500"/>
          </MyLoading>
        </div>
        <div className="flex flex-col text-center md:text-left flex-1 max-w-[300px] md:max-x-[350px]">
          <div className="text-[1.8em] break-words">{ citysName || '-'}</div>
          <MyLoading isFetching={isFetching}>
            <div className="text-[3em] break-words">{weatherData.temperature_2m || '-'} {weatherData.temperature_2m_unit || '-'}</div>
          </MyLoading>
        </div>
        <div className="flex flex-col gap-2 justify-center md:justify-start flex-1">
          <MyLoading isFetching={isFetching}>
            <div className="flex items-center gap-3 justify-center justify-start">
              <Wind className="w-9 h-9 text-black" />
              <span className="text-[1.5em] break-words">{weatherData.wind_speed_10m || '-'} {weatherData.wind_speed_10m_unit || '-'}</span>
            </div>
          </MyLoading>
          <MyLoading isFetching={isFetching}>
            <div className="flex items-center gap-3 justify-center justify-start">
              <Droplets className="w-9 h-9 text-black" />
              <span className="text-[1.5em] break-words">{weatherData.relative_humidity_2m || '-'} {weatherData.relative_humidity_2m_unit || '-'}</span>
            </div>
          </MyLoading>
        </div>
        {/* 攝氏華氏轉換開關 */}
        <div
          className="absolute top-4 left-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center bg-white text-gray-600 rounded-lg z-10 border-2 border-solid border-gray-400"
          onClick={() => dispatch(setTemperature_unit())}
        >
          <div className="">{temperature_unit}</div>
        </div>
        {/* 收藏彈窗開關 */}
        <div
          className="absolute top-4 right-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center bg-white text-gray-600 rounded-lg z-10 border-2 border-solid border-gray-400"
          onClick={() => {setShowPopup(true)}}
        >
          <AlignLeft />
        </div>
        {/* 收藏愛心 */}
          {
            citysName && citysName !== 'City not found' && (
              <div
                className="absolute bottom-4 right-4 cursor-pointer font-bold w-[2em] h-[2em] flex items-center justify-center rounded-lg z-10"
                onClick={handleFavorite}
              >
                <Heart className={isFavorite ? 'fullHeart' : 'emptyHeart'} />
              </div>
            )
          }
      </MyCard>
      {/* 收藏城市彈窗 */}
      <Suspense fallback={<div className="absolute flex justify-center items-center pb-6"><Loading /></div>}>
        {
          showPopup && (
            <MyPopup
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              title="My Favorites"
              showConfirmButton={false}
            >
              <div className="text-gray-600">Favorite Cities</div>
              <div className="max-h-[300px] overflow-y-auto">
                {
                  favoriteCitiesList.length === 0 ? (
                    <p className="text-gray-500 mt-2">No favorite cities yet</p>
                  ) : (
                    <FavoritesList 
                      favoriteCitiesList={favoriteCitiesList}
                      handleSelectFavorite={handleSelectFavorite}
                      handleDeleteFavorite={handleDeleteFavorite}
                    />
                  )
                }
              </div>
            </MyPopup>
          )
        }
      </Suspense>
    </div>
  );
}

export default Weather_Current; 