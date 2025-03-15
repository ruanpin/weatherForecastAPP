// import { useState } from 'react'
import { Outlet } from 'react-router-dom';

export default function FrontLayout() {
    return (
      <div className="flex flex-col min-h-screen">
          <div className="text-center text-[1.6em] md:text-[2em] py-[.8em] font-bold">Weather Forecast App</div>
          <main className="flex-1">
            <Outlet />
          </main>
          {/* <footer>Footer</footer> */}
      </div>
    );
  }