import { useEffect, useState } from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaTimes } from "react-icons/fa";
import { fetchRoadmapItems } from "../../redux/reducers/roadmap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import { roadmapVideosAnalytics } from "../../analytics/Analytics";

const borderColors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#E0A00A"];

export default function RoadmapItems() {
  const [roadmapItemsData, setRoadmapItemsData] = useState([]);

  const dispatch = useDispatch();
  const { data: roadmapData, loading } = useSelector((state) => state.roadmap);
  useEffect(() => {
    if (roadmapData.length === 0) {
      dispatch(fetchRoadmapItems());
    }
    const sortedRoadmap = [...roadmapData].sort(
      (a, b) => new Date(a.due_date) - new Date(b.due_date)
    );
    setRoadmapItemsData(sortedRoadmap);
  }, [dispatch, roadmapData]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const openModal = (videoUrl, video_id) => {
    setSelectedVideo(videoUrl);
    setModalOpen(true);
    roadmapVideosAnalytics("open", video_id);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (selectedVideo) {
      const videoId = roadmapItemsData.find(
        (item) => item.url === selectedVideo
      )?.roadmap_id;
      roadmapVideosAnalytics("close", videoId);
    }
    setSelectedVideo(null);
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="p-8 bg-white min-h-screen max-md:px-2 relative max-xs:px-0">
      <h1 className="text-center text-3xl font-bold">Yo‘l xaritasi</h1>
      <div className="w-24 h-1 bg-black m-auto mb-6 mt-3 rounded-md"></div>
      <p className="text-center text-gray-600 mb-6 w-1/2 m-auto max-md:w-10/12 max-xs:w-full max-xs:text-sm">
        Ahsan Labs uchun yo‘l xaritasi – bu innovatsion g‘oyalar, samarali
        vositalar va foydalanuvchilarga qulay xizmatlarni yaratishga qaratilgan
        muhim bosqichlarni aks ettiradi.
      </p>
      {!loading ? (
        <VerticalTimeline>
          {roadmapItemsData.map((item, index) => {
            const color =
              item.status === "delayed"
                ? "#E04A0A"
                : item.status === "progress"
                ? "#E0A00A"
                : "#0CBB15";
            const text =
              item.status === "delayed"
                ? "😔 Kechikdi"
                : item.status === "progress"
                ? "🕝 Jarayonda"
                : "🎉 Yakunlandi";
            return (
              <VerticalTimelineElement
                key={index}
                iconStyle={{
                  background: "#fff",
                  border: `1px solid ${
                    borderColors[index % borderColors.length]
                  }`,
                  borderWidth: "1px 1px 3px 1px",
                }}
                icon={<span>{item.due_date}</span>}
              >
                <div className="bg-gray-800 p-5 rounded-2xl">
                  <div className="text-right">
                    <span
                      className="px-3 py-1 text-sm text-white rounded-full"
                      style={{ background: color }}
                    >
                      {text}
                    </span>
                  </div>
                  <h3 className="text-lg text-white font-bold">
                    🎯 {item.title}
                  </h3>
                  {
                    item.topics.length > 0 &&
                    <>
                  <p className="text-gray-300">Ahsan Labs sizga:</p>
                  <ul className="text-gray-300 text-sm">
                    {item.topics.map((desc, i) => (
                      <div key={i} className="line-clamp-2">
                        <li className="list-disc ml-3">
                          {desc}
                        </li>
                      </div>
                    ))}
                  </ul>
                    </>
                  }
                  <button
                    onClick={() => openModal(item.url, item.roadmap_id)}
                    className="mt-3 bg-white font-bold px-4 py-2 rounded-lg text-sm flex items-center max-xs:text-xs"
                  >
                    Batafsil ma'lumot olish
                  </button>
                </div>
              </VerticalTimelineElement>
            );
          })}
        </VerticalTimeline>
      ) : (
        <Loader />
      )}
      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-5 relative w-6/12 flex-col justify-between max-lg:w-10/12 max-sm:w-11/12"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <p className="text-xl">Video qo'llanma</p>
              <button className="text-xl" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            <div className="aspect-w-16 mt-6">
              <iframe
                id="video-iframe" 
                className="w-full h-96 max-sm:h-64"
                src={selectedVideo} 
                title="YouTube video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
)}