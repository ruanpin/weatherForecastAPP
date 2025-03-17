import { describe, it, expect } from '@jest/globals';
import { formatWeatherData_daily, formatDate, getFormattedDate_Today, noDataArray } from '../formatWeatherData';

/* global global */

describe('formatDate', () => {
  it('should format date string correctly', () => {
    expect(formatDate('2024-03-17')).toBe('03/17');
    expect(formatDate('2024-12-31')).toBe('12/31');
  });

  it('should return original string for invalid format', () => {
    expect(formatDate('invalid')).toBe('invalid');
    expect(formatDate('2024/03/17')).toBe('2024/03/17');
  });
});

describe('getFormattedDate_Today', () => {
  it('should return today date in MM/DD format', () => {
    // 模擬固定系統日期
    jest.setSystemTime(new Date('2024-03-17'));

    expect(getFormattedDate_Today()).toBe('03/17');

    // 測試完還原時間設置避免污染
    jest.useRealTimers();
  });
});

describe('formatWeatherData_daily', () => {
  const mockData = {
    daily_units: {
      temperature_2m_max: '°C',
      temperature_2m_min: '°C',
      weather_code: 'wmo code'
    },
    daily: {
      time: ['2024-03-17', '2024-03-18', '2024-03-19', '2024-03-20', '2024-03-21'],
      temperature_2m_max: [9.3, 16.1, 16.1, 14.1, 13.7],
      temperature_2m_min: [1.1, 1.3, 3.3, 4.8, 7.9],
      weather_code: [3, 3, 3, 80, 95]
    }
  };

  it('should format weather data correctly', () => {
    const result = formatWeatherData_daily(mockData);
    expect(result).toEqual([
      {
        weatherCode: 3,
        temperature_2m_max: 16.1,
        temperature_2m_max_unit: '°C',
        temperature_2m_min: 1.3,
        temperature_2m_min_unit: '°C',
        time: '03/18'
      },
      {
        weatherCode: 3,
        temperature_2m_max: 16.1,
        temperature_2m_max_unit: '°C',
        temperature_2m_min: 3.3,
        temperature_2m_min_unit: '°C',
        time: '03/19'
      },
      {
        weatherCode: 80,
        temperature_2m_max: 14.1,
        temperature_2m_max_unit: '°C',
        temperature_2m_min: 4.8,
        temperature_2m_min_unit: '°C',
        time: '03/20'
      },
      {
        weatherCode: 95,
        temperature_2m_max: 13.7,
        temperature_2m_max_unit: '°C',
        temperature_2m_min: 7.9,
        temperature_2m_min_unit: '°C',
        time: '03/21'
      }
    ]);
  });

  it('should handle invalid data', () => {
    expect(formatWeatherData_daily(null)).toEqual(noDataArray);
    expect(formatWeatherData_daily(undefined)).toEqual(noDataArray);
    expect(formatWeatherData_daily({})).toEqual(noDataArray);
    expect(formatWeatherData_daily({ daily: {}, daily_units: {} })).toEqual(noDataArray);
  });

  it('should handle missing data in arrays', () => {
    const invalidData = {
      daily_units: {
        temperature_2m_max: '°C',
        temperature_2m_min: '°C'
      },
      daily: {
        time: ['2024-03-17'],
        temperature_2m_max: [],
        temperature_2m_min: [],
        weather_code: []
      }
    };

    const result = formatWeatherData_daily(invalidData);
    expect(result).toEqual(noDataArray);
  });

  it('should handle custom number of days', () => {
    const result = formatWeatherData_daily(mockData, 2);
    expect(result).toHaveLength(2);
  });

  it('should return noDataArray when required arrays are missing', () => {
    const incompleteData = {
      daily_units: {
        temperature_2m_max: '°C',
        temperature_2m_min: '°C'
      },
      daily: {
        time: ['2024-03-17', '2024-03-18'],
        temperature_2m_max: [15, 16],
        temperature_2m_min: [5, 6]
        // weather_code array is missing
      }
    };
    expect(formatWeatherData_daily(incompleteData)).toEqual(noDataArray);
  });
}); 