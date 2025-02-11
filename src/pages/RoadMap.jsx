import { RiShareForwardLine } from "react-icons/ri"; 
import React, { useState } from "react";
import RoadmapItems from "../components/Roadmap/RoadmapItems";
import RoadmapTable from "../components/Roadmap/RoadmapTable";
import Navbar from "../components/Navbar";
import { requestOpinionAnalytics, switchpageAnalytics } from "../analytics/Analytics";
import RoadmapSidebar from "../components/Roadmap/RoadmapSidebar";

const RoadMap = ({setIsAlert,isUser,isLogedIn}) => {
  const [activeTab, setActiveTab] = useState("map");
  const [sidebarShow, setSidebarShow] = useState(false)

  const openSidebar = ()=>{
    window.scrollTo(0, 0);
    setSidebarShow(true);
    document.body.style.overflow = "hidden";
  }
  const closeSidebar = ()=>{
    setSidebarShow(false);
    requestOpinionAnalytics("close")
    document.body.style.overflow = "auto";
  }
  return (
    <div>
      <Navbar
        setIsAlert={setIsAlert}
        isUser={isUser}
        isLogedIn={isLogedIn}
      />
      <div className="w-full p-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-t-2xl">
          <div className="flex bg-white w-max rounded-lg">
            <button
              className={`px-4 py-2 text-lg font-medium rounded-lg rounded-r-none transition-colors max-xs:text-base max-xs:px-2 ${
                activeTab === "map"
                  ? "bg-black text-white"
                  : "bg-white text-gray-900 hover:bg-slate-100"
              }`}
              onClick={() => {setActiveTab("map"); switchpageAnalytics("roadmap")}}>

              Xarita
            </button>
            <button
              className={`px-4 py-2 text-lg font-medium rounded-lg rounded-l-none max-xs:px-2 max-xs:text-base ${
                activeTab === "table"
                  ? "bg-black text-white"
                  : "bg-white text-gray-900 hover:bg-slate-100"
              }`}
              onClick={() => {setActiveTab("table"); switchpageAnalytics("table")}}
            >
              Jadval
            </button>
          </div>
          <button onClick={()=>{requestOpinionAnalytics("open"); openSidebar()}} className="flex items-center gap-3 bg-slate-100 rounded-xl p-3 font-medium text-lg transition-colors hover:bg-slate-200 max-xs:text-base max-xs:px-3">G'oya taklif etish <RiShareForwardLine /></button>
         
        </div>

        <div className="">
          {activeTab === "map" ? <RoadmapItems /> : <RoadmapTable />}
        </div>
      </div>
      {sidebarShow ? <div><RoadmapSidebar closeSidebar={closeSidebar} /></div> : null}
    </div>
  );
};

export default RoadMap;
