import { describe, it, expect } from '@jest/globals';
import reducer, {
  setSelectedCity,
  setLatitudeLongitude,
  setIsSearchProcessing_current,
  setIsSearchProcessing_forecast,
  setErrorMsg,
  setTemperature_unit
} from '../weatherSlice';

// toBe：原始數據類型的值 / 物件的引用
// toEqual 深度比較（物件或Array的內容是否相等）

describe('weather reducer', () => {
  const initialState = {
    selectedCity: '',
    citysLatitudeLongitude: {
      latitude: 0,
      longitude: 0
    },
    isSearchProcessing_current: false,
    isSearchProcessing_forecast: false,
    isError: false,
    errorMsg: '',
    temperature_unit: '°C',
  };

  it('should handle initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('setSelectedCity', () => {
    it('should handle setting selected city', () => {
      const actual = reducer(initialState, setSelectedCity('London'));
      expect(actual.selectedCity).toEqual('London');
    });

    it('should handle empty city name', () => {
      const actual = reducer(initialState, setSelectedCity(''));
      expect(actual.selectedCity).toEqual('');
    });
  });

  describe('setLatitudeLongitude', () => {
    it('should handle setting latitude and longitude', () => {
      const coordinates = {
        latitude: 51.5074,
        longitude: -0.1278
      };
      const actual = reducer(initialState, setLatitudeLongitude(coordinates));
      expect(actual.citysLatitudeLongitude).toEqual(coordinates);
    });

    it('should handle zero coordinates', () => {
      const coordinates = {
        latitude: 0,
        longitude: 0
      };
      const actual = reducer(initialState, setLatitudeLongitude(coordinates));
      expect(actual.citysLatitudeLongitude).toEqual(coordinates);
    });
  });

  describe('setIsSearchProcessing_current', () => {
    it('should handle setting search processing state for current weather', () => {
      const actual = reducer(initialState, setIsSearchProcessing_current(true));
      expect(actual.isSearchProcessing_current).toBe(true);

      const actual2 = reducer(actual, setIsSearchProcessing_current(false));
      expect(actual2.isSearchProcessing_current).toBe(false);
    });
  });

  describe('setIsSearchProcessing_forecast', () => {
    it('should handle setting search processing state for forecast', () => {
      const actual = reducer(initialState, setIsSearchProcessing_forecast(true));
      expect(actual.isSearchProcessing_forecast).toBe(true);

      const actual2 = reducer(actual, setIsSearchProcessing_forecast(false));
      expect(actual2.isSearchProcessing_forecast).toBe(false);
    });
  });

  describe('setErrorMsg', () => {
    it('should handle setting error message and state', () => {
      const errorPayload = {
        isError: true,
        errorMsg: 'City not found'
      };
      const actual = reducer(initialState, setErrorMsg(errorPayload));
      expect(actual.isError).toBe(true);
      expect(actual.errorMsg).toBe('City not found');
    });

    it('should handle clearing error message and state', () => {
      const state = {
        ...initialState,
        isError: true,
        errorMsg: 'Previous error'
      };
      const errorPayload = {
        isError: false,
        errorMsg: ''
      };
      const actual = reducer(state, setErrorMsg(errorPayload));
      expect(actual.isError).toBe(false);
      expect(actual.errorMsg).toBe('');
    });
  });

  describe('setTemperature_unit', () => {
    it('should toggle temperature unit between Celsius and Fahrenheit', () => {
      // °C -> °F
      const actual = reducer(initialState, setTemperature_unit());
      expect(actual.temperature_unit).toBe('°F');

      // °F -> °C
      const actual2 = reducer(actual, setTemperature_unit());
      expect(actual2.temperature_unit).toBe('°C');
    });

    it('should handle multiple toggles', () => {
      let state = initialState;
      
      // °C -> °F
      state = reducer(state, setTemperature_unit());
      expect(state.temperature_unit).toBe('°F');
      
      // °F -> °C
      state = reducer(state, setTemperature_unit());
      expect(state.temperature_unit).toBe('°C');
      
      // °C -> °F
      state = reducer(state, setTemperature_unit());
      expect(state.temperature_unit).toBe('°F');
    });
  });

  // 檢查特定的action creator是否返回正確的action格式，與Redux reducer溝通
  describe('action creators', () => {
    it('should create an action to set selected city', () => {
      const expectedAction = {
        type: 'weather/setSelectedCity',
        payload: 'London'
      };
      expect(setSelectedCity('London')).toEqual(expectedAction);
    });

    it('should create an action to set latitude and longitude', () => {
      const coordinates = {
        latitude: 51.5074,
        longitude: -0.1278
      };
      const expectedAction = {
        type: 'weather/setLatitudeLongitude',
        payload: coordinates
      };
      expect(setLatitudeLongitude(coordinates)).toEqual(expectedAction);
    });

    it('should create an action to set search processing state for current weather', () => {
      const expectedAction = {
        type: 'weather/setIsSearchProcessing_current',
        payload: true
      };
      expect(setIsSearchProcessing_current(true)).toEqual(expectedAction);
    });

    it('should create an action to set search processing state for forecast', () => {
      const expectedAction = {
        type: 'weather/setIsSearchProcessing_forecast',
        payload: true
      };
      expect(setIsSearchProcessing_forecast(true)).toEqual(expectedAction);
    });

    it('should create an action to set error message', () => {
      const errorPayload = {
        isError: true,
        errorMsg: 'City not found'
      };
      const expectedAction = {
        type: 'weather/setErrorMsg',
        payload: errorPayload
      };
      expect(setErrorMsg(errorPayload)).toEqual(expectedAction);
    });

    it('should create an action to toggle temperature unit', () => {
      const expectedAction = {
        type: 'weather/setTemperature_unit'
      };
      expect(setTemperature_unit()).toEqual(expectedAction);
    });
  });
}); 