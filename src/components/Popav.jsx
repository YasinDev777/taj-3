import React from 'react'
import { Link } from 'react-router-dom'

const Popav = ({ isAlert, setIsAlert }) => {
  return (
    <div className='popav' style={isAlert === true ? {display: "flex"} : {display: "none"}}>
        <div className="alert">
            <h3>
                Yana bir qadam ⚡<br />
                Analizlarni ko’rish uchun ro’yxatdan o’ting!
            </h3>
            <p>
                Pastdagi tugmani bosing va telegram orqali admin bilan bog’laning!
            </p>
            <div className="btn-div">
                <button onClick={()=> setIsAlert(!isAlert)}>Chiqish</button>
                <Link to={"/login"}><button onClick={()=> setIsAlert(!isAlert)}>Bog'lanish</button></Link>
            </div>
        </div>
    </div>
  )
}

export default Popav