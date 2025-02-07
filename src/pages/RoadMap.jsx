import React, { useState } from 'react'
import RoadmapItems from '../components/Roadmap/RoadmapItems'
import RoadmapTable from '../components/Roadmap/RoadmapTable'
import Navbar from '../components/Navbar'
import { TiArrowForwardOutline } from "react-icons/ti";
import { useSelector } from 'react-redux'

const RoadMap = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [isAlert, setIsAlert] = useState(false);
  const [isUser, setIsUser] = useState('');
  const [isLogedIn, setIsLogedIn] = useState(false);

  const stateBar = useSelector((state) => state.stateSiteBar.currentState)

  return (
    <div>
      <Navbar setIsAlert={setIsAlert} isAlert={isAlert} isUser={isUser} isLogedIn={isLogedIn} />
      <div className='w-full p-4' style={stateBar === true ? {overflow: 'hidden', height: '85dvh'} : {overflow: 'auto', height: 'auto'}}>
        <div className="flex w-full justify-between items-center">
          <div className="flex bg-white rounded-lg">
            <button
              className={`px-4 py-2 text-lg font-medium rounded-lg ${activeTab === "map" ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              onClick={() => setActiveTab("map")}
            >
              Xarita
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium rounded-lg ${activeTab === "table" ? "bg-black text-white" : "bg-white text-gray-700"
                }`}
              onClick={() => setActiveTab("table")}
            >
              Jadval
            </button>
          </div>
          <button className='hidden max-sm:flex items-center justify-center gap-2 font-bold p-2 pl-3 pr-3 text-[14px] bg-[#F5F8FA] rounded-xl shadow-md'>
            G’oya taklif qilish 
            <TiArrowForwardOutline className='text-xl max-sm:text-[15px]' />
          </button>
        </div>
        <div className="mt-3">
          {activeTab === "map" ? (<RoadmapItems />) : (<RoadmapTable />)}
        </div>
      </div>
    </div>
  )
}

export default RoadMap