import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoadmapTable } from "../../redux/reducers/roadmapTable";
import Loader from "../Loader";
const columns = [
  { status: "in_review", title: "Ko'rib chiqilmoqda", color: "red", icon: "👀" },
  { status: "planned", title: "Rejalashtirilgan", color: "green", icon: "✅" },
  { status: "in_progress", title: "Jarayonda", color: "blue", icon: "🕑" },
  { status: "done", title: "Ishlab chiqarilgan", color: "orange", icon: "💯" },
];


export default function RoadmapTable() {

  const dispatch = useDispatch();
  const { data: roadmapTable,loading } = useSelector(
    (state) => state.roadmapTable
  );

  useEffect(() => {
    if (roadmapTable.length === 0) {
      dispatch(fetchRoadmapTable()); // Ma’lumot faqat bir marta yuklanadi
    }    
  }, [dispatch, roadmapTable]);



  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold relative inline-block">Jadval</h1>
        <div className="w-24 h-1 bg-black m-auto mb-6 mt-3 rounded-md"></div>
      </div>
      
      <p className="text-center text-gray-600 mb-6">
        Ahsan Labs jadvali – bu innovatsion g'oyalar, samarali vositalar va <br />
        foydalanuvchilarga qulay xizmatlarni yaratishga qaratilgan muhim bosqichlarni <br /> aks ettiradi.
      </p>
      {!loading ? <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-1 py-3">
        {columns.map((column) => (
          <div key={column.title} className="bg-white p-4 rounded-lg shadow-md ">
            <h2 className="text-lg font-semibold text-center pb-1" style={{borderBottom: `2px solid ${column.color}`}}>
              {column.icon} <span>{column.title}</span>
            </h2>
            <h2 className={`text-lg font-semibold flex items-center space-x-2 relative pb-2 after:content-[''] after:block after:w-full after:h-[2px] after:bg-${column.color}-500 after:mt-2`}></h2>
            <div className="mt-4 space-y-4 md:overflow-hidden md:max-h-max  overflow-y-auto max-h-[400px]">
              {roadmapTable
                .filter((task) => task.status.toLowerCase() === column.status.toLowerCase())
                .map((task, id) => (
                  <div key={id} className="border transition duration-300 ease-in-out p-3 rounded-lg shadow-sm hover:shadow-2xl">
                    <div className="flex justify-between capitalize">
                      <h3 className="font-medium">{task.title}</h3>
                      <h5>#{id + 1}</h5>
                    </div>
                    <p className="text-sm text-gray-500">{task.description}</p>
                    {/* <div className={task.select ? 'hidden' : 'flex justify-end'}>
                      <button className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded-md text-end">Tanlab olinmadi</button>
                    </div> */}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>: <Loader/>}
    </div>
  );
}
