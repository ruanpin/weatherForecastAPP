const formatDate = (dateString) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    const [_, month, day] = dateString.split('-');
    return `${month}/${day}`;
};

const getFormattedDate_Today = () => {
  const date = new Date();
  // const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

export function formatWeatherData_daily(data, days = 7) {
    if (!data || typeof data !== 'object' || !data.daily || !data.daily_units) {
        console.error('Invalid data format');
        return [];
      }
      
      const { daily, daily_units } = data;
      
      if (!Array.isArray(daily.weather_code) || !Array.isArray(daily.temperature_2m_max) || !Array.isArray(daily.temperature_2m_min) || !Array.isArray(daily.time)){
        console.error('Missing required daily weather data');
        return [];
      }
      
      const result = daily.time.map((time, index) => ({
        weatherCode: daily.weather_code[index] || '',
        temperature_2m_max: daily.temperature_2m_max[index] || '',
        temperature_2m_max_unit: daily_units.temperature_2m_max || '',
        temperature_2m_min: daily.temperature_2m_min[index] || '',
        temperature_2m_min_unit: daily_units.temperature_2m_min || '',
        time: formatDate(time) || ''
      }))

      const today = getFormattedDate_Today()
      const startIndex = result.findIndex(item => {
        return item.time === today
      })
      const endIndex = startIndex + days

      const isValidIndex = (value) => typeof value === 'number' && !isNaN(value) && value >= 0;
      return (isValidIndex(startIndex) && isValidIndex(endIndex)) ? result.slice(startIndex, endIndex) : result
}

// const mockData = {
//     "latitude": 46.6,
//     "longitude": 1.8799996,
//     "generationtime_ms": 0.05173683166503906,
//     "utc_offset_seconds": 0,
//     "timezone": "GMT",
//     "timezone_abbreviation": "GMT",
//     "elevation": 212.0,
//     "daily_units": {
//       "time": "iso8601",
//       "temperature_2m_max": "°C",
//       "temperature_2m_min": "°C",
//       "weather_code": "wmo code"
//     },
//     "daily": {
//       "time": ["2025-03-15", "2025-03-16", "2025-03-17", "2025-03-18", "2025-03-19", "2025-03-20", "2025-03-21"],
//       "temperature_2m_max": [4.0, 6.7, 9.3, 16.1, 16.1, 14.1, 13.7],
//       "temperature_2m_min": [1.0, 1.4, 1.1, 1.3, 3.3, 4.8, 7.9],
//       "weather_code": [71, 61, 3, 3, 3, 80, 95]
//     }
// };