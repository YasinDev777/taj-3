import React, { useState } from 'react'
import RoadmapItems from '../components/Roadmap/RoadmapItems'
import RoadmapTable from '../components/Roadmap/RoadmapTable'
import Navbar from '../components/Navbar'

const RoadMap = () => {
  const [activeTab, setActiveTab] = useState("map");
  const [isAlert, setIsAlert] = useState(false);
  const [isUser, setIsUser] = useState('');
  const [isLogedIn, setIsLogedIn] = useState(false);

  return (
    <div>
      <Navbar setIsAlert={setIsAlert} isAlert={isAlert} isUser={isUser} isLogedIn={isLogedIn} />
      <div className="w-full p-4">
        <div className="flex ">
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
        <div className="mt-3">
          {activeTab === "map" ? (<RoadmapItems />) : (<RoadmapTable />)}
        </div>
      </div>

    </div>
  )
}

export default RoadMap