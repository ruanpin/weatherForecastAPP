// import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Loading from '@/components/Loading'
import { setErrorMsg } from '@/redux/slices/weatherSlice';
import { X } from 'lucide-react';

export default function FrontLayout() {
  const dispatch = useDispatch();
  const isSearchProcessing_current = useSelector((state) => state.weather.isSearchProcessing_current);
  const isSearchProcessing_forecast = useSelector((state) => state.weather.isSearchProcessing_forecast);
  const isError = useSelector((state) => state.weather.isError);
  const errorMsg = useSelector((state) => state.weather.errorMsg);

  const isLoading = isSearchProcessing_current || isSearchProcessing_forecast;

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="text-center text-[1.6em] md:text-[2em] py-[.8em] font-bold mb-4">Weather Forecast App</div>
      <main className="flex-1">
        <Outlet />
      </main>
      
      {isLoading && (
        <div className="spacialMask">
          <div className="spacialMask-inner">
            <Loading size={'w-25 h-25'} />
          </div>
        </div>
      )}
      
      {isError && (
        <div className="fixed bottom-0 px-[16px] flex justify-center w-screen" style={{ zIndex: 9999 }}>
          <div className="p-4 bg-[#EFC9C4] text-white rounded-lg shadow-lg">
            <div className="text-xl font-bold text-[#344D86] flex justify-between">
              <div>Error</div>
              <X
                onClick={() => dispatch(setErrorMsg({isError: false, errorMsg: ''}))} 
                className="cursor-pointer h-8 w-8"
              />
            </div>
            <div className="text-[#344D86] break-words">{errorMsg}</div>
          </div>
        </div>
      )}
    </div>
  );
}