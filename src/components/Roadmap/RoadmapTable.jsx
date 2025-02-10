import { useState } from "react";
import { FaUser, FaBars, FaArrowLeft, FaCheckCircle, FaClock, FaWrench, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import { PiEyesBold } from "react-icons/pi";
const columns = [
  { title: "Ko'rib chiqilmoqda", color: "red", icon: "👀" },
  { title: "Rejalashtirilgan", color: "green", icon: "✅" },
  { title: "Jarayonda", color: "blue", icon: "🕑" },
  { title: "Ishlab chiqarilgan", color: "orange", icon: "💯" },
];

const tasks = [
  { id: 1, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
  { id: 2, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
  { id: 3, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
  { id: 4, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
  { id: 1, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
  { id: 2, title: "Bildirishnomalar qo'shish", status: "Rejalashtirilgan" },
  { id: 2, title: "Bildirishnomalar qo'shish", status: "Rejalashtirilgan" },
  { id: 2, title: "Bildirishnomalar qo'shish", status: "Rejalashtirilgan" },
  { id: 2, title: "Bildirishnomalar qo'shish", status: "Rejalashtirilgan" },
  { id: 3, title: "Bildirishnomalar qo'shish", status: "Jarayonda" },
  { id: 3, title: "Bildirishnomalar qo'shish", status: "Jarayonda" },
  { id: 3, title: "Bildirishnomalar qo'shish", status: "Jarayonda" },
  { id: 4, title: "Bildirishnomalar qo'shish", status: "Ishlab chiqarilgan" },
  { id: 4, title: "Bildirishnomalar qo'shish", status: "Ishlab chiqarilgan" },
  { id: 4, title: "Bildirishnomalar qo'shish", status: "Ishlab chiqarilgan" },
  { id: 5, title: "Bildirishnomalar qo'shish", status: "Ko'rib chiqilmoqda" },
];

export default function RoadMap() {
  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold relative inline-block after:content-[''] after:block after:w-25 after:h-1 after:bg-gray-800 after:rounded-full after:mt-1">Jadval</h1>
      </div>
      <p className="text-center text-gray-600 mb-6">
        Ahsan Labs jadvali – bu innovatsion g'oyalar, samarali vositalar va <br />
        foydalanuvchilarga qulay xizmatlarni yaratishga qaratilgan muhim bosqichlarni <br /> aks ettiradi.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border">
        {columns.map((column) => (
          <div key={column.title} className="bg-white p-4 rounded-lg shadow-md ">
            <h2 className={`text-lg font-semibold flex items-center space-x-2 `}>
              {column.icon} <span>{column.title}</span>
            </h2>

            <h2 className={`text-lg font-semibold flex items-center space-x-2 relative pb-2 after:content-[''] after:block after:w-full after:h-[2px] after:bg-${column.color}-500 after:mt-2`}></h2>
            <div className="mt-4 space-y-4 md:overflow-hidden md:max-h-max  overflow-y-auto max-h-[400px]">
              {tasks
                .filter((task) => task.status === column.title)
                .map((task,id) => (
                  <div key={id} className="border transition duration-300 ease-in-out p-3 rounded-lg shadow-sm hover:shadow-2xl">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{task.title}</h3>
                      <h5>#{id+1}</h5>
                    </div>
                    <p className="text-sm text-gray-500">Enabled to listen an audible beep when a barcode is scanned.</p>
                    <div className={task.status=="Ko'rib chiqilmoqda"?`flex justify-end`:`hidden `}>
                    <div></div>
                    <button className="mt-2 text-sm bg-red-500 text-white px-3 py-1 rounded-md text-end">Tugatish</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
