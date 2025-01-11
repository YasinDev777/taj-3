import React from 'react'
import { Link } from "react-router-dom"
import { PiHeadsetBold } from "react-icons/pi"
import { RxVideo } from "react-icons/rx"
import { FiArrowRightCircle } from "react-icons/fi"
const Navbar = ({
  isVideo,
  setIsVideo,
  setIsAlert,
  isUser,
  isLogedIn,
}) => {

  return (
    <>
      <div className="nav">
         <div className="logo-name">
           <Link to="/">AHSAN LABS</Link>
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
            isLogedIn === false ?
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