import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FrontLayout from '@/layouts/FrontLayout';
import Weather from '@/components/Weather'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
