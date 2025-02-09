import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { FaRocket, FaCheckCircle,FaLink } from 'react-icons/fa';
export default function RoadmapItems() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-center text-3xl font-bold mb-6">Yo‘l xaritasi</h1>
      <p className="text-center text-gray-600 mb-6">
        Ahsan Labs jadvali – bu innovatsion g'oyalar, samarali vositalar va <br />
        foydalanuvchilarga qulay xizmatlarni yaratishga qaratilgan muhim bosqichlarni <br /> aks ettiradi.
      </p>
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2025-01-12"
          icon={<FaRocket />}
          iconStyle={{ background: 'orange', color: '#fff' }}
        >
          <div className="bg-gray-900 text-white p-6 rounded-[20px] shadow-lg max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center">
                🎯 Ajoyib lag‘mon 1.1.1
              </h3>
              <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
              🕝Jarayonda 
              </span>
            </div>

            {/* Tarkib */}
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Innovatsion g‘oyalar</li>
              <li>Foydalanuvchilar ehtiyojiga mos yechimlar</li>
              <li>O‘zbek auditoriyasi uchun qulay xizmatlar</li>
            </ul>

            {/* Tugma */}
            <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              Batafsil ma'lumot olish <FaLink />
            </button>
          </div>

        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2025-01-12"
          icon={<FaRocket />}
          iconStyle={{ background: 'orange', color: '#fff' }}
        >
          <div className="bg-gray-900 text-white p-6 rounded-[20px] shadow-lg max-w-md">
            {/* Sarlavha va badge */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center">
                🎯 Ajoyib lag‘mon 1.1.1
              </h3>
              <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
              🕝Jarayonda 
              </span>
            </div>

            {/* Tarkib */}
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Innovatsion g‘oyalar</li>
              <li>Foydalanuvchilar ehtiyojiga mos yechimlar</li>
              <li>O‘zbek auditoriyasi uchun qulay xizmatlar</li>
            </ul>

            {/* Tugma */}
            <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              Batafsil ma'lumot olish <FaLink />
            </button>
          </div>

        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2025-01-12"
          icon={<FaRocket />}
          iconStyle={{ background: 'orange', color: '#fff' }}
        >
          <div className="bg-gray-900 text-white p-6 rounded-[20px] shadow-lg max-w-md">
            {/* Sarlavha va badge */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center">
                🎯 Ajoyib lag‘mon 1.1.1
              </h3>
              <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
              🕝Jarayonda 
              </span>
            </div>

            {/* Tarkib */}
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Innovatsion g‘oyalar</li>
              <li>Foydalanuvchilar ehtiyojiga mos yechimlar</li>
              <li>O‘zbek auditoriyasi uchun qulay xizmatlar</li>
            </ul>

            {/* Tugma */}
            <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              Batafsil ma'lumot olish <FaLink />
            </button>
          </div>

        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          date="2025-01-12"
          icon={<FaRocket />}
          iconStyle={{ background: 'orange', color: '#fff' }}
        >
          <div className="bg-gray-900 text-white p-6 rounded-[20px] shadow-lg max-w-md">
            {/* Sarlavha va badge */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold flex items-center">
                🎯 Ajoyib lag‘mon 1.1.1
              </h3>
              <span className="bg-yellow-500 text-black text-sm font-semibold px-3 py-1 rounded-full">
              🕝Jarayonda 
              </span>
            </div>

            {/* Tarkib */}
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Innovatsion g‘oyalar</li>
              <li>Foydalanuvchilar ehtiyojiga mos yechimlar</li>
              <li>O‘zbek auditoriyasi uchun qulay xizmatlar</li>
            </ul>

            {/* Tugma */}
            <button className="mt-4 w-full bg-white text-black font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition">
              Batafsil ma'lumot olish <FaLink />
            </button>
          </div>

        </VerticalTimelineElement>

       
      </VerticalTimeline>
    </div>
  );
}
