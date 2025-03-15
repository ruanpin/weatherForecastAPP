import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import Loading from '@/components/Loading'
import FrontLayout from '@/layouts/FrontLayout';
import Weather from '@/components/Weather'

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<FrontLayout />}>
            <Route
              index
              element={
                <Weather>
                  <Weather.Search />
                  <Weather.Weather_Current />
                  <Weather.Weather_forecast />
                </Weather>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
