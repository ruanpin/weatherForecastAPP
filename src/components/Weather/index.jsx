import MyInput from '@/components/MyInput';
import MyCard from '@/components/MyCard'
import MyBox from '@/components/MyBox'
import { Sun, Cloudy, CloudSun, Cloud, CloudDrizzle, CloudRainWind, Wind, Droplets } from 'lucide-react';
import { useState } from 'react'

function Weather({ children }) {
  return children;
}

function Search() {
  return (
    <div className="px-4 flex justify-center items-center">
      <MyInput
        className="
          w-full p-3 bg-white border border-2 border-gray-400 rounded placeholder:text-gray-700
          focus:outline-none focus:border-black transition-colors duration-200 max-w-[800px]
          rounded-[24px]
        "
        placeholder="Search for places..."
        type="text"
      />
    </div>
  )
}

// function CloudSun({ className }) {
//   return (
//     <div className={`relative ${className}`}>
//         {/* <Sun className={`text-yellow-500 absolute -top-1 left-2 ${className}`}/>
//         <Cloud className={`text-gray-500 absolute top-2 ${className}`} fill="white"/> */}
//         <Sun className={`text-yellow-500 absolute ${className} transform translate-x-2 translate-y-[-0.25rem]`} />
//         <Cloud className={`text-gray-500 absolute ${className} transform translate-x-2 translate-y-[0.5rem]`} fill="white" />
//     </div>
//   )
// }

// function CloudSun({ className }) {
//   return (
//     <div className={`relative ${className}`}>
//         {/* Sun元素放置在父容器的中心 */}
//         <Sun className={`text-yellow-500 absolute ${className} transform translate-x-2 translate-y-[-0.25rem]`} />
        
//         {/* Cloud元素微調，使其右上角遮住Sun的左下角 */}
//         <Cloud 
//           className={`text-gray-500 absolute ${className} transform translate-x-[30%] translate-y-[-30%]`} 
//           fill="white"
//         />
//     </div>
//   );
// }

function Weather_Current() {
  const [isShow] = useState(false)
  return (
    <div className="flex justify-center items-center px-4 my-4">
      <MyCard>
        <div className="flex-1 flex justify-center items-center mb-6 md:mb-0">
          <Sun className="w-32 h-32 text-yellow-500"/>
        </div>
        <div className="flex flex-col text-center md:text-left flex-1 ">
          <div className="text-[1.8em]">台北市, 台灣</div>
          <div className="text-[3em]">28°C</div>
        </div>
        <div className="flex flex-col gap-2 justify-center md:justify-start flex-1">
          <div className="flex items-center gap-3 justify-center justify-start">
            <Wind className="w-9 h-9 text-black" />
            <span className="text-[1.5em]">40 mph</span>
          </div>
          <div className="flex items-center gap-3 justify-center justify-start">
            <Droplets className="w-9 h-9 text-black" />
            <span className="text-[1.5em]">60 %</span>
          </div>
        </div>
        
        {
          isShow && (
            <div>
              <CloudSun className="w-12 h-12"/>
              <Cloudy className="w-12 h-12 text-gray-500"/>
              <CloudDrizzle className="w-12 h-12 text-gray-500"/>
              <CloudRainWind className="w-12 h-12 text-gray-500"/>
            </div>
          )
        }
      </MyCard>
    </div>
  )
}

function Weather_forecast() {
  return (
    <div className="px-4 flex justify-center items-center mb-6">
      <div
        className="
          relative flex flex-col items-center py-4 md:py-6 px-4 md:px-8 bg-[#F7F6F9] w-full max-w-[800px] rounded-[24px] gap-2 md:gap-3
        "
      >
        <MyBox>
          <div>3/15</div>
          <div>28°C</div>
          <div>
            <Sun className="w-8 h-8 text-yellow-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/16</div>
          <div>23°C</div>
          <div>
            <CloudSun className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/17</div>
          <div>18°C</div>
          <div>
            <Cloudy className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/18</div>
          <div>16°C</div>
          <div>
            <CloudDrizzle className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
        <MyBox>
          <div>3/19</div>
          <div>15°C</div>
          <div>
            <CloudRainWind className="w-8 h-8 text-gray-500"/>
          </div>
        </MyBox>
      </div>
    </div>
  )
}

Weather.Search = Search;
Weather.Weather_Current = Weather_Current
Weather.Weather_forecast = Weather_forecast

export default Weather; 