// import { useState } from 'react'
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading'

export default function FrontLayout() {
  const isSearchProcessing_current = useSelector((state) => state.weather.isSearchProcessing_current);
  const isSearchProcessing_forecast = useSelector((state) => state.weather.isSearchProcessing_forecast);
  return (
    <div className="flex flex-col min-h-screen">
      {
        isSearchProcessing_current || isSearchProcessing_forecast ? (
        <div className="absolute inset-0 bg-gray-800 opacity-50 flex justify-center items-center z-99">
          <Loading size={'w-25 h-25'}/>
        </div>) : ''
      }
        <div className="text-center text-[1.6em] md:text-[2em] py-[.8em] font-bold">Weather Forecast App</div>
        <main className="flex-1">
          <Outlet />
        </main>
    </div>
  );
}