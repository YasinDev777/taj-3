import React from 'react'
import { BiX } from "react-icons/bi";
import { Link } from 'react-router-dom'

const Popav = ({ isAlert, setIsAlert, isVideo, setIsVideo }) => {
    return (
        <div className='popav' style={isAlert === true || isVideo === true ? { display: "flex" } : { display: "none" }}>
            <div className="alert" style={isVideo === true ? { display: "none" } : { display: "flex" }}>
                <h3>
                    Yana bir qadam ⚡<br />
                    Analizlarni ko’rish uchun ro’yxatdan o’ting!
                </h3>
                <p>
                    Pastdagi tugmani bosing va telegram orqali admin bilan bog’laning!
                </p>
                <div className="btn-div">
                    <button onClick={() => setIsAlert(!isAlert)}>Chiqish</button>
                    <button onClick={() => setIsAlert(!isAlert)}>Bog'lanish</button>
                </div>
            </div>
            <div className="video-alert" style={isVideo === true ? { display: "flex" } : { display: "none" }}>
                <div className="textss">
                    <p>Video qo’llanma 😎</p>
                    <BiX onClick={()=> setIsVideo(!isVideo)} />
                </div>
                <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/Mo9KIpPOeqg"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                </iframe>

            </div>
        </div>
    )
}

export default Popav