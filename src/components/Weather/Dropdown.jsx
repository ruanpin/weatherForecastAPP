import { useDispatch, useSelector } from 'react-redux';
import Loading from '@/components/Loading';
import { useLazyGetLatitudeLongitudeQuery } from '@/redux/services/latitudeAndLongitudeApi';
import { setLatitudeLongitude, setSelectedCity, setIsSearchProcessing_current, setIsSearchProcessing_forecast, setErrorMsg } from '@/redux/slices/weatherSlice';

function Dropdown({ isFetching, isError, dropdownList, setCityName, setIsDropdownOpen }) {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state) => state.weather.selectedCity);
  const [getLatitudeLongitude] = useLazyGetLatitudeLongitudeQuery();

  // 查詢經緯度後儲存至Redux
  const fetchLatLong = async (city) => {
    if (selectedCity === city) return;

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
      dispatch(setErrorMsg({isError: true, errorMsg: err.error}));
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
                className="p-2 hover-bg-gray-200 cursor-pointer"
                onClick={() => handleDropdownSelect(`${city.name}, ${city.country}`)}
              >
                {city.name}, {city.country}
              </li>
            ))
          )
        }
      </ul>
    </div>
  );
}

export default Dropdown; 