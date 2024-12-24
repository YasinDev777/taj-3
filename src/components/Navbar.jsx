
import {useEffect} from 'react'
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom"
import { PiHeadsetBold } from "react-icons/pi"
import { RxVideo } from "react-icons/rx"
import { FiArrowRightCircle } from "react-icons/fi"
const Navbar = ({
  setSelectedPreset,
  setSelectedTicker,
  selectedPreset,
  selectedTicker,
  isGrid,
  setIsGrid,
  selectedTime,
  setSelectedTime,
  isVideo,
  setIsVideo,
  setIsAlert,
  isUser,
  isLogined,
  alertShown,
  setAlertShown,
  setIsLogined
}) => {

  useEffect(()=>{

    const fetchs = async () => {
      try{
        const screeningTypes = collection(db,"screening_type")
        const screeningTypesGet = await getDocs(screeningTypes)
  
  
        const screeningTypesValue = collection(db , "screening_type_value")
        const screeningTypesValueGet = await getDocs(screeningTypesValue)
  
  
        screeningTypesGet.forEach((docs)=> {
           const data = docs.data()
           console.log(data);
           
        })
      }

      catch(error){
        console.log(error);
      }
    }

    fetchs()
  },[])


  return (
    <>
      <div className="nav">
         <div className="logo-name">
           <Link to="">AHSAN LABS</Link>
         </div>
         <div className="options">
          <button
            className="video-btn"
            onClick={() => setIsVideo(!isVideo)}
            style={isVideo === true ? { display: "none" } : { display: "flex" }}
          >
            <RxVideo /> Foydalanish videosi
          </button>
          <Link to="https://t.me/ahsanlabs_admin" target="blank">
            <PiHeadsetBold />
          </Link>
          {
            isLogined === false ?
              <Link to="/login" onClick={() => setIsVideo(false)}>
                <button onClick={() => setIsAlert(false)}>
                  Kirish <FiArrowRightCircle />
                </button>
              </Link>
              :
              <h3>{isUser}</h3>
          }
        </div>
      </div>
    </>
  )
}

export default Navbar