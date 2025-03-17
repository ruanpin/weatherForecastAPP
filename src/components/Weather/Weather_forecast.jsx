import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MyBox from '@/components/MyBox';
import { useLazyGetCityWeatherQuery } from '@/redux/services/weatherApi';
import { setIsSearchProcessing_forecast, setErrorMsg } from '@/redux/slices/weatherSlice';
import { formatWeatherData_daily } from '@/utils/formatWeatherData';
import { WeatherCodeToIconComponent } from './index';

const ForecastItem = ({ item, index }) => (
  <MyBox key={item.time + String(index)}>
    <div>{item.time || '-'}</div>
    {
      (item.temperature_2m_min === 'no data' || item.temperature_2m_max === 'no data') ? (
        <div>no data</div>
      ) : (
        <div>{item.temperature_2m_min || '-'}{item.temperature_2m_min_unit || '-'} / {item.temperature_2m_max || '-'}{item.temperature_2m_max_unit || '-'}</div>
      )
    }
    <div>
      <WeatherCodeToIconComponent code={item.weatherCode} />
    </div>
  </MyBox>
);

const WelcomeMessage = () => (
  <div className="text-center font-semibold my-[2.5em]">
    <div className="text-[1.7rem]">Welcome!</div>
    <div className="text-[1.3rem]">Please enter the city name<span className="whitespace-nowrap">{' : )~'}</span></div>
  </div>
);

function Weather_forecast() {
  const dispatch = useDispatch();
  const citysLatitudeLongitude = useSelector((state) => state.weather.citysLatitudeLongitude);
  const [getCityWeather] = useLazyGetCityWeatherQuery();
  const [weatherData, setWeatherData] = useState([]);
  const temperature_unit = useSelector((state) => state.weather.temperature_unit);

  // 取得未來天氣狀況feftch
  const fetchWeather = useCallback(async (latitudeLongitude, temperature_unit) => {
    try {
      const result = await getCityWeather({
        ...latitudeLongitude,
        params: `&daily=temperature_2m_max,temperature_2m_min,weather_code${temperature_unit === '°C' ? '' : '&temperature_unit=fahrenheit'}`
      }).unwrap();

      setWeatherData(() => formatWeatherData_daily(result, 5));
    } catch (err) {
      console.error('Error fetching weather data:', err);
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}));
    } finally {
      dispatch(setIsSearchProcessing_forecast(false));
    }
  }, [getCityWeather, dispatch]);
  
  // 當城市座標變更時的副作用處理
  useEffect(() => {
    if (citysLatitudeLongitude.latitude && citysLatitudeLongitude.longitude) {
      dispatch(setIsSearchProcessing_forecast(true));
      fetchWeather(citysLatitudeLongitude, temperature_unit);
    }
    if (citysLatitudeLongitude.latitude === null && citysLatitudeLongitude.longitude === null) {
      setWeatherData(() => ([]));
    }
  }, [citysLatitudeLongitude.latitude, citysLatitudeLongitude.longitude, dispatch, fetchWeather, citysLatitudeLongitude, temperature_unit]);

  if (weatherData.length === 0) {
    return <WelcomeMessage />;
  }

  return (
    <div className="flex px-4 justify-center items-center pb-6">
      <div className="relative flex flex-col items-center py-4 md:py-6 px-4 md:px-8 bg-[#F7F6F9] w-full max-w-[800px] rounded-[24px] gap-2 md:gap-3">
        {
          weatherData.map((item, index) => (
            <ForecastItem key={item.time + index} item={item} index={index} />
          ))
        }
      </div>
    </div>
  );
}

export default Weather_forecast; 