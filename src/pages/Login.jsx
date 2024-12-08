import React from 'react';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Scrollbar } from 'swiper/modules';
// import 'swiper/swiper-bundle.min.css';

const Login = () => {
    return (
        <div className='login'>
            <div className="container">
                <div className="left">
                    <div className="exit-nav">
                        <BsArrowLeftCircle />
                    </div>
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay, Scrollbar]}
                        spaceBetween={30}
                        slidesPerView={3}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 3000 }}
                        scrollbar={{ draggable: true }}
                        loop
                    >
                        <SwiperSlide>
                            <img src="/image/chart1.png" alt="Slide 1" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/image/chart2.png" alt="Slide 2" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/image/chart3.png" alt="Slide 3" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img src="/image/chart4.png" alt="Slide 4" />
                        </SwiperSlide>
                    </Swiper>
                </div>
                <div className="right"></div>
            </div>
        </div>
    );
};

export default Login;