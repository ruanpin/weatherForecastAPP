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
  return (
    <div className="flex flex-col min-h-screen relative">
      {
        isSearchProcessing_current || isSearchProcessing_forecast ? (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 opacity-50 flex justify-center items-center z-99">
          <Loading size={'w-25 h-25'}/>
        </div>) : ''
      }
      <div className="text-center text-[1.6em] md:text-[2em] py-[.8em] font-bold mb-4">Weather Forecast App</div>
      <main className="flex-1">
        <Outlet />
      </main>
      {
        isError && (
          <div classname="fixed bottom-0 px-[16px] flex justify-center w-screen">
            <div className="
              p-4 bg-[#EFC9C4] text-white rounded-lg shadow-lg z-100 
            ">
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
        )
      }
    </div>
  );
}